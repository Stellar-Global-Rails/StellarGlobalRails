# Stellar Global Rails

**Stellar Global Rails (SGR)** is a monorepo of financial infrastructure products built on the [Stellar](https://stellar.org) network. Three independent, production-ready apps sharing a unified Supabase backend, each solving a distinct problem in global payments.

> Built for Stellar's 2025 Hackathon · Docs at `/doc/ai` on the landing page

---

## Products

### ContractEase
**Verifiable contracts anchored on Stellar.**

Sign documents, generate SHA-256 hashes, issue on-chain certificates, and enable trustless escrow via Stellar Claimable Balances. Any party can verify authenticity through a public URL — no middlemen.

> **Moved to its own repository:** [LucasVital08/contractease](https://github.com/LucasVital08/contractease) — includes the React app and the Soroban smart contracts (formerly `apps/contractease/` and `soroban-contracts/` here).

---

### SocialPay
**Social payments over Stellar with @handles.**

Send money to anyone using a human-readable handle instead of a raw Stellar address. Think Venmo on-chain — with stablecoin rails, real-time settlement, and fiat on/off ramp via SEP-24.

- @handle system mapped to Stellar keypairs (Supabase)
- USDC / BRZ transfers with T+0 settlement
- SEP-24 on-ramp (Pix → USDC) and off-ramp
- Activity feed, transaction history, deep links

```
apps/socialpay/      → Next.js + Supabase Auth
```

---

### Kivo Pay
**x402 payment flows for devices, paid APIs, and IoT data feeds.**

The payment layer for solo operators shipping machine-to-machine products. A user creates a flow, connects Kivo SDK/middleware, receives an x402 challenge, signs a Stellar transaction, and unlocks the paid resource.

- x402 Protocol (HTTP 402) for machine-to-machine payments
- Etherfuse Devnet funding/on-ramp path proxied server-side
- MCP/advanced tools kept behind the product workflow
- Supabase Auth/Postgres for workspace, devices, payments, and webhooks

```
apps/kivo/           → React/Vite product front + Supabase Edge API
```

---

## Repository Structure

```
StellarGlobalRails/
├── apps/
│   ├── socialpay/             # Next.js app
│   └── kivo/                  # Kivo React/Vite front
├── supabase/functions/kivo-api/ # Kivo Supabase Edge API
├── landing-page-astro/        # Marketing site + documentation
│   └── src/pages/doc/ai/
│       ├── contractease/      # 10 ADR/Living docs
│       ├── socialpay/         # 10 ADR/Living docs
│       └── kivo/              # 10 ADR/Living docs
└── README.md
```

---

## Stack

| Layer | Technology |
|---|---|
| Frontend (SocialPay) | Next.js 15 + Supabase client |
| Backend API (Kivo) | Supabase Edge Functions + TypeScript |
| Auth | Supabase Auth (all 3 products) |
| Database | PostgreSQL via Supabase (RLS per product) |
| Blockchain | Stellar Mainnet + Testnet (Horizon + Soroban) |
| Landing / Docs | Astro 5 + MDX + Tailwind + React islands |
| Deploy | Vercel (frontends) + Supabase Edge Functions |

---

## Documentation

Each product has 10 structured documents following Stellar's ADR/Living Document format:

| Section | What it covers |
|---|---|
| Product Overview | What it is, for whom, and why Stellar |
| Architecture & ADRs | Key decisions and their rationale |
| Data Models | Database schema and entity relationships |
| API Reference | Endpoints, auth, request/response shapes |
| Auth & Security | Auth flow, RLS policies, key management |
| Stellar Integration | How each product uses the Stellar network |
| Product-specific | Signing flow / @handle system / x402 Protocol |
| Frontend | Component structure, routing, state |
| Deployment | Infrastructure, env vars, CI/CD |
| Roadmap | What's built, what's next |

Access the docs at `[your-domain]/doc/ai` — use the product selector in the sidebar to navigate between ContractEase, SocialPay, and Kivo Pay.

---

## Getting Started

### Landing Page
```bash
cd landing-page-astro
npm install
npm run dev        # http://localhost:4321
```

### ContractEase

Now lives in its own repository: [LucasVital08/contractease](https://github.com/LucasVital08/contractease)

### SocialPay
```bash
cd apps/socialpay
npm install
cp .env.example .env
npm run dev
```

### Kivo
```bash
cd apps/kivo/web
npm install
npm run dev           # http://localhost:5174
```

---

## Stellar Integration Summary

| Product | How it uses Stellar |
|---|---|
| ContractEase | SHA-256 hash anchored via `manageData` operation; Claimable Balances for escrow |
| SocialPay | Custodial keypairs per user; USDC path payments; SEP-24 anchor integration |
| Kivo Pay | Device wallets; x402 HTTP payment protocol; path payments across currencies via DEX |

---

## Authors

Built by **Charlles Augusto** & **Lucas Vital** for the Stellar 2025 Hackathon.

- GitHub: [LucasVital08/StellarGlobalRails](https://github.com/LucasVital08/StellarGlobalRails)
