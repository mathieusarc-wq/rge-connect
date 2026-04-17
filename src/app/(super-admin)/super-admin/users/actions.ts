"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/security/audit";
import { revalidatePath } from "next/cache";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("not_authenticated");
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_super_admin) throw new Error("forbidden");
  return { user };
}

type ActionResult = { success: boolean; error?: string };

export async function toggleSuperAdmin(
  userId: string,
  value: boolean
): Promise<ActionResult> {
  try {
    const { user: admin } = await requireSuperAdmin();
    const service = createServiceRoleClient();
    const { error } = await service
      .from("profiles")
      .update({ is_super_admin: value })
      .eq("id", userId);
    if (error) return { success: false, error: error.message };

    await logAudit({
      action: "update",
      actorId: admin.id,
      targetTable: "profiles",
      targetId: userId,
      metadata: { field: "is_super_admin", new_value: value },
    });

    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}

export async function resetUserPassword(userId: string): Promise<ActionResult> {
  try {
    const { user: admin } = await requireSuperAdmin();
    const service = createServiceRoleClient();

    // Récupère l'email du user
    const { data: profile } = await service
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!profile) return { success: false, error: "User introuvable" };

    // Envoie un email de reset via Supabase Auth
    const { error } = await service.auth.admin.generateLink({
      type: "recovery",
      email: profile.email,
    });

    if (error) return { success: false, error: error.message };

    await logAudit({
      action: "password_reset",
      actorId: admin.id,
      targetTable: "auth.users",
      targetId: userId,
      metadata: { initiated_by_admin: true, email: profile.email },
    });

    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}

export async function deleteUser(userId: string): Promise<ActionResult> {
  try {
    const { user: admin } = await requireSuperAdmin();

    if (admin.id === userId) {
      return {
        success: false,
        error: "Tu ne peux pas supprimer ton propre compte.",
      };
    }

    const service = createServiceRoleClient();

    // Récupère le profile pour log
    const { data: profile } = await service
      .from("profiles")
      .select("email, role, subcontractor_id, installer_id")
      .eq("id", userId)
      .single();

    // Supprime l'entité liée (subcontractor ou installer)
    if (profile?.subcontractor_id) {
      await service
        .from("subcontractors")
        .delete()
        .eq("id", profile.subcontractor_id);
    }
    if (profile?.installer_id) {
      await service.from("installers").delete().eq("id", profile.installer_id);
    }

    // Supprime le user auth (cascade sur profiles via FK)
    const { error } = await service.auth.admin.deleteUser(userId);
    if (error) return { success: false, error: error.message };

    await logAudit({
      action: "delete",
      actorId: admin.id,
      targetTable: "auth.users",
      targetId: userId,
      metadata: {
        deleted_email: profile?.email,
        deleted_role: profile?.role,
      },
    });

    revalidatePath("/super-admin/users");
    return { success: true };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}

export async function impersonateUser(userId: string): Promise<ActionResult & { link?: string }> {
  try {
    await requireSuperAdmin();
    const service = createServiceRoleClient();

    const { data: profile } = await service
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (!profile) return { success: false, error: "User introuvable" };

    const { data, error } = await service.auth.admin.generateLink({
      type: "magiclink",
      email: profile.email,
    });

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      link: data.properties.action_link,
    };
  } catch (e) {
    return {
      success: false,
      error: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}
