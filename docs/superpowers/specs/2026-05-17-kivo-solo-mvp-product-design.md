# Kivo Solo MVP Product Design

## Summary

Kivo will become a solo-first product for builders who want to monetize machines, APIs, and IoT data streams with x402 payments on Stellar. The product should stop feeling like a developer sandbox and become a guided workflow: choose what to monetize, configure pricing, install or share the integration, test a real payment, publish, and monitor revenue.

The MVP should make one end-to-end flow feel complete and reliable, while showing two additional templates as ready paths. Advanced surfaces remain available, but they move out of the primary journey.

## Primary Persona

The first release serves a solo user who does everything:

- Founder, maker, developer, or technical operator.
- Owns or controls a device, gateway, API, or data stream.
- Wants to charge users, devices, agents, or services without building payment infrastructure from scratch.
- Needs a working product flow more than a protocol playground.

Team roles, invite flows, enterprise RBAC, multi-site governance, and customer support consoles are explicitly future scope.

## Product Promise

Kivo lets a solo builder monetize a connected resource in minutes:

1. Pick a template.
2. Set price and unit.
3. Install the SDK or expose a payment link/API route.
4. Run a real x402/Stellar test payment.
5. Publish the resource.
6. Monitor sessions, payments, wallet state, and failures.

## MVP Shape

The product should have five primary areas:

- **Home:** a solo operator command center with the active flow, revenue, sessions, health, and next actions.
- **Create Flow:** the main onboarding path: template -> pricing -> integration -> test -> publish.
- **Flows:** the user's monetized resources, with detail pages for status, pricing, integration, sessions, and payments.
- **Payments:** readable ledger for payments, settlement status, Stellar hash, Etherfuse status, and receipts.
- **Advanced:** developer and operations tools: devices, API keys, webhooks, x402 rules, MCP, deploy, and raw diagnostics.

The current top-level sandbox pages should no longer be first-class navigation items. They can stay accessible under Advanced.

## Templates

Only three templates should be promoted in the MVP.

### 1. Device Pay / EV Charging

This is the hero demo and deepest path. It represents IoT monetization through a device or gateway.

Default setup:

- Resource type: device session.
- Unit: kWh, minute, or session.
- Payment rail: x402 + Stellar USDC.
- Integration: gateway/backend SDK first, direct device SDK later.
- Optional customer entry: payment link or QR.
- Success event: device receives authorization to start or continue a session.

Why this matters:

- It demonstrates machine monetization clearly.
- It makes Stellar/x402 useful in a concrete real-world scenario.
- It can be shown to a non-developer without explaining every protocol detail.

### 2. Paid API Endpoint

This is the pure x402 path.

Default setup:

- Resource type: HTTP endpoint.
- Unit: request.
- Payment rail: x402.
- Integration: middleware or SDK snippet.
- Success event: caller receives the protected API response after payment.

Why this matters:

- It proves Kivo is not only checkout.
- It gives developers the cleanest path to adopt x402.
- It can reuse existing backend challenge and payment APIs.

### 3. IoT Data Feed

This is the data marketplace path.

Default setup:

- Resource type: sensor reading, data package, or stream.
- Unit: reading, package, or minute.
- Payment rail: x402.
- Integration: gateway posts data availability; buyers pay to access payload.
- Success event: buyer receives a signed or time-limited data response.

Why this matters:

- It broadens the M2M story beyond charging.
- It lets Kivo show value for sensors, industrial data, weather stations, and telemetry.

## Core Flow

The primary user journey should be:

1. **Create Flow**
   The user clicks "Create flow" from Home.

2. **Choose Template**
   The user selects EV Charging, Paid API Endpoint, or IoT Data Feed.

3. **Configure Resource**
   The user names the resource, chooses unit, sets price, and reviews the default payment rail.

4. **Integrate**
   Kivo generates the correct integration:

   - SDK snippet for Device Pay.
   - Middleware/API snippet for Paid API Endpoint.
   - Data publishing/access snippet for IoT Data Feed.
   - QR or payment link only where it helps the template.

5. **Test Payment**
   Kivo runs a real test path:

   - x402 challenge is generated.
   - Signed payment is submitted when available.
   - Stellar/Etherfuse status is shown in user-facing language.
   - Errors are explained as setup issues, not protocol dumps.

6. **Publish**
   The flow becomes active and appears on Home and Flows.

7. **Monitor**
   The user sees active sessions, payments, revenue, failures, wallet state, and next actions.

## Device SDK Direction

For the MVP, Kivo should promote a gateway/backend SDK path first.

Reasoning:

- Safer secret handling.
- Easier for users to test locally.
- Easier to support across many IoT devices.
- Avoids pretending every constrained device can safely hold API credentials.

The UI copy can mention direct device SDK as a later option, but the implementation guidance should focus on gateway/backend integration.

## Information Architecture

Primary navigation:

- Home
- Create Flow
- Flows
- Payments
- Advanced

Advanced navigation:

- Devices
- API Keys
- Webhooks
- x402 Rules
- MCP Tools
- Deploy
- Workflows
- Settings

Routes can keep backward compatibility, but visible navigation should reflect the new product model.

## UI And Copy Direction

The product should remain visually aligned with ContractEase and the current Kivo style:

- Dark mode.
- Emerald primary color.
- Dense but readable panels.
- Inter + Bricolage typography.
- Sidebar on desktop, bottom nav on mobile.
- Professional operational tone, not landing-page tone.

Copy should change from protocol-first to outcome-first:

- "Simular checkout" becomes "Testar pagamento".
- "x402 Playground" becomes "x402 Rules" or moves to Advanced.
- "Anchor Etherfuse antes do x402" becomes "Funding and settlement".
- "Console tecnico" becomes "Advanced tools".

The primary journey should not show raw JSON by default. Raw payloads can appear in expandable advanced sections.

## Backend And Data Expectations

The product should use the real Kivo API, Supabase Auth, Postgres state, Stellar testnet, and Etherfuse sandbox/testnet where configured.

The current API already supports several required primitives:

- Devices.
- Payments.
- Payment execution.
- Condition proof.
- x402 challenge and payment.
- Pricing rules.
- Webhooks.
- API keys.
- Etherfuse status, onboarding, assets, quote, and order.

The product-level gap is not only technical capability. The app needs persisted "flows" or an equivalent product abstraction that binds template, resource, pricing, integration, and monitoring into one user-facing object. If a dedicated backend table is too large for the next slice, the first implementation can derive a flow from existing device, pricing rule, and payment records, but the UI should still present it as a flow.

## Non-Goals

The MVP will not try to fully ship:

- 12 templates.
- Team roles and invites.
- Enterprise RBAC.
- Mainnet production settlement.
- Full direct-device embedded SDK support.
- A public marketplace.
- A complete customer support console.
- A generic landing page inside the app.

## Success Criteria

The MVP is successful when a demo can show:

- A solo user logs in and immediately understands what to do.
- The user creates an EV Charging flow from a template.
- The user sees a real SDK/gateway integration snippet.
- The user runs or understands the test payment path.
- The user sees the flow become active.
- The user can inspect sessions/payments/revenue in one place.
- Advanced x402/Etherfuse/dev tools exist, but they no longer dominate the main experience.
- The UI can be presented without apologizing that it is a sandbox.

## Testing Expectations

Verification should cover:

- Build, lint, and unit tests for the web app.
- Go API tests for any endpoint changes.
- Browser smoke for desktop and mobile navigation.
- Create Flow wizard path for all three templates.
- Full EV Charging path through configure, integrate, test, publish, and monitor.
- Empty, loading, success, failure, and setup-required states.
- Advanced pages still reachable.
- No primary screen should expose raw sandbox wording unless the user opens an advanced/debug detail.

## Risks

- Etherfuse onboarding may still require external action in its own devnet UI. Kivo must describe this as setup required, not as product failure.
- A real signed txXDR path may be difficult to make frictionless in the browser before wallet integration is polished. The test step should clearly separate "generate challenge", "sign payment", and "unlock resource".
- Too many modules would dilute the demo. The MVP should keep three templates visible and one hero path deep.
- Existing route names may remain for compatibility, but visible labels must be product-first.

## Approved Direction

The approved direction is:

- Solo user first.
- Three promoted templates.
- One complete EV Charging / Device Pay hero flow.
- Paid API Endpoint and IoT Data Feed as operational secondary templates.
- Advanced tools preserved but hidden from the primary path.
- x402, Stellar, and Etherfuse presented as infrastructure underneath the user-facing product.
