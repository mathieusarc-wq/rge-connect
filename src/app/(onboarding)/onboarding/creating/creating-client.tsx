"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  FileText,
  MapPin,
  Store,
  Sparkles,
  Loader2,
} from "lucide-react";

const STEPS_SUBCONTRACTOR = [
  { id: 1, label: "Vérification de vos documents", icon: FileText },
  { id: 2, label: "Configuration de votre zone d'intervention", icon: MapPin },
  { id: 3, label: "Création de votre profil public", icon: Store },
  { id: 4, label: "Accès à la marketplace", icon: Sparkles },
];

const STEPS_INSTALLER = [
  { id: 1, label: "Vérification de vos documents", icon: FileText },
  { id: 2, label: "Configuration de votre compte installateur", icon: Store },
  { id: 3, label: "Activation de l'API et des webhooks", icon: Sparkles },
  { id: 4, label: "Accès à votre dashboard", icon: CheckCircle2 },
];

export default function CreatingClient({
  role,
  redirectTo,
  firstName,
}: {
  role: "subcontractor" | "installer";
  redirectTo: string;
  firstName: string;
}) {
  const router = useRouter();
  const steps = role === "installer" ? STEPS_INSTALLER : STEPS_SUBCONTRACTOR;
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Étapes successives 700ms chacune
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => {
        if (s >= steps.length) return s;
        return s + 1;
      });
    }, 700);

    // Barre de progression continue 0 → 100 sur 3s
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 2;
      });
    }, 60);

    // Redirect après 3.5s (après la dernière étape affichée)
    const redirectTimeout = setTimeout(() => {
      router.push(redirectTo);
    }, 3500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(redirectTimeout);
    };
  }, [router, redirectTo, steps.length]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50 relative overflow-hidden">
      {/* Grain texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />

      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-forest-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-gold-500/10 blur-[80px] pointer-events-none" />

      <div className="relative w-full max-w-xl px-6 py-12 text-center">
        {/* Logo RGE Connect */}
        <div className="inline-flex items-center gap-0 mb-10 animate-in fade-in zoom-in duration-700">
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-forest-500">
            RGE&nbsp;C
          </span>
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-gold-500">
            O
          </span>
          <span className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-forest-500">
            NNECT
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-700">
          Création de votre espace
          {firstName && <span className="text-forest-500">, {firstName}</span>}
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-100">
          Quelques secondes, on prépare tout pour vous.
        </p>

        {/* Progress bar */}
        <div className="mt-8 mx-auto max-w-md">
          <div className="h-1.5 w-full bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest-500 to-gold-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs font-mono text-ink-400 text-right">
            {progress}%
          </p>
        </div>

        {/* Steps list */}
        <div className="mt-10 mx-auto max-w-md space-y-3">
          {steps.map((step, i) => {
            const isDone = currentStep > i;
            const isActive = currentStep === i;
            const isPending = currentStep < i;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all duration-500 ${
                  isDone
                    ? "border-forest-200 bg-forest-50/50"
                    : isActive
                    ? "border-gold-300/60 bg-gold-500/5"
                    : "border-forest-100 bg-white opacity-40"
                }`}
                style={{
                  transform: `translateY(${isActive ? "0" : "0"})`,
                  opacity: isPending ? 0.4 : 1,
                }}
              >
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone
                      ? "bg-forest-500 text-cream-50"
                      : isActive
                      ? "bg-gold-500 text-forest-900"
                      : "bg-cream-100 text-ink-400"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" strokeWidth={2.5} />
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
                  ) : (
                    <step.icon className="h-4 w-4" strokeWidth={1.8} />
                  )}
                </div>
                <p
                  className={`text-sm font-body text-left flex-1 ${
                    isDone
                      ? "text-forest-700 font-medium"
                      : isActive
                      ? "text-ink-900 font-semibold"
                      : "text-ink-500"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Final message */}
        {currentStep >= steps.length && (
          <p className="mt-8 text-sm font-body text-forest-600 font-semibold animate-in fade-in duration-500">
            Bienvenue sur RGE Connect ✓
          </p>
        )}
      </div>
    </div>
  );
}
