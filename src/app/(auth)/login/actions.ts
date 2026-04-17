"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "@/lib/schemas/auth";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type LoginErrorCode =
  | "invalid_credentials"
  | "email_not_confirmed"
  | "rate_limited"
  | "validation"
  | "server_error";

export type LoginActionResult =
  | { success: true }
  | { success: false; error: string; code: LoginErrorCode };

export async function signInAction(formData: FormData): Promise<LoginActionResult> {
  // 1. Parse + validate
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      code: "validation",
      error: parsed.error.issues[0]?.message ?? "Données invalides",
    };
  }

  // 2. Rate limit par IP (anti brute-force)
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`signin:${ip}`, RATE_LIMITS.auth);
  if (!limit.success) {
    await logAudit({
      action: "rate_limit_triggered",
      metadata: { endpoint: "signin" },
      success: false,
      errorMessage: `IP ${ip}`,
    });
    return {
      success: false,
      code: "rate_limited",
      error: `Trop de tentatives. Réessaie dans ${Math.ceil(limit.retryAfter / 60)} min.`,
    };
  }

  // 3. Supabase Auth
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Codes d'erreur Supabase Auth
    let code: LoginErrorCode = "server_error";
    let message = "Une erreur est survenue. Réessaie.";

    if (error.code === "invalid_credentials" || error.message.includes("Invalid login credentials")) {
      code = "invalid_credentials";
      message = "Email ou mot de passe incorrect.";
    } else if (error.code === "email_not_confirmed" || error.message.includes("Email not confirmed")) {
      code = "email_not_confirmed";
      message = "Active ton compte via le lien reçu par email avant de te connecter.";
    }

    await logAudit({
      action: "login_failure",
      metadata: { email: parsed.data.email, reason: error.code ?? error.message },
      success: false,
      errorMessage: error.message,
    });

    return { success: false, code, error: message };
  }

  // 4. Succès → audit + redirect selon rôle
  await logAudit({
    action: "login_success",
    actorId: data.user.id,
    metadata: { email: parsed.data.email },
    success: true,
  });

  // Récupère le rôle pour rediriger au bon dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const target = profile?.role === "installer" ? "/installer/dashboard" : "/dashboard";
  redirect(target);
}
