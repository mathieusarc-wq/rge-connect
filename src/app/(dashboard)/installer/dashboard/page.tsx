"use client";

import { Topbar } from "@/components/dashboard/topbar";
import {
  ClipboardList,
  Euro,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Users,
  Calendar,
  MapPin,
} from "lucide-react";
import Link from "next/link";

const stats = [
  {
    label: "Chantiers actifs",
    value: "23",
    change: "+5 cette semaine",
    icon: ClipboardList,
    color: "forest",
  },
  {
    label: "CA engagé",
    value: "147 400 €",
    change: "+32% vs M-1",
    icon: Euro,
    color: "gold",
  },
  {
    label: "Marge moyenne",
    value: "38%",
    change: "+2pts",
    icon: TrendingUp,
    color: "forest",
  },
  {
    label: "Délai moyen pose",
    value: "12j",
    change: "-3j",
    icon: Clock,
    color: "gold",
  },
];

const recentMissions = [
  {
    id: "MIS-2024-0147",
    client: "Dupont Marie",
    type: "PAC Air-Eau",
    city: "Lyon 3ème",
    status: "en_cours",
    date: "15 avr. 2026",
    amount: "4 800 €",
    subcontractor: "Thermipro SARL",
    score: 4.8,
  },
  {
    id: "MIS-2024-0149",
    client: "Martin Pierre",
    type: "Climatisation",
    city: "Villeurbanne",
    status: "a_venir",
    date: "18 avr. 2026",
    amount: "3 200 €",
    subcontractor: "Froid Concept",
    score: 4.6,
  },
  {
    id: "MIS-2024-0150",
    client: "Bernard Sophie",
    type: "PV 6kWc",
    city: "Bron",
    status: "en_attente",
    date: "—",
    amount: "8 500 €",
    subcontractor: null,
    score: 0,
  },
  {
    id: "MIS-2024-0148",
    client: "Petit Julien",
    type: "PAC Air-Air",
    city: "Caluire",
    status: "en_cours",
    date: "14 avr. 2026",
    amount: "2 900 €",
    subcontractor: "Thermipro SARL",
    score: 4.8,
  },
];

const alerts = [
  {
    type: "warning",
    message: "3 missions sans sous-traitant assigné depuis 48h",
    action: "Voir missions",
    href: "/installer/missions?status=en_attente",
  },
  {
    type: "success",
    message: "Intégration Clim'Express API : 12 missions créées auto ce mois",
    action: "Historique webhooks",
    href: "/installer/api",
  },
  {
    type: "info",
    message: "Prélèvement SEPA de 24 300 € prévu J+3",
    action: "Détails",
    href: "/installer/payments",
  },
];

const topSubs = [
  { name: "Thermipro SARL", city: "Lyon 3ème", missions: 12, score: 4.8 },
  { name: "SolairePro", city: "Villeurbanne", missions: 8, score: 4.9 },
  { name: "IsolBat Lyon", city: "Tassin", missions: 6, score: 4.7 },
  { name: "Froid Concept", city: "Villeurbanne", missions: 5, score: 4.6 },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    en_cours: {
      label: "En cours",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    a_venir: {
      label: "À venir",
      className: "bg-gold-500/10 text-gold-700 border-gold-300/30",
    },
    termine: {
      label: "Terminé",
      className: "bg-forest-50 text-forest-600 border-forest-200",
    },
    en_attente: {
      label: "Non assigné",
      className: "bg-orange-50 text-orange-600 border-orange-200",
    },
  };
  const c = config[status] ?? config.en_cours;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default function InstallerDashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" description="Bienvenue, LM Energy" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    stat.color === "forest"
                      ? "bg-forest-50"
                      : "bg-gold-500/10"
                  }`}
                >
                  <stat.icon
                    className={`h-4.5 w-4.5 ${
                      stat.color === "forest"
                        ? "text-forest-500"
                        : "text-gold-600"
                    }`}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex items-center gap-1 text-forest-500">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-mono font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-ink-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-xs font-body text-ink-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid xl:grid-cols-3 gap-6">
          {/* Missions récentes */}
          <div className="xl:col-span-2 rounded-xl border border-forest-100 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
              <div>
                <h2 className="text-sm font-display font-bold text-ink-900">
                  Chantiers en cours
                </h2>
                <p className="text-xs font-body text-ink-500 mt-0.5">
                  {recentMissions.length} derniers chantiers
                </p>
              </div>
              <Link
                href="/installer/missions"
                className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-forest-500 hover:text-forest-700 transition-colors"
              >
                Tout voir <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="divide-y divide-forest-100/50">
              {recentMissions.map((mission) => (
                <Link
                  key={mission.id}
                  href={`/installer/missions/${mission.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-ink-400">
                        {mission.id}
                      </span>
                      <StatusBadge status={mission.status} />
                    </div>
                    <p className="text-sm font-body font-medium text-ink-900 mt-0.5">
                      {mission.client} — {mission.type}
                    </p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs font-body text-ink-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {mission.city}
                      </span>
                      <span>·</span>
                      <span>
                        {mission.subcontractor ?? "En recherche d'artisan"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-display font-semibold text-ink-900">
                      {mission.amount}
                    </p>
                    <p className="text-xs font-body text-ink-400 flex items-center gap-1 justify-end mt-0.5">
                      <Calendar className="h-3 w-3" />
                      {mission.date}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-ink-300 group-hover:text-forest-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Alertes + Top subs */}
          <div className="space-y-6">
            {/* Alertes */}
            <div className="rounded-xl border border-forest-100 bg-white shadow-sm">
              <div className="px-5 py-4 border-b border-forest-100">
                <h2 className="text-sm font-display font-bold text-ink-900">
                  Alertes
                </h2>
              </div>
              <div className="divide-y divide-forest-100/50">
                {alerts.map((alert, i) => (
                  <div key={i} className="px-5 py-3.5">
                    <div className="flex items-start gap-3">
                      {alert.type === "warning" && (
                        <AlertCircle
                          className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5"
                          strokeWidth={1.8}
                        />
                      )}
                      {alert.type === "info" && (
                        <Clock
                          className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5"
                          strokeWidth={1.8}
                        />
                      )}
                      {alert.type === "success" && (
                        <CheckCircle2
                          className="h-4 w-4 text-forest-500 flex-shrink-0 mt-0.5"
                          strokeWidth={1.8}
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-body text-ink-700">
                          {alert.message}
                        </p>
                        <Link
                          href={alert.href}
                          className="text-xs font-body font-medium text-forest-500 hover:text-forest-700 mt-1 inline-block transition-colors"
                        >
                          {alert.action} →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top sous-traitants */}
            <div className="rounded-xl border border-forest-100 bg-white shadow-sm">
              <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
                <h2 className="text-sm font-display font-bold text-ink-900">
                  Top sous-traitants
                </h2>
                <Users className="h-4 w-4 text-ink-400" strokeWidth={1.8} />
              </div>
              <div className="divide-y divide-forest-100/50">
                {topSubs.map((sub) => (
                  <div
                    key={sub.name}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-forest-50 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-body font-semibold text-forest-600">
                        {sub.name[0]}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-body font-medium text-ink-900 truncate">
                        {sub.name}
                      </p>
                      <p className="text-xs font-body text-ink-500">
                        {sub.city} · {sub.missions} missions
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <svg
                        className="h-3 w-3 text-gold-500"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                      <span className="text-xs font-mono text-ink-700">
                        {sub.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
