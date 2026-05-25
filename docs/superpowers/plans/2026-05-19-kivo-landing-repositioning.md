# Kivo Landing Repositioning Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition every public Kivo landing surface from the old Kivo Pay/template/sandbox story to the approved Kivo Gateway + Kivo Studio product vision.

**Architecture:** Keep the current Astro + React landing architecture and update the Kivo content/data/components in place. Preserve `id: "kivopay"` and `/products/kivo` route compatibility where needed, but make the visible product name `Kivo` and the public narrative about physical/digital gateways, AI-agent Studio, TypeScript SDK, x402/Stellar/Etherfuse, private mainnet billing, and Power Totem as the only functional hackathon template.

**Tech Stack:** Astro 5, React 19, TypeScript, Tailwind utility classes, `motion/react`, Iconify web components, MDX docs.

---

## File Structure

- Modify `apps/landing-page/src/data/content.ts`
  - Owns canonical product data used by product pages and feature cards.
  - Update the `kivoPay` object while preserving the variable/export shape.
- Modify `apps/landing-page/src/i18n/ui.ts`
  - Owns translated strings used by the homepage product suite, module cards, simulators, and product sections.
  - Update Kivo-specific keys in Portuguese and English.
- Modify `apps/landing-page/src/components/ProductPage.tsx`
  - Owns the product detail page composition and Kivo-only sections.
  - Replace hard-coded Kivo Pay/sandbox/template sections with Kivo Gateway/Studio/SDK sections.
- Modify `apps/landing-page/src/components/kivo/KivoTemplateGallery.tsx`
  - Owns the Kivo template gallery currently centered on EV/P2P/AI examples.
  - Reframe it as Power Totem now plus roadmap templates later.
- Modify `apps/landing-page/src/components/simulators/CoreSimulator.tsx`
  - Owns the homepage/product simulator for `kivopay`/`kivo`.
  - Replace the old settlement radar with a Kivo gateway access-flow visual.
- Modify Kivo docs:
  - `apps/landing-page/src/pages/doc/ai/kivo/index.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/etherfuse-integration.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/x402-protocol.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx`
  - `apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx`
- Do not modify the Kivo app frontend in `apps/kivo/web` during this plan.
- Do not modify backend/Supabase/Fly/Vercel config during this plan.

## Task 1: Update Canonical Kivo Product Data

**Files:**
- Modify: `apps/landing-page/src/data/content.ts`

- [ ] **Step 1: Inspect the current Kivo object boundaries**

Run:

```powershell
rg -n "const kivoPay|Exported Product Suite" apps\landing-page\src\data\content.ts
```

Expected: one start marker for `const kivoPay` and one export marker after the object.

- [ ] **Step 2: Replace only the `kivoPay` object with the new Kivo content**

In `apps/landing-page/src/data/content.ts`, replace the full `const kivoPay: Product = { ... };` object with:

```ts
const kivoPay: Product = {
  id: "kivopay",
  path: "/products/kivo",
  icon: "solar:server-square-cloud-linear",
  color: "#10B981",
  gradient: "from-emerald-500 to-teal-600",
  name: "Kivo",
  tagline: "Gateway fisico e digital para monetizar acesso.",
  hero: {
    title: "Gateway fisico e digital para acesso pago",
    subtitle:
      "Transforme dispositivos, APIs, agentes de IA, dados e automacoes em recursos pagos com x402, Stellar, Etherfuse e um SDK TypeScript completo.",
    ctas: ["Explorar Kivo", "Ver arquitetura"]
  },
  problem: {
    title: "Recursos reais e digitais ainda sao dificeis de monetizar com seguranca.",
    items: [
      "Dispositivos fisicos precisam liberar acesso sem expor chaves ou logica critica",
      "APIs, dados e automacoes precisam cobrar por uso sem montar um checkout do zero",
      "Agentes de IA precisam pagar por ferramentas e servicos com autorizacao verificavel",
      "Times querem validar em testnet antes de assumir risco operacional em mainnet"
    ]
  },
  solution: {
    title: "Um gateway para proteger, cobrar, validar e liberar acesso.",
    description:
      "Kivo combina Gateway fisico ou digital, Studio com AI agents, SDK TypeScript, checkout x402, liquidacao Stellar e trilha Etherfuse para transformar recursos em fluxos pagos testaveis."
  },
  responsibilities: [
    "Gateway fisico: roda perto de Raspberry Pi, totem, kiosk, edge box ou controlador local",
    "Gateway digital: protege APIs, workers, automacoes, sidecars, proxies e agent tools",
    "Studio com AI agents: guia a criacao de solucoes customizadas usando o SDK Kivo",
    "SDK TypeScript: integra checkout, autorizacao, webhooks, gateway pairing e testes",
    "x402 + Stellar + Etherfuse: valida pagamento, settlement e contexto de anchor/funding",
    "Private mainnet billing: permite manter flows validados como infraestrutura privada"
  ],
  templates: [
    {
      id: "power-totem",
      name: "Power Totem",
      description: "Template funcional do hackathon para liberar um recurso fisico via gateway",
      icon: "solar:bolt-circle-linear",
      useCase: "Raspberry Pi exibe QR, valida x402/Stellar/Etherfuse e libera uma carga segura"
    },
    {
      id: "api-toll",
      name: "API Toll",
      description: "Roadmap para cobrar acesso a endpoints, dados ou automacoes",
      icon: "solar:programming-linear",
      useCase: "Gateway digital protege uma API e libera resposta apos pagamento x402"
    },
    {
      id: "agent-tool-paywall",
      name: "Agent Tool Paywall",
      description: "Roadmap para agentes de IA pagarem por ferramentas e servicos",
      icon: "solar:cpu-bolt-linear",
      useCase: "Agente paga por tool call, compute ou dado premium antes de executar"
    }
  ],
  sdkFeatures: [
    "Typed Kivo API client",
    "x402 challenge helpers",
    "Gateway pairing helpers",
    "Resource authorization helpers",
    "Webhook verification",
    "Testnet simulator utilities",
    "Physical and digital gateway examples"
  ],
  aiAgents: [
    {
      id: "studio-architect",
      title: "Agente Arquiteto do Studio",
      description:
        "Ajuda o usuario a descrever o recurso, escolher gateway fisico ou digital, definir restricoes e montar a arquitetura Kivo.",
      icon: "solar:compass-linear"
    },
    {
      id: "integration-builder",
      title: "Agente Builder de Integracao",
      description:
        "Gera configuracao, snippets do SDK TypeScript, adapters de gateway, testes e instrucoes de deploy para o flow.",
      icon: "solar:code-square-linear"
    },
    {
      id: "testnet-validator",
      title: "Agente Validador Testnet",
      description:
        "Ajuda a validar x402, Stellar, Etherfuse, eventos do gateway, health checks e recibos antes de mainnet.",
      icon: "solar:shield-check-linear"
    },
    {
      id: "billing-advisor",
      title: "Agente de Mainnet Billing",
      description:
        "Explica o caminho comercial: manter o flow privado em mainnet ou publicar um template sanitizado com consentimento.",
      icon: "solar:wallet-money-linear"
    }
  ],
  features: [
    {
      id: "physical-gateway",
      name: "Gateway fisico",
      description:
        "Rode o Kivo perto de Raspberry Pi, totem, kiosk, edge box ou controlador local para liberar um recurso real apos autorizacao paga.",
      icon: "solar:devices-linear",
      originModule: "Gateway"
    },
    {
      id: "digital-gateway",
      name: "Gateway digital",
      description:
        "Proteja APIs, workers, automacoes, proxies, sidecars e ferramentas de agentes com cobranca por acesso via x402.",
      icon: "solar:server-square-cloud-linear",
      originModule: "Gateway"
    },
    {
      id: "studio-ai-agents",
      name: "Studio com AI agents",
      description:
        "Descreva o que quer construir e deixe agentes guiarem arquitetura, SDK, testes, adapters e validacao em testnet.",
      icon: "solar:stars-linear",
      originModule: "Studio"
    },
    {
      id: "typescript-sdk",
      name: "SDK TypeScript completo",
      description:
        "Cliente tipado, helpers x402, pairing de gateway, autorizacao de recursos, verificacao de webhooks e exemplos de deploy.",
      icon: "solar:code-square-linear",
      originModule: "SDK"
    },
    {
      id: "x402-checkout",
      name: "Checkout x402",
      description:
        "Transforme um recurso protegido em pagamento verificavel: requisito x402, liquidacao Stellar, autorizacao Kivo e recibo.",
      icon: "solar:card-recive-linear",
      originModule: "x402"
    },
    {
      id: "etherfuse-rail",
      name: "Etherfuse rail",
      description:
        "Mostre a trilha de anchor/funding junto da validacao Stellar, sem esconder a rota financeira por tras do acesso pago.",
      icon: "solar:link-round-angle-linear",
      originModule: "Etherfuse"
    },
    {
      id: "private-mainnet-billing",
      name: "Private mainnet billing",
      description:
        "Depois de validar em testnet, o usuario paga para manter o flow privado em mainnet ou opta por publicar um template sanitizado.",
      icon: "solar:lock-keyhole-linear",
      originModule: "Billing"
    },
    {
      id: "power-totem-template",
      name: "Power Totem",
      description:
        "Template funcional do hackathon: QR em um totem, pagamento x402, validacao Stellar/Etherfuse e gateway liberando uma carga segura.",
      icon: "solar:bolt-circle-linear",
      originModule: "Template"
    }
  ],
  differentials: [
    "Gateway fisico e digital no mesmo modelo de autorizacao",
    "Studio com AI agents para criar solucoes customizadas",
    "SDK TypeScript completo para integrar em sistemas reais",
    "x402 + Stellar + Etherfuse visiveis no fluxo de validacao",
    "Power Totem como template funcional do hackathon",
    "Private mainnet billing para flows validados e privados"
  ],
  steps: [
    "Descreva o recurso que voce quer monetizar no Kivo Studio",
    "Escolha gateway fisico, gateway digital ou fluxo hibrido",
    "Gere configuracao, SDK code, adapters e checklist com AI agents",
    "Valide x402, Stellar, Etherfuse, health e recibos em testnet",
    "Publique como flow privado em mainnet com billing Kivo",
    "Ou transforme a solucao em template publico sanitizado com consentimento"
  ],
  forWhom: [
    "Builders criando gateways fisicos com Raspberry Pi, totems, kiosks e edge devices",
    "Times que querem cobrar acesso a APIs, dados, automacoes e workflows",
    "Empresas que precisam monetizar recursos privados sem montar billing do zero",
    "Criadores de agentes de IA que precisam pagar ou cobrar por ferramentas",
    "Operadores que querem validar em testnet antes de publicar em mainnet"
  ],
  benefits: [
    {
      icon: "lucide:split-square-horizontal",
      title: "Fisico e digital",
      description: "O mesmo modelo protege uma carga fisica, uma API, uma automacao ou uma ferramenta de agente."
    },
    {
      icon: "lucide:bot",
      title: "Construido com AI agents",
      description: "Studio guia arquitetura, codigo, testes e publicacao sem exigir que o usuario comece do zero."
    },
    {
      icon: "lucide:shield-check",
      title: "Validacao antes da mainnet",
      description: "Testnet primeiro, pagamento privado depois, com Etherfuse e Stellar visiveis no caminho."
    }
  ],
  techDetails: {
    description:
      "Kivo coordena recurso, politica, requisito x402, validacao Stellar, contexto Etherfuse, autorizacao, gateway execution, recibos e health events.",
    points: [
      "Resource policy define preco, duracao, unidade e permissao",
      "x402 challenge bloqueia acesso ate existir pagamento valido",
      "Stellar confirma settlement e prova transacional",
      "Etherfuse aparece como trilha de anchor/funding para o ativo usado",
      "Gateway fisico ou digital libera o recurso somente apos autorizacao",
      "SDK TypeScript oferece client, helpers, webhooks e exemplos",
      "Studio com AI agents gera arquitetura, adapters, testes e setup",
      "Private mainnet billing monetiza flows que o usuario quer manter privados"
    ]
  },
  faq: [
    {
      question: "Kivo e apenas um gateway fisico?",
      answer:
        "Nao. Kivo pode rodar perto de hardware, como Raspberry Pi e totems, mas tambem pode proteger APIs, workers, automacoes, proxies, sidecars e ferramentas digitais."
    },
    {
      question: "Onde entram x402, Stellar e Etherfuse?",
      answer:
        "x402 cria o requisito de pagamento, Stellar valida settlement e prova transacional, e Etherfuse aparece como contexto de anchor/funding para o caminho financeiro."
    },
    {
      question: "O que o Kivo Studio faz?",
      answer:
        "Studio usa AI agents para ajudar o usuario a modelar a solucao, gerar SDK code, configurar gateway, criar testes e validar o flow em testnet."
    },
    {
      question: "O que existe funcional para o hackathon?",
      answer:
        "O template funcional e o Power Totem: QR checkout, pagamento x402, validacao Stellar/Etherfuse e gateway liberando um recurso fisico seguro."
    },
    {
      question: "Como Kivo ganha dinheiro?",
      answer:
        "O usuario testa em testnet. Se quiser manter um flow privado em mainnet, paga pelo private mainnet billing. Caso nao pague, pode optar por publicar um template sanitizado com consentimento."
    }
  ],
  finalCta: "Explorar Kivo",
  apiSnippet: {
    method: "POST",
    endpoint: "/v1/resources/power-totem/access",
    body:
      '{"resource_id":"power-totem-rj-01","price":"1.00","asset":"USDC","condition":"session_60_seconds"}'
  }
};
```

- [ ] **Step 3: Run TypeScript syntax check through build later**

Do not run build yet. This object is consumed by translation keys and Kivo components that will be updated in later tasks.

Expected temporary state: the app may still render stale translated strings in homepage cards until Task 2 is complete.

## Task 2: Update Kivo Translation Keys Used By Homepage Cards

**Files:**
- Modify: `apps/landing-page/src/i18n/ui.ts`

- [ ] **Step 1: Locate Kivo-specific translation keys**

Run:

```powershell
rg -n "kivopay|Kivo Pay|kivo\\.templates|kivo\\.mcp|kivo\\.comparison|simulator\\.kivo|suite\\.kivopay|product\\.kivopay|modules\\.kivo|module\\.kivopay" apps\landing-page\src\i18n\ui.ts
```

Expected: a list of Portuguese and English Kivo keys.

- [ ] **Step 2: Update Portuguese public Kivo keys**

In the Portuguese block of `apps/landing-page/src/i18n/ui.ts`, set these keys to the following values, preserving the object syntax:

```ts
'module.kivopay.name': 'Kivo',
'module.kivopay.tagline': 'Gateway fisico e digital para acesso pago.',
'modules.kivo.type': 'Gateway fisico e digital',
'modules.kivo.func_value': 'x402 / SDK / Gateway',
'modules.kivo.onboarding_value': 'Testnet primeiro',
'modules.kivo.deep_desc': 'Kivo protege recursos fisicos e digitais, valida pagamentos via x402/Stellar/Etherfuse e libera acesso por gateway ou SDK.',
'suite.kivopay.desc': 'Gateway fisico e digital para monetizar dispositivos, APIs, dados, agentes e automacoes com x402, Stellar, Etherfuse e SDK TypeScript.',
'suite.kivopay.tagline': 'Transforme recursos em acesso pago.',
'product.kivopay.name': 'Kivo',
'product.kivopay.tagline': 'Gateway fisico e digital para monetizar acesso.',
'product.kivopay.hero.title': 'Gateway fisico e digital para acesso pago.',
'product.kivopay.hero.subtitle': 'Transforme dispositivos, APIs, agentes, dados e automacoes em recursos pagos com x402, Stellar, Etherfuse e SDK TypeScript.',
'product.kivopay.feature.physical-gateway.name': 'Gateway fisico',
'product.kivopay.feature.physical-gateway.desc': 'Rode Kivo perto de Raspberry Pi, totem, kiosk ou edge box para liberar recursos reais apos autorizacao paga.',
'product.kivopay.feature.digital-gateway.name': 'Gateway digital',
'product.kivopay.feature.digital-gateway.desc': 'Proteja APIs, workers, automacoes, proxies, sidecars e agent tools com cobranca por acesso.',
'product.kivopay.feature.studio-ai-agents.name': 'Studio com AI agents',
'product.kivopay.feature.studio-ai-agents.desc': 'Descreva uma solucao e deixe agentes guiarem arquitetura, SDK, testes e validacao em testnet.',
'product.kivopay.feature.typescript-sdk.name': 'SDK TypeScript completo',
'product.kivopay.feature.typescript-sdk.desc': 'Cliente tipado, x402 helpers, gateway pairing, autorizacao, webhooks e exemplos reais.',
'product.kivopay.feature.x402-checkout.name': 'Checkout x402',
'product.kivopay.feature.x402-checkout.desc': 'Bloqueie recursos ate existir pagamento validado e autorizacao Kivo.',
'product.kivopay.feature.etherfuse-rail.name': 'Etherfuse rail',
'product.kivopay.feature.etherfuse-rail.desc': 'Mostre anchor/funding junto da prova Stellar e do recibo de acesso.',
'product.kivopay.feature.private-mainnet-billing.name': 'Private mainnet billing',
'product.kivopay.feature.private-mainnet-billing.desc': 'Flows validados em testnet podem virar infraestrutura privada em mainnet mediante billing Kivo.',
'product.kivopay.feature.power-totem-template.name': 'Power Totem',
'product.kivopay.feature.power-totem-template.desc': 'Template funcional do hackathon com QR, x402, Stellar, Etherfuse e gateway fisico.',
'product.kivopay.agent.studio-architect.title': 'Agente Arquiteto do Studio',
'product.kivopay.agent.studio-architect.desc': 'Ajuda a escolher gateway fisico ou digital e modelar a arquitetura Kivo.',
'product.kivopay.agent.integration-builder.title': 'Agente Builder de Integracao',
'product.kivopay.agent.integration-builder.desc': 'Gera SDK code, adapters, configuracao e testes para o flow.',
'product.kivopay.agent.testnet-validator.title': 'Agente Validador Testnet',
'product.kivopay.agent.testnet-validator.desc': 'Valida x402, Stellar, Etherfuse, gateway events, health e recibos.',
'product.kivopay.agent.billing-advisor.title': 'Agente de Mainnet Billing',
'product.kivopay.agent.billing-advisor.desc': 'Explica quando manter o flow privado em mainnet ou publicar template sanitizado.',
'product.kivopay.diff.0': 'Gateway fisico e digital no mesmo modelo',
'product.kivopay.diff.1': 'Studio com AI agents',
'product.kivopay.diff.2': 'SDK TypeScript completo',
'product.kivopay.diff.3': 'x402 + Stellar + Etherfuse visiveis',
'product.kivopay.diff.4': 'Power Totem funcional no hackathon',
'product.kivopay.diff.5': 'Private mainnet billing'
```

- [ ] **Step 3: Update English public Kivo keys**

In the English block of `apps/landing-page/src/i18n/ui.ts`, set the equivalent keys to:

```ts
'module.kivopay.name': 'Kivo',
'module.kivopay.tagline': 'Physical and digital gateway for paid access.',
'modules.kivo.type': 'Physical and digital gateway',
'modules.kivo.func_value': 'x402 / SDK / Gateway',
'modules.kivo.onboarding_value': 'Testnet first',
'modules.kivo.deep_desc': 'Kivo protects physical and digital resources, validates payments through x402/Stellar/Etherfuse, and releases access through a gateway or SDK.',
'suite.kivopay.desc': 'A physical and digital gateway for monetizing devices, APIs, data, agents, and automations with x402, Stellar, Etherfuse, and a TypeScript SDK.',
'suite.kivopay.tagline': 'Turn resources into paid access.',
'product.kivopay.name': 'Kivo',
'product.kivopay.tagline': 'Physical and digital gateway for monetized access.',
'product.kivopay.hero.title': 'Physical and digital gateway for paid access.',
'product.kivopay.hero.subtitle': 'Turn devices, APIs, agents, data, and automations into paid resources with x402, Stellar, Etherfuse, and a TypeScript SDK.',
'product.kivopay.feature.physical-gateway.name': 'Physical gateway',
'product.kivopay.feature.physical-gateway.desc': 'Run Kivo near Raspberry Pi, totems, kiosks, or edge boxes to release real resources after paid authorization.',
'product.kivopay.feature.digital-gateway.name': 'Digital gateway',
'product.kivopay.feature.digital-gateway.desc': 'Protect APIs, workers, automations, proxies, sidecars, and agent tools with paid access.',
'product.kivopay.feature.studio-ai-agents.name': 'Studio with AI agents',
'product.kivopay.feature.studio-ai-agents.desc': 'Describe a solution and let agents guide architecture, SDK, tests, and testnet validation.',
'product.kivopay.feature.typescript-sdk.name': 'Complete TypeScript SDK',
'product.kivopay.feature.typescript-sdk.desc': 'Typed client, x402 helpers, gateway pairing, authorization, webhooks, and real examples.',
'product.kivopay.feature.x402-checkout.name': 'x402 checkout',
'product.kivopay.feature.x402-checkout.desc': 'Block resources until a valid payment and Kivo authorization exist.',
'product.kivopay.feature.etherfuse-rail.name': 'Etherfuse rail',
'product.kivopay.feature.etherfuse-rail.desc': 'Show anchor/funding context alongside Stellar proof and access receipts.',
'product.kivopay.feature.private-mainnet-billing.name': 'Private mainnet billing',
'product.kivopay.feature.private-mainnet-billing.desc': 'Testnet-validated flows can become private mainnet infrastructure through Kivo billing.',
'product.kivopay.feature.power-totem-template.name': 'Power Totem',
'product.kivopay.feature.power-totem-template.desc': 'Hackathon functional template with QR, x402, Stellar, Etherfuse, and a physical gateway.',
'product.kivopay.agent.studio-architect.title': 'Studio Architect Agent',
'product.kivopay.agent.studio-architect.desc': 'Helps choose physical or digital gateway mode and model the Kivo architecture.',
'product.kivopay.agent.integration-builder.title': 'Integration Builder Agent',
'product.kivopay.agent.integration-builder.desc': 'Generates SDK code, adapters, configuration, and tests for the flow.',
'product.kivopay.agent.testnet-validator.title': 'Testnet Validator Agent',
'product.kivopay.agent.testnet-validator.desc': 'Validates x402, Stellar, Etherfuse, gateway events, health, and receipts.',
'product.kivopay.agent.billing-advisor.title': 'Mainnet Billing Agent',
'product.kivopay.agent.billing-advisor.desc': 'Explains when to keep a flow private on mainnet or publish a sanitized template.',
'product.kivopay.diff.0': 'Physical and digital gateway in one model',
'product.kivopay.diff.1': 'Studio with AI agents',
'product.kivopay.diff.2': 'Complete TypeScript SDK',
'product.kivopay.diff.3': 'Visible x402 + Stellar + Etherfuse path',
'product.kivopay.diff.4': 'Functional Power Totem hackathon template',
'product.kivopay.diff.5': 'Private mainnet billing'
```

- [ ] **Step 4: Keep old unused keys only if removing them risks churn**

If old keys like `kivo.templates.title` remain unused after Task 3, they may stay for now. They must not be visible in the landing.

## Task 3: Reframe The Kivo Product Page Sections

**Files:**
- Modify: `apps/landing-page/src/components/ProductPage.tsx`

- [ ] **Step 1: Replace hard-coded dev hero copy for Kivo**

Find:

```tsx
{profile === 'dev' && slug === 'kivopay' ? "Infraestrutura financeira unificada via API." : tagline}
```

Replace with:

```tsx
{profile === 'dev' && slug === 'kivopay' ? "Gateway programavel para recursos pagos." : tagline}
```

Find:

```tsx
? "Integre pagamentos, liquidaÃ§Ã£o e contas escrow em minutos com nossa API RESTful. Sandboxes dedicados e webhooks em tempo real."
```

Replace with:

```tsx
? "Proteja APIs, dispositivos, automacoes e ferramentas de agentes com SDK TypeScript, x402, Stellar, Etherfuse e autorizacao por gateway."
```

- [ ] **Step 2: Remove fake production social proof for Kivo**

Wrap the social proof block in a condition that hides fake adoption counts for Kivo:

```tsx
{slug !== 'kivopay' && (
  <div className="text-xs text-white/40 uppercase tracking-widest font-mono">
    Trusted by <span className="text-white font-bold">10k+</span> ops
  </div>
)}
```

Expected: Kivo no longer shows arbitrary public usage claims.

- [ ] **Step 3: Update Kivo-specific section headings**

Find the Kivo-only section guarded by:

```tsx
{slug === 'kivopay' && (
```

Inside it, replace the first section heading/body:

```tsx
<h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
  Ready-to-Use Templates
</h2>
<p className="text-xl text-white/60 max-w-3xl">
  Start building M2M payment solutions with pre-configured templates. Each includes architecture diagrams, code examples, and real-world scenarios.
</p>
```

with:

```tsx
<h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
  Power Totem agora. Outros templates depois.
</h2>
<p className="text-xl text-white/60 max-w-3xl">
  O template funcional do hackathon prova o gateway fisico com Raspberry Pi, QR checkout, x402, Stellar e Etherfuse. Os demais aparecem como roadmap, nao como features prontas.
</p>
```

- [ ] **Step 4: Replace MCP section intro with Studio/AI-agent framing**

Before `<KivoMCPDemo />`, add a text intro:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
  className="mb-12"
>
  <h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
    Kivo Studio com AI agents
  </h2>
  <p className="text-xl text-white/60 max-w-3xl">
    Studio sera o ambiente onde o usuario descreve o recurso, escolhe gateway fisico ou digital, gera SDK code, testa x402/Etherfuse em testnet e decide se publica em mainnet privada.
  </p>
</motion.div>
```

Keep `<KivoMCPDemo />` in this task only if its visible copy is updated in a later task or already reads as agent tooling. If it still says "Kivo Pay" after Task 6, remove it from the Kivo product page.

- [ ] **Step 5: Replace Stellar comparison heading/body**

Find:

```tsx
Why Stellar for M2M?
```

Replace with:

```tsx
Por que x402, Stellar e Etherfuse?
```

Find:

```tsx
Traditional payment networks are built for humans. M2M needs different properties: instant settlement, zero intermediaries, atomic guarantees, and programmable conditions.
```

Replace with:

```tsx
Kivo precisa provar pagamento, settlement e contexto de funding antes de liberar um recurso. x402 cria o requisito, Stellar confirma a prova e Etherfuse deixa a rail visivel para a experiencia testnet/mainnet.
```

- [ ] **Step 6: Replace comparison rows**

Replace the `rows={[...]}` array passed to `ComparisonTable` with:

```tsx
rows={[
  {
    label: 'Access gate',
    fiat: 'Checkout separado do recurso',
    stellar: 'x402 bloqueia e libera acesso'
  },
  {
    label: 'Settlement proof',
    fiat: 'Confirmacao lenta ou opaca',
    stellar: 'Prova Stellar em segundos'
  },
  {
    label: 'Anchor context',
    fiat: 'Funding invisivel para o usuario',
    stellar: 'Etherfuse visivel no fluxo'
  },
  {
    label: 'Gateway execution',
    fiat: 'Integracao customizada por caso',
    stellar: 'Autorizacao padrao para fisico e digital'
  },
  {
    label: 'Testnet path',
    fiat: 'Ambiente de teste limitado',
    stellar: 'Validacao completa antes da mainnet'
  },
  {
    label: 'Commercial model',
    fiat: 'Billing separado do produto',
    stellar: 'Private mainnet billing para flows validados'
  }
]}
```

- [ ] **Step 7: Replace "Why Machines Care" block copy**

Replace the title:

```tsx
<h3 className="text-2xl font-semibold text-white mb-6">Why Machines Care</h3>
```

with:

```tsx
<h3 className="text-2xl font-semibold text-white mb-6">O que o gateway garante</h3>
```

Replace the four item titles/descriptions with:

```tsx
Gateway unico
O mesmo modelo protege uma carga fisica, uma API, uma automacao ou uma ferramenta de agente.

Pagamento verificavel
x402 e Stellar deixam claro quando existe pagamento suficiente para liberar acesso.

Rail visivel
Etherfuse aparece como contexto de anchor/funding sem virar o componente que executa o recurso.

Mainnet com billing
Depois do teste funcionar, o usuario paga para manter o flow privado em mainnet.
```

## Task 4: Rebuild The Kivo Template Gallery Around Power Totem

**Files:**
- Modify: `apps/landing-page/src/components/kivo/KivoTemplateGallery.tsx`

- [ ] **Step 1: Replace the `Template` interface**

Replace the interface with:

```ts
interface Template {
  id: string;
  name: string;
  status: 'functional' | 'roadmap';
  description: string;
  icon: string;
  useCase: string;
  fullDescription: string;
  steps: string[];
  actors: string;
  codeExample: string;
  impact: string;
}
```

- [ ] **Step 2: Replace the `templates` array**

Replace the current EV/P2P/AI array with:

```ts
const templates: Template[] = [
  {
    id: 'power-totem',
    name: 'Power Totem',
    status: 'functional',
    description: 'Template funcional do hackathon para liberar um recurso fisico com pagamento x402.',
    icon: 'solar:bolt-circle-linear',
    useCase: 'Raspberry Pi + tela + QR + carga segura',
    fullDescription:
      'Power Totem mostra o Kivo Gateway no mundo fisico: uma tela exibe o QR, o checkout exige pagamento x402, Kivo valida Stellar/Etherfuse e o gateway libera uma carga segura por uma sessao curta.',
    steps: [
      'Operador cria o flow Power Totem no Kivo',
      'Gateway no Raspberry Pi pareia com o flow',
      'Visitante escaneia o QR do totem',
      'Checkout x402 solicita pagamento',
      'Kivo valida Stellar e mostra contexto Etherfuse',
      'Gateway libera a carga segura e registra health/recibo'
    ],
    actors: 'Visitante -> Checkout Kivo -> Stellar/Etherfuse -> Raspberry Gateway',
    codeExample: `import { KivoGateway } from '@kivo/gateway';

const gateway = new KivoGateway({
  flowId: 'power-totem-rj-01',
  mode: 'physical',
  output: { type: 'gpio', pin: 17 }
});

await gateway.start();`,
    impact: 'Demo fisica e online pronta para hackathon'
  },
  {
    id: 'api-toll',
    name: 'API Toll',
    status: 'roadmap',
    description: 'Gateway digital para cobrar acesso a endpoints e respostas premium.',
    icon: 'solar:programming-linear',
    useCase: 'API protegida por x402 antes de responder',
    fullDescription:
      'API Toll sera um template para times que querem vender acesso a endpoints, dados ou automacoes sem criar billing do zero.',
    steps: [
      'Usuario descreve endpoint e politica no Studio',
      'AI agents geram middleware com SDK TypeScript',
      'Gateway digital intercepta a requisicao',
      'x402 exige pagamento antes da resposta',
      'Kivo valida e libera a chamada',
      'Mainnet privada exige billing Kivo'
    ],
    actors: 'Cliente API -> Gateway digital -> Kivo -> API privada',
    codeExample: `import { requireKivoAccess } from '@kivo/sdk/http';

export const GET = requireKivoAccess({
  resource: 'premium-weather-api',
  price: '0.05',
  asset: 'USDC'
})(handler);`,
    impact: 'Roadmap pos-hackathon'
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    status: 'roadmap',
    description: 'Agentes de IA pagando por tools, compute, dados e automacoes.',
    icon: 'solar:cpu-bolt-linear',
    useCase: 'Tool call liberada somente apos pagamento',
    fullDescription:
      'Agent Tool Paywall sera o caminho para agentes autonomos consumirem recursos pagos com autorizacao verificavel.',
    steps: [
      'Studio modela a tool e o preco',
      'SDK gera wrapper da ferramenta',
      'Agente recebe requisito x402',
      'Pagamento e validado',
      'Tool executa com recibo',
      'Uso privado em mainnet passa por billing'
    ],
    actors: 'AI Agent -> Kivo tool gateway -> Provider',
    codeExample: `import { paidTool } from '@kivo/sdk/agents';

export const enrichLead = paidTool({
  name: 'enrich_lead',
  price: '0.10',
  asset: 'USDC',
  handler: enrichLeadHandler
});`,
    impact: 'Roadmap para economia de agentes'
  }
];
```

- [ ] **Step 3: Update section heading and body**

Replace:

```tsx
Ready-to-Use Templates
Start building M2M payment solutions with pre-configured templates. Each template includes
architecture diagrams, code examples, and real-world scenarios.
```

with:

```tsx
Power Totem e roadmap de templates
O produto e Kivo Gateway + Kivo Studio. Templates sao aceleradores: Power Totem funciona no hackathon; os demais entram depois como blueprints reutilizaveis.
```

- [ ] **Step 4: Show status badge on each template card**

Inside each card, above the title, add:

```tsx
<span className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
  template.status === 'functional'
    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'
    : 'bg-white/5 text-white/40 border border-white/10'
}`}>
  {template.status === 'functional' ? 'Funcional agora' : 'Roadmap'}
</span>
```

- [ ] **Step 5: Rename `savings` references to `impact`**

Replace every `template.savings` reference with `template.impact`.

Replace label `Impact` content with the same label text, but read from `impact`.

- [ ] **Step 6: Update docs hrefs**

Replace every:

```tsx
href={`/doc/ai/kivopay#template-${template.id}`}
```

with:

```tsx
href={`/doc/ai/kivo#template-${template.id}`}
```

## Task 5: Replace The Kivo Core Simulator Copy And Visual

**Files:**
- Modify: `apps/landing-page/src/components/simulators/CoreSimulator.tsx`

- [ ] **Step 1: Locate the Kivo simulator branch**

Run:

```powershell
rg -n "function KivoPaySimulator|slug === 'kivopay'|simulator.kivo" apps\landing-page\src\components\simulators\CoreSimulator.tsx
```

Expected: the Kivo simulator function and route branch.

- [ ] **Step 2: Rename the function locally**

Rename:

```tsx
function KivoPaySimulator({ color }: { color: string }) {
```

to:

```tsx
function KivoGatewaySimulator({ color }: { color: string }) {
```

Update the branch:

```tsx
if (slug === 'kivopay' || slug === 'kivo') return <KivoGatewaySimulator color={color} />;
```

- [ ] **Step 3: Replace the visible simulator labels**

Inside the Kivo simulator, set the visible title/body/status labels to:

```tsx
<h3 className="text-3xl font-bricolage text-white">Gateway Access Flow</h3>
<p className="text-white/50 text-sm leading-relaxed">
  Um recurso fisico ou digital fica bloqueado ate Kivo validar x402, Stellar e Etherfuse. Depois disso, o gateway libera acesso e registra recibo.
</p>
```

Use these stage labels in the animated flow:

```ts
const stages = [
  'Resource locked',
  'x402 required',
  'Stellar proof',
  'Etherfuse rail',
  'Gateway release'
];
```

- [ ] **Step 4: Remove old routing/latency copy**

Remove visible phrases equivalent to:

```txt
Radar de Liquidacao
LATENCIA_DETECTADA
OTIMIZADO_VIA_STELLAR
INJETAR TRANSACAO
```

Replace the CTA with:

```tsx
Simular acesso pago
```

Expected: the simulator feels like a product flow, not a terminal/routing toy.

## Task 6: Update Kivo Docs To Match The New Product Vision

**Files:**
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/index.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/etherfuse-integration.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/x402-protocol.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx`
- Modify: `apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx`

- [ ] **Step 1: Update docs index opening**

In `apps/landing-page/src/pages/doc/ai/kivo/index.mdx`, replace the title/opening section with:

```mdx
# Kivo

Kivo is a physical and digital gateway for monetizing access to resources.

It combines:

- Kivo Gateway for runtime enforcement near a device, API, automation, worker, proxy, sidecar, or agent tool;
- Kivo Studio for AI-agent-assisted solution building;
- Kivo SDK for TypeScript integration;
- x402 for paid access requirements;
- Stellar for settlement proof;
- Etherfuse for visible anchor/funding context;
- private mainnet billing for validated flows that must remain private.

The hackathon functional template is Power Totem. Other templates are roadmap accelerators.
```

- [ ] **Step 2: Update architecture docs opening**

In `architecture.mdx`, ensure the first architecture summary says:

```mdx
# Kivo Architecture

Kivo is organized around one primitive:

```txt
resource -> policy -> x402 requirement -> Stellar proof -> Etherfuse context -> Kivo authorization -> Gateway release -> receipt and health
```

The gateway can be physical or digital. Physical gateways run near hardware such as Raspberry Pi, totems, kiosks, or edge boxes. Digital gateways run as middleware, serverless functions, workers, reverse proxies, sidecars, queue consumers, or agent tool guards.
```

- [ ] **Step 3: Update Etherfuse docs role**

In `etherfuse-integration.mdx`, add or replace the role section with:

```mdx
## Role In Kivo

Etherfuse is the visible anchor/funding rail in the Kivo payment path.

Etherfuse does not turn hardware on and does not replace the Kivo Gateway. The gateway releases access only after Kivo validates the payment state. Etherfuse gives the user and operator a clearer funding/anchor story around the asset used in the flow.
```

- [ ] **Step 4: Update x402 docs role**

In `x402-protocol.mdx`, add or replace the opening role section with:

```mdx
## Role In Kivo

x402 is the access requirement layer.

When a client requests a protected Kivo resource, Kivo returns a payment requirement. After payment and settlement proof are validated, Kivo issues an authorization that the physical or digital gateway can enforce.
```

- [ ] **Step 5: Update API reference overview**

In `api-reference.mdx`, add a Kivo resource model overview near the top:

```mdx
## Resource Model

Kivo APIs should be understood through four core concepts:

- `resource`: the physical or digital thing being protected;
- `policy`: price, asset, duration, scope, and conditions;
- `authorization`: the short-lived permission created after payment validation;
- `gateway_event`: health, release, completion, and receipt events from the gateway.
```

- [ ] **Step 6: Update roadmap**

In `roadmap.mdx`, ensure the roadmap clearly separates:

```mdx
## Hackathon

- Power Totem as the functional template.
- Kivo Gateway physical flow.
- x402, Stellar, and Etherfuse validation visible.
- Health/status and receipt surfaces.

## After Hackathon

- Kivo Studio as a Tauri app with AI agents.
- Complete TypeScript SDK.
- Digital gateway adapters.
- Private mainnet billing.
- Marketplace of public templates.
- Additional templates: API Toll, Data Gate, Agent Tool Paywall, Compute Gate, Automation Gate, IoT Device Access, EV Charging, P2P Energy.
```

## Task 7: Search And Clean Remaining Visible Kivo Pay/Sandbox Copy

**Files:**
- Modify as found under `apps/landing-page/src`

- [ ] **Step 1: Search public Kivo Pay copy**

Run:

```powershell
rg -n "Kivo Pay|KivoPay|kivopay|Ready-to-Use Templates|Live Sandbox|CLI Simulado|EV Charging Network|Radar de Liquida|Motor de Liquida|POS offline|Kivo Terminal" apps\landing-page\src
```

Expected: some remaining technical IDs like `kivopay` are allowed; visible public copy should be reviewed.

- [ ] **Step 2: Keep route IDs, replace public labels**

Allowed to keep:

```txt
id: "kivopay"
product.kivopay.*
suite.kivopay.*
slug === 'kivopay'
```

Replace visible user-facing labels:

```txt
Kivo Pay -> Kivo
Ready-to-Use Templates -> Power Totem e roadmap de templates
Live Sandbox -> Gateway access flow
CLI Simulado -> SDK / Gateway setup
EV Charging Network -> future EV Charging roadmap, if visible
Kivo Terminal/POS -> Power Totem or physical gateway, if visible
```

- [ ] **Step 3: Confirm no rendered Kivo docs link points to `/doc/ai/kivopay`**

Run:

```powershell
rg -n "/doc/ai/kivopay" apps\landing-page\src
```

Expected: no matches. If matches exist in Kivo components, replace with `/doc/ai/kivo`.

## Task 8: Build And Browser Verify The Landing

**Files:**
- No source edits unless verification finds issues.

- [ ] **Step 1: Build the landing**

Run:

```powershell
npm run build
```

Working directory:

```txt
apps/landing-page
```

Expected: Astro build exits with code 0.

- [ ] **Step 2: Start local landing preview/dev server**

Run:

```powershell
npm run dev -- --host 127.0.0.1 --port 5188
```

Working directory:

```txt
apps/landing-page
```

Expected: server listens on `http://127.0.0.1:5188/`.

- [ ] **Step 3: Verify homepage product suite**

Open:

```txt
http://127.0.0.1:5188/
```

Check:

- Kivo card says `Kivo`, not `Kivo Pay`;
- Kivo card describes physical/digital gateway;
- no visible arbitrary fake Kivo adoption claim;
- card still matches Stellar Global Rails visual style.

- [ ] **Step 4: Verify Kivo product page**

Open:

```txt
http://127.0.0.1:5188/products/kivo
```

Wait one second after route load before screenshot/inspection.

Check:

- hero says Kivo and physical/digital gateway;
- feature cards are the eight approved pillars;
- Kivo-specific sections show Power Totem now and roadmap later;
- x402/Stellar/Etherfuse explanation is visible;
- Studio with AI agents is visible;
- text does not overflow on desktop.

- [ ] **Step 5: Verify docs**

Open:

```txt
http://127.0.0.1:5188/doc/ai/kivo
```

Check:

- docs intro matches new Kivo vision;
- architecture mentions physical and digital gateway;
- Etherfuse role is clear;
- Power Totem is functional, others are roadmap.

- [ ] **Step 6: Verify mobile layout**

Use browser viewport around `390x844`.

Check:

- Kivo hero text wraps cleanly;
- feature cards do not overlap;
- expanded template details are readable;
- CTA buttons fit their containers.

## Task 9: Commit Landing Repositioning

**Files:**
- Stage only files changed for landing repositioning and docs.
- Do not stage unrelated current dirty files in `apps/kivo/web`, `supabase/.temp`, `supabase/functions/kivo-api/deno.lock`, `apps/kivo/demo`, `apps/kivo/web/public/sdk/kivo-sdk-starter`, or `output`.

- [ ] **Step 1: Review changed files**

Run:

```powershell
git status --short
```

Expected: landing/docs files are visible alongside unrelated pre-existing dirty files.

- [ ] **Step 2: Stage only landing repositioning files**

Run:

```powershell
git add apps/landing-page/src/data/content.ts apps/landing-page/src/i18n/ui.ts apps/landing-page/src/components/ProductPage.tsx apps/landing-page/src/components/kivo/KivoTemplateGallery.tsx apps/landing-page/src/components/simulators/CoreSimulator.tsx apps/landing-page/src/pages/doc/ai/kivo/index.mdx apps/landing-page/src/pages/doc/ai/kivo/architecture.mdx apps/landing-page/src/pages/doc/ai/kivo/etherfuse-integration.mdx apps/landing-page/src/pages/doc/ai/kivo/x402-protocol.mdx apps/landing-page/src/pages/doc/ai/kivo/api-reference.mdx apps/landing-page/src/pages/doc/ai/kivo/roadmap.mdx
```

- [ ] **Step 3: Commit**

Run:

```powershell
git commit -m "feat(landing): reposition Kivo product vision"
```

Expected: one commit with only landing repositioning files.

## Self-Review

Spec coverage:

- Kivo public name: Task 1, Task 2, Task 7.
- Gateway physical/digital: Task 1, Task 2, Task 3, Task 6.
- Studio with AI agents: Task 1, Task 2, Task 3, Task 6.
- SDK TypeScript: Task 1, Task 2, Task 6.
- x402/Stellar/Etherfuse: Task 1, Task 3, Task 5, Task 6.
- Private mainnet billing: Task 1, Task 2, Task 6.
- Templates as accelerators and Power Totem as only functional template: Task 1, Task 4, Task 6.
- Remove/downgrade Kivo Pay/POS/remittance/EV/sandbox copy: Task 7.
- Testing and browser verification: Task 8.

Placeholder scan:

- No unresolved placeholder markers or undefined placeholder steps are required for execution.

Type consistency:

- The `Product` object keeps `id: "kivopay"` for route compatibility.
- `templates` remains in the object even though `Product` does not explicitly declare it in the current interface; this matches the existing file behavior. If TypeScript reports this as an error in this repo state, add `templates?: { id: string; name: string; description: string; icon: string; useCase: string }[];` and `sdkFeatures?: string[];` to `Product`.
