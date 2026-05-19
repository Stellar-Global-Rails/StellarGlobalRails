# Kivo Power Totem Demo

## One-liner

Kivo lets humans, machines, and agents pay for physical or digital resources. Power Totem proves that loop in the real world: preview the kiosk QR/resource screen, run an authenticated x402 checkout, validate on Stellar/Etherfuse, and unlock a Raspberry-controlled output.

## Online Meet path

1. Open Kivo Studio.
2. Create a Power Totem with a name, price, unit, and session duration.
3. Show the generated resource path: `/power-totem/{id}/session`.
4. Create the gateway pairing token and show the gateway token once.
5. Open the simulator/display preview and show the resource/QR preview as the kiosk screen, not a public buyer checkout link.
6. Open authenticated Checkout from the operator UI.
7. Choose the Power Totem and create the Power Session.
8. Start the x402 flow and generate the challenge.
9. Paste the signed Stellar testnet XDR.
10. Show the Power Session moving to authorized.
11. Show the simulator/gateway receiving authorization and toggling the output/countdown.
12. Open Health and Status to show operational readiness and platform state.

## Stellar Village RJ path

1. Put the physical table in view: Raspberry, low-voltage output, screen, and printed QR preview.
2. Let the visitor see the physical totem/display resource and QR preview.
3. Explain that the public QR bridge is not live yet; for this hackathon demo, the operator runs the authenticated Checkout flow.
4. In the operator UI, choose the Power Totem, create the session, and generate the x402 challenge.
5. Sign and submit the Stellar testnet payment XDR.
6. Show the payment/session validation in the dashboard.
7. Let the gateway poll for authorization.
8. Trigger the Raspberry output: LED, mini fan, or another low-voltage load.
9. Keep the countdown visible while the output is active.
10. Return to the dashboard to show the completed session and recent payment.

## Safety

Use low-voltage demo hardware only. Do not switch AC mains, wall power, or any unsafe load during the demo.
