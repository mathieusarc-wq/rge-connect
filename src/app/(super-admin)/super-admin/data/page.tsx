import { createServiceRoleClient } from "@/lib/supabase/server";
import {
  Users,
  Store,
  Building2,
  ClipboardList,
  Euro,
  TrendingUp,
  Activity,
  FileText,
  ShieldCheck,
  Webhook,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export const metadata = {
  title: "Données — Super Admin — RGE Connect",
};

export default async function DataPage() {
  const admin = createServiceRoleClient();

  // Période : 30 derniers jours
  const since30d = new Date();
  since30d.setDate(since30d.getDate() - 30);
  const since30dIso = since30d.toISOString();

  const since7d = new Date();
  since7d.setDate(since7d.getDate() - 7);
  const since7dIso = since7d.toISOString();

  const [
    { count: signupsTotal },
    { count: signups30d },
    { count: signups7d },
    { count: missionsTotal },
    { count: missionsDraft },
    { count: missionsPublished },
    { count: missionsAssigned },
    { count: missionsScheduled },
    { count: missionsInProgress },
    { count: missionsCompleted },
    { count: missionsCancelled },
    { count: paymentsSuccess },
    { count: paymentsPending },
    { count: paymentsFailed },
    { count: webhooksDelivered },
    { count: webhooksFailed },
    { count: reviewsCount },
    { count: docsValid },
    { count: docsPending },
    { count: docsExpired },
    { data: avgRating },
  ] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since30dIso),
    admin
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", since7dIso),
    admin.from("missions").select("*", { count: "exact", head: true }),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "draft"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "assigned"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "scheduled"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "completed"),
    admin
      .from("missions")
      .select("*", { count: "exact", head: true })
      .eq("status", "cancelled"),
    admin
      .from("payments")
      .select("*", { count: "exact", head: true })
      .in("status", ["debited", "transferred"]),
    admin
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "failed"),
    admin
      .from("outbound_webhooks")
      .select("*", { count: "exact", head: true })
      .eq("delivered", true),
    admin
      .from("outbound_webhooks")
      .select("*", { count: "exact", head: true })
      .eq("delivered", false),
    admin.from("mission_reviews").select("*", { count: "exact", head: true }),
    admin
      .from("subcontractor_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "valid"),
    admin
      .from("subcontractor_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    admin
      .from("subcontractor_documents")
      .select("*", { count: "exact", head: true })
      .eq("status", "expired"),
    admin
      .from("mission_reviews")
      .select("rating")
      .then(({ data }) => ({
        data: data && data.length > 0
          ? Math.round(
              (data.reduce((s, r) => s + ((r as { rating: number }).rating || 0), 0) / data.length) * 10
            ) / 10
          : 0,
      })),
  ]);

  // Totaux financiers : on somme les payments débités (cumul CA)
  const { data: paymentsSum } = await admin
    .from("payments")
    .select("amount_eur, direction, status")
    .in("status", ["debited", "transferred"]);

  const caDebited = (paymentsSum ?? [])
    .filter((p) => (p as { direction: string }).direction === "debit_installer")
    .reduce((s, p) => s + Number((p as { amount_eur: number }).amount_eur ?? 0), 0);

  const commissions = (paymentsSum ?? [])
    .filter((p) => (p as { direction: string }).direction === "commission")
    .reduce((s, p) => s + Number((p as { amount_eur: number }).amount_eur ?? 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-gold-700">
            Super Admin · Données
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
          Analytics plateforme
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500">
          KPIs temps réel de toute l&apos;activité RGE Connect.
        </p>
      </div>

      {/* Section 1 : Croissance */}
      <Section title="Croissance" icon={TrendingUp}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi label="Inscrits total" value={signupsTotal ?? 0} icon={Users} color="forest" />
          <Kpi
            label="Inscrits (30 jours)"
            value={signups30d ?? 0}
            icon={Activity}
            color="gold"
            sub={`${signups7d ?? 0} sur les 7 derniers jours`}
          />
          <Kpi
            label="Taux de conversion"
            value={missionsCompleted && signupsTotal ? Math.round(((missionsCompleted ?? 0) / (signupsTotal ?? 1)) * 100) + "%" : "—"}
            icon={TrendingUp}
            color="forest"
            sub="missions terminées / inscrits"
          />
        </div>
      </Section>

      {/* Section 2 : Missions par statut */}
      <Section title="Missions par statut" icon={ClipboardList}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatusCard label="Brouillon" count={missionsDraft ?? 0} color="ink" />
          <StatusCard label="Publiées" count={missionsPublished ?? 0} color="gold" />
          <StatusCard label="Assignées" count={missionsAssigned ?? 0} color="forest" />
          <StatusCard label="Planifiées" count={missionsScheduled ?? 0} color="forest" />
          <StatusCard label="En cours" count={missionsInProgress ?? 0} color="blue" />
          <StatusCard label="Terminées" count={missionsCompleted ?? 0} color="forest" />
          <StatusCard label="Annulées" count={missionsCancelled ?? 0} color="red" />
          <StatusCard label="TOTAL" count={missionsTotal ?? 0} color="ink" />
        </div>
      </Section>

      {/* Section 3 : Finances */}
      <Section title="Finances" icon={Euro}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Kpi
            label="CA prélevé"
            value={formatEur(caDebited)}
            icon={Euro}
            color="forest"
            sub="Total prélèvements installateurs"
          />
          <Kpi
            label="Commissions RGE Connect"
            value={formatEur(commissions)}
            icon={ShieldCheck}
            color="gold"
            sub="3% fixe par chantier"
          />
          <Kpi
            label="Paiements réussis"
            value={paymentsSuccess ?? 0}
            icon={CheckCircle2}
            color="forest"
            sub={`${paymentsPending ?? 0} en attente · ${paymentsFailed ?? 0} en échec`}
          />
        </div>
      </Section>

      {/* Section 4 : Documents */}
      <Section title="Conformité documentaire" icon={FileText}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi label="Documents valides" value={docsValid ?? 0} icon={CheckCircle2} color="forest" />
          <Kpi label="En attente validation" value={docsPending ?? 0} icon={Activity} color="gold" />
          <Kpi label="Expirés" value={docsExpired ?? 0} icon={AlertCircle} color="red" />
        </div>
      </Section>

      {/* Section 5 : Qualité */}
      <Section title="Qualité et satisfaction" icon={CheckCircle2}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Kpi
            label="Note moyenne"
            value={avgRating ? `${avgRating}/5` : "—"}
            icon={CheckCircle2}
            color="gold"
            sub={`${reviewsCount ?? 0} avis collectés`}
          />
          <Kpi
            label="Avis collectés"
            value={reviewsCount ?? 0}
            icon={Activity}
            color="forest"
            sub="via workflow automatique J+1"
          />
        </div>
      </Section>

      {/* Section 6 : API & Webhooks */}
      <Section title="API et webhooks" icon={Webhook}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Kpi
            label="Webhooks livrés"
            value={webhooksDelivered ?? 0}
            icon={CheckCircle2}
            color="forest"
          />
          <Kpi
            label="Webhooks en échec"
            value={webhooksFailed ?? 0}
            icon={AlertCircle}
            color={(webhooksFailed ?? 0) > 0 ? "red" : "ink"}
          />
          <Kpi
            label="Taux livraison"
            value={
              (webhooksDelivered ?? 0) + (webhooksFailed ?? 0) > 0
                ? Math.round(
                    ((webhooksDelivered ?? 0) /
                      ((webhooksDelivered ?? 0) + (webhooksFailed ?? 0))) *
                      100
                  ) + "%"
                : "—"
            }
            icon={TrendingUp}
            color="forest"
          />
        </div>
      </Section>
    </div>
  );
}

/* ============ HELPERS ============ */

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="flex items-center gap-2 text-sm font-display font-bold text-ink-900 mb-3 uppercase tracking-wider">
        <Icon className="h-4 w-4 text-forest-500" strokeWidth={1.8} />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Kpi({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color: "forest" | "gold" | "red" | "blue" | "ink";
  sub?: string;
}) {
  const bg: Record<string, string> = {
    forest: "bg-forest-50 text-forest-500",
    gold: "bg-gold-500/10 text-gold-600",
    red: "bg-red-50 text-red-500",
    blue: "bg-blue-50 text-blue-500",
    ink: "bg-cream-100 text-ink-500",
  };
  return (
    <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${bg[color]}`}>
          <Icon className="h-4.5 w-4.5" strokeWidth={1.8} />
        </div>
      </div>
      <p className="text-2xl font-display font-bold text-ink-900 tracking-tight">{value}</p>
      <p className="text-sm font-body font-medium text-ink-700 mt-1">{label}</p>
      {sub && <p className="text-xs font-body text-ink-500 mt-1">{sub}</p>}
    </div>
  );
}

function StatusCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: "forest" | "gold" | "red" | "blue" | "ink";
}) {
  const dot: Record<string, string> = {
    forest: "bg-forest-500",
    gold: "bg-gold-500",
    red: "bg-red-500",
    blue: "bg-blue-500",
    ink: "bg-ink-400",
  };
  return (
    <div className="rounded-lg border border-forest-100 bg-white p-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dot[color]}`} />
        <p className="text-xs font-body text-ink-600">{label}</p>
      </div>
      <p className="text-xl font-display font-bold text-ink-900 mt-1">{count}</p>
    </div>
  );
}

function formatEur(n: number): string {
  if (n === 0) return "0 €";
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} €`;
}
