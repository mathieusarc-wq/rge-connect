-- RGE Connect — Service credentials centralisés + whitelist super_admin

create table public.service_credentials (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  key_name text not null,
  value text,
  is_sensitive boolean not null default true,
  description text,
  updated_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint service_credentials_unique unique (service, key_name)
);

create trigger trg_service_credentials_updated_at
  before update on public.service_credentials
  for each row execute function public.handle_updated_at();

create index idx_service_credentials_service on public.service_credentials(service);

alter table public.service_credentials enable row level security;

create policy service_credentials_admin_read on public.service_credentials
  for select using (public.is_super_admin());

create policy service_credentials_admin_write on public.service_credentials
  for all using (public.is_super_admin()) with check (public.is_super_admin());

create or replace function public.get_service_credential(
  p_service text,
  p_key_name text
)
returns text
language sql
security definer
set search_path = public
stable
as $$
  select value
  from public.service_credentials
  where service = p_service and key_name = p_key_name
  limit 1;
$$;

create table public.super_admin_whitelist (
  email text primary key,
  granted_by uuid references auth.users(id) on delete set null,
  note text,
  created_at timestamptz not null default now()
);

alter table public.super_admin_whitelist enable row level security;

create policy super_admin_whitelist_read on public.super_admin_whitelist
  for select using (public.is_super_admin());

create policy super_admin_whitelist_write on public.super_admin_whitelist
  for all using (public.is_super_admin()) with check (public.is_super_admin());

insert into public.super_admin_whitelist (email, note)
values ('mathieu.sarc@gmail.com', 'Founder RGE Connect')
on conflict (email) do nothing;

create or replace function public.handle_new_profile_super_admin()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from public.super_admin_whitelist
    where lower(email) = lower(new.email)
  ) then
    new.is_super_admin := true;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profile_super_admin on public.profiles;
create trigger trg_profile_super_admin
  before insert on public.profiles
  for each row execute function public.handle_new_profile_super_admin();

update public.profiles p
set is_super_admin = true
from public.super_admin_whitelist w
where lower(p.email) = lower(w.email)
  and p.is_super_admin = false;
