import { createServiceRoleClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/lib/supabase/types";

type AuditLogInsert = Database["public"]["Tables"]["audit_logs"]["Insert"];

/**
 * Helper pour logger les événements sensibles dans la table `audit_logs`.
 *
 * Utilise le client service_role pour insérer (bypass RLS, l'audit doit
 * toujours réussir même si le user n'a pas les droits).
 *
 * USAGE :
 *   await logAudit({
 *     action: "mission_published",
 *     actorId: user.id,
 *     targetTable: "missions",
 *     targetId: mission.id,
 *     installerId: mission.installer_id,
 *     metadata: { reference: mission.reference },
 *   });
 */

export type AuditAction =
  | "insert"
  | "update"
  | "delete"
  | "login_success"
  | "login_failure"
  | "password_change"
  | "password_reset"
  | "api_key_created"
  | "api_key_revoked"
  | "document_uploaded"
  | "document_validated"
  | "document_rejected"
  | "mission_published"
  | "mission_assigned"
  | "mission_cancelled"
  | "payment_initiated"
  | "payment_executed"
  | "payment_failed"
  | "webhook_delivered"
  | "webhook_failed"
  | "rate_limit_triggered"
  | "unauthorized_access";

export interface AuditLogInput {
  action: AuditAction;
  actorId?: string;
  targetTable?: string;
  targetId?: string;
  installerId?: string;
  subcontractorId?: string;
  metadata?: Json;
  oldValues?: Json;
  newValues?: Json;
  success?: boolean;
  errorMessage?: string;
  request?: Request; // pour extraire IP + User-Agent automatiquement
}

export async function logAudit(input: AuditLogInput): Promise<void> {
  const supabase = createServiceRoleClient();

  let actorIp: string | null = null;
  let actorUserAgent: string | null = null;

  if (input.request) {
    const forwarded = input.request.headers.get("x-forwarded-for");
    actorIp = forwarded ? forwarded.split(",")[0].trim() : null;
    actorUserAgent = input.request.headers.get("user-agent");
  }

  const payload: AuditLogInsert = {
    actor_id: input.actorId ?? null,
    actor_ip: actorIp,
    actor_user_agent: actorUserAgent,
    action: input.action,
    target_table: input.targetTable ?? null,
    target_id: input.targetId ?? null,
    installer_id: input.installerId ?? null,
    subcontractor_id: input.subcontractorId ?? null,
    metadata: input.metadata ?? null,
    old_values: input.oldValues ?? null,
    new_values: input.newValues ?? null,
    success: input.success ?? true,
    error_message: input.errorMessage ?? null,
  };

  const { error } = await supabase.from("audit_logs").insert(payload);

  if (error) {
    // On loggue mais on ne throw pas — l'audit ne doit jamais bloquer
    // le flow métier. On monitore les erreurs via Vercel logs.
    console.error("[audit] Failed to log event:", error.message, {
      action: input.action,
    });
  }
}

/**
 * Helper pour logger une tentative d'accès non autorisée (403, rate limit, etc.)
 * depuis un middleware / route handler.
 */
export async function logUnauthorizedAccess(
  request: Request,
  reason: string,
  actorId?: string
): Promise<void> {
  await logAudit({
    action: "unauthorized_access",
    actorId,
    success: false,
    errorMessage: reason,
    metadata: {
      url: new URL(request.url).pathname,
      method: request.method,
    },
    request,
  });
}
