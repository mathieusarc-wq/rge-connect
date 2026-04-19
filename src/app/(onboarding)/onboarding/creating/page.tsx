import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import CreatingClient from "./creating-client";

export const metadata = {
  title: "Création de votre espace — RGE Connect",
};

interface PageProps {
  searchParams: Promise<{ demo?: string }>;
}

export default async function CreatingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Mode démo
  if (params.demo === "1") {
    return (
      <Suspense>
        <CreatingClient role="subcontractor" redirectTo="/dashboard" firstName="Thomas" />
      </Suspense>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <Suspense>
        <CreatingClient role="subcontractor" redirectTo="/login" firstName="" />
      </Suspense>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name")
    .eq("id", user.id)
    .single();

  const role = (profile?.role as "installer" | "subcontractor") ?? "subcontractor";
  const redirectTo = role === "installer" ? "/installer/dashboard" : "/dashboard";

  return (
    <Suspense>
      <CreatingClient role={role} redirectTo={redirectTo} firstName={profile?.first_name ?? ""} />
    </Suspense>
  );
}
