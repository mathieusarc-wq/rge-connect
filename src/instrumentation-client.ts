import { initBotId } from "botid/client/core";

/**
 * Vercel BotID — protection ML anti-bots sur les routes sensibles.
 *
 * Doc : https://vercel.com/docs/botid
 *
 * Fonctionnement :
 * 1. Ce script ajoute des headers signés côté client sur les requêtes vers
 *    les paths listés ci-dessous
 * 2. Côté serveur, `checkBotId()` vérifie la signature et classifie le trafic
 *    (bot vs humain) via un modèle ML
 * 3. Si `isBot: true`, on renvoie 403 depuis la route
 *
 * Deep Analysis (payant, $1/1000 calls sur Pro/Enterprise) : à activer
 * depuis Vercel Dashboard → Firewall → Rules → "Vercel BotID Deep Analysis"
 */

initBotId({
  protect: [
    // === Authentification === (anti credential stuffing + brute force)
    { path: "/api/auth/login", method: "POST" },
    { path: "/api/auth/register", method: "POST" },
    { path: "/api/auth/forgot-password", method: "POST" },
    { path: "/api/auth/reset-password", method: "POST" },

    // === Missions === (anti spam création, anti scraping)
    { path: "/api/missions", method: "POST" },
    { path: "/api/missions/*", method: "PATCH" },
    { path: "/api/missions/*/offer", method: "POST" },
    { path: "/api/missions/*/validate", method: "POST" },

    // === API publique installateurs === (ingestion externe via clé API)
    { path: "/api/v1/missions", method: "POST" },

    // === Uploads === (anti spam storage)
    { path: "/api/documents/upload", method: "POST" },
    { path: "/api/photos/upload", method: "POST" },

    // === Paiements === (routes très sensibles)
    { path: "/api/payments/*", method: "POST" },
    { path: "/api/subscriptions/*", method: "POST" },

    // === Webhooks entrants === (Mangopay, Yousign, Universign)
    // Les webhooks ont déjà une signature HMAC, BotID en double protection
    { path: "/api/webhooks/*", method: "POST" },
  ],
});
