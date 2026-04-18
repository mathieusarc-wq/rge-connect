"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  Check,
  User,
  Building2,
  CreditCard,
  FileCheck,
  Shield,
  Star,
  Search,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpInstallerAction } from "./actions";
import { lookupSiret, type SiretLookupResult } from "@/lib/insee/lookup-siret";

type Step = 1 | 2 | 3 | 4;

type Plan = {
  id: string;
  name: string;
  price: string;
  original_price?: string;
  badge?: string;
  badge_accent?: "gold" | "forest";
  description: string;
  commission: string;
  features: string[];
  recommended: boolean;
  highlight?: boolean;
};

const PLANS: Plan[] = [
  {
    id: "discovery",
    name: "Découverte",
    price: "0",
    description: "Pour tester la plateforme sans engagement",
    commission: "3% par chantier",
    recommended: false,
    features: [
      "3 missions par mois maximum",
      "Marketplace d'artisans RGE certifiés",
      "Matching automatique par zone et métier",
      "Séquestre de paiement Mangopay",
      "Dashboard basique",
      "Support par email",
    ],
  },
  {
    id: "business",
    name: "Business",
    price: "0",
    original_price: "199",
    badge: "Offre de lancement · 10 premiers inscrits",
    badge_accent: "gold",
    description: "La totalité de la plateforme, sans limite",
    commission: "3% par chantier",
    recommended: true,
    highlight: true,
    features: [
      "Chantiers illimités",
      "API + intégration CRM (webhooks HMAC)",
      "Garantie chantier : remplacement sous 48h en cas de défaillance",
      "SAV unique RGE Connect (gestion des litiges centralisée)",
      "Dashboard + reporting complet (KPIs, export CSV)",
      "Centrale d'achat fournisseurs négociés (HEIWA, Daikin, Atlantic, Weber) jusqu'à -20%",
      "Photos horodatées eIDAS + PV électronique Yousign",
      "Alertes automatiques (missions non assignées, webhooks échec, paiements)",
      "Avis clients automatiques J+1 via Brevo",
      "Republication automatique des avis sur Google Business Profile",
      "Support prioritaire (réponse < 4h ouvrées)",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "499",
    description: "Sur-mesure pour grands comptes et groupes",
    commission: "3% par chantier",
    recommended: false,
    features: [
      "Tout ce qui est inclus dans Business",
      "Marque blanche (nom de domaine + logo personnalisé)",
      "Décennale parapluie en option (via courtier partenaire)",
      "Account manager dédié (joignable en direct)",
      "SLA 24/7 avec astreinte technique",
      "Contrat personnalisable (conditions particulières)",
      "Audit RGPD + sécurité semestriel",
      "Rapports et exports sur mesure",
      "Intégration API avancée (webhooks custom, endpoints dédiés)",
    ],
  },
];

const steps: { id: Step; title: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[] = [
  { id: 1, title: "Votre compte", icon: User },
  { id: 2, title: "Votre entreprise", icon: Building2 },
  { id: 3, title: "Plan", icon: CreditCard },
  { id: 4, title: "Confirmation", icon: FileCheck },
];

export default function InstallerRegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>("business");
  const [siretState, setSiretState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    result?: SiretLookupResult;
  }>({ status: "idle" });

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    company_name: "",
    siret: "",
    address: "",
    city: "",
    postal_code: "",
    phone: "",
    accept_terms: false,
  });

  const update = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // Auto-lookup SIRET via API INSEE (debounced 400ms)
  useEffect(() => {
    if (form.siret.length !== 14 || !/^\d{14}$/.test(form.siret)) {
      setSiretState({ status: "idle" });
      return;
    }
    setSiretState({ status: "loading" });
    const timer = setTimeout(async () => {
      const result = await lookupSiret(form.siret);
      setSiretState({ status: result.success ? "success" : "error", result });
      if (result.success) {
        setForm((f) => ({
          ...f,
          company_name: f.company_name || result.data.company_name,
          address: f.address || result.data.address,
          city: f.city || result.data.city,
          postal_code: f.postal_code || result.data.postal_code,
        }));
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [form.siret]);

  const canAdvance = () => {
    if (currentStep === 1) {
      return (
        form.first_name.trim().length > 0 &&
        form.last_name.trim().length > 0 &&
        form.email.includes("@") &&
        form.password.length >= 12
      );
    }
    if (currentStep === 2) {
      return (
        form.company_name.trim().length >= 2 &&
        /^\d{14}$/.test(form.siret) &&
        form.address.trim().length >= 3 &&
        form.city.trim().length > 0 &&
        /^\d{5}$/.test(form.postal_code) &&
        form.phone.trim().length > 0
      );
    }
    if (currentStep === 3) return !!selectedPlan;
    if (currentStep === 4) return form.accept_terms;
    return false;
  };

  const handleSubmit = () => {
    setError(null);
    startTransition(async () => {
      const result = await signUpInstallerAction(form);
      if (!result.success) {
        setError(result.error);
        if (result.code === "duplicate_email") setCurrentStep(1);
        else if (result.code === "duplicate_siret") setCurrentStep(2);
        return;
      }
      router.push(`/register/success?email=${encodeURIComponent(form.email)}`);
    });
  };

  const passwordScore = scorePassword(form.password);

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono text-gold-700">
            Inscription installateur
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-ink-900 tracking-tight">
          Créer ton compte installateur
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500">
          4 étapes · environ 2 min · ton compte est activé après validation email
        </p>
      </div>

      {/* Stepper */}
      <div className="rounded-xl border border-forest-100 bg-white p-4 shadow-sm mb-6">
        <div className="flex items-center justify-between overflow-x-auto">
          {steps.map((step, i) => {
            const isActive = currentStep === step.id;
            const isDone = currentStep > step.id;
            return (
              <div key={step.id} className="flex items-center flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-shrink-0">
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
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    ) : (
                      <span className="text-xs font-mono font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-body font-medium hidden sm:inline whitespace-nowrap ${
                      isActive ? "text-forest-600" : isDone ? "text-ink-700" : "text-ink-400"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 min-w-4 ${
                      isDone ? "bg-forest-500" : "bg-cream-200"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3.5 flex items-start gap-2.5 mb-6">
          <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
          <p className="text-sm font-body text-red-700 leading-relaxed">{error}</p>
        </div>
      )}

      <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm space-y-5">
        {/* ===== STEP 1 ===== */}
        {currentStep === 1 && (
          <>
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Ton compte personnel</h2>
              <p className="text-sm font-body text-ink-500 mt-1">
                Ces infos sont liées à ton compte utilisateur
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-body font-medium text-ink-700">Prénom *</Label>
                <Input
                  value={form.first_name}
                  onChange={(e) => update("first_name", e.target.value)}
                  autoComplete="given-name"
                  placeholder="Luc"
                  className="h-11 bg-cream-50 border-forest-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-body font-medium text-ink-700">Nom *</Label>
                <Input
                  value={form.last_name}
                  onChange={(e) => update("last_name", e.target.value)}
                  autoComplete="family-name"
                  placeholder="Martineau"
                  className="h-11 bg-cream-50 border-forest-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-ink-700">Email professionnel *</Label>
              <Input
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="off"
                spellCheck={false}
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="contact@lm-energy.fr"
                className="h-11 bg-cream-50 border-forest-100"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-body font-medium text-ink-700">
                Mot de passe * <span className="text-xs font-body text-ink-400">(min. 12 caractères)</span>
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Mot de passe fort"
                  className="h-11 bg-cream-50 border-forest-100 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-400 hover:text-ink-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <PasswordStrength score={passwordScore} />
            </div>
          </>
        )}

        {/* ===== STEP 2 ===== */}
        {currentStep === 2 && (
          <>
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Ton entreprise</h2>
              <p className="text-sm font-body text-ink-500 mt-1">
                Saisis ton SIRET et on récupère toutes tes infos depuis le registre officiel INSEE
              </p>
            </div>

            {/* Hero SIRET lookup */}
            <div className="rounded-xl border-2 border-gold-300/40 bg-gradient-to-br from-gold-500/5 to-forest-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-500 px-2.5 py-0.5">
                  <Search className="h-3 w-3 text-forest-900" strokeWidth={2.5} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-forest-900 font-semibold">
                    Auto-remplissage INSEE
                  </span>
                </span>
              </div>

              <Label className="text-base font-body font-semibold text-ink-900 mb-2 block">
                Quel est ton numéro SIRET ?
              </Label>
              <div className="relative">
                <Input
                  inputMode="numeric"
                  autoFocus
                  value={form.siret}
                  onChange={(e) => update("siret", e.target.value.replace(/\D/g, "").slice(0, 14))}
                  placeholder="1 2 3 4 5 6 7 8 9 0 0 0 1 2"
                  className={`h-14 bg-white border-2 text-lg font-mono tracking-widest pr-12 ${
                    siretState.status === "success"
                      ? "border-forest-500"
                      : siretState.status === "error"
                      ? "border-red-300"
                      : "border-forest-100"
                  }`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
                  {siretState.status === "loading" && (
                    <Loader2 className="h-5 w-5 text-forest-500 animate-spin" />
                  )}
                  {siretState.status === "success" && (
                    <CheckCircle2 className="h-5 w-5 text-forest-500" strokeWidth={2} />
                  )}
                  {siretState.status === "error" && (
                    <AlertCircle className="h-5 w-5 text-red-500" strokeWidth={2} />
                  )}
                  {siretState.status === "idle" && (
                    <Search className="h-5 w-5 text-ink-300" strokeWidth={1.8} />
                  )}
                </div>
              </div>
              <p className="text-xs font-body text-ink-500 mt-2">
                14 chiffres · on vérifie l&apos;existence et le statut de ton entreprise
              </p>
              <InstallerSiretFeedback state={siretState} />
            </div>

            {/* Infos récupérées */}
            {siretState.status === "success" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 pt-1">
                  <div className="h-6 w-6 rounded-full bg-forest-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-3.5 w-3.5 text-cream-50" strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm font-display font-bold text-ink-900">
                    Infos récupérées — vérifie et complète
                  </h3>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Raison sociale *
                  </Label>
                  <Input
                    value={form.company_name}
                    onChange={(e) => update("company_name", e.target.value)}
                    autoComplete="organization"
                    placeholder="LM Energy SAS"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Adresse du siège *
                  </Label>
                  <Input
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    autoComplete="street-address"
                    placeholder="25 rue des Entrepreneurs"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-sm font-body font-medium text-ink-700">Ville *</Label>
                    <Input
                      value={form.city}
                      onChange={(e) => update("city", e.target.value)}
                      autoComplete="address-level2"
                      placeholder="Paris"
                      className="h-11 bg-cream-50 border-forest-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-body font-medium text-ink-700">
                      Code postal *
                    </Label>
                    <Input
                      inputMode="numeric"
                      autoComplete="postal-code"
                      value={form.postal_code}
                      onChange={(e) => update("postal_code", e.target.value.replace(/\D/g, "").slice(0, 5))}
                      placeholder="75015"
                      className="h-11 bg-cream-50 border-forest-100 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-body font-medium text-ink-700">
                    Téléphone professionnel *
                  </Label>
                  <Input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="01 42 34 56 78"
                    className="h-11 bg-cream-50 border-forest-100"
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== STEP 3 — PLAN ===== */}
        {currentStep === 3 && (
          <>
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Choisis ton plan</h2>
              <p className="text-sm font-body text-ink-500 mt-1">
                Commission unique <strong className="text-ink-900">3% par chantier</strong> pour tous les plans. Tu peux changer à tout moment.
              </p>
            </div>

            <div className="space-y-4">
              {PLANS.map((plan) => {
                const selected = selectedPlan === plan.id;
                const hasPromo = !!plan.original_price;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`w-full rounded-xl border-2 p-5 text-left transition-all relative ${
                      selected
                        ? plan.highlight
                          ? "border-gold-500 bg-gradient-to-br from-gold-500/10 to-forest-500/5 shadow-md"
                          : "border-forest-500 bg-forest-50"
                        : plan.highlight
                        ? "border-gold-300/60 bg-gradient-to-br from-gold-500/5 to-transparent hover:border-gold-400"
                        : "border-forest-100 bg-white hover:border-forest-200"
                    }`}
                  >
                    {/* Badges haut-droite */}
                    <div className="absolute -top-3 right-4 flex items-center gap-1.5">
                      {plan.recommended && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-forest-500 px-2.5 py-0.5 shadow-sm">
                          <Star className="h-3 w-3 text-cream-50" strokeWidth={2.5} />
                          <span className="text-[10px] font-mono uppercase tracking-wider text-cream-50 font-semibold">
                            Recommandé
                          </span>
                        </div>
                      )}
                      {plan.badge && (
                        <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 shadow-sm ${
                          plan.badge_accent === "gold"
                            ? "bg-gold-500 text-forest-900"
                            : "bg-forest-500 text-cream-50"
                        }`}>
                          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
                          <span className="text-[10px] font-mono uppercase tracking-wider font-semibold">
                            {plan.badge}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-lg font-display font-bold text-ink-900">
                            {plan.name}
                          </span>
                          {hasPromo && (
                            <span className="text-base font-body text-ink-400 line-through">
                              {plan.original_price}€
                            </span>
                          )}
                          <span className={`text-3xl font-display font-extrabold ${
                            hasPromo ? "text-gold-600" : "text-forest-600"
                          }`}>
                            {plan.price === "0" ? "Gratuit" : `${plan.price}€`}
                          </span>
                          {plan.price !== "0" && (
                            <span className="text-xs font-body text-ink-500">/ mois</span>
                          )}
                        </div>
                        <p className="text-sm font-body text-ink-600 mt-1">
                          {plan.description}
                        </p>
                      </div>
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                        selected
                          ? "bg-forest-500 text-cream-50"
                          : "bg-cream-100 text-transparent"
                      }`}>
                        <Check className="h-3.5 w-3.5" strokeWidth={3} />
                      </div>
                    </div>

                    {/* Features list */}
                    <div className="space-y-1.5 pt-3 border-t border-forest-100/50">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check
                            className={`h-3.5 w-3.5 flex-shrink-0 mt-0.5 ${
                              plan.highlight ? "text-gold-600" : "text-forest-500"
                            }`}
                            strokeWidth={2.5}
                          />
                          <span className="text-xs font-body text-ink-700 leading-relaxed">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer commission */}
                    <div className="mt-4 pt-3 border-t border-forest-100/50">
                      <p className="text-xs font-mono text-ink-500">
                        + Commission <span className="text-gold-700 font-semibold">{plan.commission}</span>
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-lg bg-forest-50 border border-forest-100 p-3 text-xs font-body text-ink-600">
              <strong className="text-ink-900">Pas de prélèvement maintenant.</strong> Tu as jusqu&apos;à ta première mission publiée pour finaliser ton choix de plan. Les 10 premières inscriptions au plan Business ne seront jamais facturées pendant la phase de lancement.
            </div>
          </>
        )}

        {/* ===== STEP 4 ===== */}
        {currentStep === 4 && (
          <>
            <div>
              <h2 className="text-lg font-display font-bold text-ink-900">Récapitulatif</h2>
              <p className="text-sm font-body text-ink-500 mt-1">
                Vérifie tes infos avant de créer ton compte
              </p>
            </div>

            <div className="space-y-4">
              <RecapSection title="Compte">
                <RecapRow label="Nom" value={`${form.first_name} ${form.last_name}`} />
                <RecapRow label="Email" value={form.email} />
              </RecapSection>

              <RecapSection title="Entreprise">
                <RecapRow label="Raison sociale" value={form.company_name} />
                <RecapRow label="SIRET" value={form.siret} mono />
                <RecapRow label="Adresse" value={`${form.address}, ${form.postal_code} ${form.city}`} />
                <RecapRow label="Téléphone" value={form.phone} />
              </RecapSection>

              <RecapSection title="Plan">
                <RecapRow
                  label="Abonnement"
                  value={`${PLANS.find((p) => p.id === selectedPlan)?.name} — ${PLANS.find((p) => p.id === selectedPlan)?.price}€/mois`}
                />
                <RecapRow label="Commission" value="3% fixe par chantier" />
              </RecapSection>
            </div>

            <div className="rounded-lg bg-forest-50 border border-forest-100 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.accept_terms}
                  onChange={(e) => update("accept_terms", e.target.checked)}
                  className="h-4 w-4 rounded border-forest-300 text-forest-500 focus:ring-forest-500/20 mt-0.5 flex-shrink-0"
                />
                <span className="text-sm font-body text-ink-700 leading-relaxed">
                  J&apos;accepte les{" "}
                  <Link href="/cgu" target="_blank" className="font-medium text-forest-600 hover:underline">
                    Conditions Générales d&apos;Utilisation
                  </Link>{" "}
                  et la{" "}
                  <Link href="/privacy" target="_blank" className="font-medium text-forest-600 hover:underline">
                    Politique de confidentialité
                  </Link>
                  .
                </span>
              </label>
            </div>

            <div className="rounded-lg bg-gold-500/5 border border-gold-300/30 p-4 flex items-start gap-3">
              <Shield className="h-4 w-4 text-gold-600 flex-shrink-0 mt-0.5" strokeWidth={1.8} />
              <div className="text-xs font-body text-ink-700 leading-relaxed">
                <p className="font-semibold text-ink-900 mb-1">Étape suivante : activation</p>
                <p>
                  Tu recevras un email pour activer ton compte. Après activation, tu devras uploader ton Kbis, ton mandat SEPA B2B et ton RIB avant de publier ta première mission.
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        {currentStep > 1 ? (
          <button
            onClick={() => setCurrentStep((currentStep - 1) as Step)}
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg border border-forest-100 bg-white px-4 py-2.5 text-sm font-body text-ink-600 hover:border-forest-200 transition-colors disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Précédent
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep((currentStep + 1) as Step)}
            disabled={!canAdvance()}
            className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Suivant
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canAdvance() || isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-5 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Création…
              </>
            ) : (
              <>
                Créer mon compte
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function InstallerSiretFeedback({
  state,
}: {
  state: {
    status: "idle" | "loading" | "success" | "error";
    result?: SiretLookupResult;
  };
}) {
  if (state.status === "success" && state.result?.success) {
    const d = state.result.data;
    return (
      <div className="space-y-1 mt-1">
        <div className="flex items-center gap-2 text-xs font-body text-forest-600">
          <CheckCircle2 className="h-3 w-3" strokeWidth={2.5} />
          <span className="font-semibold">{d.company_name}</span>
        </div>
        <p className="text-[11px] font-body text-ink-500">
          {d.activity_code} · {d.activity_label}
        </p>
      </div>
    );
  }
  if (state.status === "error" && state.result && !state.result.success) {
    return (
      <p className="text-xs font-body text-red-600 mt-1">
        {state.result.error}
      </p>
    );
  }
  return null;
}

function scorePassword(pwd: string): { score: number; label: string; color: string } {
  let score = 0;
  if (pwd.length >= 12) score++;
  if (pwd.length >= 16) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { score, label: "Faible", color: "bg-red-500" };
  if (score <= 4) return { score, label: "Moyen", color: "bg-gold-500" };
  return { score, label: "Fort", color: "bg-forest-500" };
}

function PasswordStrength({ score }: { score: { score: number; label: string; color: string } }) {
  const filled = Math.max(0, Math.min(score.score, 6));
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 flex gap-1">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= filled ? score.color : "bg-cream-200"}`}
          />
        ))}
      </div>
      <span className="text-xs font-mono text-ink-500 w-10 text-right">{score.label}</span>
    </div>
  );
}

function RecapSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-forest-100 bg-cream-50/50 p-4">
      <p className="text-xs font-mono uppercase tracking-wider text-ink-400 mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function RecapRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-xs font-body text-ink-500">{label}</span>
      <span className={`text-sm font-body text-ink-900 text-right ${mono ? "font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
