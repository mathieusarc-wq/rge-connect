"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  Store,
  Building2,
  MoreVertical,
  Key,
  LogIn,
  Trash2,
  ShieldCheck,
  ShieldOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import {
  toggleSuperAdmin,
  resetUserPassword,
  deleteUser,
  impersonateUser,
} from "./actions";

type Company = {
  id: string;
  name: string;
  city: string;
  siret: string;
  plan?: string;
};

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_super_admin: boolean;
  subcontractor_id: string | null;
  installer_id: string | null;
  created_at: string;
  company: Company | null;
};

type Filters = {
  role: string;
  search: string;
  onlyAdmins: boolean;
};

export default function UsersClient({
  users,
  filters,
}: {
  users: User[];
  filters: Filters;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(filters.search);
  const [role, setRole] = useState(filters.role);
  const [onlyAdmins, setOnlyAdmins] = useState(filters.onlyAdmins);

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (role) params.set("role", role);
    if (onlyAdmins) params.set("super", "1");
    router.push(`/super-admin/users${params.toString() ? "?" + params.toString() : ""}`);
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono uppercase tracking-wider text-gold-700">
            Super Admin · Utilisateurs
          </span>
        </div>
        <h1 className="text-3xl font-display font-bold text-ink-900 tracking-tight">
          Gestion des utilisateurs
        </h1>
        <p className="mt-2 text-sm font-body text-ink-500">
          {users.length} utilisateur{users.length > 1 ? "s" : ""} affiché{users.length > 1 ? "s" : ""}.
        </p>
      </div>

      {/* Filtres */}
      <div className="rounded-xl border border-forest-100 bg-white p-4 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              type="text"
              placeholder="Rechercher email, prénom, nom…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="h-10 w-full pl-10 pr-3 rounded-lg bg-cream-50 border border-forest-100 text-sm font-body focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-10 rounded-lg bg-cream-50 border border-forest-100 px-3 text-sm font-body outline-none focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20"
            >
              <option value="">Tous les rôles</option>
              <option value="subcontractor">Sous-traitants</option>
              <option value="installer">Installateurs</option>
              <option value="admin">Admins</option>
            </select>
            <label className="flex items-center gap-2 text-sm font-body text-ink-700 cursor-pointer px-3 h-10 rounded-lg border border-forest-100 bg-cream-50">
              <input
                type="checkbox"
                checked={onlyAdmins}
                onChange={(e) => setOnlyAdmins(e.target.checked)}
                className="h-4 w-4 rounded border-forest-300 text-forest-500 focus:ring-forest-500/20"
              />
              Super admins
            </label>
            <button
              onClick={applyFilters}
              className="inline-flex items-center gap-1.5 rounded-lg bg-forest-500 px-4 py-2 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors"
            >
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-body text-ink-500">
              Aucun utilisateur pour ces critères.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-forest-100/50">
            {users.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ USER ROW ============ */
function UserRow({ user }: { user: User }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ kind: "success" | "error"; msg: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "—";

  const notify = (kind: "success" | "error", msg: string) => {
    setFeedback({ kind, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleToggleAdmin = () => {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await toggleSuperAdmin(user.id, !user.is_super_admin);
      if (result.success) {
        notify("success", user.is_super_admin ? "Admin retiré" : "Promu super admin");
        router.refresh();
      } else {
        notify("error", result.error ?? "Erreur");
      }
    });
  };

  const handleResetPassword = () => {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await resetUserPassword(user.id);
      if (result.success) {
        notify("success", "Email de reset envoyé");
      } else {
        notify("error", result.error ?? "Erreur");
      }
    });
  };

  const handleImpersonate = () => {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await impersonateUser(user.id);
      if (result.success && result.link) {
        window.open(result.link, "_blank");
        notify("success", "Lien magic ouvert dans un nouvel onglet");
      } else {
        notify("error", result.error ?? "Erreur");
      }
    });
  };

  const handleDelete = () => {
    setMenuOpen(false);
    startTransition(async () => {
      const result = await deleteUser(user.id);
      if (result.success) {
        notify("success", "Utilisateur supprimé");
        router.refresh();
      } else {
        notify("error", result.error ?? "Erreur");
      }
    });
    setConfirmDelete(false);
  };

  return (
    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-cream-50/40 transition-colors relative">
      {/* Avatar role */}
      <div
        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          user.role === "installer"
            ? "bg-gold-500/20 text-gold-700"
            : user.role === "subcontractor"
            ? "bg-forest-50 text-forest-600"
            : "bg-blue-50 text-blue-600"
        }`}
      >
        {user.role === "installer" ? (
          <Building2 className="h-4 w-4" strokeWidth={2} />
        ) : user.role === "subcontractor" ? (
          <Store className="h-4 w-4" strokeWidth={2} />
        ) : (
          <Shield className="h-4 w-4" strokeWidth={2} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-body font-semibold text-ink-900 truncate">
            {fullName}
          </p>
          {user.is_super_admin && (
            <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-300/30 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold-700">
              <ShieldCheck className="h-2.5 w-2.5" strokeWidth={2.5} />
              Admin
            </span>
          )}
          <span className="text-xs font-mono text-ink-400">{user.email}</span>
        </div>
        <p className="text-xs font-body text-ink-500 mt-0.5">
          {user.company
            ? `${user.company.name} · ${user.company.city} · SIRET ${user.company.siret}`
            : `Role ${user.role}`}
        </p>
      </div>

      {/* Date */}
      <div className="hidden md:block text-right text-xs font-mono text-ink-400 flex-shrink-0">
        Inscrit le
        <br />
        {new Date(user.created_at).toLocaleDateString("fr-FR")}
      </div>

      {/* Menu */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          disabled={isPending}
          className="h-8 w-8 rounded-lg border border-forest-100 text-ink-500 hover:text-ink-700 hover:bg-cream-50 flex items-center justify-center transition-colors disabled:opacity-40"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <MoreVertical className="h-3.5 w-3.5" />
          )}
        </button>
        {menuOpen && (
          <>
            {/* Overlay pour fermer */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full mt-1 w-56 rounded-lg border border-forest-100 bg-white shadow-lg z-20 overflow-hidden">
              <button
                onClick={handleImpersonate}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-ink-700 hover:bg-cream-50 transition-colors text-left"
              >
                <LogIn className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                Se connecter en tant que
              </button>
              <button
                onClick={handleResetPassword}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-ink-700 hover:bg-cream-50 transition-colors text-left"
              >
                <Key className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                Reset password
              </button>
              <button
                onClick={handleToggleAdmin}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-ink-700 hover:bg-cream-50 transition-colors text-left"
              >
                {user.is_super_admin ? (
                  <>
                    <ShieldOff className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
                    Retirer super admin
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5 text-gold-500" strokeWidth={1.8} />
                    Promouvoir super admin
                  </>
                )}
              </button>
              <div className="border-t border-forest-100/50" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-body text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                Supprimer le compte
              </button>
            </div>
          </>
        )}
      </div>

      {/* Toast feedback */}
      {feedback && (
        <div
          className={`absolute top-2 right-20 rounded-md px-3 py-1.5 text-xs font-body flex items-center gap-1.5 shadow-sm ${
            feedback.kind === "success"
              ? "bg-forest-50 text-forest-700 border border-forest-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {feedback.kind === "success" ? (
            <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
          ) : (
            <AlertCircle className="h-3 w-3" strokeWidth={2} />
          )}
          {feedback.msg}
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
          onClick={() => setConfirmDelete(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-display font-bold text-ink-900">
                  Supprimer ce compte ?
                </h3>
                <p className="text-sm font-body text-ink-600 mt-1">
                  Cette action est irréversible. Supprime le compte <strong>{user.email}</strong> et toutes ses données associées (entreprise, documents, missions).
                </p>
              </div>
              <button
                onClick={() => setConfirmDelete(false)}
                className="p-1 text-ink-400 hover:text-ink-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded-lg border border-forest-100 bg-white px-4 py-2 text-sm font-body text-ink-600 hover:border-forest-200"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-body font-semibold text-white hover:bg-red-600"
              >
                Supprimer définitivement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
