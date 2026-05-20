export type GatewayMode = 'physical' | 'digital';

export interface GatewayConfig {
  gatewayId: string;
  gatewayToken: string;
  mode: GatewayMode;
}

export function assertGatewayConfig(config: GatewayConfig): GatewayConfig {
  if (!config.gatewayId.trim()) {
    throw new Error('gatewayId is required');
  }

  if (!config.gatewayToken.trim()) {
    throw new Error('gatewayToken is required');
  }

  return config;
}
