import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { geocodeSiegeForZone } from "./actions";
import ZoneClient from "./zone-client";

export const metadata = {
  title: "Ta zone d'intervention — RGE Connect",
};

interface PageProps {
  searchParams: Promise<{ demo?: string }>;
}

export default async function OnboardingZonePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Mode démo
  if (params.demo === "1") {
    return (
      <ZoneClient
        subcontractorId="demo"
        siegeAddress="16 Place des Quinconces"
        siegeCity="Bordeaux"
        siegePostalCode="33000"
        initialLat={44.8452}
        initialLng={-0.5742}
        initialRadius={30}
        firstName="Thomas"
        demo
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("subcontractor_id, first_name, role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "subcontractor" || !profile.subcontractor_id) {
    // Installateur ou pas de profile → skip directement creating
    redirect("/onboarding/creating");
  }

  const { data: sub } = await supabase
    .from("subcontractors")
    .select("address, city, postal_code, latitude, longitude, intervention_radius_km")
    .eq("id", profile.subcontractor_id)
    .single();

  if (!sub) redirect("/onboarding/creating");

  // Si pas de lat/lng encore, on geocode l'adresse du siège
  let initialLat = sub.latitude ?? null;
  let initialLng = sub.longitude ?? null;

  if (!initialLat || !initialLng) {
    const geo = await geocodeSiegeForZone(sub.address, sub.city, sub.postal_code);
    if (geo) {
      initialLat = geo.lat;
      initialLng = geo.lng;
    } else {
      // Fallback Paris si geocoding échoue
      initialLat = 48.8566;
      initialLng = 2.3522;
    }
  }

  return (
    <ZoneClient
      subcontractorId={profile.subcontractor_id}
      siegeAddress={sub.address}
      siegeCity={sub.city}
      siegePostalCode={sub.postal_code}
      initialLat={initialLat}
      initialLng={initialLng}
      initialRadius={sub.intervention_radius_km ?? 30}
      firstName={profile.first_name ?? ""}
    />
  );
}
