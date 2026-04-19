"use server";

/**
 * Geocoding via l'API officielle adresse.data.gouv.fr
 * Sans authentification, gratuit, données BAN (Base Adresse Nationale).
 */

export type GeocodeResult =
  | {
      success: true;
      latitude: number;
      longitude: number;
      label: string;
      score: number; // 0-1
    }
  | { success: false; error: string };

export async function geocodeAddress(
  query: string,
  postcode?: string
): Promise<GeocodeResult> {
  if (!query || query.trim().length < 3) {
    return { success: false, error: "Adresse trop courte" };
  }

  const params = new URLSearchParams({
    q: query,
    limit: "1",
    ...(postcode ? { postcode } : {}),
  });

  try {
    const response = await fetch(
      `https://api-adresse.data.gouv.fr/search/?${params.toString()}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 }, // cache 24h (adresses stables)
      }
    );

    if (!response.ok) {
      return { success: false, error: `API HTTP ${response.status}` };
    }

    type ApiResponse = {
      features?: Array<{
        geometry?: { coordinates?: [number, number] };
        properties?: { label?: string; score?: number };
      }>;
    };

    const data: ApiResponse = await response.json();
    const first = data.features?.[0];
    const coords = first?.geometry?.coordinates;

    if (!first || !coords || coords.length !== 2) {
      return { success: false, error: "Aucun résultat" };
    }

    return {
      success: true,
      longitude: coords[0],
      latitude: coords[1],
      label: first.properties?.label ?? query,
      score: first.properties?.score ?? 0,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur réseau",
    };
  }
}
