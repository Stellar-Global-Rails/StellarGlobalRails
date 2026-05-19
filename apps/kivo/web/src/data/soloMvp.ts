import type {
  Device,
  CreateFlowDraft,
  KivoFlow,
  KivoFlowUnit,
  KivoTemplate,
  KivoTemplateId,
  Payment,
  X402PricingRule,
} from '@/types/kivo';

export const soloMvpTemplates: KivoTemplate[] = [
  {
    id: 'device-pay-ev-charging',
    name: 'Cobrança por dispositivo / Recarga EV',
    shortName: 'Recarga EV',
    category: 'Device',
    icon: 'solar:bolt-circle-bold-duotone',
    description: 'Cobre pelo uso de carregadores, máquinas, lockers ou gateways por sessão, kWh ou tempo.',
    bestFor: 'Dispositivos IoT que precisam liberar uso somente depois do pagamento.',
    defaultResourceName: 'Carregador da garagem',
    defaultPrice: '0.50',
    defaultUnit: 'kWh',
    integrationMode: 'gateway_sdk',
    primaryActionLabel: 'Criar flow de device',
  },
  {
    id: 'paid-api-endpoint',
    name: 'Endpoint de API pago',
    shortName: 'API paga',
    category: 'API',
    icon: 'solar:code-square-bold-duotone',
    description: 'Coloque cobrança por uso na frente de uma rota premium de API.',
    bestFor: 'Quem vende acesso a dados, inferência, automações ou ferramentas.',
    defaultResourceName: 'Rota premium da API',
    defaultPrice: '0.05',
    defaultUnit: 'request',
    integrationMode: 'api_middleware',
    primaryActionLabel: 'Criar flow de API',
  },
  {
    id: 'iot-data-feed',
    name: 'Feed de dados IoT',
    shortName: 'Feed de dados',
    category: 'Dados',
    icon: 'solar:database-bold-duotone',
    description: 'Venda leituras autenticadas de sensores, gateways e telemetria de máquinas.',
    bestFor: 'Dispositivos conectados que publicam dados ou eventos pagos.',
    defaultResourceName: 'Feed de dados do sensor',
    defaultPrice: '0.10',
    defaultUnit: 'reading',
    integrationMode: 'data_feed',
    primaryActionLabel: 'Criar flow de dados',
  },
];

export const KIVO_DEFAULT_USDC_ASSET = 'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

const kivoFlowUnits: KivoFlowUnit[] = ['session', 'kWh', 'minute', 'request', 'reading', 'package'];

interface IntegrationSnippetInput {
  templateId: KivoTemplateId;
  resource?: string;
  price?: string;
  unit?: KivoFlowUnit;
}

interface DeriveSoloFlowsInput {
  devices: Device[];
  payments: Payment[];
  pricingRules: X402PricingRule[];
}

interface PricingRulePaymentTarget {
  id?: string;
  pricingRuleId?: string;
  resource: string;
  description?: string;
  name?: string;
}

export function getTemplateById(id: KivoTemplateId): KivoTemplate {
  const template = soloMvpTemplates.find((item) => item.id === id);

  if (!template) {
    throw new Error(`Unknown Kivo template: ${id}`);
  }

  return template;
}

export function createDefaultFlowDraft(templateId: KivoTemplateId): CreateFlowDraft {
  const template = getTemplateById(templateId);
  const slug = slugify(template.defaultResourceName);

  return {
    templateId,
    name: template.defaultResourceName,
    price: template.defaultPrice,
    unit: template.defaultUnit,
    resource: buildDefaultResourcePath(templateId, slug),
  };
}

export function createFlowRoute(templateId: KivoTemplateId): string {
  return `/create-flow?template=${encodeURIComponent(templateId)}`;
}

export function buildIntegrationSnippet(input: IntegrationSnippetInput): string {
  const template = getTemplateById(input.templateId);
  const resource = input.resource ?? createDefaultFlowDraft(input.templateId).resource;
  const price = input.price ?? template.defaultPrice;
  const unit = input.unit ?? template.defaultUnit;

  if (template.integrationMode === 'gateway_sdk') {
    return `import { KivoGateway } from '@kivo/sdk';

const kivo = new KivoGateway({
  apiKey: process.env.KIVO_API_KEY,
  deviceId: process.env.KIVO_DEVICE_ID,
});

export async function authorizeSession() {
  return kivo.authorize({
    resource: ${JSON.stringify(resource)},
    amount: ${JSON.stringify(price)},
    unit: ${JSON.stringify(unit)},
  });
}`;
  }

  if (template.integrationMode === 'api_middleware') {
    return `import { KivoPaywall } from '@kivo/sdk';

const paywall = new KivoPaywall({
  apiKey: process.env.KIVO_API_KEY,
});

export const GET = paywall.requirePayment({
  resource: ${JSON.stringify(resource)},
  amount: ${JSON.stringify(price)},
  unit: ${JSON.stringify(unit)},
  handler: async () => Response.json({ unlocked: true }),
});`;
  }

  return `import { KivoDataFeed } from '@kivo/sdk';

const feed = new KivoDataFeed({
  apiKey: process.env.KIVO_API_KEY,
  deviceId: process.env.KIVO_DEVICE_ID,
});

export async function publishReading(reading: Record<string, unknown>) {
  return feed.publishPaidReading({
    resource: ${JSON.stringify(resource)},
    amount: ${JSON.stringify(price)},
    unit: ${JSON.stringify(unit)},
    reading,
  });
}`;
}

export function deriveSoloFlows(input: DeriveSoloFlowsInput): KivoFlow[] {
  const deviceFlows = input.devices.map((device) => buildDeviceFlow(device, input.payments));
  const pricingRuleFlows = input.pricingRules.map((rule) => buildPricingRuleFlow(rule, input.payments));

  return [...deviceFlows, ...pricingRuleFlows];
}

export function isDirectPricingRulePayment(payment: Payment, target: PricingRulePaymentTarget): boolean {
  const memo = payment.memo?.toLowerCase() ?? '';

  if (!memo) {
    return false;
  }

  const searchableTokens = [
    target.resource,
    target.id,
    target.pricingRuleId,
    target.description,
    target.name,
  ]
    .map((token) => token?.trim().toLowerCase())
    .filter((token): token is string => Boolean(token));

  return searchableTokens.some((token) => memo.includes(token));
}

function buildDeviceFlow(device: Device, payments: Payment[]): KivoFlow {
  const templateId = getDeviceTemplateId(device);
  const template = getTemplateById(templateId);
  const unit = getDeviceFlowUnit(device, template.defaultUnit);
  const relatedPayments = payments.filter(
    (payment) => payment.fromDeviceId === device.id || payment.toDeviceId === device.id,
  );
  const confirmedPayments = relatedPayments.filter((payment) => payment.status === 'confirmed');
  const failedPayments = relatedPayments.filter((payment) => payment.status === 'failed');

  return {
    id: `flow_${device.id}`,
    templateId,
    name: device.name,
    status: device.status === 'active' ? 'active' : 'needs_setup',
    price: device.metadata.price ?? template.defaultPrice,
    unit,
    resource: device.metadata.resource ?? device.metadata.location ?? template.defaultResourceName,
    integrationMode: template.integrationMode,
    deviceId: device.id,
    revenueUsdc: sumConfirmedUsdc(confirmedPayments),
    sessionsCount: relatedPayments.length,
    paymentsCount: relatedPayments.length,
    failedPaymentsCount: failedPayments.length,
    lastActivityAt: getLatestActivityAt([device.updatedAt, ...relatedPayments.map((payment) => payment.createdAt)]),
    setupChecklist: [
      {
        id: 'device-registered',
        label: 'Device registrado',
        complete: true,
      },
      {
        id: 'wallet-ready',
        label: 'Carteira pronta',
        complete: Boolean(device.stellarPublicKey && device.balances.length > 0),
      },
      {
        id: 'test-payment-completed',
        label: 'Pagamento de teste feito',
        complete: confirmedPayments.length > 0,
      },
    ],
  };
}

function buildPricingRuleFlow(rule: X402PricingRule, payments: Payment[]): KivoFlow {
  const isDataResource = rule.resource.toLowerCase().includes('data');
  const template = getTemplateById(isDataResource ? 'iot-data-feed' : 'paid-api-endpoint');
  const unit: KivoFlowUnit = isDataResource ? 'reading' : 'request';
  const relatedPayments = payments.filter((payment) => isDirectPricingRulePayment(payment, rule));
  const confirmedPayments = relatedPayments.filter((payment) => payment.status === 'confirmed');
  const failedPayments = relatedPayments.filter((payment) => payment.status === 'failed');

  return {
    id: `flow_${rule.id}`,
    templateId: template.id,
    name: rule.description ?? template.defaultResourceName,
    status: rule.enabled ? 'active' : 'needs_setup',
    price: rule.amount,
    unit,
    resource: rule.resource,
    integrationMode: template.integrationMode,
    pricingRuleId: rule.id,
    revenueUsdc: sumConfirmedUsdc(confirmedPayments),
    sessionsCount: relatedPayments.length,
    paymentsCount: relatedPayments.length,
    failedPaymentsCount: failedPayments.length,
    lastActivityAt: getLatestActivityAt([rule.updatedAt, ...relatedPayments.map((payment) => payment.createdAt)]),
    setupChecklist: [
      {
        id: 'pricing-configured',
        label: 'Preco configurado',
        complete: Number.parseFloat(rule.amount) > 0,
      },
      {
        id: 'resource-configured',
        label: 'Recurso configurado',
        complete: rule.resource.length > 0,
      },
      {
        id: 'rule-enabled',
        label: 'Cobranca ativa',
        complete: rule.enabled,
      },
    ],
  };
}

function getDeviceTemplateId(device: Device): KivoTemplateId {
  const templateId = device.metadata.templateId;

  if (isKivoTemplateId(templateId)) {
    return templateId;
  }

  return 'device-pay-ev-charging';
}

function isKivoTemplateId(value: string | undefined): value is KivoTemplateId {
  return soloMvpTemplates.some((template) => template.id === value);
}

function getDeviceFlowUnit(device: Device, fallback: KivoFlowUnit): KivoFlowUnit {
  const unit = device.metadata.unit;

  if (kivoFlowUnits.includes(unit as KivoFlowUnit)) {
    return unit as KivoFlowUnit;
  }

  return fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function buildDefaultResourcePath(templateId: KivoTemplateId, slug: string): string {
  if (templateId === 'device-pay-ev-charging') {
    return `/devices/${slug}/session`;
  }

  if (templateId === 'iot-data-feed') {
    return `/data/${slug}`;
  }

  return `/api/${slug}`;
}

function sumConfirmedUsdc(payments: Payment[]): number {
  return payments.reduce((total, payment) => {
    if (payment.assetCode !== 'USDC') {
      return total;
    }

    return total + Number.parseFloat(payment.amount);
  }, 0);
}

function getLatestActivityAt(dates: string[]): string | undefined {
  return dates
    .filter(Boolean)
    .sort((left, right) => Date.parse(right) - Date.parse(left))
    .at(0);
}
