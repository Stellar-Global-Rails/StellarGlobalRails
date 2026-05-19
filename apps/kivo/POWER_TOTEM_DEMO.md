# Kivo Power Totem Demo

## One-liner

Kivo lets humans, machines, and agents pay for physical or digital resources. Power Totem proves that loop in the real world: scan a QR code, pay with x402, validate on Stellar/Etherfuse, and unlock a Raspberry-controlled output.

## Online Meet path

1. Open Kivo Studio.
2. Create a Power Totem with a name, price, unit, and session duration.
3. Show the generated resource path: `/power-totem/{id}/session`.
4. Create the gateway pairing token and show the gateway token once.
5. Open the totem simulator and confirm it is waiting for gateway authorization.
6. Open Checkout for the same Power Totem resource.
7. Generate the x402 challenge.
8. Submit the signed Stellar testnet XDR.
9. Show the Power Session moving to authorized.
10. Toggle the simulator output, showing the unlock/countdown behavior.
11. Open Health and Status to show operational readiness and platform state.

## Stellar Village RJ path

1. Put the physical table in view: Raspberry, low-voltage output, screen, and printed QR code.
2. Scan the QR code from a phone or laptop and open Checkout.
3. Generate the x402 challenge for the Power Totem session.
4. Sign and submit the Stellar testnet payment XDR.
5. Show the payment/session validation in the dashboard.
6. Let the gateway poll for authorization.
7. Trigger the Raspberry output: LED, mini fan, or another low-voltage load.
8. Keep the countdown visible while the output is active.
9. Return to the dashboard to show the completed session and recent payment.

## Safety

Use low-voltage demo hardware only. Do not switch AC mains, wall power, or any unsafe load during the demo.
