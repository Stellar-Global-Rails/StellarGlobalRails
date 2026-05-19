alter table public.kivo_payments
  alter column from_device_id drop not null,
  alter column to_device_id drop not null;

alter table public.kivo_x402_nonces
  add column if not exists payment_header text,
  add column if not exists stellar_hash text,
  add column if not exists stellar_ledger bigint,
  add column if not exists tx_xdr text,
  add column if not exists updated_at timestamptz not null default now();

alter table public.kivo_x402_nonces
  drop constraint if exists kivo_x402_nonces_status_check;

alter table public.kivo_x402_nonces
  add constraint kivo_x402_nonces_status_check
  check (status in ('issued', 'paid', 'pending', 'confirmed', 'expired', 'failed'));

alter table public.kivo_api_keys
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists kivo_x402_nonces_set_updated_at on public.kivo_x402_nonces;
create trigger kivo_x402_nonces_set_updated_at
before update on public.kivo_x402_nonces
for each row execute function public.kivo_set_updated_at();

drop trigger if exists kivo_api_keys_set_updated_at on public.kivo_api_keys;
create trigger kivo_api_keys_set_updated_at
before update on public.kivo_api_keys
for each row execute function public.kivo_set_updated_at();

notify pgrst, 'reload schema';
