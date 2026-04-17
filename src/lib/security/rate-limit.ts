/**
 * Rate limiter IP-based — sliding window en mémoire.
 *
 * ⚠️ LIMITES :
 * - Fonctionne sur UNE instance Vercel Function. Avec Fluid Compute
 *   multi-région, chaque région a son propre compteur. C'est OK pour
 *   bloquer les attaques grossières mais PAS pour du quota précis.
 * - Pour un quota strict multi-région, migrer vers Upstash Redis ou
 *   Vercel Queues.
 *
 * USAGE :
 *   const limit = await rateLimit(ip, { max: 10, windowMs: 60_000 });
 *   if (!limit.success) {
 *     return new Response("Too many requests", {
 *       status: 429,
 *       headers: { "Retry-After": String(limit.retryAfter) }
 *     });
 *   }
 */

type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  max: number;
  windowMs: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  retryAfter: number; // secondes
  resetAt: number;
};

// Store en mémoire — taille max arbitraire pour éviter fuite mémoire
const MAX_KEYS = 10_000;
const store = new Map<string, Bucket>();

function pruneIfNeeded() {
  if (store.size < MAX_KEYS) return;
  const now = Date.now();
  // Supprime les buckets expirés
  for (const [k, v] of store.entries()) {
    if (v.resetAt < now) store.delete(k);
  }
  // Si toujours trop, vire le plus ancien (FIFO Map)
  if (store.size >= MAX_KEYS) {
    const firstKey = store.keys().next().value;
    if (firstKey) store.delete(firstKey);
  }
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  pruneIfNeeded();
  const now = Date.now();
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt < now) {
    // Nouvelle fenêtre
    const resetAt = now + options.windowMs;
    store.set(key, { count: 1, resetAt });
    return {
      success: true,
      remaining: options.max - 1,
      retryAfter: 0,
      resetAt,
    };
  }

  if (bucket.count >= options.max) {
    return {
      success: false,
      remaining: 0,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      resetAt: bucket.resetAt,
    };
  }

  bucket.count += 1;
  return {
    success: true,
    remaining: options.max - bucket.count,
    retryAfter: 0,
    resetAt: bucket.resetAt,
  };
}

/**
 * Presets usage typique.
 */
export const RATE_LIMITS = {
  // Auth sensible : 5 tentatives / 5 min
  auth: { max: 5, windowMs: 5 * 60_000 },
  // API publique (ingestion missions via clé API) : 60 / min
  apiPublic: { max: 60, windowMs: 60_000 },
  // API interne (user authentifié) : 120 / min
  apiAuth: { max: 120, windowMs: 60_000 },
  // Upload documents : 10 / min
  upload: { max: 10, windowMs: 60_000 },
  // Recherche / listing : 30 / 10s
  search: { max: 30, windowMs: 10_000 },
} as const;

/**
 * Extrait l'IP d'une Request Next/Vercel (X-Forwarded-For).
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

/**
 * Construit une Response 429 standardisée.
 */
export function rateLimitResponse(result: RateLimitResult): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limited",
      message: "Trop de requêtes, réessayez plus tard.",
      retryAfter: result.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(result.retryAfter),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
      },
    }
  );
}
