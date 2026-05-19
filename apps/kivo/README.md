# Kivo MVP

Kivo is the M2M payment product for solo operators who want to monetize a physical Power Totem, paid API, or IoT data feed with Stellar/x402 and Etherfuse rails.

```txt
operator creates Power Totem -> gateway pairs once -> x402 challenge -> signed Stellar tx -> gateway authorization -> physical session event -> dashboard status
```

## Hackathon Path: Power Totem

The active hackathon path is Power Totem first. The operator creates a Power Totem in Studio, copies the one-time gateway token, runs the simulator or Raspberry gateway package, starts checkout for `/power-totem/{id}/session`, signs the Stellar payment, and lets the gateway fetch a short authorization before reporting session events.

Other templates remain useful product context, but demo readiness is judged by the Power Totem path: Studio creation, one-time gateway token, x402 checkout, Stellar settlement, Etherfuse funding, gateway heartbeat, and safe physical authorization.

## Runtime Decision

Fly.io is no longer part of the MVP deployment path.

The target backend runtime is now a Supabase Edge Function written in TypeScript:

- Frontend: Vercel, `apps/kivo/web`
- Auth, database, realtime, storage, secrets: Supabase
- API runtime: `supabase/functions/kivo-api`
- Stellar settlement: Horizon testnet/mainnet from the server side
- Etherfuse anchor: proxied only from the server side

The Solo MVP production path runs through Supabase Edge Functions and Supabase Postgres. Fly.io and the previous Go API are no longer part of the runtime path.

## Supabase Edge Function

Local setup:

```bash
supabase start --workdir .
supabase functions serve kivo-api --workdir . --no-verify-jwt
```

Production deploy:

```bash
supabase functions deploy kivo-api --project-ref <project-ref> --use-api --no-verify-jwt
```

The production API base URL for the frontend is:

```txt
https://<project-ref>.supabase.co/functions/v1/kivo-api
```

Set this in Vercel:

```txt
VITE_KIVO_API_URL=https://<project-ref>.supabase.co/functions/v1/kivo-api
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=...
```

Set these as Supabase Edge Function secrets:

```txt
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
CORS_ORIGINS=https://<your-vercel-domain>,http://localhost:5174,http://127.0.0.1:5174
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
X402_PLATFORM_KEY=G...
USDC_ISSUER=GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
ETHERFUSE_MODE=devnet
ETHERFUSE_BASE_URL=https://api.sand.etherfuse.com
ETHERFUSE_API_KEY=...
ETHERFUSE_WEBHOOK_URL=https://<project-ref>.supabase.co/functions/v1/kivo-api/v1/etherfuse/webhook
ETHERFUSE_WEBHOOK_SECRET=...
ETHERFUSE_WEBHOOK_VERIFY=true
ETHERFUSE_DEFAULT_FIAT=MXN
ETHERFUSE_ALLOWED_ASSETS=USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5
```

Useful commands:

```bash
supabase functions list --project-ref <project-ref>
supabase functions deploy kivo-api --project-ref <project-ref> --use-api --no-verify-jwt
```

The Edge Function owns deployment health, Etherfuse proxy/webhook routes, dashboard, Power Totems, Power Sessions, gateway heartbeat/authorization/events, devices, payments, x402, webhooks, API keys, MCP config, and workflows.

## Frontend

```bash
cd apps/kivo/web
npm install
npm run dev
npm run lint
npm test -- --run
npm run build
```

Set `VITE_KIVO_ENABLE_DEV_CONTROLS=true` only when you need operator-only Devnet controls. It is off by default so the product UI does not expose test harness actions.

## MVP Endpoints

Edge Function active now:

- `GET /v1/health`
- `GET /v1/deploy/checks`
- `GET /v1/deploy/services`
- `GET /v1/etherfuse/status`
- `POST /v1/etherfuse/onboarding-url`
- `GET /v1/etherfuse/assets`
- `POST /v1/etherfuse/quotes`
- `POST /v1/etherfuse/orders`
- `GET /v1/etherfuse/orders/:id`
- `POST /v1/etherfuse/orders/:id/fiat-received`
- `POST /v1/etherfuse/webhook`

Solo MVP routes now served by Supabase Edge:

- `GET /v1/dashboard`
- `GET|POST /v1/devices`
- `GET|PATCH /v1/devices/:id`
- `GET|POST /v1/payments`
- `GET /v1/payments/:id`
- `POST /v1/payments/:id/execute`
- `POST /v1/payments/:id/condition-proof`
- `GET /v1/x402/challenge?resource=/api/x402/data`
- `POST /v1/x402/pay`
- `GET|PUT /v1/x402/pricing-rules`
- `GET /api/x402/data`
- `GET|POST|PATCH|DELETE /v1/webhooks`
- `GET|POST /v1/api-keys`
- `GET /v1/mcp/tools`
- `GET /v1/mcp/config`
- `POST /mcp`

Power Totem routes active now:

- `GET|POST /v1/power-totems`
- `POST /v1/power-totems/:id/pairing-token`
- `GET|POST /v1/power-sessions`
- `POST /v1/power-sessions/:id/start-checkout`
- `POST /v1/gateways/:id/heartbeat`
- `GET /v1/gateways/:id/authorization`
- `POST /v1/gateways/:id/events`
- `GET /power-totem/{id}/session`

Known external step: `POST /v1/x402/pay` requires a valid signed Stellar `txXDR` from a wallet or SDK. The Edge API validates the nonce memo, destination, amount, and asset before submitting to Horizon.

## Power Totem Gateway

The gateway package lives in `apps/kivo/gateway` and can run against the Supabase Edge API:

```bash
cd apps/kivo/gateway
npm install
npm run dev -- once
npm run dev -- start
```

Required environment:

```txt
KIVO_API_URL=https://<project-ref>.supabase.co/functions/v1/kivo-api
KIVO_GATEWAY_ID=gw_...
KIVO_GATEWAY_TOKEN=kgw_...
KIVO_API_TOKEN=<workspace-or-user-token-for-current-completion-route>
KIVO_GATEWAY_ADAPTER=simulator
```

Simulator mode is the browser-safe and laptop-safe fallback for the hackathon. Raspberry mode is available with:

```txt
KIVO_GATEWAY_ADAPTER=raspberry
KIVO_GATEWAY_ENABLE_COMMAND="node ./scripts/relay-on.js"
KIVO_GATEWAY_DISABLE_COMMAND="node ./scripts/relay-off.js"
```

The Raspberry demo must use only low-voltage relay/controller output with proper isolation. The gateway package does not control mains power directly.

## Delivery Preflight

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://<project-ref>.supabase.co/functions/v1/kivo-api
```

The schema must keep RLS enabled for dashboard-facing tables. Edge Functions may use `SUPABASE_SERVICE_ROLE_KEY`, but that key must never be exposed to the browser.
