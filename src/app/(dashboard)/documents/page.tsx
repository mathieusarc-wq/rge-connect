"use client";

import { Topbar } from "@/components/dashboard/topbar";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Download,
  Eye,
} from "lucide-react";

const documents = [
  {
    name: "Extrait Kbis",
    status: "valid",
    expiry: "12 oct. 2026",
    uploaded: "15 jan. 2026",
    file: "kbis_thermipro_2026.pdf",
  },
  {
    name: "Attestation RGE QualiPac",
    status: "expiring",
    expiry: "28 mai 2026",
    uploaded: "10 mar. 2025",
    file: "rge_qualipac_thermipro.pdf",
  },
  {
    name: "Attestation décennale",
    status: "valid",
    expiry: "1 jan. 2027",
    uploaded: "5 fév. 2026",
    file: "decennale_thermipro_2026.pdf",
  },
  {
    name: "Attestation URSSAF",
    status: "valid",
    expiry: "30 juin 2026",
    uploaded: "1 avr. 2026",
    file: "urssaf_thermipro_q2_2026.pdf",
  },
  {
    name: "Attestation RGE QualiPV",
    status: "missing",
    expiry: "—",
    uploaded: "—",
    file: null,
  },
  {
    name: "Carte professionnelle BTP",
    status: "valid",
    expiry: "15 déc. 2026",
    uploaded: "20 jan. 2026",
    file: "carte_btp_thermipro.pdf",
  },
];

function StatusIcon({ status }: { status: string }) {
  if (status === "valid") return <CheckCircle2 className="h-4 w-4 text-forest-500" strokeWidth={1.8} />;
  if (status === "expiring") return <AlertTriangle className="h-4 w-4 text-gold-500" strokeWidth={1.8} />;
  return <Clock className="h-4 w-4 text-ink-400" strokeWidth={1.8} />;
}

function StatusLabel({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    valid: { label: "Valide", className: "bg-forest-50 text-forest-600 border-forest-200" },
    expiring: { label: "Expire bientôt", className: "bg-gold-500/10 text-gold-700 border-gold-300/30" },
    missing: { label: "Manquant", className: "bg-red-50 text-red-600 border-red-200" },
  };
  const c = config[status] ?? config.missing;
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono font-medium ${c.className}`}>
      {c.label}
    </span>
  );
}

export default function DocumentsPage() {
  return (
    <>
      <Topbar title="Documents" description="Coffre-fort documentaire" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-forest-200 bg-forest-50 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-forest-500" strokeWidth={1.8} />
              <div>
                <p className="text-xl font-display font-bold text-forest-600">4</p>
                <p className="text-xs font-body text-forest-600/70">Documents valides</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-gold-300/30 bg-gold-500/5 p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-gold-500" strokeWidth={1.8} />
              <div>
                <p className="text-xl font-display font-bold text-gold-700">1</p>
                <p className="text-xs font-body text-gold-600/70">Expire bientôt</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-red-500" strokeWidth={1.8} />
              <div>
                <p className="text-xl font-display font-bold text-red-600">1</p>
                <p className="text-xs font-body text-red-500/70">Manquant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents list */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="divide-y divide-forest-100/50">
            {documents.map((doc) => (
              <div key={doc.name} className="flex items-center gap-4 px-5 py-4">
                <div className="h-10 w-10 rounded-lg bg-cream-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-ink-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-body font-medium text-ink-900">{doc.name}</p>
                    <StatusLabel status={doc.status} />
                  </div>
                  <p className="text-xs font-body text-ink-500 mt-0.5">
                    {doc.status === "missing" ? "Aucun fichier uploadé" : `Expire le ${doc.expiry} · Uploadé le ${doc.uploaded}`}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {doc.file ? (
                    <>
                      <button className="h-8 w-8 rounded-lg border border-forest-100 flex items-center justify-center text-ink-400 hover:text-ink-600 hover:border-forest-200 transition-colors">
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                      <button className="h-8 w-8 rounded-lg border border-forest-100 flex items-center justify-center text-ink-400 hover:text-ink-600 hover:border-forest-200 transition-colors">
                        <Download className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    </>
                  ) : null}
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-cream-50 px-3 py-1.5 text-xs font-body font-medium text-ink-600 hover:border-forest-200 transition-colors">
                    <Upload className="h-3 w-3" strokeWidth={1.8} />
                    {doc.file ? "Remplacer" : "Uploader"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
