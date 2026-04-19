import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import type { EmailOtpType } from "@supabase/supabase-js";
import ActivationSuccess from "./success-client";

interface PageProps {
  searchParams: Promise<{
    token_hash?: string;
    type?: string;
    code?: string;
    error?: string;
    error_description?: string;
  }>;
}

export default async function ActivatePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Erreur explicite
  if (params.error) {
    return (
      <ActivationResult
        kind="error"
        title="Lien invalide ou expiré"
        message={
          params.error_description ??
          "Le lien d'activation est invalide ou a expiré. Demande un nouveau lien ci-dessous."
        }
        showResend
      />
    );
  }

  const supabase = await createClient();

  // FLOW PRINCIPAL : token_hash
  if (params.token_hash && params.type) {
    const { error } = await supabase.auth.verifyOtp({
      type: params.type as EmailOtpType,
      token_hash: params.token_hash,
    });

    if (error) {
      return (
        <ActivationResult
          kind="error"
          title="Activation échouée"
          message={error.message}
          showResend
        />
      );
    }

    // Succès — récupère le profile pour personnaliser + déterminer le target onboarding
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = user
      ? await supabase
          .from("profiles")
          .select("role, first_name")
          .eq("id", user.id)
          .single()
      : { data: null };

    const firstName = profile?.first_name ?? "";
    const onboardingPath = "/onboarding/documents";

    // Affiche l'écran success côté client qui redirige ensuite
    return <ActivationSuccess firstName={firstName} redirectTo={onboardingPath} />;
  }

  // Fallback code PKCE
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);

    if (error) {
      return (
        <ActivationResult
          kind="error"
          title="Activation échouée"
          message={
            error.message.includes("code verifier")
              ? "Ce lien a été ouvert sur un autre appareil. Demande un nouveau lien ci-dessous."
              : error.message
          }
          showResend
        />
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = user
      ? await supabase
          .from("profiles")
          .select("role, first_name")
          .eq("id", user.id)
          .single()
      : { data: null };

    return (
      <ActivationSuccess
        firstName={profile?.first_name ?? ""}
        redirectTo="/onboarding/documents"
      />
    );
  }

  // Par défaut : pas de paramètres
  return (
    <ActivationResult
      kind="info"
      title="En attente d'activation"
      message="Clique sur le lien reçu par email pour activer ton compte. Tu n'as rien reçu ?"
      showResend
    />
  );
}

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
          <div
            className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-6 ${
              kind === "error"
                ? "bg-red-500"
                : kind === "success"
                ? "bg-forest-500"
                : "bg-gold-500"
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
