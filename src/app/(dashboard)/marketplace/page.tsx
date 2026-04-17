"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  MapPin,
  Calendar,
  Euro,
  Clock,
  ChevronDown,
  Zap,
  Filter,
} from "lucide-react";

type MissionType = "all" | "pac_ae" | "pac_aa" | "clim" | "pv" | "ite" | "ssc";

const typeTabs: { label: string; value: MissionType; count: number }[] = [
  { label: "Tous", value: "all", count: 18 },
  { label: "PAC Air-Eau", value: "pac_ae", count: 6 },
  { label: "PAC Air-Air", value: "pac_aa", count: 4 },
  { label: "Climatisation", value: "clim", count: 3 },
  { label: "PV", value: "pv", count: 2 },
  { label: "ITE", value: "ite", count: 2 },
  { label: "SSC", value: "ssc", count: 1 },
];

const availableMissions = [
  {
    id: "MIS-2024-0160",
    type: "pac_ae",
    typeLabel: "PAC Air-Eau",
    equipment: "HEIWA Estia 11kW",
    city: "Lyon 6ème (69006)",
    distance: "4 km",
    date: "24-26 avr. 2026",
    amount: "4 200 €",
    installer: "LM Energy",
    urgency: false,
    posted: "Il y a 2h",
  },
  {
    id: "MIS-2024-0161",
    type: "clim",
    typeLabel: "Climatisation",
    equipment: "Daikin Perfera FTXM 3.5kW x3",
    city: "Villeurbanne (69100)",
    distance: "6 km",
    date: "22-23 avr. 2026",
    amount: "3 800 €",
    installer: "LM Energy",
    urgency: true,
    posted: "Il y a 30min",
  },
  {
    id: "MIS-2024-0162",
    type: "pac_aa",
    typeLabel: "PAC Air-Air",
    equipment: "Atlantic Fujitsu ASYG 2.5kW x4",
    city: "Caluire (69300)",
    distance: "8 km",
    date: "28-30 avr. 2026",
    amount: "3 100 €",
    installer: "EcoSolaire Pro",
    urgency: false,
    posted: "Il y a 5h",
  },
  {
    id: "MIS-2024-0163",
    type: "pac_ae",
    typeLabel: "PAC Air-Eau",
    equipment: "HEIWA Estia 14kW + Ballon 300L",
    city: "Écully (69130)",
    distance: "11 km",
    date: "2-4 mai 2026",
    amount: "5 600 €",
    installer: "Rénov'Habitat",
    urgency: false,
    posted: "Il y a 1j",
  },
  {
    id: "MIS-2024-0164",
    type: "ite",
    typeLabel: "ITE",
    equipment: "Weber therm XM + PSE 140mm — 120m²",
    city: "Tassin (69160)",
    distance: "14 km",
    date: "5-9 mai 2026",
    amount: "11 200 €",
    installer: "LM Energy",
    urgency: false,
    posted: "Il y a 1j",
  },
  {
    id: "MIS-2024-0165",
    type: "pv",
    typeLabel: "PV 6kWc",
    equipment: "Longi Hi-MO 6 x16 + Enphase IQ8",
    city: "Bron (69500)",
    distance: "9 km",
    date: "28 avr. 2026",
    amount: "7 800 €",
    installer: "EcoSolaire Pro",
    urgency: true,
    posted: "Il y a 1h",
  },
];

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState<MissionType>("all");
  const filtered = activeTab === "all"
    ? availableMissions
    : availableMissions.filter((m) => m.type === activeTab);

  return (
    <>
      <Topbar title="Marketplace" description="Chantiers disponibles dans votre zone" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
            <Filter className="h-3.5 w-3.5" strokeWidth={1.8} />
            Distance
            <ChevronDown className="h-3 w-3 text-ink-400" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
            <Euro className="h-3.5 w-3.5" strokeWidth={1.8} />
            Montant
            <ChevronDown className="h-3 w-3 text-ink-400" />
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-3.5 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
            <Calendar className="h-3.5 w-3.5" strokeWidth={1.8} />
            Date
            <ChevronDown className="h-3 w-3 text-ink-400" />
          </button>
        </div>

        {/* Type tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 overflow-x-auto">
          {typeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-md px-3 py-2 text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {tab.label}
              <span className={`ml-1.5 text-xs font-mono ${activeTab === tab.value ? "text-forest-500" : "text-ink-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mission cards grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((mission) => (
            <div key={mission.id} className="rounded-xl border border-forest-100 bg-white shadow-sm hover:shadow-md hover:border-forest-200 transition-all duration-200 group cursor-pointer">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-forest-50 border border-forest-100 px-2 py-0.5 text-xs font-mono text-forest-600">
                      {mission.typeLabel}
                    </span>
                    {mission.urgency && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 border border-orange-200 px-2 py-0.5 text-xs font-mono text-orange-600">
                        <Zap className="h-3 w-3" strokeWidth={2} />
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-body text-ink-400">{mission.posted}</span>
                </div>

                {/* Equipment */}
                <p className="text-sm font-body font-medium text-ink-900">{mission.equipment}</p>

                {/* Location + date */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-body text-ink-500">
                    <MapPin className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                    <span>{mission.city}</span>
                    <span className="text-ink-300">·</span>
                    <span className="text-forest-500 font-medium">{mission.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body text-ink-500">
                    <Calendar className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                    <span>{mission.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-body text-ink-500">
                    <Clock className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                    <span>Installateur : {mission.installer}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 pt-4 border-t border-forest-100/50 flex items-center justify-between">
                  <p className="text-lg font-display font-bold text-ink-900">{mission.amount}</p>
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-forest-500 px-4 py-2 text-xs font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300">
                    Proposer mes créneaux
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
