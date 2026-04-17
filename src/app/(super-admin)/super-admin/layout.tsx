import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Shield, Key, Database, Users, LogOut, Home } from "lucide-react";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/super-admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_super_admin, email, first_name, last_name")
    .eq("id", user.id)
    .single();

  if (!profile?.is_super_admin) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top bar super admin */}
      <header className="bg-ink-900 text-cream-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Link href="/super-admin" className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gold-400" strokeWidth={2} />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-gold-400 font-semibold">
                Super Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1 ml-4">
              <Link
                href="/super-admin/api-keys"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-body text-cream-100 hover:bg-cream-50/10 transition-colors"
              >
                <Key className="h-3.5 w-3.5" strokeWidth={1.8} />
                Clés API
              </Link>
              <Link
                href="/super-admin/users"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-body text-cream-100/60 hover:bg-cream-50/10 transition-colors"
              >
                <Users className="h-3.5 w-3.5" strokeWidth={1.8} />
                Utilisateurs
              </Link>
              <Link
                href="/super-admin/data"
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-body text-cream-100/60 hover:bg-cream-50/10 transition-colors"
              >
                <Database className="h-3.5 w-3.5" strokeWidth={1.8} />
                Données
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-body text-ink-400">
              {profile.email}
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-md border border-cream-50/20 px-3 py-1.5 text-xs font-body text-cream-100 hover:bg-cream-50/5 transition-colors"
            >
              <Home className="h-3 w-3" />
              App
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
