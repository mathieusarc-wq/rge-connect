"use client";

import { Topbar } from "@/components/dashboard/topbar";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Euro,
  Zap,
  Calendar,
} from "lucide-react";

const walletBalance = "8 420 €";
const pendingAmount = "7 400 €";

const transactions = [
  {
    id: "PAY-0089",
    mission: "MIS-2024-0145",
    type: "PV 6kWc",
    amount: "8 500 €",
    date: "12 avr. 2026",
    status: "received",
    installer: "LM Energy",
  },
  {
    id: "PAY-0088",
    mission: "MIS-2024-0140",
    type: "PAC Air-Eau",
    amount: "4 200 €",
    date: "5 avr. 2026",
    status: "received",
    installer: "EcoSolaire Pro",
  },
  {
    id: "PAY-0090",
    mission: "MIS-2024-0147",
    type: "PAC Air-Eau",
    amount: "4 800 €",
    date: "30 avr. 2026",
    status: "pending",
    installer: "LM Energy",
  },
  {
    id: "PAY-0091",
    mission: "MIS-2024-0149",
    type: "Climatisation",
    amount: "3 200 €",
    date: "3 mai 2026",
    status: "pending",
    installer: "LM Energy",
  },
  {
    id: "WDR-0012",
    mission: "—",
    type: "Virement SEPA",
    amount: "-6 000 €",
    date: "8 avr. 2026",
    status: "withdrawal",
    installer: "Vers IBAN ****4821",
  },
  {
    id: "PAY-0087",
    mission: "MIS-2024-0138",
    type: "ITE",
    amount: "11 800 €",
    date: "28 mar. 2026",
    status: "received",
    installer: "Rénov'Habitat",
  },
];

function TxStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string; icon: React.ReactNode }> = {
    received: {
      label: "Reçu",
      className: "bg-forest-50 text-forest-600 border-forest-200",
      icon: <CheckCircle2 className="h-3 w-3" strokeWidth={2} />,
    },
    pending: {
      label: "En attente",
      className: "bg-gold-500/10 text-gold-700 border-gold-300/30",
      icon: <Clock className="h-3 w-3" strokeWidth={2} />,
    },
    withdrawal: {
      label: "Retrait",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <ArrowUpRight className="h-3 w-3" strokeWidth={2} />,
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

export default function PaymentsPage() {
  return (
    <>
      <Topbar title="Paiements" description="Wallet et historique des transactions" />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Wallet cards */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-forest-100 bg-forest-900 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Euro className="h-4 w-4 text-gold-400" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">Solde wallet</span>
            </div>
            <p className="text-3xl font-display font-extrabold text-cream-50">{walletBalance}</p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold-500 px-4 py-2 text-xs font-body font-semibold text-forest-900 hover:bg-gold-400 transition-colors">
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
              Retirer vers mon compte
            </button>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4 text-gold-500" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">En attente</span>
            </div>
            <p className="text-3xl font-display font-extrabold text-ink-900">{pendingAmount}</p>
            <p className="mt-2 text-xs font-body text-ink-500">2 paiements en cours de traitement</p>
          </div>

          <div className="rounded-xl border border-forest-100 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="h-4 w-4 text-gold-500" strokeWidth={1.8} />
              <span className="text-xs font-mono uppercase tracking-wider text-ink-400">Affacturage 48h</span>
            </div>
            <p className="text-sm font-body text-ink-700 mt-1">Recevez vos paiements en 48h au lieu de J+15/J+30.</p>
            <button className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-gold-500 px-4 py-2 text-xs font-body font-semibold text-gold-600 hover:bg-gold-500/5 transition-colors">
              Activer (10% par opération)
            </button>
          </div>
        </div>

        {/* Transactions */}
        <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-forest-100">
            <h2 className="text-sm font-display font-bold text-ink-900">Historique des transactions</h2>
          </div>
          <div className="divide-y divide-forest-100/50">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center gap-4 px-5 py-3.5">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  tx.status === "withdrawal" ? "bg-blue-50" : tx.status === "received" ? "bg-forest-50" : "bg-gold-500/10"
                }`}>
                  {tx.status === "withdrawal" ? (
                    <ArrowUpRight className="h-4 w-4 text-blue-500" strokeWidth={1.8} />
                  ) : (
                    <ArrowDownLeft className={`h-4 w-4 ${tx.status === "received" ? "text-forest-500" : "text-gold-500"}`} strokeWidth={1.8} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-ink-400">{tx.id}</span>
                    <TxStatusBadge status={tx.status} />
                  </div>
                  <p className="text-sm font-body font-medium text-ink-900 mt-0.5">{tx.type}</p>
                  <p className="text-xs font-body text-ink-500">{tx.installer}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-display font-semibold ${tx.status === "withdrawal" ? "text-blue-600" : "text-ink-900"}`}>
                    {tx.status === "withdrawal" ? tx.amount : `+${tx.amount}`}
                  </p>
                  <p className="text-xs font-body text-ink-400 flex items-center gap-1 justify-end mt-0.5">
                    <Calendar className="h-3 w-3" />{tx.date}
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
