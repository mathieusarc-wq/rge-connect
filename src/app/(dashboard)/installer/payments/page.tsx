"use client";

import { Topbar } from "@/components/dashboard/topbar";
import {
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  Euro,
  Calendar,
  FileDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const transactions = [
  {
    id: "SEPA-00234",
    type: "Prélèvement SEPA B2B",
    mission: "MIS-2024-0147",
    label: "Dupont M. — PAC Air-Eau",
    direction: "out",
    amount: "4 800 €",
    commission: "144 €",
    status: "pending",
    date: "Prévu le 30 avr. 2026",
  },
  {
    id: "SEPA-00233",
    type: "Prélèvement SEPA B2B",
    mission: "MIS-2024-0149",
    label: "Martin P. — Climatisation",
    direction: "out",
    amount: "3 200 €",
    commission: "96 €",
    status: "pending",
    date: "Prévu le 3 mai 2026",
  },
  {
    id: "SEPA-00232",
    type: "Prélèvement SEPA B2B",
    mission: "MIS-2024-0145",
    label: "Bernard S. — PV 6kWc",
    direction: "out",
    amount: "8 500 €",
    commission: "255 €",
    status: "debited",
    date: "12 avr. 2026",
  },
  {
    id: "SEPA-00231",
    type: "Prélèvement SEPA B2B",
    mission: "MIS-2024-0144",
    label: "Leroy A. — ITE",
    direction: "out",
    amount: "12 400 €",
    commission: "372 €",
    status: "debited",
    date: "10 avr. 2026",
  },
  {
    id: "SUB-0025",
    type: "Abonnement Business",
    mission: "—",
    label: "RGE Connect Business — Mensuel",
    direction: "out",
    amount: "199 €",
    commission: "—",
    status: "debited",
    date: "1 avr. 2026",
  },
  {
    id: "SEPA-00230",
    type: "Prélèvement SEPA B2B",
    mission: "MIS-2024-0143",
    label: "Moreau T. — PAC Air-Eau",
    direction: "out",
    amount: "5 600 €",
    commission: "168 €",
    status: "failed",
    date: "8 avr. 2026",
  },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    debited: {
      label: "Prélevé",
      className: "bg-forest-50 text-forest-600 border-forest-200",
      icon: <CheckCircle2 className="h-3 w-3" strokeWidth={2} />,
    },
    pending: {
      label: "Programmé",
      className: "bg-gold-500/10 text-gold-700 border-gold-300/30",
      icon: <Clock className="h-3 w-3" strokeWidth={2} />,
    },
    failed: {
      label: "Échec",
      className: "bg-red-50 text-red-600 border-red-200",
      icon: <ArrowDownLeft className="h-3 w-3" strokeWidth={2} />,
    },
  };
  const c = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-mono font-medium ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export default function InstallerPaymentsPage() {
  return (
    <>
      <Topbar
        title="Paiements"
        description="Prélèvements SEPA B2B et commissions"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Stats cards */}
        <div className="grid sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-forest-100 bg-forest-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="h-4 w-4 text-gold-400" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
                À prélever
              </span>
            </div>
            <p className="text-3xl font-display font-extrabold text-cream-50">
              24 300 €
            </p>
            <p className="text-xs font-body text-ink-400 mt-2">
              5 prélèvements programmés
            </p>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Euro className="h-4 w-4 text-forest-500" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
                Prélevé (mois)
              </span>
            </div>
            <p className="text-3xl font-display font-extrabold text-ink-900">
              52 100 €
            </p>
            <div className="flex items-center gap-1 mt-2 text-forest-500">
              <TrendingUp className="h-3 w-3" />
              <span className="text-xs font-mono">+24%</span>
            </div>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <ArrowUpRight className="h-4 w-4 text-gold-500" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
                Commission (mois)
              </span>
            </div>
            <p className="text-3xl font-display font-extrabold text-ink-900">
              1 563 €
            </p>
            <p className="text-xs font-body text-ink-500 mt-2">
              3% fixe par chantier
            </p>
          </div>
          <div className="rounded-xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-forest-500" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
                Prochain prélèv.
              </span>
            </div>
            <p className="text-2xl font-display font-extrabold text-ink-900">
              30 avr.
            </p>
            <p className="text-xs font-body text-ink-500 mt-2">
              4 800 € — MIS-0147
            </p>
          </div>
        </div>

        {/* Mandate card */}
        <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-display font-bold text-ink-900 mb-1">
                Mandat SEPA B2B
              </h3>
              <p className="text-xs font-body text-ink-500">
                IBAN ****3847 · Signé le 15 janvier 2026 via Yousign
              </p>
              <p className="text-xs font-body text-forest-600 mt-1">
                Mandat valide — Prélèvements automatiques actifs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs font-body text-ink-600 hover:border-forest-200 transition-colors">
                <FileDown className="h-3 w-3" />
                Mandat PDF
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs font-body text-ink-600 hover:border-forest-200 transition-colors">
                Modifier
              </button>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
            <div>
              <h2 className="text-sm font-display font-bold text-ink-900">
                Historique des transactions
              </h2>
              <p className="text-xs font-body text-ink-500 mt-0.5">
                Tous les mouvements (prélèvements + abonnement)
              </p>
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs font-body text-ink-600 hover:border-forest-200 transition-colors">
              <FileDown className="h-3 w-3" />
              Export comptable
            </button>
          </div>
          <div className="divide-y divide-forest-100/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.status === "debited"
                      ? "bg-forest-50"
                      : tx.status === "pending"
                      ? "bg-gold-500/10"
                      : "bg-red-50"
                  }`}
                >
                  <ArrowDownLeft
                    className={`h-4 w-4 ${
                      tx.status === "debited"
                        ? "text-forest-500"
                        : tx.status === "pending"
                        ? "text-gold-500"
                        : "text-red-500"
                    }`}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-ink-400">
                      {tx.id}
                    </span>
                    <StatusBadge status={tx.status} />
                    <span className="text-xs font-mono text-ink-500">
                      {tx.type}
                    </span>
                  </div>
                  <p className="text-sm font-body font-medium text-ink-900 mt-0.5">
                    {tx.label}
                  </p>
                  {tx.mission !== "—" && (
                    <p className="text-xs font-body text-ink-500 mt-0.5">
                      {tx.mission} · Commission RGE Connect : {tx.commission}
                    </p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-display font-semibold text-ink-900">
                    {tx.amount}
                  </p>
                  <p className="text-xs font-body text-ink-400 flex items-center gap-1 justify-end mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {tx.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
