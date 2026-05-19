# Kivo Landing Repositioning Design

## Decision

The public product name on the landing page is **Kivo**.

`Kivo Pay` should no longer be the visible product brand in landing pages, product cards, product modals, or Kivo documentation. It can remain an internal or technical label only when the text specifically refers to the payment/liquidity engine behind Kivo.

The landing must reposition Kivo from a template/demo/payment sandbox into a product platform:

- **Kivo Gateway**: a physical and digital enforcement layer for paid access.
- **Kivo Studio**: an AI-agent-assisted environment for building custom Kivo solutions.
- **Kivo SDK**: a complete TypeScript SDK for integrating Kivo into customer systems.
- **x402 + Stellar + Etherfuse**: the visible payment and settlement path for testnet validation and future mainnet usage.
- **Private mainnet billing**: the commercial path for users who validate a working flow and want to keep it private in production.
- **Templates**: reusable accelerators, with Power Totem as the only functional hackathon template and other templates as roadmap.

## Product Positioning

Kivo is a gateway for monetizing access to physical, digital, and hybrid resources.

The key promise:

> Kivo lets builders turn real resources, APIs, AI agents, automations, and devices into paid access flows using x402, Stellar settlement, Etherfuse rails, and a gateway that can run close to the resource.

The landing must make clear that Kivo is not only a Raspberry Pi demo and not only a payment checkout. It is an authorization and monetization layer that can be deployed in multiple environments:

- physical gateways such as Raspberry Pi, edge boxes, kiosks, totems, industrial PCs, and compatible boards;
- digital gateways such as API middleware, reverse proxies, workers, serverless functions, sidecars, queue consumers, and agent tool guards;
- hybrid flows where a digital payment authorization releases a physical or operational outcome.

## Landing Page Scope

This repositioning covers all Kivo-related public landing surfaces:

- product suite card for Kivo;
- Kivo product page hero;
- Kivo feature cards;
- Kivo modals and detail panels;
- Kivo simulator/product visuals when they currently imply sandbox-only, POS-only, remittance-only, EV-only, or old Kivo Pay scope;
- Kivo docs under `apps/landing-page/src/pages/doc/ai/kivo`;
- CTA wording and API snippets shown on the landing.

The implementation should preserve the broader Stellar Global Rails visual language: dark interface, premium emerald accents, dense but elegant cards, Inter/Bricolage typography, subtle motion, and the existing landing layout where it still supports the message.

## Narrative To Remove Or Downgrade

The landing should no longer center Kivo around:

- `Kivo Pay` as the main brand;
- POS or Kivo Terminal as the main use case;
- cross-border remittances as the Kivo core story;
- EV charging as the main product;
- generic "templates ready to use" as if every template is already functional;
- terminal/CLI/sandbox language as the main experience;
- fake production scale claims such as arbitrary user counts;
- a developer sandbox as the primary user journey.

These ideas can survive only if they are rephrased as examples, roadmap items, or internal subsystems. They must not compete with the core Kivo Gateway and Kivo Studio story.

## New Public Pillars

### 1. Kivo Gateway

Kivo Gateway is the product's runtime enforcement layer.

It can run physically near a resource or digitally inside a software environment. In both cases, its job is to protect a resource, request payment/authorization, verify the outcome, release access, and report events.

Landing copy should describe:

- physical gateway: Raspberry Pi, totem, kiosk, industrial edge, local device controller;
- digital gateway: API guard, serverless middleware, proxy, worker, sidecar, automation gate, agent tool gate;
- shared primitive: `resource -> policy -> x402 challenge -> settlement validation -> authorization -> access -> receipt`.

### 2. Kivo Studio

Kivo Studio is not only a form builder.

It is a guided creation environment where AI agents help the user design, generate, test, and publish custom monetization flows using the Kivo SDK.

Landing copy should describe:

- user describes the resource they want to monetize;
- AI agents ask for constraints, hardware/software context, pricing logic, and deployment target;
- Studio proposes a Kivo architecture;
- Studio generates SDK code, gateway configuration, adapters, checkout links, and tests;
- user validates on testnet;
- user decides whether to publish privately on mainnet or release a sanitized public template.

For now this is product vision, not a finished shipped feature. The landing should present it as the direction of Kivo Studio while avoiding claims that the full Tauri/AI-agent experience is already production-ready.

### 3. TypeScript SDK

The SDK must be described as a real product surface, not a small snippet.

Landing copy should point to:

- typed client for Kivo API;
- x402 helpers;
- gateway pairing helpers;
- resource authorization helpers;
- webhook verification;
- simulator/testnet helpers;
- examples for physical and digital gateways.

### 4. x402, Stellar, and Etherfuse

x402 is the access/payment challenge layer.

Stellar is the settlement and proof layer.

Etherfuse is the visible anchor/funding rail for the testnet/mainnet story. The landing should show Etherfuse as part of the financial path without implying that Etherfuse actuates hardware or owns the Kivo gateway.

The recommended explanation:

```txt
request protected resource
-> receive x402 payment requirement
-> pay/settle through Stellar rail
-> Etherfuse appears as anchor/funding context
-> Kivo validates settlement
-> Gateway releases access
-> receipt and health are recorded
```

### 5. Private Mainnet Billing

The commercial model should be clear:

1. Users can build and test on testnet.
2. If the flow works and they want to use it privately on mainnet, they pay Kivo for private mainnet billing/hosting/usage.
3. If they do not pay, they do not get private mainnet usage.
4. As a later option, they may consent to publish a sanitized public template.

The landing must state that public template publication requires explicit consent and removal of secrets, private endpoints, customer data, wallet secrets, API keys, and sensitive business logic.

### 6. Templates

Templates are accelerators, not the product core.

For the hackathon, the only functional template should be **Power Totem**:

- physical Raspberry Pi/totem demo;
- QR checkout;
- x402/Stellar validation;
- Etherfuse-visible rail;
- gateway releases a safe low-voltage resource;
- health and receipt visible.

Other templates can appear as roadmap examples:

- API Toll / paid API endpoint;
- Data Gate / paid dataset or feed;
- Agent Tool Paywall / AI agent pays for a tool;
- Compute Gate / paid edge or GPU job;
- Automation Gate / paid workflow trigger;
- IoT Device Access / paid hardware session;
- EV Charging and P2P Energy as future verticals, not current product center.

## Page And Component Changes

### Product Suite Card

The Kivo card should say:

- name: `Kivo`;
- tagline: `Gateway fisico e digital para acesso pago`;
- description: Kivo protects physical and digital resources, validates payment through x402/Stellar/Etherfuse, and releases access through a gateway or SDK.

### Product Page Hero

The hero should lead with the product name and offer:

- title: `Kivo`;
- headline: `Gateway fisico e digital para monetizar acesso.`;
- body: `Transforme dispositivos, APIs, agentes, dados e automacoes em recursos pagos com x402, Stellar, Etherfuse e um SDK TypeScript completo.`;
- primary CTA: `Explorar Kivo`;
- secondary CTA: `Ver arquitetura`.

### Feature Cards

Replace old Kivo feature cards with:

- Gateway fisico;
- Gateway digital;
- Studio com AI agents;
- SDK TypeScript;
- Checkout x402;
- Etherfuse rail;
- Private mainnet billing;
- Power Totem template.

### Modals

Each Kivo modal should explain a product capability in plain language:

- what it does;
- where it runs;
- why it matters;
- what exists now versus what is roadmap;
- how it connects to x402, Stellar, Etherfuse, Gateway, Studio, or SDK.

Avoid terminal-only language unless the modal is specifically about SDK/developer setup.

### Docs

Kivo docs should reflect the same architecture:

- overview/index;
- architecture;
- x402 protocol;
- Etherfuse integration;
- API reference;
- SDK/gateway usage;
- auth/security;
- deployment;
- roadmap.

Docs can keep technical depth, but should not describe the old Kivo Pay positioning as the public product.

## Error Handling And Honesty

The landing must distinguish clearly between:

- available now;
- hackathon functional demo;
- planned roadmap;
- product vision.

Do not present roadmap templates as completed flows.

Do not show mock production metrics as real adoption.

Do not imply mainnet private billing is already fully live unless the implementation exists.

## Testing

After implementation:

- run landing build/lint commands available in `apps/landing-page`;
- open the landing locally;
- verify the home product suite Kivo card;
- verify the Kivo product page;
- inspect Kivo modals/details;
- inspect Kivo docs pages;
- check mobile and desktop layout;
- check text overflow and visual hierarchy;
- verify no visible public copy still says `Kivo Pay` except explicit internal/technical references.

## Implementation Boundary

This spec is only for landing page repositioning.

It does not implement the new Kivo app frontend, backend changes, Supabase changes, Tauri Studio, new billing, or new SDK behavior. Those belong to the next implementation plan after this landing repositioning is complete.
