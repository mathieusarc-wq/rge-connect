"use client";

import { useState, useRef, useTransition } from "react";
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
  Check,
  FileText,
  Sparkles,
  Upload,
  Loader2,
  AlertCircle,
  CheckCircle2,
  X,
  SkipForward,
} from "lucide-react";
import Link from "next/link";
import { analyzeDevis } from "./actions";
import type { MissionType } from "@/lib/ai/devis-extractor";

const missionTypes: { value: MissionType; label: string }[] = [
  { value: "pac_air_eau", label: "PAC Air-Eau" },
  { value: "pac_air_air", label: "PAC Air-Air" },
  { value: "climatisation", label: "Climatisation" },
  { value: "pv", label: "Photovoltaïque" },
  { value: "ite", label: "ITE" },
  { value: "isolation_combles", label: "Isolation combles" },
  { value: "ssc", label: "SSC (Solaire thermique)" },
];

const steps = [
  { id: 0, title: "Devis", icon: Sparkles },
  { id: 1, title: "Client final", icon: User },
  { id: 2, title: "Adresse chantier", icon: MapPin },
  { id: 3, title: "Équipement", icon: Wrench },
  { id: 4, title: "Montant & délais", icon: Euro },
  { id: 5, title: "Récapitulatif", icon: Check },
];

type FormState = {
  client_first_name: string;
  client_last_name: string;
  client_email: string;
  client_phone: string;
  address: string;
  city: string;
  postal_code: string;
  type: string;
  equipment: string;
  equipment_brand: string;
  notes: string;
  amount_ht: string;
  amount_ttc: string;
  preferred_start_date: string;
  preferred_end_date: string;
  payment_delay_days: number;
};

const emptyForm: FormState = {
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
};

/* ================ UPLOAD DEVIS STEP ================ */
function DevisUploadStep({
  onExtracted,
  onSkip,
}: {
  onExtracted: (form: FormState, fields: string[]) => void;
  onSkip: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<{
    overall: number;
    quality: string;
    count: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File | null) => {
    setError(null);
    setConfidence(null);
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Seuls les PDF sont acceptés.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError(`Fichier trop volumineux (${(f.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`);
      return;
    }
    setFile(f);
  };

  const runExtraction = () => {
    if (!file) return;
    setError(null);
    const formData = new FormData();
    formData.append("devis", file);

    startTransition(async () => {
      const result = await analyzeDevis(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }

      const d = result.data;
      const filled: FormState = {
        ...emptyForm,
        client_first_name: d.client_first_name ?? "",
        client_last_name: d.client_last_name ?? "",
        client_email: d.client_email ?? "",
        client_phone: d.client_phone ?? "",
        address: d.address ?? "",
        city: d.city ?? "",
        postal_code: d.postal_code ?? "",
        type: d.type === "unknown" ? "" : (d.type ?? ""),
        equipment: d.equipment ?? "",
        equipment_brand: d.equipment_brand ?? "",
        notes: d.notes ?? "",
        amount_ht: d.amount_ht ? String(d.amount_ht) : "",
        amount_ttc: d.amount_ttc ? String(d.amount_ttc) : "",
        preferred_start_date: d.preferred_start_date ?? "",
        preferred_end_date: "",
        payment_delay_days: 30,
      };
      setConfidence({
        overall: d.confidence.overall,
        quality: d.confidence.extraction_quality,
        count: d.extracted_fields.length,
      });
      // Slight delay to show success state
      setTimeout(() => onExtracted(filled, d.extracted_fields), 800);
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-gold-500" strokeWidth={1.8} />
          <span className="text-xs font-mono uppercase tracking-[0.15em] text-gold-700 font-semibold">
            Extraction automatique par IA
          </span>
        </div>
        <h3 className="text-lg font-display font-bold text-ink-900">
          Upload ton devis signé
        </h3>
        <p className="text-sm font-body text-ink-500 mt-1">
          Claude analyse le PDF et pré-remplit automatiquement les prochaines étapes. Tu peux aussi remplir manuellement.
        </p>
      </div>

      {/* Drop zone */}
      {!file && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0] ?? null);
          }}
          onClick={() => inputRef.current?.click()}
          className={`rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all ${
            dragOver
              ? "border-gold-500 bg-gold-500/5"
              : "border-forest-200 bg-cream-50 hover:border-forest-300 hover:bg-cream-100"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          />
          <div className="mx-auto h-12 w-12 rounded-full bg-forest-500/10 flex items-center justify-center mb-3">
            <Upload className="h-5 w-5 text-forest-500" strokeWidth={1.8} />
          </div>
          <p className="text-sm font-body font-medium text-ink-900">
            Glisse ton devis ici ou clique pour sélectionner
          </p>
          <p className="text-xs font-body text-ink-500 mt-1">
            PDF uniquement · max 10 MB
          </p>
        </div>
      )}

      {/* Selected file */}
      {file && (
        <div className="rounded-xl border border-forest-100 bg-white p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0">
            <FileText className="h-5 w-5 text-forest-500" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-medium text-ink-900 truncate">
              {file.name}
            </p>
            <p className="text-xs font-body text-ink-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          {!isPending && !confidence && (
            <button
              onClick={() => {
                setFile(null);
                setError(null);
              }}
              className="p-2 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-sm font-body font-medium text-red-900">
              Extraction impossible
            </p>
            <p className="text-xs font-body text-red-600 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className="rounded-lg bg-forest-50 border border-forest-100 p-4 flex items-center gap-3">
          <Loader2 className="h-5 w-5 text-forest-500 animate-spin" strokeWidth={1.8} />
          <div>
            <p className="text-sm font-body font-medium text-ink-900">
              Claude analyse le devis…
            </p>
            <p className="text-xs font-body text-ink-500 mt-0.5">
              Extraction des données en cours (5-15 secondes)
            </p>
          </div>
        </div>
      )}

      {/* Success */}
      {confidence && (
        <div className="rounded-lg bg-gradient-to-r from-gold-500/10 to-forest-500/5 border border-gold-300/40 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-forest-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
            <div className="flex-1">
              <p className="text-sm font-body font-semibold text-ink-900">
                Extraction réussie · qualité {confidence.quality}
              </p>
              <p className="text-xs font-body text-ink-600 mt-1">
                {confidence.count} champs pré-remplis · score de confiance {confidence.overall}%
              </p>
              <p className="text-xs font-body text-gold-700 mt-2 flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                Passage aux étapes suivantes…
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-forest-100">
        <button
          onClick={onSkip}
          className="inline-flex items-center gap-1.5 text-sm font-body text-ink-500 hover:text-ink-700 transition-colors"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Remplir manuellement
        </button>
        <button
          onClick={runExtraction}
          disabled={!file || isPending || !!confidence}
          className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyse en cours…
            </>
          ) : confidence ? (
            <>
              <CheckCircle2 className="h-4 w-4" />
              Terminé
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Lancer l&apos;analyse IA
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ================ AI BADGE FOR EXTRACTED FIELDS ================ */
function AiBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-300/40 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-gold-700"
      title="Pré-rempli par l'IA — vérifie et corrige si besoin"
    >
      <Sparkles className="h-2.5 w-2.5" strokeWidth={2.5} />
      IA
    </span>
  );
}

/* ================ RECAP ROW ================ */
function RecapRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-forest-100/50 last:border-0">
      <span className="text-xs font-mono uppercase tracking-wider text-ink-400">
        {label}
      </span>
      <span className="text-sm font-body text-ink-900 text-right">{value || "—"}</span>
    </div>
  );
}

/* ================ MAIN ================ */
export default function NewMissionPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(emptyForm);
  const [aiFields, setAiFields] = useState<Set<string>>(new Set());

  const update = (key: keyof FormState, value: string | number) => {
    setFormData((d) => ({ ...d, [key]: value }));
    // Si l'user édite un champ IA, on retire le badge
    if (aiFields.has(key as string)) {
      setAiFields((prev) => {
        const next = new Set(prev);
        next.delete(key as string);
        return next;
      });
    }
  };

  const isAi = (field: string) => aiFields.has(field);

  const handleExtracted = (filled: FormState, fields: string[]) => {
    setFormData(filled);
    setAiFields(new Set(fields));
    setCurrentStep(1);
  };

  const handleSkip = () => {
    setCurrentStep(1);
  };

  return (
    <>
      <Topbar title="Nouvelle mission" description="Création d'un chantier" />

      <div className="px-6 lg:px-8 py-6 max-w-4xl mx-auto space-y-6">
        <Link
          href="/installer/missions"
          className="inline-flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-700 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux missions
        </Link>

        {/* Stepper */}
        <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between overflow-x-auto">
            {steps.map((step, i) => {
              const isActive = currentStep === step.id;
              const isDone = currentStep > step.id;
              return (
                <div key={step.id} className="flex items-center flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                        isDone
                          ? "bg-forest-500 text-cream-50"
                          : isActive
                          ? step.id === 0
                            ? "bg-gold-500 text-forest-900"
                            : "bg-gold-500 text-forest-900"
                          : "bg-cream-100 text-ink-400"
                      }`}
                    >
                      {isDone ? (
                        <Check className="h-4 w-4" strokeWidth={2.5} />
                      ) : step.id === 0 && isActive ? (
                        <Sparkles className="h-4 w-4" strokeWidth={2} />
                      ) : (
                        <span className="text-xs font-mono font-semibold">
                          {step.id}
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-xs font-body font-medium hidden md:inline whitespace-nowrap ${
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
                      className={`flex-1 h-px mx-3 min-w-4 ${
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
          {currentStep === 0 && (
            <DevisUploadStep onExtracted={handleExtracted} onSkip={handleSkip} />
          )}

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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Prénom *
                    <AiBadge show={isAi("client_first_name")} />
                  </Label>
                  <Input
                    value={formData.client_first_name}
                    onChange={(e) => update("client_first_name", e.target.value)}
                    placeholder="Marie"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Nom *
                    <AiBadge show={isAi("client_last_name")} />
                  </Label>
                  <Input
                    value={formData.client_last_name}
                    onChange={(e) => update("client_last_name", e.target.value)}
                    placeholder="Dupont"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Email
                    <AiBadge show={isAi("client_email")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Téléphone
                    <AiBadge show={isAi("client_phone")} />
                  </Label>
                  <Input
                    value={formData.client_phone}
                    onChange={(e) => update("client_phone", e.target.value)}
                    placeholder="06 12 34 56 78"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Adresse *
                    <AiBadge show={isAi("address")} />
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
                    <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                      Ville *
                      <AiBadge show={isAi("city")} />
                    </Label>
                    <Input
                      value={formData.city}
                      onChange={(e) => update("city", e.target.value)}
                      placeholder="Lyon 3ème"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                      Code postal *
                      <AiBadge show={isAi("postal_code")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Type de chantier *
                    <AiBadge show={isAi("type")} />
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
                    <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                      Modèle / référence
                      <AiBadge show={isAi("equipment")} />
                    </Label>
                    <Input
                      value={formData.equipment}
                      onChange={(e) => update("equipment", e.target.value)}
                      placeholder="HEIWA Estia 11kW"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                      Marque
                      <AiBadge show={isAi("equipment_brand")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Notes pour l&apos;artisan
                    <AiBadge show={isAi("notes")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Montant HT (€) *
                    <AiBadge show={isAi("amount_ht")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Montant TTC (€)
                    <AiBadge show={isAi("amount_ttc")} />
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
                  <Label className="flex items-center gap-2 text-sm font-body font-medium text-ink-700">
                    Date de début souhaitée
                    <AiBadge show={isAi("preferred_start_date")} />
                  </Label>
                  <Input
                    type="date"
                    value={formData.preferred_start_date}
                    onChange={(e) => update("preferred_start_date", e.target.value)}
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Date de fin souhaitée
                  </Label>
                  <Input
                    type="date"
                    value={formData.preferred_end_date}
                    onChange={(e) => update("preferred_end_date", e.target.value)}
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
                        ? `${(parseFloat(formData.amount_ht) * 0.03).toFixed(2)} €`
                        : "—"}
                    </span>
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
              {aiFields.size > 0 && (
                <div className="rounded-lg bg-gold-500/5 border border-gold-300/30 p-3 flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-gold-600" strokeWidth={2} />
                  <span className="text-xs font-body text-ink-700">
                    {aiFields.size} champs pré-remplis par l&apos;IA — vérifiés et validés par toi.
                  </span>
                </div>
              )}
              <div className="space-y-3">
                <RecapRow
                  label="Client"
                  value={`${formData.client_first_name} ${formData.client_last_name}`}
                />
                <RecapRow
                  label="Contact"
                  value={`${formData.client_email || "—"} · ${formData.client_phone || "—"}`}
                />
                <RecapRow
                  label="Adresse"
                  value={`${formData.address}, ${formData.postal_code} ${formData.city}`}
                />
                <RecapRow
                  label="Type"
                  value={missionTypes.find((t) => t.value === formData.type)?.label ?? "—"}
                />
                <RecapRow
                  label="Équipement"
                  value={`${formData.equipment_brand} ${formData.equipment}`.trim() || "—"}
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
                  value={`${formData.preferred_start_date || "—"} → ${formData.preferred_end_date || "—"}`}
                />
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {currentStep > 0 && (
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
                className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors"
              >
                Suivant
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
                <Save className="h-4 w-4" />
                Publier sur la marketplace
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
