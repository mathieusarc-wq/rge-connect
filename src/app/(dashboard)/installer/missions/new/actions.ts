"use server";

import { extractDevisData, type ExtractionResult } from "@/lib/ai/devis-extractor";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";
import { headers } from "next/headers";

const MAX_PDF_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ["application/pdf"];

/**
 * Server Action : upload d'un devis PDF + extraction IA.
 * Appelée depuis /installer/missions/new (étape 0).
 */
export async function analyzeDevis(formData: FormData): Promise<ExtractionResult> {
  const file = formData.get("devis") as File | null;

  if (!file) {
    return { success: false, code: "invalid_response", error: "Aucun fichier fourni." };
  }

  // Validation type MIME
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      code: "invalid_response",
      error: `Format non supporté (${file.type}). Seuls les PDF sont acceptés.`,
    };
  }

  // Validation taille
  if (file.size > MAX_PDF_SIZE_BYTES) {
    return {
      success: false,
      code: "invalid_response",
      error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`,
    };
  }

  if (file.size === 0) {
    return { success: false, code: "invalid_response", error: "Fichier vide." };
  }

  // Rate limit par IP — l'extraction IA coûte cher, protection abus
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const limit = rateLimit(`devis-extract:${ip}`, RATE_LIMITS.upload);
  if (!limit.success) {
    return {
      success: false,
      code: "api_error",
      error: `Trop d'extractions. Réessaie dans ${limit.retryAfter}s.`,
    };
  }

  // Convert File → base64
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Extraction Claude
  const result = await extractDevisData(base64);

  // Audit log (succès ou échec)
  await logAudit({
    action: result.success ? "document_uploaded" : "document_rejected",
    metadata: {
      kind: "devis_extraction",
      file_name: file.name,
      file_size: file.size,
      ...(result.success
        ? {
            confidence: result.data.confidence.overall,
            quality: result.data.confidence.extraction_quality,
            extracted_fields: result.data.extracted_fields,
          }
        : {
            error_code: result.code,
          }),
    },
    success: result.success,
    errorMessage: result.success ? undefined : result.error,
  });

  return result;
}
