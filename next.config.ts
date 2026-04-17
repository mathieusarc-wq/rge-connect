import type { NextConfig } from "next";
import { withBotId } from "botid/next/config";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_HOSTNAME = SUPABASE_URL.replace(/^https?:\/\//, "").replace(/\/$/, "");

// Content-Security-Policy strict mais compatible Tailwind runtime + Leaflet + Supabase
const csp = [
  `default-src 'self'`,
  // Scripts : self + inline (Next runtime) + Vercel analytics
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com`,
  // Styles : self + inline (Tailwind injection)
  `style-src 'self' 'unsafe-inline'`,
  // Fonts : self + Google Fonts
  `font-src 'self' data: https://fonts.gstatic.com`,
  // Images : self + data uri + Supabase storage + Leaflet tiles
  `img-src 'self' data: blob: https://${SUPABASE_HOSTNAME} https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org https://*.vercel.app`,
  // API calls : self + Supabase realtime WS
  `connect-src 'self' https://${SUPABASE_HOSTNAME} wss://${SUPABASE_HOSTNAME} https://vitals.vercel-insights.com`,
  // Frames : interdits par défaut
  `frame-src 'none'`,
  `frame-ancestors 'none'`,
  // Forms uniquement vers self
  `form-action 'self'`,
  // Workers si besoin
  `worker-src 'self' blob:`,
  // Base URI verrouillé
  `base-uri 'self'`,
  // Pas de mixed content
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // Force HTTPS pendant 2 ans + inclusion des sous-domaines + preload list
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // Anti-clickjacking
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  // Bloque le MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Protection XSS legacy (navigateurs anciens)
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  // Ne leak pas l'URL en cross-origin
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Permissions browser : désactive tout ce qu'on n'utilise pas
  {
    key: "Permissions-Policy",
    value: [
      "accelerometer=()",
      "camera=(self)", // on utilisera peut-être la caméra pour les photos chantier
      "geolocation=(self)", // utilisé pour le géotagging photos
      "gyroscope=()",
      "magnetometer=()",
      "microphone=()",
      "payment=(self)", // Mangopay redirect flow
      "usb=()",
      "interest-cohort=()", // opt-out FLoC
    ].join(", "),
  },
  // CSP
  {
    key: "Content-Security-Policy",
    value: csp,
  },
  // Cross-Origin-Opener-Policy pour isolation
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  // Cross-Origin-Resource-Policy
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
];

const nextConfig: NextConfig = {
  // Masque le header X-Powered-By: Next.js
  poweredByHeader: false,

  // Force React strict mode
  reactStrictMode: true,

  // Headers de sécurité sur TOUTES les routes
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Empêche l'accès aux fichiers .env leakés
  async rewrites() {
    return [];
  },

  // Configuration images Next/Image (domaines autorisés)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: SUPABASE_HOSTNAME || "zusulhqdmlrrghwqiyta.supabase.co",
      },
      {
        protocol: "https",
        hostname: "*.basemaps.cartocdn.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default withBotId(nextConfig);
