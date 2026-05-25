import { assertGatewayConfig, type GatewayConfig } from '../gateway';

export function createRaspberryGatewayRuntime(config: GatewayConfig) {
  const runtimeConfig = assertGatewayConfig(config);

  return {
    ...runtimeConfig,
    adapter: 'raspberry' as const,
    heartbeatHeaders() {
      return {
        'x-gateway-token': runtimeConfig.gatewayToken,
      };
    },
  };
}
