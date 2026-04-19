"use server";

import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { geocodeAddress } from "@/lib/insee/geocode";
import { logAudit } from "@/lib/security/audit";
import { z } from "zod";

const saveSchema = z.object({
  latitude: z.number().min(41).max(51.5),
  longitude: z.number().min(-5.5).max(10),
  radius_km: z.number().int().min(10).max(1000),
});

export type ZoneSaveResult =
  | { success: true }
  | { success: false; error: string };

export async function saveInterventionZone(
  input: z.infer<typeof saveSchema>
): Promise<ZoneSaveResult> {
  const parsed = saveSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Données de zone invalides" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Non authentifié" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("subcontractor_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.subcontractor_id || profile.role !== "subcontractor") {
    return { success: false, error: "Seuls les sous-traitants ont une zone" };
  }

  const service = createServiceRoleClient();
  const { error } = await service
    .from("subcontractors")
    .update({
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      intervention_radius_km: parsed.data.radius_km,
    })
    .eq("id", profile.subcontractor_id);

  if (error) return { success: false, error: error.message };

  await logAudit({
    action: "update",
    actorId: user.id,
    targetTable: "subcontractors",
    targetId: profile.subcontractor_id,
    subcontractorId: profile.subcontractor_id,
    metadata: {
      event: "intervention_zone_set",
      latitude: parsed.data.latitude,
      longitude: parsed.data.longitude,
      radius_km: parsed.data.radius_km,
    },
  });

  return { success: true };
}

export async function geocodeSiegeForZone(
  address: string,
  city: string,
  postalCode: string
): Promise<{ lat: number; lng: number; label: string } | null> {
  const query = `${address} ${postalCode} ${city}`.trim();
  const result = await geocodeAddress(query, postalCode);
  if (!result.success) return null;
  return {
    lat: result.latitude,
    lng: result.longitude,
    label: result.label,
  };
}
