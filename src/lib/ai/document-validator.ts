/**
 * Validation stricte des documents RGE Connect.
 *
 * L'IA extrait, ce module valide en croisant avec le contexte d'inscription.
 * Statuts :
 * - valid : toutes les règles passent → débloque le flow
 * - warning : doc utilisable mais alerte (ex: proche de l'expiration)
 * - rejected : problème bloquant → l'user doit re-uploader
 */

import type { DocumentKind, ExtractedFields } from "./document-extractor";

export type ValidationSeverity = "valid" | "warning" | "rejected";

export interface ValidationIssue {
  severity: "warning" | "rejected";
  code: string;
  message: string;
  field?: string;
  expected?: string;
  actual?: string;
}

export interface ValidationResult {
  status: ValidationSeverity;
  issues: ValidationIssue[];
}

export interface ValidationContext {
  declared_siret: string;
  declared_company_name: string;
  declared_qualifications?: string[]; // ex: ['QualiPac', 'QualiPV']
  slot?: string; // slot spécifique ('rge_qualipac', 'decennale', ...)
}

// Normalisation pour comparaison fuzzy
function normalize(s: string | null | undefined): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // accents
    .replace(/\./g, "") // points
    .replace(/\s+/g, " ") // espaces multiples
    .replace(/(sarl|sasu|sas|sa|eurl|ei)\b/gi, "") // formes juridiques
    .trim();
}

function normalizeSiret(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/\D/g, "");
}

function parseIsoDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return null;
  const d = new Date(`${m[1]}-${m[2]}-${m[3]}T00:00:00Z`);
  return isNaN(d.getTime()) ? null : d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function nowMidnight(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

/**
 * Vérifie le score de confiance IA global.
 */
function checkConfidence(data: ExtractedFields, issues: ValidationIssue[]): void {
  const score = Number(data.confidence_score ?? 0);
  if (score === 0) return; // pas de score = skip
  if (score < 50) {
    issues.push({
      severity: "rejected",
      code: "confidence_too_low",
      message: `Document illisible (confiance ${score}%). Réuploade une version plus nette.`,
      field: "confidence_score",
    });
    return;
  }
  if (score < 70) {
    issues.push({
      severity: "warning",
      code: "confidence_low",
      message: `L'IA a eu du mal à lire ce document (confiance ${score}%). Vérifie les infos extraites.`,
      field: "confidence_score",
    });
  }
}

/**
 * Vérifie que le SIRET extrait correspond au SIRET déclaré.
 */
function checkSiret(
  data: ExtractedFields,
  ctx: ValidationContext,
  issues: ValidationIssue[],
  required: boolean = true
): void {
  const extracted = normalizeSiret(data.siret as string | undefined);
  const declared = normalizeSiret(ctx.declared_siret);

  if (!extracted) {
    if (required) {
      issues.push({
        severity: "rejected",
        code: "siret_missing",
        message: "Impossible de lire le SIRET sur ce document. Vérifie la netteté du scan.",
        field: "siret",
      });
    }
    return;
  }

  if (extracted !== declared) {
    issues.push({
      severity: "rejected",
      code: "siret_mismatch",
      message: `Le SIRET du document (${formatSiret(extracted)}) ne correspond pas au SIRET déclaré (${formatSiret(declared)}).`,
      field: "siret",
      actual: extracted,
      expected: declared,
    });
  }
}

/**
 * Vérifie la raison sociale (fuzzy match).
 */
function checkCompanyName(
  data: ExtractedFields,
  ctx: ValidationContext,
  issues: ValidationIssue[]
): void {
  const extracted = normalize(data.company_name as string | undefined);
  const declared = normalize(ctx.declared_company_name);

  if (!extracted) return; // si pas extrait, on ne bloque pas ici (on bloque via SIRET)

  // match si l'un inclut l'autre (ex: "LM ENERGY" inclus dans "LM ENERGY SAS")
  if (!extracted.includes(declared) && !declared.includes(extracted)) {
    issues.push({
      severity: "warning",
      code: "company_name_mismatch",
      message: `Raison sociale du document "${data.company_name}" ≠ raison sociale déclarée "${ctx.declared_company_name}".`,
      field: "company_name",
      actual: String(data.company_name ?? ""),
      expected: ctx.declared_company_name,
    });
  }
}

/**
 * Vérifie qu'une date est > aujourd'hui (non expirée).
 */
function checkNotExpired(
  dateField: string,
  data: ExtractedFields,
  issues: ValidationIssue[],
  labelFr: string,
  warnIfExpiresInDays?: number
): void {
  const dateStr = data[dateField] as string | undefined;
  if (!dateStr) return;
  const date = parseIsoDate(dateStr);
  if (!date) return;

  const now = nowMidnight();
  const days = daysBetween(now, date);

  if (days < 0) {
    issues.push({
      severity: "rejected",
      code: `${dateField}_expired`,
      message: `${labelFr} expiré${labelFr.endsWith("e") ? "e" : ""} depuis ${Math.abs(days)} jours (${dateStr}).`,
      field: dateField,
    });
    return;
  }

  if (warnIfExpiresInDays && days < warnIfExpiresInDays) {
    issues.push({
      severity: "warning",
      code: `${dateField}_expires_soon`,
      message: `${labelFr} expire dans ${days} jours (${dateStr}). Prévois un renouvellement.`,
      field: dateField,
    });
  }
}

/**
 * Vérifie qu'un Kbis n'a pas plus de X mois.
 */
function checkKbisRecent(data: ExtractedFields, issues: ValidationIssue[]): void {
  const issuedStr = (data.issue_date ?? data.creation_date) as string | undefined;
  if (!issuedStr) return;
  const issued = parseIsoDate(issuedStr);
  if (!issued) return;

  const now = nowMidnight();
  const ageDays = daysBetween(issued, now);

  if (ageDays > 180) {
    issues.push({
      severity: "rejected",
      code: "kbis_too_old",
      message: `Kbis trop ancien (${Math.floor(ageDays / 30)} mois). Mangopay exige un extrait de moins de 3 mois.`,
      field: "issue_date",
    });
    return;
  }

  if (ageDays > 90) {
    issues.push({
      severity: "warning",
      code: "kbis_aging",
      message: `Kbis émis il y a ${Math.floor(ageDays / 30)} mois. Mangopay préfère un extrait plus récent (< 3 mois).`,
      field: "issue_date",
    });
  }
}

/**
 * Vérifie que l'attestation URSSAF n'a pas plus de 6 mois.
 */
function checkUrssafRecent(data: ExtractedFields, issues: ValidationIssue[]): void {
  const issuedStr = data.issue_date as string | undefined;
  if (!issuedStr) return;
  const issued = parseIsoDate(issuedStr);
  if (!issued) return;

  const now = nowMidnight();
  const ageDays = daysBetween(issued, now);

  if (ageDays > 180) {
    issues.push({
      severity: "rejected",
      code: "urssaf_too_old",
      message: `Attestation URSSAF trop ancienne (${Math.floor(ageDays / 30)} mois). Demande une attestation datée de moins de 6 mois.`,
      field: "issue_date",
    });
  }
}

/**
 * Vérifie que l'URSSAF confirme l'entreprise à jour.
 */
function checkUrssafUpToDate(data: ExtractedFields, issues: ValidationIssue[]): void {
  const isUpToDate = data.is_up_to_date as boolean | undefined;
  if (isUpToDate === false) {
    issues.push({
      severity: "rejected",
      code: "urssaf_not_up_to_date",
      message: "L'URSSAF indique que l'entreprise n'est pas à jour de ses cotisations.",
      field: "is_up_to_date",
    });
  }
}

/**
 * Vérifie que le type de qualification RGE correspond à celui déclaré (si slot spécifique).
 */
function checkRgeType(
  data: ExtractedFields,
  ctx: ValidationContext,
  issues: ValidationIssue[]
): void {
  const extractedType = normalize(data.qualification_type as string | undefined);
  if (!extractedType || !ctx.slot) return;

  // Mapping slot → mot-clé attendu
  const slotKeywords: Record<string, string[]> = {
    rge_qualipac: ["qualipac"],
    rge_qualipv: ["qualipv"],
    rge_qualibois: ["qualibois"],
    rge_qualisol_cesi: ["qualisol", "cesi"],
    rge_qualisol_ssc: ["qualisol", "ssc"],
    rge_ventilation: ["ventilation+", "ventilation plus", "ventilation"],
    rge_qualibat_ite: ["qualibat", "ite"],
    rge_qualibat_iti_combles: ["qualibat", "iti", "comble"],
    rge_qualibat_iti_rampants: ["qualibat", "iti", "rampant"],
    rge_qualibat_iti_murs: ["qualibat", "iti", "mur"],
    rge_qualibat_menuiserie: ["qualibat", "menuiserie"],
  };

  const expected = slotKeywords[ctx.slot];
  if (!expected) return; // slot rge_other → pas de check

  const allMatch = expected.every((kw) => extractedType.includes(kw));
  if (!allMatch) {
    issues.push({
      severity: "rejected",
      code: "rge_type_mismatch",
      message: `Attestation attendue : ${expected.join(" ")}. Type extrait : "${data.qualification_type}".`,
      field: "qualification_type",
      actual: String(data.qualification_type ?? ""),
      expected: expected.join(" "),
    });
  }
}

/**
 * Vérifie qu'un IBAN commence par FR (Mangopay France).
 */
function checkIban(data: ExtractedFields, issues: ValidationIssue[]): void {
  const iban = ((data.iban as string | undefined) ?? "").replace(/\s/g, "").toUpperCase();
  if (!iban) {
    issues.push({
      severity: "rejected",
      code: "iban_missing",
      message: "IBAN introuvable sur ce RIB. Vérifie la netteté du document.",
      field: "iban",
    });
    return;
  }
  if (!iban.startsWith("FR")) {
    issues.push({
      severity: "rejected",
      code: "iban_not_french",
      message: `IBAN non français (${iban.slice(0, 2)}). RGE Connect supporte uniquement les comptes français pour le moment.`,
      field: "iban",
    });
  }
}

/**
 * Vérifie que le compte est professionnel.
 */
function checkIsCompanyAccount(data: ExtractedFields, issues: ValidationIssue[]): void {
  const isCompany = data.is_company_account as boolean | undefined;
  if (isCompany === false) {
    issues.push({
      severity: "warning",
      code: "rib_not_company",
      message: "Ce RIB semble être un compte personnel. Mangopay exige un compte professionnel au nom de la société.",
      field: "is_company_account",
    });
  }
}

/* ================================================================= */
/* VALIDATION PAR TYPE DE DOCUMENT                                   */
/* ================================================================= */

export function validateDocument(
  kind: DocumentKind,
  data: ExtractedFields,
  ctx: ValidationContext
): ValidationResult {
  const issues: ValidationIssue[] = [];

  checkConfidence(data, issues);

  switch (kind) {
    case "kbis":
      checkSiret(data, ctx, issues);
      checkCompanyName(data, ctx, issues);
      checkKbisRecent(data, issues);
      break;

    case "rge":
      checkSiret(data, ctx, issues, false); // optionnel sur certaines attestations
      checkCompanyName(data, ctx, issues);
      checkNotExpired("valid_until", data, issues, "Qualification RGE", 60);
      checkRgeType(data, ctx, issues);
      break;

    case "decennale":
      // Le champ est insured_siret, pas siret
      if (data.insured_siret && normalizeSiret(data.insured_siret as string) !== normalizeSiret(ctx.declared_siret)) {
        issues.push({
          severity: "rejected",
          code: "insured_siret_mismatch",
          message: `SIRET de l'assuré (${formatSiret(String(data.insured_siret))}) ≠ SIRET déclaré (${formatSiret(ctx.declared_siret)}).`,
          field: "insured_siret",
        });
      }
      // Raison sociale assurée
      {
        const insuredName = normalize(data.insured_name as string | undefined);
        const declared = normalize(ctx.declared_company_name);
        if (insuredName && !insuredName.includes(declared) && !declared.includes(insuredName)) {
          issues.push({
            severity: "warning",
            code: "insured_name_mismatch",
            message: `Nom de l'assuré "${data.insured_name}" ≠ raison sociale déclarée.`,
            field: "insured_name",
          });
        }
      }
      checkNotExpired("valid_until", data, issues, "Décennale", 60);
      break;

    case "urssaf":
      checkSiret(data, ctx, issues);
      checkCompanyName(data, ctx, issues);
      checkUrssafRecent(data, issues);
      checkUrssafUpToDate(data, issues);
      break;

    case "rib":
      checkIban(data, issues);
      checkIsCompanyAccount(data, issues);
      // Holder fuzzy match
      {
        const holder = normalize(data.account_holder as string | undefined);
        const declared = normalize(ctx.declared_company_name);
        if (holder && !holder.includes(declared) && !declared.includes(holder)) {
          issues.push({
            severity: "warning",
            code: "rib_holder_mismatch",
            message: `Titulaire du RIB "${data.account_holder}" ≠ raison sociale déclarée.`,
            field: "account_holder",
          });
        }
      }
      break;

    case "rc_pro":
      // Siret de l'assuré
      if (data.insured_siret && normalizeSiret(data.insured_siret as string) !== normalizeSiret(ctx.declared_siret)) {
        issues.push({
          severity: "rejected",
          code: "insured_siret_mismatch",
          message: `SIRET de l'assuré ≠ SIRET déclaré.`,
          field: "insured_siret",
        });
      }
      checkNotExpired("valid_until", data, issues, "RC Pro", 60);
      break;

    case "carte_btp":
      checkCompanyName(data, ctx, issues);
      checkNotExpired("valid_until", data, issues, "Carte BTP", 30);
      break;
  }

  // Calcul du status global
  const hasRejection = issues.some((i) => i.severity === "rejected");
  const status: ValidationSeverity = hasRejection
    ? "rejected"
    : issues.length > 0
    ? "warning"
    : "valid";

  return { status, issues };
}

/**
 * Utilitaire pour formatter un SIRET avec espaces visuels.
 */
function formatSiret(s: string): string {
  const clean = s.replace(/\D/g, "");
  if (clean.length !== 14) return s;
  return `${clean.slice(0, 3)} ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9, 14)}`;
}
