import { z } from "zod";

/**
 * Schemas Zod pour validation stricte des inputs côté API.
 * Utilisés par :
 * - /api/missions (POST via clé API)
 * - Server Actions (création/modif mission)
 */

// ========== Enums ==========

export const missionTypeSchema = z.enum([
  "pac_air_eau",
  "pac_air_air",
  "climatisation",
  "pv",
  "ite",
  "isolation_combles",
  "ssc",
]);

export const missionStatusSchema = z.enum([
  "draft",
  "published",
  "assigned",
  "awaiting_client_validation",
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
]);

// ========== Regex ==========

// SIRET = 14 chiffres
export const siretSchema = z
  .string()
  .regex(/^\d{14}$/, "SIRET doit contenir exactement 14 chiffres");

// CP français = 5 chiffres
export const frPostalCodeSchema = z
  .string()
  .regex(/^\d{5}$/, "Code postal français invalide");

// Téléphone FR : accepte 0X XX XX XX XX ou +33X XX XX XX XX
export const frPhoneSchema = z
  .string()
  .regex(
    /^(?:(?:\+|00)33[\s.-]?(?:\(0\)[\s.-]?)?|0)[1-9](?:[\s.-]?\d{2}){4}$/,
    "Numéro de téléphone français invalide"
  );

// ========== Mission ==========

export const createMissionSchema = z.object({
  // client final
  client_first_name: z.string().min(1).max(100),
  client_last_name: z.string().min(1).max(100),
  client_email: z.string().email().max(255).optional(),
  client_phone: frPhoneSchema.optional(),

  // adresse
  address: z.string().min(3).max(255),
  city: z.string().min(1).max(100),
  postal_code: frPostalCodeSchema,
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),

  // détails
  type: missionTypeSchema,
  equipment: z.string().max(255).optional(),
  equipment_brand: z.string().max(100).optional(),
  notes: z.string().max(2000).optional(),

  // montants (en euros, min 100€)
  amount_ht: z.number().positive().max(999_999).min(100),
  amount_ttc: z.number().positive().max(999_999).optional(),

  // planification
  preferred_start_date: z.string().date().optional(),
  preferred_end_date: z.string().date().optional(),

  // paiement
  payment_delay_days: z.union([z.literal(15), z.literal(30), z.literal(45)]).default(30),
  factoring_enabled: z.boolean().default(false),

  // méta
  external_id: z.string().max(255).optional(),
}).refine(
  (data) =>
    !data.preferred_start_date ||
    !data.preferred_end_date ||
    new Date(data.preferred_start_date) <= new Date(data.preferred_end_date),
  {
    message: "preferred_end_date doit être >= preferred_start_date",
    path: ["preferred_end_date"],
  }
);

export type CreateMissionInput = z.infer<typeof createMissionSchema>;

// ========== Mission offer (créneaux proposés) ==========

export const missionOfferSchema = z.object({
  mission_id: z.string().uuid(),
  proposed_slots: z
    .array(
      z.object({
        start: z.string().datetime(),
        end: z.string().datetime(),
      })
    )
    .min(1)
    .max(5),
  message: z.string().max(1000).optional(),
});

export type MissionOfferInput = z.infer<typeof missionOfferSchema>;
