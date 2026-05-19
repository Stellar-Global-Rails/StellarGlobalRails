# Kivo Delivery Readiness

Last checked: 2026-05-18

## Current Status

- Hackathon path: Power Totem is the primary demo path.
- Frontend deploy: Vercel is already configured by the operator.
- Production API target: Supabase Edge Function `kivo-api`.
- Supabase schema: `kivo_*` tables, RLS, grants, Power Totem tables, gateway events, and x402/session bridge alignment applied to the cloud project.
- Edge route parity: health, Etherfuse proxy, x402 challenge/payment, Power Totems, Power Sessions, gateway heartbeat, gateway authorization, gateway events, dashboard, deploy checks, and delivery docs are active.
- Gateway package: `apps/kivo/gateway` supports simulator and Raspberry shell adapters; completion currently needs `KIVO_API_TOKEN` until gateway-token completion is promoted.
- Safety posture: Raspberry demo must use only low-voltage output. Browser simulator remains the fallback if hardware is not ready.
- Legacy note: Fly.io and the old Go API are retired from the MVP runtime.

## Product Direction

Kivo is no longer presented as a developer sandbox. The active product direction is Gateway-core + Studio-led:

- Gateway executes access control physically or digitally.
- Studio uses AI agents to turn user intent into flows, config, SDK snippets, tests, and launch checklist.
- SDK gives technical users a direct integration path.
- Testnet validation must show real x402 + Etherfuse states.
- Private mainnet publication is a paid path.
- Public templates are the fallback for users who do not pay for private mainnet usage.

## Current Blockers

1. Wallet signing remains an external user/device step.
   - `POST /v1/power-sessions/:id/start-checkout` creates the x402 challenge for `/power-totem/{id}/session`.
   - `POST /v1/x402/pay` validates destination, amount, asset, and nonce memo before submitting signed XDR to Stellar Horizon.
   - The Kivo UI still needs a wallet/SDK-produced `txXDR` to complete the paid authorization.

2. Gateway completion uses authenticated Power Session completion.
   - `apps/kivo/gateway` requires `KIVO_API_TOKEN` before it actuates.
   - This can be removed when gateway-token completion is added or the x402 bridge owns the full status transition.

3. Local Supabase/Postgres may not be reachable in every CLI session.
   - Docker Desktop Linux engine was not available during the last local preflight.
   - Production deploy can still use `supabase functions deploy --use-api`.
   - Resolution for local dev: start Docker Desktop, then run `supabase start --workdir .`.

4. `X402_PLATFORM_KEY` must be the funded Stellar testnet public key.
   - The public key must start with `G` and be funded on Stellar testnet.
   - The secret key must stay outside the browser and should not be committed.

5. Supabase Auth leaked password protection is still a dashboard setting.
   - Supabase Advisor reports it as a warning, not a runtime blocker.
   - Enable it before public onboarding.

## Power Totem Go/No-Go

- [ ] Power Totem can be created in Studio.
- [ ] Gateway token is shown once and not exposed again.
- [ ] Gateway heartbeat marks the gateway online.
- [ ] Checkout creates x402 challenge for `/power-totem/{id}/session`.
- [ ] Valid signed payment authorizes one session.
- [ ] Gateway simulator receives authorization and reports session events.
- [ ] Raspberry demo uses only low-voltage output.
- [ ] Browser simulator is ready if hardware fails.

## Demo Flow

1. Login in Kivo.
2. Open Studio and create a Power Totem.
3. Copy the one-time gateway token.
4. Run the gateway simulator from `apps/kivo/gateway`, or open the browser simulator.
5. Send a heartbeat so the gateway is online.
6. Open Checkout and start a Power Totem session.
7. Confirm the x402 challenge targets `/power-totem/{id}/session`.
8. Sign the Stellar testnet payment with the exact destination, amount, asset, and nonce memo.
9. Submit the signed `txXDR`.
10. Confirm the session becomes authorized.
11. Let the gateway fetch authorization, enable output, disable output, complete the session, and report events.
12. Open Health and Status to show readiness for API, Stellar, Etherfuse, and gateway heartbeat.

## Commands

Supabase Edge:

```bash
supabase functions deploy kivo-api --project-ref <project-ref> --use-api --no-verify-jwt
```

Frontend:

```bash
cd apps/kivo/web
npm run lint
npx vitest run --reporter=default --pool=forks
npm run build
```

Gateway:

```bash
cd apps/kivo/gateway
npm test
npm run build
```

Preflight:

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://<project-ref>.supabase.co/functions/v1/kivo-api
```
