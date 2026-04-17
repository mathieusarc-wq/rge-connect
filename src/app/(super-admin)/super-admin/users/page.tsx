import { createServiceRoleClient } from "@/lib/supabase/server";
import UsersClient from "./users-client";

export const metadata = {
  title: "Utilisateurs — Super Admin — RGE Connect",
};

interface PageProps {
  searchParams: Promise<{
    role?: string;
    search?: string;
    super?: string;
  }>;
}

export default async function UsersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const admin = createServiceRoleClient();

  let query = admin
    .from("profiles")
    .select(
      "id, email, first_name, last_name, role, is_super_admin, subcontractor_id, installer_id, created_at, updated_at"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  if (params.role === "subcontractor" || params.role === "installer" || params.role === "admin") {
    query = query.eq("role", params.role);
  }

  if (params.super === "1") {
    query = query.eq("is_super_admin", true);
  }

  if (params.search) {
    query = query.or(
      `email.ilike.%${params.search}%,first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%`
    );
  }

  const { data: users } = await query;

  // Enrichir avec les infos entreprises
  const subIds = Array.from(
    new Set((users ?? []).map((u) => u.subcontractor_id).filter(Boolean))
  ) as string[];
  const instIds = Array.from(
    new Set((users ?? []).map((u) => u.installer_id).filter(Boolean))
  ) as string[];

  const [{ data: subs }, { data: insts }] = await Promise.all([
    subIds.length > 0
      ? admin.from("subcontractors").select("id, name, city, siret").in("id", subIds)
      : Promise.resolve({ data: [] as Array<{ id: string; name: string; city: string; siret: string }> }),
    instIds.length > 0
      ? admin.from("installers").select("id, name, city, siret, plan").in("id", instIds)
      : Promise.resolve({ data: [] as Array<{ id: string; name: string; city: string; siret: string; plan: string }> }),
  ]);

  const subMap = new Map((subs ?? []).map((s) => [s.id, s]));
  const instMap = new Map((insts ?? []).map((i) => [i.id, i]));

  const enriched = (users ?? []).map((u) => ({
    ...u,
    company:
      u.role === "subcontractor" && u.subcontractor_id
        ? subMap.get(u.subcontractor_id) ?? null
        : u.role === "installer" && u.installer_id
        ? instMap.get(u.installer_id) ?? null
        : null,
  }));

  return (
    <UsersClient
      users={enriched}
      filters={{
        role: params.role ?? "",
        search: params.search ?? "",
        onlyAdmins: params.super === "1",
      }}
    />
  );
}
