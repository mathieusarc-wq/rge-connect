"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, RotateCw, CheckCircle2 } from "lucide-react";
import { useTransition, useState } from "react";
import { resendActivationEmail } from "../../resend-activation/actions";

export default function SuccessClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<
    { kind: "success" | "error"; message: string } | null
  >(null);

  const handleResend = () => {
    if (!email) return;
    setFeedback(null);
    startTransition(async () => {
      const r = await resendActivationEmail(email);
      if (r.success) {
        setFeedback({ kind: "success", message: "Nouvel email envoyé." });
      } else {
        setFeedback({ kind: "error", message: r.error });
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
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
          {/* Success icon */}
          <div className="mx-auto h-16 w-16 rounded-full bg-forest-500 flex items-center justify-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-cream-50" strokeWidth={1.8} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
            Compte créé
          </h1>
          <p className="mt-3 text-base font-body text-ink-600 leading-relaxed">
            On t&apos;a envoyé un email de validation à :
          </p>
          {email && (
            <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white border border-forest-100 px-4 py-2 font-mono text-sm text-forest-700">
              <Mail className="h-3.5 w-3.5" strokeWidth={1.8} />
              {email}
            </p>
          )}

          <div className="mt-8 rounded-xl border border-forest-100 bg-white p-5 text-left space-y-3 shadow-sm">
            <h2 className="text-sm font-display font-bold text-ink-900 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-gold-500 text-forest-900 flex items-center justify-center text-xs font-mono font-bold">
                1
              </span>
              Vérifie ta boîte mail
            </h2>
            <p className="text-xs font-body text-ink-500 pl-7">
              Clique sur le lien reçu pour activer ton compte. Si tu ne vois rien, regarde dans les spams.
            </p>

            <div className="h-px bg-forest-100" />

            <h2 className="text-sm font-display font-bold text-ink-900 flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-gold-500 text-forest-900 flex items-center justify-center text-xs font-mono font-bold">
                2
              </span>
              Upload tes documents
            </h2>
            <p className="text-xs font-body text-ink-500 pl-7">
              Après activation, tu devras uploader les documents obligatoires (Kbis, attestations RGE, décennale, URSSAF) avant d&apos;accéder à la plateforme.
            </p>
          </div>

          {feedback && (
            <div
              className={`mt-6 rounded-lg border p-3 text-sm font-body text-left ${
                feedback.kind === "success"
                  ? "bg-forest-50 border-forest-200 text-forest-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {feedback.message}
            </div>
          )}

          <div className="mt-8 space-y-3">
            <button
              onClick={handleResend}
              disabled={isPending || !email}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body font-medium text-ink-700 hover:border-forest-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              <RotateCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
              {isPending ? "Envoi…" : "Renvoyer l'email de validation"}
            </button>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors"
            >
              Retour à la connexion
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <p className="mt-8 text-xs font-body text-ink-400">
            Besoin d&apos;aide ?{" "}
            <a
              href="mailto:support@rge-connect.fr"
              className="font-medium text-forest-500 hover:text-forest-700"
            >
              support@rge-connect.fr
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
