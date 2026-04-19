"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ArrowRight,
  X,
  Eye,
} from "lucide-react";
import { uploadAndAnalyzeDocument, type DocSlot, type UploadResult } from "./actions";

type DocConfig = {
  slot: DocSlot;
  label: string;
  description: string;
  required: boolean;
};

// Map qualif déclarée à l'inscription → slot RGE correspondant
const QUALIF_TO_SLOT: Record<string, DocSlot> = {
  QualiPac: "rge_qualipac",
  QualiPV: "rge_qualipv",
  QualiBois: "rge_qualibois",
  QualiSolCESI: "rge_qualisol_cesi",
  QualiSolSSC: "rge_qualisol_ssc",
  VentilationPlus: "rge_ventilation",
  QualibatITE: "rge_qualibat_ite",
  QualibatITIComble: "rge_qualibat_iti_combles",
  QualibatITIRampant: "rge_qualibat_iti_rampants",
  QualibatITIMur: "rge_qualibat_iti_murs",
  QualibatMenuiserie: "rge_qualibat_menuiserie",
};

const QUALIF_LABELS: Record<string, string> = {
  QualiPac: "Attestation QualiPac",
  QualiPV: "Attestation QualiPV",
  QualiBois: "Attestation QualiBois",
  QualiSolCESI: "Attestation QualiSol CESI",
  QualiSolSSC: "Attestation QualiSol SSC",
  VentilationPlus: "Attestation Ventilation+",
  QualibatITE: "Attestation Qualibat ITE",
  QualibatITIComble: "Attestation Qualibat ITI Combles",
  QualibatITIRampant: "Attestation Qualibat ITI Rampants",
  QualibatITIMur: "Attestation Qualibat ITI Murs intérieurs",
  QualibatMenuiserie: "Attestation Qualibat Menuiserie",
};

function buildSubcontractorDocs(qualifications: string[]): DocConfig[] {
  const docs: DocConfig[] = [
    {
      slot: "kbis",
      label: "Extrait Kbis",
      description: "De moins de 3 mois · PDF",
      required: true,
    },
    {
      slot: "decennale",
      label: "Assurance décennale",
      description: "Attestation en cours de validité",
      required: true,
    },
    {
      slot: "urssaf",
      label: "Attestation URSSAF de vigilance",
      description: "Datée de moins de 6 mois",
      required: true,
    },
    {
      slot: "rib",
      label: "RIB professionnel",
      description: "Au nom de ta société",
      required: true,
    },
  ];

  // Ajoute une attestation RGE par qualification déclarée
  qualifications.forEach((q) => {
    const slot = QUALIF_TO_SLOT[q];
    if (slot) {
      docs.push({
        slot,
        label: QUALIF_LABELS[q] ?? `Attestation ${q}`,
        description: "En cours de validité",
        required: true,
      });
    } else {
      // qualification custom (saisie libre)
      docs.push({
        slot: "rge_other",
        label: `Attestation ${q}`,
        description: "En cours de validité",
        required: true,
      });
    }
  });

  // Optionnel
  docs.push({
    slot: "carte_btp",
    label: "Carte professionnelle BTP",
    description: "Optionnel",
    required: false,
  });

  return docs;
}

function buildInstallerDocs(): DocConfig[] {
  return [
    {
      slot: "kbis",
      label: "Extrait Kbis",
      description: "De moins de 3 mois · PDF",
      required: true,
    },
    {
      slot: "rc_pro",
      label: "Assurance RC Pro",
      description: "Attestation en cours de validité",
      required: true,
    },
    {
      slot: "rib",
      label: "RIB professionnel",
      description: "Pour le mandat SEPA B2B",
      required: true,
    },
  ];
}

type DocState = {
  status: "idle" | "uploading" | "success" | "error";
  result?: UploadResult;
  fileName?: string;
};

export default function OnboardingClient({
  role,
  firstName,
  qualifications,
  existingDocs,
}: {
  role: "subcontractor" | "installer";
  firstName: string;
  qualifications: string[];
  existingDocs: Array<{ id: string; kind: string; file_name: string | null; status: string }>;
}) {
  const router = useRouter();
  const docs =
    role === "subcontractor"
      ? buildSubcontractorDocs(qualifications)
      : buildInstallerDocs();

  // Pré-remplir les states depuis les docs déjà uploadés (par kind)
  const initialStates: Record<string, DocState> = {};
  existingDocs.forEach((d) => {
    initialStates[d.kind] = {
      status: "success",
      fileName: d.file_name ?? undefined,
      result: {
        success: true,
        document_id: d.id,
        extracted: {},
        extraction_confidence: 0,
        extraction_quality: "good",
      } as UploadResult,
    };
  });

  const [states, setStates] = useState<Record<string, DocState>>(initialStates);

  const requiredDocs = docs.filter((d) => d.required);

  // Un doc est "validé" s'il est success ET validation.status === 'valid'
  const isDocValid = (slot: string): boolean => {
    const s = states[slot];
    if (!s || s.status !== "success" || !s.result?.success) return false;
    const validationStatus = s.result.validation?.status;
    // Si pas de validation (docs existants pré-chargés), on fait confiance au DB
    if (!validationStatus) return true;
    return validationStatus === "valid";
  };

  const completedRequired = requiredDocs.filter((d) => isDocValid(d.slot)).length;
  const blockedRequired = requiredDocs.filter((d) => {
    const s = states[d.slot];
    return s?.status === "success" && s.result?.success && s.result.validation?.status !== "valid";
  }).length;
  const progress = requiredDocs.length > 0 ? (completedRequired / requiredDocs.length) * 100 : 0;
  const allRequiredDone = completedRequired === requiredDocs.length;
  const needsNextStep = role === "subcontractor"; // sub doit définir zone ; installer direct → creating

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-forest-100 sticky top-0 z-40">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-0">
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-500">
              {completedRequired}/{requiredDocs.length} documents
            </span>
            <div className="w-20 h-1.5 bg-cream-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-8 sm:py-12">
        {/* Intro */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-3 py-1 mb-4">
            <Sparkles className="h-3 w-3 text-forest-900" strokeWidth={2.5} />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-forest-900 font-semibold">
              RGE Connect Vision
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
            {firstName ? `${firstName}, upload tes documents` : "Upload tes documents"}
          </h1>
          <p className="mt-2 text-base font-body text-ink-500">
            Notre IA analyse chaque document pour pré-remplir ton profil et vérifier les dates de validité. Tu pourras corriger les infos extraites.
          </p>
        </div>

        {/* Documents list */}
        <div className="space-y-4">
          {docs.map((doc) => (
            <DocumentSlot
              key={doc.slot}
              config={doc}
              state={states[doc.slot] ?? { status: "idle" }}
              onChange={(state) =>
                setStates((s) => ({ ...s, [doc.slot]: state }))
              }
            />
          ))}
        </div>

        {/* Alerte si docs bloqués */}
        {blockedRequired > 0 && (
          <div className="mt-8 rounded-xl border-2 border-red-200 bg-red-50 p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <p className="text-sm font-body font-semibold text-red-900">
                  {blockedRequired} document{blockedRequired > 1 ? "s" : ""} à corriger
                </p>
                <p className="text-xs font-body text-red-700 mt-1 leading-relaxed">
                  L&apos;IA a détecté des incohérences. Consulte les messages sur chaque document concerné et upload une version corrigée. Tu ne peux pas continuer tant que tous les documents obligatoires ne sont pas validés.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action */}
        <div className="mt-4 rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-body font-semibold text-ink-900">
                {allRequiredDone
                  ? "Tous tes documents sont validés par l'IA ✓"
                  : blockedRequired > 0
                  ? `${blockedRequired} document${blockedRequired > 1 ? "s" : ""} à corriger · ${requiredDocs.length - completedRequired - blockedRequired} restant${requiredDocs.length - completedRequired - blockedRequired > 1 ? "s" : ""}`
                  : `${requiredDocs.length - completedRequired} document${requiredDocs.length - completedRequired > 1 ? "s" : ""} à uploader`}
              </p>
              <p className="text-xs font-body text-ink-500 mt-0.5">
                {allRequiredDone
                  ? needsNextStep
                    ? "Prochaine étape : définir ta zone d'intervention."
                    : "Ton espace est prêt à être créé."
                  : "RGE Connect Vision vérifie chaque document : SIRET, dates, cohérence avec tes infos."}
              </p>
            </div>
            <button
              onClick={() => {
                const target = needsNextStep
                  ? "/onboarding/zone"
                  : "/onboarding/creating";
                router.push(target);
              }}
              disabled={!allRequiredDone}
              className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {needsNextStep ? "Continuer vers ma zone" : "Créer mon espace"}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

/* =========== DOCUMENT SLOT =========== */
function DocumentSlot({
  config,
  state,
  onChange,
}: {
  config: DocConfig;
  state: DocState;
  onChange: (state: DocState) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File | null) => {
    if (!file) return;

    if (file.type !== "application/pdf") {
      onChange({
        status: "error",
        fileName: file.name,
        result: { success: false, code: "bad_type", error: "Seuls les PDF sont acceptés." },
      });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      onChange({
        status: "error",
        fileName: file.name,
        result: { success: false, code: "too_large", error: "Max 10 MB." },
      });
      return;
    }

    onChange({ status: "uploading", fileName: file.name });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("slot", config.slot);

    startTransition(async () => {
      const result = await uploadAndAnalyzeDocument(formData);
      onChange({
        status: result.success ? "success" : "error",
        fileName: file.name,
        result,
      });
    });
  };

  return (
    <div
      className={`rounded-xl border-2 bg-white shadow-sm transition-all ${
        state.status === "success"
          ? "border-forest-300 bg-forest-50/30"
          : state.status === "error"
          ? "border-red-200"
          : dragOver
          ? "border-gold-500"
          : "border-forest-100"
      }`}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                state.status === "success"
                  ? "bg-forest-500"
                  : state.status === "error"
                  ? "bg-red-500"
                  : state.status === "uploading" || isPending
                  ? "bg-gold-500"
                  : "bg-cream-100"
              }`}
            >
              {state.status === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-cream-50" strokeWidth={2} />
              ) : state.status === "error" ? (
                <AlertCircle className="h-5 w-5 text-cream-50" strokeWidth={2} />
              ) : state.status === "uploading" || isPending ? (
                <Loader2 className="h-5 w-5 text-forest-900 animate-spin" strokeWidth={2} />
              ) : (
                <FileText className="h-5 w-5 text-ink-400" strokeWidth={1.8} />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-body font-semibold text-ink-900 truncate">
                  {config.label}
                </p>
                {config.required && (
                  <span className="text-xs font-mono text-red-500">*</span>
                )}
              </div>
              <p className="text-xs font-body text-ink-500">
                {state.fileName ? state.fileName : config.description}
              </p>
            </div>
          </div>

          {state.status === "success" && state.result?.success && (
            <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 border border-forest-200 px-2 py-0.5 text-xs font-mono text-forest-600 flex-shrink-0">
              <Sparkles className="h-3 w-3" strokeWidth={2.5} />
              IA
            </span>
          )}
        </div>

        {/* État idle : drop zone */}
        {state.status === "idle" && (
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
            className={`rounded-lg border border-dashed p-4 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-gold-500 bg-gold-500/5"
                : "border-forest-200 bg-cream-50 hover:border-forest-300"
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <div className="flex items-center justify-center gap-2 text-sm font-body text-ink-500">
              <Upload className="h-4 w-4" strokeWidth={1.8} />
              Glisse ou clique pour uploader un PDF
            </div>
          </div>
        )}

        {/* État uploading */}
        {(state.status === "uploading" || isPending) && (
          <div className="rounded-lg bg-gold-500/5 border border-gold-300/40 p-3 flex items-center gap-3">
            <Loader2 className="h-4 w-4 text-gold-600 animate-spin" />
            <div className="text-xs font-body text-ink-700">
              <p className="font-semibold">RGE Connect Vision analyse le document…</p>
              <p className="text-ink-500 mt-0.5">5 à 15 secondes</p>
            </div>
          </div>
        )}

        {/* État success : afficher les données extraites + issues */}
        {state.status === "success" && state.result?.success && (
          <ExtractedDataPreview
            data={state.result.extracted}
            confidence={state.result.extraction_confidence}
            quality={state.result.extraction_quality}
            validation={state.result.validation}
            onReset={() => onChange({ status: "idle" })}
          />
        )}

        {/* État error */}
        {state.status === "error" && state.result && !state.result.success && (
          <div className="rounded-lg bg-red-50 border border-red-200 p-3 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-red-900">
                {state.result.error}
              </p>
              <button
                onClick={() => onChange({ status: "idle" })}
                className="text-xs font-body font-medium text-red-700 hover:underline mt-1"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========== EXTRACTED PREVIEW =========== */
function ExtractedDataPreview({
  data,
  confidence,
  quality,
  validation,
  onReset,
}: {
  data: Record<string, unknown>;
  confidence: number;
  quality?: string;
  validation?: import("@/lib/ai/document-validator").ValidationResult;
  onReset: () => void;
}) {
  // `quality` is only used for audit logging, not rendered — kept for API completeness
  void quality;
  const [expanded, setExpanded] = useState(false);

  const displayEntries = Object.entries(data).filter(
    ([k, v]) =>
      v != null &&
      v !== "" &&
      !["confidence_score", "extraction_quality", "warnings"].includes(k)
  );

  const status = validation?.status ?? "valid";
  const issues = validation?.issues ?? [];
  const rejectedIssues = issues.filter((i) => i.severity === "rejected");
  const warningIssues = issues.filter((i) => i.severity === "warning");

  if (displayEntries.length === 0 && issues.length === 0) {
    return (
      <div className="rounded-lg bg-forest-50/60 border border-forest-200 p-3 text-sm font-body text-ink-700">
        Document enregistré.
        <button onClick={onReset} className="ml-2 text-xs text-forest-500 hover:underline">
          Remplacer
        </button>
      </div>
    );
  }

  // Card principale — couleur selon status
  const mainCardClass =
    status === "rejected"
      ? "bg-red-50/60 border-red-300"
      : status === "warning"
      ? "bg-gold-500/10 border-gold-300/40"
      : "bg-forest-50/60 border-forest-200";

  const statusLabel =
    status === "rejected"
      ? "Document rejeté"
      : status === "warning"
      ? "Vérification requise"
      : "Validé par l'IA";

  const statusColor =
    status === "rejected"
      ? "text-red-700"
      : status === "warning"
      ? "text-gold-700"
      : "text-forest-700";

  return (
    <div className="space-y-2">
      {/* Bloc ISSUES BLOQUANTES (rouge) */}
      {rejectedIssues.length > 0 && (
        <div className="rounded-lg bg-red-50 border-2 border-red-200 p-3">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-sm font-body font-semibold text-red-900">
              {rejectedIssues.length === 1 ? "1 problème bloquant" : `${rejectedIssues.length} problèmes bloquants`}
            </p>
          </div>
          <ul className="space-y-1.5 ml-6">
            {rejectedIssues.map((issue, i) => (
              <li key={i} className="text-xs font-body text-red-800 leading-relaxed list-disc">
                {issue.message}
              </li>
            ))}
          </ul>
          <div className="mt-3 pt-3 border-t border-red-200">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-500 px-3 py-1.5 text-xs font-body font-semibold text-white hover:bg-red-600 transition-colors"
            >
              <Upload className="h-3 w-3" />
              Uploader un autre document
            </button>
          </div>
        </div>
      )}

      {/* Bloc WARNINGS (gold) */}
      {warningIssues.length > 0 && rejectedIssues.length === 0 && (
        <div className="rounded-lg bg-gold-500/10 border border-gold-300/40 p-3">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-gold-700 flex-shrink-0 mt-0.5" strokeWidth={2} />
            <p className="text-sm font-body font-semibold text-gold-900">
              À vérifier
            </p>
          </div>
          <ul className="space-y-1 ml-6">
            {warningIssues.map((issue, i) => (
              <li key={i} className="text-xs font-body text-gold-800 leading-relaxed list-disc">
                {issue.message}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Card principale avec les données extraites */}
      <div className={`rounded-lg border p-3 ${mainCardClass}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {status === "valid" && <CheckCircle2 className="h-3.5 w-3.5 text-forest-600" strokeWidth={2.5} />}
            <span className={`text-xs font-body font-semibold ${statusColor}`}>
              {statusLabel} · confiance {confidence}%
            </span>
          </div>
          <div className="flex items-center gap-2">
            {displayEntries.length > 0 && (
              <button
                onClick={() => setExpanded((e) => !e)}
                className="text-xs font-body text-ink-600 hover:text-ink-800 transition-colors flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                {expanded ? "Masquer" : "Voir détails"}
              </button>
            )}
            <button
              onClick={onReset}
              className="text-xs font-body text-ink-500 hover:text-red-500 transition-colors"
              title="Remplacer le document"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-3 space-y-1.5 pt-3 border-t border-forest-200/50">
            {displayEntries.slice(0, 10).map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-3 text-xs">
                <span className="font-mono uppercase tracking-wider text-ink-400">
                  {k.replace(/_/g, " ")}
                </span>
                <span className="font-body text-ink-700 text-right break-words max-w-[60%]">
                  {String(v)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
