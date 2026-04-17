import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingClient from "./onboarding-client";

export const metadata = {
  title: "Upload tes documents — RGE Connect",
};

export default async function OnboardingDocumentsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, first_name, subcontractor_id, installer_id")
    .eq("id", user.id)
    .single();

  if (!profile) {
    redirect("/login");
  }

  // Récupérer les qualifications RGE déclarées pour afficher les bons slots
  let qualifications: string[] = [];
  if (profile.role === "subcontractor" && profile.subcontractor_id) {
    const { data: sub } = await supabase
      .from("subcontractors")
      .select("qualifications")
      .eq("id", profile.subcontractor_id)
      .single();
    qualifications = (sub?.qualifications as string[]) ?? [];
  }

  // Récupérer les documents déjà uploadés
  let existingDocs: Array<{ id: string; kind: string; file_name: string | null; status: string }> = [];
  if (profile.role === "subcontractor" && profile.subcontractor_id) {
    const { data: docs } = await supabase
      .from("subcontractor_documents")
      .select("id, kind, file_name, status")
      .eq("subcontractor_id", profile.subcontractor_id);
    existingDocs = docs ?? [];
  }

  return (
    <OnboardingClient
      role={profile.role as "subcontractor" | "installer"}
      firstName={profile.first_name ?? ""}
      qualifications={qualifications}
      existingDocs={existingDocs}
    />
  );
}
