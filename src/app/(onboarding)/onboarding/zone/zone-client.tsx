"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { saveInterventionZone } from "./actions";

const ZoneMap = dynamic(
  () => import("@/components/dashboard/map/zone-map").then((m) => m.ZoneMap),
  {
    ssr: false,
    loading: () => (
      <div className="w-full rounded-xl bg-cream-100 animate-pulse" style={{ height: 480 }} />
    ),
  }
);

interface Props {
  subcontractorId: string;
  siegeAddress: string;
  siegeCity: string;
  siegePostalCode: string;
  initialLat: number;
  initialLng: number;
  initialRadius: number;
  firstName: string;
  demo?: boolean;
}

function getDepartements(r: number): string[] {
  const deps: string[] = [];
  if (r >= 10) deps.push("33 — Gironde");
  if (r >= 40) deps.push("40 — Landes", "47 — Lot-et-Garonne");
  if (r >= 70) deps.push("24 — Dordogne", "17 — Charente-Maritime");
  if (r >= 100) deps.push("16 — Charente", "64 — Pyrénées-Atlantiques");
  if (r >= 150) deps.push("32 — Gers", "46 — Lot");
  if (r >= 200) deps.push("87 — Haute-Vienne", "82 — Tarn-et-Garonne");
  if (r >= 300) deps.push("31 — Haute-Garonne", "79 — Deux-Sèvres", "86 — Vienne");
  if (r >= 400) deps.push("75 — Paris", "69 — Rhône", "44 — Loire-Atlantique");
  if (r >= 500) deps.push("+ 30 autres départements");
  if (r >= 700) deps.push("France métropolitaine quasi complète");
  if (r >= 900) deps.push("France métropolitaine complète");
  return deps;
}

export default function ZoneClient({
  subcontractorId,
  siegeAddress,
  siegeCity,
  siegePostalCode,
  initialLat,
  initialLng,
  initialRadius,
  firstName,
  demo,
}: Props) {
  const router = useRouter();
  const [radius, setRadius] = useState(initialRadius);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const departements = getDepartements(radius);

  const handleContinue = () => {
    if (demo) {
      router.push("/onboarding/creating?demo=1");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await saveInterventionZone({
        latitude: initialLat,
        longitude: initialLng,
        radius_km: radius,
      });
      if (result.success) {
        router.push("/onboarding/creating");
      } else {
        setError(result.error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-white border-b border-forest-100 sticky top-0 z-40">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
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
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-forest-500" />
              <div className="h-2 w-2 rounded-full bg-forest-500" />
              <div className="h-2 w-6 rounded-full bg-gold-500" />
              <div className="h-2 w-2 rounded-full bg-cream-200" />
            </div>
            <span className="text-xs font-mono text-ink-500">Étape 2/3</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Intro */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-3 py-1 mb-4">
            <MapPin className="h-3 w-3 text-forest-900" strokeWidth={2.5} />
            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-forest-900 font-semibold">
              Zone d&apos;intervention
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
            {firstName ? `${firstName}, définis ta zone` : "Définis ta zone"}
          </h1>
          <p className="mt-2 text-sm font-body text-ink-500 max-w-2xl">
            Seules les missions dans ce rayon te seront proposées. Tu pourras la modifier à tout moment depuis tes paramètres.
          </p>
        </div>

        {/* Carte + controls */}
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map 3 cols */}
          <div className="lg:col-span-3 rounded-xl border border-forest-100 overflow-hidden shadow-sm">
            <ZoneMap center={[initialLat, initialLng]} radiusKm={radius} />
          </div>

          {/* Controls 2 cols */}
          <div className="lg:col-span-2 space-y-5">
            <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-display font-bold text-ink-900 mb-1">
                Ton siège social
              </h3>
              <p className="text-sm font-body text-ink-600 leading-relaxed">
                {siegeAddress}
                <br />
                {siegePostalCode} {siegeCity}
              </p>
              <p className="text-xs font-body text-ink-400 mt-2">
                Centre de ta zone d&apos;intervention
              </p>
            </div>

            <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-body font-medium text-ink-700">
                  Rayon d&apos;intervention
                </label>
                <span className="text-2xl font-display font-extrabold text-forest-500">
                  {radius} km
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={1000}
                step={10}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-cream-200 accent-forest-500"
              />
              <div className="flex justify-between text-xs font-mono text-ink-400 mt-1">
                <span>10 km</span>
                <span>500 km</span>
                <span>1 000 km</span>
              </div>

              <div className="mt-4 pt-4 border-t border-forest-100">
                <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-2">
                  Départements couverts estimés ({departements.length})
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  {departements.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center rounded-md bg-cream-50 border border-forest-100 px-2 py-0.5 text-xs font-mono text-ink-600"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gold-500/5 border border-gold-300/30 p-3 flex items-start gap-2">
              <Sparkles className="h-3.5 w-3.5 text-gold-600 flex-shrink-0 mt-0.5" strokeWidth={2} />
              <p className="text-xs font-body text-ink-700 leading-relaxed">
                Limité à la <strong>France métropolitaine</strong>. Les missions hors zone ne te seront pas proposées.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
            <p className="text-sm font-body text-red-700">{error}</p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/onboarding/documents")}
            className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour aux documents
          </button>
          <button
            onClick={handleContinue}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-60"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Enregistrement…
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                Confirmer ma zone
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
}
