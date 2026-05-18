import { describe, expect, it } from 'vitest';
import {
  buildIntegrationSnippet,
  createDefaultFlowDraft,
  createFlowRoute,
  deriveSoloFlows,
  getTemplateById,
  soloMvpTemplates,
} from './soloMvp';
import type { Device, Payment, X402PricingRule } from '@/types/kivo';

const device: Device = {
  id: 'dev_ev_1',
  name: 'Charger A1',
  ownerId: 'owner_1',
  apiKeyPreview: 'kivo_dev_1234',
  stellarPublicKey: 'GDEVICEPUBLICKEY',
  status: 'active',
  metadata: {
    location: 'Garage',
    price: '0.75',
    resource: '/devices/charger-a1/session',
    templateId: 'device-pay-ev-charging',
    unit: 'session',
  },
  balances: [{ assetCode: 'USDC', amount: '10.5' }],
  createdAt: '2026-05-17T10:00:00Z',
  updatedAt: '2026-05-17T10:00:00Z',
};

const pricingRule: X402PricingRule = {
  id: 'x402_rule_1',
  resource: '/api/x402/data',
  amount: '0.0500000',
  asset: 'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
  maxTimeout: 300,
  enabled: true,
  description: 'Premium sensor reading',
  updatedAt: '2026-05-17T10:00:00Z',
};

const payment: Payment = {
  id: 'pay_1',
  fromDeviceId: 'dev_customer',
  toDeviceId: 'dev_ev_1',
  amount: '0.50',
  assetCode: 'USDC',
  conditionType: 'energy_kwh',
  conditionValue: '1',
  status: 'confirmed',
  createdAt: '2026-05-17T11:00:00Z',
  events: [],
};

const pricingRulePayment: Payment = {
  id: 'pay_x402_1',
  fromDeviceId: 'dev_customer',
  toDeviceId: 'kivo_platform',
  amount: '0.05',
  assetCode: 'USDC',
  conditionType: 'service_complete',
  status: 'confirmed',
  memo: 'paid access to /api/x402/data',
  createdAt: '2026-05-17T11:30:00Z',
  events: [],
};

describe('soloMvp', () => {
  it('defines exactly three templates in the planned order', () => {
    expect(soloMvpTemplates.map((template) => template.id)).toEqual([
      'device-pay-ev-charging',
      'paid-api-endpoint',
      'iot-data-feed',
    ]);
  });

  it('builds concrete Kivo integration snippets for every template', () => {
    for (const template of soloMvpTemplates) {
      const snippet = buildIntegrationSnippet({
        templateId: template.id,
        resource: template.defaultResourceName,
        price: template.defaultPrice,
        unit: template.defaultUnit,
      });

      expect(snippet).toContain('Kivo');
      expect(snippet).not.toMatch(/REPLACE_ME|YOUR_/i);
    }
  });

  it('uses the flow resource path in integration snippets', () => {
    const snippet = buildIntegrationSnippet({
      templateId: 'device-pay-ev-charging',
      resource: '/devices/garage-charger/session',
      price: '0.50',
      unit: 'kWh',
    });

    expect(snippet).toContain('resource: "/devices/garage-charger/session"');
    expect(snippet).not.toContain('resource: "Garage charger"');
  });

  it('derives a device flow from an active device and confirmed payment', () => {
    const flows = deriveSoloFlows({
      devices: [device],
      payments: [payment],
      pricingRules: [],
    });

    expect(flows).toHaveLength(1);
    expect(flows[0]).toMatchObject({
      id: 'flow_dev_ev_1',
      templateId: 'device-pay-ev-charging',
      status: 'active',
      price: '0.75',
      unit: 'session',
      resource: '/devices/charger-a1/session',
      revenueUsdc: 0.5,
      paymentsCount: 1,
      sessionsCount: 1,
      failedPaymentsCount: 0,
    });
  });

  it('finds templates by id', () => {
    expect(getTemplateById('paid-api-endpoint').name).toBe('Endpoint de API pago');
  });

  it('creates a default draft from a template', () => {
    const draft = createDefaultFlowDraft('device-pay-ev-charging');

    expect(draft.name).toBe('Carregador da garagem');
    expect(draft.price).toBe('0.50');
    expect(draft.unit).toBe('kWh');
    expect(draft.resource).toBe('/devices/carregador-da-garagem/session');
  });

  it('builds template-aware create flow routes', () => {
    expect(createFlowRoute('paid-api-endpoint')).toBe('/create-flow?template=paid-api-endpoint');
  });

  it('derives pricing-rule flows for x402 resources', () => {
    const [flow] = deriveSoloFlows({
      devices: [],
      payments: [],
      pricingRules: [pricingRule],
    });

    expect(flow).toMatchObject({
      id: 'flow_x402_rule_1',
      templateId: 'iot-data-feed',
      status: 'active',
      unit: 'reading',
      resource: '/api/x402/data',
    });
  });

  it('aggregates direct pricing-rule payments by memo resource', () => {
    const [flow] = deriveSoloFlows({
      devices: [],
      payments: [pricingRulePayment],
      pricingRules: [pricingRule],
    });

    expect(flow).toMatchObject({
      revenueUsdc: 0.05,
      sessionsCount: 1,
      paymentsCount: 1,
      failedPaymentsCount: 0,
      lastActivityAt: '2026-05-17T11:30:00Z',
    });
  });
});
