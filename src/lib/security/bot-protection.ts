import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { logAudit } from "./audit";

/**
 * Helper à appeler EN PREMIER dans chaque Route Handler protégée par BotID.
 *
 * ⚠️ IMPORTANT : la route doit être déclarée dans `src/instrumentation-client.ts`
 * (array `protect` du `initBotId()`) sinon checkBotId() échouera.
 *
 * USAGE dans une route :
 *
 *   export async function POST(request: NextRequest) {
 *     const botCheck = await rejectIfBot(request);
 *     if (botCheck) return botCheck;
 *
 *     // ... logique métier
 *   }
 *
 * En dev local, BotID retourne toujours isBot:false — c'est normal.
 * En prod, les bots (Playwright, Puppeteer, curl direct) sont rejetés en 403.
 */
export async function rejectIfBot(request: Request): Promise<Response | null> {
  try {
    const verification = await checkBotId();

    if (verification.isBot) {
      // Log l'accès bot pour investigation
      await logAudit({
        action: "unauthorized_access",
        success: false,
        errorMessage: "bot_detected",
        metadata: {
          url: new URL(request.url).pathname,
          method: request.method,
          classification: "bot",
        },
        request,
      });

      return NextResponse.json(
        { error: "access_denied", message: "Access denied." },
        { status: 403 }
      );
    }

    return null;
  } catch (error) {
    // BotID peut lever si la route n'est pas déclarée dans initBotId()
    // En prod on veut logger mais pas bloquer (fail-open volontaire pour éviter
    // self-lockout, à changer en fail-close si la criticité augmente).
    console.error("[botid] check failed:", error);
    return null;
  }
}

/**
 * Variante Server Action : throw au lieu de renvoyer une Response.
 *
 * USAGE :
 *
 *   "use server";
 *   import { throwIfBot } from "@/lib/security/bot-protection";
 *
 *   export async function createMission(formData: FormData) {
 *     await throwIfBot();
 *     // ... logique métier
 *   }
 */
export async function throwIfBot(): Promise<void> {
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      throw new Error("access_denied:bot_detected");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("access_denied")) {
      throw error;
    }
    console.error("[botid] check failed:", error);
    // Fail-open en cas d'erreur BotID non-détection
  }
}
