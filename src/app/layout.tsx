import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://enr-connect.fr";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ENR Connect — La marketplace des chantiers énergies renouvelables",
    template: "%s — ENR Connect",
  },
  description:
    "L'énergie prend forme. La marketplace qui relie installateurs ENR et artisans qualifiés. Garantie de paiement séquestre, horodatage eIDAS, écosystème complet.",
  keywords: [
    "ENR",
    "énergies renouvelables",
    "RGE",
    "marketplace BTP",
    "chantiers",
    "sous-traitant",
    "installateur",
    "PAC",
    "pompe à chaleur",
    "photovoltaïque",
    "ITE",
    "MaPrimeRénov",
  ],
  applicationName: "ENR Connect",
  authors: [{ name: "MS Distribution SAS" }],
  creator: "MS Distribution SAS",
  publisher: "MS Distribution SAS",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: APP_URL,
    siteName: "ENR Connect",
    title: "ENR Connect — La marketplace des chantiers énergies renouvelables",
    description:
      "L'énergie prend forme. La marketplace qui relie installateurs ENR et artisans qualifiés.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "ENR Connect — La marketplace des chantiers ENR",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ENR Connect — La marketplace des chantiers ENR",
    description: "L'énergie prend forme. Sous-traitance ENR sécurisée.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1F3A2E",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${sora.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
