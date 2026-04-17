import Anthropic from "@anthropic-ai/sdk";

/**
 * Extraction automatique des données d'un devis PDF via Claude Opus 4.7.
 *
 * Usage : upload d'un devis signé par l'installateur → analyse → JSON structuré
 * pré-remplissant le formulaire de création de mission.
 *
 * Coût approximatif par extraction :
 * - Input PDF (~5-8K tokens) : ~0.03 €
 * - Output JSON (~500 tokens) : ~0.01 €
 * - Total : ~0.04 € par devis
 */

const MISSION_TYPES = [
  "pac_air_eau",
  "pac_air_air",
  "climatisation",
  "pv",
  "ite",
  "isolation_combles",
  "ssc",
  "unknown",
] as const;

export type MissionType = (typeof MISSION_TYPES)[number];

export interface ExtractedMissionData {
  client_first_name?: string;
  client_last_name?: string;
  client_email?: string;
  client_phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  type?: MissionType;
  equipment?: string;
  equipment_brand?: string;
  amount_ht?: number;
  amount_ttc?: number;
  preferred_start_date?: string;
  notes?: string;
  confidence: {
    overall: number; // 0-100
    extraction_quality: "excellent" | "good" | "partial" | "poor";
  };
  extracted_fields: string[]; // noms des champs effectivement extraits (pour badges "IA")
}

export type ExtractionResult =
  | { success: true; data: ExtractedMissionData }
  | { success: false; error: string; code: "missing_key" | "api_error" | "invalid_response" | "timeout" };

const SYSTEM_PROMPT = `Tu es un assistant spécialisé dans l'extraction de données de devis BTP français, en particulier pour les chantiers de rénovation énergétique (RGE).

Tu reçois un devis PDF signé entre un installateur et un client final. Ta mission :

1. Lire attentivement le document
2. Extraire les informations du client (nom, prénom, coordonnées, adresse du chantier)
3. Identifier le type de prestation parmi les catégories RGE
4. Extraire les détails de l'équipement (marque, modèle)
5. Relever les montants HT et TTC
6. Noter toute contrainte ou information utile pour l'artisan poseur

Règles strictes :
- Les montants sont en euros, sans espace ni virgule dans ta réponse (ex: 4800.00)
- Le code postal français fait 5 chiffres exactement
- Pour le téléphone, extrait uniquement les chiffres au format français (ex: 0612345678)
- Pour le type, choisis UNIQUEMENT dans la liste autorisée
- Si une information n'est pas clairement présente dans le document, LAISSE LE CHAMP VIDE plutôt que d'inventer
- Dans extracted_fields, liste UNIQUEMENT les champs que tu as effectivement extraits avec certitude

Sois précis et conservateur : mieux vaut un champ vide qu'une mauvaise donnée.`;

const EXTRACTION_TOOL = {
  name: "extract_mission_data",
  description:
    "Extrait les données structurées d'un devis RGE pour pré-remplir une mission sur la plateforme RGE Connect.",
  input_schema: {
    type: "object" as const,
    properties: {
      client_first_name: {
        type: "string",
        description: "Prénom du client final (celui qui reçoit la prestation)",
      },
      client_last_name: { type: "string", description: "Nom de famille du client final" },
      client_email: { type: "string", description: "Email du client final si présent" },
      client_phone: {
        type: "string",
        description: "Téléphone du client final au format français (10 chiffres, sans espaces)",
      },
      address: { type: "string", description: "Adresse complète du chantier (numéro + rue)" },
      city: { type: "string", description: "Ville du chantier" },
      postal_code: {
        type: "string",
        description: "Code postal français du chantier, exactement 5 chiffres",
      },
      type: {
        type: "string",
        enum: MISSION_TYPES as unknown as string[],
        description:
          "Type de prestation RGE. Utilise 'unknown' si impossible à déterminer. Correspondances : pac_air_eau = pompe à chaleur air-eau ; pac_air_air = PAC air-air ; climatisation = split simple ou multi-split ; pv = photovoltaïque ; ite = isolation thermique par l'extérieur ; isolation_combles = combles perdus ou aménagés ; ssc = système solaire combiné",
      },
      equipment: {
        type: "string",
        description:
          "Modèle, référence ou description courte de l'équipement principal (ex: 'Estia 11kW', 'Perfera FTXM 3.5kW x3', 'Hi-MO 6 440Wc x16')",
      },
      equipment_brand: {
        type: "string",
        description: "Marque de l'équipement principal (ex: 'HEIWA', 'Daikin', 'Atlantic', 'Longi')",
      },
      amount_ht: {
        type: "number",
        description: "Montant HT total du devis, en euros, nombre décimal sans séparateur",
      },
      amount_ttc: { type: "number", description: "Montant TTC total du devis, en euros" },
      preferred_start_date: {
        type: "string",
        description:
          "Date de début de chantier souhaitée si mentionnée, au format YYYY-MM-DD. Laisse vide si non spécifiée.",
      },
      notes: {
        type: "string",
        description:
          "Informations utiles pour l'artisan poseur : contraintes d'accès, matériel déjà sur place, spécificités du logement (étage, copropriété, etc.), observations importantes. Reste concis (max 500 caractères).",
      },
      confidence: {
        type: "object" as const,
        properties: {
          overall: {
            type: "number",
            description: "Score de confiance global sur l'extraction, de 0 à 100",
          },
          extraction_quality: {
            type: "string",
            enum: ["excellent", "good", "partial", "poor"],
            description:
              "excellent = toutes les infos clés présentes et nettes ; good = infos clés extraites sans ambiguïté ; partial = certaines infos manquantes ou ambiguës ; poor = document peu lisible ou format non standard",
          },
        },
        required: ["overall", "extraction_quality"],
      },
      extracted_fields: {
        type: "array",
        items: { type: "string" },
        description:
          "Liste des noms de champs effectivement extraits avec certitude depuis le document (pour affichage de badges 'IA' côté UI).",
      },
    },
    required: ["confidence", "extracted_fields"],
  },
};

/**
 * Analyse un devis PDF et retourne les données extraites au format structuré.
 *
 * @param pdfBase64 contenu du PDF encodé en base64 (sans préfixe data:)
 * @returns résultat typé avec succès + données ou échec + code d'erreur
 */
export async function extractDevisData(pdfBase64: string): Promise<ExtractionResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      success: false,
      code: "missing_key",
      error:
        "La clé API Anthropic n'est pas configurée. Ajoute ANTHROPIC_API_KEY dans les variables d'environnement Vercel.",
    };
  }

  // baseURL optionnel pour router via Vercel AI Gateway (cost tracking + failover)
  // sans modifier le code. Setter ANTHROPIC_BASE_URL=https://gateway.vercel.sh/...
  const baseURL = process.env.ANTHROPIC_BASE_URL;
  const client = new Anthropic({ apiKey, ...(baseURL ? { baseURL } : {}) });

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: SYSTEM_PROMPT,
      tools: [EXTRACTION_TOOL],
      tool_choice: { type: "tool", name: "extract_mission_data" },
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
            {
              type: "text",
              text: "Extrais les données structurées de ce devis pour créer une mission RGE Connect. Utilise l'outil extract_mission_data.",
            },
          ],
        },
      ],
    });

    // Cherche le block tool_use dans la réponse
    const toolUseBlock = response.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    if (!toolUseBlock) {
      return {
        success: false,
        code: "invalid_response",
        error: "Claude n'a pas retourné de tool_use block. Réponse inattendue.",
      };
    }

    const data = toolUseBlock.input as ExtractedMissionData;

    // Validation basique : au minimum confidence + extracted_fields doivent être présents
    if (!data.confidence || !data.extracted_fields) {
      return {
        success: false,
        code: "invalid_response",
        error: "Schéma de réponse incomplet (confidence ou extracted_fields manquant).",
      };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      return {
        success: false,
        code: "missing_key",
        error: "Clé API Anthropic invalide ou révoquée.",
      };
    }
    if (error instanceof Anthropic.APIError) {
      return {
        success: false,
        code: "api_error",
        error: `Erreur API Anthropic (${error.status}) : ${error.message}`,
      };
    }
    return {
      success: false,
      code: "api_error",
      error: error instanceof Error ? error.message : "Erreur inconnue lors de l'extraction.",
    };
  }
}
