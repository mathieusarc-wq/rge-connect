"use client";

import { Bell, Search, Plus } from "lucide-react";
import Link from "next/link";

export function Topbar({ title, description }: { title: string; description?: string }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 lg:px-8 bg-white/80 backdrop-blur-md border-b border-forest-100/50">
      <div>
        <h1 className="text-lg font-display font-bold text-ink-900 tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-xs font-body text-ink-500 mt-0.5">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="h-9 w-9 rounded-lg bg-cream-50 border border-forest-100 flex items-center justify-center text-ink-400 hover:text-ink-600 hover:border-forest-200 transition-colors">
          <Search className="h-4 w-4" strokeWidth={1.8} />
        </button>

        {/* Notifications */}
        <button className="relative h-9 w-9 rounded-lg bg-cream-50 border border-forest-100 flex items-center justify-center text-ink-400 hover:text-ink-600 hover:border-forest-200 transition-colors">
          <Bell className="h-4 w-4" strokeWidth={1.8} />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gold-500 flex items-center justify-center">
            <span className="text-[10px] font-mono font-bold text-forest-900">3</span>
          </span>
        </button>

        {/* New mission */}
        <Link
          href="/missions/new"
          className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-4 py-2 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors ease-premium duration-300"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          <span className="hidden sm:inline">Nouvelle mission</span>
        </Link>
      </div>
    </header>
  );
}
