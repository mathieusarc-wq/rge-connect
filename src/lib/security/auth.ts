import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { UserRole } from "@/lib/supabase/types-helpers";

/**
 * Récupère le user courant (peut être null).
 * À utiliser dans les Server Components.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Récupère le user courant + son profile (role, installer_id, subcontractor_id).
 */
export async function getCurrentUserWithProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return null;

  return { user, profile };
}

/**
 * Garde Server Component / Server Action : redirige vers /login si non connecté.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Garde avec vérification du rôle. Redirige vers /login ou /403 si besoin.
 */
export async function requireRole(allowedRoles: UserRole[]) {
  const ctx = await getCurrentUserWithProfile();
  if (!ctx) {
    redirect("/login");
  }
  if (!allowedRoles.includes(ctx.profile.role)) {
    redirect("/403");
  }
  return ctx;
}

/**
 * Garde super admin uniquement.
 */
export async function requireSuperAdmin() {
  const ctx = await getCurrentUserWithProfile();
  if (!ctx) redirect("/login");
  if (!ctx.profile.is_super_admin) redirect("/403");
  return ctx;
}

/**
 * Pour les Route Handlers : retourne une Response 401 au lieu de redirect.
 */
export async function getApiUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}
