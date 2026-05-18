create table if not exists public.kivo_power_totems (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  resource text not null,
  price numeric(20, 7) not null check (price > 0),
  unit text not null default 'session' check (unit in ('session', 'minute', 'kWh')),
  session_duration_seconds integer not null default 30 check (session_duration_seconds between 5 and 3600),
  status text not null default 'draft' check (status in ('draft', 'pairing', 'testing', 'active', 'paused', 'failed')),
  qr_slug text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  unique (owner_id, resource),
  unique (owner_id, qr_slug)
);

drop trigger if exists kivo_power_totems_set_updated_at on public.kivo_power_totems;
create trigger kivo_power_totems_set_updated_at
before update on public.kivo_power_totems
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_power_totems_owner_created_idx
  on public.kivo_power_totems (owner_id, created_at desc);
create index if not exists kivo_power_totems_owner_status_idx
  on public.kivo_power_totems (owner_id, status);

create table if not exists public.kivo_gateways (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  totem_id uuid references public.kivo_power_totems(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  token_hash text not null unique,
  token_preview text not null,
  pairing_token_hash text,
  pairing_token_preview text,
  status text not null default 'pairing' check (status in ('pairing', 'online', 'offline', 'suspended')),
  adapter text not null default 'simulator' check (adapter in ('simulator', 'raspberry')),
  last_seen_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (totem_id, owner_id) references public.kivo_power_totems(id, owner_id) on delete cascade
);

drop trigger if exists kivo_gateways_set_updated_at on public.kivo_gateways;
create trigger kivo_gateways_set_updated_at
before update on public.kivo_gateways
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_gateways_owner_created_idx
  on public.kivo_gateways (owner_id, created_at desc);
create index if not exists kivo_gateways_totem_idx
  on public.kivo_gateways (totem_id);
create index if not exists kivo_gateways_pairing_token_hash_idx
  on public.kivo_gateways (pairing_token_hash)
  where pairing_token_hash is not null;

create unique index if not exists kivo_payments_id_owner_id_idx
  on public.kivo_payments (id, owner_id);

create table if not exists public.kivo_power_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  totem_id uuid not null references public.kivo_power_totems(id) on delete cascade,
  gateway_id uuid references public.kivo_gateways(id) on delete set null,
  payment_id uuid references public.kivo_payments(id) on delete set null,
  x402_nonce text references public.kivo_x402_nonces(nonce) on delete set null,
  resource text not null,
  amount numeric(20, 7) not null check (amount > 0),
  asset text not null,
  duration_seconds integer not null check (duration_seconds between 5 and 3600),
  status text not null default 'requested' check (status in ('requested', 'payment_required', 'paid', 'authorized', 'running', 'completed', 'expired', 'failed')),
  authorization_token_hash text,
  authorization_token_preview text,
  authorized_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  expires_at timestamptz not null,
  failure_reason text,
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, owner_id),
  foreign key (totem_id, owner_id) references public.kivo_power_totems(id, owner_id) on delete cascade,
  foreign key (gateway_id, owner_id) references public.kivo_gateways(id, owner_id) on delete set null (gateway_id),
  foreign key (payment_id, owner_id) references public.kivo_payments(id, owner_id) on delete set null (payment_id)
);

drop trigger if exists kivo_power_sessions_set_updated_at on public.kivo_power_sessions;
create trigger kivo_power_sessions_set_updated_at
before update on public.kivo_power_sessions
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_power_sessions_owner_created_idx
  on public.kivo_power_sessions (owner_id, created_at desc);
create index if not exists kivo_power_sessions_totem_status_idx
  on public.kivo_power_sessions (totem_id, status, created_at desc);
create index if not exists kivo_power_sessions_gateway_status_idx
  on public.kivo_power_sessions (gateway_id, status, created_at desc);
create unique index if not exists kivo_power_sessions_x402_nonce_unique_idx
  on public.kivo_power_sessions (x402_nonce)
  where x402_nonce is not null;
create unique index if not exists kivo_power_sessions_payment_id_unique_idx
  on public.kivo_power_sessions (payment_id)
  where payment_id is not null;

create table if not exists public.kivo_gateway_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  gateway_id uuid references public.kivo_gateways(id) on delete set null,
  totem_id uuid references public.kivo_power_totems(id) on delete set null,
  session_id uuid references public.kivo_power_sessions(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  foreign key (gateway_id, owner_id) references public.kivo_gateways(id, owner_id) on delete set null (gateway_id),
  foreign key (totem_id, owner_id) references public.kivo_power_totems(id, owner_id) on delete set null (totem_id),
  foreign key (session_id, owner_id) references public.kivo_power_sessions(id, owner_id) on delete set null (session_id)
);

create index if not exists kivo_gateway_events_owner_created_idx
  on public.kivo_gateway_events (owner_id, created_at desc);
create index if not exists kivo_gateway_events_gateway_created_idx
  on public.kivo_gateway_events (gateway_id, created_at desc);
create index if not exists kivo_gateway_events_totem_created_idx
  on public.kivo_gateway_events (totem_id, created_at desc);
create index if not exists kivo_gateway_events_session_created_idx
  on public.kivo_gateway_events (session_id, created_at desc);

alter table public.kivo_power_totems enable row level security;
alter table public.kivo_gateways enable row level security;
alter table public.kivo_power_sessions enable row level security;
alter table public.kivo_gateway_events enable row level security;

drop policy if exists "Kivo power totems are owned by user" on public.kivo_power_totems;
create policy "Kivo power totems are owned by user" on public.kivo_power_totems
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Kivo gateways are owned by user" on public.kivo_gateways;
create policy "Kivo gateways are owned by user" on public.kivo_gateways
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Kivo power sessions are owned by user" on public.kivo_power_sessions;
create policy "Kivo power sessions are owned by user" on public.kivo_power_sessions
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

drop policy if exists "Kivo gateway events are owned by user" on public.kivo_gateway_events;
create policy "Kivo gateway events are owned by user" on public.kivo_gateway_events
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

grant select, insert, update, delete on
  public.kivo_power_totems,
  public.kivo_gateways,
  public.kivo_power_sessions,
  public.kivo_gateway_events
to authenticated;

grant select, insert, update, delete on
  public.kivo_power_totems,
  public.kivo_gateways,
  public.kivo_power_sessions,
  public.kivo_gateway_events
to service_role;
