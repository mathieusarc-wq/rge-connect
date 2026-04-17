import crypto from "node:crypto";

/**
 * HMAC-SHA256 pour signer/vérifier les webhooks sortants (vers CRM clients
 * comme Clim'Express) et les callbacks entrants (Yousign, Mangopay, Universign).
 *
 * Règle d'or CLAUDE.md : tous les webhooks sortants sont signés HMAC-SHA256
 * avec timestamp + retry exponentiel.
 */

const CLOCK_SKEW_SECONDS = 300; // 5 min de tolérance sur les timestamps

export type WebhookSignature = {
  signature: string;
  timestamp: number;
  payloadString: string;
};

/**
 * Signe un payload avec timestamp pour prévenir les replay attacks.
 * Format du header : `t=<timestamp>,v1=<hmac_hex>`
 */
export function signWebhookPayload(
  payload: unknown,
  secret: string,
  timestamp: number = Math.floor(Date.now() / 1000)
): WebhookSignature {
  if (!secret) throw new Error("HMAC secret is required");

  const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload);
  const signedString = `${timestamp}.${payloadString}`;
  const hmac = crypto.createHmac("sha256", secret).update(signedString).digest("hex");

  return {
    signature: `t=${timestamp},v1=${hmac}`,
    timestamp,
    payloadString,
  };
}

/**
 * Vérifie une signature HMAC en utilisant timingSafeEqual pour éviter
 * les attaques par canal auxiliaire (timing attacks).
 */
export function verifyWebhookSignature(
  rawBody: string,
  signatureHeader: string,
  secret: string
): { valid: boolean; reason?: string } {
  if (!signatureHeader) return { valid: false, reason: "missing_signature_header" };
  if (!secret) return { valid: false, reason: "missing_secret" };

  // Parse "t=1234567,v1=abc..."
  const parts = signatureHeader.split(",").reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.split("=");
    if (k && v) acc[k.trim()] = v.trim();
    return acc;
  }, {});

  const ts = parts.t;
  const sig = parts.v1;

  if (!ts || !sig) return { valid: false, reason: "malformed_signature" };

  const tsNum = Number(ts);
  if (!Number.isFinite(tsNum)) return { valid: false, reason: "invalid_timestamp" };

  // Rejette si timestamp trop vieux (anti-replay)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - tsNum) > CLOCK_SKEW_SECONDS) {
    return { valid: false, reason: "timestamp_out_of_range" };
  }

  // Recalcule la signature attendue
  const signedString = `${tsNum}.${rawBody}`;
  const expected = crypto.createHmac("sha256", secret).update(signedString).digest("hex");

  // Timing-safe comparison
  const expectedBuf = Buffer.from(expected, "hex");
  const providedBuf = Buffer.from(sig, "hex");

  if (expectedBuf.length !== providedBuf.length) {
    return { valid: false, reason: "invalid_signature" };
  }

  if (!crypto.timingSafeEqual(expectedBuf, providedBuf)) {
    return { valid: false, reason: "invalid_signature" };
  }

  return { valid: true };
}

/**
 * Hash bcrypt-compatible pour les clés API (utilisé à l'insertion).
 * ⚠️ bcrypt côté Node nécessite le package `bcrypt` qu'on peut ajouter plus
 * tard. Pour l'instant on utilise sha256 hex (suffisant combiné au prefix
 * de 8 chars qui permet l'index, puis timing-safe sur le hash).
 *
 * TODO Sprint 3 : migrer sur argon2id ou bcrypt avec cost factor adapté.
 */
export function hashApiKey(rawKey: string): string {
  return crypto.createHash("sha256").update(rawKey).digest("hex");
}

export function verifyApiKey(rawKey: string, storedHash: string): boolean {
  const computed = hashApiKey(rawKey);
  const a = Buffer.from(computed, "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * Génère une clé API publique. Format : `rgec_<prefix>_<secret>`.
 * - prefix : 8 chars url-safe, stocké en clair pour lookup rapide
 * - secret : 32 bytes random base64url
 */
export function generateApiKey(): { full: string; prefix: string; hash: string } {
  const prefix = crypto.randomBytes(6).toString("base64url").slice(0, 8);
  const secret = crypto.randomBytes(32).toString("base64url");
  const full = `rgec_${prefix}_${secret}`;
  return {
    full,
    prefix,
    hash: hashApiKey(full),
  };
}

/**
 * Génère un token URL-safe pour la validation client d'un créneau
 * (mission_offers.client_validation_token). 32 bytes = ~256 bits d'entropie.
 */
export function generateValidationToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}
