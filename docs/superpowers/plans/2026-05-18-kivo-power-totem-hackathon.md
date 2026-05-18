# Kivo Power Totem Hackathon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the hackathon-ready Kivo Power Totem path: one functional template that pairs a Raspberry gateway, charges through x402/Stellar/Etherfuse, authorizes a physical output, and shows operator health/session state.

**Architecture:** The Supabase Edge Function remains the Kivo API and owns flows, gateways, sessions, x402 challenges, settlement validation, and authorization state. The web app becomes the Studio surface for creating and testing the Power Totem. A new local gateway/SDK package runs on Raspberry or simulator mode and talks to the API without exposing secrets to the browser.

**Tech Stack:** Supabase Postgres migrations, Supabase Edge Functions with Deno/TypeScript, React + Vite + TypeScript + Tailwind, Vitest, Deno tests, Node TypeScript gateway package, Raspberry GPIO adapter abstraction.

---

## Scope Check

This spec spans three subsystems: API/database, Gateway/SDK, and Studio UI. Keep it as one delivery plan because the hackathon demo requires all three, but execute it as small commits. Each task below leaves the repo in a testable state and has a narrow owner.

Do not resurrect the old Go backend or Fly.io runtime. Do not build the full Tauri Studio during the hackathon. The web Studio is the product surface for now.

## Current Constraints

- The working tree may contain unrelated Kivo UI edits and generated demo assets. Before execution, run `git status --short` and only stage files owned by the current task.
- The current API runtime is `supabase/functions/kivo-api/index.ts`.
- The current web app is `apps/kivo/web`.
- The current visible product still has generic flow/template concepts. Power Totem must become the only functional template in normal product mode.
- Service-role and gateway secrets must never be exposed to browser code.

## Target File Structure

### Database

- Create `supabase/migrations/20260518_create_kivo_power_totem.sql`
  - Adds `kivo_power_totems`, `kivo_gateways`, `kivo_power_sessions`, and `kivo_gateway_events`.
  - Enables RLS and authenticated owner policies.
  - Adds indexes for owner, gateway, session status, and pairing token hash.

### Edge API

- Modify `supabase/functions/kivo-api/index.ts`
  - Adds DB row interfaces and mapping helpers.
  - Adds gateway-token auth for gateway routes.
  - Adds `/v1/power-totems`, `/v1/power-totems/:id`, `/v1/power-totems/:id/pairing-token`.
  - Adds `/v1/gateways/:id/heartbeat`, `/v1/gateways/:id/authorization`, `/v1/gateways/:id/events`.
  - Adds `/v1/power-sessions`, `/v1/power-sessions/:id`, `/v1/power-sessions/:id/start-checkout`, `/v1/power-sessions/:id/authorize`, `/v1/power-sessions/:id/complete`.
  - Adds `/power-totem/:totemId/session` as a protected resource path backed by x402.
- Create `supabase/functions/kivo-api/powerTotemDomain.ts`
  - Pure functions for status transitions, pairing-token hashing inputs, resource path generation, and session duration validation.
- Create `supabase/functions/kivo-api/powerTotemDomain_test.ts`
  - Deno tests for pure domain rules.

### Web Types and Client

- Modify `apps/kivo/web/src/types/kivo.ts`
  - Adds `PowerTotem`, `Gateway`, `PowerSession`, `GatewayEvent`, and request/response types.
- Modify `apps/kivo/web/src/services/kivoClient.ts`
  - Adds Kivo client methods for Power Totem, Gateway pairing, sessions, and authorization testing.
- Modify `apps/kivo/web/src/services/kivoClient.test.ts`
  - Adds URL/body tests for the new client methods.

### Studio UI

- Create `apps/kivo/web/src/data/powerTotemExperience.ts`
  - Copy and feature flags for Power Totem, Studio, x402, Etherfuse, and future roadmap.
- Create `apps/kivo/web/src/data/powerTotemExperience.test.ts`
  - Tests that only Power Totem is functional and future templates are roadmap.
- Create `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
  - Main Studio page: create/configure/pair/test/publish.
- Create `apps/kivo/web/src/pages/PowerTotemDetailPage.tsx`
  - Detail page: session history, gateway state, QR/checkout state, and settlement context.
- Create `apps/kivo/web/src/pages/TotemDisplayPage.tsx`
  - Browser-based totem screen for Meet fallback and Raspberry kiosk browser.
- Create `apps/kivo/web/src/pages/TotemSimulatorPage.tsx`
  - Simulator of gateway state changes without physical hardware.
- Modify `apps/kivo/web/src/App.tsx`
  - Adds `/studio`, `/totems/:id`, `/totem/:id/display`, `/totem-simulator`.
  - Keeps old generic template routes dev-only.
- Modify `apps/kivo/web/src/layouts/Sidebar.tsx`, `apps/kivo/web/src/layouts/BottomNav.tsx`, `apps/kivo/web/src/layouts/Topbar.tsx`, and `apps/kivo/web/src/components/CommandPalette.tsx`
  - Makes Studio, Power Totem, Checkout, Finance, Health, and Status the normal-mode navigation.

### Gateway/SDK

- Create `apps/kivo/gateway/package.json`
  - Standalone TypeScript package for the Raspberry gateway.
- Create `apps/kivo/gateway/tsconfig.json`
  - Strict TypeScript config.
- Create `apps/kivo/gateway/src/types.ts`
  - Gateway config, authorization, event, and adapter types.
- Create `apps/kivo/gateway/src/client.ts`
  - Kivo API client for gateway token auth.
- Create `apps/kivo/gateway/src/adapters/simulator.ts`
  - Safe adapter for demos without GPIO.
- Create `apps/kivo/gateway/src/adapters/raspberry.ts`
  - Raspberry adapter shell that can call a configured command for GPIO switching.
- Create `apps/kivo/gateway/src/runner.ts`
  - Polls authorization, actuates adapter, reports events.
- Create `apps/kivo/gateway/src/cli.ts`
  - CLI entry point for `start` and `once`.
- Create `apps/kivo/gateway/src/*.test.ts`
  - Unit tests for client request shape, simulator state, and runner event order.
- Create `apps/kivo/gateway/README.md`
  - Raspberry setup, simulator mode, env vars, and demo commands.

### Docs and Scripts

- Modify `apps/kivo/README.md`
  - Adds Power Totem as hackathon path.
- Modify `apps/kivo/DELIVERY.md`
  - Adds Power Totem go/no-go checklist.
- Modify `apps/kivo/scripts/preflight.ps1`
  - Adds checks for Power Totem endpoints.

---

## Task 1: Database Schema for Power Totem

**Files:**
- Create: `supabase/migrations/20260518_create_kivo_power_totem.sql`

- [ ] **Step 1: Write the migration**

Create `supabase/migrations/20260518_create_kivo_power_totem.sql` with this content:

```sql
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
  updated_at timestamptz not null default now()
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
  updated_at timestamptz not null default now()
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

create table if not exists public.kivo_gateway_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  gateway_id uuid references public.kivo_gateways(id) on delete set null,
  totem_id uuid references public.kivo_power_totems(id) on delete set null,
  session_id uuid references public.kivo_power_sessions(id) on delete set null,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists kivo_gateway_events_owner_created_idx
  on public.kivo_gateway_events (owner_id, created_at desc);
create index if not exists kivo_gateway_events_gateway_created_idx
  on public.kivo_gateway_events (gateway_id, created_at desc);
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
```

- [ ] **Step 2: Apply locally or validate SQL shape**

Run:

```powershell
supabase db reset --workdir .
```

Expected if local Supabase is running: migration completes and the four tables exist.

If local Supabase is not running, run a syntax-oriented review:

```powershell
rg "kivo_power_totems|kivo_gateways|kivo_power_sessions|kivo_gateway_events" supabase/migrations/20260518_create_kivo_power_totem.sql
```

Expected: all four table names appear in create, RLS, policy, grant, and index sections.

- [ ] **Step 3: Commit**

```powershell
git add supabase/migrations/20260518_create_kivo_power_totem.sql
git commit -m "feat(kivo): add power totem schema"
```

---

## Task 2: Power Totem Domain Rules

**Files:**
- Create: `supabase/functions/kivo-api/powerTotemDomain.ts`
- Create: `supabase/functions/kivo-api/powerTotemDomain_test.ts`

- [ ] **Step 1: Write failing domain tests**

Create `supabase/functions/kivo-api/powerTotemDomain_test.ts`:

```ts
import { assertEquals, assertRejects } from "@std/assert";
import {
  buildPowerTotemResource,
  ensureValidDuration,
  nextSessionStatus,
  sanitizeQrSlug,
} from "./powerTotemDomain.ts";

Deno.test("buildPowerTotemResource produces the protected x402 resource path", () => {
  assertEquals(
    buildPowerTotemResource("totem_rj_01"),
    "/power-totem/totem_rj_01/session",
  );
});

Deno.test("sanitizeQrSlug creates a stable slug for a totem name", () => {
  assertEquals(sanitizeQrSlug("Kivo Power Totem RJ 01"), "kivo-power-totem-rj-01");
  assertEquals(sanitizeQrSlug("  Mesa VIP  "), "mesa-vip");
});

Deno.test("ensureValidDuration accepts the demo-safe range", () => {
  assertEquals(ensureValidDuration(30), 30);
  assertEquals(ensureValidDuration(3600), 3600);
});

Deno.test("ensureValidDuration rejects unsafe durations", async () => {
  await assertRejects(
    () => Promise.resolve(ensureValidDuration(4)),
    Error,
    "Session duration must be between 5 and 3600 seconds.",
  );
});

Deno.test("nextSessionStatus allows paid to authorized", () => {
  assertEquals(nextSessionStatus("paid", "authorize"), "authorized");
});

Deno.test("nextSessionStatus rejects running without authorization", async () => {
  await assertRejects(
    () => Promise.resolve(nextSessionStatus("paid", "start")),
    Error,
    "Cannot apply action start to session status paid.",
  );
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
deno test --allow-env --allow-read --allow-net supabase/functions/kivo-api/powerTotemDomain_test.ts
```

Expected: FAIL because `powerTotemDomain.ts` does not exist.

- [ ] **Step 3: Add pure domain implementation**

Create `supabase/functions/kivo-api/powerTotemDomain.ts`:

```ts
export type PowerSessionStatus =
  | "requested"
  | "payment_required"
  | "paid"
  | "authorized"
  | "running"
  | "completed"
  | "expired"
  | "failed";

export type PowerSessionAction =
  | "require_payment"
  | "mark_paid"
  | "authorize"
  | "start"
  | "complete"
  | "expire"
  | "fail";

const transitions: Record<PowerSessionStatus, Partial<Record<PowerSessionAction, PowerSessionStatus>>> = {
  requested: { require_payment: "payment_required", fail: "failed", expire: "expired" },
  payment_required: { mark_paid: "paid", fail: "failed", expire: "expired" },
  paid: { authorize: "authorized", fail: "failed", expire: "expired" },
  authorized: { start: "running", fail: "failed", expire: "expired" },
  running: { complete: "completed", fail: "failed" },
  completed: {},
  expired: {},
  failed: {},
};

export function sanitizeQrSlug(input: string): string {
  const slug = input
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "power-totem";
}

export function buildPowerTotemResource(totemIdOrSlug: string): string {
  const value = totemIdOrSlug.trim();
  if (!value) {
    throw new Error("Power Totem identifier is required.");
  }
  return `/power-totem/${encodeURIComponent(value)}/session`;
}

export function ensureValidDuration(durationSeconds: number): number {
  if (!Number.isInteger(durationSeconds) || durationSeconds < 5 || durationSeconds > 3600) {
    throw new Error("Session duration must be between 5 and 3600 seconds.");
  }
  return durationSeconds;
}

export function nextSessionStatus(current: PowerSessionStatus, action: PowerSessionAction): PowerSessionStatus {
  const next = transitions[current][action];
  if (!next) {
    throw new Error(`Cannot apply action ${action} to session status ${current}.`);
  }
  return next;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run:

```powershell
deno test --allow-env --allow-read --allow-net supabase/functions/kivo-api/powerTotemDomain_test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add supabase/functions/kivo-api/powerTotemDomain.ts supabase/functions/kivo-api/powerTotemDomain_test.ts
git commit -m "feat(kivo): add power totem domain rules"
```

---

## Task 3: Edge API Routes for Totems, Gateways, and Sessions

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Test: `supabase/functions/kivo-api/powerTotemDomain_test.ts`

- [ ] **Step 1: Add DB interfaces and imports**

Modify the top of `supabase/functions/kivo-api/index.ts`:

```ts
import {
  buildPowerTotemResource,
  ensureValidDuration,
  nextSessionStatus,
  sanitizeQrSlug,
  type PowerSessionStatus,
} from "./powerTotemDomain.ts";
```

Add interfaces near the existing `DbApiKey` interface:

```ts
interface DbPowerTotem {
  id: string;
  owner_id: string;
  name: string;
  resource: string;
  price: string | number;
  unit: string;
  session_duration_seconds: number;
  status: string;
  qr_slug: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface DbGateway {
  id: string;
  owner_id: string;
  totem_id?: string | null;
  name: string;
  token_hash: string;
  token_preview: string;
  pairing_token_hash?: string | null;
  pairing_token_preview?: string | null;
  status: string;
  adapter: string;
  last_seen_at?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface DbPowerSession {
  id: string;
  owner_id: string;
  totem_id: string;
  gateway_id?: string | null;
  payment_id?: string | null;
  x402_nonce?: string | null;
  resource: string;
  amount: string | number;
  asset: string;
  duration_seconds: number;
  status: PowerSessionStatus;
  authorization_token_hash?: string | null;
  authorization_token_preview?: string | null;
  authorized_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  expires_at: string;
  failure_reason?: string | null;
  events: Array<Record<string, unknown>>;
  created_at: string;
  updated_at: string;
}

interface DbGatewayEvent {
  id: string;
  owner_id: string;
  gateway_id?: string | null;
  totem_id?: string | null;
  session_id?: string | null;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
```

- [ ] **Step 2: Add mapping helpers**

Add these helpers near the existing `toApiKey` helper:

```ts
const toPowerTotem = (row: DbPowerTotem) => ({
  id: row.id,
  name: row.name,
  resource: row.resource,
  price: String(row.price),
  unit: row.unit,
  sessionDurationSeconds: row.session_duration_seconds,
  status: row.status,
  qrSlug: row.qr_slug,
  metadata: row.metadata ?? {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toGateway = (row: DbGateway) => ({
  id: row.id,
  totemId: row.totem_id ?? "",
  name: row.name,
  tokenPreview: row.token_preview,
  pairingTokenPreview: row.pairing_token_preview ?? "",
  status: row.status,
  adapter: row.adapter,
  lastSeenAt: row.last_seen_at ?? undefined,
  metadata: row.metadata ?? {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toPowerSession = (row: DbPowerSession) => ({
  id: row.id,
  totemId: row.totem_id,
  gatewayId: row.gateway_id ?? "",
  paymentId: row.payment_id ?? "",
  x402Nonce: row.x402_nonce ?? "",
  resource: row.resource,
  amount: String(row.amount),
  asset: row.asset,
  durationSeconds: row.duration_seconds,
  status: row.status,
  authorizationTokenPreview: row.authorization_token_preview ?? "",
  authorizedAt: row.authorized_at ?? undefined,
  startedAt: row.started_at ?? undefined,
  completedAt: row.completed_at ?? undefined,
  expiresAt: row.expires_at,
  failureReason: row.failure_reason ?? undefined,
  events: row.events ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toGatewayEvent = (row: DbGatewayEvent) => ({
  id: row.id,
  gatewayId: row.gateway_id ?? "",
  totemId: row.totem_id ?? "",
  sessionId: row.session_id ?? "",
  eventType: row.event_type,
  payload: row.payload ?? {},
  createdAt: row.created_at,
});
```

- [ ] **Step 3: Add gateway auth helper**

Add this helper near `requireUser`:

```ts
const requireGateway = async (req: Request) => {
  const rawToken = req.headers.get("x-gateway-token") ?? "";
  if (!rawToken.trim()) {
    throwApiError(401, "gateway_token_required", "Gateway token is required.");
  }
  const tokenHash = await sha256Hex(rawToken.trim());
  const rows = await selectRows<DbGateway>("kivo_gateways", {
    select: "*",
    token_hash: `eq.${tokenHash}`,
    limit: 1,
  });
  if (!rows[0]) {
    throwApiError(401, "gateway_unauthorized", "Gateway token is invalid.");
  }
  return rows[0];
};
```

- [ ] **Step 4: Add totem handler skeleton**

Add `handlePowerTotems` before `Deno.serve`:

```ts
const listPowerTotemsForUser = async (ownerId: string) =>
  (await selectRows<DbPowerTotem>("kivo_power_totems", {
    select: "*",
    owner_id: `eq.${ownerId}`,
    order: "created_at.desc",
  })).map(toPowerTotem);

const handlePowerTotems = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const detail = path.match(/^\/v1\/power-totems\/([^/]+)$/);
  const pairing = path.match(/^\/v1\/power-totems\/([^/]+)\/pairing-token$/);

  if (path === "/v1/power-totems" && req.method === "GET") {
    return json(req, 200, await listPowerTotemsForUser(user.id));
  }

  if (path === "/v1/power-totems" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      name?: string;
      price?: string;
      unit?: string;
      sessionDurationSeconds?: number;
    };
    if (!input.name?.trim()) {
      return apiError(req, 400, "invalid_totem", "Power Totem name is required.");
    }
    const duration = ensureValidDuration(input.sessionDurationSeconds ?? 30);
    const qrSlug = sanitizeQrSlug(input.name);
    const resource = buildPowerTotemResource(qrSlug);
    const row = await insertRow<DbPowerTotem>("kivo_power_totems", {
      owner_id: user.id,
      name: input.name.trim(),
      resource,
      price: input.price ?? "0.1000000",
      unit: input.unit ?? "session",
      session_duration_seconds: duration,
      status: "pairing",
      qr_slug: qrSlug,
      metadata: {},
    });
    await insertRow<DbPricingRule>("kivo_x402_pricing_rules", {
      owner_id: user.id,
      resource,
      amount: input.price ?? "0.1000000",
      asset: env("KIVO_DEFAULT_USDC_ASSET", env("USDC_ISSUER") ? `USDC:${env("USDC_ISSUER")}` : "XLM"),
      max_timeout: 300,
      enabled: true,
      description: `Power Totem: ${input.name.trim()}`,
    });
    return json(req, 201, toPowerTotem(row));
  }

  if (detail && req.method === "GET") {
    const rows = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!rows[0]) {
      return apiError(req, 404, "totem_not_found", "Power Totem not found.");
    }
    return json(req, 200, toPowerTotem(rows[0]));
  }

  if (pairing && req.method === "POST") {
    const totems = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${pairing[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!totems[0]) {
      return apiError(req, 404, "totem_not_found", "Power Totem not found.");
    }
    const rawGatewayToken = randomToken("kivo_gateway_");
    const rawPairingToken = randomToken("kivo_pair_");
    const gateway = await insertRow<DbGateway>("kivo_gateways", {
      owner_id: user.id,
      totem_id: totems[0].id,
      name: `${totems[0].name} Gateway`,
      token_hash: await sha256Hex(rawGatewayToken),
      token_preview: secretPreview(rawGatewayToken),
      pairing_token_hash: await sha256Hex(rawPairingToken),
      pairing_token_preview: secretPreview(rawPairingToken),
      status: "pairing",
      adapter: "simulator",
      metadata: {},
    });
    return json(req, 201, {
      gateway: toGateway(gateway),
      gatewayToken: rawGatewayToken,
      pairingToken: rawPairingToken,
    });
  }

  return apiError(req, 404, "not_found", "Power Totem route not found.");
};
```

- [ ] **Step 5: Add gateway and session handlers**

Add minimal handlers before `Deno.serve`:

```ts
const handleGateways = async (req: Request, path: string) => {
  const heartbeat = path.match(/^\/v1\/gateways\/([^/]+)\/heartbeat$/);
  const authorization = path.match(/^\/v1\/gateways\/([^/]+)\/authorization$/);
  const events = path.match(/^\/v1\/gateways\/([^/]+)\/events$/);

  if (heartbeat && req.method === "POST") {
    const gateway = await requireGateway(req);
    if (gateway.id !== heartbeat[1]) {
      return apiError(req, 403, "gateway_mismatch", "Gateway token does not match route.");
    }
    const rows = await patchRows<DbGateway>("kivo_gateways", { id: `eq.${gateway.id}` }, {
      status: "online",
      last_seen_at: new Date().toISOString(),
    });
    return json(req, 200, toGateway(rows[0]));
  }

  if (authorization && req.method === "GET") {
    const gateway = await requireGateway(req);
    if (gateway.id !== authorization[1]) {
      return apiError(req, 403, "gateway_mismatch", "Gateway token does not match route.");
    }
    const sessions = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      gateway_id: `eq.${gateway.id}`,
      status: "eq.authorized",
      order: "authorized_at.asc",
      limit: 1,
    });
    return json(req, 200, { authorization: sessions[0] ? toPowerSession(sessions[0]) : null });
  }

  if (events && req.method === "POST") {
    const gateway = await requireGateway(req);
    if (gateway.id !== events[1]) {
      return apiError(req, 403, "gateway_mismatch", "Gateway token does not match route.");
    }
    const input = await req.json().catch(() => ({})) as {
      sessionId?: string;
      eventType?: string;
      payload?: Record<string, unknown>;
    };
    const row = await insertRow<DbGatewayEvent>("kivo_gateway_events", {
      owner_id: gateway.owner_id,
      gateway_id: gateway.id,
      totem_id: gateway.totem_id,
      session_id: input.sessionId || null,
      event_type: input.eventType || "gateway.event",
      payload: input.payload ?? {},
    });
    return json(req, 201, toGatewayEvent(row));
  }

  return apiError(req, 404, "not_found", "Gateway route not found.");
};

const handlePowerSessions = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const authorize = path.match(/^\/v1\/power-sessions\/([^/]+)\/authorize$/);
  const complete = path.match(/^\/v1\/power-sessions\/([^/]+)\/complete$/);

  if (path === "/v1/power-sessions" && req.method === "GET") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      owner_id: `eq.${user.id}`,
      order: "created_at.desc",
    });
    return json(req, 200, rows.map(toPowerSession));
  }

  if (path === "/v1/power-sessions" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as { totemId?: string };
    const totems = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${input.totemId ?? ""}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!totems[0]) {
      return apiError(req, 404, "totem_not_found", "Power Totem not found.");
    }
    const gateways = await selectRows<DbGateway>("kivo_gateways", {
      select: "*",
      totem_id: `eq.${totems[0].id}`,
      order: "created_at.desc",
      limit: 1,
    });
    const row = await insertRow<DbPowerSession>("kivo_power_sessions", {
      owner_id: user.id,
      totem_id: totems[0].id,
      gateway_id: gateways[0]?.id ?? null,
      resource: totems[0].resource,
      amount: totems[0].price,
      asset: env("KIVO_DEFAULT_USDC_ASSET", env("USDC_ISSUER") ? `USDC:${env("USDC_ISSUER")}` : "XLM"),
      duration_seconds: totems[0].session_duration_seconds,
      status: "requested",
      expires_at: new Date(Date.now() + 10 * 60_000).toISOString(),
      events: [paymentEvent("Session requested", "Power Totem session was created.", "done")],
    });
    return json(req, 201, toPowerSession(row));
  }

  if (authorize && req.method === "POST") {
    const rows = await patchRows<DbPowerSession>("kivo_power_sessions", {
      id: `eq.${authorize[1]}`,
      owner_id: `eq.${user.id}`,
      status: "eq.paid",
    }, {
      status: nextSessionStatus("paid", "authorize"),
      authorized_at: new Date().toISOString(),
      authorization_token_preview: "auth_ready",
    });
    if (!rows[0]) {
      return apiError(req, 404, "session_not_ready", "Paid Power Totem session not found.");
    }
    return json(req, 200, toPowerSession(rows[0]));
  }

  if (complete && req.method === "POST") {
    const rows = await patchRows<DbPowerSession>("kivo_power_sessions", {
      id: `eq.${complete[1]}`,
      owner_id: `eq.${user.id}`,
    }, {
      status: "completed",
      completed_at: new Date().toISOString(),
    });
    if (!rows[0]) {
      return apiError(req, 404, "session_not_found", "Power Totem session not found.");
    }
    return json(req, 200, toPowerSession(rows[0]));
  }

  return apiError(req, 404, "not_found", "Power session route not found.");
};
```

- [ ] **Step 6: Wire routes in `Deno.serve`**

Add these branches before the x402 branch:

```ts
    if (path === "/v1/power-totems" || path.startsWith("/v1/power-totems/")) {
      return await handlePowerTotems(req, path);
    }
    if (path === "/v1/power-sessions" || path.startsWith("/v1/power-sessions/")) {
      return await handlePowerSessions(req, path);
    }
    if (path.startsWith("/v1/gateways/")) {
      return await handleGateways(req, path);
    }
```

Add `/power-totem/` to protected resources:

```ts
      path.startsWith("/api/") || path.startsWith("/devices/") ||
      path.startsWith("/data/") || path.startsWith("/power-totem/")
```

- [ ] **Step 7: Run API tests**

Run:

```powershell
deno test --allow-env --allow-read --allow-net supabase/functions/kivo-api
```

Expected: existing settlement tests and new domain tests pass.

- [ ] **Step 8: Commit**

```powershell
git add supabase/functions/kivo-api/index.ts supabase/functions/kivo-api/powerTotemDomain.ts supabase/functions/kivo-api/powerTotemDomain_test.ts
git commit -m "feat(kivo): add power totem edge routes"
```

---

## Task 4: Web Types and Kivo Client Methods

**Files:**
- Modify: `apps/kivo/web/src/types/kivo.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.test.ts`

- [ ] **Step 1: Add client tests first**

Append to `apps/kivo/web/src/services/kivoClient.test.ts` inside the `describe` block:

```ts
  it('creates Power Totems through the Kivo API', async () => {
    let requestedUrl = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input, init) => {
        requestedUrl = String(input);
        body = String(init?.body);
        return jsonResponse({
          id: 'totem_1',
          name: 'Power Totem RJ',
          resource: '/power-totem/power-totem-rj/session',
          price: '0.1000000',
          unit: 'session',
          sessionDurationSeconds: 30,
          status: 'pairing',
          qrSlug: 'power-totem-rj',
          metadata: {},
          createdAt: '2026-05-18T12:00:00Z',
          updatedAt: '2026-05-18T12:00:00Z',
        });
      },
    });

    const totem = await client.createPowerTotem({
      name: 'Power Totem RJ',
      price: '0.1000000',
      unit: 'session',
      sessionDurationSeconds: 30,
    });

    expect(requestedUrl).toBe('https://api.kivo.example/v1/power-totems');
    expect(JSON.parse(body)).toEqual({
      name: 'Power Totem RJ',
      price: '0.1000000',
      unit: 'session',
      sessionDurationSeconds: 30,
    });
    expect(totem.resource).toBe('/power-totem/power-totem-rj/session');
  });

  it('creates Power Totem pairing tokens without exposing service secrets', async () => {
    let requestedUrl = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input, init) => {
        requestedUrl = String(input);
        expect(init?.method).toBe('POST');
        return jsonResponse({
          gateway: {
            id: 'gw_1',
            totemId: 'totem_1',
            name: 'Power Totem RJ Gateway',
            tokenPreview: 'kivo...abcd',
            pairingTokenPreview: 'kivo...pair',
            status: 'pairing',
            adapter: 'simulator',
            metadata: {},
            createdAt: '2026-05-18T12:00:00Z',
            updatedAt: '2026-05-18T12:00:00Z',
          },
          gatewayToken: 'kivo_gateway_secret',
          pairingToken: 'kivo_pair_secret',
        });
      },
    });

    const result = await client.createPowerTotemPairingToken('totem_1');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/power-totems/totem_1/pairing-token');
    expect(result.gatewayToken).toBe('kivo_gateway_secret');
  });
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
cd apps/kivo/web
npx vitest run src/services/kivoClient.test.ts --reporter=default --pool=forks
```

Expected: FAIL because `createPowerTotem` and `createPowerTotemPairingToken` do not exist.

- [ ] **Step 3: Add types**

Append to `apps/kivo/web/src/types/kivo.ts`:

```ts
export type PowerTotemStatus = 'draft' | 'pairing' | 'testing' | 'active' | 'paused' | 'failed';
export type GatewayStatus = 'pairing' | 'online' | 'offline' | 'suspended';
export type GatewayAdapter = 'simulator' | 'raspberry';
export type PowerSessionStatus =
  | 'requested'
  | 'payment_required'
  | 'paid'
  | 'authorized'
  | 'running'
  | 'completed'
  | 'expired'
  | 'failed';

export interface PowerTotem {
  id: string;
  name: string;
  resource: string;
  price: string;
  unit: 'session' | 'minute' | 'kWh';
  sessionDurationSeconds: number;
  status: PowerTotemStatus;
  qrSlug: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePowerTotemInput {
  name: string;
  price: string;
  unit: PowerTotem['unit'];
  sessionDurationSeconds: number;
}

export interface Gateway {
  id: string;
  totemId: string;
  name: string;
  tokenPreview: string;
  pairingTokenPreview: string;
  status: GatewayStatus;
  adapter: GatewayAdapter;
  lastSeenAt?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayPairingResult {
  gateway: Gateway;
  gatewayToken?: string;
  pairingToken?: string;
}

export interface PowerSession {
  id: string;
  totemId: string;
  gatewayId: string;
  paymentId: string;
  x402Nonce: string;
  resource: string;
  amount: string;
  asset: string;
  durationSeconds: number;
  status: PowerSessionStatus;
  authorizationTokenPreview: string;
  authorizedAt?: string;
  startedAt?: string;
  completedAt?: string;
  expiresAt: string;
  failureReason?: string;
  events: Array<Record<string, unknown>>;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayEvent {
  id: string;
  gatewayId: string;
  totemId: string;
  sessionId: string;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}
```

- [ ] **Step 4: Add client interface methods**

Modify imports in `apps/kivo/web/src/services/kivoClient.ts` to include the new types:

```ts
  CreatePowerTotemInput,
  Gateway,
  GatewayEvent,
  GatewayPairingResult,
  PowerSession,
  PowerTotem,
```

Add to `KivoApiClient`:

```ts
  listPowerTotems(): Promise<PowerTotem[]>;
  createPowerTotem(input: CreatePowerTotemInput): Promise<PowerTotem>;
  getPowerTotem(id: string): Promise<PowerTotem>;
  createPowerTotemPairingToken(totemId: string): Promise<GatewayPairingResult>;
  listPowerSessions(): Promise<PowerSession[]>;
  createPowerSession(totemId: string): Promise<PowerSession>;
  authorizePowerSession(sessionId: string): Promise<PowerSession>;
  completePowerSession(sessionId: string): Promise<PowerSession>;
  sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<Gateway>;
  getGatewayAuthorization(gatewayId: string, gatewayToken: string): Promise<{ authorization: PowerSession | null }>;
  createGatewayEvent(gatewayId: string, gatewayToken: string, input: { sessionId?: string; eventType: string; payload: Record<string, unknown> }): Promise<GatewayEvent>;
```

- [ ] **Step 5: Add HTTP client methods**

Add methods to `HttpKivoApiClient` before `getEtherfuseStatus`:

```ts
  async listPowerTotems(): Promise<PowerTotem[]> {
    return this.request('/v1/power-totems');
  }

  async createPowerTotem(input: CreatePowerTotemInput): Promise<PowerTotem> {
    return this.request('/v1/power-totems', { method: 'POST', body: JSON.stringify(input) });
  }

  async getPowerTotem(id: string): Promise<PowerTotem> {
    return this.request(`/v1/power-totems/${encodeURIComponent(id)}`);
  }

  async createPowerTotemPairingToken(totemId: string): Promise<GatewayPairingResult> {
    return this.request(`/v1/power-totems/${encodeURIComponent(totemId)}/pairing-token`, { method: 'POST' });
  }

  async listPowerSessions(): Promise<PowerSession[]> {
    return this.request('/v1/power-sessions');
  }

  async createPowerSession(totemId: string): Promise<PowerSession> {
    return this.request('/v1/power-sessions', { method: 'POST', body: JSON.stringify({ totemId }) });
  }

  async authorizePowerSession(sessionId: string): Promise<PowerSession> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/authorize`, { method: 'POST' });
  }

  async completePowerSession(sessionId: string): Promise<PowerSession> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/complete`, { method: 'POST' });
  }

  async sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<Gateway> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/heartbeat`, {
      method: 'POST',
      headers: { 'x-gateway-token': gatewayToken },
    });
  }

  async getGatewayAuthorization(gatewayId: string, gatewayToken: string): Promise<{ authorization: PowerSession | null }> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/authorization`, {
      headers: { 'x-gateway-token': gatewayToken },
    });
  }

  async createGatewayEvent(
    gatewayId: string,
    gatewayToken: string,
    input: { sessionId?: string; eventType: string; payload: Record<string, unknown> },
  ): Promise<GatewayEvent> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/events`, {
      method: 'POST',
      headers: { 'x-gateway-token': gatewayToken },
      body: JSON.stringify(input),
    });
  }
```

- [ ] **Step 6: Run web tests**

Run:

```powershell
cd apps/kivo/web
npx vitest run src/services/kivoClient.test.ts --reporter=default --pool=forks
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add apps/kivo/web/src/types/kivo.ts apps/kivo/web/src/services/kivoClient.ts apps/kivo/web/src/services/kivoClient.test.ts
git commit -m "feat(kivo-web): add power totem client contracts"
```

---

## Task 5: Gateway Package and Simulator

**Files:**
- Create: `apps/kivo/gateway/package.json`
- Create: `apps/kivo/gateway/tsconfig.json`
- Create: `apps/kivo/gateway/src/types.ts`
- Create: `apps/kivo/gateway/src/client.ts`
- Create: `apps/kivo/gateway/src/adapters/simulator.ts`
- Create: `apps/kivo/gateway/src/runner.ts`
- Create: `apps/kivo/gateway/src/client.test.ts`
- Create: `apps/kivo/gateway/src/runner.test.ts`
- Create: `apps/kivo/gateway/README.md`

- [ ] **Step 1: Create package metadata**

Create `apps/kivo/gateway/package.json`:

```json
{
  "name": "@kivo/gateway",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run",
    "dev": "tsx src/cli.ts"
  },
  "dependencies": {},
  "devDependencies": {
    "tsx": "^4.20.6",
    "typescript": "~5.7.2",
    "vitest": "^3.0.5"
  }
}
```

Create `apps/kivo/gateway/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```

- [ ] **Step 2: Write gateway tests**

Create `apps/kivo/gateway/src/client.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { KivoGatewayClient } from './client';

describe('KivoGatewayClient', () => {
  it('sends gateway token on heartbeat', async () => {
    const requests: Array<{ url: string; token: string | null; method?: string }> = [];
    const client = new KivoGatewayClient({
      apiUrl: 'https://api.kivo.example',
      gatewayId: 'gw_1',
      gatewayToken: 'secret_gateway_token',
      fetcher: async (input, init) => {
        const headers = new Headers(init?.headers);
        requests.push({ url: String(input), token: headers.get('x-gateway-token'), method: init?.method });
        return new Response(JSON.stringify({ id: 'gw_1', status: 'online' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      },
    });

    await client.heartbeat();

    expect(requests).toEqual([
      {
        url: 'https://api.kivo.example/v1/gateways/gw_1/heartbeat',
        token: 'secret_gateway_token',
        method: 'POST',
      },
    ]);
  });
});
```

Create `apps/kivo/gateway/src/runner.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createSimulatorAdapter } from './adapters/simulator';
import { runOnce } from './runner';
import type { GatewayClient, PowerAuthorization } from './types';

describe('runOnce', () => {
  it('turns output on and reports session lifecycle when authorization exists', async () => {
    const events: string[] = [];
    const authorization: PowerAuthorization = {
      id: 'sess_1',
      durationSeconds: 1,
      resource: '/power-totem/demo/session',
      amount: '0.1000000',
      status: 'authorized',
    };
    const client: GatewayClient = {
      heartbeat: async () => undefined,
      getAuthorization: async () => authorization,
      sendEvent: async (event) => {
        events.push(event.eventType);
      },
      completeSession: async (sessionId) => {
        events.push(`complete:${sessionId}`);
      },
    };
    const adapter = createSimulatorAdapter();

    await runOnce({ client, adapter, now: () => new Date('2026-05-18T12:00:00Z') });

    expect(adapter.state()).toEqual({ outputEnabled: false });
    expect(events).toEqual(['session.started', 'session.completed', 'complete:sess_1']);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run:

```powershell
cd apps/kivo/gateway
npm install
npm test
```

Expected: FAIL because source files do not exist.

- [ ] **Step 4: Add gateway types and client**

Create `apps/kivo/gateway/src/types.ts`:

```ts
export interface PowerAuthorization {
  id: string;
  durationSeconds: number;
  resource: string;
  amount: string;
  status: 'authorized';
}

export interface GatewayEventInput {
  sessionId?: string;
  eventType: string;
  payload: Record<string, unknown>;
}

export interface GatewayClient {
  heartbeat(): Promise<unknown>;
  getAuthorization(): Promise<PowerAuthorization | null>;
  sendEvent(event: GatewayEventInput): Promise<unknown>;
  completeSession(sessionId: string): Promise<unknown>;
}

export interface OutputAdapter {
  enable(session: PowerAuthorization): Promise<void>;
  disable(session: PowerAuthorization): Promise<void>;
}
```

Create `apps/kivo/gateway/src/client.ts`:

```ts
import type { GatewayClient, GatewayEventInput, PowerAuthorization } from './types';

type Fetcher = typeof fetch;

interface KivoGatewayClientOptions {
  apiUrl: string;
  gatewayId: string;
  gatewayToken: string;
  fetcher?: Fetcher;
}

export class KivoGatewayClient implements GatewayClient {
  private readonly apiUrl: string;
  private readonly gatewayId: string;
  private readonly gatewayToken: string;
  private readonly fetcher: Fetcher;

  constructor(options: KivoGatewayClientOptions) {
    this.apiUrl = options.apiUrl.replace(/\/$/, '');
    this.gatewayId = options.gatewayId;
    this.gatewayToken = options.gatewayToken;
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
  }

  heartbeat(): Promise<unknown> {
    return this.request(`/v1/gateways/${encodeURIComponent(this.gatewayId)}/heartbeat`, { method: 'POST' });
  }

  async getAuthorization(): Promise<PowerAuthorization | null> {
    const response = await this.request<{ authorization: PowerAuthorization | null }>(
      `/v1/gateways/${encodeURIComponent(this.gatewayId)}/authorization`,
    );
    return response.authorization;
  }

  sendEvent(event: GatewayEventInput): Promise<unknown> {
    return this.request(`/v1/gateways/${encodeURIComponent(this.gatewayId)}/events`, {
      method: 'POST',
      body: JSON.stringify(event),
    });
  }

  completeSession(sessionId: string): Promise<unknown> {
    return this.sendEvent({ sessionId, eventType: 'session.completed', payload: { source: 'gateway' } });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    headers.set('x-gateway-token', this.gatewayToken);
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    const response = await this.fetcher(`${this.apiUrl}${path}`, { ...init, headers });
    if (!response.ok) {
      throw new Error(`Kivo Gateway API error ${response.status}: ${await response.text()}`);
    }
    return (await response.json()) as T;
  }
}
```

- [ ] **Step 5: Add simulator adapter and runner**

Create `apps/kivo/gateway/src/adapters/simulator.ts`:

```ts
import type { OutputAdapter, PowerAuthorization } from '../types';

export function createSimulatorAdapter(): OutputAdapter & { state(): { outputEnabled: boolean } } {
  let outputEnabled = false;
  return {
    async enable(_session: PowerAuthorization) {
      outputEnabled = true;
    },
    async disable(_session: PowerAuthorization) {
      outputEnabled = false;
    },
    state() {
      return { outputEnabled };
    },
  };
}
```

Create `apps/kivo/gateway/src/runner.ts`:

```ts
import type { GatewayClient, OutputAdapter } from './types';

interface RunOnceOptions {
  client: GatewayClient;
  adapter: OutputAdapter;
  now?: () => Date;
}

export async function runOnce({ client, adapter, now = () => new Date() }: RunOnceOptions): Promise<void> {
  await client.heartbeat();
  const authorization = await client.getAuthorization();
  if (!authorization) {
    return;
  }

  await adapter.enable(authorization);
  await client.sendEvent({
    sessionId: authorization.id,
    eventType: 'session.started',
    payload: { startedAt: now().toISOString(), resource: authorization.resource },
  });

  await adapter.disable(authorization);
  await client.sendEvent({
    sessionId: authorization.id,
    eventType: 'session.completed',
    payload: { completedAt: now().toISOString(), resource: authorization.resource },
  });
  await client.completeSession(authorization.id);
}
```

- [ ] **Step 6: Add README**

Create `apps/kivo/gateway/README.md`:

```md
# Kivo Gateway

The Kivo Gateway runs near the user's resource. For the hackathon, it supports the Power Totem Raspberry demo and a simulator mode.

## Required env vars

```txt
KIVO_API_URL=https://ftjzxwlbgvghvzoztdik.supabase.co/functions/v1/kivo-api
KIVO_GATEWAY_ID=gw_demo_from_studio
KIVO_GATEWAY_TOKEN=kivo_gateway_token_shown_once
KIVO_GATEWAY_ADAPTER=simulator
```

## Local simulator

```bash
npm install
npm test
npm run build
```

The simulator adapter changes internal state only. Raspberry GPIO wiring must use a safe low-voltage output.
```

- [ ] **Step 7: Run gateway tests and build**

Run:

```powershell
cd apps/kivo/gateway
npm test
npm run build
```

Expected: tests pass and TypeScript build succeeds.

- [ ] **Step 8: Commit**

```powershell
git add apps/kivo/gateway
git commit -m "feat(kivo): add power totem gateway package"
```

---

## Task 6: Power Totem Studio Web Experience

**Files:**
- Create: `apps/kivo/web/src/data/powerTotemExperience.ts`
- Create: `apps/kivo/web/src/data/powerTotemExperience.test.ts`
- Create: `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
- Create: `apps/kivo/web/src/pages/PowerTotemDetailPage.tsx`
- Create: `apps/kivo/web/src/pages/TotemDisplayPage.tsx`
- Create: `apps/kivo/web/src/pages/TotemSimulatorPage.tsx`
- Modify: `apps/kivo/web/src/App.tsx`

- [ ] **Step 1: Write content tests**

Create `apps/kivo/web/src/data/powerTotemExperience.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { futureKivoTemplates, powerTotemTemplate } from './powerTotemExperience';

describe('powerTotemExperience', () => {
  it('marks Power Totem as the only functional hackathon template', () => {
    expect(powerTotemTemplate.status).toBe('functional');
    expect(powerTotemTemplate.resourcePattern).toBe('/power-totem/{totemId}/session');
  });

  it('keeps future templates as roadmap, not clickable products', () => {
    expect(futureKivoTemplates.every((template) => template.status === 'roadmap')).toBe(true);
    expect(futureKivoTemplates.map((template) => template.name)).toEqual([
      'API Toll',
      'Data Gate',
      'Agent Tool Paywall',
      'Device Command',
      'Compute Meter',
      'Storage Unlock',
      'Automation Trigger',
      'Private Flow Template',
    ]);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```powershell
cd apps/kivo/web
npx vitest run src/data/powerTotemExperience.test.ts --reporter=default --pool=forks
```

Expected: FAIL because `powerTotemExperience.ts` does not exist.

- [ ] **Step 3: Add Power Totem experience data**

Create `apps/kivo/web/src/data/powerTotemExperience.ts`:

```ts
export const powerTotemTemplate = {
  id: 'power-totem',
  name: 'Kivo Power Totem',
  status: 'functional',
  resourcePattern: '/power-totem/{totemId}/session',
  headline: 'Venda acesso fisico a energia ou dispositivos com x402.',
  steps: [
    'Criar Power Totem',
    'Parear Raspberry Gateway',
    'Gerar QR Code',
    'Testar pagamento x402',
    'Liberar saida fisica',
    'Monitorar sessao',
  ],
} as const;

export const futureKivoTemplates = [
  { id: 'api-toll', name: 'API Toll', status: 'roadmap', description: 'Endpoints pagos para H2S e M2M.' },
  { id: 'data-gate', name: 'Data Gate', status: 'roadmap', description: 'Dados IoT pagos por leitura ou pacote.' },
  { id: 'agent-tool-paywall', name: 'Agent Tool Paywall', status: 'roadmap', description: 'Agentes pagando por ferramentas premium.' },
  { id: 'device-command', name: 'Device Command', status: 'roadmap', description: 'Pagamento digital liberando comando fisico.' },
  { id: 'compute-meter', name: 'Compute Meter', status: 'roadmap', description: 'Inferencia, jobs e compute pagos por uso.' },
  { id: 'storage-unlock', name: 'Storage Unlock', status: 'roadmap', description: 'Arquivos, relatorios e midia pagos.' },
  { id: 'automation-trigger', name: 'Automation Trigger', status: 'roadmap', description: 'Webhooks e automacoes pagos.' },
  { id: 'private-flow-template', name: 'Private Flow Template', status: 'roadmap', description: 'Flows privados pagos ou templates publicos sanitizados.' },
] as const;
```

- [ ] **Step 4: Add Studio page**

Create `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx` with a first working version:

```tsx
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { powerTotemTemplate, futureKivoTemplates } from '@/data/powerTotemExperience';
import { kivoClient } from '@/services/kivoClient';
import type { GatewayPairingResult, PowerTotem } from '@/types/kivo';

export default function PowerTotemStudioPage() {
  const [name, setName] = useState('Power Totem RJ');
  const [price, setPrice] = useState('0.1000000');
  const [duration, setDuration] = useState(30);
  const [totem, setTotem] = useState<PowerTotem | null>(null);
  const [pairing, setPairing] = useState<GatewayPairingResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const createTotem = async () => {
    setSaving(true);
    setError('');
    try {
      const created = await kivoClient.createPowerTotem({
        name,
        price,
        unit: 'session',
        sessionDurationSeconds: duration,
      });
      const pairingResult = await kivoClient.createPowerTotemPairingToken(created.id);
      setTotem(created);
      setPairing(pairingResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel criar o Power Totem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo Studio"
        title="Power Totem"
        icon="solar:electric-refueling-bold-duotone"
        description={powerTotemTemplate.headline}
        action={<Badge tone="ready">Template funcional do hackathon</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Criar totem</h2>
          <div className="mt-5 grid gap-4">
            <label className="text-sm font-bold text-neutral-300">
              Nome
              <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-white outline-none focus:border-emerald-400/50" />
            </label>
            <label className="text-sm font-bold text-neutral-300">
              Preco USDC
              <input value={price} onChange={(event) => setPrice(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-white outline-none focus:border-emerald-400/50" />
            </label>
            <label className="text-sm font-bold text-neutral-300">
              Duracao da sessao em segundos
              <input type="number" value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-white outline-none focus:border-emerald-400/50" />
            </label>
            {error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
            <button type="button" onClick={createTotem} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:opacity-60">
              {saving ? 'Criando...' : 'Criar e parear gateway'}
              <Icon icon="solar:bolt-circle-bold-duotone" />
            </button>
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Resultado</h2>
          {totem ? (
            <div className="mt-5 space-y-3 text-sm text-neutral-300">
              <p><strong className="text-white">Resource:</strong> {totem.resource}</p>
              <p><strong className="text-white">Gateway:</strong> {pairing?.gateway.name}</p>
              <p><strong className="text-white">Token mostrado uma vez:</strong> {pairing?.gatewayToken}</p>
              <div className="flex flex-wrap gap-2 pt-3">
                <Link to={`/totems/${totem.id}`} className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black">Abrir detalhe</Link>
                <Link to={`/totem/${totem.id}/display`} className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white">Tela do totem</Link>
              </div>
            </div>
          ) : (
            <p className="mt-5 text-sm leading-6 text-neutral-500">Crie um totem para gerar resource, gateway token e QR de pagamento.</p>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="font-bricolage text-xl font-bold text-white">Depois do hackathon</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {futureKivoTemplates.map((template) => (
            <div key={template.id} className="rounded-xl border border-white/5 bg-black/25 p-4">
              <Badge tone="future">Roadmap</Badge>
              <p className="mt-3 font-bold text-white">{template.name}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">{template.description}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 5: Add detail, display, and simulator pages**

Create minimal but user-facing pages:

`apps/kivo/web/src/pages/PowerTotemDetailPage.tsx`

```tsx
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

export default function PowerTotemDetailPage() {
  const { id } = useParams();
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Power Totem" title="Operacao do totem" icon="solar:electric-refueling-bold-duotone" description="Sessao, gateway, checkout e liquidacao em um unico lugar." />
      <Card>
        <p className="text-sm leading-6 text-neutral-300">Totem: {id}</p>
        <p className="mt-2 text-sm leading-6 text-neutral-500">Esta tela sera ligada aos endpoints de sessoes, gateway e pagamentos nas proximas tarefas.</p>
      </Card>
    </div>
  );
}
```

`apps/kivo/web/src/pages/TotemDisplayPage.tsx`

```tsx
import { useParams } from 'react-router-dom';

export default function TotemDisplayPage() {
  const { id } = useParams();
  return (
    <main className="min-h-screen bg-black p-6 text-white">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-3xl flex-col items-center justify-center rounded-3xl border border-emerald-400/20 bg-neutral-950 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-300">Kivo Power Totem</p>
        <h1 className="mt-4 font-bricolage text-5xl font-bold">Energia bloqueada</h1>
        <div className="mt-8 flex h-48 w-48 items-center justify-center rounded-2xl border border-white/10 bg-white p-4 text-black">
          QR
        </div>
        <p className="mt-6 text-neutral-400">Totem {id} aguardando pagamento x402.</p>
      </section>
    </main>
  );
}
```

`apps/kivo/web/src/pages/TotemSimulatorPage.tsx`

```tsx
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

export default function TotemSimulatorPage() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="Demo fallback" title="Simulador do totem" icon="solar:bolt-circle-bold-duotone" description="Mostra a mesma mudanca de estado do Raspberry quando a autorizacao chega." />
      <Card>
        <div className={`rounded-2xl border p-8 text-center ${enabled ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-white/10 bg-black/25'}`}>
          <p className="font-bricolage text-3xl font-bold text-white">{enabled ? 'Energia liberada' : 'Energia bloqueada'}</p>
          <button type="button" onClick={() => setEnabled((value) => !value)} className="mt-6 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">
            Alternar estado
          </button>
        </div>
      </Card>
    </div>
  );
}
```

- [ ] **Step 6: Wire routes**

Modify `apps/kivo/web/src/App.tsx` imports:

```ts
import PowerTotemDetailPage from '@/pages/PowerTotemDetailPage';
import PowerTotemStudioPage from '@/pages/PowerTotemStudioPage';
import TotemDisplayPage from '@/pages/TotemDisplayPage';
import TotemSimulatorPage from '@/pages/TotemSimulatorPage';
```

Add routes inside authenticated app routes:

```tsx
            <Route path="studio" element={<PowerTotemStudioPage />} />
            <Route path="totems/:id" element={<PowerTotemDetailPage />} />
            <Route path="totem/:id/display" element={<TotemDisplayPage />} />
            <Route path="totem-simulator" element={<TotemSimulatorPage />} />
```

- [ ] **Step 7: Run tests and build**

Run:

```powershell
cd apps/kivo/web
npx vitest run src/data/powerTotemExperience.test.ts src/services/kivoClient.test.ts --reporter=default --pool=forks
npm run lint
npm run build
```

Expected: tests, lint, and build pass.

- [ ] **Step 8: Commit**

```powershell
git add apps/kivo/web/src/data/powerTotemExperience.ts apps/kivo/web/src/data/powerTotemExperience.test.ts apps/kivo/web/src/pages/PowerTotemStudioPage.tsx apps/kivo/web/src/pages/PowerTotemDetailPage.tsx apps/kivo/web/src/pages/TotemDisplayPage.tsx apps/kivo/web/src/pages/TotemSimulatorPage.tsx apps/kivo/web/src/App.tsx
git commit -m "feat(kivo-web): add power totem studio"
```

---

## Task 7: Product Navigation and Roadmap Framing

**Files:**
- Modify: `apps/kivo/web/src/layouts/Sidebar.tsx`
- Modify: `apps/kivo/web/src/layouts/BottomNav.tsx`
- Modify: `apps/kivo/web/src/layouts/Topbar.tsx`
- Modify: `apps/kivo/web/src/components/CommandPalette.tsx`
- Modify: `apps/kivo/web/src/pages/WorkspaceHomePage.tsx`
- Modify: `apps/kivo/web/src/pages/IntegrationsPage.tsx`

- [ ] **Step 1: Update navigation to Power Totem first**

Set normal navigation labels to:

```ts
[
  { to: '/dashboard', icon: 'solar:home-2-bold-duotone', label: 'Home' },
  { to: '/studio', icon: 'solar:electric-refueling-bold-duotone', label: 'Studio' },
  { to: '/checkout', icon: 'solar:card-transfer-bold-duotone', label: 'Checkout' },
  { to: '/totem-simulator', icon: 'solar:bolt-circle-bold-duotone', label: 'Simulador' },
  { to: '/payments', icon: 'solar:wallet-money-bold-duotone', label: 'Pagamentos' },
]
```

Keep Finance, Health, Status, Settings under secondary navigation.

- [ ] **Step 2: Update command palette**

Commands must include:

```ts
{ label: 'Kivo Studio', path: '/studio', icon: 'solar:electric-refueling-bold-duotone', keywords: 'power totem raspberry gateway sdk ai agents' }
{ label: 'Simulador do totem', path: '/totem-simulator', icon: 'solar:bolt-circle-bold-duotone', keywords: 'demo meet fallback raspberry gpio' }
```

Remove normal-mode commands that make API Toll, Data Gate, MCP, x402 playground, or generic templates look like functional hackathon templates.

- [ ] **Step 3: Update Home copy**

In `WorkspaceHomePage.tsx`, replace generic “create flow/templates” hero copy with:

```txt
Configure um Power Totem, teste pagamento x402 e libere um recurso fisico pelo gateway.
```

Primary CTA: `/studio` with label `Abrir Kivo Studio`.

Secondary CTA: `/totem-simulator` with label `Ver simulador`.

- [ ] **Step 4: Update Integrations copy**

In `IntegrationsPage.tsx`, frame SDK as Power Totem Gateway SDK for the hackathon:

```txt
No hackathon, o SDK operacional foca no Power Totem. Depois, os mesmos contratos suportam API Toll, Data Gate, Agent Tool Paywall e outros templates.
```

- [ ] **Step 5: Browser smoke**

Open:

```txt
http://127.0.0.1:5174/studio
http://127.0.0.1:5174/totem-simulator
http://127.0.0.1:5174/dashboard
```

Expected:

- routes render without blank screen;
- no console errors;
- nav presents Studio/Power Totem first;
- future templates appear only as roadmap.

- [ ] **Step 6: Run build**

```powershell
cd apps/kivo/web
npm run lint
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```powershell
git add apps/kivo/web/src/layouts/Sidebar.tsx apps/kivo/web/src/layouts/BottomNav.tsx apps/kivo/web/src/layouts/Topbar.tsx apps/kivo/web/src/components/CommandPalette.tsx apps/kivo/web/src/pages/WorkspaceHomePage.tsx apps/kivo/web/src/pages/IntegrationsPage.tsx
git commit -m "feat(kivo-web): focus navigation on power totem"
```

---

## Task 8: Checkout and Authorization Bridge

**Files:**
- Modify: `supabase/functions/kivo-api/index.ts`
- Modify: `apps/kivo/web/src/pages/CheckoutPage.tsx`
- Modify: `apps/kivo/web/src/pages/PowerTotemDetailPage.tsx`

- [ ] **Step 1: Bind x402 payment to Power Session**

In `handlePowerSessions`, add `POST /v1/power-sessions/:id/start-checkout` that:

```ts
const startCheckout = path.match(/^\/v1\/power-sessions\/([^/]+)\/start-checkout$/);

if (startCheckout && req.method === "POST") {
  const sessions = await selectRows<DbPowerSession>("kivo_power_sessions", {
    select: "*",
    id: `eq.${startCheckout[1]}`,
    owner_id: `eq.${user.id}`,
    limit: 1,
  });
  if (!sessions[0]) {
    return apiError(req, 404, "session_not_found", "Power Totem session not found.");
  }
  const challenge = await buildChallenge(req, sessions[0].resource, user);
  const nextStatus = nextSessionStatus(sessions[0].status, "require_payment");
  const rows = await patchRows<DbPowerSession>("kivo_power_sessions", {
    id: `eq.${sessions[0].id}`,
  }, {
    status: nextStatus,
    x402_nonce: challenge.nonce,
  });
  return json(req, 200, {
    session: toPowerSession(rows[0]),
    checkoutResource: sessions[0].resource,
    challenge,
  });
}
```

- [ ] **Step 2: Mark session paid after x402 pay**

In `handleX402`, inside `/v1/x402/pay`, replace the current payment insert block:

```ts
      await insertRow<DbPayment>("kivo_payments", {
```

with a named insert:

```ts
      const paymentRow = await insertRow<DbPayment>("kivo_payments", {
```

Then immediately after the insert object closes, before the `if (nonce.owner_id)` block ends, add:

```ts
      await patchRows<DbPowerSession>("kivo_power_sessions", {
        x402_nonce: `eq.${nonce.nonce}`,
        status: "eq.payment_required",
      }, {
        status: "paid",
        payment_id: paymentRow.id,
        events: [
          paymentEvent("Payment confirmed", "x402 payment confirmed on Stellar.", "done"),
        ],
      });
```

The resulting `/v1/x402/pay` block must still return the existing `paymentHeader`, `stellarHash`, `stellarLedger`, and `data.unlocked` response.

- [ ] **Step 3: Add client method**

Add to `KivoApiClient`:

```ts
  startPowerSessionCheckout(sessionId: string): Promise<{ session: PowerSession; checkoutResource: string; challenge: X402Challenge }>;
```

Add implementation:

```ts
  async startPowerSessionCheckout(sessionId: string): Promise<{ session: PowerSession; checkoutResource: string; challenge: X402Challenge }> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/start-checkout`, { method: 'POST' });
  }
```

- [ ] **Step 4: Update checkout UI entry**

In `CheckoutPage.tsx`, add a “Power Totem session” panel that:

- creates a power session for the selected totem;
- calls `startPowerSessionCheckout`;
- uses the returned `challenge` as the x402 challenge for payment;
- after payment success, links to `/totems/:id`.

The visible copy must be:

```txt
Este pagamento libera uma sessao fisica no Power Totem. Depois da confirmacao, o Gateway recebe uma autorizacao curta para acionar a saida.
```

- [ ] **Step 5: Verify protected resource**

Run Edge Function locally:

```powershell
supabase functions serve kivo-api --workdir . --no-verify-jwt
```

Then request:

```powershell
Invoke-WebRequest -Uri "http://127.0.0.1:54321/functions/v1/kivo-api/power-totem/demo/session" -Headers @{ Authorization = "Bearer invalid" }
```

Expected: 401 or 402-style protected response, not a fake unlock.

- [ ] **Step 6: Commit**

```powershell
git add supabase/functions/kivo-api/index.ts apps/kivo/web/src/services/kivoClient.ts apps/kivo/web/src/pages/CheckoutPage.tsx apps/kivo/web/src/pages/PowerTotemDetailPage.tsx
git commit -m "feat(kivo): connect power sessions to x402 checkout"
```

---

## Task 9: Health, Status, and Demo Readiness

**Files:**
- Modify: `apps/kivo/web/src/pages/HealthPage.tsx`
- Modify: `apps/kivo/web/src/pages/StatusPage.tsx`
- Modify: `apps/kivo/README.md`
- Modify: `apps/kivo/DELIVERY.md`
- Modify: `apps/kivo/scripts/preflight.ps1`

- [ ] **Step 1: Add Power Totem health copy**

Health page must show:

```txt
Power Totem: flow, gateway, x402, Stellar, Etherfuse e autorizacao fisica.
```

Status page must show four checks:

- Kivo API
- Stellar settlement
- Etherfuse anchor/funding
- Power Gateway heartbeat

- [ ] **Step 2: Update delivery docs**

Add to `apps/kivo/DELIVERY.md`:

```md
## Power Totem Go/No-Go

- [ ] Power Totem can be created in Studio.
- [ ] Gateway token is shown once and not exposed again.
- [ ] Gateway heartbeat marks the gateway online.
- [ ] Checkout creates x402 challenge for `/power-totem/{id}/session`.
- [ ] Valid signed payment authorizes one session.
- [ ] Gateway simulator receives authorization and reports session events.
- [ ] Raspberry demo uses only low-voltage output.
- [ ] Browser simulator is ready if hardware fails.
```

- [ ] **Step 3: Update preflight script**

Append checks in `apps/kivo/scripts/preflight.ps1`:

```powershell
Write-Host "Checking Power Totem health..."
$totemsUrl = "$ApiUrl/v1/power-totems"
try {
  $response = Invoke-WebRequest -Uri $totemsUrl -Headers $headers -Method GET -ErrorAction Stop
  Write-Host "Power Totem endpoint reachable: $($response.StatusCode)"
} catch {
  Write-Warning "Power Totem endpoint check failed: $($_.Exception.Message)"
}
```

Use the existing `$ApiUrl` and `$headers` variables already present in the script.

- [ ] **Step 4: Run all verification commands**

Run:

```powershell
deno test --allow-env --allow-read --allow-net supabase/functions/kivo-api
cd apps/kivo/web
npm run lint
npx vitest run --reporter=default --pool=forks
npm run build
cd ..\gateway
npm test
npm run build
```

Expected: all pass.

- [ ] **Step 5: Browser QA**

Use the in-app browser and wait at least 1 second after each navigation:

```txt
http://127.0.0.1:5174/studio
http://127.0.0.1:5174/checkout
http://127.0.0.1:5174/totem-simulator
http://127.0.0.1:5174/health
http://127.0.0.1:5174/status
```

Expected:

- no Vite overlay;
- console has no app errors;
- Studio can create a Power Totem;
- simulator can toggle visible state;
- Health/Status mention gateway and Etherfuse clearly;
- no route exposes future templates as functional.

- [ ] **Step 6: Commit**

```powershell
git add apps/kivo/web/src/pages/HealthPage.tsx apps/kivo/web/src/pages/StatusPage.tsx apps/kivo/README.md apps/kivo/DELIVERY.md apps/kivo/scripts/preflight.ps1
git commit -m "docs(kivo): add power totem delivery readiness"
```

---

## Task 10: Final Hackathon Demo Script

**Files:**
- Create: `apps/kivo/POWER_TOTEM_DEMO.md`

- [ ] **Step 1: Create demo script**

Create `apps/kivo/POWER_TOTEM_DEMO.md`:

```md
# Kivo Power Totem Demo

## One-liner

Kivo lets humans, machines, and agents pay for access to physical or digital resources. For the hackathon, Power Totem proves the flow physically: scan QR, pay with x402, validate on Stellar/Etherfuse, and unlock a Raspberry-controlled output.

## Online Meet path

1. Open Kivo Studio.
2. Create a Power Totem.
3. Show generated resource `/power-totem/{id}/session`.
4. Show gateway token once.
5. Open simulator.
6. Open checkout.
7. Generate x402 payment challenge.
8. Submit signed testnet XDR.
9. Show session authorized.
10. Toggle simulator/output state.
11. Open Health and Status.

## Stellar Village RJ path

1. Put Raspberry totem on table with screen visible.
2. Show locked state and QR Code.
3. Visitor scans QR.
4. Payment is made on testnet.
5. Kivo validates settlement.
6. Raspberry gateway receives authorization.
7. LED strip or mini fan turns on.
8. Countdown ends.
9. Dashboard shows session completed.

## Safety

Use low-voltage output only. Do not switch AC mains during the hackathon demo.
```

- [ ] **Step 2: Commit**

```powershell
git add apps/kivo/POWER_TOTEM_DEMO.md
git commit -m "docs(kivo): add power totem demo script"
```

---

## Final Verification

After all tasks:

```powershell
git status --short
deno test --allow-env --allow-read --allow-net supabase/functions/kivo-api
cd apps/kivo/web
npm run lint
npx vitest run --reporter=default --pool=forks
npm run build
cd ..\gateway
npm test
npm run build
```

Browser smoke:

- `/studio`
- `/checkout`
- `/totem-simulator`
- `/health`
- `/status`

Delivery evidence:

- Screenshot of Studio after totem creation.
- Screenshot of browser simulator unlocked.
- Screenshot of Health/Status showing Kivo API, Stellar, Etherfuse, and Gateway.
- Terminal output showing web build, web tests, Deno tests, gateway tests.

## Plan Self-Review

- Spec coverage: Power Totem, Gateway, SDK, Studio, x402, Etherfuse visibility, health/status, demo modes, and future template framing all have tasks.
- Placeholder scan: no `TBD` or open-ended placeholder steps remain.
- Type consistency: `PowerTotem`, `Gateway`, `PowerSession`, and route names match across schema, Edge API, client, and UI tasks.
- Scope control: Tauri Studio, marketplace, mainnet private billing, and future templates are documented as roadmap only.
