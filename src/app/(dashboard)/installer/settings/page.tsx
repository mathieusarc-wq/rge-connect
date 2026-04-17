"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Building2,
  CreditCard,
  Users,
  Bell,
  Save,
  CheckCircle2,
  FileDown,
  Star,
  ArrowRight,
} from "lucide-react";

type Tab = "entreprise" | "abonnement" | "equipe" | "notifications";

const tabs: {
  label: string;
  value: Tab;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { label: "Entreprise", value: "entreprise", icon: Building2 },
  { label: "Abonnement", value: "abonnement", icon: CreditCard },
  { label: "Équipe", value: "equipe", icon: Users },
  { label: "Notifications", value: "notifications", icon: Bell },
];

function EntrepriseTab() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Raison sociale
          </Label>
          <Input defaultValue="LM Energy SAS" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            SIRET
          </Label>
          <Input
            defaultValue="901 234 567 00018"
            className="h-11 bg-cream-50 border-forest-100 font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Adresse du siège
          </Label>
          <Input
            defaultValue="25 rue des Entrepreneurs"
            className="h-11 bg-cream-50 border-forest-100"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Ville
          </Label>
          <Input defaultValue="Paris 15ème" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Code postal
          </Label>
          <Input defaultValue="75015" className="h-11 bg-cream-50 border-forest-100 font-mono" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Téléphone
          </Label>
          <Input defaultValue="01 42 34 56 78" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Email de contact
          </Label>
          <Input defaultValue="contact@lm-energy.fr" className="h-11 bg-cream-50 border-forest-100" />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-body font-medium text-ink-700">
            Dirigeant
          </Label>
          <Input defaultValue="Luc Martineau" className="h-11 bg-cream-50 border-forest-100" />
        </div>
      </div>

      <div className="rounded-lg bg-forest-50 border border-forest-100 p-4 flex items-start gap-3">
        <CheckCircle2 className="h-5 w-5 text-forest-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
        <div>
          <p className="text-sm font-body font-medium text-ink-900">
            Entité juridique vérifiée
          </p>
          <p className="text-xs font-body text-ink-500 mt-0.5">
            KYC Mangopay validé le 18 janvier 2026 · Kbis vérifié
          </p>
        </div>
      </div>

      <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
        <Save className="h-4 w-4" strokeWidth={1.8} />
        Enregistrer
      </button>
    </div>
  );
}

function AbonnementTab() {
  return (
    <div className="space-y-6">
      {/* Plan actuel */}
      <div className="rounded-xl border-2 border-gold-500 bg-gradient-to-r from-gold-500/5 to-forest-500/5 p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="h-3.5 w-3.5 text-gold-500" fill="currentColor" />
              <span className="text-xs font-mono uppercase tracking-wider text-gold-700 font-semibold">
                Plan actuel
              </span>
            </div>
            <h3 className="text-2xl font-display font-bold text-ink-900">
              RGE Connect Business
            </h3>
            <p className="text-sm font-body text-ink-600 mt-1">
              Chantiers illimités + API + garantie + dashboard complet
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-extrabold text-forest-600">
              199<span className="text-lg text-ink-500">€</span>
            </p>
            <p className="text-xs font-body text-ink-500">/ mois</p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-forest-100/50 grid sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400">
              Prochain prélèv.
            </p>
            <p className="text-sm font-body font-medium text-ink-900 mt-0.5">
              1 mai 2026
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400">
              Méthode
            </p>
            <p className="text-sm font-body font-medium text-ink-900 mt-0.5">
              SEPA ****3847
            </p>
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ink-400">
              Commission
            </p>
            <p className="text-sm font-body font-medium text-ink-900 mt-0.5">
              3% par chantier
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
          <ArrowRight className="h-3.5 w-3.5" />
          Passer à Enterprise
        </button>
        <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors">
          <FileDown className="h-3.5 w-3.5" />
          Factures (PDF)
        </button>
      </div>

      {/* Factures récentes */}
      <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-forest-100">
          <h3 className="text-sm font-display font-bold text-ink-900">
            Factures récentes
          </h3>
        </div>
        <div className="divide-y divide-forest-100/50">
          {[
            { num: "2026-04-001", date: "1 avr. 2026", amount: "199 €" },
            { num: "2026-03-001", date: "1 mar. 2026", amount: "199 €" },
            { num: "2026-02-001", date: "1 fév. 2026", amount: "199 €" },
            { num: "2026-01-001", date: "15 jan. 2026", amount: "199 €" },
          ].map((f) => (
            <div key={f.num} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-body font-medium text-ink-900">
                  Facture {f.num}
                </p>
                <p className="text-xs font-body text-ink-500">{f.date}</p>
              </div>
              <p className="text-sm font-display font-semibold text-ink-900">
                {f.amount}
              </p>
              <button className="p-2 rounded-lg border border-forest-100 text-ink-400 hover:text-ink-600 hover:border-forest-200 transition-colors">
                <FileDown className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EquipeTab() {
  const members = [
    {
      name: "Luc Martineau",
      email: "luc@lm-energy.fr",
      role: "owner",
      last_seen: "Il y a 5 min",
    },
    {
      name: "Sophie Lambert",
      email: "sophie@lm-energy.fr",
      role: "admin",
      last_seen: "Il y a 2h",
    },
    {
      name: "Paul Durand",
      email: "paul@lm-energy.fr",
      role: "member",
      last_seen: "Hier",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-body text-ink-500">
          {members.length} membres · Plan Business = 5 membres inclus
        </p>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
          Inviter un membre
        </button>
      </div>
      <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
        <div className="divide-y divide-forest-100/50">
          {members.map((m) => (
            <div key={m.email} className="flex items-center gap-4 px-5 py-3.5">
              <div className="h-9 w-9 rounded-full bg-forest-500 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-body font-semibold text-cream-50">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-ink-900">
                  {m.name}
                </p>
                <p className="text-xs font-body text-ink-500">{m.email}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono uppercase tracking-wider ${
                  m.role === "owner"
                    ? "bg-gold-500/10 text-gold-700 border-gold-300/30"
                    : m.role === "admin"
                    ? "bg-forest-50 text-forest-600 border-forest-200"
                    : "bg-cream-100 text-ink-600 border-forest-100"
                }`}
              >
                {m.role}
              </span>
              <p className="text-xs font-body text-ink-400 w-24 text-right">
                {m.last_seen}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const settings = [
    {
      category: "Missions",
      items: [
        { label: "Mission créée sans sous-traitant après 4h", email: true, sms: false },
        { label: "Sous-traitant a proposé des créneaux", email: true, sms: true },
        { label: "Client a validé un créneau", email: true, sms: false },
        { label: "Chantier terminé avec PV signé", email: true, sms: false },
      ],
    },
    {
      category: "Paiements",
      items: [
        { label: "Prélèvement SEPA programmé", email: true, sms: false },
        { label: "Prélèvement exécuté", email: true, sms: false },
        { label: "Échec de prélèvement", email: true, sms: true },
      ],
    },
    {
      category: "API",
      items: [
        { label: "Échec webhook (3 tentatives)", email: true, sms: false },
        { label: "Nouvelle clé API créée", email: true, sms: false },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {settings.map((section) => (
        <div key={section.category}>
          <h3 className="text-sm font-display font-bold text-ink-900 mb-3">
            {section.category}
          </h3>
          <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-2 bg-cream-50 border-b border-forest-100 text-xs font-mono uppercase tracking-wider text-ink-400">
              <span>Événement</span>
              <div className="flex items-center gap-8">
                <span>Email</span>
                <span>SMS</span>
              </div>
            </div>
            <div className="divide-y divide-forest-100/50">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <p className="text-sm font-body text-ink-700">{item.label}</p>
                  <div className="flex items-center gap-10">
                    <input
                      type="checkbox"
                      defaultChecked={item.email}
                      className="h-4 w-4 rounded border-forest-200 text-forest-500 focus:ring-forest-500/20"
                    />
                    <input
                      type="checkbox"
                      defaultChecked={item.sms}
                      className="h-4 w-4 rounded border-forest-200 text-forest-500 focus:ring-forest-500/20"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InstallerSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("entreprise");

  return (
    <>
      <Topbar
        title="Paramètres"
        description="Configuration de votre compte installateur"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 overflow-x-auto w-fit">
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
              <tab.icon
                className={`h-4 w-4 ${
                  activeTab === tab.value ? "text-forest-500" : "text-ink-400"
                }`}
                strokeWidth={1.8}
              />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
          {activeTab === "entreprise" && <EntrepriseTab />}
          {activeTab === "abonnement" && <AbonnementTab />}
          {activeTab === "equipe" && <EquipeTab />}
          {activeTab === "notifications" && <NotificationsTab />}
        </div>
      </div>
    </>
  );
}
