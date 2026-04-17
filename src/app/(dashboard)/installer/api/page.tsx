"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Code2,
  Key,
  Webhook,
  Copy,
  Eye,
  EyeOff,
  Plus,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  Trash2,
  Globe,
} from "lucide-react";

const apiKeys = [
  {
    id: "key-01",
    name: "Clim'Express CRM — Production",
    prefix: "rgec_A8xZk2pN",
    created_at: "2 avr. 2026",
    last_used: "Il y a 3 min",
    status: "active",
  },
  {
    id: "key-02",
    name: "Clim'Express CRM — Staging",
    prefix: "rgec_P3mQw7rT",
    created_at: "2 avr. 2026",
    last_used: "Il y a 2h",
    status: "active",
  },
  {
    id: "key-03",
    name: "Integration test",
    prefix: "rgec_Lk5dF8Xq",
    created_at: "15 mar. 2026",
    last_used: "—",
    status: "revoked",
  },
];

const webhooks = [
  {
    id: "wh-158",
    event: "mission.status.changed",
    mission_id: "MIS-2024-0148",
    target_url: "https://clim-express.com/api/webhooks/rge-connect",
    status: "delivered",
    http_status: 200,
    attempts: 1,
    delivered_at: "Il y a 2 min",
  },
  {
    id: "wh-157",
    event: "mission.scheduled",
    mission_id: "MIS-2024-0149",
    target_url: "https://clim-express.com/api/webhooks/rge-connect",
    status: "delivered",
    http_status: 200,
    attempts: 1,
    delivered_at: "Il y a 8 min",
  },
  {
    id: "wh-156",
    event: "mission.photos.uploaded",
    mission_id: "MIS-2024-0148",
    target_url: "https://clim-express.com/api/webhooks/rge-connect",
    status: "delivered",
    http_status: 200,
    attempts: 2,
    delivered_at: "Il y a 15 min",
  },
  {
    id: "wh-155",
    event: "mission.completed",
    mission_id: "MIS-2024-0145",
    target_url: "https://clim-express.com/api/webhooks/rge-connect",
    status: "failed",
    http_status: 500,
    attempts: 3,
    delivered_at: "Échec final",
  },
  {
    id: "wh-154",
    event: "payment.executed",
    mission_id: "MIS-2024-0143",
    target_url: "https://clim-express.com/api/webhooks/rge-connect",
    status: "delivered",
    http_status: 200,
    attempts: 1,
    delivered_at: "Il y a 42 min",
  },
];

function WebhookStatus({ status }: { status: string }) {
  if (status === "delivered") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 border border-forest-200 px-2 py-0.5 text-xs font-mono text-forest-600">
        <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
        OK
      </span>
    );
  }
  if (status === "failed") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-0.5 text-xs font-mono text-red-600">
        <XCircle className="h-3 w-3" strokeWidth={2} />
        Échec
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-300/30 px-2 py-0.5 text-xs font-mono text-gold-700">
      <Clock className="h-3 w-3" strokeWidth={2} />
      En attente
    </span>
  );
}

export default function ApiPage() {
  const [tab, setTab] = useState<"keys" | "webhooks" | "docs">("keys");
  const [showSecret, setShowSecret] = useState<Record<string, boolean>>({});

  return (
    <>
      <Topbar
        title="API & Webhooks"
        description="Intégration CRM, clés API et événements sortants"
      />

      <div className="px-6 lg:px-8 py-6 space-y-6">
        {/* Tabs */}
        <div className="flex items-center gap-1 rounded-lg bg-cream-100 p-1 w-fit">
          <button
            onClick={() => setTab("keys")}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
              tab === "keys"
                ? "bg-white text-forest-600 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            <Key
              className={`h-4 w-4 ${
                tab === "keys" ? "text-forest-500" : "text-ink-400"
              }`}
              strokeWidth={1.8}
            />
            Clés API
          </button>
          <button
            onClick={() => setTab("webhooks")}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
              tab === "webhooks"
                ? "bg-white text-forest-600 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            <Webhook
              className={`h-4 w-4 ${
                tab === "webhooks" ? "text-forest-500" : "text-ink-400"
              }`}
              strokeWidth={1.8}
            />
            Webhooks
          </button>
          <button
            onClick={() => setTab("docs")}
            className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-body font-medium transition-all duration-200 ${
              tab === "docs"
                ? "bg-white text-forest-600 shadow-sm"
                : "text-ink-500 hover:text-ink-700"
            }`}
          >
            <Code2
              className={`h-4 w-4 ${
                tab === "docs" ? "text-forest-500" : "text-ink-400"
              }`}
              strokeWidth={1.8}
            />
            Documentation
          </button>
        </div>

        {/* Tab: API Keys */}
        {tab === "keys" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-display font-bold text-ink-900">
                  Clés API
                </h2>
                <p className="text-sm font-body text-ink-500 mt-1">
                  Intégrez RGE Connect à votre CRM pour créer des missions
                  automatiquement
                </p>
              </div>
              <button className="inline-flex items-center gap-2 rounded-lg bg-forest-500 px-4 py-2.5 text-sm font-body font-semibold text-cream-50 hover:bg-forest-600 transition-colors">
                <Plus className="h-4 w-4" strokeWidth={2} />
                Créer une clé
              </button>
            </div>

            <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
              <div className="divide-y divide-forest-100/50">
                {apiKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="h-9 w-9 rounded-lg bg-forest-50 flex items-center justify-center flex-shrink-0">
                      <Key className="h-4 w-4 text-forest-500" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-body font-medium text-ink-900">
                          {key.name}
                        </p>
                        {key.status === "active" ? (
                          <span className="inline-flex items-center rounded-md bg-forest-50 border border-forest-200 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-forest-600">
                            Actif
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-md bg-red-50 border border-red-200 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-red-600">
                            Révoqué
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs font-mono text-ink-500 bg-cream-100 px-2 py-0.5 rounded">
                          {key.prefix}
                          {showSecret[key.id]
                            ? "_•••••LIVE•••••KEY•••••"
                            : "_••••••••••"}
                        </code>
                        <button
                          onClick={() =>
                            setShowSecret((s) => ({
                              ...s,
                              [key.id]: !s[key.id],
                            }))
                          }
                          className="p-1 rounded hover:bg-cream-100 text-ink-400 hover:text-ink-600"
                          disabled={key.status === "revoked"}
                        >
                          {showSecret[key.id] ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          className="p-1 rounded hover:bg-cream-100 text-ink-400 hover:text-ink-600"
                          disabled={key.status === "revoked"}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-body text-ink-400 mt-1">
                        Créée le {key.created_at} · Dernier usage : {key.last_used}
                      </p>
                    </div>
                    {key.status === "active" && (
                      <button className="p-2 rounded-lg border border-forest-100 text-ink-400 hover:text-red-500 hover:border-red-200 transition-colors">
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-forest-900 p-6 text-cream-50 shadow-sm">
              <h3 className="text-sm font-display font-bold mb-3 flex items-center gap-2">
                <Globe className="h-4 w-4 text-gold-400" strokeWidth={1.8} />
                Endpoint de création de mission
              </h3>
              <pre className="text-xs font-mono bg-cream-50/5 p-4 rounded-lg overflow-x-auto">
                <code>{`POST https://rge-connect.fr/api/v1/missions

Headers:
  Authorization: Bearer rgec_A8xZk2pN_•••••••
  Content-Type: application/json

Body:
{
  "type": "pac_air_eau",
  "client_first_name": "Marie",
  "client_last_name": "Dupont",
  "client_email": "marie.d@email.fr",
  "client_phone": "0612345678",
  "address": "12 rue de la République",
  "city": "Lyon",
  "postal_code": "69003",
  "equipment": "HEIWA Estia 11kW",
  "amount_ht": 4800,
  "payment_delay_days": 30,
  "external_id": "CE-AFF-2026-00147"
}`}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab: Webhooks */}
        {tab === "webhooks" && (
          <div className="space-y-6">
            {/* Config webhook */}
            <div className="rounded-xl border border-forest-100 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-sm font-display font-bold text-ink-900">
                    URL de réception
                  </h3>
                  <p className="text-xs font-body text-ink-500 mt-1">
                    Endpoint où RGE Connect envoie les événements signés HMAC-SHA256
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-md bg-forest-50 border border-forest-200 px-2 py-0.5 text-xs font-mono text-forest-600">
                  <CheckCircle2 className="h-3 w-3" strokeWidth={2} />
                  Opérationnel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs font-mono bg-cream-100 text-ink-700 px-3 py-2 rounded-lg border border-forest-100">
                  https://clim-express.com/api/webhooks/rge-connect
                </code>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-forest-100 bg-white px-3 py-2 text-xs font-body text-ink-600 hover:border-forest-200">
                  <ExternalLink className="h-3 w-3" />
                  Modifier
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl border border-forest-100 bg-white p-4">
                <p className="text-2xl font-display font-bold text-forest-600">
                  98.4%
                </p>
                <p className="text-xs font-body text-ink-500 mt-1">
                  Taux de livraison (30j)
                </p>
              </div>
              <div className="rounded-xl border border-forest-100 bg-white p-4">
                <p className="text-2xl font-display font-bold text-ink-900">
                  1 247
                </p>
                <p className="text-xs font-body text-ink-500 mt-1">
                  Events livrés
                </p>
              </div>
              <div className="rounded-xl border border-forest-100 bg-white p-4">
                <p className="text-2xl font-display font-bold text-ink-900">
                  287ms
                </p>
                <p className="text-xs font-body text-ink-500 mt-1">
                  Latence moyenne
                </p>
              </div>
              <div className="rounded-xl border border-forest-100 bg-white p-4">
                <p className="text-2xl font-display font-bold text-red-600">
                  20
                </p>
                <p className="text-xs font-body text-ink-500 mt-1">
                  Échecs (30j)
                </p>
              </div>
            </div>

            {/* Events list */}
            <div className="rounded-xl border border-forest-100 bg-white shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-forest-100">
                <h3 className="text-sm font-display font-bold text-ink-900">
                  Historique des événements
                </h3>
                <button className="inline-flex items-center gap-1.5 text-xs font-body font-medium text-forest-500 hover:text-forest-700">
                  <RotateCw className="h-3 w-3" />
                  Actualiser
                </button>
              </div>
              <div className="divide-y divide-forest-100/50">
                {webhooks.map((wh) => (
                  <div
                    key={wh.id}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-ink-400">
                          {wh.id}
                        </span>
                        <WebhookStatus status={wh.status} />
                        <code className="text-xs font-mono text-forest-600 bg-forest-50 px-2 py-0.5 rounded">
                          {wh.event}
                        </code>
                      </div>
                      <p className="text-xs font-body text-ink-500 mt-1 truncate">
                        {wh.mission_id} → {wh.target_url}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 hidden sm:block">
                      <p className="text-xs font-mono text-ink-600">
                        HTTP {wh.http_status}
                      </p>
                      <p className="text-xs font-body text-ink-400 mt-0.5">
                        {wh.attempts} tent. · {wh.delivered_at}
                      </p>
                    </div>
                    {wh.status === "failed" && (
                      <button className="inline-flex items-center gap-1 rounded-lg border border-forest-100 bg-white px-2.5 py-1.5 text-xs font-body text-ink-600 hover:border-forest-200">
                        <RotateCw className="h-3 w-3" />
                        Rejouer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Documentation */}
        {tab === "docs" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-display font-bold text-ink-900 mb-2">
                Documentation API — v1
              </h3>
              <p className="text-sm font-body text-ink-500">
                L&apos;API RGE Connect vous permet de créer, suivre et gérer vos
                missions depuis votre CRM. Toutes les requêtes sont sécurisées
                par Bearer token + BotID.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  {
                    method: "POST",
                    path: "/api/v1/missions",
                    desc: "Créer une mission depuis le CRM",
                  },
                  {
                    method: "GET",
                    path: "/api/v1/missions/:id",
                    desc: "Récupérer le détail + statut d'une mission",
                  },
                  {
                    method: "PATCH",
                    path: "/api/v1/missions/:id",
                    desc: "Modifier une mission (tant que non assignée)",
                  },
                  {
                    method: "DELETE",
                    path: "/api/v1/missions/:id",
                    desc: "Annuler une mission",
                  },
                ].map((ep) => (
                  <div
                    key={ep.path}
                    className="flex items-start gap-3 p-3 rounded-lg border border-forest-100 hover:border-forest-200 transition-colors"
                  >
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider flex-shrink-0 ${
                        ep.method === "POST"
                          ? "bg-forest-50 border-forest-200 text-forest-700"
                          : ep.method === "GET"
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : ep.method === "PATCH"
                          ? "bg-gold-500/10 border-gold-300/30 text-gold-700"
                          : "bg-red-50 border-red-200 text-red-600"
                      }`}
                    >
                      {ep.method}
                    </span>
                    <div className="flex-1">
                      <code className="text-sm font-mono text-ink-900">
                        {ep.path}
                      </code>
                      <p className="text-xs font-body text-ink-500 mt-0.5">
                        {ep.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-forest-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-display font-bold text-ink-900 mb-4">
                Événements webhook
              </h3>
              <div className="space-y-3">
                {[
                  {
                    event: "mission.created",
                    desc: "Mission créée (draft)",
                  },
                  {
                    event: "mission.published",
                    desc: "Mission diffusée sur la marketplace",
                  },
                  {
                    event: "mission.assigned",
                    desc: "Sous-traitant assigné, créneaux proposés",
                  },
                  {
                    event: "mission.scheduled",
                    desc: "Client a validé un créneau",
                  },
                  {
                    event: "mission.in_progress",
                    desc: "Chantier démarré",
                  },
                  {
                    event: "mission.photos.uploaded",
                    desc: "Photos horodatées eIDAS disponibles",
                  },
                  {
                    event: "mission.completed",
                    desc: "Chantier terminé + PV signé",
                  },
                  {
                    event: "mission.cancelled",
                    desc: "Mission annulée",
                  },
                  {
                    event: "payment.initiated",
                    desc: "Prélèvement SEPA programmé",
                  },
                  {
                    event: "payment.executed",
                    desc: "Paiement exécuté",
                  },
                  {
                    event: "review.posted",
                    desc: "Avis client reçu",
                  },
                ].map((ev) => (
                  <div
                    key={ev.event}
                    className="flex items-center gap-3 py-1"
                  >
                    <code className="text-xs font-mono text-forest-600 bg-forest-50 px-2 py-0.5 rounded w-56 flex-shrink-0">
                      {ev.event}
                    </code>
                    <p className="text-sm font-body text-ink-600">{ev.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-forest-900 p-6 text-cream-50 shadow-sm">
              <h3 className="text-sm font-display font-bold mb-3 flex items-center gap-2">
                <Webhook className="h-4 w-4 text-gold-400" strokeWidth={1.8} />
                Vérification de la signature HMAC
              </h3>
              <pre className="text-xs font-mono bg-cream-50/5 p-4 rounded-lg overflow-x-auto">
                <code>{`// Node.js — middleware de vérification
import crypto from 'node:crypto';

const SIGNING_SECRET = process.env.RGE_CONNECT_WEBHOOK_SECRET;

function verifyWebhook(rawBody, signatureHeader) {
  const [tsPart, sigPart] = signatureHeader.split(',');
  const t = tsPart.split('=')[1];
  const v1 = sigPart.split('=')[1];

  // Rejette si timestamp > 5 min (anti-replay)
  if (Math.abs(Date.now()/1000 - t) > 300) return false;

  const expected = crypto
    .createHmac('sha256', SIGNING_SECRET)
    .update(\`\${t}.\${rawBody}\`)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expected, 'hex'),
    Buffer.from(v1, 'hex')
  );
}`}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
