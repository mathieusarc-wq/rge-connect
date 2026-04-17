"use client";

import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Mail,
  CreditCard,
  FileSignature,
  Clock,
  Webhook,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { saveServiceKey } from "./actions";

type ServiceConfig = {
  service: string;
  title: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  description: string;
  accent: "gold" | "forest";
  keys: Array<{
    name: string;
    label: string;
    placeholder: string;
    isSensitive: boolean;
    isOptional?: boolean;
    description?: string;
    type?: "text" | "password" | "select";
    options?: string[];
  }>;
};

const SERVICES: ServiceConfig[] = [
  {
    service: "anthropic",
    title: "Anthropic (RGE Connect Vision)",
    icon: Sparkles,
    description:
      "IA Claude utilisée pour l'extraction automatique des devis et documents d'onboarding.",
    accent: "gold",
    keys: [
      {
        name: "api_key",
        label: "Clé API",
        placeholder: "sk-ant-...",
        isSensitive: true,
        description:
          "Depuis https://console.anthropic.com/settings/keys — crée une clé nommée rge-connect-prod.",
      },
      {
        name: "base_url",
        label: "Base URL (optionnel)",
        placeholder: "Laisser vide pour utiliser l'API Anthropic directement",
        isSensitive: false,
        isOptional: true,
        description:
          "À renseigner uniquement pour router via Vercel AI Gateway (observabilité + failover).",
      },
    ],
  },
  {
    service: "brevo",
    title: "Brevo (emails + SMS)",
    icon: Mail,
    description:
      "Envoi des emails transactionnels (activation, mission, paiement) et SMS (validation chantier, 2FA).",
    accent: "forest",
    keys: [
      {
        name: "api_key",
        label: "Clé API",
        placeholder: "xkeysib-...",
        isSensitive: true,
        description:
          "Depuis https://app.brevo.com/settings/keys/api — permission Full Access.",
      },
      {
        name: "sender_email",
        label: "Email expéditeur",
        placeholder: "no-reply@rge-connect.fr",
        isSensitive: false,
        description: "Domaine à vérifier dans Brevo (SPF + DKIM + DMARC).",
      },
      {
        name: "sender_name",
        label: "Nom expéditeur",
        placeholder: "RGE Connect",
        isSensitive: false,
      },
    ],
  },
  {
    service: "mangopay",
    title: "Mangopay (paiements)",
    icon: CreditCard,
    description:
      "Agent de paiement agréé. Séquestre, wallets, KYC, mandat SEPA B2B.",
    accent: "forest",
    keys: [
      {
        name: "client_id",
        label: "Client ID",
        placeholder: "rgeconnect-prod",
        isSensitive: false,
      },
      {
        name: "api_key",
        label: "Clé API (Passphrase)",
        placeholder: "...",
        isSensitive: true,
      },
      {
        name: "env",
        label: "Environnement",
        placeholder: "sandbox",
        isSensitive: false,
        type: "select",
        options: ["sandbox", "production"],
      },
    ],
  },
  {
    service: "yousign",
    title: "Yousign (signature eIDAS)",
    icon: FileSignature,
    description:
      "Signature électronique qualifiée du mandat SEPA B2B et du PV de réception de chantier.",
    accent: "forest",
    keys: [
      {
        name: "api_key",
        label: "Clé API",
        placeholder: "...",
        isSensitive: true,
      },
      {
        name: "webhook_secret",
        label: "Secret webhook",
        placeholder: "...",
        isSensitive: true,
        description:
          "Pour vérifier l'authenticité des callbacks (signature HMAC).",
      },
    ],
  },
  {
    service: "universign",
    title: "Universign (horodatage eIDAS)",
    icon: Clock,
    description:
      "Horodatage qualifié des photos de chantier et documents (preuve à valeur probante).",
    accent: "forest",
    keys: [
      {
        name: "api_key",
        label: "Clé API",
        placeholder: "...",
        isSensitive: true,
      },
      {
        name: "profile",
        label: "Profil",
        placeholder: "timestamp-prod",
        isSensitive: false,
      },
    ],
  },
  {
    service: "rge_connect",
    title: "Webhooks sortants",
    icon: Webhook,
    description:
      "Signature HMAC-SHA256 des webhooks envoyés aux CRM clients (Clim'Express, etc.).",
    accent: "gold",
    keys: [
      {
        name: "webhook_signing_secret",
        label: "Secret de signature",
        placeholder: "Généré aléatoirement, 64 caractères",
        isSensitive: true,
        description:
          "Utilisé pour signer chaque webhook sortant en HMAC-SHA256.",
      },
    ],
  },
  {
    service: "cron",
    title: "Cron (Vercel Cron Jobs)",
    icon: KeyRound,
    description:
      "Secret partagé entre Vercel Cron et les routes /api/cron/* pour autoriser l'exécution.",
    accent: "gold",
    keys: [
      {
        name: "secret",
        label: "Secret cron",
        placeholder: "Généré aléatoirement",
        isSensitive: true,
      },
    ],
  },
];

type SaveState = "idle" | "saving" | "saved" | "error";

export default function ApiKeysClient({
  initialValues,
  initialUpdatedAt,
}: {
  initialValues: Record<string, string>;
  initialUpdatedAt: Record<string, string>;
}) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-gold-700">
            Super Admin
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
          Clés API et secrets
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500 max-w-2xl">
          Configure ici les clés de tous les services externes. Les valeurs sont stockées chiffrées en DB Supabase (RLS stricte — accès super admin uniquement). Auto-save à chaque modification, cache invalidé en temps réel.
        </p>
      </div>

      <div className="space-y-5">
        {SERVICES.map((s) => (
          <ServiceSection
            key={s.service}
            config={s}
            initialValues={initialValues}
            initialUpdatedAt={initialUpdatedAt}
          />
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-forest-100 bg-white p-5 text-xs font-body text-ink-500 shadow-sm">
        <p className="font-semibold text-ink-900 mb-2">Ordre de priorité</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Valeur définie ici dans <code className="font-mono bg-cream-100 px-1 rounded">service_credentials</code> (cette page)
          </li>
          <li>
            Variable d&apos;environnement Vercel en fallback (ex:{" "}
            <code className="font-mono bg-cream-100 px-1 rounded">ANTHROPIC_API_KEY</code>)
          </li>
          <li>Service indisponible</li>
        </ol>
        <p className="mt-3">
          Dès qu&apos;une clé est renseignée ici, elle a la priorité sur l&apos;env var Vercel.
        </p>
      </div>
    </div>
  );
}

/* ============ SECTION D'UN SERVICE ============ */
function ServiceSection({
  config,
  initialValues,
  initialUpdatedAt,
}: {
  config: ServiceConfig;
  initialValues: Record<string, string>;
  initialUpdatedAt: Record<string, string>;
}) {
  const Icon = config.icon;
  const filled = config.keys.filter(
    (k) => initialValues[`${config.service}:${k.name}`] && !k.isOptional
  ).length;
  const required = config.keys.filter((k) => !k.isOptional).length;
  const isComplete = filled === required;

  return (
    <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-forest-100 flex items-start gap-4">
        <div
          className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            config.accent === "gold" ? "bg-gold-500/10" : "bg-forest-50"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${config.accent === "gold" ? "text-gold-600" : "text-forest-500"}`}
            strokeWidth={1.8}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-display font-bold text-ink-900">
              {config.title}
            </h2>
            {isComplete ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 border border-forest-200 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-forest-600">
                <CheckCircle2 className="h-2.5 w-2.5" strokeWidth={2.5} />
                Configuré
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-300/30 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold-700">
                {filled}/{required}
              </span>
            )}
          </div>
          <p className="text-xs font-body text-ink-500 mt-1">
            {config.description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-forest-100/50">
        {config.keys.map((k) => (
          <KeyRow
            key={k.name}
            service={config.service}
            keyConfig={k}
            initialValue={initialValues[`${config.service}:${k.name}`] ?? ""}
            lastUpdatedAt={initialUpdatedAt[`${config.service}:${k.name}`]}
          />
        ))}
      </div>
    </div>
  );
}

/* ============ ROW D'UNE CLÉ AVEC AUTO-SAVE ============ */
function KeyRow({
  service,
  keyConfig,
  initialValue,
  lastUpdatedAt,
}: {
  service: string;
  keyConfig: ServiceConfig["keys"][number];
  initialValue: string;
  lastUpdatedAt?: string;
}) {
  const [value, setValue] = useState(initialValue);
  const [revealed, setRevealed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef(initialValue);

  // Auto-save debounced (800ms après la dernière frappe)
  useEffect(() => {
    if (value === lastSavedRef.current) {
      // Pas de change depuis le dernier save
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSaveState("saving");
      setError(null);
      const result = await saveServiceKey(
        service,
        keyConfig.name,
        value,
        keyConfig.isSensitive,
        keyConfig.description
      );
      if (result.success) {
        lastSavedRef.current = value;
        setSaveState("saved");
        // Retour à idle après 2s
        setTimeout(() => setSaveState("idle"), 2000);
      } else {
        setSaveState("error");
        setError(result.error ?? "Erreur inconnue");
      }
    }, 800);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, service, keyConfig.name, keyConfig.isSensitive, keyConfig.description]);

  const displayValue =
    keyConfig.isSensitive && !revealed && value
      ? "•".repeat(Math.min(value.length, 32))
      : value;

  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div className="flex-1">
          <label className="text-sm font-body font-medium text-ink-700 flex items-center gap-2">
            {keyConfig.label}
            {keyConfig.isOptional && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-ink-400">
                optionnel
              </span>
            )}
          </label>
          {keyConfig.description && (
            <p className="text-xs font-body text-ink-500 mt-0.5">
              {keyConfig.description}
            </p>
          )}
        </div>
        <SaveStatus state={saveState} />
      </div>

      <div className="relative">
        {keyConfig.type === "select" ? (
          <select
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-10 w-full rounded-lg bg-cream-50 border border-forest-100 px-3 text-sm font-body text-ink-900 focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none"
          >
            <option value="">—</option>
            {keyConfig.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={keyConfig.isSensitive && !revealed ? "password" : "text"}
            value={revealed ? value : displayValue}
            onChange={(e) => setValue(e.target.value)}
            placeholder={keyConfig.placeholder}
            autoComplete="off"
            spellCheck={false}
            className="h-10 w-full rounded-lg bg-cream-50 border border-forest-100 px-3 pr-10 text-sm font-mono text-ink-900 placeholder:text-ink-400 placeholder:font-body focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none"
          />
        )}
        {keyConfig.isSensitive && value && (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-600 transition-colors"
          >
            {revealed ? (
              <EyeOff className="h-4 w-4" strokeWidth={1.8} />
            ) : (
              <Eye className="h-4 w-4" strokeWidth={1.8} />
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs font-body text-red-600 mt-1.5 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" strokeWidth={2} />
          {error}
        </p>
      )}

      {lastUpdatedAt && saveState === "idle" && (
        <p className="text-[10px] font-mono uppercase tracking-wider text-ink-400 mt-1.5">
          Modifié : {new Date(lastUpdatedAt).toLocaleString("fr-FR")}
        </p>
      )}
    </div>
  );
}

function SaveStatus({ state }: { state: SaveState }) {
  if (state === "saving") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-body text-ink-500">
        <Loader2 className="h-3 w-3 animate-spin" />
        Sauvegarde…
      </span>
    );
  }
  if (state === "saved") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-body text-forest-600 animate-in fade-in duration-200">
        <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
        Enregistré
      </span>
    );
  }
  if (state === "error") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-body text-red-600">
        <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
        Erreur
      </span>
    );
  }
  return null;
}
