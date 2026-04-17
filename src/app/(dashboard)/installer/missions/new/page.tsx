"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  ArrowLeft,
  ArrowRight,
  User,
  MapPin,
  Wrench,
  Euro,
  Calendar,
  FileText,
  Check,
} from "lucide-react";
import Link from "next/link";

const missionTypes = [
  { value: "pac_air_eau", label: "PAC Air-Eau" },
  { value: "pac_air_air", label: "PAC Air-Air" },
  { value: "climatisation", label: "Climatisation" },
  { value: "pv", label: "Photovoltaïque" },
  { value: "ite", label: "ITE" },
  { value: "isolation_combles", label: "Isolation combles" },
  { value: "ssc", label: "SSC (Solaire thermique)" },
];

const steps = [
  { id: 1, title: "Client final", icon: User },
  { id: 2, title: "Adresse chantier", icon: MapPin },
  { id: 3, title: "Équipement", icon: Wrench },
  { id: 4, title: "Montant & délais", icon: Euro },
  { id: 5, title: "Récapitulatif", icon: Check },
];

export default function NewMissionPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    client_first_name: "",
    client_last_name: "",
    client_email: "",
    client_phone: "",
    address: "",
    city: "",
    postal_code: "",
    type: "",
    equipment: "",
    equipment_brand: "",
    notes: "",
    amount_ht: "",
    amount_ttc: "",
    preferred_start_date: "",
    preferred_end_date: "",
    payment_delay_days: 30,
  });

  const update = (key: string, value: string | number) =>
    setFormData((d) => ({ ...d, [key]: value }));

  return (
    <>
      <Topbar title="Nouvelle mission" description="Création d'un chantier" />

      <div className="px-6 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
        {/* Back link */}
        <Link
          href="/installer/missions"
          className="inline-flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux missions
        </Link>

        {/* Stepper */}
        <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isDone
                          ? "bg-forest-500 text-cream-50"
                          : isActive
                          ? "bg-gold-500 text-forest-900"
                          : "bg-cream-100 text-ink-400"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : (
                        <span className="text-xs font-mono font-semibold">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-body font-medium hidden md:inline ${
                        isActive
                          ? "text-forest-600"
                          : isDone
                          ? "text-ink-700"
                          : "text-ink-400"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-3 ${
                        isDone ? "bg-forest-500" : "bg-cream-200"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form step */}
        <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Informations du client final
                </h3>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Le client qui reçoit la prestation
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Prénom *
                  </Label>
                  <Input
                    value={formData.client_first_name}
                    onChange={(e) => update("client_first_name", e.target.value)}
                    placeholder="Marie"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Nom *
                  </Label>
                  <Input
                    value={formData.client_last_name}
                    onChange={(e) => update("client_last_name", e.target.value)}
                    placeholder="Dupont"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Email
                  </Label>
                  <Input
                    type="email"
                    value={formData.client_email}
                    onChange={(e) => update("client_email", e.target.value)}
                    placeholder="marie.dupont@email.fr"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Téléphone
                  </Label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) => update("client_phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
              </div>
              <div className="rounded-lg bg-forest-50 border border-forest-100 p-3 text-xs font-body text-ink-600">
                Au moins un moyen de contact (email ou téléphone) est
                obligatoire pour envoyer le lien de validation des créneaux.
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Adresse du chantier
                </h3>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Localisation pour matcher les sous-traitants dans la zone
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Adresse *
                  </Label>
                  <Input
                    value={formData.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="12 rue de la République"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-body font-medium text-ink-700">
                      Ville *
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Lyon 3ème"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-body font-medium text-ink-700">
                      Code postal *
                    </Label>
                    <Input
                      value={formData.postal_code}
                      onChange={(e) => update("postal_code", e.target.value)}
                      placeholder="69003"
                      maxLength={5}
                      className="h-11 bg-cream-50 border-forest-100 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Équipement à installer
                </h3>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Type de prestation et matériel
                </p>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Type de chantier *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {missionTypes.map((t) => (
                      <button
                        key={t.value}
                        onClick={() => update("type", t.value)}
                        className={`rounded-lg border px-3 py-2.5 text-sm font-body transition-all text-left ${
                          formData.type === t.value
                            ? "border-forest-500 bg-forest-50 text-forest-600"
                            : "border-forest-100 bg-white text-ink-600 hover:border-forest-200"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-body font-medium text-ink-700">
                      Modèle / référence
                    </Label>
                    <Input
                      value={formData.equipment}
                      onChange={(e) => update("equipment", e.target.value)}
                      placeholder="HEIWA Estia 11kW"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-body font-medium text-ink-700">
                      Marque
                    </Label>
                    <Input
                      value={formData.equipment_brand}
                      onChange={(e) => update("equipment_brand", e.target.value)}
                      placeholder="HEIWA"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Notes pour l&apos;artisan
                  </Label>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    placeholder="Accès par la cour, pas d'ascenseur, chien à l'étage..."
                    className="min-h-24 bg-cream-50 border-forest-100"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Montant et planification
                </h3>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Prix et délais souhaités
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Montant HT (€) *
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount_ht}
                    onChange={(e) => update("amount_ht", e.target.value)}
                    placeholder="4800"
                    className="h-11 bg-cream-50 border-forest-100 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Montant TTC (€)
                  </Label>
                  <Input
                    type="number"
                    value={formData.amount_ttc}
                    onChange={(e) => update("amount_ttc", e.target.value)}
                    placeholder="5280"
                    className="h-11 bg-cream-50 border-forest-100 font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Date de début souhaitée
                  </Label>
                  <Input
                    type="date"
                    value={formData.preferred_start_date}
                    onChange={(e) =>
                      update("preferred_start_date", e.target.value)
                    }
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    Date de fin souhaitée
                  </Label>
                  <Input
                    type="date"
                    value={formData.preferred_end_date}
                    onChange={(e) =>
                      update("preferred_end_date", e.target.value)
                    }
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
              </div>

              <div>
                <Label className="text-sm font-body font-medium text-ink-700 mb-2 block">
                  Délai de paiement (SEPA B2B auto)
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 30, 45].map((days) => (
                    <button
                      key={days}
                      onClick={() => update("payment_delay_days", days)}
                      className={`rounded-lg border px-3 py-3 text-sm font-body transition-all ${
                        formData.payment_delay_days === days
                          ? "border-forest-500 bg-forest-50 text-forest-600"
                          : "border-forest-100 bg-white text-ink-600 hover:border-forest-200"
                      }`}
                    >
                      <span className="font-display font-bold">J+{days}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-gold-500/5 border border-gold-300/30 p-4">
                <div className="flex items-start gap-3">
                  <Euro className="h-4 w-4 text-gold-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs font-body text-ink-700 leading-relaxed">
                    <span className="font-semibold">
                      Commission RGE Connect :
                    </span>{" "}
                    3% du montant HT —{" "}
                    <span className="font-mono text-gold-700">
                      {formData.amount_ht
                        ? `${(parseFloat(formData.amount_ht) * 0.03).toFixed(
                            2
                          )} €`
                        : "—"}
                    </span>
                    <br />
                    Prélevé automatiquement lors du reversement au sous-traitant
                    après exécution du chantier.
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Récapitulatif
                </h3>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Vérifie les infos avant publication sur la marketplace
                </p>
              </div>
              <div className="space-y-3">
                <RecapRow
                  label="Client"
                  value={`${formData.client_first_name} ${formData.client_last_name}`}
                />
                <RecapRow
                  label="Contact"
                  value={`${formData.client_email ?? "—"} · ${
                    formData.client_phone ?? "—"
                  }`}
                />
                <RecapRow
                  label="Adresse"
                  value={`${formData.address}, ${formData.postal_code} ${formData.city}`}
                />
                <RecapRow
                  label="Type"
                  value={
                    missionTypes.find((t) => t.value === formData.type)
                      ?.label ?? "—"
                  }
                />
                <RecapRow
                  label="Équipement"
                  value={`${formData.equipment_brand ?? ""} ${
                    formData.equipment ?? ""
                  }`.trim() || "—"}
                />
                <RecapRow
                  label="Montant HT"
                  value={formData.amount_ht ? `${formData.amount_ht} €` : "—"}
                />
                <RecapRow
                  label="Délai paiement"
                  value={`J+${formData.payment_delay_days}`}
                />
                <RecapRow
                  label="Dates souhaitées"
                  value={`${formData.preferred_start_date || "—"} → ${
                    formData.preferred_end_date || "—"
                  }`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Précédent
          </button>

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300"
            >
              Suivant
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300">
              <FileText className="h-4 w-4" />
              Publier sur la marketplace
            </button>
          )}
        </div>
      </div>
    </>
  );
}

function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-forest-100/50 last:border-0">
      <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
        {label}
      </span>
      <span className="text-sm font-body text-ink-900 text-right">{value}</span>
    </div>
  );
}
