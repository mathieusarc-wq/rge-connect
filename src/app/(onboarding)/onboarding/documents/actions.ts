"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import {
  extractDocument,
  type DocumentKind as AIDocumentKind,
  type ExtractedFields,
} from "@/lib/ai/document-extractor";
import type { ValidationResult, ValidationContext } from "@/lib/ai/document-validator";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";
import { headers } from "next/headers";
import crypto from "node:crypto";
import type { Database } from "@/lib/supabase/types";

type DBDocumentKind = Database["public"]["Enums"]["document_kind"];

export type DocSlot =
  | "kbis"
  | "rge_qualipac"
  | "rge_qualipv"
  | "rge_qualibois"
  | "rge_qualisol_cesi"
  | "rge_qualisol_ssc"
  | "rge_ventilation"
  | "rge_qualibat_ite"
  | "rge_qualibat_iti_combles"
  | "rge_qualibat_iti_rampants"
  | "rge_qualibat_iti_murs"
  | "rge_qualibat_menuiserie"
  | "rge_other"
  | "decennale"
  | "urssaf"
  | "rib"
  | "rc_pro"
  | "carte_btp";

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export type UploadResult =
  | {
      success: true;
      document_id: string;
      extracted: ExtractedFields;
      extraction_confidence: number;
      extraction_quality: string;
      validation: ValidationResult;
    }
  | {
      success: false;
      code: "no_file" | "too_large" | "bad_type" | "rate_limited" | "not_authenticated" | "storage_error" | "ai_error" | "db_error";
      error: string;
    };

const slotToAiKind: Record<DocSlot, AIDocumentKind> = {
  kbis: "kbis",
  rge_qualipac: "rge",
  rge_qualipv: "rge",
  rge_qualibois: "rge",
  rge_qualisol_cesi: "rge",
  rge_qualisol_ssc: "rge",
  rge_ventilation: "rge",
  rge_qualibat_ite: "rge",
  rge_qualibat_iti_combles: "rge",
  rge_qualibat_iti_rampants: "rge",
  rge_qualibat_iti_murs: "rge",
  rge_qualibat_menuiserie: "rge",
  rge_other: "rge",
  decennale: "decennale",
  urssaf: "urssaf",
  rib: "rib",
  rc_pro: "rc_pro",
  carte_btp: "carte_btp",
};

export async function uploadAndAnalyzeDocument(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file") as File | null;
  const slot = formData.get("slot") as DocSlot | null;

  if (!file || !slot) {
    return { success: false, code: "no_file", error: "Fichier ou type manquant." };
  }
  if (file.type !== "application/pdf") {
    return {
      success: false,
      code: "bad_type",
      error: "Seuls les PDF sont acceptés pour le moment.",
    };
  }
  if (file.size > MAX_SIZE) {
    return {
      success: false,
      code: "too_large",
      error: `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} MB). Max 10 MB.`,
    };
  }

  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, code: "not_authenticated", error: "Non authentifié." };
  }

  // Rate limit
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`upload:${user.id}:${ip}`, RATE_LIMITS.upload);
  if (!limit.success) {
    return {
      success: false,
      code: "rate_limited",
      error: `Trop d'uploads. Réessaie dans ${limit.retryAfter}s.`,
    };
  }

  // Profile + entité liée (pour context validation IA)
  const { data: profile } = await supabase
    .from("profiles")
    .select("subcontractor_id, installer_id, role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { success: false, code: "not_authenticated", error: "Profil introuvable." };
  }

  // Récupère les infos déclarées à l'inscription pour cross-check IA
  const service = createServiceRoleClient();
  let context: ValidationContext | undefined;

  if (profile.role === "subcontractor" && profile.subcontractor_id) {
    const { data: sub } = await service
      .from("subcontractors")
      .select("siret, name, qualifications")
      .eq("id", profile.subcontractor_id)
      .single();
    if (sub) {
      context = {
        declared_siret: sub.siret,
        declared_company_name: sub.name,
        declared_qualifications: (sub.qualifications as string[] | null) ?? [],
        slot,
      };
    }
  } else if (profile.role === "installer" && profile.installer_id) {
    const { data: inst } = await service
      .from("installers")
      .select("siret, name")
      .eq("id", profile.installer_id)
      .single();
    if (inst) {
      context = {
        declared_siret: inst.siret,
        declared_company_name: inst.name,
        slot,
      };
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

  // Storage path : documents/{user_id}/{slot}-{sha256}.pdf
  const storagePath = `${user.id}/${slot}-${sha256}.pdf`;

  const { error: uploadError } = await service.storage
    .from("documents")
    .upload(storagePath, buffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return {
      success: false,
      code: "storage_error",
      error: `Erreur upload : ${uploadError.message}`,
    };
  }

  // IA analyse + validation croisée
  const base64 = buffer.toString("base64");
  const extraction = await extractDocument(base64, slotToAiKind[slot], context);

  if (!extraction.success) {
    await logAudit({
      action: "document_rejected",
      actorId: user.id,
      subcontractorId: profile.subcontractor_id ?? undefined,
      installerId: profile.installer_id ?? undefined,
      metadata: { slot, ia_error: extraction.code },
      success: false,
      errorMessage: extraction.error,
    });
    return {
      success: false,
      code: "ai_error",
      error: extraction.error,
    };
  }

  // Insert document en DB (table subcontractor_documents existe — pour installer
  // on stockera plus tard dans installer_documents à créer)
  if (profile.role === "subcontractor" && profile.subcontractor_id) {
    const docKind = mapSlotToDBKind(slot);
    const extractedData = extraction.data as Record<string, unknown>;

    // Mapping validation.status → DB enum document_status
    const dbStatus: "valid" | "pending" | "rejected" | "expired" =
      extraction.validation.status === "valid"
        ? "valid"
        : extraction.validation.status === "rejected"
        ? "rejected"
        : "pending";

    const { data: doc, error: dbError } = await service
      .from("subcontractor_documents")
      .insert({
        subcontractor_id: profile.subcontractor_id,
        kind: docKind,
        file_path: storagePath,
        file_name: file.name,
        issued_at: stringToDate(extractedData.valid_from as string | undefined) ?? stringToDate(extractedData.issue_date as string | undefined) ?? null,
        expires_at: stringToDate(extractedData.valid_until as string | undefined) ?? null,
        status: dbStatus,
        rejected_reason: extraction.validation.status === "rejected"
          ? extraction.validation.issues.map((i) => i.message).join(" · ")
          : null,
        extracted_data: extractedData as never,
      })
      .select("id")
      .single();

    if (dbError || !doc) {
      return {
        success: false,
        code: "db_error",
        error: `Erreur enregistrement : ${dbError?.message ?? "unknown"}`,
      };
    }

    await logAudit({
      action: "document_uploaded",
      actorId: user.id,
      subcontractorId: profile.subcontractor_id,
      targetTable: "subcontractor_documents",
      targetId: doc.id,
      metadata: {
        slot,
        confidence: extraction.data.confidence_score,
        quality: extraction.data.extraction_quality,
        sha256,
      },
    });

    return {
      success: true,
      document_id: doc.id,
      extracted: extraction.data,
      extraction_confidence: Number(extraction.data.confidence_score ?? 0),
      extraction_quality: String(extraction.data.extraction_quality ?? "unknown"),
      validation: extraction.validation,
    };
  }

  // Pour installer : on log juste le fichier côté Storage pour l'instant
  await logAudit({
    action: "document_uploaded",
    actorId: user.id,
    installerId: profile.installer_id ?? undefined,
    metadata: {
      slot,
      storage_path: storagePath,
      confidence: extraction.data.confidence_score,
      validation_status: extraction.validation.status,
      issues_count: extraction.validation.issues.length,
    },
  });

  return {
    success: true,
    document_id: `storage:${storagePath}`,
    extracted: extraction.data,
    extraction_confidence: Number(extraction.data.confidence_score ?? 0),
    extraction_quality: String(extraction.data.extraction_quality ?? "unknown"),
    validation: extraction.validation,
  };
}

function mapSlotToDBKind(slot: DocSlot): DBDocumentKind {
  if (slot === "kbis") return "kbis";
  if (slot === "rge_qualipac") return "rge_qualipac";
  if (slot === "rge_qualipv") return "rge_qualipv";
  if (slot === "rge_qualibois") return "rge_qualibois";
  if (slot === "rge_qualisol_cesi" || slot === "rge_qualisol_ssc") return "rge_qualisol";
  if (slot === "decennale") return "decennale";
  if (slot === "urssaf") return "urssaf";
  if (slot === "rib") return "rib";
  if (slot === "carte_btp") return "carte_btp";
  return "other";
}

function stringToDate(s: string | undefined): string | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function isExpired(s: string | undefined): boolean {
  if (!s) return false;
  const d = stringToDate(s);
  if (!d) return false;
  return new Date(d) < new Date();
}
