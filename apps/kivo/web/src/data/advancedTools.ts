export interface AdvancedTool {
  title: string;
  route: string;
  icon: string;
  description: string;
  keywords: string;
}

export const advancedTools: AdvancedTool[] = [
  {
    title: 'Devices',
    route: '/devices',
    icon: 'solar:devices-bold-duotone',
    description: 'Device registry, wallets, API keys and status.',
    keywords: 'device registry wallet api key status operator',
  },
  {
    title: 'API Keys',
    route: '/api-keys',
    icon: 'solar:key-minimalistic-bold-duotone',
    description: 'Server-side credentials for SDKs, gateways and workers.',
    keywords: 'api keys credentials sdk gateway workers server-side',
  },
  {
    title: 'Webhooks',
    route: '/webhooks',
    icon: 'solar:widget-2-bold-duotone',
    description: 'Delivery logs, retry state and event subscriptions.',
    keywords: 'webhooks delivery logs retry events subscriptions',
  },
  {
    title: 'x402 Rules',
    route: '/x402',
    icon: 'solar:shield-keyhole-bold-duotone',
    description: 'Pricing rules and protected HTTP resources.',
    keywords: 'x402 rules payment required header protected resources pricing',
  },
  {
    title: 'MCP Tools',
    route: '/mcp',
    icon: 'solar:cpu-bolt-bold-duotone',
    description: 'Agent tools for paid resources and automation.',
    keywords: 'mcp tools agent automation paid resources json-rpc',
  },
  {
    title: 'Deploy',
    route: '/deploy',
    icon: 'solar:rocket-bold-duotone',
    description: 'Cloud readiness, secrets and service checks.',
    keywords: 'deploy readiness secrets service checks release env build',
  },
  {
    title: 'Workflows',
    route: '/workflows',
    icon: 'solar:routing-2-bold-duotone',
    description: 'Workers, queues and durable automation direction.',
    keywords: 'workflows workers queues durable automation redis temporal',
  },
  {
    title: 'Settings',
    route: '/settings',
    icon: 'solar:settings-bold-duotone',
    description: 'Workspace, environment and integration settings.',
    keywords: 'settings workspace environment integration configuration',
  },
];

export function getAdvancedTool(route: string): AdvancedTool | undefined {
  return advancedTools.find((tool) => tool.route === route);
}
