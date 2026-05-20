# Kivo Market Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Kivo's Power Totem path into a complete, repeatable, market-demo-ready product flow with real session evidence, healthier deploy checks, and no misleading unfinished surfaces.

**Architecture:** Keep Kivo's current Supabase Edge Function as the source of truth and tighten the Power Totem workflow around it. The frontend should show only functional or clearly gated product paths, while the gateway, SDK, and Edge API prove a full lifecycle: create totem, pair gateway, create session, start checkout, submit signed x402 payment, authorize gateway, execute session, record events.

**Tech Stack:** React/Vite/TypeScript frontend in `apps/kivo/web`, Supabase Edge Function in `supabase/functions/kivo-api`, Supabase Postgres migrations in `supabase/migrations`, Vitest for unit coverage, PowerShell preflight for delivery checks.

---

## File Structure

- `supabase/functions/kivo-api/index.ts`: Edge API routes for health, deploy checks, Power Totem sessions, x402 payment, gateway authorization, and MCP status.
- `supabase/functions/kivo-api/*_test.ts`: Deno tests for settlement/session/gateway domain behavior.
- `supabase/migrations/<new>_harden_kivo_market_readiness.sql`: RLS performance/security hardening and optional helper views/functions if needed.
- `apps/kivo/web/src/pages/CheckoutPage.tsx`: Operator checkout flow; must show exact challenge and signed transaction requirements.
- `apps/kivo/web/src/pages/GatewayPage.tsx`: Gateway install, heartbeat, authorization/event evidence.
- `apps/kivo/web/src/pages/StatusPage.tsx`: Product readiness dashboard; must reflect MCP degraded and Auth password protection honestly.
- `apps/kivo/web/src/data/templateMarketplace.ts`: Template availability; only Power Totem should be functional.
- `apps/kivo/web/src/data/templateMarketplace.test.ts`: Guards that unfinished templates are not presented as production-ready.
- `apps/kivo/web/src/services/kivoClient.ts`: API client methods used by UI and tests.
- `apps/kivo/web/src/services/kivoClient.test.ts`: Coverage for session/payment/gateway lifecycle calls.
- `apps/kivo/gateway/src/runner.ts`: Runtime loop that fetches authorization, enables output, disables output, and reports lifecycle events.
- `apps/kivo/gateway/src/runner.test.ts`: Evidence that the gateway reports authorized/started/completed/failed events.
- `apps/kivo/scripts/preflight.ps1`: Delivery preflight; should validate remote API, route reachability, MCP state, and testnet key funding without requiring local `.env` for remote runs.
- `apps/kivo/DELIVERY.md`: Go/no-go checklist and demo script.
- `apps/kivo/POWER_TOTEM_DEMO.md`: Exact operator script for hackathon presentation.

---

### Task 1: Create A Real End-To-End Evidence Checklist

**Files:**
- Modify: `apps/kivo/DELIVERY.md`
- Modify: `apps/kivo/POWER_TOTEM_DEMO.md`

- [ ] **Step 1: Replace the current go/no-go checklist with measurable evidence**

In `apps/kivo/DELIVERY.md`, update the Power Totem checklist so each item names the proof to capture:

```markdown
## Power Totem Go/No-Go

- [ ] Power Totem created in Studio and visible in `/totems/:id`.
  Evidence: `kivo_power_totems` has a new row for the operator and the UI shows the same totem id.
- [ ] Gateway bundle generated once and token copied only from the one-time screen.
  Evidence: `kivo_gateways` has a new row with `token_hash` set and no plaintext token stored.
- [ ] Gateway heartbeat marks the gateway online.
  Evidence: `kivo_gateways.last_seen_at` updates after the gateway process starts.
- [ ] Checkout creates x402 challenge for `/power-totem/{id}/session`.
  Evidence: `kivo_power_sessions.checkout_resource` matches `/power-totem/{id}/session`.
- [ ] Valid signed payment authorizes one session.
  Evidence: `kivo_power_sessions.status = 'authorized'` and `authorized_at` is not null.
- [ ] Gateway receives authorization and reports lifecycle events.
  Evidence: `kivo_gateway_events` contains `authorized`, `output_enabled`, `output_disabled`, and `completed` for the session.
- [ ] Browser simulator is ready as fallback.
  Evidence: gateway can run with `KIVO_GATEWAY_ADAPTER=simulator`.
- [ ] Raspberry mode is safe.
  Evidence: demo uses only low-voltage output commands and no AC mains switching.
```

- [ ] **Step 2: Add the exact SQL evidence query to the demo doc**

In `apps/kivo/POWER_TOTEM_DEMO.md`, add:

```markdown
## Evidence Query

Run this after the demo session:

```sql
select
  s.id as session_id,
  s.status,
  s.checkout_resource,
  s.authorized_at,
  g.id as gateway_id,
  g.last_seen_at,
  count(e.id)::int as gateway_events
from public.kivo_power_sessions s
join public.kivo_power_totems t on t.id = s.totem_id
left join public.kivo_gateways g on g.totem_id = t.id
left join public.kivo_gateway_events e on e.session_id = s.id
where s.created_at > now() - interval '2 hours'
group by s.id, s.status, s.checkout_resource, s.authorized_at, g.id, g.last_seen_at
order by s.created_at desc;
```
```

- [ ] **Step 3: Verify docs render as plain Markdown**

Run:

```powershell
Get-Content apps/kivo/DELIVERY.md
Get-Content apps/kivo/POWER_TOTEM_DEMO.md
```

Expected: both files print without broken code fences.

- [ ] **Step 4: Commit**

```bash
git add apps/kivo/DELIVERY.md apps/kivo/POWER_TOTEM_DEMO.md
git commit -m "docs: define kivo power totem go-no-go evidence"
```

---

### Task 2: Fix Remote Preflight So It Measures Remote Readiness

**Files:**
- Modify: `apps/kivo/scripts/preflight.ps1`

- [ ] **Step 1: Add a helper that skips local env checks for remote API URLs**

Modify the env check section in `apps/kivo/scripts/preflight.ps1`:

```powershell
$isLocal = $ApiUrl -like "http://127.0.0.1*" -or $ApiUrl -like "http://localhost*"
$requiredLocalEnv = @("SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "X402_PLATFORM_KEY", "ETHERFUSE_API_KEY", "ETHERFUSE_WEBHOOK_URL")
if ($isLocal) {
  $requiredLocalEnv += "ETHERFUSE_WEBHOOK_SECRET"
}

if ($isLocal) {
  foreach ($key in $requiredLocalEnv) {
    $value = Get-EnvValue $key
    Write-Check "env:$key" ([bool]$value) $(if ($value) { "set" } else { "missing" })
  }
} else {
  Write-Check "env:remote-secrets" $true "checked by /v1/deploy/checks"
}
```

- [ ] **Step 2: Parse deploy checks and fail when a remote check is not ready**

After the `/v1/deploy/checks` HTTP request, parse the response:

```powershell
try {
  $response = Invoke-WebRequest -Uri "$ApiUrl/v1/deploy/checks" -TimeoutSec 20 -UseBasicParsing
  Write-Check "api:/v1/deploy/checks" ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) "HTTP $($response.StatusCode)"
  $checks = $response.Content | ConvertFrom-Json
  foreach ($check in $checks) {
    Write-Check "deploy:$($check.id)" ($check.status -eq "ready") "$($check.status) $($check.value)"
  }
} catch {
  $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
  Write-Check "api:/v1/deploy/checks" $false "HTTP $status"
}
```

- [ ] **Step 3: Make Stellar platform key validation use the remote deploy check when remote**

Replace the final `stellar:X402_PLATFORM_KEY` block with:

```powershell
if ($isLocal) {
  $platformKey = Get-EnvValue "X402_PLATFORM_KEY"
  if ($platformKey -and $platformKey.StartsWith("G") -and $platformKey.Length -gt 50) {
    try {
      $account = Invoke-WebRequest -Uri "https://horizon-testnet.stellar.org/accounts/$platformKey" -TimeoutSec 20 -UseBasicParsing
      Write-Check "stellar:X402_PLATFORM_KEY" ($account.StatusCode -eq 200) "funded on testnet"
    } catch {
      $status = if ($_.Exception.Response) { [int]$_.Exception.Response.StatusCode } else { "n/a" }
      Write-Check "stellar:X402_PLATFORM_KEY" $false "HTTP $status"
    }
  } else {
    Write-Check "stellar:X402_PLATFORM_KEY" $false "missing or placeholder"
  }
} else {
  Write-Check "stellar:X402_PLATFORM_KEY" $true "checked by remote deploy checks"
}
```

- [ ] **Step 4: Run remote preflight**

Run:

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api
```

Expected: no false failures for missing local `.env`; API health, Etherfuse status, deploy checks, Power Totem route, and remote Stellar check are reported.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/scripts/preflight.ps1
git commit -m "chore: make kivo preflight validate remote readiness"
```

---

### Task 3: Make MCP Degraded State Explicit And Non-Blocking

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/web/src/pages/StatusPage.tsx`
- Test: `supabase/functions/kivo-api/*_test.ts` if the health helper is split into a testable function

- [ ] **Step 1: Locate current health response**

Run:

```powershell
rg -n "mcp|health|degraded|workers|stellar" supabase/functions/kivo-api/index.ts
```

Expected: find the handler that returns `{ api, db, workers, stellar, mcp, version }`.

- [ ] **Step 2: Return a reason field for MCP**

Update the health payload to include a stable reason:

```ts
const health = {
  api: "ok",
  db: dbOk ? "ok" : "down",
  workers: "ok",
  stellar: stellarOk ? "ok" : "degraded",
  mcp: mcpOk ? "ok" : "degraded",
  mcp_reason: mcpOk ? "tools_available" : "optional_console_not_required_for_power_totem",
  version: "kivo-edge-transition-2026-05-17",
};
```

- [ ] **Step 3: Show MCP as optional in Status page**

In `apps/kivo/web/src/pages/StatusPage.tsx`, render MCP with copy equivalent to:

```tsx
<StatusRow
  label="MCP console"
  status={health.data?.mcp === 'ok' ? 'ready' : 'degraded'}
  description={
    health.data?.mcp === 'ok'
      ? 'Ferramentas MCP disponiveis.'
      : 'Console MCP opcional; Power Totem, x402, Stellar e Gateway nao dependem dele.'
  }
/>
```

- [ ] **Step 4: Run Kivo web tests and build**

```bash
cd apps/kivo/web
npm test
npm run build
```

Expected: 50 tests pass and build completes.

- [ ] **Step 5: Deploy Edge Function after local tests**

```bash
supabase functions deploy kivo-api --project-ref ftjzxwlbgvghvzoztdik --use-api --no-verify-jwt
```

Expected: function deploys and `/v1/health` includes `mcp_reason`.

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/kivo-api/index.ts apps/kivo/web/src/pages/StatusPage.tsx
git commit -m "feat: clarify optional mcp health state"
```

---

### Task 4: Prove The Power Totem Session Lifecycle In Tests

**Files:**
- Modify: `supabase/functions/kivo-api/powerTotemDomain.ts`
- Modify: `supabase/functions/kivo-api/powerTotemDomain_test.ts`
- Modify: `supabase/functions/kivo-api/settlementValidation.ts`
- Modify: `supabase/functions/kivo-api/settlementValidation_test.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.test.ts`

- [ ] **Step 1: Add lifecycle expectation to domain tests**

In `supabase/functions/kivo-api/powerTotemDomain_test.ts`, add:

```ts
Deno.test("Power Totem lifecycle requires payment before gateway authorization", () => {
  const unpaid = {
    id: "session_1",
    status: "checkout_started",
    authorized_at: null,
  };

  const paid = {
    id: "session_1",
    status: "authorized",
    authorized_at: new Date().toISOString(),
  };

  assertEquals(isGatewaySessionAuthorized(unpaid), false);
  assertEquals(isGatewaySessionAuthorized(paid), true);
});
```

- [ ] **Step 2: Implement or export the helper**

In `supabase/functions/kivo-api/powerTotemDomain.ts`, add:

```ts
export function isGatewaySessionAuthorized(session: { status: string; authorized_at: string | null }): boolean {
  return session.status === "authorized" && Boolean(session.authorized_at);
}
```

- [ ] **Step 3: Add API client coverage for checkout-to-payment**

In `apps/kivo/web/src/services/kivoClient.test.ts`, add a test using the existing fetch mock style:

```ts
it('starts Power Totem checkout and pays the returned x402 nonce', async () => {
  const fetcher = vi.fn()
    .mockResolvedValueOnce(jsonResponse({
      session: { id: 'ps_1', status: 'checkout_started' },
      checkoutResource: '/power-totem/pt_1/session',
      challenge: { nonce: 'nonce_1', amount: '0.10', asset: 'USDC' },
    }))
    .mockResolvedValueOnce(jsonResponse({
      ok: true,
      paymentId: 'pay_1',
      paymentHeader: 'x402 pay_1',
    }));

  const client = createKivoClient({ baseUrl: 'https://api.example.test', fetcher });
  const checkout = await client.startPowerSessionCheckout('ps_1');
  const paid = await client.payX402Challenge(checkout.challenge.nonce, 'signed-xdr');

  expect(checkout.checkoutResource).toBe('/power-totem/pt_1/session');
  expect(paid.paymentHeader).toBe('x402 pay_1');
  expect(fetcher).toHaveBeenCalledTimes(2);
});
```

- [ ] **Step 4: Run tests**

```bash
cd apps/kivo/web
npm test
```

Expected: all web tests pass.

If Deno is available:

```bash
cd supabase/functions/kivo-api
deno test --allow-env --allow-net=localhost
```

Expected: Edge domain tests pass.

- [ ] **Step 5: Commit**

```bash
git add supabase/functions/kivo-api/powerTotemDomain.ts supabase/functions/kivo-api/powerTotemDomain_test.ts apps/kivo/web/src/services/kivoClient.test.ts
git commit -m "test: prove kivo power totem lifecycle gates"
```

---

### Task 5: Complete Gateway Event Evidence

**Files:**
- Modify: `apps/kivo/gateway/src/runner.ts`
- Modify: `apps/kivo/gateway/src/runner.test.ts`
- Modify: `apps/kivo/gateway/src/types.ts`

- [ ] **Step 1: Define gateway lifecycle event names**

In `apps/kivo/gateway/src/types.ts`, ensure the event type includes:

```ts
export type GatewayEventType =
  | "heartbeat"
  | "authorized"
  | "output_enabled"
  | "output_disabled"
  | "completed"
  | "failed";
```

- [ ] **Step 2: Report events around adapter execution**

In `apps/kivo/gateway/src/runner.ts`, wrap session execution like this:

```ts
await client.createGatewayEvent(config.gatewayId, config.gatewayToken, {
  type: "authorized",
  sessionId: authorization.id,
  payload: { durationSeconds: authorization.durationSeconds },
});

await adapter.enable(authorization);
await client.createGatewayEvent(config.gatewayId, config.gatewayToken, {
  type: "output_enabled",
  sessionId: authorization.id,
  payload: { adapter: adapter.name },
});

await sleep(authorization.durationSeconds * 1000);

await adapter.disable(authorization);
await client.createGatewayEvent(config.gatewayId, config.gatewayToken, {
  type: "output_disabled",
  sessionId: authorization.id,
  payload: { adapter: adapter.name },
});

await client.createGatewayEvent(config.gatewayId, config.gatewayToken, {
  type: "completed",
  sessionId: authorization.id,
  payload: { completedAt: new Date().toISOString() },
});
```

- [ ] **Step 3: Report failure events**

In the runner catch block, add:

```ts
await client.createGatewayEvent(config.gatewayId, config.gatewayToken, {
  type: "failed",
  sessionId: currentSessionId,
  payload: { message: error instanceof Error ? error.message : String(error) },
});
```

- [ ] **Step 4: Update runner test**

In `apps/kivo/gateway/src/runner.test.ts`, assert:

```ts
expect(client.events.map((event) => event.type)).toEqual([
  "authorized",
  "output_enabled",
  "output_disabled",
  "completed",
]);
```

- [ ] **Step 5: Run gateway tests and build**

```bash
cd apps/kivo/gateway
npm test
npm run build
```

Expected: 10 tests pass and TypeScript build completes.

- [ ] **Step 6: Commit**

```bash
git add apps/kivo/gateway/src/runner.ts apps/kivo/gateway/src/runner.test.ts apps/kivo/gateway/src/types.ts
git commit -m "feat: record gateway lifecycle evidence"
```

---

### Task 6: Hide Or Gate Non-Functional Templates

**Files:**
- Modify: `apps/kivo/web/src/data/templateMarketplace.ts`
- Modify: `apps/kivo/web/src/data/templateMarketplace.test.ts`
- Modify: `apps/kivo/web/src/pages/MarketplacePage.tsx`
- Modify: `apps/kivo/web/src/pages/TemplateDetailPage.tsx`

- [ ] **Step 1: Make availability explicit in data**

In `apps/kivo/web/src/data/templateMarketplace.ts`, ensure each template has:

```ts
status: 'functional' | 'planned' | 'research';
isFunctionalHackathonTemplate: boolean;
```

Power Totem:

```ts
status: 'functional',
isFunctionalHackathonTemplate: true,
```

API Toll and Agent Tool Paywall:

```ts
status: 'planned',
isFunctionalHackathonTemplate: false,
```

or:

```ts
status: 'research',
isFunctionalHackathonTemplate: false,
```

- [ ] **Step 2: Disable launch buttons for non-functional templates**

In template detail UI, use:

```tsx
const canLaunch = template.isFunctionalHackathonTemplate;

<button
  disabled={!canLaunch}
  className={canLaunch ? primaryButtonClass : disabledButtonClass}
>
  {canLaunch ? 'Criar Power Totem' : 'Entrar na lista'}
</button>
```

- [ ] **Step 3: Add marketplace guard test**

In `apps/kivo/web/src/data/templateMarketplace.test.ts`, add:

```ts
it('only marks Power Totem as functional for hackathon delivery', () => {
  const functional = templates.filter((template) => template.isFunctionalHackathonTemplate);
  expect(functional.map((template) => template.id)).toEqual(['power-totem']);
});
```

- [ ] **Step 4: Run web tests and build**

```bash
cd apps/kivo/web
npm test
npm run build
```

Expected: tests pass and build completes.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/web/src/data/templateMarketplace.ts apps/kivo/web/src/data/templateMarketplace.test.ts apps/kivo/web/src/pages/MarketplacePage.tsx apps/kivo/web/src/pages/TemplateDetailPage.tsx
git commit -m "feat: gate non-functional kivo templates"
```

---

### Task 7: Harden Kivo Supabase Warnings

**Files:**
- Create: `supabase/migrations/<timestamp>_harden_kivo_market_readiness.sql`

- [ ] **Step 1: Create migration via Supabase CLI**

Run:

```bash
supabase migration new harden_kivo_market_readiness --workdir .
```

Expected: CLI creates a timestamped SQL file under `supabase/migrations`.

- [ ] **Step 2: Optimize Power Totem RLS auth calls**

In the new migration, replace policies for Power Totem tables using `(select auth.uid())`. The migration should follow this shape:

```sql
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
```

- [ ] **Step 3: Push migration to Kivo project**

Run:

```bash
supabase db push --linked --workdir .
```

Expected: migration applies to `ftjzxwlbgvghvzoztdik`.

- [ ] **Step 4: Re-run advisors**

Run:

```bash
supabase db advisors --linked --workdir . -o json --fail-on none
```

Expected: Power Totem `auth_rls_initplan` warnings are gone. Remaining acceptable warning may be `auth_leaked_password_protection`, which must be fixed in Supabase Dashboard.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations
git commit -m "fix: harden kivo rls readiness policies"
```

---

### Task 8: Execute One Real Remote Demo Run

**Files:**
- Modify: `apps/kivo/DELIVERY.md`

- [ ] **Step 1: Start the frontend with production API values**

Run:

```bash
cd apps/kivo/web
npm run dev
```

Use these env values in Vercel or local `.env` before the run:

```txt
VITE_KIVO_API_URL=https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api
VITE_SUPABASE_URL=https://ftjzxwlbgvghvzoztdik.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
VITE_KIVO_ENABLE_DEV_CONTROLS=false
```

- [ ] **Step 2: Create Power Totem from Studio**

Expected:
- UI lands on the created totem detail page.
- `kivo_power_totems` count increases by 1.

- [ ] **Step 3: Generate gateway bundle**

Expected:
- UI shows gateway id and one-time token.
- `kivo_gateways` count increases by 1.

- [ ] **Step 4: Run gateway simulator**

Run:

```bash
cd apps/kivo/gateway
$env:KIVO_API_URL="https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api"
$env:KIVO_GATEWAY_ID="<gateway-id>"
$env:KIVO_GATEWAY_TOKEN="<one-time-token>"
$env:KIVO_GATEWAY_ADAPTER="simulator"
npm run dev -- start
```

Expected:
- Gateway sends heartbeat.
- `kivo_gateways.last_seen_at` updates.

- [ ] **Step 5: Start checkout and submit signed XDR**

Expected:
- x402 challenge uses `/power-totem/{id}/session`.
- `POST /v1/x402/pay` accepts the signed `txXDR`.
- Session becomes `authorized`.

- [ ] **Step 6: Confirm gateway event evidence**

Run:

```bash
supabase db query "select s.id, s.status, s.checkout_resource, s.authorized_at, count(e.id)::int as events from public.kivo_power_sessions s left join public.kivo_gateway_events e on e.session_id = s.id where s.created_at > now() - interval '2 hours' group by s.id, s.status, s.checkout_resource, s.authorized_at order by s.authorized_at desc nulls last;" --linked --workdir . -o json
```

Expected:
- Latest session status is `authorized` or `completed`.
- Event count is at least 4 after gateway completion.

- [ ] **Step 7: Update DELIVERY.md with the run result**

Add:

```markdown
## Last Full Remote Run

- Date: 2026-05-20
- API: `https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api`
- Result: full Power Totem flow completed with gateway events recorded.
- Evidence: latest `kivo_power_sessions` row has authorization timestamp and gateway event count >= 4.
```

- [ ] **Step 8: Commit**

```bash
git add apps/kivo/DELIVERY.md
git commit -m "docs: record kivo full remote demo run"
```

---

### Task 9: Final Verification Gate

**Files:**
- No source changes unless verification finds a blocker.

- [ ] **Step 1: Run all Kivo checks**

```bash
cd apps/kivo/web
npm test
npm run build
```

Expected: 50 web tests pass and build completes.

```bash
cd apps/kivo/gateway
npm test
npm run build
```

Expected: 10 gateway tests pass and build completes.

```bash
cd apps/kivo/sdk
npm test
npm run build
```

Expected: 4 SDK tests pass and build completes.

- [ ] **Step 2: Run remote preflight**

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api
```

Expected: no false local env failures; deploy checks ready; Power Totem route reachable.

- [ ] **Step 3: Run Supabase advisors**

```bash
supabase db advisors --linked --workdir . -o json --fail-on none
```

Expected: no Power Totem RLS initplan warnings. `auth_leaked_password_protection` may remain until enabled in Dashboard.

- [ ] **Step 4: Confirm remote API health**

```powershell
Invoke-WebRequest -UseBasicParsing -Uri "https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api/v1/health" | Select-Object -ExpandProperty Content
```

Expected:

```json
{"api":"ok","db":"ok","workers":"ok","stellar":"ok","mcp":"degraded","mcp_reason":"optional_console_not_required_for_power_totem","version":"kivo-edge-transition-2026-05-17"}
```

- [ ] **Step 5: Commit verification-only doc updates if any**

```bash
git add apps/kivo/DELIVERY.md apps/kivo/POWER_TOTEM_DEMO.md
git commit -m "docs: finalize kivo delivery readiness"
```

---

## Dashboard-Only Action

Supabase Auth leaked password protection cannot be fixed from this codebase reliably. Enable it in the Supabase Dashboard for project `ftjzxwlbgvghvzoztdik`:

- Authentication
- Password Security
- Enable leaked password protection

After enabling, run:

```bash
supabase db advisors --linked --workdir . -o json --fail-on none
```

Expected: `auth_leaked_password_protection` warning is gone.

---

## Definition Of Done

- Kivo web tests and build pass.
- Kivo gateway tests and build pass.
- Kivo SDK tests and build pass.
- Remote preflight passes without local `.env` false negatives.
- Supabase Edge Function health is honest about MCP state.
- Only Power Totem is presented as functional.
- One real remote Power Totem session exists with authorization and gateway events in Supabase.
- Supabase advisors have no Kivo Power Totem RLS performance warnings.
- Delivery docs show exact evidence and demo path.
