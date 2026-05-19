# Kivo Studio Gateway Product Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Gateway-core + Studio-led Kivo product surface: Studio with AI-agent guided flow creation, physical/digital Gateway runtime concepts, downloadable TypeScript SDK, real testnet validation states, private mainnet launch path, and Power Totem as the only functional hackathon template.

**Architecture:** Keep the current Vite React app, Supabase Edge Function API, and existing Gateway package. Add a focused Kivo Studio domain layer that defines solution intents, flow drafts, gateway modes, SDK export bundles, validation runs, launch options, and template statuses. Implement UI in product-facing routes while keeping developer/ops routes behind existing dev controls.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Tailwind CSS, Supabase Edge Functions on Deno, TypeScript SDK package under `apps/kivo/sdk`, existing Gateway package under `apps/kivo/gateway`.

---

## Scope Check

The approved spec spans five subsystems: Studio UX, Gateway runtime, SDK, API validation, and launch/templates. This plan keeps them in one program roadmap but decomposes them into independently testable slices. Execute tasks in order unless using subagents with non-overlapping write sets.

Do not touch unrelated dirty files currently present in the worktree:

- `supabase/functions/kivo-api/deno.lock`
- `apps/kivo/demo/`
- `output/`

## File Structure

- Modify `apps/kivo/web/src/types/kivo.ts`
  - Owns shared front-end contracts.
  - Add Studio, Gateway mode, validation, SDK export, launch, and template status types.
- Modify `apps/kivo/web/src/services/kivoClient.ts`
  - Owns API client contract.
  - Add Studio/Gateway/SDK/validation/launch methods using real HTTP routes.
- Modify `apps/kivo/web/src/services/kivoClient.test.ts`
  - Verifies new client methods call documented API paths and do not fabricate success.
- Create `apps/kivo/web/src/data/studioExperience.ts`
  - Owns static copy, agent roles, wizard steps, gateway modes, and roadmap template metadata used by the UI.
- Create `apps/kivo/web/src/data/studioExperience.test.ts`
  - Verifies only Power Totem is marked functional and future templates are not shown as ready.
- Modify `apps/kivo/web/src/App.tsx`
  - Add product-facing routes for Studio, Gateway, SDK, validation, and launch.
- Modify `apps/kivo/web/src/layouts/Sidebar.tsx`
  - Make product routes easy to reach and keep dev routes secondary.
- Modify `apps/kivo/web/src/layouts/BottomNav.tsx`
  - Add mobile-first product routes.
- Replace `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
  - Reframe from Power Totem-only Studio to Kivo Studio entry point.
- Create `apps/kivo/web/src/pages/GatewayPage.tsx`
  - Product page for physical and digital Gateway modes.
- Create `apps/kivo/web/src/pages/SdkPage.tsx`
  - Product page for downloadable SDK, examples, adapters, and tests.
- Create `apps/kivo/web/src/pages/ValidationPage.tsx`
  - Product page for x402 + Etherfuse testnet validation.
- Create `apps/kivo/web/src/pages/LaunchPage.tsx`
  - Product page for private mainnet billing or public template publishing.
- Modify `apps/kivo/web/src/pages/TemplatesPage.tsx`
  - Show Power Totem as functional and all other templates as roadmap/marketplace.
- Create `apps/kivo/sdk/package.json`
  - New SDK package metadata.
- Create `apps/kivo/sdk/tsconfig.json`
  - SDK TypeScript config.
- Create `apps/kivo/sdk/src/index.ts`
  - SDK public exports.
- Create `apps/kivo/sdk/src/client.ts`
  - Typed Kivo API client.
- Create `apps/kivo/sdk/src/x402.ts`
  - x402 helper functions.
- Create `apps/kivo/sdk/src/gateway.ts`
  - Gateway helper functions and types.
- Create `apps/kivo/sdk/src/adapters/serverless.ts`
  - Digital gateway adapter for serverless/API guard usage.
- Create `apps/kivo/sdk/src/adapters/raspberry.ts`
  - Physical gateway adapter contract for Raspberry/edge usage.
- Create `apps/kivo/sdk/examples/power-totem.ts`
  - Example using the functional hackathon template.
- Create `apps/kivo/sdk/src/client.test.ts`
  - SDK client tests.
- Create `apps/kivo/sdk/src/x402.test.ts`
  - x402 helper tests.
- Create `supabase/functions/kivo-api/studioDomain.ts`
  - Pure functions for Studio flow drafts, validation states, and launch eligibility.
- Create `supabase/functions/kivo-api/studioDomain_test.ts`
  - Deno tests for Studio domain behavior.
- Modify `supabase/functions/kivo-api/index.ts`
  - Add HTTP routes for Studio, SDK export metadata, validation runs, launch options, and template statuses.
- Modify Kivo docs:
  - `apps/kivo/README.md`
  - `apps/kivo/DELIVERY.md`
  - `apps/kivo/POWER_TOTEM_DEMO.md`
  - `apps/landing-page/src/pages/doc/ai/kivo/index.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx`

## Task 1: Add Studio Product Contracts To Web Types And Client

**Files:**
- Modify: `apps/kivo/web/src/types/kivo.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.ts`
- Modify: `apps/kivo/web/src/services/kivoClient.test.ts`

- [ ] **Step 1: Add failing client tests for Studio routes**

Append these tests inside the existing `describe('HttpKivoApiClient', () => { ... })` block in `apps/kivo/web/src/services/kivoClient.test.ts`:

```ts
  it('creates Studio solution intents through the real API route', async () => {
    let requestedUrl = '';
    let method = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        body = String(init?.body ?? '');
        return jsonResponse({
          id: 'intent_power_api',
          prompt: 'Quero cobrar por uma API de dados',
          surface: 'digital',
          interactionModel: 'M2M',
          recommendedGatewayMode: 'api_guard',
          createdAt: '2026-05-19T12:00:00Z',
        });
      },
    });

    const intent = await client.createStudioIntent({
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
    });

    expect(requestedUrl).toBe('https://api.kivo.example/v1/studio/intents');
    expect(method).toBe('POST');
    expect(JSON.parse(body)).toEqual({
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
    });
    expect(intent.recommendedGatewayMode).toBe('api_guard');
  });

  it('starts validation runs without returning fabricated success', async () => {
    let requestedUrl = '';
    let method = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        return jsonResponse({
          id: 'val_1',
          flowId: 'flow_1',
          status: 'needs_connection',
          steps: [
            {
              id: 'gateway',
              label: 'Gateway',
              status: 'needs_connection',
              message: 'Conecte um Gateway antes de validar',
            },
          ],
          createdAt: '2026-05-19T12:00:00Z',
          updatedAt: '2026-05-19T12:00:00Z',
        });
      },
    });

    const validation = await client.startStudioValidation('flow_1');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/studio/flows/flow_1/validation-runs');
    expect(method).toBe('POST');
    expect(validation.status).toBe('needs_connection');
    expect(validation.status).not.toBe('passed');
  });
```

- [ ] **Step 2: Run the client tests and verify they fail**

Run:

```powershell
npm --prefix apps/kivo/web test -- kivoClient.test.ts
```

Expected: FAIL because `createStudioIntent` and `startStudioValidation` are not defined on the client.

- [ ] **Step 3: Add Studio types**

Append this block in `apps/kivo/web/src/types/kivo.ts` after the existing `DashboardSummary` interface:

```ts
export type KivoSolutionSurface = 'physical' | 'digital' | 'hybrid';
export type KivoInteractionModel = 'H2M' | 'M2M' | 'A2M' | 'mixed';
export type KivoGatewayMode =
  | 'raspberry'
  | 'edge_device'
  | 'physical_totem'
  | 'proxy'
  | 'middleware'
  | 'sidecar'
  | 'worker'
  | 'api_guard'
  | 'plugin'
  | 'serverless_function';

export type KivoStudioAgentId =
  | 'discovery'
  | 'flow_architect'
  | 'gateway'
  | 'sdk'
  | 'validation'
  | 'launch';

export type KivoValidationStatus =
  | 'not_configured'
  | 'needs_connection'
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'needs_user_action';

export type KivoLaunchOptionId = 'private_mainnet' | 'stay_testnet' | 'public_template';
export type KivoTemplateStatus = 'functional' | 'planned' | 'research' | 'alpha' | 'beta';

export interface StudioIntentInput {
  prompt: string;
  surface: KivoSolutionSurface;
}

export interface StudioIntent {
  id: string;
  prompt: string;
  surface: KivoSolutionSurface;
  interactionModel: KivoInteractionModel;
  recommendedGatewayMode: KivoGatewayMode;
  createdAt: string;
}

export interface StudioFlow {
  id: string;
  intentId: string;
  name: string;
  surface: KivoSolutionSurface;
  interactionModel: KivoInteractionModel;
  gatewayMode: KivoGatewayMode;
  resourceName: string;
  price: string;
  asset: string;
  accessRule: string;
  status: 'draft' | 'needs_setup' | 'validating' | 'validated' | 'ready_to_launch' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface StudioValidationStep {
  id: 'gateway' | 'x402' | 'etherfuse' | 'payment' | 'release' | string;
  label: string;
  status: KivoValidationStatus;
  message: string;
  evidence?: Record<string, unknown>;
}

export interface StudioValidationRun {
  id: string;
  flowId: string;
  status: KivoValidationStatus;
  steps: StudioValidationStep[];
  createdAt: string;
  updatedAt: string;
}

export interface SdkExportBundle {
  flowId: string;
  packageName: '@kivo/sdk';
  version: string;
  downloadUrl: string;
  installCommand: string;
  snippets: Array<{
    id: string;
    label: string;
    language: 'ts' | 'bash' | 'json';
    code: string;
  }>;
}

export interface StudioLaunchOption {
  id: KivoLaunchOptionId;
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
}

export interface StudioTemplateSummary {
  id: string;
  name: string;
  status: KivoTemplateStatus;
  description: string;
  surface: KivoSolutionSurface;
  isFunctionalHackathonTemplate: boolean;
}
```

- [ ] **Step 4: Extend `KivoApiClient`**

Add these methods to the `KivoApiClient` interface in `apps/kivo/web/src/services/kivoClient.ts`:

```ts
  createStudioIntent(input: StudioIntentInput): Promise<StudioIntent>;
  listStudioFlows(): Promise<StudioFlow[]>;
  getStudioFlow(id: string): Promise<StudioFlow>;
  createStudioFlow(intentId: string): Promise<StudioFlow>;
  updateStudioGatewayMode(flowId: string, gatewayMode: KivoGatewayMode): Promise<StudioFlow>;
  getSdkExportBundle(flowId: string): Promise<SdkExportBundle>;
  startStudioValidation(flowId: string): Promise<StudioValidationRun>;
  getStudioValidationRun(flowId: string, runId: string): Promise<StudioValidationRun>;
  listStudioLaunchOptions(flowId: string): Promise<StudioLaunchOption[]>;
  listStudioTemplates(): Promise<StudioTemplateSummary[]>;
```

Also add these names to the existing import list from `@/types/kivo`:

```ts
  KivoGatewayMode,
  SdkExportBundle,
  StudioFlow,
  StudioIntent,
  StudioIntentInput,
  StudioLaunchOption,
  StudioTemplateSummary,
  StudioValidationRun,
```

- [ ] **Step 5: Implement the client methods**

Add these methods inside `HttpKivoApiClient` before `private async request<T>`:

```ts
  async createStudioIntent(input: StudioIntentInput): Promise<StudioIntent> {
    return this.request('/v1/studio/intents', { method: 'POST', body: JSON.stringify(input) });
  }

  async listStudioFlows(): Promise<StudioFlow[]> {
    return this.request('/v1/studio/flows');
  }

  async getStudioFlow(id: string): Promise<StudioFlow> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(id)}`);
  }

  async createStudioFlow(intentId: string): Promise<StudioFlow> {
    return this.request('/v1/studio/flows', { method: 'POST', body: JSON.stringify({ intentId }) });
  }

  async updateStudioGatewayMode(flowId: string, gatewayMode: KivoGatewayMode): Promise<StudioFlow> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/gateway-mode`, {
      method: 'PUT',
      body: JSON.stringify({ gatewayMode }),
    });
  }

  async getSdkExportBundle(flowId: string): Promise<SdkExportBundle> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/sdk-export`);
  }

  async startStudioValidation(flowId: string): Promise<StudioValidationRun> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/validation-runs`, { method: 'POST' });
  }

  async getStudioValidationRun(flowId: string, runId: string): Promise<StudioValidationRun> {
    return this.request(
      `/v1/studio/flows/${encodeURIComponent(flowId)}/validation-runs/${encodeURIComponent(runId)}`,
    );
  }

  async listStudioLaunchOptions(flowId: string): Promise<StudioLaunchOption[]> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/launch-options`);
  }

  async listStudioTemplates(): Promise<StudioTemplateSummary[]> {
    return this.request('/v1/studio/templates');
  }
```

- [ ] **Step 6: Run tests**

Run:

```powershell
npm --prefix apps/kivo/web test -- kivoClient.test.ts
```

Expected: PASS.

- [ ] **Step 7: Commit**

Run:

```powershell
git add apps/kivo/web/src/types/kivo.ts apps/kivo/web/src/services/kivoClient.ts apps/kivo/web/src/services/kivoClient.test.ts
git commit -m "feat(kivo): add studio product api contracts"
```

## Task 2: Add Studio Experience Data With No Fake Ready States

**Files:**
- Create: `apps/kivo/web/src/data/studioExperience.ts`
- Create: `apps/kivo/web/src/data/studioExperience.test.ts`

- [ ] **Step 1: Write the failing data tests**

Create `apps/kivo/web/src/data/studioExperience.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { gatewayModes, studioAgents, studioSteps, studioTemplates } from './studioExperience';

describe('studioExperience', () => {
  it('marks only Power Totem as the functional hackathon template', () => {
    const functionalTemplates = studioTemplates.filter((template) => template.status === 'functional');

    expect(functionalTemplates).toHaveLength(1);
    expect(functionalTemplates[0]).toMatchObject({
      id: 'power-totem',
      isFunctionalHackathonTemplate: true,
    });
  });

  it('keeps future templates visibly out of the ready product surface', () => {
    const futureTemplates = studioTemplates.filter((template) => template.id !== 'power-totem');

    expect(futureTemplates.length).toBeGreaterThan(0);
    expect(futureTemplates.every((template) => template.status !== 'functional')).toBe(true);
    expect(futureTemplates.every((template) => template.isFunctionalHackathonTemplate === false)).toBe(true);
  });

  it('covers AI agents, gateway modes, and the full Studio journey', () => {
    expect(studioAgents.map((agent) => agent.id)).toEqual([
      'discovery',
      'flow_architect',
      'gateway',
      'sdk',
      'validation',
      'launch',
    ]);
    expect(gatewayModes.some((mode) => mode.id === 'raspberry')).toBe(true);
    expect(gatewayModes.some((mode) => mode.id === 'api_guard')).toBe(true);
    expect(studioSteps.map((step) => step.id)).toEqual(['describe', 'gateway', 'flow', 'sdk', 'validate', 'launch']);
  });
});
```

- [ ] **Step 2: Run the data tests and verify they fail**

Run:

```powershell
npm --prefix apps/kivo/web test -- studioExperience.test.ts
```

Expected: FAIL because `studioExperience.ts` does not exist.

- [ ] **Step 3: Create the Studio experience data**

Create `apps/kivo/web/src/data/studioExperience.ts` with:

```ts
import type {
  KivoGatewayMode,
  KivoSolutionSurface,
  KivoStudioAgentId,
  StudioTemplateSummary,
} from '@/types/kivo';

export interface StudioAgentCard {
  id: KivoStudioAgentId;
  name: string;
  role: string;
  output: string;
}

export interface GatewayModeCard {
  id: KivoGatewayMode;
  label: string;
  surface: KivoSolutionSurface;
  bestFor: string;
  runtime: string;
}

export interface StudioStep {
  id: 'describe' | 'gateway' | 'flow' | 'sdk' | 'validate' | 'launch';
  label: string;
  description: string;
}

export const studioAgents: StudioAgentCard[] = [
  {
    id: 'discovery',
    name: 'Discovery Agent',
    role: 'Entende o recurso que o usuario quer monetizar ou controlar.',
    output: 'Resumo do caso, superficie fisica/digital/hibrida e modelo H2M/M2M/A2M.',
  },
  {
    id: 'flow_architect',
    name: 'Flow Architect Agent',
    role: 'Transforma a intencao em regra de acesso, preco, eventos e fallback.',
    output: 'Flow executavel com politica de liberacao.',
  },
  {
    id: 'gateway',
    name: 'Gateway Agent',
    role: 'Escolhe como o Gateway roda perto do recurso.',
    output: 'Config para Raspberry, edge, proxy, middleware, worker, API guard ou serverless.',
  },
  {
    id: 'sdk',
    name: 'SDK Agent',
    role: 'Gera integracao TypeScript para o caso de uso.',
    output: 'Snippets, adapters, exemplos e testes.',
  },
  {
    id: 'validation',
    name: 'Validation Agent',
    role: 'Executa a validacao testnet com x402 e Etherfuse.',
    output: 'Checklist real com estados pendentes, falhas e evidencias.',
  },
  {
    id: 'launch',
    name: 'Launch Agent',
    role: 'Prepara publicacao privada em mainnet ou template publico.',
    output: 'Opcao de billing privado, manter testnet ou publicar template.',
  },
];

export const gatewayModes: GatewayModeCard[] = [
  {
    id: 'raspberry',
    label: 'Raspberry Pi',
    surface: 'physical',
    bestFor: 'Totens, relays, sensores e prototipos presenciais.',
    runtime: 'Node.js local com token de Gateway e adaptador de hardware.',
  },
  {
    id: 'edge_device',
    label: 'Edge device',
    surface: 'physical',
    bestFor: 'Controladores locais proximos ao recurso.',
    runtime: 'Processo persistente com heartbeat, authorization polling e eventos.',
  },
  {
    id: 'physical_totem',
    label: 'Totem fisico',
    surface: 'physical',
    bestFor: 'Experiencias presenciais com tela, QR e atuador.',
    runtime: 'Gateway local + display + relay ou saida segura.',
  },
  {
    id: 'proxy',
    label: 'Proxy',
    surface: 'digital',
    bestFor: 'APIs existentes que precisam cobrar por acesso.',
    runtime: 'Proxy HTTP que exige X-PAYMENT antes de encaminhar.',
  },
  {
    id: 'middleware',
    label: 'Middleware',
    surface: 'digital',
    bestFor: 'Apps Node/Edge com controle no request pipeline.',
    runtime: 'Middleware que valida challenge e payment header.',
  },
  {
    id: 'sidecar',
    label: 'Sidecar',
    surface: 'digital',
    bestFor: 'Servicos que nao devem receber logica de cobranca diretamente.',
    runtime: 'Processo adjacente que guarda a politica de acesso.',
  },
  {
    id: 'worker',
    label: 'Worker',
    surface: 'digital',
    bestFor: 'Jobs, filas e automacoes pagos por execucao.',
    runtime: 'Worker que confirma pagamento antes de executar job.',
  },
  {
    id: 'api_guard',
    label: 'API guard',
    surface: 'digital',
    bestFor: 'Endpoints premium, dados e ferramentas de agentes.',
    runtime: 'Guard tipado usando SDK TypeScript.',
  },
  {
    id: 'plugin',
    label: 'Plugin',
    surface: 'digital',
    bestFor: 'Produtos que querem distribuir cobranca como extensao.',
    runtime: 'Pacote integravel no host do usuario.',
  },
  {
    id: 'serverless_function',
    label: 'Serverless function',
    surface: 'digital',
    bestFor: 'Funcoes pagas por chamada sem servidor dedicado.',
    runtime: 'Function que valida x402 antes de retornar resposta.',
  },
];

export const studioSteps: StudioStep[] = [
  {
    id: 'describe',
    label: 'Descrever',
    description: 'O usuario explica o que quer monetizar ou controlar em linguagem natural.',
  },
  {
    id: 'gateway',
    label: 'Escolher Gateway',
    description: 'O Studio recomenda execucao fisica, digital ou hibrida.',
  },
  {
    id: 'flow',
    label: 'Gerar flow',
    description: 'O Studio cria regra de acesso, preco, eventos, fallback e checklist.',
  },
  {
    id: 'sdk',
    label: 'Receber SDK/config',
    description: 'O usuario recebe pacote TypeScript, snippets, adapters e testes.',
  },
  {
    id: 'validate',
    label: 'Validar testnet',
    description: 'A validacao mostra x402, Etherfuse e Gateway com estados reais.',
  },
  {
    id: 'launch',
    label: 'Publicar',
    description: 'O usuario escolhe mainnet privada paga, testnet ou template publico.',
  },
];

export const studioTemplates: StudioTemplateSummary[] = [
  {
    id: 'power-totem',
    name: 'Power Totem',
    status: 'functional',
    description: 'Template funcional do hackathon para liberar um recurso fisico via Gateway.',
    surface: 'physical',
    isFunctionalHackathonTemplate: true,
  },
  {
    id: 'api-toll',
    name: 'API Toll',
    status: 'planned',
    description: 'Gateway digital para cobrar acesso a endpoints, dados ou automacoes.',
    surface: 'digital',
    isFunctionalHackathonTemplate: false,
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    status: 'research',
    description: 'Agentes autonomos pagando por ferramentas, compute ou dados premium.',
    surface: 'digital',
    isFunctionalHackathonTemplate: false,
  },
  {
    id: 'iot-data-marketplace',
    name: 'IoT Data Marketplace',
    status: 'planned',
    description: 'Feeds de sensores e leituras pagos por pacote, leitura ou assinatura.',
    surface: 'hybrid',
    isFunctionalHackathonTemplate: false,
  },
];
```

- [ ] **Step 4: Run tests**

Run:

```powershell
npm --prefix apps/kivo/web test -- studioExperience.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

Run:

```powershell
git add apps/kivo/web/src/data/studioExperience.ts apps/kivo/web/src/data/studioExperience.test.ts
git commit -m "feat(kivo): define studio experience model"
```

## Task 3: Build The Studio Entry Route

**Files:**
- Modify: `apps/kivo/web/src/App.tsx`
- Modify: `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
- Modify: `apps/kivo/web/src/layouts/Sidebar.tsx`
- Modify: `apps/kivo/web/src/layouts/BottomNav.tsx`

- [ ] **Step 1: Inspect current navigation labels**

Run:

```powershell
rg -n "studio|totem|templates|x402|deploy|advanced|operations" apps\kivo\web\src\layouts apps\kivo\web\src\App.tsx
```

Expected: shows `/studio` pointing to `PowerTotemStudioPage` and dev routes in layout files.

- [ ] **Step 2: Replace the Studio page with product-facing Studio content**

Replace `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { gatewayModes, studioAgents, studioSteps, studioTemplates } from '@/data/studioExperience';

export default function PowerTotemStudioPage() {
  const functionalTemplate = studioTemplates.find((template) => template.isFunctionalHackathonTemplate);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6 shadow-2xl shadow-emerald-950/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
              <Icon icon="solar:stars-line-duotone" className="h-4 w-4" />
              Kivo Studio
            </span>
            <div>
              <h1 className="text-3xl font-semibold text-white md:text-5xl">Crie gateways pagos com ajuda de AI agents.</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                Descreva o que quer monetizar ou controlar. O Studio transforma a ideia em flow, Gateway config, SDK TypeScript, testes e checklist de validacao x402 + Etherfuse.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/create-flow" className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              Criar flow
            </Link>
            <Link to="/validation" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/50 hover:text-emerald-100">
              Validar testnet
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-6">
        {studioSteps.map((step, index) => (
          <article key={step.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/15 text-sm font-bold text-emerald-200">
              {index + 1}
            </div>
            <h2 className="text-sm font-semibold text-white">{step.label}</h2>
            <p className="mt-2 text-xs leading-5 text-slate-400">{step.description}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">AI agents</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Cada agent gera uma parte operavel.</h2>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {studioAgents.map((agent) => (
              <article key={agent.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">{agent.role}</p>
                <p className="mt-3 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-3 text-xs text-emerald-100">{agent.output}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Template funcional</p>
          <h2 className="mt-2 text-xl font-semibold text-white">{functionalTemplate?.name ?? 'Power Totem'}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-300">{functionalTemplate?.description}</p>
          <div className="mt-5 space-y-3">
            <Link to="/totem-simulator" className="flex items-center justify-between rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-100">
              Abrir simulador Power Totem
              <Icon icon="solar:arrow-right-up-linear" className="h-5 w-5" />
            </Link>
            <Link to="/gateway" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-semibold text-white">
              Ver modos de Gateway
              <Icon icon="solar:server-square-cloud-linear" className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">Gateway fisico e digital</p>
          <h2 className="mt-2 text-xl font-semibold text-white">O mesmo produto protege recursos em varios ambientes.</h2>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {gatewayModes.map((mode) => (
            <article key={mode.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 inline-flex rounded-full border border-white/10 px-2 py-1 text-[11px] font-semibold uppercase text-slate-300">
                {mode.surface}
              </div>
              <h3 className="text-sm font-semibold text-white">{mode.label}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{mode.bestFor}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Add product routes**

In `apps/kivo/web/src/App.tsx`, add imports:

```ts
import GatewayPage from '@/pages/GatewayPage';
import LaunchPage from '@/pages/LaunchPage';
import SdkPage from '@/pages/SdkPage';
import ValidationPage from '@/pages/ValidationPage';
```

Add these routes inside the authenticated `AppLayout` group:

```tsx
            <Route path="gateway" element={<GatewayPage />} />
            <Route path="sdk" element={<SdkPage />} />
            <Route path="validation" element={<ValidationPage />} />
            <Route path="launch" element={<LaunchPage />} />
```

- [ ] **Step 4: Update navigation**

In `apps/kivo/web/src/layouts/Sidebar.tsx`, make the primary product nav include these routes:

```ts
const productNavItems = [
  { label: 'Studio', href: '/studio', icon: 'solar:stars-line-duotone' },
  { label: 'Gateway', href: '/gateway', icon: 'solar:server-square-cloud-linear' },
  { label: 'SDK', href: '/sdk', icon: 'solar:code-square-linear' },
  { label: 'Validacao', href: '/validation', icon: 'solar:shield-check-linear' },
  { label: 'Launch', href: '/launch', icon: 'solar:rocket-linear' },
];
```

Adapt the local variable name to the current component if the file already uses a differently named array. Keep dev-only items gated by `areDevControlsEnabled()`.

In `apps/kivo/web/src/layouts/BottomNav.tsx`, use:

```ts
const items = [
  { label: 'Studio', href: '/studio', icon: 'solar:stars-line-duotone' },
  { label: 'Gateway', href: '/gateway', icon: 'solar:server-square-cloud-linear' },
  { label: 'Validar', href: '/validation', icon: 'solar:shield-check-linear' },
  { label: 'SDK', href: '/sdk', icon: 'solar:code-square-linear' },
];
```

- [ ] **Step 5: Run build**

Run:

```powershell
npm --prefix apps/kivo/web build
```

Expected: FAIL only if the new page imports are missing. It should be resolved in the next tasks when page files are created.

Do not commit this task until Tasks 4-6 create the imported pages and the build passes.

## Task 4: Build The Gateway Product Page

**Files:**
- Create: `apps/kivo/web/src/pages/GatewayPage.tsx`

- [ ] **Step 1: Create Gateway page**

Create `apps/kivo/web/src/pages/GatewayPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { gatewayModes } from '@/data/studioExperience';

const physicalModes = gatewayModes.filter((mode) => mode.surface === 'physical');
const digitalModes = gatewayModes.filter((mode) => mode.surface === 'digital');

export default function GatewayPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
            <Icon icon="solar:server-square-cloud-linear" className="h-4 w-4" />
            Kivo Gateway
          </span>
          <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">O runtime que libera o recurso real.</h1>
          <p className="mt-4 text-sm leading-6 text-slate-300 md:text-base">
            O Gateway roda perto do que precisa ser protegido. Pode ser fisico, como Raspberry Pi e totem, ou digital, como proxy, middleware, sidecar, worker, API guard, plugin ou funcao serverless.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <GatewayModeGroup title="Fisico" description="Para recursos presenciais, sensores, relays, displays e controladores locais." modes={physicalModes} />
        <GatewayModeGroup title="Digital" description="Para APIs, dados, automacoes, funcoes e ferramentas de agentes." modes={digitalModes} />
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
        <h2 className="text-xl font-semibold text-white">Contrato minimo de um Gateway</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          {[
            ['Heartbeat', 'Prova que o runtime esta online.'],
            ['Authorization', 'Pergunta se existe sessao paga liberada.'],
            ['Events', 'Registra inicio, fim, falhas e telemetria.'],
            ['Health', 'Mostra conexao, versao, adapter e ultimo contato.'],
          ].map(([label, description]) => (
            <article key={label} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <h3 className="text-sm font-semibold text-white">{label}</h3>
              <p className="mt-2 text-xs leading-5 text-slate-400">{description}</p>
            </article>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/totem-simulator" className="rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950">
            Testar Power Totem
          </Link>
          <Link to="/sdk" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white">
            Ver SDK
          </Link>
        </div>
      </section>
    </div>
  );
}

function GatewayModeGroup({
  title,
  description,
  modes,
}: {
  title: string;
  description: string;
  modes: typeof gatewayModes;
}) {
  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-4 grid gap-3">
        {modes.map((mode) => (
          <div key={mode.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <h3 className="text-sm font-semibold text-white">{mode.label}</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">{mode.bestFor}</p>
            <p className="mt-3 text-xs leading-5 text-emerald-100">{mode.runtime}</p>
          </div>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Run typecheck through build**

Run:

```powershell
npm --prefix apps/kivo/web build
```

Expected: still FAIL if `SdkPage`, `ValidationPage`, or `LaunchPage` are not yet created. No errors should mention `GatewayPage`.

## Task 5: Build SDK Page And SDK Package Skeleton

**Files:**
- Create: `apps/kivo/web/src/pages/SdkPage.tsx`
- Create: `apps/kivo/sdk/package.json`
- Create: `apps/kivo/sdk/tsconfig.json`
- Create: `apps/kivo/sdk/src/index.ts`
- Create: `apps/kivo/sdk/src/client.ts`
- Create: `apps/kivo/sdk/src/x402.ts`
- Create: `apps/kivo/sdk/src/gateway.ts`
- Create: `apps/kivo/sdk/src/adapters/serverless.ts`
- Create: `apps/kivo/sdk/src/adapters/raspberry.ts`
- Create: `apps/kivo/sdk/examples/power-totem.ts`
- Create: `apps/kivo/sdk/src/client.test.ts`
- Create: `apps/kivo/sdk/src/x402.test.ts`

- [ ] **Step 1: Create SDK package manifest**

Create `apps/kivo/sdk/package.json` with:

```json
{
  "name": "@kivo/sdk",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "vitest run"
  },
  "devDependencies": {
    "@types/node": "^24.12.2",
    "typescript": "~5.7.2",
    "vitest": "^3.0.5"
  }
}
```

- [ ] **Step 2: Create SDK tsconfig**

Create `apps/kivo/sdk/tsconfig.json` with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "declaration": true,
    "outDir": "dist",
    "rootDir": ".",
    "skipLibCheck": true,
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*.ts", "examples/**/*.ts"]
}
```

- [ ] **Step 3: Write SDK tests**

Create `apps/kivo/sdk/src/client.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { KivoClient } from './client';

describe('KivoClient', () => {
  it('requests x402 challenges from the configured API base URL', async () => {
    let requestedUrl = '';
    const client = new KivoClient({
      baseUrl: 'https://api.kivo.example',
      apiKey: 'kivo_test_key',
      fetcher: async (input) => {
        requestedUrl = String(input);
        return new Response(
          JSON.stringify({
            status: 402,
            resource: '/paid/resource',
            scheme: 'stellar',
            network: 'testnet',
            payTo: 'GDESTINATION',
            amount: '0.1000000',
            asset: 'USDC:GTEST',
            maxTimeout: 300,
            nonce: 'nonce_1',
            requiredHeader: 'X-PAYMENT',
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } },
        );
      },
    });

    const challenge = await client.getX402Challenge('/paid/resource');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/x402/challenge?resource=%2Fpaid%2Fresource');
    expect(challenge.nonce).toBe('nonce_1');
  });
});
```

Create `apps/kivo/sdk/src/x402.test.ts` with:

```ts
import { describe, expect, it } from 'vitest';
import { createPaymentHeader } from './x402';

describe('createPaymentHeader', () => {
  it('encodes nonce and signed XDR without exposing private keys', () => {
    const header = createPaymentHeader({ nonce: 'nonce_1', txXDR: 'AAAA_REAL_XDR' });

    expect(header).toContain('nonce_1');
    expect(header).toContain('AAAA_REAL_XDR');
    expect(header).not.toContain('S');
  });
});
```

- [ ] **Step 4: Run SDK tests and verify they fail**

Run:

```powershell
npm --prefix apps/kivo/sdk test
```

Expected: FAIL because SDK source files do not exist.

- [ ] **Step 5: Create SDK client**

Create `apps/kivo/sdk/src/client.ts` with:

```ts
export interface KivoClientOptions {
  baseUrl: string;
  apiKey?: string;
  fetcher?: typeof fetch;
}

export interface KivoX402Challenge {
  status: 402;
  resource: string;
  scheme: 'stellar';
  network: 'testnet' | 'mainnet';
  payTo: string;
  amount: string;
  asset: string;
  maxTimeout: number;
  nonce: string;
  requiredHeader: string;
}

export class KivoClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly fetcher: typeof fetch;

  constructor(options: KivoClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/$/, '');
    this.apiKey = options.apiKey;
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
  }

  async getX402Challenge(resource: string): Promise<KivoX402Challenge> {
    return this.request(`/v1/x402/challenge?resource=${encodeURIComponent(resource)}`);
  }

  async payX402Challenge(nonce: string, txXDR: string): Promise<{ paymentHeader: string; stellarHash: string }> {
    return this.request('/v1/x402/pay', {
      method: 'POST',
      body: JSON.stringify({ nonce, txXDR }),
    });
  }

  async sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<unknown> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/heartbeat`, {
      method: 'POST',
      headers: { 'x-gateway-token': gatewayToken },
    });
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers);
    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }
    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await this.fetcher(`${this.baseUrl}${path}`, { ...init, headers });
    if (!response.ok) {
      throw new Error(await response.text());
    }
    return (await response.json()) as T;
  }
}
```

- [ ] **Step 6: Create x402 helpers**

Create `apps/kivo/sdk/src/x402.ts` with:

```ts
export interface PaymentHeaderInput {
  nonce: string;
  txXDR: string;
}

export function createPaymentHeader(input: PaymentHeaderInput): string {
  return `scheme=stellar,nonce=${input.nonce},tx_xdr=${input.txXDR}`;
}
```

- [ ] **Step 7: Create gateway helpers**

Create `apps/kivo/sdk/src/gateway.ts` with:

```ts
export type GatewayMode = 'physical' | 'digital';

export interface GatewayConfig {
  gatewayId: string;
  gatewayToken: string;
  mode: GatewayMode;
}

export function assertGatewayConfig(config: GatewayConfig): GatewayConfig {
  if (!config.gatewayId.trim()) {
    throw new Error('gatewayId is required');
  }
  if (!config.gatewayToken.trim()) {
    throw new Error('gatewayToken is required');
  }
  return config;
}
```

- [ ] **Step 8: Create adapter contracts**

Create `apps/kivo/sdk/src/adapters/serverless.ts` with:

```ts
import { createPaymentHeader } from '../x402';

export interface ServerlessGuardInput {
  nonce: string;
  txXDR: string;
}

export function createServerlessPaymentHeader(input: ServerlessGuardInput): string {
  return createPaymentHeader(input);
}
```

Create `apps/kivo/sdk/src/adapters/raspberry.ts` with:

```ts
import { assertGatewayConfig, type GatewayConfig } from '../gateway';

export interface RaspberryGatewayRuntime {
  config: GatewayConfig;
  relayPin?: number;
}

export function createRaspberryGatewayRuntime(runtime: RaspberryGatewayRuntime): RaspberryGatewayRuntime {
  return {
    ...runtime,
    config: assertGatewayConfig(runtime.config),
  };
}
```

- [ ] **Step 9: Create public exports**

Create `apps/kivo/sdk/src/index.ts` with:

```ts
export * from './client';
export * from './gateway';
export * from './x402';
export * from './adapters/serverless';
export * from './adapters/raspberry';
```

- [ ] **Step 10: Create Power Totem example**

Create `apps/kivo/sdk/examples/power-totem.ts` with:

```ts
import { KivoClient, createRaspberryGatewayRuntime } from '../src';

const client = new KivoClient({
  baseUrl: process.env.KIVO_API_URL ?? 'https://project.supabase.co/functions/v1/kivo-api',
  apiKey: process.env.KIVO_API_KEY,
});

const runtime = createRaspberryGatewayRuntime({
  config: {
    gatewayId: process.env.KIVO_GATEWAY_ID ?? '',
    gatewayToken: process.env.KIVO_GATEWAY_TOKEN ?? '',
    mode: 'physical',
  },
  relayPin: 17,
});

await client.sendGatewayHeartbeat(runtime.config.gatewayId, runtime.config.gatewayToken);
```

- [ ] **Step 11: Create SDK page**

Create `apps/kivo/web/src/pages/SdkPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';

const snippets = [
  {
    label: 'Instalar',
    code: 'npm install @kivo/sdk',
  },
  {
    label: 'Criar client',
    code: "const kivo = new KivoClient({ baseUrl: process.env.KIVO_API_URL, apiKey: process.env.KIVO_API_KEY });",
  },
  {
    label: 'Proteger recurso',
    code: "const challenge = await kivo.getX402Challenge('/paid/resource');",
  },
];

export default function SdkPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
          <Icon icon="solar:code-square-linear" className="h-4 w-4" />
          SDK TypeScript
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Um SDK baixavel, testavel e pronto para adaptar.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          O SDK nao e codigo solto. Ele inclui client, helpers x402, adapters fisicos/digitais, exemplos, testes e snippets gerados pelo Studio.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {['Client tipado', 'Adapters Gateway', 'Testes e exemplos'].map((item) => (
          <article key={item} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <h2 className="text-lg font-semibold text-white">{item}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Disponivel no pacote `apps/kivo/sdk` e exportavel como artefato do Kivo Studio.
            </p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <h2 className="text-xl font-semibold text-white">Snippets principais</h2>
        <div className="mt-4 grid gap-3">
          {snippets.map((snippet) => (
            <article key={snippet.label} className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <h3 className="text-sm font-semibold text-emerald-100">{snippet.label}</h3>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-200"><code>{snippet.code}</code></pre>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 12: Run SDK tests and build**

Run:

```powershell
npm --prefix apps/kivo/sdk test
npm --prefix apps/kivo/sdk build
```

Expected: PASS for both commands.

## Task 6: Build Testnet Validation Page With Honest States

**Files:**
- Create: `apps/kivo/web/src/pages/ValidationPage.tsx`

- [ ] **Step 1: Create validation page**

Create `apps/kivo/web/src/pages/ValidationPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';

const validationStates = [
  ['Gateway', 'needs_connection', 'Conecte um Gateway fisico ou digital antes de validar.'],
  ['x402', 'not_configured', 'Configure o recurso protegido e gere o challenge.'],
  ['Etherfuse', 'pending', 'Aguardando API key, webhook e ambiente Devnet/Testnet.'],
  ['Pagamento', 'pending', 'Aguardando assinatura real da transacao Stellar.'],
  ['Liberacao', 'pending', 'O recurso so e liberado depois do pagamento validado.'],
];

export default function ValidationPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
          <Icon icon="solar:shield-check-linear" className="h-4 w-4" />
          Testnet validation
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Validacao real com x402 + Etherfuse.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          Esta tela nao mostra sucesso inventado. Quando Gateway, wallet, backend ou Etherfuse nao estiverem conectados, o estado fica pendente ou nao configurado.
        </p>
      </section>

      <section className="rounded-3xl border border-white/10 bg-slate-950/70 p-5">
        <h2 className="text-xl font-semibold text-white">Checklist de validacao</h2>
        <div className="mt-4 space-y-3">
          {validationStates.map(([label, status, message]) => (
            <article key={label} className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{label}</h3>
                <p className="mt-1 text-xs leading-5 text-slate-400">{message}</p>
              </div>
              <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100">
                {status}
              </span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Run build**

Run:

```powershell
npm --prefix apps/kivo/web build
```

Expected: still FAIL only if `LaunchPage` is missing. No errors should mention `ValidationPage`.

## Task 7: Build Launch And Template Product Surfaces

**Files:**
- Create: `apps/kivo/web/src/pages/LaunchPage.tsx`
- Modify: `apps/kivo/web/src/pages/TemplatesPage.tsx`

- [ ] **Step 1: Create Launch page**

Create `apps/kivo/web/src/pages/LaunchPage.tsx` with:

```tsx
import { Icon } from '@iconify/react';

const options = [
  {
    id: 'private',
    label: 'Publicar privado em mainnet',
    enabled: false,
    description: 'Exige flow validado em testnet e billing privado ativo.',
  },
  {
    id: 'testnet',
    label: 'Manter em testnet',
    enabled: true,
    description: 'Continua validando sem liberar uso comercial.',
  },
  {
    id: 'public',
    label: 'Transformar em template publico',
    enabled: true,
    description: 'Remove credenciais privadas e permite reuso pela comunidade.',
  },
];

export default function LaunchPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
          <Icon icon="solar:rocket-linear" className="h-4 w-4" />
          Launch
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Privado em mainnet e pago. Publico vira template.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          Depois que o flow valida em testnet, o usuario escolhe entre publicar privado mediante billing, manter em testnet ou contribuir como template publico.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {options.map((option) => (
          <article key={option.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{option.label}</h2>
              <span className={option.enabled ? 'rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100' : 'rounded-full bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-100'}>
                {option.enabled ? 'disponivel' : 'aguarda validacao'}
              </span>
            </div>
            <p className="text-sm leading-6 text-slate-400">{option.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Replace Templates page content**

Replace `apps/kivo/web/src/pages/TemplatesPage.tsx` with a page based on `studioTemplates`:

```tsx
import { Icon } from '@iconify/react';
import { studioTemplates } from '@/data/studioExperience';

const statusLabel = {
  functional: 'funcional',
  planned: 'roadmap',
  research: 'pesquisa',
  alpha: 'alpha',
  beta: 'beta',
} as const;

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-emerald-400/20 bg-slate-950/80 p-6">
        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-200">
          <Icon icon="solar:widget-linear" className="h-4 w-4" />
          Templates
        </span>
        <h1 className="mt-4 text-3xl font-semibold text-white md:text-5xl">Power Totem agora. Marketplace depois.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">
          O unico template funcional do hackathon e o Power Totem. Os demais aparecem como roadmap para nao vender uma feature que ainda nao existe.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {studioTemplates.map((template) => (
          <article key={template.id} className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-white">{template.name}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{template.description}</p>
              </div>
              <span className={template.status === 'functional' ? 'rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100' : 'rounded-full bg-slate-400/10 px-3 py-1 text-xs font-semibold text-slate-300'}>
                {statusLabel[template.status]}
              </span>
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{template.surface}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Run web tests and build**

Run:

```powershell
npm --prefix apps/kivo/web test
npm --prefix apps/kivo/web build
```

Expected: PASS.

- [ ] **Step 4: Commit Tasks 3-7 together**

Run:

```powershell
git add apps/kivo/web/src/App.tsx apps/kivo/web/src/layouts/Sidebar.tsx apps/kivo/web/src/layouts/BottomNav.tsx apps/kivo/web/src/pages/PowerTotemStudioPage.tsx apps/kivo/web/src/pages/GatewayPage.tsx apps/kivo/web/src/pages/SdkPage.tsx apps/kivo/web/src/pages/ValidationPage.tsx apps/kivo/web/src/pages/LaunchPage.tsx apps/kivo/web/src/pages/TemplatesPage.tsx apps/kivo/sdk
git commit -m "feat(kivo): add studio gateway product surfaces"
```

## Task 8: Add Studio Domain To Supabase Edge Function

**Files:**
- Create: `supabase/functions/kivo-api/studioDomain.ts`
- Create: `supabase/functions/kivo-api/studioDomain_test.ts`
- Modify: `supabase/functions/kivo-api/index.ts`

- [ ] **Step 1: Write Studio domain tests**

Create `supabase/functions/kivo-api/studioDomain_test.ts` with:

```ts
import { assertEquals } from "@std/assert";
import {
  createStudioFlowFromIntent,
  getLaunchOptionsForValidation,
  listStudioTemplates,
} from "./studioDomain.ts";

Deno.test("createStudioFlowFromIntent recommends a digital API guard for API monetization", () => {
  const flow = createStudioFlowFromIntent({
    id: "intent_api",
    prompt: "Quero cobrar por uma API de dados",
    surface: "digital",
    interactionModel: "M2M",
    recommendedGatewayMode: "api_guard",
    createdAt: "2026-05-19T12:00:00Z",
  });

  assertEquals(flow.gatewayMode, "api_guard");
  assertEquals(flow.status, "needs_setup");
});

Deno.test("getLaunchOptionsForValidation blocks private mainnet until validation passes", () => {
  const options = getLaunchOptionsForValidation("needs_connection");
  const privateMainnet = options.find((option) => option.id === "private_mainnet");

  assertEquals(privateMainnet?.enabled, false);
  assertEquals(privateMainnet?.reason, "Validacao testnet precisa passar antes de mainnet privada.");
});

Deno.test("listStudioTemplates exposes only Power Totem as functional", () => {
  const functional = listStudioTemplates().filter((template) => template.status === "functional");

  assertEquals(functional.length, 1);
  assertEquals(functional[0].id, "power-totem");
});
```

- [ ] **Step 2: Run Deno test and verify it fails**

Run from the function directory:

```powershell
Push-Location supabase/functions/kivo-api; deno test studioDomain_test.ts; Pop-Location
```

Expected: FAIL because `studioDomain.ts` does not exist.

- [ ] **Step 3: Create Studio domain functions**

Create `supabase/functions/kivo-api/studioDomain.ts` with:

```ts
export type StudioSurface = "physical" | "digital" | "hybrid";
export type StudioInteractionModel = "H2M" | "M2M" | "A2M" | "mixed";
export type StudioGatewayMode =
  | "raspberry"
  | "edge_device"
  | "physical_totem"
  | "proxy"
  | "middleware"
  | "sidecar"
  | "worker"
  | "api_guard"
  | "plugin"
  | "serverless_function";

export type StudioValidationStatus =
  | "not_configured"
  | "needs_connection"
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "needs_user_action";

export interface StudioIntent {
  id: string;
  prompt: string;
  surface: StudioSurface;
  interactionModel: StudioInteractionModel;
  recommendedGatewayMode: StudioGatewayMode;
  createdAt: string;
}

export interface StudioFlow {
  id: string;
  intentId: string;
  name: string;
  surface: StudioSurface;
  interactionModel: StudioInteractionModel;
  gatewayMode: StudioGatewayMode;
  resourceName: string;
  price: string;
  asset: string;
  accessRule: string;
  status: "draft" | "needs_setup" | "validating" | "validated" | "ready_to_launch" | "published";
  createdAt: string;
  updatedAt: string;
}

export interface StudioLaunchOption {
  id: "private_mainnet" | "stay_testnet" | "public_template";
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
}

export interface StudioTemplateSummary {
  id: string;
  name: string;
  status: "functional" | "planned" | "research" | "alpha" | "beta";
  description: string;
  surface: StudioSurface;
  isFunctionalHackathonTemplate: boolean;
}

export function createStudioFlowFromIntent(intent: StudioIntent, now = new Date().toISOString()): StudioFlow {
  return {
    id: `flow_${crypto.randomUUID()}`,
    intentId: intent.id,
    name: inferFlowName(intent.prompt),
    surface: intent.surface,
    interactionModel: intent.interactionModel,
    gatewayMode: intent.recommendedGatewayMode,
    resourceName: inferResourceName(intent.prompt),
    price: "0.1000000",
    asset: "USDC:testnet",
    accessRule: "Require a valid x402 payment before releasing the protected resource.",
    status: "needs_setup",
    createdAt: now,
    updatedAt: now,
  };
}

export function getLaunchOptionsForValidation(status: StudioValidationStatus): StudioLaunchOption[] {
  const validationPassed = status === "passed";
  return [
    {
      id: "private_mainnet",
      label: "Publicar privado em mainnet",
      description: "Mantem o flow privado, versionado e pronto para uso comercial.",
      enabled: validationPassed,
      reason: validationPassed ? undefined : "Validacao testnet precisa passar antes de mainnet privada.",
    },
    {
      id: "stay_testnet",
      label: "Manter em testnet",
      description: "Continua testando sem ativar uso comercial.",
      enabled: true,
    },
    {
      id: "public_template",
      label: "Transformar em template publico",
      description: "Remove credenciais privadas e permite reuso pela comunidade.",
      enabled: true,
    },
  ];
}

export function listStudioTemplates(): StudioTemplateSummary[] {
  return [
    {
      id: "power-totem",
      name: "Power Totem",
      status: "functional",
      description: "Template funcional do hackathon para liberar recurso fisico com Gateway.",
      surface: "physical",
      isFunctionalHackathonTemplate: true,
    },
    {
      id: "api-toll",
      name: "API Toll",
      status: "planned",
      description: "Gateway digital para cobrar acesso a endpoints e dados.",
      surface: "digital",
      isFunctionalHackathonTemplate: false,
    },
    {
      id: "agent-tool-paywall",
      name: "Agent Tool Paywall",
      status: "research",
      description: "Agentes pagando por ferramentas, compute ou dados premium.",
      surface: "digital",
      isFunctionalHackathonTemplate: false,
    },
  ];
}

function inferFlowName(prompt: string): string {
  const clean = prompt.trim();
  if (!clean) {
    return "Novo Kivo flow";
  }
  return clean.length > 48 ? `${clean.slice(0, 45)}...` : clean;
}

function inferResourceName(prompt: string): string {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("api")) {
    return "Protected API";
  }
  if (normalized.includes("energia") || normalized.includes("totem")) {
    return "Power Totem";
  }
  return "Protected resource";
}
```

- [ ] **Step 4: Add Edge Function route handlers**

In `supabase/functions/kivo-api/index.ts`, import:

```ts
import {
  createStudioFlowFromIntent,
  getLaunchOptionsForValidation,
  listStudioTemplates,
  type StudioIntent,
  type StudioValidationStatus,
} from "./studioDomain.ts";
```

Add routes near the other `/v1` routes:

```ts
    if (path === "/v1/studio/templates" && request.method === "GET") {
      return jsonResponse(listStudioTemplates());
    }

    if (path === "/v1/studio/intents" && request.method === "POST") {
      const body = await request.json();
      const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
      const surface = body.surface === "physical" || body.surface === "hybrid" ? body.surface : "digital";
      const intent: StudioIntent = {
        id: `intent_${crypto.randomUUID()}`,
        prompt,
        surface,
        interactionModel: surface === "physical" ? "H2M" : "M2M",
        recommendedGatewayMode: surface === "physical" ? "raspberry" : "api_guard",
        createdAt: new Date().toISOString(),
      };
      return jsonResponse(intent, 201);
    }

    if (path === "/v1/studio/flows" && request.method === "POST") {
      const body = await request.json();
      const intent: StudioIntent = {
        id: typeof body.intentId === "string" ? body.intentId : `intent_${crypto.randomUUID()}`,
        prompt: typeof body.prompt === "string" ? body.prompt : "Novo Kivo flow",
        surface: body.surface === "physical" || body.surface === "hybrid" ? body.surface : "digital",
        interactionModel: "M2M",
        recommendedGatewayMode: body.gatewayMode ?? "api_guard",
        createdAt: new Date().toISOString(),
      };
      return jsonResponse(createStudioFlowFromIntent(intent), 201);
    }

    const validationMatch = path.match(/^\/v1\/studio\/flows\/([^/]+)\/validation-runs$/);
    if (validationMatch && request.method === "POST") {
      const now = new Date().toISOString();
      return jsonResponse({
        id: `val_${crypto.randomUUID()}`,
        flowId: validationMatch[1],
        status: "needs_connection",
        steps: [
          {
            id: "gateway",
            label: "Gateway",
            status: "needs_connection",
            message: "Conecte um Gateway antes de validar x402 e Etherfuse.",
          },
          {
            id: "x402",
            label: "x402",
            status: "pending",
            message: "Aguardando challenge e pagamento real.",
          },
          {
            id: "etherfuse",
            label: "Etherfuse",
            status: "pending",
            message: "Aguardando configuracao e chamada Devnet/Testnet.",
          },
        ],
        createdAt: now,
        updatedAt: now,
      });
    }

    const launchMatch = path.match(/^\/v1\/studio\/flows\/([^/]+)\/launch-options$/);
    if (launchMatch && request.method === "GET") {
      const validationStatus = url.searchParams.get("validationStatus") as StudioValidationStatus | null;
      return jsonResponse(getLaunchOptionsForValidation(validationStatus ?? "needs_connection"));
    }
```

Adapt `path`, `url`, and `jsonResponse` variable names to the existing names in `index.ts` if they differ.

- [ ] **Step 5: Run Deno tests**

Run:

```powershell
Push-Location supabase/functions/kivo-api; deno test studioDomain_test.ts powerTotemDomain_test.ts settlementValidation_test.ts; Pop-Location
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add supabase/functions/kivo-api/studioDomain.ts supabase/functions/kivo-api/studioDomain_test.ts supabase/functions/kivo-api/index.ts
git commit -m "feat(kivo): add studio edge api domain"
```

## Task 9: Connect Web Studio To API States

**Files:**
- Modify: `apps/kivo/web/src/pages/PowerTotemStudioPage.tsx`
- Modify: `apps/kivo/web/src/pages/ValidationPage.tsx`
- Modify: `apps/kivo/web/src/pages/LaunchPage.tsx`
- Modify: `apps/kivo/web/src/pages/TemplatesPage.tsx`

- [ ] **Step 1: Update Studio page to create intents**

Add local state and `kivoClient.createStudioIntent` to `PowerTotemStudioPage.tsx`:

```tsx
const [prompt, setPrompt] = useState('');
const [intentResult, setIntentResult] = useState<StudioIntent | null>(null);
const [isCreating, setIsCreating] = useState(false);
const [error, setError] = useState('');

const handleCreateIntent = async () => {
  setIsCreating(true);
  setError('');
  try {
    const intent = await kivoClient.createStudioIntent({
      prompt,
      surface: prompt.toLowerCase().includes('totem') ? 'physical' : 'digital',
    });
    setIntentResult(intent);
  } catch (caught) {
    setError(caught instanceof Error ? caught.message : 'Nao foi possivel criar o intent.');
  } finally {
    setIsCreating(false);
  }
};
```

Import:

```ts
import { useState } from 'react';
import { kivoClient } from '@/services/kivoClient';
import type { StudioIntent } from '@/types/kivo';
```

Render a textarea and result panel in the hero section:

```tsx
<textarea
  value={prompt}
  onChange={(event) => setPrompt(event.target.value)}
  aria-label="Descreva o que voce quer monetizar ou controlar. Exemplo: quero cobrar por uma API de dados premium"
  className="mt-5 min-h-28 w-full rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white outline-none focus:border-emerald-300/60"
/>
<button
  type="button"
  onClick={handleCreateIntent}
  disabled={!prompt.trim() || isCreating}
  className="mt-3 rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
>
  {isCreating ? 'Criando...' : 'Gerar intent'}
</button>
{error && <p className="mt-3 text-sm text-rose-200">{error}</p>}
{intentResult && (
  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm text-emerald-50">
    Gateway recomendado: {intentResult.recommendedGatewayMode}
  </div>
)}
```

- [ ] **Step 2: Update Validation page to call real validation endpoint when a flow exists**

Use query string `flowId` in `ValidationPage.tsx`:

```tsx
const params = new URLSearchParams(window.location.search);
const flowId = params.get('flowId');
```

Add button behavior:

```tsx
const [run, setRun] = useState<StudioValidationRun | null>(null);
const [error, setError] = useState('');

const startValidation = async () => {
  if (!flowId) {
    setError('Crie ou selecione um flow antes de validar.');
    return;
  }
  setError('');
  setRun(await kivoClient.startStudioValidation(flowId));
};
```

Import:

```ts
import { useState } from 'react';
import { kivoClient } from '@/services/kivoClient';
import type { StudioValidationRun } from '@/types/kivo';
```

Render API steps if `run` exists, otherwise render the honest static pending checklist.

- [ ] **Step 3: Update Launch page to fetch launch options**

In `LaunchPage.tsx`, use `flowId` query string and `kivoClient.listStudioLaunchOptions(flowId)`. If no `flowId`, show the static options with private mainnet disabled and message "Valide um flow antes de publicar privado."

- [ ] **Step 4: Update Templates page to fetch templates**

In `TemplatesPage.tsx`, try `kivoClient.listStudioTemplates()` on mount. If it fails, fall back to `studioTemplates` but show a visible status line:

```tsx
<p className="mt-3 text-xs text-amber-100">API indisponivel; exibindo catalogo local de status, sem simular readiness.</p>
```

- [ ] **Step 5: Run web tests and build**

Run:

```powershell
npm --prefix apps/kivo/web test
npm --prefix apps/kivo/web build
```

Expected: PASS.

- [ ] **Step 6: Commit**

Run:

```powershell
git add apps/kivo/web/src/pages/PowerTotemStudioPage.tsx apps/kivo/web/src/pages/ValidationPage.tsx apps/kivo/web/src/pages/LaunchPage.tsx apps/kivo/web/src/pages/TemplatesPage.tsx
git commit -m "feat(kivo): connect studio product pages to api states"
```

## Task 10: Document The Product And Demo Path

**Files:**
- Modify: `apps/kivo/README.md`
- Modify: `apps/kivo/DELIVERY.md`
- Modify: `apps/kivo/POWER_TOTEM_DEMO.md`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/index.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx`

- [ ] **Step 1: Update README positioning**

In `apps/kivo/README.md`, ensure the first section says:

```md
# Kivo

Kivo is a Gateway-core + Studio-led platform for monetizing and controlling physical or digital resources with x402, Stellar, Etherfuse, a programmable Gateway runtime, and a TypeScript SDK.

The product has three primary surfaces:

- Kivo Gateway: runtime that protects and releases the resource.
- Kivo Studio: AI-agent guided workspace for creating, validating, and publishing flows.
- Kivo SDK: downloadable TypeScript package with client, adapters, examples, and tests.

Power Totem is the only functional hackathon template. Other templates are roadmap or marketplace candidates until implemented.
```

- [ ] **Step 2: Update DELIVERY status**

In `apps/kivo/DELIVERY.md`, add a "Product Direction" section:

```md
## Product Direction

Kivo is no longer presented as a developer sandbox. The active product direction is Gateway-core + Studio-led:

- Gateway executes access control physically or digitally.
- Studio uses AI agents to turn user intent into flows, config, SDK snippets, tests, and launch checklist.
- SDK gives technical users a direct integration path.
- Testnet validation must show real x402 + Etherfuse states.
- Private mainnet publication is a paid path.
- Public templates are the fallback for users who do not pay for private mainnet usage.
```

- [ ] **Step 3: Update demo doc**

In `apps/kivo/POWER_TOTEM_DEMO.md`, add:

```md
## Why Power Totem

Power Totem is the proof that the Kivo Gateway can release a real-world resource after a verifiable payment flow. It is not the whole product. The same Gateway model applies to APIs, workers, sidecars, serverless functions, plugins, data feeds, and AI-agent tools.
```

- [ ] **Step 4: Update landing docs**

Update the Kivo docs to match these statements:

```md
Kivo Gateway is the runtime. Kivo Studio is the AI-agent creation environment. Kivo SDK is the downloadable integration layer. Power Totem is the functional hackathon template. Other templates are roadmap or marketplace candidates.
```

Use exact endpoint names from `apps/kivo/web/src/services/kivoClient.ts` and `supabase/functions/kivo-api/index.ts` when documenting API routes.

- [ ] **Step 5: Run docs build**

Run:

```powershell
npm --prefix apps/landing-page build
```

Expected: PASS. Existing Vite chunk-size warnings are acceptable.

- [ ] **Step 6: Commit**

Run:

```powershell
git add apps/kivo/README.md apps/kivo/DELIVERY.md apps/kivo/POWER_TOTEM_DEMO.md apps/landing-page/src/pages/doc/ai/kivo/index.mdx apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx
git commit -m "docs(kivo): document studio gateway product direction"
```

## Task 11: Product Verification And Browser Smoke

**Files:**
- No source edits unless verification finds a defect.

- [ ] **Step 1: Run all automated checks**

Run:

```powershell
npm --prefix apps/kivo/web test
npm --prefix apps/kivo/web build
npm --prefix apps/kivo/sdk test
npm --prefix apps/kivo/sdk build
npm --prefix apps/kivo/gateway test
npm --prefix apps/kivo/gateway build
Push-Location supabase/functions/kivo-api; deno test studioDomain_test.ts powerTotemDomain_test.ts settlementValidation_test.ts; Pop-Location
npm --prefix apps/landing-page build
```

Expected: PASS for all commands. Existing Vite chunk-size warnings are acceptable.

- [ ] **Step 2: Start the web app**

Run:

```powershell
npm --prefix apps/kivo/web dev -- --host 127.0.0.1 --port 5174
```

Expected: Vite serves the app on `http://127.0.0.1:5174/`.

- [ ] **Step 3: Browser smoke**

Open these routes and wait at least one second after each navigation before evaluating:

```text
http://127.0.0.1:5174/studio
http://127.0.0.1:5174/gateway
http://127.0.0.1:5174/sdk
http://127.0.0.1:5174/validation
http://127.0.0.1:5174/launch
http://127.0.0.1:5174/templates
http://127.0.0.1:5174/totem-simulator
```

Expected:

- No blank screen.
- No visible stack trace.
- Text does not overflow cards or buttons.
- Mobile bottom nav contains Studio, Gateway, Validar, SDK.
- Only Power Totem is labeled functional.
- Validation page does not show successful x402/Etherfuse unless real API state says it passed.
- Launch page keeps private mainnet blocked until validation passes.

- [ ] **Step 4: Fix defects if found**

If verification finds a defect, create the smallest focused patch and run the failing check again. Commit with:

```powershell
git add <changed-files>
git commit -m "fix(kivo): polish studio gateway product flow"
```

- [ ] **Step 5: Final status**

Run:

```powershell
git status --short --branch
git log --oneline -n 8
```

Expected: branch contains the implementation commits and no accidental staged files.

## Spec Coverage Review

- Kivo Studio with AI agents: Tasks 2, 3, and 9.
- Kivo Gateway physical/digital: Tasks 2, 4, and 10.
- SDK TypeScript complete direction: Task 5.
- Testnet validation with x402 + Etherfuse and no fake success: Tasks 1, 6, 8, 9, and 11.
- Mainnet billing privado: Tasks 7, 8, 9, and 10.
- Templates with Power Totem only functional: Tasks 2, 7, 8, 10, and 11.
- Product-facing polish away from sandbox: Tasks 3, 4, 6, 7, and 11.

## Execution Notes

Recommended execution model: Subagent-Driven.

Suggested parallelization:

- Worker A: Tasks 1-2, web contracts and data.
- Worker B: Task 5, SDK package only.
- Worker C: Task 8, Supabase Edge Function domain only.
- Main agent: Tasks 3-4 and 6-7, product UI integration.
- Main agent after workers: Tasks 9-11, integration, docs, verification.
