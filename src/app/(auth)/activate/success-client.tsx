"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";

export default function ActivationSuccess({
  firstName,
  redirectTo,
}: {
  firstName: string;
  redirectTo: string;
}) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    const timer = setTimeout(() => {
      router.push(redirectTo);
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router, redirectTo]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Header */}
      <header className="border-b border-forest-100 bg-white">
        <div className="mx-auto max-w-4xl flex items-center justify-center px-6 py-4">
          <div className="flex items-center gap-0">
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          {/* Icône success avec animation */}
          <div className="mx-auto h-20 w-20 rounded-full bg-forest-500 flex items-center justify-center mb-6 animate-in fade-in zoom-in duration-500">
            <CheckCircle2 className="h-10 w-10 text-cream-50" strokeWidth={1.8} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
            Compte activé
          </h1>
          <p className="mt-3 text-base font-body text-ink-600 leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
            {firstName ? (
              <>
                Bienvenue sur RGE Connect, <strong className="text-ink-900">{firstName}</strong>.
              </>
            ) : (
              <>Bienvenue sur RGE Connect.</>
            )}
          </p>

          <div className="mt-8 rounded-xl border border-forest-100 bg-white p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-gold-600" strokeWidth={2} />
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-semibold text-ink-900">
                  Prochaine étape
                </p>
                <p className="text-xs font-body text-ink-500">
                  Upload tes documents avec l&apos;IA RGE Connect Vision
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm font-body text-ink-500 animate-in fade-in duration-500 delay-300">
            <Loader2 className="h-4 w-4 animate-spin text-forest-500" />
            <span>
              Redirection dans <strong className="text-forest-600 font-mono">{countdown}</strong> …
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
