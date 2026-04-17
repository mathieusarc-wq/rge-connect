"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"subcontractor" | "installer">("subcontractor");

  return (
    <div className="min-h-screen flex">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-20 xl:px-28 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-0 mb-12">
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

          <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
            Connexion
          </h1>
          <p className="mt-2 text-sm font-body text-ink-500">
            Accédez à votre espace RGE Connect
          </p>

          {/* Role switch */}
          <div className="mt-8 flex rounded-lg bg-cream-100 p-1">
            <button
              onClick={() => setRole("subcontractor")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
                role === "subcontractor"
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              Sous-traitant
            </button>
            <button
              onClick={() => setRole("installer")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
                role === "installer"
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              Installateur
            </button>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-5" onSubmit={(e) => e.preventDefault()}>
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
                placeholder="vous@entreprise.fr"
                className="h-11 bg-cream-50 border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20"
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Votre mot de passe"
                  className="h-11 bg-cream-50 border-forest-100 text-ink-900 placeholder:text-ink-400 focus:border-forest-500 focus:ring-forest-500/20 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 transition-colors"
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
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-forest-500 px-4 py-3 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300 mt-2"
            >
              Se connecter
              <ArrowRight className="h-4 w-4" />
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
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex lg:flex-1 relative bg-forest-900 overflow-hidden">
        {/* Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-forest-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gold-500/5 blur-[100px]" />

        <div className="relative flex flex-col justify-center px-16 xl:px-24 w-full">
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-500/20 border border-forest-400/20 px-4 py-1.5">
              <Shield className="h-3.5 w-3.5 text-gold-400" strokeWidth={1.5} />
              <span className="text-xs font-mono uppercase tracking-[0.15em] text-gold-400">
                Plateforme professionnelle
              </span>
            </div>

            <h2 className="text-3xl xl:text-4xl font-display font-bold text-cream-50 leading-tight tracking-tight">
              La plateforme de mise en relation
              <br />
              <span className="text-gold-400">Installateurs & Sous-traitants RGE</span>
            </h2>

            <p className="text-base font-body text-ink-300 max-w-md leading-relaxed">
              Trouvez les bons artisans certifiés pour vos chantiers ENR.
              Gérez vos missions, sécurisez vos paiements et pilotez
              votre activité depuis un seul espace.
            </p>

            {/* Features list */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                </div>
                <p className="text-sm font-body text-cream-100">
                  Matching intelligent entre installateurs et artisans RGE certifiés
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <svg className="h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /></svg>
                </div>
                <p className="text-sm font-body text-cream-100">
                  Suivi complet du chantier : création, planification, exécution
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 text-gold-400" strokeWidth={1.5} />
                </div>
                <p className="text-sm font-body text-cream-100">
                  Paiements sécurisés par séquestre et documents certifiés eIDAS
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
