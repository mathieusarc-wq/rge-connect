"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Store, Building2 } from "lucide-react";
import SubcontractorRegisterForm from "./subcontractor-form";
import InstallerRegisterForm from "./installer-form";

export default function RegisterClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get("role");

  // Page de sélection du rôle
  if (role !== "subcontractor" && role !== "installer") {
    return <RoleSelection onSelect={(r) => router.push(`/register?role=${r}`)} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header simple */}
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
            J&apos;ai déjà un compte
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-2xl px-6">
          <button
            onClick={() => router.push("/register")}
            className="inline-flex items-center gap-1.5 text-xs font-body text-ink-500 hover:text-ink-700 transition-colors mb-6"
          >
            <ArrowLeft className="h-3 w-3" />
            Changer de profil
          </button>

          {role === "subcontractor" ? (
            <SubcontractorRegisterForm />
          ) : (
            <InstallerRegisterForm />
          )}
        </div>
      </main>
    </div>
  );
}

function RoleSelection({
  onSelect,
}: {
  onSelect: (role: "subcontractor" | "installer") => void;
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
          <Link
            href="/login"
            className="text-sm font-body text-ink-500 hover:text-ink-700 transition-colors"
          >
            J&apos;ai déjà un compte
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-ink-900 tracking-tight">
              Rejoins RGE Connect
            </h1>
            <p className="mt-3 text-base font-body text-ink-500">
              Quel profil correspond à ton activité ?
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => onSelect("subcontractor")}
              className="rounded-xl border-2 border-forest-100 bg-white p-6 shadow-sm hover:border-forest-500 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="h-12 w-12 rounded-lg bg-forest-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Store className="h-6 w-6 text-cream-50" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-display font-bold text-ink-900 mb-1">
                Je suis artisan RGE
              </h3>
              <p className="text-sm font-body text-ink-500 leading-relaxed">
                J&apos;accepte des missions de pose (PAC, PV, clim, ITE...) via
                la marketplace et je suis payé par séquestre sécurisé.
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 group-hover:text-forest-700">
                Créer un compte sous-traitant
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>

            <button
              onClick={() => onSelect("installer")}
              className="rounded-xl border-2 border-forest-100 bg-white p-6 shadow-sm hover:border-forest-500 hover:shadow-md transition-all duration-200 text-left group"
            >
              <div className="h-12 w-12 rounded-lg bg-gold-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="h-6 w-6 text-forest-900" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-display font-bold text-ink-900 mb-1">
                Je suis installateur
              </h3>
              <p className="text-sm font-body text-ink-500 leading-relaxed">
                Je vends des installations ENR et je confie la pose à des
                artisans RGE certifiés via RGE Connect.
              </p>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-body font-medium text-forest-500 group-hover:text-forest-700">
                Créer un compte installateur
                <ArrowRight className="h-3 w-3" />
              </div>
            </button>
          </div>

          <p className="mt-8 text-center text-sm font-body text-ink-500">
            Déjà inscrit ?{" "}
            <Link
              href="/login"
              className="font-medium text-forest-500 hover:text-forest-700 transition-colors"
            >
              Connexion
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
