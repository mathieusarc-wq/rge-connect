"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  FolderLock,
  CreditCard,
  Star,
  Settings,
  ChevronLeft,
  LogOut,
  ClipboardList,
  Users,
  Code2,
  ShoppingCart,
  ArrowLeftRight,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
};

const subcontractorNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Documents", href: "/documents", icon: FolderLock },
  { label: "Paiements", href: "/payments", icon: CreditCard },
  { label: "Avis", href: "/reviews", icon: Star },
];

const installerNav: NavItem[] = [
  { label: "Dashboard", href: "/installer/dashboard", icon: LayoutDashboard },
  { label: "Missions", href: "/installer/missions", icon: ClipboardList },
  { label: "Sous-traitants", href: "/installer/subcontractors", icon: Users },
  { label: "API & Webhooks", href: "/installer/api", icon: Code2 },
  { label: "Paiements", href: "/installer/payments", icon: CreditCard },
  { label: "Catalogue", href: "/installer/catalog", icon: ShoppingCart },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isInstallerView = pathname.startsWith("/installer");
  const navItems = isInstallerView ? installerNav : subcontractorNav;
  const settingsHref = isInstallerView ? "/installer/settings" : "/settings";

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white border-r border-forest-100 transition-all duration-300 ease-premium ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-forest-100">
        {!collapsed && (
          <Link
            href={isInstallerView ? "/installer/dashboard" : "/dashboard"}
            className="flex items-center gap-0"
          >
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              RGE&nbsp;C
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-gold-500">
              O
            </span>
            <span className="font-display text-lg font-extrabold tracking-tight text-forest-500">
              NNECT
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-1.5 rounded-md text-ink-400 hover:text-ink-600 hover:bg-cream-100 transition-colors ${
            collapsed ? "mx-auto" : ""
          }`}
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform duration-300 ${
              collapsed ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Role switcher (démo) */}
      {!collapsed && (
        <div className="px-3 pt-3">
          <Link
            href={isInstallerView ? "/dashboard" : "/installer/dashboard"}
            className="flex items-center justify-between rounded-lg bg-cream-100 border border-forest-100 px-3 py-2 text-xs font-body transition-colors hover:bg-cream-200"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-ink-400 uppercase tracking-wider">
                Vue
              </span>
              <span className="font-semibold text-forest-600">
                {isInstallerView ? "Installateur" : "Sous-traitant"}
              </span>
            </div>
            <ArrowLeftRight className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-body font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-forest-50 text-forest-600"
                  : "text-ink-500 hover:bg-cream-50 hover:text-ink-700"
              } ${collapsed ? "justify-center px-0" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon
                className={`h-[18px] w-[18px] flex-shrink-0 ${
                  isActive
                    ? "text-forest-500"
                    : "text-ink-400 group-hover:text-ink-600"
                }`}
                strokeWidth={1.8}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-forest-100 space-y-1">
        <Link
          href={settingsHref}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-body font-medium transition-all duration-200 group ${
            pathname.startsWith(settingsHref)
              ? "bg-forest-50 text-forest-600"
              : "text-ink-500 hover:bg-cream-50 hover:text-ink-700"
          } ${collapsed ? "justify-center px-0" : ""}`}
          title={collapsed ? "Paramètres" : undefined}
        >
          <Settings
            className={`h-[18px] w-[18px] flex-shrink-0 ${
              pathname.startsWith(settingsHref)
                ? "text-forest-500"
                : "text-ink-400 group-hover:text-ink-600"
            }`}
            strokeWidth={1.8}
          />
          {!collapsed && <span>Paramètres</span>}
        </Link>

        {/* User card */}
        <div
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 mt-2 ${
            collapsed ? "justify-center px-0" : ""
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-forest-500 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-body font-semibold text-cream-50">
              {isInstallerView ? "LM" : "TP"}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-body font-medium text-ink-900 truncate">
                {isInstallerView ? "LM Energy" : "Thermipro SARL"}
              </p>
              <p className="text-xs font-body text-ink-400 truncate">
                {isInstallerView ? "Installateur · Business" : "Sous-traitant RGE"}
              </p>
            </div>
          )}
          {!collapsed && (
            <button className="p-1.5 rounded-md text-ink-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
