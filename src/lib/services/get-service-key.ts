import "server-only";
import { createServiceRoleClient } from "@/lib/supabase/server";

/**
 * Récupère une clé de service depuis la DB (table service_credentials).
 * Fallback sur les variables d'environnement si pas configurée en DB.
 *
 * Priorité : DB > env vars > undefined
 *
 * USAGE (côté serveur uniquement) :
 *   const anthropicKey = await getServiceKey("anthropic", "api_key");
 *   const mangopayId = await getServiceKey("mangopay", "client_id");
 */

// Mapping service + key_name → nom de l'env var de fallback
const ENV_FALLBACK: Record<string, string> = {
  "anthropic:api_key": "ANTHROPIC_API_KEY",
  "anthropic:base_url": "ANTHROPIC_BASE_URL",
  "brevo:api_key": "BREVO_API_KEY",
  "brevo:sender_email": "BREVO_SENDER_EMAIL",
  "brevo:sender_name": "BREVO_SENDER_NAME",
  "mangopay:client_id": "MANGOPAY_CLIENT_ID",
  "mangopay:api_key": "MANGOPAY_API_KEY",
  "mangopay:env": "MANGOPAY_ENV",
  "yousign:api_key": "YOUSIGN_API_KEY",
  "yousign:webhook_secret": "YOUSIGN_WEBHOOK_SECRET",
  "universign:api_key": "UNIVERSIGN_API_KEY",
  "universign:profile": "UNIVERSIGN_PROFILE",
  "rge_connect:webhook_signing_secret": "RGE_CONNECT_WEBHOOK_SIGNING_SECRET",
  "cron:secret": "CRON_SECRET",
};

// Cache in-memory 60s pour éviter de spammer la DB
type CacheEntry = { value: string | null; expiresAt: number };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60_000;

export async function getServiceKey(
  service: string,
  keyName: string
): Promise<string | null> {
  const cacheKey = `${service}:${keyName}`;
  const now = Date.now();

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  // 1. DB lookup via service_role (bypass RLS)
  let dbValue: string | null = null;
  try {
    const supabase = createServiceRoleClient();
    const { data, error } = await supabase.rpc("get_service_credential", {
      p_service: service,
      p_key_name: keyName,
    });
    if (!error && typeof data === "string" && data.length > 0) {
      dbValue = data;
    }
  } catch {
    // ignore — fallback env
  }

  // 2. Fallback env var
  let finalValue: string | null = dbValue;
  if (!finalValue) {
    const envName = ENV_FALLBACK[cacheKey];
    if (envName) {
      finalValue = process.env[envName] ?? null;
    }
  }

  // Cache (même null pour éviter spam)
  cache.set(cacheKey, { value: finalValue, expiresAt: now + CACHE_TTL_MS });
  return finalValue;
}

/**
 * Invalide le cache (à appeler après un UPDATE dans /super-admin/api-keys)
 */
export function invalidateServiceKeyCache(service?: string, keyName?: string) {
  if (service && keyName) {
    cache.delete(`${service}:${keyName}`);
  } else if (service) {
    for (const key of cache.keys()) {
      if (key.startsWith(`${service}:`)) cache.delete(key);
    }
  } else {
    cache.clear();
  }
}
