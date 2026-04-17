"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Search,
  Filter,
  ArrowRight,
  Calendar,
  MapPin,
  ChevronDown,
  Plus,
  FileUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Status =
  | "all"
  | "en_attente"
  | "a_venir"
  | "en_cours"
  | "termine"
  | "annule";

const tabs: { label: string; value: Status; count: number }[] = [
  { label: "Tous", value: "all", count: 89 },
  { label: "Non assignés", value: "en_attente", count: 3 },
  { label: "À venir", value: "a_venir", count: 14 },
  { label: "En cours", value: "en_cours", count: 23 },
  { label: "Terminés", value: "termine", count: 47 },
  { label: "Annulés", value: "annule", count: 2 },
];

const missions = [
  {
    id: "MIS-2024-0150",
    client: "Bernard Sophie",
    city: "Bron (69500)",
    type: "PV 6kWc",
    equipment: "Longi Hi-MO 6 x16",
    status: "en_attente",
    date: "—",
    amount: "8 500 €",
    subcontractor: null,
    score: 0,
    source: "web",
  },
  {
    id: "MIS-2024-0149",
    client: "Martin Pierre",
    city: "Villeurbanne (69100)",
    type: "Climatisation",
    equipment: "Daikin Perfera FTXM-R",
    status: "a_venir",
    date: "18 avr. 2026",
    amount: "3 200 €",
    subcontractor: "Froid Concept",
    score: 4.6,
    source: "api",
  },
  {
    id: "MIS-2024-0148",
    client: "Petit Julien",
    city: "Caluire (69300)",
    type: "PAC Air-Air",
    equipment: "Atlantic Fujitsu ASYG",
    status: "en_cours",
    date: "14 avr. 2026",
    amount: "2 900 €",
    subcontractor: "Thermipro SARL",
    score: 4.8,
    source: "api",
  },
  {
    id: "MIS-2024-0147",
    client: "Dupont Marie",
    city: "Lyon 3ème (69003)",
    type: "PAC Air-Eau",
    equipment: "HEIWA Estia 11kW",
    status: "en_cours",
    date: "15 avr. 2026",
    amount: "4 800 €",
    subcontractor: "Thermipro SARL",
    score: 4.8,
    source: "api",
  },
  {
    id: "MIS-2024-0145",
    client: "Bernard Sophie",
    city: "Bron (69500)",
    type: "PV 6kWc",
    equipment: "Longi Hi-MO 6 x16",
    status: "termine",
    date: "12 avr. 2026",
    amount: "8 500 €",
    subcontractor: "SolairePro",
    score: 4.9,
    source: "web",
  },
  {
    id: "MIS-2024-0144",
    client: "Leroy Amélie",
    city: "Tassin (69160)",
    type: "ITE",
    equipment: "Weber therm XM + PSE 140mm",
    status: "termine",
    date: "10 avr. 2026",
    amount: "12 400 €",
    subcontractor: "IsolBat Lyon",
    score: 4.7,
    source: "web",
  },
  {
    id: "MIS-2024-0142",
    client: "Moreau Thomas",
    city: "Écully (69130)",
    type: "PAC Air-Eau",
    equipment: "HEIWA Estia 14kW",
    status: "en_attente",
    date: "20 avr. 2026",
    amount: "5 600 €",
    subcontractor: null,
    score: 0,
    source: "api",
  },
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
    annule: {
      label: "Annulé",
      className: "bg-red-50 text-red-600 border-red-200",
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

function SourceBadge({ source }: { source: string }) {
  const config: Record<string, { label: string; className: string }> = {
    api: {
      label: "API",
      className: "bg-forest-900 text-gold-400 border-forest-700",
    },
    web: {
      label: "Web",
      className: "bg-cream-100 text-ink-600 border-forest-100",
    },
  };
  const c = config[source] ?? config.web;
  return (
    <span
      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${c.className}`}
    >
      {c.label}
    </span>
  );
}

export default function InstallerMissionsPage() {
  const [activeTab, setActiveTab] = useState<Status>("all");
  const filtered =
    activeTab === "all"
      ? missions
      : missions.filter((m) => m.status === activeTab);

  return (
    <>
      <Topbar
        title="Missions"
        description="Chantiers créés et assignés aux sous-traitants"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              placeholder="Rechercher par ID, client, ville, équipement..."
              className="h-10 pl-10 bg-white border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
              <Filter className="h-3.5 w-3.5" strokeWidth={1.8} />
              Filtres
              <ChevronDown className="h-3 w-3 text-ink-400" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
              <FileUp className="h-3.5 w-3.5" strokeWidth={1.8} />
              Export CSV
            </button>
            <Link
              href="/installer/missions/new"
              className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300"
            >
              <Plus className="h-4 w-4" strokeWidth={2} />
              Nouvelle mission
            </Link>
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-md px-4 py-2 text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {tab.label}
              <span
                className={`ml-1.5 text-xs font-mono ${
                  activeTab === tab.value ? "text-forest-500" : "text-ink-400"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Missions list */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-forest-100/50">
            {filtered.map((mission) => (
              <Link
                key={mission.id}
                href={`/installer/missions/${mission.id}`}
                className="flex items-center gap-5 px-5 py-4 hover:bg-cream-50/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-ink-400">
                      {mission.id}
                    </span>
                    <StatusBadge status={mission.status} />
                    <SourceBadge source={mission.source} />
                    <span className="inline-flex items-center rounded-md bg-forest-50 border border-forest-100 px-2 py-0.5 text-xs font-mono text-forest-600">
                      {mission.type}
                    </span>
                  </div>
                  <p className="text-sm font-body font-medium text-ink-900 mt-1.5">
                    {mission.client}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs font-body text-ink-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {mission.city}
                    </span>
                    <span>·</span>
                    <span>{mission.equipment}</span>
                  </div>
                </div>

                <div className="hidden lg:block w-48">
                  {mission.subcontractor ? (
                    <>
                      <p className="text-sm font-body text-ink-700">
                        {mission.subcontractor}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <svg
                          className="h-3 w-3 text-gold-500"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-mono text-ink-500">
                          {mission.score}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-xs font-body italic text-orange-600">
                      En recherche d&apos;artisan
                    </p>
                  )}
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
      </div>
    </>
  );
}
