import { KivoClient, createRaspberryGatewayRuntime } from '../src';

const client = new KivoClient({
  baseUrl: process.env.KIVO_BASE_URL ?? 'https://api.kivo.example',
  apiKey: process.env.KIVO_API_KEY,
});

const runtime = createRaspberryGatewayRuntime({
  gatewayId: process.env.KIVO_GATEWAY_ID ?? '',
  gatewayToken: process.env.KIVO_GATEWAY_TOKEN ?? '',
  mode: 'physical',
});

await client.sendGatewayHeartbeat(runtime.gatewayId, runtime.gatewayToken);
