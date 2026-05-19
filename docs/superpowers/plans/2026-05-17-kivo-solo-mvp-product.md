# Kivo Solo MVP Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Kivo from a technical sandbox into a solo-first product where one user can create, test, publish, and monitor a monetized IoT/API/data flow.

**Architecture:** Add a product abstraction called `KivoFlow` in the web app and derive initial flows from existing devices, pricing rules, and payments. Keep existing API surfaces intact, but move raw x402, Etherfuse, MCP, deploy, API key, webhook, and device tools under an Advanced area while the primary navigation focuses on Home, Create Flow, Flows, Payments, and Advanced.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, react-router-dom, Zustand, Vitest, existing Go API and Supabase-backed state.

---

## File Structure

- Modify: `apps/kivo/web/src/types/kivo.ts`
  - Add product-facing flow/template/session types.
- Create: `apps/kivo/web/src/data/soloMvp.ts`
  - Own the three MVP templates, SDK/API snippets, flow derivation, health labels, and wizard defaults.
- Create: `apps/kivo/web/src/data/soloMvp.test.ts`
  - Unit tests for template count, default values, snippets, and derived flow behavior.
- Modify: `apps/kivo/web/src/App.tsx`
  - Add `/create-flow`, `/flows`, `/flows/:id`, `/advanced`; preserve legacy routes.
- Modify: `apps/kivo/web/src/layouts/Sidebar.tsx`
  - Replace sandbox-heavy navigation with solo-first primary navigation and a compact Advanced section.
- Modify: `apps/kivo/web/src/layouts/BottomNav.tsx`
  - Mobile nav becomes Home, Create, Flows, Payments, Advanced.
- Modify: `apps/kivo/web/src/layouts/Topbar.tsx`
  - Product-first route labels and copy.
- Modify: `apps/kivo/web/src/components/CommandPalette.tsx`
  - Search should prefer solo product routes.
- Modify: `apps/kivo/web/src/pages/WorkspaceHomePage.tsx`
  - Rebuild as solo command center.
- Create: `apps/kivo/web/src/pages/CreateFlowPage.tsx`
  - Guided template -> pricing -> integration -> test -> publish wizard.
- Create: `apps/kivo/web/src/pages/FlowsPage.tsx`
  - List user-facing flows with status, revenue, sessions, and next action.
- Create: `apps/kivo/web/src/pages/FlowDetailPage.tsx`
  - Flow detail with overview, integration snippet, test payment, sessions, payments, and setup health.
- Create: `apps/kivo/web/src/pages/AdvancedPage.tsx`
  - Hub for legacy/dev tools.
- Modify: `apps/kivo/web/src/pages/PaymentsPage.tsx`
  - Make it a readable solo ledger rather than a payment-construction sandbox.
- Modify: `apps/kivo/web/src/pages/CheckoutPage.tsx`
  - Reframe as "Test Payment" and hide raw Etherfuse/x402 payloads behind advanced disclosure.
- Modify: `apps/kivo/web/src/pages/TemplatesPage.tsx`
  - Reduce public template emphasis to the three MVP paths or route users to Create Flow.
- Modify: `apps/kivo/web/src/pages/IntegrationsPage.tsx`
  - Move developer hub language under Advanced.
- Modify: `apps/kivo/web/src/pages/X402Page.tsx`
  - Rename visible language from playground to rules/debug.
- Modify: `apps/kivo/web/src/pages/SettingsPage.tsx`
  - Keep workspace/environment settings but remove "sandbox" framing.

---

### Task 1: Add Solo Product Types

**Files:**
- Modify: `apps/kivo/web/src/types/kivo.ts`

- [ ] **Step 1: Add flow/template types near the existing domain types**

Add this block after `export type ApiHealth = 'ok' | 'degraded' | 'down';`:

```ts
export type KivoTemplateId = 'device-pay-ev-charging' | 'paid-api-endpoint' | 'iot-data-feed';
export type KivoFlowStatus = 'draft' | 'testing' | 'active' | 'needs_setup' | 'failed';
export type KivoFlowUnit = 'session' | 'kWh' | 'minute' | 'request' | 'reading' | 'package';
export type KivoIntegrationMode = 'gateway_sdk' | 'api_middleware' | 'data_feed';

export interface KivoTemplate {
  id: KivoTemplateId;
  name: string;
  shortName: string;
  category: 'Device Pay' | 'API Pay' | 'Data Feed';
  icon: string;
  description: string;
  bestFor: string;
  defaultResourceName: string;
  defaultPrice: string;
  defaultUnit: KivoFlowUnit;
  integrationMode: KivoIntegrationMode;
  primaryActionLabel: string;
}

export interface KivoFlow {
  id: string;
  templateId: KivoTemplateId;
  name: string;
  status: KivoFlowStatus;
  price: string;
  unit: KivoFlowUnit;
  resource: string;
  integrationMode: KivoIntegrationMode;
  deviceId?: string;
  pricingRuleId?: string;
  revenueUsdc: number;
  sessionsCount: number;
  paymentsCount: number;
  failedPaymentsCount: number;
  lastActivityAt?: string;
  setupChecklist: Array<{
    id: string;
    label: string;
    complete: boolean;
  }>;
}

export interface CreateFlowDraft {
  templateId: KivoTemplateId;
  name: string;
  price: string;
  unit: KivoFlowUnit;
  resource: string;
}
```

- [ ] **Step 2: Run typecheck to catch naming conflicts**

Run:

```bash
cd apps/kivo/web
npm run build
```

Expected: the build may fail later because no implementation imports these types yet only if there is a syntax error. Fix syntax errors before continuing.

- [ ] **Step 3: Commit**

```bash
git add apps/kivo/web/src/types/kivo.ts
git commit -m "feat(kivo): add solo flow product types"
```

---

### Task 2: Create Solo MVP Product Data Helpers

**Files:**
- Create: `apps/kivo/web/src/data/soloMvp.ts`
- Create: `apps/kivo/web/src/data/soloMvp.test.ts`

- [ ] **Step 1: Write failing tests for templates, snippets, and derived flows**

Create `apps/kivo/web/src/data/soloMvp.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import {
  buildIntegrationSnippet,
  deriveSoloFlows,
  getTemplateById,
  soloMvpTemplates,
} from './soloMvp';
import type { Device, Payment, X402PricingRule } from '@/types/kivo';

const device: Device = {
  id: 'dev_ev_1',
  name: 'Charger A1',
  ownerId: 'owner_1',
  apiKeyPreview: 'kivo_dev_1234',
  stellarPublicKey: 'GDEVICEPUBLICKEY',
  status: 'active',
  metadata: { location: 'Garage', templateId: 'device-pay-ev-charging' },
  balances: [{ assetCode: 'USDC', amount: '10.5' }],
  createdAt: '2026-05-17T10:00:00Z',
  updatedAt: '2026-05-17T10:00:00Z',
};

const pricingRule: X402PricingRule = {
  id: 'x402_rule_1',
  resource: '/api/x402/data',
  amount: '0.0500000',
  asset: 'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
  maxTimeout: 300,
  enabled: true,
  description: 'Premium sensor reading',
  updatedAt: '2026-05-17T10:00:00Z',
};

const payment: Payment = {
  id: 'pay_1',
  fromDeviceId: 'dev_customer',
  toDeviceId: 'dev_ev_1',
  amount: '0.50',
  assetCode: 'USDC',
  conditionType: 'energy_kwh',
  conditionValue: '1',
  status: 'confirmed',
  createdAt: '2026-05-17T11:00:00Z',
  events: [],
};

describe('solo MVP product helpers', () => {
  it('promotes exactly three MVP templates', () => {
    expect(soloMvpTemplates).toHaveLength(3);
    expect(soloMvpTemplates.map((template) => template.id)).toEqual([
      'device-pay-ev-charging',
      'paid-api-endpoint',
      'iot-data-feed',
    ]);
  });

  it('returns concrete snippets for each template', () => {
    for (const template of soloMvpTemplates) {
      const snippet = buildIntegrationSnippet({
        templateId: template.id,
        resourceName: template.defaultResourceName,
        resource: '/api/kivo/resource',
        price: template.defaultPrice,
        unit: template.defaultUnit,
      });

      expect(snippet).toContain('Kivo');
      expect(snippet).not.toMatch(/REPLACE_ME|YOUR_/i);
    }
  });

  it('derives a device flow from active devices and payments', () => {
    const flows = deriveSoloFlows({
      devices: [device],
      payments: [payment],
      pricingRules: [pricingRule],
    });

    const evFlow = flows.find((flow) => flow.templateId === 'device-pay-ev-charging');

    expect(evFlow?.name).toBe('Charger A1');
    expect(evFlow?.status).toBe('active');
    expect(evFlow?.paymentsCount).toBe(1);
    expect(evFlow?.revenueUsdc).toBe(0.5);
  });

  it('finds templates by id', () => {
    expect(getTemplateById('paid-api-endpoint').name).toBe('Paid API Endpoint');
  });
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
cd apps/kivo/web
npm test -- --run src/data/soloMvp.test.ts
```

Expected: FAIL because `soloMvp.ts` does not exist.

- [ ] **Step 3: Implement product helper file**

Create `apps/kivo/web/src/data/soloMvp.ts`:

```ts
import type {
  Device,
  KivoFlow,
  KivoFlowUnit,
  KivoTemplate,
  KivoTemplateId,
  Payment,
  X402PricingRule,
} from '@/types/kivo';

export const soloMvpTemplates: KivoTemplate[] = [
  {
    id: 'device-pay-ev-charging',
    name: 'Device Pay / EV Charging',
    shortName: 'EV Charging',
    category: 'Device Pay',
    icon: 'solar:bolt-circle-bold-duotone',
    description: 'Monetize a charger, machine, locker, or gateway-controlled device by session, kWh, or time.',
    bestFor: 'IoT devices that need an authorization event before starting a paid session.',
    defaultResourceName: 'Garage charger',
    defaultPrice: '0.50',
    defaultUnit: 'kWh',
    integrationMode: 'gateway_sdk',
    primaryActionLabel: 'Create device flow',
  },
  {
    id: 'paid-api-endpoint',
    name: 'Paid API Endpoint',
    shortName: 'Paid API',
    category: 'API Pay',
    icon: 'solar:code-square-bold-duotone',
    description: 'Protect an HTTP route with x402 so callers pay before receiving the response.',
    bestFor: 'APIs, AI tools, premium endpoints, and machine clients.',
    defaultResourceName: 'Premium API route',
    defaultPrice: '0.05',
    defaultUnit: 'request',
    integrationMode: 'api_middleware',
    primaryActionLabel: 'Create API flow',
  },
  {
    id: 'iot-data-feed',
    name: 'IoT Data Feed',
    shortName: 'Data Feed',
    category: 'Data Feed',
    icon: 'solar:database-bold-duotone',
    description: 'Sell sensor readings, data packages, or telemetry streams after payment.',
    bestFor: 'Weather stations, industrial sensors, energy meters, and data marketplaces.',
    defaultResourceName: 'Sensor data feed',
    defaultPrice: '0.10',
    defaultUnit: 'reading',
    integrationMode: 'data_feed',
    primaryActionLabel: 'Create data flow',
  },
];

export const getTemplateById = (id: KivoTemplateId): KivoTemplate => {
  const template = soloMvpTemplates.find((candidate) => candidate.id === id);
  if (!template) {
    throw new Error(`Unknown Kivo template: ${id}`);
  }
  return template;
};

export const buildIntegrationSnippet = (input: {
  templateId: KivoTemplateId;
  resourceName: string;
  resource: string;
  price: string;
  unit: KivoFlowUnit;
}) => {
  if (input.templateId === 'paid-api-endpoint') {
    return `import { Kivo } from '@kivo/sdk';

const kivo = new Kivo({ apiKey: process.env.KIVO_API_KEY });

export async function GET(request: Request) {
  const access = await kivo.x402.requirePayment(request, {
    resource: '${input.resource}',
    amount: '${input.price}',
    unit: '${input.unit}',
  });

  if (!access.authorized) return access.response;

  return Response.json({ ok: true, resource: '${input.resourceName}' });
}`;
  }

  if (input.templateId === 'iot-data-feed') {
    return `import { Kivo } from '@kivo/sdk';

const kivo = new Kivo({ apiKey: process.env.KIVO_API_KEY });

await kivo.data.publish({
  resource: '${input.resource}',
  name: '${input.resourceName}',
  price: '${input.price}',
  unit: '${input.unit}',
  payload: await readSensorPayload(),
});`;
  }

  return `import { KivoDevice } from '@kivo/sdk';

const device = new KivoDevice({
  deviceId: process.env.KIVO_DEVICE_ID,
  apiKey: process.env.KIVO_DEVICE_KEY,
});

const session = await device.sessions.start({
  resource: '${input.resource}',
  price: '${input.price}',
  unit: '${input.unit}',
});

if (session.authorized) {
  await charger.unlock();
}`;
};

export const deriveSoloFlows = (input: {
  devices: Device[];
  payments: Payment[];
  pricingRules: X402PricingRule[];
}): KivoFlow[] => {
  const deviceFlows = input.devices.map((device) => {
    const devicePayments = input.payments.filter((payment) => payment.toDeviceId === device.id || payment.fromDeviceId === device.id);
    const confirmedRevenue = devicePayments
      .filter((payment) => payment.status === 'confirmed')
      .reduce((total, payment) => total + Number(payment.amount || 0), 0);
    const failedPaymentsCount = devicePayments.filter((payment) => payment.status === 'failed').length;
    const templateId = (device.metadata.templateId as KivoTemplateId | undefined) ?? 'device-pay-ev-charging';
    const template = getTemplateById(templateId);

    return {
      id: `flow_${device.id}`,
      templateId,
      name: device.name,
      status: device.status === 'active' ? 'active' : 'needs_setup',
      price: device.metadata.price ?? template.defaultPrice,
      unit: (device.metadata.unit as KivoFlowUnit | undefined) ?? template.defaultUnit,
      resource: device.metadata.resource ?? `/devices/${device.id}/session`,
      integrationMode: template.integrationMode,
      deviceId: device.id,
      revenueUsdc: confirmedRevenue,
      sessionsCount: devicePayments.length,
      paymentsCount: devicePayments.length,
      failedPaymentsCount,
      lastActivityAt: devicePayments[0]?.createdAt ?? device.updatedAt,
      setupChecklist: [
        { id: 'device', label: 'Device registered', complete: true },
        { id: 'wallet', label: 'Stellar wallet ready', complete: Boolean(device.stellarPublicKey) },
        { id: 'test', label: 'Test payment completed', complete: devicePayments.some((payment) => payment.status === 'confirmed') },
      ],
    } satisfies KivoFlow;
  });

  const apiFlows = input.pricingRules.map((rule) => {
    const payments = input.payments.filter((payment) => payment.memo?.includes(rule.resource));

    return {
      id: `flow_${rule.id}`,
      templateId: rule.resource.includes('data') ? 'iot-data-feed' : 'paid-api-endpoint',
      name: rule.description || rule.resource,
      status: rule.enabled ? 'active' : 'needs_setup',
      price: rule.amount,
      unit: rule.resource.includes('data') ? 'reading' : 'request',
      resource: rule.resource,
      integrationMode: rule.resource.includes('data') ? 'data_feed' : 'api_middleware',
      pricingRuleId: rule.id,
      revenueUsdc: payments.filter((payment) => payment.status === 'confirmed').reduce((total, payment) => total + Number(payment.amount || 0), 0),
      sessionsCount: payments.length,
      paymentsCount: payments.length,
      failedPaymentsCount: payments.filter((payment) => payment.status === 'failed').length,
      lastActivityAt: payments[0]?.createdAt ?? rule.updatedAt,
      setupChecklist: [
        { id: 'pricing', label: 'Pricing rule configured', complete: true },
        { id: 'resource', label: 'Protected resource defined', complete: Boolean(rule.resource) },
        { id: 'enabled', label: 'Flow enabled', complete: rule.enabled },
      ],
    } satisfies KivoFlow;
  });

  return [...deviceFlows, ...apiFlows];
};
```

- [ ] **Step 4: Run tests and verify they pass**

Run:

```bash
cd apps/kivo/web
npm test -- --run src/data/soloMvp.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/web/src/data/soloMvp.ts apps/kivo/web/src/data/soloMvp.test.ts
git commit -m "feat(kivo): add solo mvp flow helpers"
```

---

### Task 3: Product-First Routing And Navigation

**Files:**
- Modify: `apps/kivo/web/src/App.tsx`
- Modify: `apps/kivo/web/src/layouts/Sidebar.tsx`
- Modify: `apps/kivo/web/src/layouts/BottomNav.tsx`
- Modify: `apps/kivo/web/src/layouts/Topbar.tsx`
- Modify: `apps/kivo/web/src/components/CommandPalette.tsx`
- Create: `apps/kivo/web/src/pages/CreateFlowPage.tsx`
- Create: `apps/kivo/web/src/pages/FlowsPage.tsx`
- Create: `apps/kivo/web/src/pages/FlowDetailPage.tsx`
- Create: `apps/kivo/web/src/pages/AdvancedPage.tsx`

- [ ] **Step 1: Create lightweight route shell pages that compile**

Create `apps/kivo/web/src/pages/CreateFlowPage.tsx`:

```tsx
import { PageHeader } from '@/components/ui/PageHeader';

export default function CreateFlowPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create flow"
        title="O que voce quer monetizar?"
        icon="solar:add-circle-bold-duotone"
        description="Escolha um template e configure o primeiro fluxo Kivo."
      />
    </div>
  );
}
```

Create `apps/kivo/web/src/pages/FlowsPage.tsx`:

```tsx
import { PageHeader } from '@/components/ui/PageHeader';

export default function FlowsPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flows"
        title="Recursos monetizados"
        icon="solar:bolt-circle-bold-duotone"
        description="Acompanhe devices, APIs e data feeds que cobram via Kivo."
      />
    </div>
  );
}
```

Create `apps/kivo/web/src/pages/FlowDetailPage.tsx`:

```tsx
import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';

export default function FlowDetailPage() {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flow"
        title={id ?? 'Flow'}
        icon="solar:bolt-circle-bold-duotone"
        description="Detalhe operacional do recurso monetizado."
      />
    </div>
  );
}
```

Create `apps/kivo/web/src/pages/AdvancedPage.tsx`:

```tsx
import { PageHeader } from '@/components/ui/PageHeader';

export default function AdvancedPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Advanced"
        title="Ferramentas avancadas"
        icon="solar:settings-bold-duotone"
        description="x402, Etherfuse, MCP, webhooks, deploy e diagnosticos tecnicos."
      />
    </div>
  );
}
```

- [ ] **Step 2: Wire routes**

In `apps/kivo/web/src/App.tsx`, import the new pages:

```ts
import AdvancedPage from '@/pages/AdvancedPage';
import CreateFlowPage from '@/pages/CreateFlowPage';
import FlowDetailPage from '@/pages/FlowDetailPage';
import FlowsPage from '@/pages/FlowsPage';
```

Add these protected routes after the `dashboard` route:

```tsx
<Route path="create-flow" element={<CreateFlowPage />} />
<Route path="flows" element={<FlowsPage />} />
<Route path="flows/:id" element={<FlowDetailPage />} />
<Route path="advanced" element={<AdvancedPage />} />
```

- [ ] **Step 3: Replace sidebar primary nav**

In `apps/kivo/web/src/layouts/Sidebar.tsx`, replace `navGroups` with:

```ts
const navGroups = [
  {
    title: 'Produto',
    items: [
      { to: '/dashboard', icon: 'solar:home-angle-bold-duotone', label: 'Home' },
      { to: '/create-flow', icon: 'solar:add-circle-bold-duotone', label: 'Create Flow' },
      { to: '/flows', icon: 'solar:bolt-circle-bold-duotone', label: 'Flows' },
      { to: '/payments', icon: 'solar:wallet-money-bold-duotone', label: 'Payments' },
      { to: '/advanced', icon: 'solar:settings-bold-duotone', label: 'Advanced' },
    ],
  },
  {
    title: 'Atalhos',
    items: [
      { to: '/checkout', icon: 'solar:card-transfer-bold-duotone', label: 'Test Payment' },
      { to: '/operations', icon: 'solar:devices-bold-duotone', label: 'Operations' },
      { to: '/finance', icon: 'solar:chart-square-bold-duotone', label: 'Finance' },
    ],
  },
];
```

Also change the workspace status line from `Testnet ativa` to:

```tsx
Solo workspace
```

- [ ] **Step 4: Replace mobile bottom nav**

In `apps/kivo/web/src/layouts/BottomNav.tsx`, replace `items` with:

```ts
const items = [
  { to: '/dashboard', icon: 'solar:home-angle-bold-duotone', label: 'Home' },
  { to: '/create-flow', icon: 'solar:add-circle-bold-duotone', label: 'Criar' },
  { to: '/flows', icon: 'solar:bolt-circle-bold-duotone', label: 'Flows' },
  { to: '/payments', icon: 'solar:wallet-money-bold-duotone', label: 'Pay' },
  { to: '/advanced', icon: 'solar:settings-bold-duotone', label: 'Adv' },
];
```

- [ ] **Step 5: Update topbar titles**

In `apps/kivo/web/src/layouts/Topbar.tsx`, add these route titles:

```ts
'/create-flow': { title: 'Create Flow', icon: 'solar:add-circle-bold-duotone' },
'/flows': { title: 'Flows', icon: 'solar:bolt-circle-bold-duotone' },
'/advanced': { title: 'Advanced', icon: 'solar:settings-bold-duotone' },
```

Change subtitle text to:

```tsx
Monetize machines, APIs and data streams with x402
```

- [ ] **Step 6: Run build**

Run:

```bash
cd apps/kivo/web
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/kivo/web/src/App.tsx apps/kivo/web/src/layouts/Sidebar.tsx apps/kivo/web/src/layouts/BottomNav.tsx apps/kivo/web/src/layouts/Topbar.tsx apps/kivo/web/src/pages/CreateFlowPage.tsx apps/kivo/web/src/pages/FlowsPage.tsx apps/kivo/web/src/pages/FlowDetailPage.tsx apps/kivo/web/src/pages/AdvancedPage.tsx
git commit -m "feat(kivo): add solo product routes"
```

---

### Task 4: Build Create Flow Wizard

**Files:**
- Modify: `apps/kivo/web/src/pages/CreateFlowPage.tsx`
- Modify: `apps/kivo/web/src/data/soloMvp.ts`
- Test: `apps/kivo/web/src/data/soloMvp.test.ts`

- [ ] **Step 1: Add draft builder helper test**

Append to `apps/kivo/web/src/data/soloMvp.test.ts`:

```ts
import { createDefaultFlowDraft } from './soloMvp';

it('creates a default draft from a template', () => {
  const draft = createDefaultFlowDraft('device-pay-ev-charging');

  expect(draft.name).toBe('Garage charger');
  expect(draft.price).toBe('0.50');
  expect(draft.unit).toBe('kWh');
  expect(draft.resource).toBe('/devices/garage-charger/session');
});
```

- [ ] **Step 2: Run test and verify it fails**

Run:

```bash
cd apps/kivo/web
npm test -- --run src/data/soloMvp.test.ts
```

Expected: FAIL because `createDefaultFlowDraft` is not exported.

- [ ] **Step 3: Implement draft helper**

Append to `apps/kivo/web/src/data/soloMvp.ts`:

```ts
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const createDefaultFlowDraft = (templateId: KivoTemplateId) => {
  const template = getTemplateById(templateId);
  const slug = slugify(template.defaultResourceName);
  const resource =
    templateId === 'device-pay-ev-charging'
      ? `/devices/${slug}/session`
      : templateId === 'iot-data-feed'
        ? `/data/${slug}`
        : `/api/${slug}`;

  return {
    templateId,
    name: template.defaultResourceName,
    price: template.defaultPrice,
    unit: template.defaultUnit,
    resource,
  };
};
```

- [ ] **Step 4: Replace CreateFlowPage with wizard UI**

Replace `apps/kivo/web/src/pages/CreateFlowPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { buildIntegrationSnippet, createDefaultFlowDraft, getTemplateById, soloMvpTemplates } from '@/data/soloMvp';
import type { CreateFlowDraft, KivoTemplateId } from '@/types/kivo';

const steps = ['Template', 'Pricing', 'Integrate', 'Test', 'Publish'];

export default function CreateFlowPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<KivoTemplateId>('device-pay-ev-charging');
  const [draft, setDraft] = useState<CreateFlowDraft>(() => createDefaultFlowDraft('device-pay-ev-charging'));
  const selectedTemplate = getTemplateById(selectedTemplateId);
  const snippet = useMemo(
    () => buildIntegrationSnippet({
      templateId: draft.templateId,
      resourceName: draft.name,
      resource: draft.resource,
      price: draft.price,
      unit: draft.unit,
    }),
    [draft],
  );

  const selectTemplate = (templateId: KivoTemplateId) => {
    setSelectedTemplateId(templateId);
    setDraft(createDefaultFlowDraft(templateId));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Create Flow"
        title="O que voce quer monetizar?"
        icon="solar:add-circle-bold-duotone"
        description="Comece com um template pronto, configure preco e teste o pagamento antes de publicar."
        action={<Link to="/flows" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Ver flows</Link>}
      />

      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step} className="rounded-2xl border border-white/5 bg-neutral-900/80 p-4">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-black">{index + 1}</span>
            <p className="mt-3 text-sm font-bold text-white">{step}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-bricolage text-2xl font-bold text-white">Escolha um template</h2>
          <p className="mt-2 text-sm text-neutral-500">O MVP promove tres caminhos para manter a demo clara e completa.</p>
          <div className="mt-5 grid gap-3">
            {soloMvpTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => selectTemplate(template.id)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selectedTemplateId === template.id ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/25 hover:bg-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Icon icon={template.icon} className="text-2xl text-emerald-400" />
                    <div>
                      <h3 className="font-bold text-white">{template.name}</h3>
                      <p className="mt-1 text-xs text-neutral-500">{template.category}</p>
                    </div>
                  </div>
                  {selectedTemplateId === template.id && <Icon icon="solar:check-circle-bold" className="text-xl text-emerald-400" />}
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-400">{template.description}</p>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <Badge tone="ready">{selectedTemplate.category}</Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">{selectedTemplate.shortName}</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{selectedTemplate.bestFor}</p>
            </div>
            <Icon icon={selectedTemplate.icon} className="text-4xl text-emerald-400" />
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <label className="md:col-span-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Nome do recurso</span>
              <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500" />
            </label>
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Preco</span>
              <input value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500" />
            </label>
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Unidade</span>
              <input value={draft.unit} onChange={(event) => setDraft({ ...draft, unit: event.target.value as CreateFlowDraft['unit'] })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500" />
            </label>
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Asset</span>
              <p className="mt-2 rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white">USDC</p>
            </label>
            <label className="md:col-span-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Resource path</span>
              <input value={draft.resource} onChange={(event) => setDraft({ ...draft, resource: event.target.value })} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500" />
            </label>
          </div>

          <div className="mt-6 rounded-2xl border border-white/5 bg-black/30 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Integration snippet</p>
              <Badge tone="active">{selectedTemplate.integrationMode.replace('_', ' ')}</Badge>
            </div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap rounded-xl bg-black/40 p-4 text-xs leading-6 text-emerald-100">{snippet}</pre>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/checkout" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              Testar pagamento
              <Icon icon="solar:card-transfer-bold" />
            </Link>
            <Link to="/flows" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">
              Publicar flow
              <Icon icon="solar:round-arrow-right-up-bold" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run tests and build**

Run:

```bash
cd apps/kivo/web
npm test -- --run src/data/soloMvp.test.ts
npm run build
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/kivo/web/src/data/soloMvp.ts apps/kivo/web/src/data/soloMvp.test.ts apps/kivo/web/src/pages/CreateFlowPage.tsx
git commit -m "feat(kivo): build create flow wizard"
```

---

### Task 5: Rebuild Home As Solo Command Center

**Files:**
- Modify: `apps/kivo/web/src/pages/WorkspaceHomePage.tsx`

- [ ] **Step 1: Replace persona grid with solo workspace dashboard**

Replace `apps/kivo/web/src/pages/WorkspaceHomePage.tsx` with a page that:

```tsx
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { deriveSoloFlows, soloMvpTemplates } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useAuthStore } from '@/stores';
import { formatCurrency, formatDateTime, statusLabel } from '@/utils/format';

export default function WorkspaceHomePage() {
  const user = useAuthStore((state) => state.user);
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);
  const flows = deriveSoloFlows({
    devices: devices.data ?? [],
    payments: payments.data ?? [],
    pricingRules: pricing.data ?? [],
  });
  const activeFlows = flows.filter((flow) => flow.status === 'active');
  const needsSetup = flows.filter((flow) => flow.status === 'needs_setup');
  const workspaceName = user?.organization?.trim() || 'Kivo workspace';

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Solo workspace"
        title={`Monetize seu primeiro recurso no ${workspaceName}`}
        icon="solar:home-angle-bold-duotone"
        description="Crie um flow, teste um pagamento x402 real e acompanhe receita sem entrar em detalhes de protocolo."
        action={<Link to="/create-flow" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Create Flow <Icon icon="solar:add-circle-bold" /></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Flows ativos" value={activeFlows.length.toString()} detail={`${flows.length} criados`} icon="solar:bolt-circle-bold-duotone" />
        <StatCard title="Receita" value={formatCurrency(summary.data?.totalVolumeUsdc ?? 0)} icon="solar:wallet-money-bold-duotone" tone="blue" />
        <StatCard title="Pagamentos" value={(payments.data?.length ?? 0).toString()} icon="solar:card-transfer-bold-duotone" />
        <StatCard title="Setup" value={needsSetup.length ? `${needsSetup.length} acao` : 'ok'} icon="solar:settings-minimalistic-bold-duotone" tone={needsSetup.length ? 'amber' : 'emerald'} />
        <StatCard title="API" value={summary.data?.health.api ?? 'ok'} detail={`Stellar ${summary.data?.health.stellar ?? 'ok'}`} icon="solar:pulse-2-bold-duotone" tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-2xl font-bold text-white">Comece por um template</h2>
              <p className="mt-1 text-sm text-neutral-500">Tres caminhos focados para entregar um produto testavel em duas semanas.</p>
            </div>
            <Link to="/create-flow" className="text-xs font-bold text-emerald-400">Criar</Link>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {soloMvpTemplates.map((template) => (
              <Link key={template.id} to="/create-flow" className="rounded-2xl border border-white/5 bg-black/25 p-4 hover:border-emerald-500/25 hover:bg-emerald-500/5">
                <Icon icon={template.icon} className="text-3xl text-emerald-400" />
                <h3 className="mt-4 font-bold text-white">{template.shortName}</h3>
                <p className="mt-2 text-xs leading-5 text-neutral-500">{template.description}</p>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-2xl font-bold text-white">Proximo melhor passo</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            {flows.length ? 'Teste o pagamento do flow principal e publique quando a integracao estiver verde.' : 'Crie um flow EV Charging para demonstrar Device Pay com x402 e Stellar.'}
          </p>
          <div className="mt-5 grid gap-3">
            <Link to="/create-flow" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white hover:bg-white/10">Create Flow <Icon icon="solar:arrow-right-linear" /></Link>
            <Link to="/checkout" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white hover:bg-white/10">Testar pagamento <Icon icon="solar:arrow-right-linear" /></Link>
            <Link to="/advanced" className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm font-bold text-white hover:bg-white/10">Advanced <Icon icon="solar:arrow-right-linear" /></Link>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Flows recentes</h2>
              <p className="text-sm text-neutral-500">Recursos monetizados ou prontos para setup.</p>
            </div>
            <Link to="/flows" className="text-xs font-bold text-emerald-400">Ver todos</Link>
          </div>
          <div className="space-y-3">
            {flows.slice(0, 4).map((flow) => (
              <Link key={flow.id} to={`/flows/${flow.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-3 hover:bg-white/5">
                <div>
                  <p className="font-medium text-white">{flow.name}</p>
                  <p className="mt-1 text-xs text-neutral-500">{flow.price} USDC / {flow.unit}</p>
                </div>
                <Badge tone={flow.status}>{statusLabel(flow.status)}</Badge>
              </Link>
            ))}
            {!flows.length && <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-500">Nenhum flow criado ainda.</p>}
          </div>
        </Card>

        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Pagamentos recentes</h2>
              <p className="text-sm text-neutral-500">Receita, status e auditoria em uma lista legivel.</p>
            </div>
            <Link to="/payments" className="text-xs font-bold text-emerald-400">Payments</Link>
          </div>
          <div className="space-y-3">
            {(payments.data ?? []).slice(0, 4).map((payment) => (
              <Link key={payment.id} to={`/payments/${payment.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-3 hover:bg-white/5">
                <div>
                  <p className="text-sm font-bold text-white">{payment.amount} {payment.assetCode}</p>
                  <p className="mt-1 text-xs text-neutral-500">{formatDateTime(payment.createdAt)}</p>
                </div>
                <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
              </Link>
            ))}
            {!payments.data?.length && <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-500">Nenhum pagamento registrado ainda.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

Run:

```bash
cd apps/kivo/web
npm run build
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add apps/kivo/web/src/pages/WorkspaceHomePage.tsx
git commit -m "feat(kivo): rebuild home for solo workspace"
```

---

### Task 6: Build Flows List And Detail

**Files:**
- Modify: `apps/kivo/web/src/pages/FlowsPage.tsx`
- Modify: `apps/kivo/web/src/pages/FlowDetailPage.tsx`

- [ ] **Step 1: Implement FlowsPage**

Replace `apps/kivo/web/src/pages/FlowsPage.tsx` with a page that loads devices, payments, and x402 pricing rules, derives flows, and renders cards with CTA links.

Use this implementation:

```tsx
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { deriveSoloFlows } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatCurrency, formatDateTime, statusLabel } from '@/utils/format';

export default function FlowsPage() {
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);
  const flows = deriveSoloFlows({
    devices: devices.data ?? [],
    payments: payments.data ?? [],
    pricingRules: pricing.data ?? [],
  });

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flows"
        title="Recursos monetizados"
        icon="solar:bolt-circle-bold-duotone"
        description="Cada flow junta template, preco, integracao, pagamento e monitoramento."
        action={<Link to="/create-flow" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Create Flow</Link>}
      />

      <div className="grid gap-5 xl:grid-cols-3">
        {flows.map((flow) => (
          <Link key={flow.id} to={`/flows/${flow.id}`} className="group rounded-2xl border border-white/5 bg-neutral-900/80 p-5 premium-shadow hover:border-emerald-500/25">
            <div className="flex items-start justify-between gap-4">
              <Icon icon="solar:bolt-circle-bold-duotone" className="text-3xl text-emerald-400" />
              <Badge tone={flow.status}>{statusLabel(flow.status)}</Badge>
            </div>
            <h2 className="mt-5 font-bricolage text-xl font-bold text-white">{flow.name}</h2>
            <p className="mt-2 font-mono text-xs text-neutral-500">{flow.resource}</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-black/25 p-3">
                <p className="text-neutral-500">Preco</p>
                <p className="mt-1 font-bold text-white">{flow.price}/{flow.unit}</p>
              </div>
              <div className="rounded-xl bg-black/25 p-3">
                <p className="text-neutral-500">Receita</p>
                <p className="mt-1 font-bold text-white">{formatCurrency(flow.revenueUsdc)}</p>
              </div>
              <div className="rounded-xl bg-black/25 p-3">
                <p className="text-neutral-500">Sessoes</p>
                <p className="mt-1 font-bold text-white">{flow.sessionsCount}</p>
              </div>
            </div>
            <p className="mt-5 text-xs text-neutral-500">Ultima atividade {flow.lastActivityAt ? formatDateTime(flow.lastActivityAt) : 'sem atividade'}</p>
          </Link>
        ))}
      </div>

      {!flows.length && (
        <Card>
          <h2 className="font-bricolage text-2xl font-bold text-white">Nenhum flow ainda</h2>
          <p className="mt-2 text-sm text-neutral-500">Crie um flow EV Charging para ter o primeiro caminho completo de demo.</p>
          <Link to="/create-flow" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            Create Flow
            <Icon icon="solar:add-circle-bold" />
          </Link>
        </Card>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Implement FlowDetailPage**

Replace `apps/kivo/web/src/pages/FlowDetailPage.tsx` with a detail page that finds the derived flow by route id, displays checklist, snippet, and payment rows.

The implementation must:

- Load `devices`, `payments`, `pricingRules`.
- Call `deriveSoloFlows`.
- Find `flow.id === id`.
- Render a not-found card if missing.
- Show checklist with complete/incomplete states.
- Show integration snippet using `buildIntegrationSnippet`.
- Link to `/checkout` with label `Testar pagamento`.

- [ ] **Step 3: Run build**

Run:

```bash
cd apps/kivo/web
npm run build
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/kivo/web/src/pages/FlowsPage.tsx apps/kivo/web/src/pages/FlowDetailPage.tsx
git commit -m "feat(kivo): add flow list and detail"
```

---

### Task 7: Move Developer Surfaces Into Advanced

**Files:**
- Modify: `apps/kivo/web/src/pages/AdvancedPage.tsx`
- Modify: `apps/kivo/web/src/pages/IntegrationsPage.tsx`
- Modify: `apps/kivo/web/src/pages/TemplatesPage.tsx`
- Modify: `apps/kivo/web/src/pages/X402Page.tsx`
- Modify: `apps/kivo/web/src/pages/SettingsPage.tsx`

- [ ] **Step 1: Implement AdvancedPage hub**

Replace `apps/kivo/web/src/pages/AdvancedPage.tsx` with cards for:

```ts
const advancedTools = [
  { title: 'Devices', route: '/devices', icon: 'solar:devices-bold-duotone', description: 'Device registry, wallets, API keys and status.' },
  { title: 'API Keys', route: '/api-keys', icon: 'solar:key-minimalistic-bold-duotone', description: 'Server-side credentials for SDKs, gateways and workers.' },
  { title: 'Webhooks', route: '/webhooks', icon: 'solar:widget-2-bold-duotone', description: 'Delivery logs, retry state and event subscriptions.' },
  { title: 'x402 Rules', route: '/x402', icon: 'solar:shield-keyhole-bold-duotone', description: 'Pricing rules and protected HTTP resources.' },
  { title: 'MCP Tools', route: '/mcp', icon: 'solar:cpu-bolt-bold-duotone', description: 'Agent tools for paid resources and automation.' },
  { title: 'Deploy', route: '/deploy', icon: 'solar:rocket-bold-duotone', description: 'Cloud readiness, secrets and service checks.' },
  { title: 'Workflows', route: '/workflows', icon: 'solar:routing-2-bold-duotone', description: 'Workers, queues and durable automation direction.' },
  { title: 'Settings', route: '/settings', icon: 'solar:settings-bold-duotone', description: 'Workspace, environment and integration settings.' },
];
```

Render them as dense cards with `Link`.

- [ ] **Step 2: Rename visible x402 language**

In `apps/kivo/web/src/pages/X402Page.tsx`:

- Change title `x402 Playground` to `x402 Rules`.
- Change page description from playground language to "Configure protected resources and inspect payment headers for advanced integrations."
- Change buttons from "Ver checkout" to "Testar pagamento".

- [ ] **Step 3: Reduce TemplatesPage to three promoted templates**

In `apps/kivo/web/src/pages/TemplatesPage.tsx`, replace the local `templates` list with `soloMvpTemplates` and point actions to `/create-flow`.

- [ ] **Step 4: Run lint**

Run:

```bash
cd apps/kivo/web
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/web/src/pages/AdvancedPage.tsx apps/kivo/web/src/pages/IntegrationsPage.tsx apps/kivo/web/src/pages/TemplatesPage.tsx apps/kivo/web/src/pages/X402Page.tsx apps/kivo/web/src/pages/SettingsPage.tsx
git commit -m "feat(kivo): move developer tools under advanced"
```

---

### Task 8: Reframe Test Payment And Payments Ledger

**Files:**
- Modify: `apps/kivo/web/src/pages/CheckoutPage.tsx`
- Modify: `apps/kivo/web/src/pages/PaymentsPage.tsx`

- [ ] **Step 1: Update CheckoutPage labels**

In `apps/kivo/web/src/pages/CheckoutPage.tsx`:

- Page eyebrow: `Test Payment`
- Page title: `Teste o pagamento do flow`
- Primary description: `Use este passo para validar funding, challenge x402, assinatura Stellar e liberacao do recurso antes de publicar.`
- Replace visible `Playground tecnico` with `Advanced x402`.
- Replace visible `Simular`, where present, with `Testar` or `Avancar sandbox Etherfuse` only inside an advanced disclosure.

- [ ] **Step 2: Hide raw Etherfuse JSON behind a disclosure**

Wrap the raw `pre` area for `previewEtherfuseJson(anchorPreview)` in:

```tsx
<details className="rounded-2xl border border-white/5 bg-black/25 p-4">
  <summary className="cursor-pointer text-sm font-bold text-white">Ver payload tecnico</summary>
  <pre className="mt-4 max-h-52 overflow-auto whitespace-pre-wrap break-all rounded-2xl border border-white/5 bg-black/35 p-4 text-xs text-emerald-100">
    {previewEtherfuseJson(anchorPreview)}
  </pre>
</details>
```

- [ ] **Step 3: Update PaymentsPage copy**

In `apps/kivo/web/src/pages/PaymentsPage.tsx`:

- Title: `Payments`
- Description: `Ledger legivel para acompanhar pagamentos, status Stellar, falhas e comprovantes.`
- Primary action should go to `/checkout` with label `Testar pagamento`.
- Keep manual create payment form lower on the page and label it `Advanced: criar pagamento manual`.

- [ ] **Step 4: Run build**

Run:

```bash
cd apps/kivo/web
npm run build
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/web/src/pages/CheckoutPage.tsx apps/kivo/web/src/pages/PaymentsPage.tsx
git commit -m "feat(kivo): reframe payment testing and ledger"
```

---

### Task 9: Command Palette And Visual Copy Sweep

**Files:**
- Modify: `apps/kivo/web/src/components/CommandPalette.tsx`
- Search/modify any file under `apps/kivo/web/src/pages`

- [ ] **Step 1: Update command palette route priority**

In `apps/kivo/web/src/components/CommandPalette.tsx`, ensure the first commands are:

```ts
[
  { label: 'Home', route: '/dashboard' },
  { label: 'Create Flow', route: '/create-flow' },
  { label: 'Flows', route: '/flows' },
  { label: 'Payments', route: '/payments' },
  { label: 'Test Payment', route: '/checkout' },
  { label: 'Advanced', route: '/advanced' },
]
```

- [ ] **Step 2: Search for sandbox/playground/simular wording**

Run:

```bash
rg -n "sandbox|Sandbox|playground|Playground|Simular|simular|Console tecnico|console tecnico" apps/kivo/web/src
```

Expected after edits:

- `sandbox` may remain only in Etherfuse mode/status text, README, or advanced/debug copy.
- `Playground` should not appear in primary nav or Home.
- `Simular checkout` should not appear.

- [ ] **Step 3: Fix primary UI copy**

For each primary-page match:

- Replace `Simular checkout` with `Testar pagamento`.
- Replace `x402 Playground` with `x402 Rules`.
- Replace `Console tecnico` with `Advanced tools`.
- Keep `sandbox` only when naming Etherfuse sandbox/testnet state.

- [ ] **Step 4: Run lint**

Run:

```bash
cd apps/kivo/web
npm run lint
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/kivo/web/src
git commit -m "feat(kivo): polish solo product copy"
```

---

### Task 10: Browser Verification And Final QA

**Files:**
- No planned source edits unless QA finds issues.

- [ ] **Step 1: Run automated checks**

Run:

```bash
cd apps/kivo/web
npm test -- --run
npm run lint
npm run build
```

Expected: PASS.

Run:

```bash
cd apps/kivo
go test ./cmd/... ./internal/...
```

Expected: PASS.

- [ ] **Step 2: Start or reuse local web server**

Run:

```bash
cd apps/kivo/web
npm run dev
```

Expected: Vite serves the app on an available local port, commonly `http://127.0.0.1:5174`.

- [ ] **Step 3: Browser smoke desktop**

Open the app in the in-app browser and verify:

- `/dashboard` shows solo command center, not persona grid.
- `/create-flow` shows exactly three templates.
- Selecting each template updates the form and snippet.
- `/flows` shows derived flows or a useful empty state.
- `/payments` reads like a ledger.
- `/advanced` contains old technical pages.
- `/checkout` says Test Payment and raw payloads are hidden by default.

- [ ] **Step 4: Browser smoke mobile**

Set mobile viewport and verify:

- Bottom nav labels fit: Home, Criar, Flows, Pay, Adv.
- Create Flow cards do not overflow.
- Snippet area scrolls horizontally/vertically without covering actions.
- Payment ledger remains readable.

- [ ] **Step 5: Fix visual blockers**

If browser QA finds clipped text, overlapping cards, broken nav, or unreadable controls:

1. Patch the exact component.
2. Re-run `npm run build`.
3. Re-check the affected route in browser.

- [ ] **Step 6: Final commit**

Only if QA produced additional edits:

```bash
git add apps/kivo/web/src
git commit -m "fix(kivo): polish solo mvp browser qa"
```

---

## Plan Self-Review

- Spec coverage: The plan covers solo-first navigation, three templates, a Create Flow wizard, derived flows, a product Home, Payments ledger, Advanced hiding of technical tools, and payment test reframing.
- Completion marker scan: No task contains unresolved implementation markers or vague future work. SDK snippets intentionally use environment variable names rather than fake secret values.
- Type consistency: `KivoTemplateId`, `KivoFlow`, `CreateFlowDraft`, `deriveSoloFlows`, `soloMvpTemplates`, and `buildIntegrationSnippet` are defined before use.
- Scope control: This plan does not add team roles, enterprise RBAC, 12 templates, or a new backend table. Persisted product flows can be a later backend iteration after the demo UX is stable.
