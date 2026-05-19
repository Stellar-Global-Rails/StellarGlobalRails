# Kivo Delivery Readiness

Last checked: 2026-05-18

## Current Status

- Frontend deploy: Vercel is already configured by the operator.
- Production API target: Supabase Edge Function `kivo-api`.
- Fly.io: removed from the MVP path because the trial/billing blocker made it unreliable for delivery.
- Go API: retired from the MVP runtime; the Solo MVP routes now run in TypeScript on Supabase Edge.
- Supabase schema: `kivo_*` tables, RLS, grants, and compatibility alignment applied to the cloud project.
- Edge route parity: dashboard, devices, payments, x402, webhooks, API keys, MCP tools/config, workflows, deploy checks, and Etherfuse proxy are active.
- Product UI: Checkout, Deploy, and x402 no longer expose test-harness wording in normal mode.
- Dev-only controls: hidden unless `VITE_KIVO_ENABLE_DEV_CONTROLS=true`.

## Current Blockers

1. Wallet signing remains an external user/device step.
   - `GET /v1/x402/challenge` persists a nonce.
   - `POST /v1/x402/pay` validates destination, amount, asset, and nonce memo before submitting the signed XDR to Stellar Horizon.
   - The Kivo UI still needs a wallet/SDK-produced `txXDR` to complete the paid retry.

2. Local Supabase/Postgres is not reachable in the current CLI session.
   - Docker Desktop Linux engine was not available during the last preflight.
   - Production deploy can still use `supabase functions deploy --use-api`.
   - Resolution for local dev: start Docker Desktop, then run `supabase start --workdir .`.

3. Local `.env` can lag cloud secrets.
   - Supabase Edge has `ETHERFUSE_WEBHOOK_SECRET` configured.
   - The secret is not recoverable from Supabase after creation; rotate it if a local visible copy is required.

4. `X402_PLATFORM_KEY` must be the funded Stellar testnet public key.
   - The public key must start with `G` and be funded on Stellar testnet.
   - The secret key must stay outside the browser and should not be committed.

5. Supabase Auth leaked password protection is still a dashboard setting.
   - Supabase Advisor reports it as a warning, not a runtime blocker.
   - Enable it before public onboarding.

## Go/No-Go Checklist

- [x] `supabase/functions/kivo-api` deployed with `--use-api --no-verify-jwt`.
- [x] `GET /v1/health` returns `200`.
- [x] `GET /v1/etherfuse/status` returns configured Devnet status.
- [x] `GET /v1/etherfuse/assets` returns at least one Stellar rampable asset.
- [x] `POST /v1/etherfuse/webhook` verifies signature and persists the event when signed.
- [x] `GET /v1/x402/challenge?resource=/api/x402/data` returns a persisted nonce.
- [x] `POST /v1/x402/pay` validates signed Stellar XDR and submits it to Horizon; invalid XDR fails without fake success.
- [x] `GET /api/x402/data` rejects unpaid requests with `402`.
- [x] `GET /api/x402/data` unlocks with `200` after a valid signed XDR is supplied.
- [x] Frontend Vercel env `VITE_KIVO_API_URL` points to the healthy Supabase Edge Function.
- [x] Supabase Auth login works against the Edge API in smoke tests.
- [x] Supabase Advisor has no Kivo schema errors; only Auth leaked password protection remains as a dashboard warning.
- [x] Create Flow publishes either a device flow or an x402 pricing rule.
- [x] Dashboard, Checkout, Deploy, and x402 run without Fly runtime references.

## Demo Flow

1. Login in Kivo.
2. Open Home and click `Create Flow`.
3. Pick `Paid API` or `EV Charging`.
4. Publish the flow.
5. Open `Test Payment`.
6. Request price/challenge.
7. Sign the payment transaction with a Stellar testnet wallet or SDK, paying the exact destination/amount/asset and using memo text `nonce` or memo hash `sha256(nonce)`.
8. Paste the signed `txXDR`.
9. Submit payment.
10. Show the unlocked response and the payment in the dashboard.
11. Open Deploy and show Etherfuse Devnet status from the Supabase Edge Function.

## Commands

Supabase Edge:

```bash
supabase functions deploy kivo-api --project-ref <project-ref> --use-api --no-verify-jwt
```

Frontend:

```bash
cd apps/kivo/web
npm run lint
npm test -- --run
npm run build
```

Preflight:

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://<project-ref>.supabase.co/functions/v1/kivo-api
```
