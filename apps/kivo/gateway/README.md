# Kivo Power Totem Gateway

Small Node.js gateway runtime for the Power Totem. It polls Kivo for an authorized session, enables an output adapter, reports lifecycle events, disables the adapter, and lets the Kivo API complete the session from the signed Gateway event.

## Setup

```powershell
cd apps/kivo/gateway
npm install
```

Required environment variables:

```powershell
$env:KIVO_API_URL="https://your-kivo-api.example"
$env:KIVO_GATEWAY_ID="gateway_..."
$env:KIVO_GATEWAY_TOKEN="kgw_..."
$env:KIVO_GATEWAY_ADAPTER="raspberry"
```

Optional environment variables:

```powershell
$env:KIVO_GATEWAY_POLL_INTERVAL_MS="5000"
$env:KIVO_GATEWAY_WAIT="true"
$env:KIVO_GATEWAY_ENABLE_COMMAND="path-to-enable-command"
$env:KIVO_GATEWAY_DISABLE_COMMAND="path-to-disable-command"
```

`KIVO_GATEWAY_TOKEN` is sent as `x-gateway-token` for heartbeat, authorization, and gateway event requests. The runtime does not need a user API token: `session.completed` is accepted only when the Gateway token belongs to the session's Gateway.

## Local Run

Run one polling cycle:

```powershell
npm run dev -- once
```

Run continuously:

```powershell
npm run dev -- start
```

For quick local hardware tests that should not wait for the full authorization duration:

```powershell
$env:KIVO_GATEWAY_WAIT="false"
npm run dev -- once
```

## Raspberry Adapter

The Raspberry adapter is a shell-command adapter. It does not control mains power directly. Use it only to call your own low-voltage relay, GPIO, or controller script with proper electrical isolation and hardware safety.

Example:

```powershell
$env:KIVO_GATEWAY_ADAPTER="raspberry"
$env:KIVO_GATEWAY_ENABLE_COMMAND="node ./scripts/relay-on.js"
$env:KIVO_GATEWAY_DISABLE_COMMAND="node ./scripts/relay-off.js"
npm run dev -- start
```

When `KIVO_GATEWAY_ADAPTER=raspberry`, both command variables are required at startup so the process fails before polling or actuation if the shell adapter is not fully configured.

The adapter passes these variables to each command:

- `KIVO_SESSION_ID`
- `KIVO_DURATION_SECONDS`

## Validation

```powershell
npm test
npm run build
```
