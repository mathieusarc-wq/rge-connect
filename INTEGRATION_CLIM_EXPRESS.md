# INTEGRATION_CLIM_EXPRESS.md — Intégration API RGE Connect ↔ Clim'Express

Ce document spécifie l'intégration entre RGE Connect (ce repo) et Clim'Express CRM (repo externe `lm-energy-crm`). LM Energy est le premier client API de RGE Connect.

**⚠️ À lire obligatoirement avant de coder l'endpoint `POST /api/missions`, l'authentification API key, ou le système de webhooks sortants.**

---

## 1. Principe général

```
[Client final signe devis Clim'Express]
      ↓
[Clim'Express webhook Yousign]
      ↓
[Clim'Express appelle POST /api/missions sur RGE Connect]
      ↓
[RGE Connect crée la mission, diffuse aux sous-traitants]
      ↓
[RGE Connect envoie webhooks à Clim'Express à chaque étape]
      ↓
[Clim'Express met à jour le statut du devis]
```

## 2. Authentification par clé API

Chaque installateur client dispose d'une ou plusieurs clés API pour appeler RGE Connect.

### Format des clés
- Prefix : `rgec_live_` ou `rgec_test_` suivi de 32 caractères aléatoires
- Exemple : `rgec_live_a3f2d8b1c4e9f7a2b6c8d0e1f3a5b7c9`
- Stockage BDD : **hash bcrypt** de la clé + prefix en clair (pour identification rapide)

### Table `api_keys`
```sql
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installer_id UUID NOT NULL REFERENCES installers(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,           -- 16 premiers caractères pour lookup
  name TEXT NOT NULL,
  scopes TEXT[] DEFAULT ARRAY['missions:write', 'missions:read'],
  last_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  revoked_at TIMESTAMPTZ
);
CREATE INDEX idx_api_keys_prefix ON api_keys(key_prefix) WHERE revoked_at IS NULL;
```

### Middleware d'authentification
Chaque requête API entrante doit :
1. Extraire le header `Authorization: Bearer <key>`
2. Vérifier format (prefix `rgec_live_` ou `rgec_test_`)
3. Lookup en BDD via `key_prefix` (les 16 premiers caractères)
4. Vérifier le hash bcrypt complet
5. Vérifier que `revoked_at IS NULL`
6. Mettre à jour `last_used_at`
7. Injecter `installer_id` dans le contexte de la requête

Si échec à n'importe quelle étape : `401 Unauthorized` + log.

## 3. Endpoint `POST /api/missions`

### Requête entrante
```http
POST /api/missions
Authorization: Bearer rgec_live_xxxxxxxxxxxxxxxx
Content-Type: application/json

{
  "external_ref": "devis_cxp_12345",
  "trade": "PAC_AIR_EAU",
  "postal_code": "33000",
  "city": "Bordeaux",
  "address": "12 rue de la République, 33000 Bordeaux",
  "brand": "HEIWA",
  "equipment_count": 1,
  "equipment_details": "PAC air-eau 11 kW monobloc, ballon 200L",
  "labor_price_ht": 1850,
  "client_name": "Jean Dupont",
  "client_phone": "+33612345678",
  "client_email": "jean.dupont@example.com",
  "preferred_dates": ["2026-04-20", "2026-04-22"],
  "notes": "Accès par garage, compteur au sous-sol, 2 étages",
  "callback_url": "https://lm-energy-crm.vercel.app/api/webhooks/rge-connect"
}
```

### Validation (utiliser zod)
```typescript
import { z } from 'zod';

export const CreateMissionSchema = z.object({
  external_ref: z.string().min(1).max(100),
  trade: z.enum(['PAC_AIR_EAU', 'PAC_AIR_AIR', 'CLIM', 'PV', 'ITE', 'ISO_COMBLES', 'SSC']),
  postal_code: z.string().regex(/^\d{5}$/),
  city: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  brand: z.string().min(1).max(50),
  equipment_count: z.number().int().positive(),
  equipment_details: z.string().max(2000),
  labor_price_ht: z.number().positive(),
  client_name: z.string().min(1).max(200),
  client_phone: z.string().regex(/^\+?[0-9\s]{10,20}$/),
  client_email: z.string().email(),
  preferred_dates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).optional(),
  notes: z.string().max(2000).optional(),
  callback_url: z.string().url(),
});
```

### Logique de traitement
1. Vérifier auth (middleware)
2. Vérifier quota plan de l'installer (ex: plan Découverte = 3 missions/mois max)
3. Valider payload avec zod
4. Vérifier qu'`external_ref` n'existe pas déjà pour cet `installer_id` (idempotence)
5. Créer la mission en BDD avec statut `pending`
6. Déclencher (async) la diffusion aux sous-traitants éligibles
7. Retourner la mission créée

### Réponse succès
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "mis_7f3a2b1c8d9e",
  "external_ref": "devis_cxp_12345",
  "status": "pending",
  "trade": "PAC_AIR_EAU",
  "created_at": "2026-04-13T14:32:10Z",
  "public_url": "https://rge-connect.fr/missions/mis_7f3a2b1c8d9e"
}
```

### Codes d'erreur
- `400` : payload invalide (zod errors)
- `401` : clé API invalide/révoquée
- `409` : `external_ref` déjà utilisé (idempotence)
- `429` : quota plan dépassé
- `500` : erreur serveur

## 4. Endpoint `GET /api/missions/:id`

Retourne le statut courant d'une mission. Accessible uniquement avec la clé API de l'installateur qui l'a créée.

```http
GET /api/missions/mis_7f3a2b1c8d9e
Authorization: Bearer rgec_live_xxxxxxxxxxxxxxxx
```

Réponse :
```json
{
  "id": "mis_7f3a2b1c8d9e",
  "external_ref": "devis_cxp_12345",
  "status": "scheduled",
  "subcontractor": {
    "name": "Entreprise X",
    "city": "Mérignac"
  },
  "scheduled_date": "2026-04-22",
  "created_at": "2026-04-13T14:32:10Z",
  "updated_at": "2026-04-14T09:15:42Z"
}
```

## 5. Webhooks sortants

RGE Connect envoie des webhooks au `callback_url` fourni dans la création de mission, à chaque changement de statut significatif.

### Événements émis
- `mission.scheduled` — sous-traitant matché + créneau validé par le client
- `mission.started` — sous-traitant a démarré le chantier
- `mission.completed` — chantier terminé, PV signé
- `mission.paid` — prélèvement SEPA B2B effectué, sous-traitant payé
- `mission.failed` — échec (no-show, annulation, aucun remplaçant)

### Format du payload
```http
POST https://lm-energy-crm.vercel.app/api/webhooks/rge-connect
Content-Type: application/json
X-RGE-Connect-Signature: sha256=<hmac>
X-RGE-Connect-Event-Id: evt_abc123
X-RGE-Connect-Timestamp: 1744554732

{
  "id": "evt_abc123",
  "type": "mission.scheduled",
  "created_at": "2026-04-14T09:15:42Z",
  "mission_id": "mis_7f3a2b1c8d9e",
  "external_ref": "devis_cxp_12345",
  "data": {
    "scheduled_date": "2026-04-22",
    "subcontractor_name": "Entreprise X",
    "subcontractor_city": "Mérignac"
  }
}
```

### Signature HMAC
- Algo : HMAC-SHA256
- Secret : stocké dans `RGE_CONNECT_WEBHOOK_SIGNING_SECRET` (env var, un par installateur ou global au démarrage)
- Calcul : `hmac_sha256(secret, timestamp + "." + body)` — format Stripe-like
- Header : `X-RGE-Connect-Signature: sha256=<hex>`

### Retry exponentiel
Si le callback retourne != 2xx, retry avec backoff :
- Tentative 1 : immédiat
- Tentative 2 : +30 secondes
- Tentative 3 : +2 minutes
- Tentative 4 : +10 minutes
- Tentative 5 : +1 heure
- Tentative 6 : +6 heures
- Tentative 7 : +24 heures

Après 7 tentatives, marquer le webhook comme `failed` et alerter.

### Table `outbound_webhooks`
```sql
CREATE TABLE outbound_webhooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id),
  installer_id UUID NOT NULL REFERENCES installers(id),
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  target_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',      -- pending, sent, failed
  attempts INT DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ,
  last_response_code INT,
  last_response_body TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_webhooks_pending ON outbound_webhooks(status, next_retry_at) WHERE status = 'pending';
```

### Cron de retry
- Vercel Cron appelle `/api/cron/process-webhooks` toutes les minutes (POST avec `CRON_SECRET`)
- Récupère tous les webhooks `pending` avec `next_retry_at <= now()`
- Retry chacun, met à jour `attempts`, `next_retry_at` et statut

## 6. Test end-to-end à valider avant go-live

Avant de connecter Clim'Express en production, valider ce scénario complet :

1. Créer un installer test + une clé API test dans RGE Connect
2. Appeler `POST /api/missions` avec un payload valide depuis Postman/curl
3. Vérifier que la mission apparaît en BDD avec statut `pending`
4. Simuler manuellement un changement de statut (SQL update)
5. Vérifier que le webhook sortant est créé dans `outbound_webhooks`
6. Vérifier que le cron le traite et l'envoie au `callback_url`
7. Vérifier la signature HMAC côté receveur
8. Tester le retry en simulant un 500 côté receveur

## 7. Variables d'environnement nécessaires

```
# Signing secret pour webhooks sortants
RGE_CONNECT_WEBHOOK_SIGNING_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cron secret
CRON_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 8. Notes importantes

- **Idempotence** : toujours vérifier `external_ref` avant création. Si Clim'Express retry un appel (erreur réseau), on ne doit pas créer 2 missions.
- **Rate limiting** : implémenter en sprint 4, pas bloquant pour MVP. 100 req/min/clé API suffit au démarrage.
- **Logs** : toutes les requêtes API entrantes et tous les webhooks sortants doivent être loggés (BDD ou observability tool) avec request_id, pour debug et audit.
- **Sécurité** : jamais stocker la clé API en clair. Jamais logger la clé complète (juste le prefix).
- **Versioning API** : préfixer toutes les routes par `/api/v1/` pour permettre évolution future sans casser Clim'Express.
