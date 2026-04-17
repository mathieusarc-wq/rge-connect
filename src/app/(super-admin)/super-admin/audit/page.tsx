import { createServiceRoleClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Database } from "@/lib/supabase/types";

type AuditAction = Database["public"]["Enums"]["audit_action"];
import {
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  LogIn,
  LogOut,
  Upload,
  CreditCard,
  Webhook,
  ShieldX,
} from "lucide-react";

export const metadata = {
  title: "Audit — Super Admin — RGE Connect",
};

interface PageProps {
  searchParams: Promise<{
    action?: string;
    success?: string;
    limit?: string;
  }>;
}

export default async function AuditPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const admin = createServiceRoleClient();

  const limit = Math.min(parseInt(params.limit ?? "100") || 100, 500);

  let query = admin
    .from("audit_logs")
    .select(
      "id, action, actor_id, actor_ip, actor_user_agent, target_table, target_id, installer_id, subcontractor_id, metadata, success, error_message, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (params.action) query = query.eq("action", params.action as AuditAction);
  if (params.success === "0") query = query.eq("success", false);
  if (params.success === "1") query = query.eq("success", true);

  const { data: logs } = await query;

  // Enrichir avec les infos actors
  const actorIds = Array.from(
    new Set((logs ?? []).map((l) => l.actor_id).filter(Boolean))
  ) as string[];

  const { data: actors } = actorIds.length > 0
    ? await admin
        .from("profiles")
        .select("id, email, first_name, last_name, role")
        .in("id", actorIds)
    : { data: [] as Array<{ id: string; email: string; first_name: string | null; last_name: string | null; role: string }> };

  const actorMap = new Map((actors ?? []).map((a) => [a.id, a]));

  // Stats rapides
  const totalCount = logs?.length ?? 0;
  const failedCount = (logs ?? []).filter((l) => !l.success).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-gold-700">
            Super Admin · Audit
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
          Journal d&apos;audit
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500">
          {totalCount} événements · {failedCount} en échec · append-only, conservés 1 an (LCEN art. 6-II).
        </p>
      </div>

      {/* Filtres rapides */}
      <div className="rounded-xl border border-forest-100 bg-white p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <FilterChip label="Tous" href="/super-admin/audit" active={!params.action && !params.success} />
          <FilterChip label="Échecs uniquement" href="/super-admin/audit?success=0" active={params.success === "0"} />
          <FilterChip
            label="Login réussi"
            href="/super-admin/audit?action=login_success"
            active={params.action === "login_success"}
          />
          <FilterChip
            label="Login échec"
            href="/super-admin/audit?action=login_failure"
            active={params.action === "login_failure"}
          />
          <FilterChip
            label="Rate limit"
            href="/super-admin/audit?action=rate_limit_triggered"
            active={params.action === "rate_limit_triggered"}
          />
          <FilterChip
            label="Documents"
            href="/super-admin/audit?action=document_uploaded"
            active={params.action === "document_uploaded"}
          />
          <FilterChip
            label="Webhooks"
            href="/super-admin/audit?action=webhook_failed"
            active={params.action === "webhook_failed"}
          />
          <FilterChip
            label="Accès non autorisé"
            href="/super-admin/audit?action=unauthorized_access"
            active={params.action === "unauthorized_access"}
          />
        </div>
      </div>

      {/* Liste */}
      <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
        {(logs ?? []).length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-body text-ink-500">Aucun événement pour ces filtres.</p>
          </div>
        ) : (
          <div className="divide-y divide-forest-100/50">
            {(logs ?? []).map((log) => {
              const actor = log.actor_id ? actorMap.get(log.actor_id) : null;
              return <LogRow key={log.id} log={log} actor={actor} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-md px-3 py-1.5 text-xs font-body font-medium transition-colors ${
        active
          ? "bg-forest-500 text-cream-50"
          : "bg-cream-100 text-ink-600 hover:bg-cream-200"
      }`}
    >
      {label}
    </Link>
  );
}

function LogRow({
  log,
  actor,
}: {
  log: {
    id: string;
    action: string;
    actor_ip: unknown;
    actor_user_agent: string | null;
    target_table: string | null;
    metadata: unknown;
    success: boolean;
    error_message: string | null;
    created_at: string;
  };
  actor: { email: string; first_name: string | null; last_name: string | null; role: string } | null | undefined;
}) {
  const icon = getActionIcon(log.action);
  const Icon = icon.component;

  return (
    <div className="flex items-start gap-3 px-5 py-3 hover:bg-cream-50/30 transition-colors">
      {/* Icône action */}
      <div
        className={`h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
          log.success ? "bg-forest-50 text-forest-500" : "bg-red-50 text-red-500"
        }`}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.8} />
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <code className="text-xs font-mono text-forest-600 bg-forest-50 px-1.5 py-0.5 rounded">
            {log.action}
          </code>
          {!log.success && (
            <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-red-600">
              <AlertCircle className="h-2.5 w-2.5" strokeWidth={2} />
              Échec
            </span>
          )}
          {log.target_table && (
            <span className="text-xs font-mono text-ink-400">→ {log.target_table}</span>
          )}
        </div>
        <p className="text-sm font-body text-ink-700 mt-0.5">
          {actor ? (
            <>
              <strong>
                {[actor.first_name, actor.last_name].filter(Boolean).join(" ") || actor.email}
              </strong>{" "}
              <span className="text-ink-500 text-xs">({actor.role})</span>
            </>
          ) : (
            <span className="text-ink-500 italic">Système / anonyme</span>
          )}
        </p>
        {log.error_message && (
          <p className="text-xs font-body text-red-600 mt-1">{log.error_message}</p>
        )}
        {log.metadata != null && Object.keys(log.metadata as Record<string, unknown>).length > 0 && (
          <p className="text-[11px] font-mono text-ink-400 mt-1 truncate">
            {JSON.stringify(log.metadata)}
          </p>
        )}
      </div>

      {/* IP + timestamp */}
      <div className="text-right text-xs font-mono text-ink-400 flex-shrink-0 hidden sm:block">
        {log.actor_ip ? <p>{String(log.actor_ip)}</p> : null}
        <p>{new Date(log.created_at).toLocaleString("fr-FR")}</p>
      </div>
    </div>
  );
}

function getActionIcon(action: string): {
  component: React.ComponentType<{ className?: string; strokeWidth?: number }>;
} {
  if (action.startsWith("login")) return { component: LogIn };
  if (action.includes("logout")) return { component: LogOut };
  if (action.includes("document")) return { component: Upload };
  if (action.includes("payment")) return { component: CreditCard };
  if (action.includes("webhook")) return { component: Webhook };
  if (action === "unauthorized_access") return { component: ShieldX };
  if (action === "rate_limit_triggered") return { component: AlertCircle };
  return { component: CheckCircle2 };
}
