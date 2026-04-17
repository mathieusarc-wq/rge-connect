# RGE Connect

**La marketplace des chantiers RGE — Vendez. Nous posons.**

Plateforme de mise en relation entre installateurs ENR et artisans poseurs RGE certifiés en France. Orchestration de chantier de A à Z, paiements sécurisés par séquestre Mangopay, qualité d'exécution certifiée eIDAS, écosystème complet.

Premier client API : **LM Energy** via Clim'Express CRM.

---

## Stack

- **Framework** : Next.js 15 App Router (TypeScript strict)
- **Styling** : Tailwind CSS v4 + design tokens (forest / gold / cream / ink)
- **UI** : shadcn/ui + Lucide + Framer Motion
- **DB / Auth** : Supabase (instance dédiée)
- **Hosting** : Vercel (auto-deploy sur `main`)
- **Paiement** : Mangopay (wallets, mandat SEPA B2B, séquestre)
- **Signature eIDAS** : Yousign
- **Horodatage qualifié** : Universign
- **Email / SMS** : Brevo
- **IA documents** : Anthropic Claude (V2)
- **Cron** : Vercel Cron (POST obligatoire)
- **Cartes** : Leaflet (zone d'intervention sous-traitants)

## Structure

```
src/
  app/
    (auth)/login/              Page de connexion
    (dashboard)/               Layout CRM (sidebar + topbar)
      dashboard/               Vue d'ensemble
      marketplace/             Chantiers disponibles
      documents/               Coffre-fort documentaire
      payments/                Wallet + historique
      reviews/                 Avis clients
      settings/                Entreprise, docs, IA, zone
  components/
    dashboard/                 Sidebar, topbar, map
    ui/                        Primitives shadcn
```

## Dev

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # OBLIGATOIRE avant chaque push
npm run lint
```

## Variables d'environnement

Cf. `.env.example`. Les valeurs ne sont jamais commitées. Utiliser `vercel env pull .env.local --yes` une fois le projet lié.

## Design system

- **Forest** (primary) : `#2d5a3d`
- **Gold** (accent) : `#d88a1a`
- **Cream** (background) : `#faf6ef`
- **Ink** (text) : `#0d1411`

Fonts : Sora (display), Inter (body), JetBrains Mono (mono).

Détails complets dans `DESIGN_SYSTEM.md`.

## Règles de contribution

1. `npm run build` local **obligatoire** avant chaque push
2. Commits atomiques (un commit = un changement logique)
3. Jamais toucher aux `.env*`
4. Jamais de cron en GET (toujours POST)
5. Séparation stricte avec le code/données Clim'Express
6. Webhooks sortants signés en HMAC-SHA256 + retry exponentiel

Specs détaillées : `CLAUDE.md`, `INTEGRATION_CLIM_EXPRESS.md`, `DESIGN_SYSTEM.md`.

---

© 2026 RGE Connect. Tous droits réservés.
