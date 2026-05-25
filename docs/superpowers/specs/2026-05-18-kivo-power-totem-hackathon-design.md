# Kivo Power Totem Hackathon Design

## Decision

For the hackathon, Kivo will ship one functional template: **Kivo Power Totem**.

Power Totem is a physical gateway demo built around a Raspberry Pi, a small screen, a QR checkout, and a safe low-voltage output such as an LED strip or mini fan. A user pays through Kivo, the payment is validated through x402/Stellar, Etherfuse is visible as the anchor/funding rail, and the Raspberry gateway releases the physical output for a configured session.

This is the only template that must be fully usable by the end of the hackathon. Other use cases remain part of the product vision, but they do not compete for implementation time.

## Product Positioning

Kivo is not limited to physical devices. The long-term product is a monetization and authorization layer for paid resources, whether physical, virtual, or hybrid.

Kivo coordinates:

- price rules for a resource;
- x402 payment challenges;
- Stellar settlement validation;
- Etherfuse anchor/funding context;
- authorization decisions;
- gateway or SDK execution;
- receipts, sessions, health, and audit events.

For the hackathon, Power Totem is the concrete proof that this architecture works. It is the physical showcase, not the boundary of the product.

## Hackathon Scope

The hackathon MVP includes:

- Kivo API strong enough to manage the Power Totem flow end to end.
- Kivo Gateway running near the user's solution, initially on Raspberry Pi.
- One deep template: Power Totem.
- Kivo Gateway package plus TypeScript SDK for the Raspberry integration.
- Real x402 checkout flow.
- Stellar payment validation.
- Etherfuse Devnet/Testnet status, funding, or anchor visibility.
- Health and status surfaces for the operator and the gateway.
- A clear demo path for online Meet presentation and in-person Stellar Village RJ presentation.

The hackathon MVP excludes:

- functional API Toll template;
- functional Data Gate template;
- functional Agent Tool Paywall template;
- marketplace of templates;
- Tauri Studio with complete AI workflow;
- team/multi-user workflows;
- mainnet private billing as a finished product.

These exclusions can appear as roadmap, but not as flows a user can try during the hackathon.

## Template: Kivo Power Totem

Power Totem lets an operator sell access to a physical resource for a short session.

The reference demo uses:

- Raspberry Pi;
- small touch screen or display;
- QR Code on the screen;
- safe 5V output such as LED strip, mini fan, or USB-powered load;
- relay, MOSFET, or GPIO adapter;
- optional physical button for starting a new session;
- Kivo Gateway process running on the Raspberry.

The product story:

1. The operator creates a Power Totem flow in Kivo.
2. Kivo generates a resource such as `/power-totem/{totemId}/session`.
3. The operator pairs the Raspberry gateway with the flow.
4. The totem screen shows QR Code, price, status, and network health.
5. A visitor scans the QR Code.
6. Kivo Checkout requests payment through x402.
7. The payment is submitted and validated on Stellar.
8. Etherfuse appears as the configured anchor/funding rail.
9. Kivo creates a short-lived authorization for the session.
10. The Raspberry gateway receives or polls that authorization.
11. GPIO releases the low-voltage output.
12. The gateway reports session start, countdown, end, and health.
13. Kivo dashboard shows revenue, session status, settlement, and device health.

## x402, M2M, and Etherfuse Roles

x402 is the payment gate. The Power Totem resource is blocked until Kivo can produce and validate a payment requirement.

The machine-to-machine automation is the authorization chain after payment:

```txt
payment confirmed -> session authorized -> gateway receives authorization -> Raspberry actuates GPIO -> session events are reported
```

Etherfuse is not the component that turns the hardware on. Etherfuse belongs to the financial rail:

- funding or onboarding context for the asset used in payment;
- anchor status visible to the operator;
- bridge between practical money movement and Stellar USDC;
- confidence signal that the rail is not just a local mock.

The user-facing totem screen should stay simple: locked, pending payment, unlocked, ended. The operator dashboard can expose the technical rail: x402, Stellar, Etherfuse, asset, destination, status, and transaction proof.

## Components

### Kivo API

The API owns the durable product state and payment enforcement.

Required responsibilities:

- create and update Power Totem flows;
- register and pair gateways;
- issue pairing tokens;
- create checkout sessions;
- generate x402 challenges;
- validate signed Stellar payment XDR;
- persist settlement and session state;
- expose authorization for the gateway;
- receive gateway heartbeat and session events;
- expose status/health for dashboard and demo.

### Kivo Gateway

The gateway is the enforcement layer near the user's resource.

For the Raspberry MVP, it should:

- run as a Node, Deno, or Python process;
- authenticate with a gateway token;
- identify the paired Power Totem;
- poll or subscribe for session authorization;
- control GPIO safely;
- report online/offline heartbeat;
- report session start, end, errors, and output state;
- provide a simulator mode for demos without hardware.

Secrets must stay on the Raspberry or server side. The browser must not receive gateway secrets, service-role keys, or Stellar secret keys.

### Kivo Studio

For the hackathon, Studio can be a guided web experience inside the current Kivo app, not a finished Tauri app.

It should help the operator:

- create a Power Totem flow;
- configure price, unit, session duration, and resource name;
- pair the Raspberry gateway;
- preview the totem QR screen;
- test payment and release;
- publish the flow;
- monitor health and sessions.

After the hackathon, Kivo Studio should become a Tauri app where AI agents help users build custom monetization solutions on top of the Kivo SDK. The user guides the agents by describing what they want to build, what resource they want to monetize, what hardware or software they already have, and what constraints matter. The agents then help model the solution, generate SDK-based code, configure gateway behavior, create tests, and explain the next decision.

Studio is not only a form wizard. It is a guided build environment for custom Kivo flows:

- the user describes the intended physical, virtual, or hybrid solution;
- AI agents propose an architecture using Kivo API, Gateway, SDK, x402, Stellar, and Etherfuse;
- the user accepts, rejects, or redirects the proposed solution;
- Studio generates configuration, SDK code, gateway adapters, checkout links, and test plans;
- the user validates the solution on testnet before deciding whether it should become private mainnet infrastructure.

### Studio Monetization Model

The Studio model should encourage experimentation without making every custom solution immediately private.

The intended path:

1. The user builds and iterates freely on testnet.
2. The user validates that the flow works for their real use case.
3. If the user wants to keep the working flow private and use it on mainnet, they pay Kivo for private mainnet usage.
4. If the user does not pay, they either do not use the flow in production or they explicitly agree to publish a sanitized version as a public/community template that other users can access.

Public template publication must require explicit consent. Kivo must remove secrets, private endpoints, customer data, wallet secrets, API keys, and sensitive business details before a template becomes public. A public template is a reusable blueprint, not a dump of the user's private implementation.

### Kivo SDK

The SDK should be more than a code snippet. For the hackathon, it should include the gateway primitives needed by Power Totem:

- gateway registration or pairing helper;
- authorization polling or webhook helper;
- session lifecycle helpers;
- safe GPIO adapter interface;
- simulator adapter;
- typed Kivo API client;
- examples for Raspberry and local simulation.

The SDK should be generic enough to support future resources, but the shipped examples should focus on Power Totem.

## User Experience

The main app should stop presenting multiple functional templates during the hackathon. The primary visible journey should be:

1. Home shows the Power Totem flow and next required setup step.
2. Create Flow creates only a Power Totem.
3. Pair Gateway connects the Raspberry to the flow.
4. Checkout Test proves x402 payment and authorization.
5. Dashboard shows sessions, revenue, settlement, and health.
6. Status/Health explains API, Stellar, Etherfuse, and gateway readiness.

Roadmap templates can be shown only as future capabilities and should not look clickable or ready.

## Demo Modes

### In-Person Stellar Village RJ

The physical demo should use low-voltage hardware for reliability and safety.

Recommended presentation:

- table totem with Raspberry screen;
- QR Code visible on screen;
- LED strip or mini fan visibly off;
- payment from phone or demo wallet;
- output turns on after authorization;
- countdown shown on totem screen;
- dashboard shows session and payment.

### Online Meet

The online demo should have a fallback that does not depend on camera quality or hardware availability.

Recommended presentation:

- share Kivo dashboard;
- show browser-based totem simulator;
- optionally point camera at Raspberry;
- run the same checkout and authorization flow;
- show health/status proving the gateway is connected.

## Future Scope

After the hackathon, Kivo can add more templates on the same architecture. Power Totem is the first proof point, not the only product direction.

Template roadmap:

- **API Toll:** paid endpoints for H2S and M2M API access.
- **Data Gate:** paid IoT data feeds, sensor readings, and datasets.
- **Agent Tool Paywall:** AI agents paying for premium tools or actions.
- **Device Command:** hybrid flows where software payment unlocks a device action.
- **Compute Meter:** paid edge compute, model inference, or job execution.
- **Storage Unlock:** paid access to files, reports, media, or signed URLs.
- **Automation Trigger:** paid webhook, workflow, or business automation execution.
- **Private Flow Template:** user-created Studio flows that can become private paid mainnet deployments or public community templates.

Platform roadmap:

- marketplace of reusable templates;
- complete Tauri Studio with AI-agent solution building;
- mainnet private flows and billing;
- team, workspace, and governance flows;
- public/community template review and publishing.

These future templates should reuse the same foundation:

```txt
resource -> price rule -> payment challenge -> settlement validation -> authorization -> gateway or SDK execution -> receipt and audit
```

## Success Criteria

The hackathon delivery is successful when:

- a user can understand Kivo from the Power Totem demo without reading protocol docs;
- the app no longer feels like a generic sandbox;
- one Power Totem flow can be created, priced, paired, tested, and monitored;
- x402 is used as the payment requirement layer;
- Stellar validation is real and invalid payment proof fails;
- Etherfuse appears as configured financial rail, not as hidden trivia;
- Raspberry or simulator receives authorization and changes visible state;
- dashboard shows session, payment, gateway health, and settlement context;
- future templates are framed as roadmap, not incomplete MVP features.

## Risks

- Physical hardware can fail during a live demo. A browser simulator must be available.
- Wallet signing can be a friction point. The demo should have a known funded test account and a rehearsed payment path.
- Etherfuse may require external dashboard steps. Kivo should show setup status and avoid implying the anchor is broken when external setup is pending.
- Too much protocol detail can confuse non-technical viewers. The totem and dashboard should use product language first, with advanced details available when needed.
- Building Tauri Studio before the hackathon could dilute focus. The web Studio flow should come first.

## Approved Direction

Kivo remains a general platform for monetizing physical, virtual, and hybrid resources through H2M, H2S, and M2M payment flows.

For the hackathon, the only fully functional template is **Kivo Power Totem**.

After the hackathon, Kivo expands through AI-assisted Studio flows, SDK-based custom builds, and additional templates for APIs, data, agents, compute, storage, automations, and hybrid device commands.

Power Totem is the proof point:

```txt
scan QR -> x402 payment -> Stellar/Etherfuse rail -> Kivo authorization -> Raspberry gateway -> physical output unlocked
```
