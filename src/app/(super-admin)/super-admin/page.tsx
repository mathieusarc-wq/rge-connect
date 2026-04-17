import Link from "next/link";
import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  Users,
  Store,
  Building2,
  ClipboardList,
  Euro,
  Shield,
  ScrollText,
  Key,
  Database,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
} from "lucide-react";

export const metadata = {
  title: "Vue d'ensemble — Super Admin — RGE Connect",
};

export default async function SuperAdminHomePage() {
  const admin = createServiceRoleClient();

  // KPIs parallèles
  const [
    { count: totalUsers },
    { count: totalSubs },
    { count: totalInstallers },
    { count: totalAdmins },
    { count: totalMissions },
    { count: missionsActive },
    { count: missionsCompleted },
    { count: totalPayments },
    { count: webhooksFailedCount },
    { count: docsPendingCount },
    { data: recentSignups },
    { data: recentAudit },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "subcontractor"),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "installer"),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_super_admin", true),
    admin.from("missions").select("*", { count: "exact", head: true }),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .in("status", ["published", "assigned", "scheduled", "in_progress"]),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    admin.from("payments").select("*", { count: "exact", head: true }),
    admin
      .from("outbound_webhooks")
      .select("*", { count: "exact", head: true })
      .eq("delivered", false),
    admin
      .from("subcontractor_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("profiles")
      .select("id, email, role, first_name, last_name, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("audit_logs")
      .select("id, action, actor_id, success, metadata, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats: Array<{
    label: string;
    value: string;
    sub: string;
    icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    color: "forest" | "gold" | "blue" | "red";
    href?: string;
  }> = [
    {
      label: "Utilisateurs totaux",
      value: String(totalUsers ?? 0),
      sub: `${totalSubs ?? 0} sous-traitants · ${totalInstallers ?? 0} installateurs`,
      icon: Users,
      color: "forest",
      href: "/super-admin/users",
    },
    {
      label: "Missions",
      value: String(totalMissions ?? 0),
      sub: `${missionsActive ?? 0} actives · ${missionsCompleted ?? 0} terminées`,
      icon: ClipboardList,
      color: "gold",
    },
    {
      label: "Paiements enregistrés",
      value: String(totalPayments ?? 0),
      sub: "Toutes transactions séquestre",
      icon: Euro,
      color: "forest",
    },
    {
      label: "Super admins",
      value: String(totalAdmins ?? 0),
      sub: "Accès console super admin",
      icon: Shield,
      color: "blue",
    },
  ];

  const alerts: Array<{
    count: number;
    label: string;
    href: string;
    severity: "warn" | "info" | "critical";
  }> = [];
  if ((webhooksFailedCount ?? 0) > 0) {
    alerts.push({
      count: webhooksFailedCount ?? 0,
      label: "webhooks sortants en échec",
      href: "/super-admin/data?filter=webhooks",
      severity: "critical",
    });
  }
  if ((docsPendingCount ?? 0) > 0) {
    alerts.push({
      count: docsPendingCount ?? 0,
      label: "documents en attente de validation",
      href: "/super-admin/users?docs=pending",
      severity: "warn",
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-gold-700">
            Super Admin · Vue d&apos;ensemble
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
          RGE Connect — Pilotage plateforme
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500">
          Tous les KPIs temps réel et les actions admin prioritaires.
        </p>
      </div>

      {/* Alertes (si existantes) */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center justify-between rounded-lg border px-4 py-3 transition-colors ${
                a.severity === "critical"
                  ? "border-red-200 bg-red-50 hover:bg-red-100"
                  : "border-gold-300/40 bg-gold-500/5 hover:bg-gold-500/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <AlertCircle
                  className={`h-4 w-4 ${a.severity === "critical" ? "text-red-500" : "text-gold-600"}`}
                  strokeWidth={2}
                />
                <span className="text-sm font-body text-ink-900">
                  <strong>{a.count}</strong> {a.label}
                </span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-ink-400" />
            </Link>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const content = (
            <>
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    stat.color === "forest"
                      ? "bg-forest-50"
                      : stat.color === "gold"
                      ? "bg-gold-500/10"
                      : stat.color === "red"
                      ? "bg-red-50"
                      : "bg-blue-50"
                  }`}
                >
                  <stat.icon
                    className={`h-4.5 w-4.5 ${
                      stat.color === "forest"
                        ? "text-forest-500"
                        : stat.color === "gold"
                        ? "text-gold-600"
                        : stat.color === "red"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                    strokeWidth={1.8}
                  />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-ink-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-sm font-body font-medium text-ink-700 mt-1">
                {stat.label}
              </p>
              <p className="text-xs font-body text-ink-500 mt-1">{stat.sub}</p>
            </>
          );
          const className =
            "rounded-xl border border-forest-100 bg-white p-5 shadow-sm";
          if (stat.href) {
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`${className} hover:border-forest-200 hover:shadow-md transition-all`}
              >
                {content}
              </Link>
            );
          }
          return (
            <div key={stat.label} className={className}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Grid : derniers users + derniers logs */}
      <div className="grid xl:grid-cols-2 gap-6 mb-8">
        {/* Derniers users */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
            <div>
              <h2 className="text-sm font-display font-bold text-ink-900">
                Dernières inscriptions
              </h2>
              <p className="text-xs font-body text-ink-500 mt-0.5">
                5 plus récentes
              </p>
            </div>
            <Link
              href="/super-admin/users"
              className="inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 hover:text-forest-700"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-forest-100/50">
            {(recentSignups ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm font-body text-ink-400 text-center">
                Aucune inscription pour le moment.
              </p>
            ) : (
              (recentSignups ?? []).map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      u.role === "installer"
                        ? "bg-gold-500/20 text-gold-700"
                        : u.role === "subcontractor"
                        ? "bg-forest-50 text-forest-600"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {u.role === "installer" ? (
                      <Building2 className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : u.role === "subcontractor" ? (
                      <Store className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <Shield className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-ink-900 truncate">
                      {u.first_name || ""} {u.last_name || ""}
                      {!u.first_name && !u.last_name && u.email}
                    </p>
                    <p className="text-xs font-body text-ink-500 truncate">{u.email}</p>
                  </div>
                  <span className="text-xs font-mono text-ink-400 flex-shrink-0">
                    {formatRelative(u.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Derniers audit logs */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
            <div>
              <h2 className="text-sm font-display font-bold text-ink-900">
                Activité récente
              </h2>
              <p className="text-xs font-body text-ink-500 mt-0.5">Audit trail</p>
            </div>
            <Link
              href="/super-admin/audit"
              className="inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 hover:text-forest-700"
            >
              Voir tout <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-forest-100/50">
            {(recentAudit ?? []).length === 0 ? (
              <p className="px-5 py-8 text-sm font-body text-ink-400 text-center">
                Aucune activité pour le moment.
              </p>
            ) : (
              (recentAudit ?? []).map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-5 py-3">
                  <div
                    className={`h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                      log.success
                        ? "bg-forest-50 text-forest-500"
                        : "bg-red-50 text-red-500"
                    }`}
                  >
                    {log.success ? (
                      <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body text-ink-900">
                      <code className="font-mono text-xs bg-cream-100 px-1.5 py-0.5 rounded text-forest-600">
                        {log.action}
                      </code>
                    </p>
                  </div>
                  <span className="text-xs font-mono text-ink-400 flex-shrink-0">
                    {formatRelative(log.created_at)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Raccourcis */}
      <div>
        <h2 className="text-sm font-display font-bold text-ink-900 mb-3">
          Actions rapides
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <ShortcutCard
            href="/super-admin/users"
            icon={Users}
            title="Gérer les utilisateurs"
            description="Suspendre, promouvoir admin, reset password"
          />
          <ShortcutCard
            href="/super-admin/api-keys"
            icon={Key}
            title="Configurer les clés API"
            description="Anthropic, Brevo, Mangopay, Yousign…"
          />
          <ShortcutCard
            href="/super-admin/data"
            icon={Database}
            title="Analytics plateforme"
            description="Inscriptions, missions, CA, croissance"
          />
          <ShortcutCard
            href="/super-admin/audit"
            icon={ScrollText}
            title="Audit de sécurité"
            description="Connexions, paiements, incidents"
          />
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-xl border border-forest-100 bg-white p-4 hover:border-forest-200 hover:shadow-md transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-forest-500" strokeWidth={1.8} />
        <p className="text-sm font-body font-semibold text-ink-900">{title}</p>
      </div>
      <p className="text-xs font-body text-ink-500">{description}</p>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 group-hover:text-forest-700">
        Ouvrir <ArrowRight className="h-3 w-3" />
      </div>
    </Link>
  );
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const diffMs = Date.now() - d.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "à l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h}h`;
  const days = Math.floor(h / 24);
  if (days < 30) return `il y a ${days}j`;
  return d.toLocaleDateString("fr-FR");
}
