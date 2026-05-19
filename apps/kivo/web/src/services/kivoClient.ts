import { supabase } from '@/services/supabase';
import type {
  ApiKey,
  ApiKeyResult,
  ConditionProofInput,
  ConditionProofResult,
  CreateGatewayEventInput,
  CreatePaymentInput,
  CreatePowerTotemInput,
  DashboardSummary,
  DeployCheck,
  DeployServiceStatus,
  Device,
  DeviceRegistrationResult,
  EtherfuseAssetsResponse,
  EtherfuseOnboardingInput,
  EtherfuseOnboardingResponse,
  EtherfuseOrderInput,
  EtherfuseOrderResponse,
  EtherfuseQuoteInput,
  EtherfuseQuoteResponse,
  EtherfuseStatus,
  Gateway,
  GatewayEvent,
  GatewayPairingResult,
  KivoGatewayMode,
  McpAgentConfig,
  McpTool,
  McpToolCallResult,
  Payment,
  PowerSession,
  PowerTotem,
  RegisterDeviceInput,
  SdkExportBundle,
  StudioFlow,
  StudioIntent,
  StudioIntentInput,
  StudioLaunchOption,
  StudioTemplateSummary,
  StudioValidationRun,
  SystemHealth,
  Webhook,
  WebhookDelivery,
  WebhookTestResult,
  Workflow,
  X402Challenge,
  X402PaidResponse,
  X402PricingRule,
  X402PricingRuleInput,
  X402UnlockedResponse,
} from '@/types/kivo';

export interface KivoApiClient {
  getDashboardSummary(): Promise<DashboardSummary>;
  getHealth(): Promise<SystemHealth>;
  listDevices(): Promise<Device[]>;
  getDevice(id: string): Promise<DeviceRegistrationResult>;
  registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistrationResult>;
  updateDeviceStatus(id: string, status: Device['status']): Promise<Device>;
  listPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment>;
  createPayment(input: CreatePaymentInput): Promise<Payment>;
  executePayment(id: string, txXDR: string): Promise<Payment>;
  submitConditionProof(id: string, input: ConditionProofInput): Promise<ConditionProofResult>;
  listWebhooks(): Promise<Webhook[]>;
  createWebhook(input: Pick<Webhook, 'url' | 'events'>): Promise<Webhook & { secret: string }>;
  toggleWebhook(id: string, active: boolean): Promise<Webhook>;
  testWebhook(id: string): Promise<WebhookTestResult>;
  deleteWebhook(id: string): Promise<void>;
  listWebhookDeliveries(webhookId?: string): Promise<WebhookDelivery[]>;
  listApiKeys(): Promise<ApiKey[]>;
  createApiKey(input: Pick<ApiKey, 'name' | 'scopes' | 'expiresAt'>): Promise<ApiKeyResult>;
  revokeApiKey(id: string): Promise<ApiKey>;
  listMcpTools(): Promise<McpTool[]>;
  getMcpAgentConfig(): Promise<McpAgentConfig>;
  callMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpToolCallResult>;
  getX402Challenge(resource: string): Promise<X402Challenge>;
  payX402Challenge(nonce: string, txXDR: string): Promise<X402PaidResponse>;
  unlockX402Resource(resource: string, paymentHeader: string): Promise<X402UnlockedResponse>;
  listX402PricingRules(): Promise<X402PricingRule[]>;
  upsertX402PricingRule(input: X402PricingRuleInput): Promise<X402PricingRule>;
  listPowerTotems(): Promise<PowerTotem[]>;
  createPowerTotem(input: CreatePowerTotemInput): Promise<PowerTotem>;
  getPowerTotem(id: string): Promise<PowerTotem>;
  createPowerTotemPairingToken(totemId: string): Promise<GatewayPairingResult>;
  listPowerSessions(): Promise<PowerSession[]>;
  createPowerSession(totemId: string): Promise<PowerSession>;
  startPowerSessionCheckout(
    sessionId: string,
  ): Promise<{ session: PowerSession; checkoutResource: string; challenge: X402Challenge }>;
  authorizePowerSession(sessionId: string): Promise<{ session: PowerSession }>;
  completePowerSession(sessionId: string): Promise<PowerSession>;
  sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<Gateway>;
  getGatewayAuthorization(gatewayId: string, gatewayToken: string): Promise<{ authorization: PowerSession | null }>;
  createGatewayEvent(gatewayId: string, gatewayToken: string, input: CreateGatewayEventInput): Promise<GatewayEvent>;
  listWorkflows(): Promise<Workflow[]>;
  listDeployChecks(): Promise<DeployCheck[]>;
  listDeployServices(): Promise<DeployServiceStatus[]>;
  getEtherfuseStatus(): Promise<EtherfuseStatus>;
  listEtherfuseAssets(wallet?: string, currency?: string): Promise<EtherfuseAssetsResponse>;
  createEtherfuseOnboardingUrl(input: EtherfuseOnboardingInput): Promise<EtherfuseOnboardingResponse>;
  createEtherfuseQuote(input: EtherfuseQuoteInput): Promise<EtherfuseQuoteResponse>;
  createEtherfuseOrder(input: EtherfuseOrderInput): Promise<EtherfuseOrderResponse>;
  getEtherfuseOrder(orderId: string): Promise<EtherfuseOrderResponse>;
  signalEtherfuseFiatReceived(orderId: string): Promise<EtherfuseOrderResponse>;
  createStudioIntent(input: StudioIntentInput): Promise<StudioIntent>;
  listStudioFlows(): Promise<StudioFlow[]>;
  getStudioFlow(id: string): Promise<StudioFlow>;
  createStudioFlow(intentId: string): Promise<StudioFlow>;
  updateStudioGatewayMode(flowId: string, gatewayMode: KivoGatewayMode): Promise<StudioFlow>;
  getSdkExportBundle(flowId: string): Promise<SdkExportBundle>;
  startStudioValidation(flowId: string): Promise<StudioValidationRun>;
  getStudioValidationRun(flowId: string, runId: string): Promise<StudioValidationRun>;
  listStudioLaunchOptions(flowId: string): Promise<StudioLaunchOption[]>;
  listStudioTemplates(): Promise<StudioTemplateSummary[]>;
}

type Fetcher = typeof fetch;

export interface CreateKivoClientOptions {
  baseUrl?: string;
  getToken?: () => Promise<string | undefined> | string | undefined;
  fetcher?: Fetcher;
}

export class HttpKivoApiClient implements KivoApiClient {
  public readonly baseUrl: string;

  private readonly getToken?: CreateKivoClientOptions['getToken'];
  private readonly fetcher: Fetcher;

  constructor(options: CreateKivoClientOptions = {}) {
    this.baseUrl = options.baseUrl ?? '/api';
    this.getToken = options.getToken;
    this.fetcher = options.fetcher ?? fetch.bind(globalThis);
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    return this.request('/v1/dashboard');
  }

  async getHealth(): Promise<SystemHealth> {
    return this.request('/v1/health');
  }

  async listDevices(): Promise<Device[]> {
    return this.request('/v1/devices');
  }

  async getDevice(id: string): Promise<DeviceRegistrationResult> {
    return this.request(`/v1/devices/${encodeURIComponent(id)}`);
  }

  async registerDevice(input: RegisterDeviceInput): Promise<DeviceRegistrationResult> {
    return this.request('/v1/devices', { method: 'POST', body: JSON.stringify(input) });
  }

  async updateDeviceStatus(id: string, status: Device['status']): Promise<Device> {
    return this.request(`/v1/devices/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  }

  async listPayments(): Promise<Payment[]> {
    return this.request('/v1/payments');
  }

  async getPayment(id: string): Promise<Payment> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}`);
  }

  async createPayment(input: CreatePaymentInput): Promise<Payment> {
    return this.request('/v1/payments', { method: 'POST', body: JSON.stringify(input) });
  }

  async executePayment(id: string, txXDR: string): Promise<Payment> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}/execute`, { method: 'POST', body: JSON.stringify({ txXDR }) });
  }

  async submitConditionProof(id: string, input: ConditionProofInput): Promise<ConditionProofResult> {
    return this.request(`/v1/payments/${encodeURIComponent(id)}/condition-proof`, { method: 'POST', body: JSON.stringify(input) });
  }

  async listWebhooks(): Promise<Webhook[]> {
    return this.request('/v1/webhooks');
  }

  async createWebhook(input: Pick<Webhook, 'url' | 'events'>): Promise<Webhook & { secret: string }> {
    return this.request('/v1/webhooks', { method: 'POST', body: JSON.stringify(input) });
  }

  async toggleWebhook(id: string, active: boolean): Promise<Webhook> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ active }) });
  }

  async testWebhook(id: string): Promise<WebhookTestResult> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}/test`, { method: 'POST' });
  }

  async deleteWebhook(id: string): Promise<void> {
    return this.request(`/v1/webhooks/${encodeURIComponent(id)}`, { method: 'DELETE' });
  }

  async listWebhookDeliveries(webhookId?: string): Promise<WebhookDelivery[]> {
    const path = webhookId ? `/v1/webhooks/${encodeURIComponent(webhookId)}/deliveries` : '/v1/webhook-deliveries';
    return this.request(path);
  }

  async listApiKeys(): Promise<ApiKey[]> {
    return this.request('/v1/api-keys');
  }

  async createApiKey(input: Pick<ApiKey, 'name' | 'scopes' | 'expiresAt'>): Promise<ApiKeyResult> {
    return this.request('/v1/api-keys', { method: 'POST', body: JSON.stringify(input) });
  }

  async revokeApiKey(id: string): Promise<ApiKey> {
    return this.request(`/v1/api-keys/${encodeURIComponent(id)}/revoke`, { method: 'POST' });
  }

  async listMcpTools(): Promise<McpTool[]> {
    return this.request('/v1/mcp/tools');
  }

  async getMcpAgentConfig(): Promise<McpAgentConfig> {
    return this.request('/v1/mcp/config');
  }

  async callMcpTool(toolName: string, input: Record<string, unknown>): Promise<McpToolCallResult> {
    const response = await this.request<{
      result?: { content?: Array<{ text?: string }>; isError?: boolean };
      error?: { message?: string };
    }>('/mcp', {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: { name: toolName, arguments: input },
      }),
    });
    const text = response.result?.content?.[0]?.text ?? '{}';
    return {
      toolName,
      isError: Boolean(response.result?.isError || response.error),
      output: JSON.parse(text) as Record<string, unknown>,
      createdAt: new Date().toISOString(),
    };
  }

  async getX402Challenge(resource: string): Promise<X402Challenge> {
    return this.request(`/v1/x402/challenge?resource=${encodeURIComponent(resource)}`);
  }

  async payX402Challenge(nonce: string, txXDR: string): Promise<X402PaidResponse> {
    return this.request('/v1/x402/pay', { method: 'POST', body: JSON.stringify({ nonce, txXDR }) });
  }

  async unlockX402Resource(resource: string, paymentHeader: string): Promise<X402UnlockedResponse> {
    return this.request(resource, { headers: { 'X-PAYMENT': paymentHeader } });
  }

  async listX402PricingRules(): Promise<X402PricingRule[]> {
    return this.request('/v1/x402/pricing-rules');
  }

  async upsertX402PricingRule(input: X402PricingRuleInput): Promise<X402PricingRule> {
    return this.request('/v1/x402/pricing-rules', { method: 'PUT', body: JSON.stringify(input) });
  }

  async listPowerTotems(): Promise<PowerTotem[]> {
    return this.request('/v1/power-totems');
  }

  async createPowerTotem(input: CreatePowerTotemInput): Promise<PowerTotem> {
    return this.request('/v1/power-totems', { method: 'POST', body: JSON.stringify(input) });
  }

  async getPowerTotem(id: string): Promise<PowerTotem> {
    return this.request(`/v1/power-totems/${encodeURIComponent(id)}`);
  }

  async createPowerTotemPairingToken(totemId: string): Promise<GatewayPairingResult> {
    return this.request(`/v1/power-totems/${encodeURIComponent(totemId)}/pairing-token`, { method: 'POST' });
  }

  async listPowerSessions(): Promise<PowerSession[]> {
    return this.request('/v1/power-sessions');
  }

  async createPowerSession(totemId: string): Promise<PowerSession> {
    return this.request('/v1/power-sessions', { method: 'POST', body: JSON.stringify({ totemId }) });
  }

  async startPowerSessionCheckout(
    sessionId: string,
  ): Promise<{ session: PowerSession; checkoutResource: string; challenge: X402Challenge }> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/start-checkout`, { method: 'POST' });
  }

  async authorizePowerSession(sessionId: string): Promise<{ session: PowerSession }> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/authorize`, { method: 'POST' });
  }

  async completePowerSession(sessionId: string): Promise<PowerSession> {
    return this.request(`/v1/power-sessions/${encodeURIComponent(sessionId)}/complete`, { method: 'POST' });
  }

  async sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<Gateway> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/heartbeat`, {
      method: 'POST',
      headers: { 'x-gateway-token': gatewayToken },
    });
  }

  async getGatewayAuthorization(gatewayId: string, gatewayToken: string): Promise<{ authorization: PowerSession | null }> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/authorization`, {
      headers: { 'x-gateway-token': gatewayToken },
    });
  }

  async createGatewayEvent(gatewayId: string, gatewayToken: string, input: CreateGatewayEventInput): Promise<GatewayEvent> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/events`, {
      method: 'POST',
      headers: { 'x-gateway-token': gatewayToken },
      body: JSON.stringify(input),
    });
  }

  async listWorkflows(): Promise<Workflow[]> {
    return this.request('/v1/workflows');
  }

  async listDeployChecks(): Promise<DeployCheck[]> {
    return this.request('/v1/deploy/checks');
  }

  async listDeployServices(): Promise<DeployServiceStatus[]> {
    return this.request('/v1/deploy/services');
  }

  async getEtherfuseStatus(): Promise<EtherfuseStatus> {
    return this.request('/v1/etherfuse/status');
  }

  async listEtherfuseAssets(wallet = '', currency = 'MXN'): Promise<EtherfuseAssetsResponse> {
    const params = new URLSearchParams({ wallet, currency });
    return this.request(`/v1/etherfuse/assets?${params.toString()}`);
  }

  async createEtherfuseOnboardingUrl(input: EtherfuseOnboardingInput): Promise<EtherfuseOnboardingResponse> {
    return this.request('/v1/etherfuse/onboarding-url', { method: 'POST', body: JSON.stringify(input) });
  }

  async createEtherfuseQuote(input: EtherfuseQuoteInput): Promise<EtherfuseQuoteResponse> {
    return this.request('/v1/etherfuse/quotes', { method: 'POST', body: JSON.stringify(input) });
  }

  async createEtherfuseOrder(input: EtherfuseOrderInput): Promise<EtherfuseOrderResponse> {
    return this.request('/v1/etherfuse/orders', { method: 'POST', body: JSON.stringify(input) });
  }

  async getEtherfuseOrder(orderId: string): Promise<EtherfuseOrderResponse> {
    return this.request(`/v1/etherfuse/orders/${encodeURIComponent(orderId)}`);
  }

  async signalEtherfuseFiatReceived(orderId: string): Promise<EtherfuseOrderResponse> {
    return this.request(`/v1/etherfuse/orders/${encodeURIComponent(orderId)}/fiat-received`, { method: 'POST' });
  }

  async createStudioIntent(input: StudioIntentInput): Promise<StudioIntent> {
    return this.request('/v1/studio/intents', { method: 'POST', body: JSON.stringify(input) });
  }

  async listStudioFlows(): Promise<StudioFlow[]> {
    return this.request('/v1/studio/flows');
  }

  async getStudioFlow(id: string): Promise<StudioFlow> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(id)}`);
  }

  async createStudioFlow(intentId: string): Promise<StudioFlow> {
    return this.request('/v1/studio/flows', { method: 'POST', body: JSON.stringify({ intentId }) });
  }

  async updateStudioGatewayMode(flowId: string, gatewayMode: KivoGatewayMode): Promise<StudioFlow> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/gateway-mode`, {
      method: 'PUT',
      body: JSON.stringify({ gatewayMode }),
    });
  }

  async getSdkExportBundle(flowId: string): Promise<SdkExportBundle> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/sdk-export`);
  }

  async startStudioValidation(flowId: string): Promise<StudioValidationRun> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/validation-runs`, { method: 'POST' });
  }

  async getStudioValidationRun(flowId: string, runId: string): Promise<StudioValidationRun> {
    return this.request(
      `/v1/studio/flows/${encodeURIComponent(flowId)}/validation-runs/${encodeURIComponent(runId)}`,
    );
  }

  async listStudioLaunchOptions(flowId: string): Promise<StudioLaunchOption[]> {
    return this.request(`/v1/studio/flows/${encodeURIComponent(flowId)}/launch-options`);
  }

  async listStudioTemplates(): Promise<StudioTemplateSummary[]> {
    return this.request('/v1/studio/templates');
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await this.getToken?.();
    const headers = new Headers(init.headers);
    if (!headers.has('Content-Type') && init.body) {
      headers.set('Content-Type', 'application/json');
    }
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await this.fetcher(this.resolveUrl(path), { ...init, headers });
    if (!response.ok) {
      throw new Error(await readApiErrorMessage(response));
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return (await response.json()) as T;
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }
    const normalizedPath = path.replace(/^\//, '');
    if (/^https?:\/\//.test(this.baseUrl)) {
      return new URL(normalizedPath, `${this.baseUrl.replace(/\/$/, '')}/`).toString();
    }
    return `${this.baseUrl.replace(/\/$/, '')}/${normalizedPath}`;
  }
}

const readApiErrorMessage = async (response: Response): Promise<string> => {
  const fallback = `Kivo API error ${response.status}`;
  const body = await response.text();
  if (!body) {
    return fallback;
  }

  try {
    const payload = JSON.parse(body) as { message?: unknown; error?: unknown; code?: unknown };
    if (typeof payload.message === 'string' && payload.message.trim()) {
      return payload.message;
    }
    if (typeof payload.error === 'string' && payload.error.trim()) {
      return payload.error;
    }
    if (typeof payload.code === 'string' && payload.code.trim()) {
      return `${fallback}: ${payload.code}`;
    }
  } catch {
    return body;
  }

  return body;
};

export const createKivoClient = (options: CreateKivoClientOptions = {}): KivoApiClient => {
  const envBaseUrl = import.meta.env.VITE_KIVO_API_URL as string | undefined;
  const getSupabaseToken = async () => {
    if (!supabase) {
      return undefined;
    }
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token;
  };

  return new HttpKivoApiClient({
    baseUrl: options.baseUrl ?? envBaseUrl ?? '/api',
    getToken: options.getToken ?? getSupabaseToken,
    fetcher: options.fetcher,
  });
};

export const kivoClient: KivoApiClient = createKivoClient();
