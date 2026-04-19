"use server";

import { createClient } from "@/lib/supabase/server";
import { rateLimit, RATE_LIMITS } from "@/lib/security/rate-limit";
import { logAudit } from "@/lib/security/audit";
import { headers } from "next/headers";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().max(255).toLowerCase(),
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://rge-connect.vercel.app";

export type ResendResult =
  | { success: true }
  | {
      success: false;
      error: string;
      code: "invalid_email" | "rate_limited" | "server_error" | "already_confirmed";
    };

export async function resendActivationEmail(
  emailInput: string
): Promise<ResendResult> {
  const parsed = schema.safeParse({ email: emailInput });
  if (!parsed.success) {
    return {
      success: false,
      code: "invalid_email",
      error: "Email invalide",
    };
  }

  // Rate limit IP (anti-spam)
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ??
    headersList.get("x-real-ip") ??
    "unknown";
  const limit = rateLimit(`resend:${ip}`, RATE_LIMITS.auth);
  if (!limit.success) {
    return {
      success: false,
      code: "rate_limited",
      error: `Trop de tentatives. Réessaie dans ${Math.ceil(limit.retryAfter / 60)} min.`,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${APP_URL}/activate`,
    },
  });

  if (error) {
    // Code "over_email_send_rate_limit" ou autres
    if (error.message.includes("already confirmed") || error.message.includes("already registered")) {
      return {
        success: false,
        code: "already_confirmed",
        error: "Ce compte est déjà activé. Connecte-toi directement.",
      };
    }
    await logAudit({
      action: "password_reset", // pas d'action dédiée, on réutilise
      metadata: { event: "resend_activation_failed", email: parsed.data.email, reason: error.message },
      success: false,
      errorMessage: error.message,
    });
    return {
      success: false,
      code: "server_error",
      error: "Impossible d'envoyer l'email. Réessaie dans quelques minutes.",
    };
  }

  await logAudit({
    action: "password_reset", // pas d'action dédiée dans l'enum
    metadata: { event: "resend_activation", email: parsed.data.email },
    success: true,
  });

  return { success: true };
}
