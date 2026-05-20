# Kivo Backend Real Product Readiness Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Kivo from a polished front with partial backend into a real, testable product flow with no fake success states.

**Architecture:** Keep Supabase as the MVP backend: Auth, Postgres, RLS, Edge Function `kivo-api`, and server-side Etherfuse/Stellar calls. The React app must call only `KivoApiClient`; screens that cannot prove a real backend state must show empty, pending, or configuration-required states.

**Tech Stack:** React + Vite + TypeScript, Supabase Edge Functions on Deno, Supabase Postgres/RLS, Stellar SDK, Etherfuse Devnet, Kivo SDK/Gateway TypeScript packages.

---

### Task 1: Gateway Backend Contract

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.test.ts`
- Modify: `apps/kivo/web/src/pages/GatewayPage.tsx`

- [x] **Step 1: Add `GET /v1/gateways` to the Edge Function**

Return gateways owned by the authenticated Supabase user from `public.kivo_gateways`, without exposing raw tokens.

- [x] **Step 2: Add `listGateways()` to `KivoApiClient`**

The front must call `/v1/gateways` through the same HTTP client used by the rest of Kivo.

- [x] **Step 3: Replace static Gateway page content with real backend state**

Show real gateway count, online count, linked Power Totems, pending authorizations, error states, and empty state.

- [x] **Step 4: Verify**

Run:

```powershell
npm --prefix apps/kivo/web run lint
npm --prefix apps/kivo/web test -- --run
npm --prefix apps/kivo/web run build
deno test --allow-env --allow-net
```

Expected: all pass.

---

### Task 2: Remove Local Runtime Simulation

**Files:**
- Modify: `apps/kivo/web/src/pages/TotemSimulatorPage.tsx`

- [x] **Step 1: Remove local authorization fallback**

The runtime web must not unlock itself when `gatewayId` or `gatewayToken` is empty.

- [x] **Step 2: Use real Gateway events**

Buttons must send `session.started` and `session.completed` to `/v1/gateways/:id/events`.

- [x] **Step 3: Verify in browser**

Open `/gateway` and `/totem-simulator`. Expected: no text like `modo local`, `Fallback local`, or fake local authorization.

---

### Task 3: Persist Studio Intents And Flows

**Files:**
- Create migration: `supabase migration new create_kivo_studio_flows`
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `supabase/functions/kivo-api/studioDomain.ts`
- Modify: `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
- Test: `supabase/functions/kivo-api/studioDomain_test.ts`

- [ ] **Step 1: Add tables**

Create `public.kivo_studio_intents`, `public.kivo_studio_flows`, and `public.kivo_studio_validation_runs` with `owner_id`, timestamps, status, and JSON evidence fields.

- [ ] **Step 2: Persist `POST /v1/studio/intents` and `POST /v1/studio/flows`**

Return database rows instead of generated ephemeral objects.

- [ ] **Step 3: Add `GET /v1/studio/flows/:id`**

The front must be able to reload a flow and continue validation after refresh.

- [ ] **Step 4: Verify**

Create a flow, refresh the page, and confirm the flow can still be validated.

---

### Task 4: Make Validation Evidence Real

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/web/src/pages/ValidationPage.tsx`

- [ ] **Step 1: Validation must read real backend state**

For a flow, check linked Power Totem, Gateway heartbeat, x402 rule, Etherfuse config, and latest paid session.

- [ ] **Step 2: Store validation runs**

Persist every validation attempt and its step evidence.

- [ ] **Step 3: Only return `passed` when all required evidence exists**

No generated success states.

---

### Task 5: Replace Totem Display Demo With Real Checkout

**Files:**
- Modify: `apps/kivo/web/src/pages/TotemDisplayPage.tsx`
- Modify: `supabase/functions/kivo-api/index.ts`

- [ ] **Step 1: Remove `Alternar estado demo`**

The display must only change state from backend session/payment status.

- [ ] **Step 2: Add public checkout/session endpoint**

The display QR should point to a real checkout URL for the current Power Totem resource.

- [ ] **Step 3: Verify**

Open display URL, start checkout, pay x402, then confirm display changes after backend authorization.

---

### Task 6: Close SDK/API Key Auth

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/sdk/src/client.ts`
- Modify: `apps/kivo/gateway/src/client.ts`

- [ ] **Step 1: Accept scoped Kivo API keys**

Hash incoming `Authorization: Bearer kivo_*` and authorize against `public.kivo_api_keys`.

- [ ] **Step 2: Enforce scopes**

Examples: `gateways:read`, `gateways:write`, `sessions:complete`, `x402:pay`.

- [ ] **Step 3: Verify SDK and Gateway package against Edge Function**

Run package tests and a live smoke against Devnet.

---

### Task 7: Etherfuse And x402 Evidence Linking

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `supabase/migrations/*`
- Modify: `apps/kivo/web/src/pages/CheckoutPage.tsx`

- [ ] **Step 1: Link Etherfuse orders to x402 sessions**

Store provider order IDs and webhook events against the related Power Session/payment.

- [ ] **Step 2: Harden webhook replay/idempotency**

Keep provider event unique IDs and reject invalid signatures.

- [ ] **Step 3: Verify**

Create quote/order, receive webhook, pay x402, and see a single payment/session trail.

---

### Task 8: Product Health And Status

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/web/src/pages/StatusPage.tsx`

- [ ] **Step 1: Make `/v1/health` read real DB/service checks**

Return degraded if Supabase REST, Stellar Horizon, Etherfuse, or Gateway heartbeat is failing.

- [ ] **Step 2: Add public `/health` behavior**

The page must be usable by a real customer/operator without seeing internal sandbox labels.

---

### Task 9: Live Smoke Script

**Files:**
- Create: `apps/kivo/scripts/smoke-live.ps1`

- [ ] **Step 1: Script the happy path**

Login token input, create Power Totem, create Gateway token, heartbeat, create session, start checkout, pay x402 with provided XDR, authorize, start, complete.

- [ ] **Step 2: Script failure cases**

Missing token, invalid gateway token, stale nonce, invalid XDR, missing Etherfuse key.

---

### Current Remote Backend Notes

- `kivo-api` Edge Function was deployed to the active Supabase project.
- The remote database was missing `public.kivo_gateways`, so `20260518170000_create_kivo_power_totem.sql` was applied directly with `supabase db query --linked -f`.
- PostgREST schema was reloaded with `notify pgrst, 'reload schema';`.
- The linked project's migration history is divergent from the local branch; avoid `supabase db push` until migration history is reconciled or pulled.
