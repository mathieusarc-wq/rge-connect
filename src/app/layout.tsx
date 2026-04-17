import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "RGE Connect — La marketplace des chantiers RGE",
  description:
    "Vendez. Nous posons. La plateforme qui relie installateurs ENR et artisans poseurs RGE certifiés. Garantie de paiement, horodatage eIDAS, écosystème complet.",
  keywords: [
    "RGE",
    "marketplace",
    "chantiers",
    "sous-traitant",
    "installateur",
    "ENR",
    "PAC",
    "pompe à chaleur",
    "photovoltaïque",
  ],
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
