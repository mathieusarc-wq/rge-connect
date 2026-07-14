import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ENR Connect",
    short_name: "ENR Connect",
    description:
      "La marketplace des chantiers énergies renouvelables. L'énergie prend forme.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF7F0",
    theme_color: "#1F3A2E",
    lang: "fr",
    orientation: "portrait",
    categories: ["business", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
