"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import {
  subcontractorRegisterSchema,
  installerRegisterSchema,
} from "@/lib/schemas/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";
import { headers } from "next/headers";

export type SignUpResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: "validation" | "duplicate_email" | "duplicate_siret" | "rate_limited" | "server_error";
    };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://rge-connect.vercel.app";

/**
 * Inscription sous-traitant.
 * Crée : auth.users → subcontractors → profiles
 */
export async function signUpSubcontractorAction(raw: unknown): Promise<SignUpResult> {
  const parsed = subcontractorRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      code: "validation",
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  // Rate limit IP (anti-spam inscription)
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`signup:${ip}`, RATE_LIMITS.auth);
  if (!limit.success) {
    return {
      success: false,
      code: "rate_limited",
      error: `Trop de tentatives. Réessaie dans ${Math.ceil(limit.retryAfter / 60)} min.`,
    };
  }

  const data = parsed.data;

  // 1. Vérifier unicité SIRET (avant création auth.users pour éviter orphan)
  const serviceClient = createServiceRoleClient();
  const { data: existing } = await serviceClient
    .from("subcontractors")
    .select("id")
    .eq("siret", data.siret)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      code: "duplicate_siret",
      error: "Un sous-traitant avec ce SIRET est déjà inscrit.",
    };
  }

  // 2. Créer auth.users avec email de confirmation
  const authClient = await createClient();
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${APP_URL}/activate`,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: "subcontractor",
      },
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return {
        success: false,
        code: "duplicate_email",
        error: "Un compte existe déjà avec cet email.",
      };
    }
    await logAudit({
      action: "login_failure",
      metadata: { step: "signup_subcontractor", reason: authError.message },
      success: false,
      errorMessage: authError.message,
    });
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de la création du compte. Réessaie.",
    };
  }

  if (!authData.user) {
    return {
      success: false,
      code: "server_error",
      error: "Erreur inattendue. Réessaie.",
    };
  }

  // 3. Créer l'entité subcontractor
  const { data: subData, error: subError } = await serviceClient
    .from("subcontractors")
    .insert({
      name: data.company_name,
      siret: data.siret,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      email: data.email,
      phone: data.phone,
      qualifications: data.qualifications,
      plan: "standard",
    })
    .select("id")
    .single();

  if (subError || !subData) {
    // Rollback : supprimer auth.users
    await serviceClient.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de l'enregistrement de l'entreprise. Réessaie.",
    };
  }

  // 4. Créer le profile
  const { error: profileError } = await serviceClient.from("profiles").insert({
    id: authData.user.id,
    role: "subcontractor",
    subcontractor_id: subData.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
  });

  if (profileError) {
    // Rollback : supprimer auth.users + subcontractor
    await serviceClient.from("subcontractors").delete().eq("id", subData.id);
    await serviceClient.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de la création du profil. Réessaie.",
    };
  }

  // 5. Audit log
  await logAudit({
    action: "insert",
    actorId: authData.user.id,
    targetTable: "subcontractors",
    targetId: subData.id,
    subcontractorId: subData.id,
    metadata: {
      event: "subcontractor_signup",
      company_name: data.company_name,
      siret: data.siret,
      qualifications: data.qualifications,
    },
  });

  return { success: true };
}

/**
 * Inscription installateur.
 * Crée : auth.users → installers → profiles
 */
export async function signUpInstallerAction(raw: unknown): Promise<SignUpResult> {
  const parsed = installerRegisterSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      code: "validation",
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`signup:${ip}`, RATE_LIMITS.auth);
  if (!limit.success) {
    return {
      success: false,
      code: "rate_limited",
      error: `Trop de tentatives. Réessaie dans ${Math.ceil(limit.retryAfter / 60)} min.`,
    };
  }

  const data = parsed.data;

  const serviceClient = createServiceRoleClient();
  const { data: existing } = await serviceClient
    .from("installers")
    .select("id")
    .eq("siret", data.siret)
    .maybeSingle();

  if (existing) {
    return {
      success: false,
      code: "duplicate_siret",
      error: "Un installateur avec ce SIRET est déjà inscrit.",
    };
  }

  const authClient = await createClient();
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${APP_URL}/activate`,
      data: {
        first_name: data.first_name,
        last_name: data.last_name,
        role: "installer",
      },
    },
  });

  if (authError) {
    if (authError.message.includes("already registered")) {
      return {
        success: false,
        code: "duplicate_email",
        error: "Un compte existe déjà avec cet email.",
      };
    }
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de la création du compte. Réessaie.",
    };
  }

  if (!authData.user) {
    return {
      success: false,
      code: "server_error",
      error: "Erreur inattendue. Réessaie.",
    };
  }

  const { data: instData, error: instError } = await serviceClient
    .from("installers")
    .insert({
      name: data.company_name,
      siret: data.siret,
      address: data.address,
      city: data.city,
      postal_code: data.postal_code,
      email: data.email,
      phone: data.phone,
      plan: "discovery",
    })
    .select("id")
    .single();

  if (instError || !instData) {
    await serviceClient.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de l'enregistrement de l'entreprise. Réessaie.",
    };
  }

  const { error: profileError } = await serviceClient.from("profiles").insert({
    id: authData.user.id,
    role: "installer",
    installer_id: instData.id,
    first_name: data.first_name,
    last_name: data.last_name,
    email: data.email,
  });

  if (profileError) {
    await serviceClient.from("installers").delete().eq("id", instData.id);
    await serviceClient.auth.admin.deleteUser(authData.user.id);
    return {
      success: false,
      code: "server_error",
      error: "Erreur lors de la création du profil. Réessaie.",
    };
  }

  await logAudit({
    action: "insert",
    actorId: authData.user.id,
    targetTable: "installers",
    targetId: instData.id,
    installerId: instData.id,
    metadata: {
      event: "installer_signup",
      company_name: data.company_name,
      siret: data.siret,
      plan: "discovery",
    },
  });

  return { success: true };
}
