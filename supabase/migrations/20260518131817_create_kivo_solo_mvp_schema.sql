create extension if not exists pgcrypto;

create or replace function public.kivo_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.kivo_devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  api_key_hash text not null,
  api_key_preview text not null,
  stellar_public_key text not null,
  encrypted_stellar_secret text,
  status text not null default 'active' check (status in ('active', 'suspended', 'decommissioned')),
  metadata jsonb not null default '{}'::jsonb,
  balances jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kivo_devices_set_updated_at
before update on public.kivo_devices
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_devices_owner_created_idx on public.kivo_devices (owner_id, created_at desc);
create index if not exists kivo_devices_owner_status_idx on public.kivo_devices (owner_id, status);

create table if not exists public.kivo_payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  from_device_id uuid references public.kivo_devices(id) on delete set null,
  to_device_id uuid references public.kivo_devices(id) on delete set null,
  amount numeric(20, 7) not null check (amount >= 0),
  asset_code text not null default 'USDC',
  asset_issuer text,
  condition_type text not null default 'none' check (condition_type in ('none', 'energy_kwh', 'time_elapsed', 'service_complete', 'custom')),
  condition_value text,
  status text not null default 'pending' check (status in ('pending', 'processing', 'confirmed', 'failed', 'expired', 'refunded')),
  stellar_hash text,
  stellar_ledger bigint,
  memo text,
  timeout_at timestamptz,
  confirmed_at timestamptz,
  failed_reason text,
  fee_charged numeric(20, 7),
  events jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kivo_payments_set_updated_at
before update on public.kivo_payments
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_payments_owner_created_idx on public.kivo_payments (owner_id, created_at desc);
create index if not exists kivo_payments_owner_status_idx on public.kivo_payments (owner_id, status);
create index if not exists kivo_payments_devices_idx on public.kivo_payments (from_device_id, to_device_id);
create index if not exists kivo_payments_stellar_hash_idx on public.kivo_payments (stellar_hash) where stellar_hash is not null;

create table if not exists public.kivo_payment_conditions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid not null references public.kivo_payments(id) on delete cascade,
  condition_key text not null,
  expected_value text not null,
  actual_value text,
  proof_data jsonb not null default '{}'::jsonb,
  met_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists kivo_payment_conditions_payment_idx on public.kivo_payment_conditions (payment_id, created_at desc);

create table if not exists public.kivo_x402_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  resource text not null,
  amount numeric(20, 7) not null check (amount > 0),
  asset text not null,
  max_timeout integer not null default 300 check (max_timeout between 30 and 3600),
  enabled boolean not null default true,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, resource)
);

create trigger kivo_x402_pricing_rules_set_updated_at
before update on public.kivo_x402_pricing_rules
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_x402_pricing_rules_resource_idx on public.kivo_x402_pricing_rules (resource) where enabled;

create table if not exists public.kivo_x402_nonces (
  nonce text primary key,
  owner_id uuid references auth.users(id) on delete cascade,
  resource text not null,
  amount numeric(20, 7) not null,
  asset text not null,
  pay_to text not null,
  max_timeout integer not null default 300,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'expired', 'failed')),
  payment_header text,
  stellar_hash text,
  stellar_ledger bigint,
  tx_xdr text,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kivo_x402_nonces_set_updated_at
before update on public.kivo_x402_nonces
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_x402_nonces_owner_created_idx on public.kivo_x402_nonces (owner_id, created_at desc);
create index if not exists kivo_x402_nonces_resource_status_idx on public.kivo_x402_nonces (resource, status);

create table if not exists public.kivo_webhooks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  url text not null,
  events text[] not null default array[]::text[],
  secret_hash text not null,
  secret_preview text not null,
  encrypted_secret text,
  active boolean not null default true,
  delivery_count integer not null default 0,
  last_delivery_status text not null default 'pending' check (last_delivery_status in ('pending', 'delivered', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kivo_webhooks_set_updated_at
before update on public.kivo_webhooks
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_webhooks_owner_created_idx on public.kivo_webhooks (owner_id, created_at desc);

create table if not exists public.kivo_webhook_deliveries (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  webhook_id uuid references public.kivo_webhooks(id) on delete set null,
  payment_id uuid references public.kivo_payments(id) on delete set null,
  event text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'delivered', 'failed')),
  attempts integer not null default 0,
  response_code integer,
  next_retry_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists kivo_webhook_deliveries_owner_created_idx on public.kivo_webhook_deliveries (owner_id, created_at desc);
create index if not exists kivo_webhook_deliveries_webhook_idx on public.kivo_webhook_deliveries (webhook_id, created_at desc);

create table if not exists public.kivo_api_keys (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  key_hash text not null unique,
  key_preview text not null,
  scopes text[] not null default array[]::text[],
  status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger kivo_api_keys_set_updated_at
before update on public.kivo_api_keys
for each row execute function public.kivo_set_updated_at();

create index if not exists kivo_api_keys_owner_created_idx on public.kivo_api_keys (owner_id, created_at desc);

create table if not exists public.kivo_etherfuse_webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider_event_id text,
  provider_order_id text,
  event_type text not null,
  signature_valid boolean not null default false,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

create index if not exists kivo_etherfuse_webhook_events_received_idx on public.kivo_etherfuse_webhook_events (received_at desc);
create unique index if not exists kivo_etherfuse_webhook_events_provider_event_uidx
  on public.kivo_etherfuse_webhook_events (provider_event_id)
  where provider_event_id is not null and provider_event_id <> '';

alter table public.kivo_devices enable row level security;
alter table public.kivo_payments enable row level security;
alter table public.kivo_payment_conditions enable row level security;
alter table public.kivo_x402_pricing_rules enable row level security;
alter table public.kivo_x402_nonces enable row level security;
alter table public.kivo_webhooks enable row level security;
alter table public.kivo_webhook_deliveries enable row level security;
alter table public.kivo_api_keys enable row level security;
alter table public.kivo_etherfuse_webhook_events enable row level security;

create policy "Kivo devices are owned by user" on public.kivo_devices
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo payments are owned by user" on public.kivo_payments
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo payment conditions are owned by user" on public.kivo_payment_conditions
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo x402 rules are owned by user" on public.kivo_x402_pricing_rules
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo x402 nonces are owned by user" on public.kivo_x402_nonces
  for select to authenticated using (owner_id = auth.uid());

create policy "Kivo webhooks are owned by user" on public.kivo_webhooks
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo webhook deliveries are owned by user" on public.kivo_webhook_deliveries
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy "Kivo api keys are owned by user" on public.kivo_api_keys
  for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());

grant usage on schema public to anon, authenticated, service_role;
grant select, insert, update, delete on
  public.kivo_devices,
  public.kivo_payments,
  public.kivo_payment_conditions,
  public.kivo_x402_pricing_rules,
  public.kivo_x402_nonces,
  public.kivo_webhooks,
  public.kivo_webhook_deliveries,
  public.kivo_api_keys,
  public.kivo_etherfuse_webhook_events
to authenticated;

grant select, insert, update, delete on
  public.kivo_devices,
  public.kivo_payments,
  public.kivo_payment_conditions,
  public.kivo_x402_pricing_rules,
  public.kivo_x402_nonces,
  public.kivo_webhooks,
  public.kivo_webhook_deliveries,
  public.kivo_api_keys,
  public.kivo_etherfuse_webhook_events
to anon;

grant select, insert, update, delete on
  public.kivo_devices,
  public.kivo_payments,
  public.kivo_payment_conditions,
  public.kivo_x402_pricing_rules,
  public.kivo_x402_nonces,
  public.kivo_webhooks,
  public.kivo_webhook_deliveries,
  public.kivo_api_keys,
  public.kivo_etherfuse_webhook_events
to service_role;
