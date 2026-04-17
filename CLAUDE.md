# CLAUDE.md — RGE Connect

Ta mémoire permanente sur ce projet. Lis-le en entier au démarrage de chaque session. Lis aussi `INTEGRATION_CLIM_EXPRESS.md` et `DESIGN_SYSTEM.md` avant de toucher au code.

---

## 1. Identité

- **Nom** : RGE Connect
- **Tagline** : La marketplace des chantiers RGE — Vendez. Nous posons.
- **Owner** : Mathieu Sarciat
- **Domaine** : rge-connect.fr
- **Repo** : mathieusarc-wq/rge-connect
- **Hosting** : Vercel auto-deploy sur `main`
- **Statut** : nouveau projet, phase MVP

## 2. Mission du produit

RGE Connect est une **infrastructure de confiance** qui relie installateurs ENR et artisans poseurs RGE certifiés en France. Pas un annuaire : une plateforme qui orchestre le chantier de A à Z, garantit les paiements via séquestre tiers, certifie la qualité d'exécution par horodatage eIDAS, et fournit un écosystème de services (fournisseurs négociés, décennale partenaire, conformité automatisée).

**Cibles** :
- **Sous-traitants** : artisans RGE (QualiPac, QualiPV, QualiBois) cherchant un flux régulier de chantiers sécurisés
- **Installateurs / donneurs d'ordre** : sociétés qui vendent des installations ENR et veulent externaliser la pose sans risque

**Métiers couverts** : PAC air-eau, PAC air-air, climatisation, PV, ITE, isolation combles, SSC.

**Premier client API** : LM Energy (via Clim'Express CRM). Voir `INTEGRATION_CLIM_EXPRESS.md`.

## 3. Stack technique obligatoire

- **Framework** : Next.js 15 App Router
- **Langage** : TypeScript strict (noImplicitAny, strictNullChecks)
- **Styling** : Tailwind CSS + design tokens (voir DESIGN_SYSTEM.md)
- **DB / Auth** : Supabase (instance dédiée, strictement isolée de Clim'Express)
- **Hosting** : Vercel
- **Paiement / wallets / SEPA** : Mangopay (cœur du système)
- **Signature électronique** : Yousign eIDAS
- **Horodatage qualifié** : Universign eIDAS
- **Email / SMS** : Brevo
- **IA documents (V2)** : API Anthropic Claude
- **Cron** : Vercel Cron — **OBLIGATOIRE en POST**, jamais GET
- **Storage** : Supabase Storage

**INTERDICTIONS STRICTES** :
- Jamais toucher aux `.env*`
- Jamais downgrader Next.js sous une version sécurisée
- Jamais de cron en GET
- Jamais de référence au code ou aux données Clim'Express (séparation stricte)
- Jamais de secret hardcodé dans le code

## 4. Les 3 piliers produit

### Pilier 1 — Marketplace de chantiers
- Création mission via API (CRM installateur) ou formulaire web
- Diffusion ciblée aux sous-traitants éligibles (zone géo, métier, capacité, score)
- Proposition de 5 créneaux en 1 clic par le sous-traitant
- Validation client final par lien tokenisé (email + SMS Brevo)
- Génération automatique ordre de mission PDF
- Suivi chantier 3 états : À venir / En cours / Terminé

### Pilier 2 — Infrastructure de confiance
- Vérification RGE à l'inscription (scraping annuaire France Rénov')
- Photos chantier horodatées eIDAS via Universign + géolocalisation native
- PV de réception électronique Yousign
- **Garantie de paiement via Mangopay** : mandat SEPA B2B installateur, prélèvement automatique selon délai choisi (J+15 / J+30 / J+45), reversement sous-traitant via wallet
- **Affacturage 48h** en option : commission **10% fixe** (avance immédiate sous-traitant)
- Avis client automatique J+1 post-pose (Brevo)
- Republication avis sur Google Business Profile du sous-traitant
- Certificat satisfaction PDF auto-généré

### Pilier 3 — Écosystème artisan RGE
- Coffre-fort documentaire (Kbis, décennale, RGE, URSSAF)
- Alertes expiration auto (90j / 30j / 7j)
- Génération automatique dossiers de candidature
- Catalogue fournisseurs tarifs négociés (HEIWA en priorité, puis Daikin, Atlantic, Weber)
- Décennale partenaire prix groupe (via courtier spécialisé BTP)
- Score et badges publics
- Veille réglementaire (newsletter, alertes MaPrimeRénov')

## 5. Périmètre volontairement EXCLU

- ❌ Gestion d'équipe interne du sous-traitant
- ❌ Pointage horaire / heures travaillées
- ❌ Gestion paie
- ❌ Toute intrusion dans le RH du sous-traitant

**Règle d'or produit** : RGE Connect pilote la mission, pas le sous-traitant.

## 6. Pricing à implémenter

### Sous-traitants — RGE Connect Pro
| Plan | Prix | Inclus | Commission |
|------|------|--------|------------|
| Standard | 79 €/mois | Pilier 1 + photos horodatées + PV + coffre-fort + avis auto + score | **3% fixe** |
| Pro ⭐ | 149 €/mois | Tout Standard + garantie paiement séquestre + catalogue fournisseurs + assurances + republication GMB | **3% fixe** |

Affacturage 48h en option sur plan Pro : **10% fixe** par opération.

### Installateurs — RGE Connect Business
| Plan | Prix | Inclus | Commission |
|------|------|--------|------------|
| Découverte | 0 €/mois | 3 chantiers/mois max | **3% fixe** |
| Business ⭐ | 199 €/mois | Chantiers illimités + API CRM + SAV unique + garantie chantier + dashboard + centrale d'achat | **3% fixe** |
| Enterprise | 499 €/mois | Tout Business + marque blanche + décennale parapluie + account manager + SLA 24/7 | **3% fixe** |

**Règle communication** : commission unique **3% fixe** affichée partout. Affacturage **10% fixe** séparé.

## 7. Schéma Supabase — tables obligatoires

Toutes les tables ont RLS stricte activée. Isolation par `installer_id` ou `subcontractor_id`. Fonction `is_super_admin()` SECURITY DEFINER pour accès admin (pattern appris sur Clim'Express et AO TARGET).

- `installers` — donneurs d'ordre
- `subcontractors` — sous-traitants
- `subcontractor_documents` — coffre-fort docs
- `api_keys` — clés API installateurs (hash bcrypt + prefix)
- `missions` — chantiers
- `mission_offers` — créneaux proposés par sous-traitants
- `mission_photos` — photos horodatées eIDAS
- `mission_reviews` — avis clients
- `payments` — prélèvements et reversements
- `mangopay_wallets` — mapping wallets
- `subscriptions` — abonnements
- `supplier_catalog` — catalogue fournisseurs
- `supplier_orders` — commandes fournisseurs
- `outbound_webhooks` — webhooks sortants vers les CRM clients (Clim'Express en premier)

## 8. Workflow deploy obligatoire

À chaque changement significatif :
```bash
git status                     # doit être clean avant de démarrer
npm run lint
npm run build                  # build local OBLIGATOIRE avant push
git add .
git commit -m "feat|fix|chore: description précise"
git push origin main
```
Puis vérifier le deploy Vercel. Si fail : récupérer logs, corriger, repush jusqu'au vert. Jamais laisser `main` en fail.

## 9. Roadmap MVP (5 sprints)

### Sprint 1 — Fondations (2 semaines)
- [ ] Init Next.js 15 + TypeScript strict + Tailwind
- [ ] Setup Supabase (projet dédié) + client
- [ ] Design system global (tokens, composants de base selon DESIGN_SYSTEM.md)
- [ ] Schéma DB complet avec RLS stricte sur toutes tables
- [ ] Auth sous-traitants + installateurs (Supabase Auth)
- [ ] Landing page marketing (hero + 3 piliers + pricing + CTA)
- [ ] Déploiement Vercel

### Sprint 2 — Onboarding sous-traitant (2 semaines)
- [ ] Inscription sous-traitant + upload documents
- [ ] Validation manuelle des docs (V1, IA en V2)
- [ ] Coffre-fort documentaire fonctionnel
- [ ] Profil public sous-traitant
- [ ] Dashboard sous-traitant vide avec navigation

### Sprint 3 — Marketplace core + API intégration (3 semaines)
- [ ] Modèle de données missions complet
- [ ] Création mission via formulaire web
- [ ] **Endpoint API `POST /api/missions`** (voir INTEGRATION_CLIM_EXPRESS.md)
- [ ] **Endpoint API `GET /api/missions/:id`**
- [ ] Authentification par clé API (bcrypt hash + prefix)
- [ ] Diffusion missions aux sous-traitants éligibles
- [ ] Proposition de créneaux côté sous-traitant
- [ ] Validation client via lien tokenisé (email + SMS Brevo)
- [ ] Génération ordre de mission PDF
- [ ] **Système de webhooks sortants** avec signature HMAC + retry (voir INTEGRATION_CLIM_EXPRESS.md)

### Sprint 4 — Infrastructure de confiance (3 semaines)
- [ ] Intégration Mangopay complète (KYC installer + sous-traitant, wallets, mandat SEPA B2B)
- [ ] Prélèvement automatique J+15/J+30/J+45 via Vercel Cron (POST)
- [ ] Reversement automatique wallet sous-traitant
- [ ] Photos horodatées Universign (upload + hash + token)
- [ ] PV électronique Yousign
- [ ] Avis client auto J+1 via Brevo + Vercel Cron
- [ ] Affacturage 48h (option sous-traitant)

### Sprint 5 — Finition MVP (1 semaine)
- [ ] Dashboard installateur avec reporting
- [ ] Tests end-to-end du flux complet
- [ ] Mise en production LM Energy comme premier client API
- [ ] Documentation API publique (pour futurs clients)

## 10. Règles d'or pour toi (l'agent Claude Code)

1. **`git status` avant de commencer.** Si pas clean, demander à Mathieu.
2. **Build local avant chaque push.** Jamais de "ça devrait marcher".
3. **Commits atomiques et clairs.** Un commit = un changement logique.
4. **Si Vercel fail** : logs → corrige → repush jusqu'au vert. Boucle jusqu'au succès.
5. **Jamais toucher aux `.env*`.** Secrets locaux uniquement.
6. **Jamais cron en GET.** Toujours POST.
7. **Séparation stricte avec Clim'Express.** Jamais de référence au code, aux données ou aux secrets de Clim'Express.
8. **Design system appliqué à 100%.** Si doute, relire `DESIGN_SYSTEM.md`.
9. **Webhooks sortants toujours signés en HMAC-SHA256** et avec retry exponentiel.
10. **Français direct** avec Mathieu, sans préambule, sans options multiples inutiles.
11. **Si une tâche semble trop complexe pour une seule boucle**, découper en sous-tâches et rapporter l'avancement.
12. **Toujours lire `INTEGRATION_CLIM_EXPRESS.md` avant de toucher à l'API missions ou aux webhooks.**

## 11. Prérequis bloquants hors dev (à faire en parallèle par Mathieu)

Ces points ne bloquent pas le dev mais bloquent la mise en production :
- [ ] Réservation domaines rge-connect.fr / rgeconnect.fr (OVH)
- [ ] Dépôt marque INPI "RGE Connect" (classes 35, 37, 42)
- [ ] Création entité juridique SASU
- [ ] Compte Mangopay créé + KYC entité validé
- [ ] Compte Universign créé
- [ ] Brief avocat marketplace BTP (CGU, statut intermédiaire, mandat SEPA B2B)
- [ ] Premier accord cadre HEIWA pour catalogue fournisseurs

## 12. Variables d'environnement attendues

À documenter dans `.env.example` (JAMAIS de vraies valeurs en commit) :

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mangopay
MANGOPAY_CLIENT_ID=
MANGOPAY_API_KEY=
MANGOPAY_ENV=sandbox

# Yousign
YOUSIGN_API_KEY=
YOUSIGN_WEBHOOK_SECRET=

# Universign
UNIVERSIGN_API_KEY=
UNIVERSIGN_PROFILE=

# Brevo
BREVO_API_KEY=

# Anthropic (V2)
ANTHROPIC_API_KEY=

# App
NEXT_PUBLIC_APP_URL=https://rge-connect.fr
RGE_CONNECT_WEBHOOK_SIGNING_SECRET=

# Cron
CRON_SECRET=
```

---

**Mathieu préfère** : résultats directs, zéro préambule, zéro options multiples quand une réponse claire suffit. Tu travailles en autonomie, tu rapportes ce qui est fait et ce qui bloque. Point.
