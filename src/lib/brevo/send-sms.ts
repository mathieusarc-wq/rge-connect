import "server-only";
import { getServiceKey } from "@/lib/services/get-service-key";

/**
 * Envoi de SMS transactionnel via Brevo (ex-Sendinblue).
 *
 * Doc : https://developers.brevo.com/reference/sendtransacsms
 *
 * Coût : ~0,049 €/SMS France. Sender alphanumeric "RGEConnect" max 11 chars.
 * Le sender doit être whitelisté côté Brevo dashboard pour la prod.
 */

export type SmsResult =
  | { success: true; message_id?: string; reference?: string }
  | {
      success: false;
      error: string;
      code: "missing_key" | "invalid_phone" | "api_error" | "skipped_no_phone";
    };

/**
 * Normalise un numéro français vers le format E.164 (+33XXXXXXXXX).
 * Accepte : 06 12 34 56 78, 0612345678, +33612345678, 33612345678
 */
export function normalizeFrenchPhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\s|\.|-|\(|\)/g, "").trim();

  // +33XXXXXXXXX
  if (/^\+33[1-9]\d{8}$/.test(digits)) return digits;

  // 33XXXXXXXXX
  if (/^33[1-9]\d{8}$/.test(digits)) return `+${digits}`;

  // 0XXXXXXXXX
  if (/^0[1-9]\d{8}$/.test(digits)) return `+33${digits.slice(1)}`;

  return null;
}

export async function sendTransactionalSMS(params: {
  to: string; // numéro en format FR ou E.164, sera normalisé
  content: string; // max 160 chars idéalement (1 SMS)
  tag?: string; // pour tracking côté Brevo
  webhookUrl?: string;
}): Promise<SmsResult> {
  const { to, content, tag, webhookUrl } = params;

  // Validation phone
  const e164 = normalizeFrenchPhone(to);
  if (!e164) {
    return {
      success: false,
      code: "invalid_phone",
      error: `Numéro invalide ou non-français : ${to}`,
    };
  }

  // Clé API + sender via service_credentials (fallback env)
  const apiKey = await getServiceKey("brevo", "api_key");
  if (!apiKey) {
    return {
      success: false,
      code: "missing_key",
      error:
        "Clé Brevo non configurée. Un super admin doit la renseigner depuis /super-admin/api-keys.",
    };
  }

  const senderName = (await getServiceKey("brevo", "sender_name")) ?? "RGEConnect";
  // Sender alphanumeric : max 11 chars, sans espaces ni accents
  const sender = senderName.replace(/[^A-Za-z0-9]/g, "").slice(0, 11) || "RGEConnect";

  try {
    const response = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender,
        recipient: e164,
        content,
        type: "transactional",
        ...(tag ? { tag } : {}),
        ...(webhookUrl ? { webUrl: webhookUrl } : {}),
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      return {
        success: false,
        code: "api_error",
        error: `Brevo HTTP ${response.status} : ${errBody.slice(0, 200)}`,
      };
    }

    const data = (await response.json()) as {
      messageId?: string | number;
      reference?: string;
    };

    return {
      success: true,
      message_id: data.messageId ? String(data.messageId) : undefined,
      reference: data.reference,
    };
  } catch (error) {
    return {
      success: false,
      code: "api_error",
      error: error instanceof Error ? error.message : "Erreur inconnue Brevo",
    };
  }
}

/**
 * SMS de bienvenue après création de compte.
 * Fail-open : ne bloque pas l'inscription si erreur.
 */
export async function sendWelcomeSMS(params: {
  phone: string | null | undefined;
  firstName: string;
}): Promise<SmsResult> {
  if (!params.phone) {
    return { success: false, code: "skipped_no_phone", error: "Pas de numéro fourni" };
  }

  const fn = params.firstName.trim() || "";
  // Template court pour rentrer dans 1 SMS (160 chars max)
  const content = [
    `RGE Connect - Bienvenue${fn ? " " + fn : ""} !`,
    `Ton compte est cree. Consulte ta boite mail pour l'activer.`,
    `Aide : support@rge-connect.fr`,
  ].join("\n");

  return sendTransactionalSMS({
    to: params.phone,
    content,
    tag: "welcome",
  });
}
