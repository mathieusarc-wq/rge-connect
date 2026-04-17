import Anthropic from "@anthropic-ai/sdk";
import { getServiceKey } from "@/lib/services/get-service-key";

/**
 * Extraction IA (RGE Connect Vision) des documents d'onboarding.
 *
 * Types supportés :
 * - kbis : raison sociale, SIRET, capital, dirigeant, date création
 * - rge : numéro RGE, type qualif, date validité, émetteur
 * - decennale : assureur, n° police, validité, activités couvertes
 * - urssaf : n° URSSAF, date émission, validité
 * - rib : IBAN, BIC, titulaire, banque
 * - rc_pro : assureur, n° police, validité, activités
 * - carte_btp : numéro carte, nom, validité
 */

export type DocumentKind =
  | "kbis"
  | "rge"
  | "decennale"
  | "urssaf"
  | "rib"
  | "rc_pro"
  | "carte_btp";

export interface ExtractedFields {
  [key: string]: string | number | boolean | null | undefined;
  // Champs communs
  document_title?: string;
  confidence_score?: number; // 0-100
  extraction_quality?: "excellent" | "good" | "partial" | "poor";
  warnings?: string; // alertes (expiré, doc flou, manque info)
}

export type DocumentExtractionResult =
  | { success: true; kind: DocumentKind; data: ExtractedFields }
  | {
      success: false;
      error: string;
      code: "missing_key" | "api_error" | "invalid_response" | "unsupported_kind";
    };

const TOOLS: Record<DocumentKind, Anthropic.Tool> = {
  kbis: {
    name: "extract_kbis",
    description: "Extrait les infos d'un extrait Kbis français.",
    input_schema: {
      type: "object",
      properties: {
        company_name: { type: "string", description: "Raison sociale" },
        siren: { type: "string", description: "SIREN 9 chiffres" },
        siret: { type: "string", description: "SIRET siège 14 chiffres" },
        capital_social: { type: "number", description: "Capital en euros" },
        legal_form: { type: "string", description: "Forme juridique (SAS, SASU, SARL, EURL, etc.)" },
        representative_name: { type: "string", description: "Nom complet du représentant légal" },
        representative_role: { type: "string", description: "Fonction (Président, Gérant, etc.)" },
        address: { type: "string", description: "Adresse complète du siège" },
        creation_date: { type: "string", description: "Date d'immatriculation YYYY-MM-DD" },
        naf_code: { type: "string", description: "Code APE/NAF" },
        issue_date: { type: "string", description: "Date d'émission du Kbis YYYY-MM-DD" },
        confidence_score: { type: "number", description: "0 à 100" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string", description: "Alerte si Kbis > 3 mois ou infos manquantes" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  rge: {
    name: "extract_rge",
    description: "Extrait les infos d'une attestation de qualification RGE (QualiPac, QualiPV, Qualibat, etc.).",
    input_schema: {
      type: "object",
      properties: {
        qualification_type: {
          type: "string",
          description: "Type exact : QualiPac, QualiPV, QualiBois, QualiSol CESI, QualiSol SSC, Ventilation+, Qualibat ITE, Qualibat ITI Combles, Qualibat ITI Rampants, Qualibat ITI Murs intérieurs, Qualibat Menuiserie, Qualifelec RGE, etc.",
        },
        certification_number: { type: "string", description: "Numéro RGE" },
        issuer: { type: "string", description: "Organisme certificateur (Qualibat, Qualit'EnR, Qualifelec...)" },
        company_name: { type: "string", description: "Raison sociale du titulaire" },
        siret: { type: "string" },
        valid_from: { type: "string", description: "Date début validité YYYY-MM-DD" },
        valid_until: { type: "string", description: "Date fin validité YYYY-MM-DD" },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string", description: "Alerte si expiré ou si manque RGE" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  decennale: {
    name: "extract_decennale",
    description: "Extrait les infos d'une attestation d'assurance décennale BTP française.",
    input_schema: {
      type: "object",
      properties: {
        insurer_name: { type: "string", description: "Nom compagnie d'assurance" },
        policy_number: { type: "string", description: "Numéro de police" },
        insured_name: { type: "string", description: "Raison sociale de l'assuré" },
        insured_siret: { type: "string" },
        valid_from: { type: "string", description: "YYYY-MM-DD" },
        valid_until: { type: "string", description: "YYYY-MM-DD" },
        coverage_amount: { type: "number", description: "Plafond garantie en euros" },
        activities_covered: {
          type: "string",
          description: "Liste des activités couvertes (plomberie, PAC, PV, isolation, etc.) séparées par virgule",
        },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  urssaf: {
    name: "extract_urssaf",
    description: "Extrait les infos d'une attestation URSSAF de vigilance.",
    input_schema: {
      type: "object",
      properties: {
        company_name: { type: "string" },
        siret: { type: "string" },
        attestation_number: { type: "string", description: "Numéro d'attestation" },
        issue_date: { type: "string", description: "Date d'émission YYYY-MM-DD" },
        valid_until: { type: "string", description: "Validité (généralement 3 ou 6 mois)" },
        is_up_to_date: { type: "boolean", description: "true si entreprise à jour des cotisations" },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  rib: {
    name: "extract_rib",
    description: "Extrait les infos d'un Relevé d'Identité Bancaire français.",
    input_schema: {
      type: "object",
      properties: {
        account_holder: { type: "string", description: "Titulaire du compte" },
        iban: { type: "string", description: "IBAN formaté FR..." },
        bic: { type: "string", description: "Code BIC/SWIFT" },
        bank_name: { type: "string", description: "Nom de la banque" },
        is_company_account: { type: "boolean", description: "true si compte professionnel" },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  rc_pro: {
    name: "extract_rc_pro",
    description: "Extrait les infos d'une attestation d'assurance Responsabilité Civile Professionnelle.",
    input_schema: {
      type: "object",
      properties: {
        insurer_name: { type: "string" },
        policy_number: { type: "string" },
        insured_name: { type: "string" },
        insured_siret: { type: "string" },
        valid_from: { type: "string" },
        valid_until: { type: "string" },
        coverage_amount: { type: "number" },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
  carte_btp: {
    name: "extract_carte_btp",
    description: "Extrait les infos d'une carte professionnelle BTP.",
    input_schema: {
      type: "object",
      properties: {
        card_number: { type: "string" },
        holder_name: { type: "string" },
        company_name: { type: "string" },
        valid_until: { type: "string" },
        confidence_score: { type: "number" },
        extraction_quality: { type: "string", enum: ["excellent", "good", "partial", "poor"] },
        warnings: { type: "string" },
      },
      required: ["confidence_score", "extraction_quality"],
    },
  },
};

const PROMPTS: Record<DocumentKind, string> = {
  kbis: "Tu reçois un extrait Kbis français. Extrais les informations structurées avec extract_kbis. Signale dans warnings si le Kbis a plus de 3 mois (exigence Mangopay).",
  rge: "Tu reçois une attestation de qualification RGE française (Qualibat, Qualit'EnR, Qualifelec, etc.). Identifie le TYPE EXACT de qualification et extrais les données avec extract_rge. Signale si la qualification est expirée.",
  decennale: "Tu reçois une attestation d'assurance décennale BTP. Extrais les informations avec extract_decennale. Signale dans warnings si expirée ou si la liste des activités couvertes ne correspond pas à des activités BTP/ENR.",
  urssaf: "Tu reçois une attestation URSSAF de vigilance française. Extrais avec extract_urssaf. Les attestations sont valables 6 mois en général. Signale si > 6 mois ou si l'entreprise n'est pas à jour.",
  rib: "Tu reçois un RIB français. Extrais avec extract_rib. Ne devine pas l'IBAN — si tu ne peux pas lire, laisse vide. Vérifie que c'est un compte professionnel.",
  rc_pro: "Tu reçois une attestation d'assurance RC Pro. Extrais avec extract_rc_pro. Signale si expirée.",
  carte_btp: "Tu reçois une carte professionnelle BTP (carte d'identification des salariés du BTP). Extrais avec extract_carte_btp.",
};

export async function extractDocument(
  pdfBase64: string,
  kind: DocumentKind
): Promise<DocumentExtractionResult> {
  const apiKey = await getServiceKey("anthropic", "api_key");
  if (!apiKey) {
    return {
      success: false,
      code: "missing_key",
      error:
        "La clé API Anthropic n'est pas configurée. Un super admin doit la renseigner depuis /super-admin/api-keys.",
    };
  }

  const tool = TOOLS[kind];
  const prompt = PROMPTS[kind];

  if (!tool || !prompt) {
    return {
      success: false,
      code: "unsupported_kind",
      error: `Type de document non supporté : ${kind}`,
    };
  }

  const baseURL = await getServiceKey("anthropic", "base_url");
  const client = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      thinking: { type: "adaptive" },
      system:
        "Tu es RGE Connect Vision, un assistant spécialisé dans l'analyse de documents administratifs BTP français. Tu dois être précis et conservateur : mieux vaut un champ vide qu'une mauvaise donnée. Respecte strictement les formats demandés (dates YYYY-MM-DD, SIRET 14 chiffres, etc.).",
      tools: [tool],
      tool_choice: { type: "tool", name: tool.name },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: pdfBase64,
              },
            },
            { type: "text", text: prompt },
          ],
        },
      ],
    });

    const toolUseBlock = response.content.find(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
    );

    if (!toolUseBlock) {
      return {
        success: false,
        code: "invalid_response",
        error: "Réponse IA inattendue (pas de tool_use).",
      };
    }

    return {
      success: true,
      kind,
      data: toolUseBlock.input as ExtractedFields,
    };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return { success: false, code: "missing_key", error: "Clé API invalide." };
    }
    if (error instanceof Anthropic.APIError) {
      return {
        success: false,
        code: "api_error",
        error: `Erreur API (${error.status}) : ${error.message}`,
      };
    }
    return {
      success: false,
      code: "api_error",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}
