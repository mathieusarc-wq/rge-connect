"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Search,
  ShoppingCart,
  TrendingDown,
  Package,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const suppliers = [
  { id: "all", label: "Tous", count: 184 },
  { id: "heiwa", label: "HEIWA", count: 42 },
  { id: "daikin", label: "Daikin", count: 38 },
  { id: "atlantic", label: "Atlantic", count: 56 },
  { id: "weber", label: "Weber", count: 28 },
  { id: "longi", label: "Longi Solar", count: 20 },
];

const products = [
  {
    id: "p1",
    supplier: "HEIWA",
    category: "PAC Air-Eau",
    ref: "ESTIA-11",
    name: "HEIWA Estia 11kW",
    list_price: 4200,
    negotiated: 3360,
    discount: 20,
    in_stock: true,
  },
  {
    id: "p2",
    supplier: "HEIWA",
    category: "PAC Air-Eau",
    ref: "ESTIA-14",
    name: "HEIWA Estia 14kW",
    list_price: 4800,
    negotiated: 3840,
    discount: 20,
    in_stock: true,
  },
  {
    id: "p3",
    supplier: "Daikin",
    category: "Climatisation",
    ref: "FTXM35R",
    name: "Daikin Perfera FTXM 3.5kW",
    list_price: 980,
    negotiated: 834,
    discount: 15,
    in_stock: true,
  },
  {
    id: "p4",
    supplier: "Daikin",
    category: "Climatisation",
    ref: "MULTI-4MXM80",
    name: "Daikin Multi-split 4MXM 8kW",
    list_price: 2400,
    negotiated: 2040,
    discount: 15,
    in_stock: true,
  },
  {
    id: "p5",
    supplier: "Atlantic",
    category: "PAC Air-Air",
    ref: "FUJITSU-ASYG18",
    name: "Atlantic Fujitsu ASYG 5.2kW",
    list_price: 1650,
    negotiated: 1452,
    discount: 12,
    in_stock: true,
  },
  {
    id: "p6",
    supplier: "Atlantic",
    category: "Ballon",
    ref: "SOLERIO-300",
    name: "Atlantic Solerio Optimum 300L",
    list_price: 2800,
    negotiated: 2464,
    discount: 12,
    in_stock: false,
  },
  {
    id: "p7",
    supplier: "Weber",
    category: "ITE",
    ref: "THERM-XM",
    name: "Weber therm XM (m²)",
    list_price: 28,
    negotiated: 22.4,
    discount: 20,
    in_stock: true,
  },
  {
    id: "p8",
    supplier: "Longi Solar",
    category: "PV",
    ref: "HIMO-6-440",
    name: "Longi Hi-MO 6 440Wc (panneau)",
    list_price: 185,
    negotiated: 148,
    discount: 20,
    in_stock: true,
  },
  {
    id: "p9",
    supplier: "Longi Solar",
    category: "PV",
    ref: "HIMO-6-X16",
    name: "Pack 16 panneaux 7kWc",
    list_price: 2960,
    negotiated: 2368,
    discount: 20,
    in_stock: true,
  },
];

export default function CatalogPage() {
  const [activeSupplier, setActiveSupplier] = useState("all");
  const filtered =
    activeSupplier === "all"
      ? products
      : products.filter((p) =>
          p.supplier.toLowerCase().replace(/\s+/g, "") === activeSupplier
        );

  return (
    <>
      <Topbar
        title="Catalogue fournisseurs"
        description="Tarifs négociés exclusifs RGE Connect Business"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Hero */}
        <div className="rounded-xl border border-gold-300/30 bg-gradient-to-r from-gold-500/5 to-forest-500/5 p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-lg bg-gold-500/10 flex items-center justify-center flex-shrink-0">
              <TrendingDown className="h-5 w-5 text-gold-600" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="text-base font-display font-bold text-ink-900">
                Centrale d&apos;achat RGE Connect
              </h2>
              <p className="text-sm font-body text-ink-600 mt-1">
                Jusqu&apos;à <span className="font-semibold">-20%</span> sur les
                prix catalogue via nos accords cadres avec HEIWA, Daikin,
                Atlantic et Weber. Livraison directe chez vos sous-traitants.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <Input
              placeholder="Rechercher une référence, une marque, un modèle..."
              className="h-10 pl-10 bg-white border-forest-100"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-body text-ink-500">
            <Package className="h-3.5 w-3.5" strokeWidth={1.8} />
            {filtered.length} produits
          </div>
        </div>

        {/* Supplier tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 overflow-x-auto">
          {suppliers.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSupplier(s.id)}
              className={`rounded-md px-4 py-2 text-sm font-body font-medium whitespace-nowrap transition-all ${
                activeSupplier === s.id
                  ? "bg-white text-forest-600 shadow-sm"
                  : "text-ink-500 hover:text-ink-700"
              }`}
            >
              {s.label}
              <span
                className={`ml-1.5 text-xs font-mono ${
                  activeSupplier === s.id ? "text-forest-500" : "text-ink-400"
                }`}
              >
                {s.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products grid */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-xl border border-forest-100 bg-white shadow-sm hover:shadow-md hover:border-forest-200 transition-all duration-200 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-forest-50 border border-forest-100 px-2 py-0.5 text-xs font-mono text-forest-600">
                    {p.category}
                  </span>
                  <span className="text-xs font-mono text-ink-400">
                    {p.supplier}
                  </span>
                </div>
                {!p.in_stock && (
                  <span className="text-xs font-mono text-orange-600">
                    Rupture
                  </span>
                )}
              </div>

              <h3 className="text-sm font-body font-semibold text-ink-900 min-h-[2.5rem]">
                {p.name}
              </h3>
              <code className="text-xs font-mono text-ink-400 mt-1 block">
                Réf. {p.ref}
              </code>

              <div className="mt-4 pt-4 border-t border-forest-100/50 flex items-end justify-between">
                <div>
                  <p className="text-xs font-body text-ink-400 line-through">
                    {p.list_price} € HT
                  </p>
                  <p className="text-xl font-display font-bold text-forest-600">
                    {p.negotiated} € <span className="text-xs font-body text-ink-500">HT</span>
                  </p>
                  <span className="inline-flex items-center gap-0.5 rounded-md bg-gold-500/10 border border-gold-300/30 px-1.5 py-0.5 text-[10px] font-mono text-gold-700 mt-1">
                    <TrendingDown className="h-2.5 w-2.5" strokeWidth={2} />
                    -{p.discount}%
                  </span>
                </div>
                <button
                  disabled={!p.in_stock}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-forest-500 px-3 py-2 text-xs font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="h-3 w-3" strokeWidth={2} />
                  Commander
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
