# Kivo Workspace Personas Design

## Goal

Turn the authenticated Kivo app from a developer sandbox into a workspace-first product that serves four personas across solo, small-team, and larger-operation use.

## Personas

- Operator: owns infrastructure such as EV chargers, IoT devices, data feeds, edge compute, or energy networks. Needs devices, sessions, revenue, failures, and settlement visibility.
- End user payer: pays to unlock a resource through x402. Needs price, status, payment confirmation, and immediate access.
- Integrator: connects Kivo into another product. Needs templates, API keys, snippets, webhooks, MCP tools, and test flows.
- Finance/admin: tracks revenue, settlement, fees, failures, exports, and proof hashes.

## Account Scale

- Solo: one user can do everything with low friction.
- Small team: owner, operator, developer, and finance roles with simple invites and role labels.
- Large operation: multi-site and stronger governance are shown as readiness signals, while granular RBAC remains future scope.

## MVP Shape

The app keeps one product shell and adds persona-based entry points:

- `/dashboard`: workspace home for all personas and account scales.
- `/operations`: operator-focused view for devices, active usage, and operational health.
- `/checkout`: end-user x402 payment and unlock flow.
- `/integrations`: integrator hub that points to templates, API keys, webhooks, MCP, and x402.
- `/finance`: finance/admin view for revenue, settlement, and proof trails.
- `/team`: workspace scale and role view for solo, team, and enterprise-readiness.

Existing technical pages remain available under an Advanced navigation group. They are no longer the first impression of the product.

## Constraints

- Keep the current React/Vite/Tailwind stack.
- Use live Kivo API data where it already exists.
- Do not add backend endpoints for this pass.
- Keep the visual language consistent with the current Kivo/ContractEase dark emerald console.
- Keep labels in PT-BR, preserving technical API names in English.

## Success Criteria

- A logged-in user sees a product home, not a technical dashboard.
- Each persona has a clear primary journey.
- Solo, small-team, and large-operation use are visible in the UI.
- Existing developer/ops pages still work.
- `npm run test`, `npm run lint`, and `npm run build` pass.
