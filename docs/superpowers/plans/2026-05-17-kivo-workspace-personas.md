# Kivo Workspace Personas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reframe the Kivo authenticated frontend as a workspace-first MVP with persona journeys for operators, end users, integrators, and finance/admin users.

**Architecture:** Add a small local product model that describes personas, account scales, and route entry points. Use it across the new workspace home and team page, while existing API-backed pages provide the operational data. Keep the current technical pages as advanced routes.

**Tech Stack:** React 19, React Router, Vite, TypeScript, Tailwind CSS, Vitest.

---

### Task 1: Product Model

**Files:**
- Create: `apps/kivo/web/src/data/workspaceExperience.ts`
- Create: `apps/kivo/web/src/data/workspaceExperience.test.ts`

- [ ] **Step 1: Write a failing test**

```ts
import { describe, expect, it } from 'vitest';
import { accountScales, personaJourneys } from './workspaceExperience';

describe('workspace experience model', () => {
  it('covers the MVP personas and account scales', () => {
    expect(personaJourneys.map((persona) => persona.id)).toEqual(['operator', 'payer', 'integrator', 'finance']);
    expect(accountScales.map((scale) => scale.id)).toEqual(['solo', 'team', 'enterprise']);
    expect(personaJourneys.every((persona) => persona.primaryRoute.startsWith('/'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test -- workspaceExperience`

Expected: FAIL because `workspaceExperience` does not exist.

- [ ] **Step 3: Add the product model**

Create `workspaceExperience.ts` with exported `personaJourneys` and `accountScales` arrays. Each persona includes `id`, `label`, `role`, `primaryRoute`, `icon`, `description`, and `jobs`. Each scale includes `id`, `label`, `description`, `features`, and `mvpStatus`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test -- workspaceExperience`

Expected: PASS.

### Task 2: Persona Pages

**Files:**
- Create: `apps/kivo/web/src/pages/WorkspaceHomePage.tsx`
- Create: `apps/kivo/web/src/pages/OperationsPage.tsx`
- Create: `apps/kivo/web/src/pages/CheckoutPage.tsx`
- Create: `apps/kivo/web/src/pages/IntegrationsPage.tsx`
- Create: `apps/kivo/web/src/pages/FinancePage.tsx`
- Create: `apps/kivo/web/src/pages/TeamPage.tsx`

- [ ] **Step 1: Build workspace home**

Use `personaJourneys`, `accountScales`, `kivoClient.getDashboardSummary`, `kivoClient.listPayments`, and `kivoClient.listDevices` to show a product overview with persona entry cards, account-scale cards, and live workspace metrics.

- [ ] **Step 2: Build operations page**

Use devices, payments, health, and workflows to show operator tasks: active devices, recent sessions/payments, health, and quick actions.

- [ ] **Step 3: Build checkout page**

Use existing x402 client methods to provide a user-facing resource checkout: request price, show required payment header, accept signed XDR, retry with `X-PAYMENT`, and show unlocked data.

- [ ] **Step 4: Build integrations page**

Create an integrator hub with templates, API key, webhook, MCP, and x402 cards that route to existing pages.

- [ ] **Step 5: Build finance page**

Use payments and dashboard summary to show revenue, settlement status, failed payments, and proof links/hashes.

- [ ] **Step 6: Build team page**

Use `accountScales` to show solo, small-team, and enterprise-readiness. Include role cards for owner, operator, developer, and finance.

### Task 3: Routes And Navigation

**Files:**
- Modify: `apps/kivo/web/src/App.tsx`
- Modify: `apps/kivo/web/src/layouts/Sidebar.tsx`
- Modify: `apps/kivo/web/src/layouts/BottomNav.tsx`
- Modify: `apps/kivo/web/src/layouts/Topbar.tsx`
- Modify: `apps/kivo/web/src/components/CommandPalette.tsx`
- Modify: `apps/kivo/web/src/pages/NotFoundPage.tsx`

- [ ] **Step 1: Wire routes**

Make `/dashboard` render `WorkspaceHomePage`. Add `/operations`, `/checkout`, `/integrations`, `/finance`, and `/team`. Keep existing technical routes.

- [ ] **Step 2: Update desktop navigation**

Group primary routes under `Workspace`, persona routes under `Jornadas`, and technical pages under `Avancado`.

- [ ] **Step 3: Update mobile navigation**

Prioritize `Inicio`, `Operar`, `Pagar`, `Integrar`, and `Financeiro`.

- [ ] **Step 4: Update topbar and command palette**

Add labels/icons for new routes and adjust copy so the shell says `Workspace M2M, x402 e Stellar`, not `M2M Console`.

### Task 4: Verification

**Files:**
- No new files.

- [ ] **Step 1: Run automated checks**

Run:

```bash
cd apps/kivo/web
npm run test
npm run lint
npm run build
```

Expected: all pass.

- [ ] **Step 2: Browser smoke**

Open `http://127.0.0.1:5174/dashboard` and verify:

- Dashboard is a workspace/persona home.
- `/operations`, `/checkout`, `/integrations`, `/finance`, and `/team` render.
- Desktop sidebar and mobile bottom nav have the new information architecture.
- No obvious text overlap at desktop width.
