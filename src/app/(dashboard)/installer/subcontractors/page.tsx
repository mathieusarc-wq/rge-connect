"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Search,
  Filter,
  ChevronDown,
  MapPin,
  CheckCircle2,
  Shield,
  ArrowRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const subs = [
  {
    id: "sub-01",
    name: "Thermipro SARL",
    city: "Lyon 3ème",
    radius: 30,
    qualifications: ["QualiPac", "QualiPV", "Climatisation"],
    score: 4.8,
    reviews: 34,
    missions_done: 12,
    response_rate: 96,
    documents_status: "valid",
    last_mission: "14 avr. 2026",
  },
  {
    id: "sub-02",
    name: "SolairePro",
    city: "Villeurbanne",
    radius: 50,
    qualifications: ["QualiPV", "QualiSol"],
    score: 4.9,
    reviews: 28,
    missions_done: 8,
    response_rate: 100,
    documents_status: "valid",
    last_mission: "12 avr. 2026",
  },
  {
    id: "sub-03",
    name: "IsolBat Lyon",
    city: "Tassin",
    radius: 40,
    qualifications: ["RGE ITE", "Isolation Combles"],
    score: 4.7,
    reviews: 21,
    missions_done: 6,
    response_rate: 92,
    documents_status: "expiring",
    last_mission: "10 avr. 2026",
  },
  {
    id: "sub-04",
    name: "Froid Concept",
    city: "Villeurbanne",
    radius: 25,
    qualifications: ["Climatisation", "PAC Air-Air"],
    score: 4.6,
    reviews: 17,
    missions_done: 5,
    response_rate: 88,
    documents_status: "valid",
    last_mission: "8 avr. 2026",
  },
  {
    id: "sub-05",
    name: "Rénov'Habitat",
    city: "Écully",
    radius: 35,
    qualifications: ["QualiPac", "RGE ITE"],
    score: 4.5,
    reviews: 14,
    missions_done: 4,
    response_rate: 85,
    documents_status: "valid",
    last_mission: "3 avr. 2026",
  },
];

function DocStatusIndicator({ status }: { status: string }) {
  if (status === "valid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 border border-forest-200 px-2 py-0.5 text-xs font-mono text-forest-600">
        <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
        Docs OK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono text-gold-700">
      <Shield className="h-3 w-3" strokeWidth={2} />
      Expire bientôt
    </span>
  );
}

export default function SubcontractorsPage() {
  const [tab, setTab] = useState<"all" | "active" | "inactive">("all");

  return (
    <>
      <Topbar
        title="Sous-traitants"
        description="Annuaire des artisans RGE qui travaillent avec vous"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Top stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-forest-100 bg-white p-4">
            <p className="text-2xl font-display font-bold text-ink-900">24</p>
            <p className="text-xs font-body text-ink-500 mt-1">
              Artisans connectés
            </p>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-4">
            <p className="text-2xl font-display font-bold text-ink-900">4.7</p>
            <p className="text-xs font-body text-ink-500 mt-1">
              Score moyen pondéré
            </p>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-4">
            <p className="text-2xl font-display font-bold text-ink-900">93%</p>
            <p className="text-xs font-body text-ink-500 mt-1">
              Taux d&apos;acceptation
            </p>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-4">
            <p className="text-2xl font-display font-bold text-ink-900">2</p>
            <p className="text-xs font-body text-ink-500 mt-1">
              Docs expirent bientôt
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              placeholder="Rechercher un artisan, une ville, une qualification..."
              className="h-10 pl-10 bg-white border-forest-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
              <Filter className="h-3.5 w-3.5" strokeWidth={1.8} />
              Qualification
              <ChevronDown className="h-3 w-3 text-ink-400" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
              Zone
              <ChevronDown className="h-3 w-3 text-ink-400" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 w-fit">
          {[
            { v: "all", l: "Tous", c: 24 },
            { v: "active", l: "Actifs (30j)", c: 12 },
            { v: "inactive", l: "Inactifs", c: 12 },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v as typeof tab)}
              className={`rounded-md px-4 py-2 text-sm font-body font-medium transition-all ${
                tab === t.v
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {t.l}
              <span
                className={`ml-1.5 text-xs font-mono ${
                  tab === t.v ? "text-forest-500" : "text-ink-400"
                }`}
              >
                {t.c}
              </span>
            </button>
          ))}
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {subs.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl border border-forest-100 bg-white shadow-sm hover:shadow-md hover:border-forest-200 transition-all duration-200 cursor-pointer group p-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-forest-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-body font-bold text-cream-50">
                      {sub.name[0]}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-body font-semibold text-ink-900 truncate">
                      {sub.name}
                    </p>
                    <p className="text-xs font-body text-ink-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {sub.city} · {sub.radius} km
                    </p>
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="flex flex-wrap gap-1 mb-4">
                {sub.qualifications.map((q) => (
                  <span
                    key={q}
                    className="inline-flex items-center rounded-md bg-forest-50 border border-forest-100 px-2 py-0.5 text-xs font-mono text-forest-600"
                  >
                    {q}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-forest-100/50">
                <div>
                  <div className="flex items-center gap-1">
                    <svg
                      className="h-3.5 w-3.5 text-gold-500"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-sm font-display font-bold text-ink-900">
                      {sub.score}
                    </span>
                  </div>
                  <p className="text-xs font-body text-ink-400 mt-0.5">
                    {sub.reviews} avis
                  </p>
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-ink-900">
                    {sub.missions_done}
                  </p>
                  <p className="text-xs font-body text-ink-400 mt-0.5">
                    Missions
                  </p>
                </div>
                <div>
                  <p className="text-sm font-display font-bold text-ink-900">
                    {sub.response_rate}%
                  </p>
                  <p className="text-xs font-body text-ink-400 mt-0.5">
                    Accept.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <DocStatusIndicator status={sub.documents_status} />
                <button className="inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 group-hover:text-forest-700 transition-colors">
                  Voir profil <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
