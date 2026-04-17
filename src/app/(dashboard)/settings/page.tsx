"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import dynamic from "next/dynamic";

const ZoneMap = dynamic(
  () => import("@/components/dashboard/map/zone-map").then((m) => m.ZoneMap),
  { ssr: false, loading: () => <div className="w-full rounded-xl bg-cream-100 animate-pulse" style={{ height: 480 }} /> }
);
import {
  Building2,
  FileText,
  Brain,
  MapPinned,
  Save,
  Upload,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

type SettingsTab = "entreprise" | "documents" | "ia" | "zone";

const tabs: { label: string; value: SettingsTab; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { label: "Entreprise", value: "entreprise", icon: Building2 },
  { label: "Documents", value: "documents", icon: FileText },
  { label: "Infos extraites IA", value: "ia", icon: Brain },
  { label: "Zone d'intervention", value: "zone", icon: MapPinned },
];

/* ====== TAB: Entreprise ====== */
function EntrepriseTab() {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Raison sociale</Label>
          <Input defaultValue="Thermipro SARL" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">SIRET</Label>
          <Input defaultValue="823 456 789 00012" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Adresse du siège</Label>
          <Input defaultValue="12 rue de la Paix" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Ville</Label>
          <Input defaultValue="Lyon" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Code postal</Label>
          <Input defaultValue="69003" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Téléphone</Label>
          <Input defaultValue="04 78 12 34 56" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Email de contact</Label>
          <Input defaultValue="contact@thermipro.fr" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">Gérant</Label>
          <Input defaultValue="Thomas Petit" className="h-11 bg-cream-50 border-forest-100" />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-body font-medium text-ink-700">Métiers / qualifications</Label>
        <div className="flex flex-wrap gap-2">
          {["QualiPac", "QualiPV", "Climatisation"].map((q) => (
            <span key={q} className="inline-flex items-center rounded-lg bg-forest-50 border border-forest-100 px-3 py-1.5 text-xs font-mono text-forest-600">
              {q}
            </span>
          ))}
          <button className="inline-flex items-center rounded-lg border border-dashed border-forest-200 px-3 py-1.5 text-xs font-body text-ink-400 hover:text-ink-600 hover:border-forest-300 transition-colors">
            + Ajouter
          </button>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
        <Save className="h-4 w-4" strokeWidth={1.8} />
        Enregistrer
      </button>
    </div>
  );
}

/* ====== TAB: Documents ====== */
function DocumentsTab() {
  const docs = [
    { name: "Extrait Kbis", status: "valid", file: "kbis_thermipro_2026.pdf" },
    { name: "Attestation RGE QualiPac", status: "expiring", file: "rge_qualipac.pdf" },
    { name: "Attestation décennale", status: "valid", file: "decennale_2026.pdf" },
    { name: "Attestation URSSAF", status: "valid", file: "urssaf_q2_2026.pdf" },
    { name: "Attestation RGE QualiPV", status: "missing", file: null },
    { name: "Carte professionnelle BTP", status: "valid", file: "carte_btp.pdf" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm font-body text-ink-500">Gérez vos documents obligatoires. Ils sont vérifiés automatiquement et stockés dans votre coffre-fort sécurisé.</p>
      {docs.map((doc) => (
        <div key={doc.name} className="flex items-center gap-4 rounded-xl border border-forest-100 bg-white p-4">
          <div className="h-10 w-10 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-ink-400" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-body font-medium text-ink-900">{doc.name}</p>
              {doc.status === "valid" && <CheckCircle2 className="h-3.5 w-3.5 text-forest-500" strokeWidth={2} />}
              {doc.status === "expiring" && <AlertTriangle className="h-3.5 w-3.5 text-gold-500" strokeWidth={2} />}
            </div>
            <p className="text-xs font-body text-ink-500">{doc.file ?? "Aucun fichier"}</p>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-cream-50 px-3 py-1.5 text-xs font-body font-medium text-ink-600 hover:border-forest-200 transition-colors">
            <Upload className="h-3 w-3" strokeWidth={1.8} />
            {doc.file ? "Remplacer" : "Uploader"}
          </button>
        </div>
      ))}
    </div>
  );
}

/* ====== TAB: Infos extraites IA ====== */
function IATab() {
  const extractedFields = [
    { label: "Raison sociale", value: "THERMIPRO SARL", source: "Kbis", confidence: 99 },
    { label: "SIRET", value: "823 456 789 00012", source: "Kbis", confidence: 99 },
    { label: "Capital social", value: "10 000 €", source: "Kbis", confidence: 98 },
    { label: "N° RGE QualiPac", value: "QP-2024-78956", source: "Attestation RGE", confidence: 97 },
    { label: "Validité RGE", value: "01/06/2024 - 31/05/2026", source: "Attestation RGE", confidence: 96 },
    { label: "Assureur décennale", value: "SMABTP", source: "Attestation décennale", confidence: 98 },
    { label: "N° police", value: "DEC-2026-445612", source: "Attestation décennale", confidence: 95 },
    { label: "Activités couvertes", value: "Installation PAC, Climatisation, Solaire thermique", source: "Attestation décennale", confidence: 92 },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-forest-100 bg-forest-50/50 p-4 flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-gold-500 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
        <div>
          <p className="text-sm font-body font-medium text-ink-900">Extraction automatique par IA</p>
          <p className="text-xs font-body text-ink-500 mt-0.5">
            Les informations ci-dessous sont extraites automatiquement de vos documents uploadés.
            Vérifiez et corrigez si nécessaire.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-forest-100/50">
          {extractedFields.map((field) => (
            <div key={field.label} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-400">{field.label}</p>
                <p className="text-sm font-body font-medium text-ink-900 mt-0.5">{field.value}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-body text-ink-400">Source : {field.source}</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-mono font-medium ${
                  field.confidence >= 95
                    ? "bg-forest-50 text-forest-600"
                    : "bg-gold-500/10 text-gold-600"
                }`}>
                  {field.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ====== TAB: Zone d'intervention ====== */
function ZoneTab() {
  const [radius, setRadius] = useState(30);

  // Départements couverts selon le rayon depuis Lyon
  const getDepartements = (r: number) => {
    const deps: string[] = ["69 — Rhône"];
    if (r >= 20) deps.push("01 — Ain");
    if (r >= 30) deps.push("38 — Isère");
    if (r >= 40) deps.push("42 — Loire");
    if (r >= 50) deps.push("71 — Saône-et-Loire", "73 — Savoie");
    if (r >= 70) deps.push("26 — Drôme", "43 — Haute-Loire", "74 — Haute-Savoie", "39 — Jura");
    if (r >= 100) deps.push("07 — Ardèche", "03 — Allier", "63 — Puy-de-Dôme", "58 — Nièvre");
    if (r >= 150) deps.push("84 — Vaucluse", "30 — Gard", "48 — Lozère", "15 — Cantal", "23 — Creuse", "21 — Côte-d'Or", "25 — Doubs");
    if (r >= 200) deps.push("13 — Bouches-du-Rhône", "34 — Hérault", "83 — Var", "05 — Hautes-Alpes", "04 — Alpes-de-Haute-Provence");
    if (r >= 300) deps.push("06 — Alpes-Maritimes", "11 — Aude", "31 — Haute-Garonne", "75 — Paris", "45 — Loiret");
    if (r >= 400) deps.push("33 — Gironde", "44 — Loire-Atlantique", "35 — Ille-et-Vilaine", "67 — Bas-Rhin");
    if (r >= 500) deps.push("59 — Nord", "29 — Finistère", "64 — Pyrénées-Atlantiques");
    if (r >= 700) deps.push("2A — Corse-du-Sud");
    if (r >= 900) deps.push("France métropolitaine complète");
    return deps;
  };

  const departements = getDepartements(radius);

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Map — 3 cols */}
        <div className="lg:col-span-3 rounded-xl border border-forest-100 overflow-hidden">
          <ZoneMap center={[45.764, 4.8357]} radiusKm={radius} />
        </div>

        {/* Controls — 2 cols */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-sm font-display font-bold text-ink-900 mb-1">Siège social</h3>
            <p className="text-sm font-body text-ink-600">12 rue de la Paix, 69003 Lyon</p>
            <p className="text-xs font-body text-ink-400 mt-1">Centre de votre zone d'intervention</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-body font-medium text-ink-700">Rayon d'intervention</Label>
              <span className="text-lg font-display font-bold text-forest-500">{radius} km</span>
            </div>
            <input
              type="range"
              min={10}
              max={1000}
              step={10}
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer bg-cream-200 accent-forest-500"
            />
            <div className="flex justify-between text-xs font-mono text-ink-400">
              <span>10 km</span>
              <span>500 km</span>
              <span>1 000 km</span>
            </div>
          </div>

          <div className="rounded-lg bg-forest-50 border border-forest-100 p-4">
            <p className="text-xs font-body text-ink-600">
              <span className="font-semibold text-ink-900">Limité à la France métropolitaine.</span>{" "}
              Seules les missions situées dans un rayon de {radius} km autour de votre siège et sur le territoire français vous seront proposées.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-body font-medium text-ink-700">
              Départements couverts estimés
              <span className="ml-2 text-xs font-mono text-ink-400">({departements.length})</span>
            </Label>
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
              {departements.map((d) => (
                <span key={d} className="inline-flex items-center rounded-md bg-white border border-forest-100 px-2 py-0.5 text-xs font-mono text-ink-600">
                  {d}
                </span>
              ))}
            </div>
          </div>

          <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
            <Save className="h-4 w-4" strokeWidth={1.8} />
            Enregistrer la zone
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====== MAIN ====== */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("entreprise");

  return (
    <>
      <Topbar title="Paramètres" description="Configuration de votre entreprise" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Tab navigation */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-body font-medium whitespace-nowrap transition-all duration-200 ${
                activeTab === tab.value
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.value ? "text-forest-500" : "text-ink-400"}`} strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
          {activeTab === "entreprise" && <EntrepriseTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "ia" && <IATab />}
          {activeTab === "zone" && <ZoneTab />}
        </div>
      </div>
    </>
  );
}
