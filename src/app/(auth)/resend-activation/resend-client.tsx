"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resendActivationEmail } from "./actions";

export default function ResendActivationClient() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(initialEmail);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { kind: "idle" }
    | { kind: "success" }
    | { kind: "error"; message: string }
  >({ kind: "idle" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult({ kind: "idle" });
    startTransition(async () => {
      const r = await resendActivationEmail(email);
      if (r.success) {
        setResult({ kind: "success" });
      } else {
        setResult({ kind: "error", message: r.error });
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
          <Link
            href="/login"
            className="text-sm font-body text-ink-500 hover:text-ink-700 transition-colors"
          >
            Retour à la connexion
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-3 w-3" />
            Retour
          </Link>

          {/* Icône */}
          <div className="mx-auto h-14 w-14 rounded-full bg-gold-500/10 flex items-center justify-center mb-5">
            <Mail className="h-6 w-6 text-gold-600" strokeWidth={1.8} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight text-center">
            Renvoyer l&apos;email d&apos;activation
          </h1>
          <p className="mt-3 text-sm font-body text-ink-600 leading-relaxed text-center">
            Entre ton adresse email pour recevoir un nouveau lien d&apos;activation. Le lien précédent sera invalidé.
          </p>

          {/* Success state */}
          {result.kind === "success" && (
            <div className="mt-6 rounded-lg bg-forest-50 border border-forest-200 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-forest-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
                <div>
                  <p className="text-sm font-body font-semibold text-forest-700">
                    Email envoyé
                  </p>
                  <p className="text-xs font-body text-ink-600 mt-1">
                    Consulte ta boîte mail (et les spams). Le nouveau lien est valable 24h.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {result.kind === "error" && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
              <p className="text-sm font-body text-red-700 leading-relaxed">
                {result.message}
              </p>
            </div>
          )}

          {/* Form */}
          {result.kind !== "success" && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-body font-medium text-ink-700"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoCapitalize="off"
                  spellCheck={false}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.fr"
                  className="h-12 bg-cream-50 border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20 text-base"
                />
              </div>

              <button
                type="submit"
                disabled={isPending || !email.includes("@")}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-3.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Envoi en cours…
                  </>
                ) : (
                  <>
                    Envoyer un nouveau lien
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {result.kind === "success" && (
            <div className="mt-6">
              <Link
                href="/login"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-3 text-sm font-body font-medium text-ink-700 hover:border-forest-200 transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          )}

          <p className="mt-8 text-center text-xs font-body text-ink-400">
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
