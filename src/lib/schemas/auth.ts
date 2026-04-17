import { z } from "zod";
import { siretSchema, frPhoneSchema, frPostalCodeSchema } from "./mission";

// Mot de passe fort : min 12 chars, au moins 1 majuscule, 1 minuscule,
// 1 chiffre, 1 caractère spécial
export const strongPasswordSchema = z
  .string()
  .min(12, "Le mot de passe doit faire au moins 12 caractères")
  .max(128)
  .regex(/[A-Z]/, "Doit contenir au moins une majuscule")
  .regex(/[a-z]/, "Doit contenir au moins une minuscule")
  .regex(/\d/, "Doit contenir au moins un chiffre")
  .regex(/[^A-Za-z0-9]/, "Doit contenir au moins un caractère spécial");

export const loginSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  password: z.string().min(1).max(128),
});

export const installerRegisterSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  password: strongPasswordSchema,
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  company_name: z.string().min(2).max(200),
  siret: siretSchema,
  address: z.string().min(3).max(255),
  city: z.string().min(1).max(100),
  postal_code: frPostalCodeSchema,
  phone: frPhoneSchema,
  accept_terms: z.literal(true, {
    message: "Vous devez accepter les CGU",
  }),
});

export const subcontractorRegisterSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
  password: strongPasswordSchema,
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  company_name: z.string().min(2).max(200),
  siret: siretSchema,
  address: z.string().min(3).max(255),
  city: z.string().min(1).max(100),
  postal_code: frPostalCodeSchema,
  phone: frPhoneSchema,
  qualifications: z.array(z.string()).min(1, "Au moins une qualification RGE"),
  accept_terms: z.literal(true),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email().max(255).toLowerCase(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: strongPasswordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type InstallerRegisterInput = z.infer<typeof installerRegisterSchema>;
export type SubcontractorRegisterInput = z.infer<typeof subcontractorRegisterSchema>;
