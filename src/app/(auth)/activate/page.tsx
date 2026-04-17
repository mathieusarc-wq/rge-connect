import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    code?: string;
    error?: string;
    error_description?: string;
  }>;
}

export default async function ActivatePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Cas erreur explicite depuis Supabase
  if (params.error) {
    return (
      <ActivationResult
        kind="error"
        title="Lien invalide ou expiré"
        message={
          params.error_description ??
          "Le lien d'activation est invalide ou a expiré. Demande un nouveau lien depuis la page de connexion."
        }
      />
    );
  }

  // Cas code PKCE : on exchange
  if (params.code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);

    if (error) {
      return (
        <ActivationResult
          kind="error"
          title="Activation échouée"
          message={error.message}
        />
      );
    }

    // Succès — le user est maintenant loggé
    // Prochaine étape : onboarding documents (à venir en étape 6)
    // Pour l'instant, redirige vers dashboard
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      const target = profile?.role === "installer" ? "/installer/dashboard" : "/dashboard";
      redirect(target);
    }

    redirect("/login");
  }

  // Cas par défaut : pas de code
  return (
    <ActivationResult
      kind="info"
      title="En attente d'activation"
      message="Clique sur le lien que tu as reçu par email pour activer ton compte."
    />
  );
}

function ActivationResult({
  kind,
  title,
  message,
}: {
  kind: "success" | "error" | "info";
  title: string;
  message: string;
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

          <div className="mt-8">
            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors"
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
