import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "./types";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/api/public"];

/**
 * Mode démo : pendant la phase validation design, toutes les routes sont
 * accessibles sans authentification pour permettre à Mathieu + testeurs de
 * naviguer sur le CRM sans créer de compte.
 *
 * Activé par défaut tant qu'on n'a pas les flows d'inscription complets.
 * Pour le réactiver en prod après implémentation auth : mettre à false.
 */
const DEMO_MODE = true;

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT : getUser() doit être appelé en premier, sinon tu as des bugs
  // d'état incohérent. Ne pas remplacer par getSession().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith("/api/");

  // En mode démo, on ne redirige pas — toutes les routes sont accessibles
  if (!DEMO_MODE) {
    // Redirection si non connecté et route protégée
    if (!user && !isPublicRoute && !isApiRoute) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // Redirection si connecté et sur /login
    if (user && pathname === "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  return response;
}
