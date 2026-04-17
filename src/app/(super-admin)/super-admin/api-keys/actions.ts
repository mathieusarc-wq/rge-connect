"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { invalidateServiceKeyCache } from "@/lib/services/get-service-key";
import { logAudit } from "@/lib/security/audit";

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
  return { user, supabase };
}

export async function saveServiceKey(
  service: string,
  keyName: string,
  value: string,
  isSensitive = true,
  description?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await requireSuperAdmin();
    const admin = createServiceRoleClient();

    // Upsert
    const { error } = await admin.from("service_credentials").upsert(
      {
        service,
        key_name: keyName,
        value: value.trim() || null,
        is_sensitive: isSensitive,
        description: description ?? null,
        updated_by: user.id,
      },
      { onConflict: "service,key_name" }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    // Invalide le cache in-memory
    invalidateServiceKeyCache(service, keyName);

    // Audit log (sans la valeur)
    await logAudit({
      action: "update",
      actorId: user.id,
      targetTable: "service_credentials",
      metadata: {
        service,
        key_name: keyName,
        has_value: value.trim().length > 0,
      },
    });

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Erreur inattendue",
    };
  }
}

export async function getAllServiceKeys(): Promise<
  Array<{
    service: string;
    key_name: string;
    value: string | null;
    updated_at: string;
  }>
> {
  await requireSuperAdmin();
  const admin = createServiceRoleClient();
  const { data } = await admin
    .from("service_credentials")
    .select("service, key_name, value, updated_at");
  return (data ?? []) as Array<{
    service: string;
    key_name: string;
    value: string | null;
    updated_at: string;
  }>;
}
