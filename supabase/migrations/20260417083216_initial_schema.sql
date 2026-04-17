-- RGE Connect — Schéma initial
-- Tables : installers, subcontractors, documents, missions, payments, etc.
-- RLS stricte sur toutes les tables + helpers SECURITY DEFINER
-- Isolation par installer_id / subcontractor_id

-- =====================================================================
-- EXTENSIONS
-- =====================================================================

create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";

-- =====================================================================
-- ENUMS
-- =====================================================================

create type public.user_role as enum ('installer', 'subcontractor', 'admin');

create type public.subcontractor_plan as enum ('standard', 'pro');

create type public.installer_plan as enum ('discovery', 'business', 'enterprise');

create type public.mission_status as enum (
  'draft',
  'published',
  'assigned',
  'awaiting_client_validation',
  'scheduled',
  'in_progress',
  'completed',
  'cancelled'
);

create type public.mission_type as enum (
  'pac_air_eau',
  'pac_air_air',
  'climatisation',
  'pv',
  'ite',
  'isolation_combles',
  'ssc'
);

create type public.document_status as enum ('pending', 'valid', 'expiring', 'expired', 'missing', 'rejected');

create type public.document_kind as enum (
  'kbis',
  'rge_qualipac',
  'rge_qualipv',
  'rge_qualibois',
  'rge_qualisol',
  'decennale',
  'urssaf',
  'carte_btp',
  'rib',
  'other'
);

create type public.payment_status as enum ('pending', 'debited', 'transferred', 'failed', 'refunded');

create type public.payment_direction as enum ('debit_installer', 'credit_subcontractor', 'commission', 'factoring');

create type public.review_source as enum ('automatic', 'manual');

-- =====================================================================
-- HELPERS
-- =====================================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =====================================================================
-- installers (donneurs d'ordre)
-- =====================================================================

create table public.installers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  siret text unique not null,
  address text not null,
  city text not null,
  postal_code text not null,
  email text not null,
  phone text,
  plan public.installer_plan not null default 'discovery',
  mangopay_user_id text,
  mangopay_wallet_id text,
  sepa_mandate_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_installers_updated_at
  before update on public.installers
  for each row execute function public.handle_updated_at();

create index idx_installers_siret on public.installers(siret);

-- =====================================================================
-- subcontractors (sous-traitants)
-- =====================================================================

create table public.subcontractors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  siret text unique not null,
  address text not null,
  city text not null,
  postal_code text not null,
  latitude double precision,
  longitude double precision,
  intervention_radius_km integer not null default 30 check (intervention_radius_km between 5 and 1000),
  email text not null,
  phone text,
  plan public.subcontractor_plan not null default 'standard',
  qualifications text[] not null default '{}',
  mission_types public.mission_type[] not null default '{}',
  score numeric(3,2),
  review_count integer not null default 0,
  mangopay_user_id text,
  mangopay_wallet_id text,
  google_business_profile_url text,
  factoring_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_subcontractors_updated_at
  before update on public.subcontractors
  for each row execute function public.handle_updated_at();

create index idx_subcontractors_siret on public.subcontractors(siret);
create index idx_subcontractors_location on public.subcontractors(latitude, longitude);
create index idx_subcontractors_mission_types on public.subcontractors using gin(mission_types);

-- =====================================================================
-- profiles (lien auth.users <-> installer OU subcontractor)
-- =====================================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  installer_id uuid references public.installers(id) on delete cascade,
  subcontractor_id uuid references public.subcontractors(id) on delete cascade,
  role public.user_role not null,
  is_super_admin boolean not null default false,
  first_name text,
  last_name text,
  email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_role_check check (
    (role = 'installer' and installer_id is not null and subcontractor_id is null) or
    (role = 'subcontractor' and subcontractor_id is not null and installer_id is null) or
    (role = 'admin' and installer_id is null and subcontractor_id is null)
  )
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create index idx_profiles_installer on public.profiles(installer_id);
create index idx_profiles_subcontractor on public.profiles(subcontractor_id);

-- =====================================================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- =====================================================================

create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select is_super_admin from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.current_installer_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select installer_id from public.profiles where id = auth.uid();
$$;

create or replace function public.current_subcontractor_id()
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select subcontractor_id from public.profiles where id = auth.uid();
$$;

create or replace function public.is_installer_member(target_installer_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and installer_id = target_installer_id
  );
$$;

create or replace function public.is_subcontractor_member(target_subcontractor_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and subcontractor_id = target_subcontractor_id
  );
$$;

-- =====================================================================
-- subcontractor_documents
-- =====================================================================

create table public.subcontractor_documents (
  id uuid primary key default gen_random_uuid(),
  subcontractor_id uuid not null references public.subcontractors(id) on delete cascade,
  kind public.document_kind not null,
  file_path text,
  file_name text,
  issued_at date,
  expires_at date,
  status public.document_status not null default 'pending',
  extracted_data jsonb,
  validated_by uuid references auth.users(id),
  validated_at timestamptz,
  rejected_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_subcontractor_documents_updated_at
  before update on public.subcontractor_documents
  for each row execute function public.handle_updated_at();

create index idx_docs_subcontractor on public.subcontractor_documents(subcontractor_id);
create index idx_docs_expires_at on public.subcontractor_documents(expires_at) where status = 'valid';

-- =====================================================================
-- api_keys
-- =====================================================================

create table public.api_keys (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  key_prefix text not null unique,
  key_hash text not null,
  name text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_api_keys_installer on public.api_keys(installer_id);
create index idx_api_keys_prefix on public.api_keys(key_prefix);

-- =====================================================================
-- missions
-- =====================================================================

create table public.missions (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  installer_id uuid not null references public.installers(id) on delete cascade,
  subcontractor_id uuid references public.subcontractors(id) on delete set null,

  type public.mission_type not null,
  status public.mission_status not null default 'draft',

  client_first_name text not null,
  client_last_name text not null,
  client_email text,
  client_phone text,

  address text not null,
  city text not null,
  postal_code text not null,
  latitude double precision,
  longitude double precision,

  equipment text,
  equipment_brand text,
  notes text,

  amount_ht numeric(10,2) not null,
  amount_ttc numeric(10,2),
  commission_amount numeric(10,2),

  preferred_start_date date,
  preferred_end_date date,
  scheduled_start_at timestamptz,
  scheduled_end_at timestamptz,
  completed_at timestamptz,

  payment_delay_days integer not null default 30 check (payment_delay_days in (15, 30, 45)),
  factoring_enabled boolean not null default false,

  source text not null default 'web',
  external_id text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_missions_updated_at
  before update on public.missions
  for each row execute function public.handle_updated_at();

create index idx_missions_installer on public.missions(installer_id);
create index idx_missions_subcontractor on public.missions(subcontractor_id);
create index idx_missions_status on public.missions(status);
create index idx_missions_postal_code on public.missions(postal_code);
create index idx_missions_scheduled_start on public.missions(scheduled_start_at);

-- =====================================================================
-- mission_offers
-- =====================================================================

create table public.mission_offers (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  subcontractor_id uuid not null references public.subcontractors(id) on delete cascade,
  proposed_slots jsonb not null,
  message text,
  selected_slot_index integer,
  accepted_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,
  client_validation_token text unique,
  client_validated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_mission_offers_updated_at
  before update on public.mission_offers
  for each row execute function public.handle_updated_at();

create index idx_offers_mission on public.mission_offers(mission_id);
create index idx_offers_subcontractor on public.mission_offers(subcontractor_id);

-- =====================================================================
-- mission_photos
-- =====================================================================

create table public.mission_photos (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null references public.missions(id) on delete cascade,
  subcontractor_id uuid references public.subcontractors(id) on delete set null,
  stage text not null,
  file_path text not null,
  file_hash text not null,
  sha256 text not null,
  universign_timestamp text,
  universign_token text,
  taken_at timestamptz not null,
  latitude double precision,
  longitude double precision,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index idx_photos_mission on public.mission_photos(mission_id);

-- =====================================================================
-- mission_reviews
-- =====================================================================

create table public.mission_reviews (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid not null unique references public.missions(id) on delete cascade,
  subcontractor_id uuid not null references public.subcontractors(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  client_name text,
  source public.review_source not null default 'automatic',
  published_on_google boolean not null default false,
  published_on_google_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_reviews_subcontractor on public.mission_reviews(subcontractor_id);
create index idx_reviews_mission on public.mission_reviews(mission_id);

-- =====================================================================
-- mangopay_wallets
-- =====================================================================

create table public.mangopay_wallets (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('installer', 'subcontractor')),
  owner_id uuid not null,
  mangopay_user_id text not null,
  mangopay_wallet_id text not null unique,
  balance_eur numeric(12,2) not null default 0,
  kyc_status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_mangopay_wallets_updated_at
  before update on public.mangopay_wallets
  for each row execute function public.handle_updated_at();

create unique index idx_mangopay_wallets_owner on public.mangopay_wallets(owner_type, owner_id);

-- =====================================================================
-- payments
-- =====================================================================

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references public.missions(id) on delete set null,
  installer_id uuid references public.installers(id) on delete set null,
  subcontractor_id uuid references public.subcontractors(id) on delete set null,
  direction public.payment_direction not null,
  amount_eur numeric(10,2) not null,
  status public.payment_status not null default 'pending',
  mangopay_transaction_id text,
  scheduled_at timestamptz,
  executed_at timestamptz,
  failed_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_payments_updated_at
  before update on public.payments
  for each row execute function public.handle_updated_at();

create index idx_payments_mission on public.payments(mission_id);
create index idx_payments_installer on public.payments(installer_id);
create index idx_payments_subcontractor on public.payments(subcontractor_id);
create index idx_payments_status on public.payments(status);

-- =====================================================================
-- subscriptions
-- =====================================================================

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  owner_type text not null check (owner_type in ('installer', 'subcontractor')),
  owner_id uuid not null,
  plan text not null,
  amount_monthly numeric(8,2) not null,
  started_at timestamptz not null default now(),
  current_period_end timestamptz not null,
  cancelled_at timestamptz,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute function public.handle_updated_at();

create unique index idx_subs_owner_active on public.subscriptions(owner_type, owner_id) where status = 'active';

-- =====================================================================
-- supplier_catalog
-- =====================================================================

create table public.supplier_catalog (
  id uuid primary key default gen_random_uuid(),
  supplier text not null,
  category text not null,
  reference text not null,
  name text not null,
  description text,
  image_url text,
  list_price_ht numeric(10,2) not null,
  negotiated_price_ht numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_supplier_catalog_updated_at
  before update on public.supplier_catalog
  for each row execute function public.handle_updated_at();

create index idx_catalog_supplier on public.supplier_catalog(supplier);
create index idx_catalog_category on public.supplier_catalog(category);

-- =====================================================================
-- supplier_orders
-- =====================================================================

create table public.supplier_orders (
  id uuid primary key default gen_random_uuid(),
  subcontractor_id uuid not null references public.subcontractors(id) on delete cascade,
  mission_id uuid references public.missions(id) on delete set null,
  supplier text not null,
  items jsonb not null,
  amount_ht numeric(10,2) not null,
  amount_ttc numeric(10,2) not null,
  status text not null default 'draft',
  placed_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_supplier_orders_updated_at
  before update on public.supplier_orders
  for each row execute function public.handle_updated_at();

create index idx_supplier_orders_sub on public.supplier_orders(subcontractor_id);

-- =====================================================================
-- outbound_webhooks
-- =====================================================================

create table public.outbound_webhooks (
  id uuid primary key default gen_random_uuid(),
  installer_id uuid not null references public.installers(id) on delete cascade,
  event text not null,
  payload jsonb not null,
  target_url text not null,
  signature text not null,
  attempt_count integer not null default 0,
  delivered boolean not null default false,
  delivered_at timestamptz,
  next_retry_at timestamptz,
  last_error text,
  http_status integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_outbound_webhooks_updated_at
  before update on public.outbound_webhooks
  for each row execute function public.handle_updated_at();

create index idx_webhooks_installer on public.outbound_webhooks(installer_id);
create index idx_webhooks_pending on public.outbound_webhooks(next_retry_at) where delivered = false;
create index idx_webhooks_event on public.outbound_webhooks(event);

-- =====================================================================
-- RLS : activation + policies
-- =====================================================================

alter table public.installers enable row level security;
alter table public.subcontractors enable row level security;
alter table public.profiles enable row level security;
alter table public.subcontractor_documents enable row level security;
alter table public.api_keys enable row level security;
alter table public.missions enable row level security;
alter table public.mission_offers enable row level security;
alter table public.mission_photos enable row level security;
alter table public.mission_reviews enable row level security;
alter table public.mangopay_wallets enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.supplier_catalog enable row level security;
alter table public.supplier_orders enable row level security;
alter table public.outbound_webhooks enable row level security;

-- profiles : chaque user voit son propre profile + admin voit tout
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_super_admin());

create policy profiles_self_update on public.profiles
  for update using (id = auth.uid() or public.is_super_admin());

create policy profiles_admin_all on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- installers
create policy installers_members_read on public.installers
  for select using (public.is_installer_member(id) or public.is_super_admin());

create policy installers_members_update on public.installers
  for update using (public.is_installer_member(id) or public.is_super_admin());

create policy installers_admin_all on public.installers
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- subcontractors (installers peuvent voir les profils publics)
create policy subcontractors_self_read on public.subcontractors
  for select using (
    public.is_subcontractor_member(id)
    or public.current_installer_id() is not null
    or public.is_super_admin()
  );

create policy subcontractors_self_update on public.subcontractors
  for update using (public.is_subcontractor_member(id) or public.is_super_admin());

create policy subcontractors_admin_all on public.subcontractors
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- documents
create policy docs_sub_access on public.subcontractor_documents
  for all using (
    public.is_subcontractor_member(subcontractor_id) or public.is_super_admin()
  ) with check (
    public.is_subcontractor_member(subcontractor_id) or public.is_super_admin()
  );

-- api_keys
create policy api_keys_installer on public.api_keys
  for all using (
    public.is_installer_member(installer_id) or public.is_super_admin()
  ) with check (
    public.is_installer_member(installer_id) or public.is_super_admin()
  );

-- missions
create policy missions_access on public.missions
  for select using (
    public.is_installer_member(installer_id)
    or (subcontractor_id is not null and public.is_subcontractor_member(subcontractor_id))
    or public.is_super_admin()
  );

create policy missions_installer_write on public.missions
  for all using (public.is_installer_member(installer_id) or public.is_super_admin())
  with check (public.is_installer_member(installer_id) or public.is_super_admin());

create policy missions_subcontractor_update_assigned on public.missions
  for update using (
    subcontractor_id is not null and public.is_subcontractor_member(subcontractor_id)
  ) with check (
    subcontractor_id is not null and public.is_subcontractor_member(subcontractor_id)
  );

-- mission_offers
create policy offers_sub_access on public.mission_offers
  for all using (
    public.is_subcontractor_member(subcontractor_id)
    or exists (select 1 from public.missions m where m.id = mission_id and public.is_installer_member(m.installer_id))
    or public.is_super_admin()
  ) with check (
    public.is_subcontractor_member(subcontractor_id) or public.is_super_admin()
  );

-- mission_photos
create policy photos_access on public.mission_photos
  for all using (
    exists (
      select 1 from public.missions m where m.id = mission_id
      and (public.is_installer_member(m.installer_id) or (m.subcontractor_id is not null and public.is_subcontractor_member(m.subcontractor_id)))
    ) or public.is_super_admin()
  ) with check (
    exists (
      select 1 from public.missions m where m.id = mission_id
      and (public.is_installer_member(m.installer_id) or (m.subcontractor_id is not null and public.is_subcontractor_member(m.subcontractor_id)))
    ) or public.is_super_admin()
  );

-- mission_reviews
create policy reviews_access on public.mission_reviews
  for select using (
    public.is_subcontractor_member(subcontractor_id)
    or exists (select 1 from public.missions m where m.id = mission_id and public.is_installer_member(m.installer_id))
    or public.is_super_admin()
  );

create policy reviews_admin_write on public.mission_reviews
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- mangopay_wallets
create policy wallets_owner on public.mangopay_wallets
  for select using (
    (owner_type = 'installer' and public.is_installer_member(owner_id))
    or (owner_type = 'subcontractor' and public.is_subcontractor_member(owner_id))
    or public.is_super_admin()
  );

create policy wallets_admin_write on public.mangopay_wallets
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- payments
create policy payments_access on public.payments
  for select using (
    (installer_id is not null and public.is_installer_member(installer_id))
    or (subcontractor_id is not null and public.is_subcontractor_member(subcontractor_id))
    or public.is_super_admin()
  );

create policy payments_admin_write on public.payments
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- subscriptions
create policy subs_owner on public.subscriptions
  for select using (
    (owner_type = 'installer' and public.is_installer_member(owner_id))
    or (owner_type = 'subcontractor' and public.is_subcontractor_member(owner_id))
    or public.is_super_admin()
  );

create policy subs_admin_write on public.subscriptions
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- supplier_catalog (read public pour users auth)
create policy catalog_read on public.supplier_catalog
  for select using (auth.uid() is not null);

create policy catalog_admin_write on public.supplier_catalog
  for all using (public.is_super_admin()) with check (public.is_super_admin());

-- supplier_orders
create policy orders_sub on public.supplier_orders
  for all using (
    public.is_subcontractor_member(subcontractor_id) or public.is_super_admin()
  ) with check (
    public.is_subcontractor_member(subcontractor_id) or public.is_super_admin()
  );

-- outbound_webhooks
create policy webhooks_installer_read on public.outbound_webhooks
  for select using (public.is_installer_member(installer_id) or public.is_super_admin());

create policy webhooks_admin_write on public.outbound_webhooks
  for all using (public.is_super_admin()) with check (public.is_super_admin());
