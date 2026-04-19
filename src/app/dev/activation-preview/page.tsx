"use client";

import { useState } from "react";
import ActivationSuccess from "@/app/(auth)/activate/success-client";
import { CheckCircle2, AlertCircle, ArrowRight, Mail } from "lucide-react";
import Link from "next/link";

export default function ActivationPreviewPage() {
  const [state, setState] = useState<"success" | "error" | "info">("success");

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Selector */}
      <div className="bg-white border-b border-forest-100 sticky top-0 z-50 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <div className="flex items-center gap-3">
            <p className="text-sm font-body font-semibold text-ink-900 mr-2">
              Preview état :
            </p>
            <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1">
              {(["success", "error", "info"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setState(s)}
                  className={`rounded-md px-3 py-1.5 text-xs font-body font-medium capitalize transition-all ${
                    state === s
                      ? "bg-white text-forest-600 shadow-sm"
                      : "text-ink-500 hover:text-ink-700"
                  }`}
                >
                  {s === "success"
                    ? "Succès"
                    : s === "error"
                    ? "Erreur"
                    : "Info (par défaut)"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {state === "success" && (
        <ActivationSuccess
          firstName="Thomas"
          redirectTo="/onboarding/documents"
          previewMode
        />
      )}

      {state === "error" && (
        <ActivationResult
          kind="error"
          title="Lien invalide ou expiré"
          message="Le lien d'activation est invalide ou a expiré. Demande un nouveau lien ci-dessous."
          showResend
        />
      )}

      {state === "info" && (
        <ActivationResult
          kind="info"
          title="En attente d'activation"
          message="Clique sur le lien reçu par email pour activer ton compte. Tu n'as rien reçu ?"
          showResend
        />
      )}
    </div>
  );
}

// Copie du composant ActivationResult depuis /activate/page.tsx pour le preview
function ActivationResult({
  kind,
  title,
  message,
  showResend = false,
}: {
  kind: "success" | "error" | "info";
  title: string;
  message: string;
  showResend?: boolean;
}) {
  return (
    <div className="min-h-[calc(100vh-60px)] flex flex-col bg-cream-50">
      <header className="border-b border-forest-100 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-0">
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <div
            className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6 ${
              kind === "error" ? "bg-red-500" : "bg-gold-500"
            }`}
          >
            {kind === "error" ? (
              <AlertCircle className="h-8 w-8 text-cream-50" strokeWidth={1.8} />
            ) : (
              <CheckCircle2 className="h-8 w-8 text-cream-50" strokeWidth={1.8} />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
            {title}
          </h1>
          <p className="mt-3 text-base font-body text-ink-600 leading-relaxed">
            {message}
          </p>

          <div className="mt-8 space-y-3">
            {showResend && (
              <Link
                href="/resend-activation"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors"
              >
                <Mail className="h-4 w-4" strokeWidth={1.8} />
                Renvoyer un email d&apos;activation
              </Link>
            )}
            <Link
              href="/login"
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-body font-semibold transition-colors ${
                showResend
                  ? "border border-forest-100 bg-white text-ink-700 hover:border-forest-200"
                  : "bg-forest-500 text-cream-50 hover:bg-forest-600"
              }`}
            >
              Retour à la connexion
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
