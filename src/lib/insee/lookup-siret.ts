"use server";

/**
 * Lookup SIRET via l'API officielle gouvernementale recherche-entreprises.api.gouv.fr
 *
 * Documentation : https://recherche-entreprises.api.gouv.fr/docs
 *
 * - Gratuite, sans authentification
 * - Rate limit : 7 req/sec par IP
 * - Données INSEE Sirene, à jour
 * - Fonctionne pour siret (14 chiffres) ou siren (9 chiffres)
 */

export type SiretLookupResult =
  | {
      success: true;
      data: {
        siren: string;
        siret: string;
        company_name: string; // nom raison sociale
        address: string;
        postal_code: string;
        city: string;
        activity_code: string; // code APE/NAF
        activity_label: string;
        is_active: boolean; // true si etat_administratif = A
        is_btp: boolean; // true si code APE commence par un code BTP
        creation_date: string | null;
      };
    }
  | {
      success: false;
      error: string;
      code: "invalid_format" | "not_found" | "api_error" | "closed";
    };

// Codes NAF/APE correspondant au BTP / installation ENR
// Source : https://www.insee.fr/fr/information/2120875 (NAFrev2)
const BTP_ACTIVITY_CODES = [
  "33.20B", // Installation équipements mécaniques
  "43.21A", // Installation électrique
  "43.22A", // Travaux d'installation d'eau et de gaz
  "43.22B", // Installation équipements thermiques et clim
  "43.29A", // Travaux d'isolation
  "43.29B", // Autres travaux d'installation
  "43.39Z", // Autres travaux de finition
  "43.91A", // Couverture et étanchéité
  "43.91B",
  "43.99A",
  "43.99B",
  "43.99C",
  "43.99D",
  "43.99E",
  "71.12B", // Ingénierie études techniques
];

function normalizeSiret(raw: string): string {
  return raw.replace(/\D/g, "");
}

export async function lookupSiret(rawSiret: string): Promise<SiretLookupResult> {
  const siret = normalizeSiret(rawSiret);

  if (siret.length !== 14) {
    return {
      success: false,
      code: "invalid_format",
      error: "Le SIRET doit contenir exactement 14 chiffres",
    };
  }

  try {
    // API officielle data.gouv.fr — on cherche par SIRET exact
    const url = `https://recherche-entreprises.api.gouv.fr/search?q=${siret}&per_page=1&mtm_campaign=rge-connect`;
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      // Cache 1h pour éviter les abus
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return {
        success: false,
        code: "api_error",
        error: `Erreur API INSEE (HTTP ${response.status})`,
      };
    }

    type ApiResponse = {
      results?: Array<{
        siren?: string;
        nom_complet?: string;
        nom_raison_sociale?: string;
        etat_administratif?: string;
        siege?: {
          siret?: string;
          adresse?: string;
          code_postal?: string;
          libelle_commune?: string;
          activite_principale?: string;
          libelle_activite_principale?: string;
          etat_administratif?: string;
          date_creation?: string;
        };
      }>;
    };

    const payload: ApiResponse = await response.json();
    const first = payload.results?.[0];
    const siege = first?.siege;

    if (!first || !siege || siege.siret !== siret) {
      return {
        success: false,
        code: "not_found",
        error: "Aucune entreprise trouvée avec ce SIRET",
      };
    }

    const isActive =
      (siege.etat_administratif ?? first.etat_administratif ?? "A") === "A";

    if (!isActive) {
      return {
        success: false,
        code: "closed",
        error: "Cette entreprise est fermée (état administratif = cessé)",
      };
    }

    const activityCode = siege.activite_principale ?? "";
    const isBtp = BTP_ACTIVITY_CODES.some((prefix) =>
      activityCode.startsWith(prefix.slice(0, 5))
    );

    const companyName =
      first.nom_raison_sociale ?? first.nom_complet ?? "Entreprise";

    return {
      success: true,
      data: {
        siren: first.siren ?? siret.slice(0, 9),
        siret,
        company_name: companyName,
        address: (siege.adresse ?? "").trim(),
        postal_code: siege.code_postal ?? "",
        city: (siege.libelle_commune ?? "").trim(),
        activity_code: activityCode,
        activity_label: siege.libelle_activite_principale ?? "",
        is_active: isActive,
        is_btp: isBtp,
        creation_date: siege.date_creation ?? null,
      },
    };
  } catch (error) {
    return {
      success: false,
      code: "api_error",
      error:
        error instanceof Error
          ? `Erreur réseau : ${error.message}`
          : "Erreur inconnue lors de la recherche",
    };
  }
}
