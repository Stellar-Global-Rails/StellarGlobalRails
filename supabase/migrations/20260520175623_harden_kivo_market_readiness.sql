drop policy if exists "Kivo power totems are owned by user" on public.kivo_power_totems;
create policy "Kivo power totems are owned by user"
on public.kivo_power_totems
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists "Kivo gateways are owned by user" on public.kivo_gateways;
create policy "Kivo gateways are owned by user"
on public.kivo_gateways
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists "Kivo power sessions are owned by user" on public.kivo_power_sessions;
create policy "Kivo power sessions are owned by user"
on public.kivo_power_sessions
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

drop policy if exists "Kivo gateway events are owned by user" on public.kivo_gateway_events;
create policy "Kivo gateway events are owned by user"
on public.kivo_gateway_events
for all
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));
