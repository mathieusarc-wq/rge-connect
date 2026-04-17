# DESIGN_SYSTEM.md — RGE Connect

Design system obligatoire. À appliquer à 100% sur **toute** UI : landing, dashboards, emails, PDF, composants. Qualité cible : Apple Keynote / Vercel / Linear. Aucune dérive vers du générique.

---

## 1. Palette (tokens Tailwind)

```js
// tailwind.config.ts
colors: {
  forest: {
    50:  '#f3f7f4',
    100: '#e5ede8',
    500: '#2d5a3d',    // primary
    600: '#244a32',
    700: '#1f4029',
    900: '#0d1411',
  },
  gold: {
    400: '#e89c2e',
    500: '#d88a1a',    // accent
    600: '#b8721a',
  },
  cream: {
    50:  '#faf6ef',    // background principal
    100: '#f5efe4',
  },
  ink: {
    900: '#0d1411',    // texte principal
    700: '#2a332e',
    500: '#6b7670',    // texte secondaire (gris sage)
  },
}
```

**Règles d'usage** :
- `forest.500` : primary, boutons principaux, liens, titres
- `gold.500` : accent, highlights, CTA secondaires, chiffres clés
- `cream.50` : fond principal des pages claires
- `forest.900` : fond hero, footer, sections sombres
- `ink.900` : texte principal
- `ink.500` : texte secondaire / métadonnées

## 2. Typographie

```js
// tailwind.config.ts
fontFamily: {
  display: ['Sora', 'system-ui', 'sans-serif'],   // titres, wordmark
  body: ['Inter', 'system-ui', 'sans-serif'],     // texte courant
  mono: ['JetBrains Mono', 'monospace'],          // labels, data, code
}
```

**Interdits absolus** : Roboto, Open Sans, Lato, Montserrat, toute Google Font générique.

**Échelle** :
- Hero headline : `text-6xl md:text-7xl font-display font-extrabold tracking-tight`
- Section title : `text-4xl font-display font-bold tracking-tight`
- Card title : `text-xl font-display font-semibold`
- Body : `text-base font-body leading-relaxed`
- Small / meta : `text-sm font-body text-ink-500`
- Label uppercase : `text-xs font-mono uppercase tracking-[0.2em] text-gold-500`

**Wordmark RGE Connect** : toujours en Sora 800, avec le "O" de CONNECT en `gold.500`.

## 3. Composants de base à créer

Dans `src/components/ui/` :
- `Button` : variants `primary` (forest), `gold` (accent), `ghost`, `outline`
- `Card` : bordure fine `border-forest-100`, fond `cream.50`, shadow subtil
- `Input`, `Textarea`, `Select` : design sobre, focus ring `forest.500`
- `Badge` : pour statuts (vert = actif, gold = en cours, gris = brouillon)
- `Avatar`, `Tag`, `Modal`, `Toast`, `Table`

Utiliser shadcn/ui comme base mais **re-skinner** avec les tokens.

## 4. Layouts et composition

- **Compositions asymétriques obligatoires**. Pas de grilles symétriques de 3 cards identiques. Varier les tailles, les positions, les backgrounds.
- **Grain texture** subtil sur les fonds cream (SVG fractalNoise, opacité ~5%)
- **Radial gradients** légers pour donner de la profondeur sans glassmorphism
- **Lignes or** fines comme séparateurs éditoriaux

## 5. Iconographie

- **Line-art uniquement**. Stroke 1.5-2px, couleur `forest.500` ou `ink.700`.
- Accents `gold.500` occasionnels (1 détail par icône max).
- **Jamais** d'icônes colorées, émojis, clipart, Material Icons criards.
- Librairie recommandée : Lucide Icons (déjà dans shadcn).

## 6. Animations

- Transitions : `cubic-bezier(0.2, 0.8, 0.2, 1)` — courbe douce premium
- Durée : 300-700ms pour les micro-interactions, 1-1.5s pour les reveals
- **Framer Motion** pour tout ce qui est animation complexe
- `fade-up` staggered sur les listes et sections (delay 100-150ms entre items)
- **Pas d'animations criardes** : pas de bounces, pas de spring, pas de rotation 360°

## 7. Interdictions absolues

- ❌ Glassmorphism (backdrop-blur partout)
- ❌ Gradients violets/rose
- ❌ Stock photos (Unsplash, Pexels)
- ❌ Emojis dans l'UI
- ❌ Clipart ou illustrations génériques
- ❌ Neumorphism
- ❌ Shadows molles partout (préférer une shadow par élément clé)
- ❌ Tout Google Font générique (Roboto, Open Sans, Lato, Montserrat...)
- ❌ Grilles symétriques de cards identiques
- ❌ Boutons trop arrondis (pill everywhere) — préférer `rounded-md` ou `rounded-lg`

## 8. Checklist anti-AI-slop avant push

Avant chaque commit UI, vérifier :
- [ ] Palette respectée à 100% (seulement forest / gold / cream / ink)
- [ ] Typographie : Sora / Inter / JetBrains Mono uniquement
- [ ] Au moins une composition asymétrique sur la page
- [ ] Aucun emoji, aucun stock photo, aucun clipart
- [ ] Iconographie line-art cohérente
- [ ] Grain texture subtil sur les fonds cream
- [ ] Lignes or comme éléments graphiques
- [ ] Focus states accessibles (ring forest)
- [ ] Responsive testé (mobile-first)
- [ ] Aucune interdiction violée

## 9. Inspiration visuelle

- **Vercel** (vercel.com) : compositions éditoriales, hero typography
- **Linear** (linear.app) : micro-interactions, animations subtiles
- **Stripe** (stripe.com) : landing premium B2B, hiérarchie typo
- **Rauch / Resend** : layouts modernes, accents colorés bien dosés

**Pas d'inspiration** : Framer templates, ThemeForest, sites en glass morphism, sites avec trop d'illustrations 3D génériques.
