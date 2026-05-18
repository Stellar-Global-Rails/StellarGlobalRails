alter function public.kivo_set_updated_at() set search_path = public, pg_temp;

revoke execute on function public.kivo_set_updated_at() from public, anon, authenticated;

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    alter function public.rls_auto_enable() set search_path = public, pg_temp;
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end $$;

drop policy if exists "Kivo devices are owned by user" on public.kivo_devices;
drop policy if exists "Kivo payments are owned by user" on public.kivo_payments;
drop policy if exists "Kivo payment conditions are owned by user" on public.kivo_payment_conditions;
drop policy if exists "Kivo x402 rules are owned by user" on public.kivo_x402_pricing_rules;
drop policy if exists "Kivo x402 nonces are owned by user" on public.kivo_x402_nonces;
drop policy if exists "Kivo webhooks are owned by user" on public.kivo_webhooks;
drop policy if exists "Kivo webhook deliveries are owned by user" on public.kivo_webhook_deliveries;
drop policy if exists "Kivo api keys are owned by user" on public.kivo_api_keys;

notify pgrst, 'reload schema';
