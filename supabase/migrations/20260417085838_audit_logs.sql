-- RGE Connect — Audit logs
-- Table append-only pour tracer les actions sensibles : création/modification/
-- suppression de missions, paiements, documents, clés API, changements de rôle.
-- Utilisé pour investigation incident + conformité RGPD.

create type public.audit_action as enum (
  'insert',
  'update',
  'delete',
  'login_success',
  'login_failure',
  'password_change',
  'password_reset',
  'api_key_created',
  'api_key_revoked',
  'document_uploaded',
  'document_validated',
  'document_rejected',
  'mission_published',
  'mission_assigned',
  'mission_cancelled',
  'payment_initiated',
  'payment_executed',
  'payment_failed',
  'webhook_delivered',
  'webhook_failed',
  'rate_limit_triggered',
  'unauthorized_access'
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  actor_ip inet,
  actor_user_agent text,
  action public.audit_action not null,
  target_table text,
  target_id uuid,
  installer_id uuid references public.installers(id) on delete set null,
  subcontractor_id uuid references public.subcontractors(id) on delete set null,
  metadata jsonb,
  old_values jsonb,
  new_values jsonb,
  success boolean not null default true,
  error_message text,
  created_at timestamptz not null default now()
);

create index idx_audit_actor on public.audit_logs(actor_id, created_at desc);
create index idx_audit_target on public.audit_logs(target_table, target_id);
create index idx_audit_action on public.audit_logs(action, created_at desc);
create index idx_audit_installer on public.audit_logs(installer_id, created_at desc) where installer_id is not null;
create index idx_audit_sub on public.audit_logs(subcontractor_id, created_at desc) where subcontractor_id is not null;
create index idx_audit_failed on public.audit_logs(created_at desc) where success = false;

alter table public.audit_logs enable row level security;

create policy audit_admin_read on public.audit_logs
  for select using (public.is_super_admin());

create policy audit_installer_read on public.audit_logs
  for select using (
    installer_id is not null and public.is_installer_member(installer_id)
  );

create policy audit_sub_read on public.audit_logs
  for select using (
    subcontractor_id is not null and public.is_subcontractor_member(subcontractor_id)
  );

-- Pas de policy INSERT : insertion via service_role uniquement (bypass RLS)
-- Pas de policy UPDATE/DELETE : append-only par design
