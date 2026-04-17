"use client";

import { Topbar } from "@/components/dashboard/topbar";
import {
  ClipboardList,
  Euro,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  MapPin,
  Star,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Missions en cours",
    value: "4",
    change: "+2 cette semaine",
    icon: ClipboardList,
    color: "forest",
  },
  {
    label: "Revenus du mois",
    value: "12 800 €",
    change: "+24% vs M-1",
    icon: Euro,
    color: "gold",
  },
  {
    label: "Note moyenne",
    value: "4.8",
    change: "+0.1",
    icon: Star,
    color: "gold",
  },
  {
    label: "Prochain paiement",
    value: "J+8",
    change: "3 200 € prévu",
    icon: Clock,
    color: "forest",
  },
];

const upcomingMissions = [
  {
    id: "MIS-2024-0147",
    type: "PAC Air-Eau",
    city: "Lyon 3ème",
    date: "15 avr. 2026",
    amount: "4 800 €",
    status: "en_cours",
    installer: "LM Energy",
  },
  {
    id: "MIS-2024-0149",
    type: "Climatisation",
    city: "Villeurbanne",
    date: "18 avr. 2026",
    amount: "3 200 €",
    status: "a_venir",
    installer: "LM Energy",
  },
  {
    id: "MIS-2024-0150",
    type: "PAC Air-Air",
    city: "Caluire",
    date: "20 avr. 2026",
    amount: "2 900 €",
    status: "a_venir",
    installer: "EcoSolaire Pro",
  },
];

const alerts = [
  {
    type: "warning",
    message: "Votre attestation RGE QualiPac expire dans 45 jours",
    action: "Mettre à jour",
    href: "/documents",
  },
  {
    type: "info",
    message: "3 nouvelles missions disponibles dans votre zone",
    action: "Voir la marketplace",
    href: "/marketplace",
  },
  {
    type: "success",
    message: "Paiement MIS-0145 reçu — 8 500 € crédité sur votre wallet",
    action: "Détails",
    href: "/payments",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    en_cours: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200" },
    a_venir: { label: "À venir", className: "bg-gold-500/10 text-gold-700 border-gold-300/30" },
    termine: { label: "Terminé", className: "bg-forest-50 text-forest-600 border-forest-200" },
  };
  const c = config[status] ?? config.en_cours;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" description="Bienvenue, Thermipro SARL" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${stat.color === "forest" ? "bg-forest-50" : "bg-gold-500/10"}`}>
                  <stat.icon className={`h-4.5 w-4.5 ${stat.color === "forest" ? "text-forest-500" : "text-gold-600"}`} strokeWidth={1.8} />
                </div>
                <div className="flex items-center gap-1 text-forest-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono font-medium">{stat.change}</span>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-ink-900 tracking-tight">{stat.value}</p>
              <p className="text-xs font-body text-ink-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Missions à venir */}
          <div className="xl:col-span-2 rounded-xl border border-forest-100 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
              <div>
                <h2 className="text-sm font-display font-bold text-ink-900">Mes missions</h2>
                <p className="text-xs font-body text-ink-500 mt-0.5">Prochains chantiers planifiés</p>
              </div>
              <Link href="/marketplace" className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-forest-500 hover:text-forest-700 transition-colors">
                Marketplace <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-forest-100/50">
              {upcomingMissions.map((m) => (
                <Link key={m.id} href={`/missions/${m.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50/50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-ink-400">{m.id}</span>
                      <StatusBadge status={m.status} />
                    </div>
                    <p className="text-sm font-body font-medium text-ink-900 mt-0.5">{m.type}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs font-body text-ink-500">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{m.city}</span>
                      <span>·</span>
                      <span>{m.installer}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-display font-semibold text-ink-900">{m.amount}</p>
                    <p className="text-xs font-body text-ink-400 flex items-center gap-1 justify-end mt-0.5">
                      <Calendar className="h-3 w-3" />{m.date}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-forest-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className="space-y-6">
            <div className="rounded-xl border border-forest-100 bg-white shadow-sm">
              <div className="px-5 py-4 border-b border-forest-100">
                <h2 className="text-sm font-display font-bold text-ink-900">Alertes</h2>
              </div>
              <div className="divide-y divide-forest-100/50">
                {alerts.map((alert, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      {alert.type === "warning" && <AlertCircle className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />}
                      {alert.type === "info" && <TrendingUp className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />}
                      {alert.type === "success" && <CheckCircle2 className="h-4 w-4 text-forest-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />}
                      <div className="flex-1">
                        <p className="text-sm font-body text-ink-700">{alert.message}</p>
                        <Link href={alert.href} className="text-xs font-body font-medium text-forest-500 hover:text-forest-700 mt-1 inline-block transition-colors">
                          {alert.action} →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score */}
            <div className="rounded-xl border border-forest-100 bg-forest-900 p-5 shadow-sm">
              <h2 className="text-sm font-display font-bold text-cream-50 mb-3">Mon score</h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-4xl font-display font-extrabold text-gold-400">4.8</div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className={`h-4 w-4 ${s <= 4 ? "text-gold-400" : "text-gold-400/40"}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-xs font-body text-ink-400">Basé sur 34 avis vérifiés</p>
              <Link href="/reviews" className="mt-3 inline-flex items-center gap-1 text-xs font-body font-medium text-gold-400 hover:text-gold-300 transition-colors">
                Voir mes avis <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
