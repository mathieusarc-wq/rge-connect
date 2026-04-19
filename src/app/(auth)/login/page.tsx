"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInAction } from "./actions";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await signInAction(formData);
      if (!result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-cream-50">
      {/* Mobile header — logo en haut */}
      <div className="lg:hidden flex items-center justify-center pt-8 pb-4 bg-cream-50">
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

      {/* Left — Form (centré horizontalement + verticalement) */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 py-8 lg:py-0 bg-white">
        <div className="w-full max-w-md">
          {/* Logo desktop only */}
          <Link href="/" className="hidden lg:flex items-center gap-0 mb-12 justify-center">
            <span className="font-display text-xl font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-xl font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </Link>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
            Connexion
          </h1>
          <p className="mt-2 text-sm font-body text-ink-500">
            Accédez à votre espace RGE Connect
          </p>

          {/* Error */}
          {error && (
            <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
              <p className="text-sm font-body text-red-700 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-body font-medium text-ink-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                required
                placeholder="vous@entreprise.fr"
                className="h-12 bg-cream-50 border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20 text-base"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-body font-medium text-ink-700"
                >
                  Mot de passe
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-body text-forest-500 hover:text-forest-700 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Votre mot de passe"
                  className="h-12 bg-cream-50 border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20 pr-11 text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-3.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm font-body text-ink-500">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="font-medium text-forest-500 hover:text-forest-700 transition-colors"
            >
              Créer un compte
            </Link>
          </p>

          {/* Trust signals mobile */}
          <div className="lg:hidden mt-10 pt-6 border-t border-forest-100/50">
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono uppercase tracking-wider text-ink-400">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-gold-500" strokeWidth={2} />
                eIDAS
              </span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>Séquestre Mangopay</span>
              <span className="h-1 w-1 rounded-full bg-ink-300" />
              <span>RGPD</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right — Visual (desktop only) */}
      <div className="hidden lg:flex lg:flex-1 relative bg-forest-900 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-forest-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gold-500/5 blur-[100px]" />

        <div className="relative flex flex-col justify-center px-16 xl:px-24 w-full">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/20 border border-forest-400/20 px-4 py-1.5">
              <Shield className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-gold-400">
                Plateforme professionnelle
              </span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-display font-bold text-cream-50 leading-[1.05] tracking-tight">
              Sous-traitez vos chantiers
              <br />
              <span className="text-gold-400">en toute sécurité.</span>
            </h2>

            <p className="text-base font-body text-ink-300 max-w-md leading-relaxed">
              La plateforme qui relie installateurs ENR et artisans RGE certifiés.
              Chantiers sécurisés, paiements garantis, qualité vérifiée.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <p className="text-sm font-body text-cream-100">
                  Artisans RGE certifiés de votre zone, notés par vos clients
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
                </div>
                <p className="text-sm font-body text-cream-100">
                  Chantier suivi de A à Z : ordre de mission, créneaux, PV électronique
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-body text-cream-100">
                  Paiement par séquestre, photos horodatées eIDAS, décennale partenaire
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
