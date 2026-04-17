import { z } from "zod";
import { siretSchema, frPostalCodeSchema, frPhoneSchema, missionTypeSchema } from "./mission";

export const subcontractorOnboardingSchema = z.object({
  name: z.string().min(2).max(200),
  siret: siretSchema,
  address: z.string().min(3).max(255),
  city: z.string().min(1).max(100),
  postal_code: frPostalCodeSchema,
  email: z.string().email().max(255),
  phone: frPhoneSchema,
  qualifications: z.array(z.string().min(1).max(50)).min(1).max(10),
  mission_types: z.array(missionTypeSchema).min(1),
  intervention_radius_km: z.number().int().min(5).max(1000).default(30),
});

export const updateSubcontractorSchema = subcontractorOnboardingSchema.partial();

export const updateInterventionZoneSchema = z.object({
  intervention_radius_km: z.number().int().min(5).max(1000),
  latitude: z.number().min(41).max(51.5), // bornes France métropolitaine
  longitude: z.number().min(-5.5).max(10),
});

// Upload de document : le fichier lui-même est géré via Supabase Storage
export const uploadDocumentSchema = z.object({
  kind: z.enum([
    "kbis",
    "rge_qualipac",
    "rge_qualipv",
    "rge_qualibois",
    "rge_qualisol",
    "decennale",
    "urssaf",
    "carte_btp",
    "rib",
    "other",
  ]),
  issued_at: z.string().date().optional(),
  expires_at: z.string().date().optional(),
  file_name: z.string().min(1).max(255),
  // Le file_path sera défini par le serveur après upload Storage
});

export type SubcontractorOnboardingInput = z.infer<typeof subcontractorOnboardingSchema>;
export type UpdateInterventionZoneInput = z.infer<typeof updateInterventionZoneSchema>;
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;
