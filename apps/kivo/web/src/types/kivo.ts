export type DeviceStatus = 'active' | 'suspended' | 'decommissioned';
export type PaymentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded';
export type ConditionType = 'none' | 'energy_kwh' | 'time_elapsed' | 'service_complete' | 'custom';
export type AssetCode = 'USDC' | 'XLM';
export type ApiHealth = 'ok' | 'degraded' | 'down';
export type KivoTemplateId = 'device-pay-ev-charging' | 'paid-api-endpoint' | 'iot-data-feed';
export type KivoFlowStatus = 'draft' | 'testing' | 'active' | 'needs_setup' | 'failed';
export type KivoFlowUnit = 'session' | 'kWh' | 'minute' | 'request' | 'reading' | 'package';
export type KivoIntegrationMode = 'gateway_sdk' | 'api_middleware' | 'data_feed';
export type PowerTotemStatus = 'draft' | 'pairing' | 'testing' | 'active' | 'paused' | 'failed';
export type GatewayStatus = 'pairing' | 'online' | 'offline' | 'suspended';
export type GatewayAdapter = 'simulator' | 'raspberry';
export type PowerSessionStatus =
  | 'requested'
  | 'payment_required'
  | 'paid'
  | 'authorized'
  | 'running'
  | 'completed'
  | 'expired'
  | 'failed';

export interface KivoTemplate {
  id: KivoTemplateId;
  name: string;
  shortName: string;
  category: 'Device' | 'API' | 'Dados';
  icon: string;
  description: string;
  bestFor: string;
  defaultResourceName: string;
  defaultPrice: string;
  defaultUnit: KivoFlowUnit;
  integrationMode: KivoIntegrationMode;
  primaryActionLabel: string;
}

export interface KivoFlow {
  id: string;
  templateId: KivoTemplateId;
  name: string;
  status: KivoFlowStatus;
  price: string;
  unit: KivoFlowUnit;
  resource: string;
  integrationMode: KivoIntegrationMode;
  deviceId?: string;
  pricingRuleId?: string;
  revenueUsdc: number;
  sessionsCount: number;
  paymentsCount: number;
  failedPaymentsCount: number;
  lastActivityAt?: string;
  setupChecklist: Array<{
    id: string;
    label: string;
    complete: boolean;
  }>;
}

export interface CreateFlowDraft {
  templateId: KivoTemplateId;
  name: string;
  price: string;
  unit: KivoFlowUnit;
  resource: string;
}

export interface PowerTotem {
  id: string;
  name: string;
  resource: string;
  price: string;
  unit: 'session' | 'minute' | 'kWh';
  sessionDurationSeconds: number;
  status: PowerTotemStatus;
  qrSlug: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePowerTotemInput {
  name: string;
  price: string;
  unit?: PowerTotem['unit'];
  sessionDurationSeconds?: number;
  qrSlug?: string;
  metadata?: Record<string, unknown>;
}

export interface Gateway {
  id: string;
  totemId?: string | null;
  name: string;
  tokenPreview: string;
  pairingTokenPreview?: string | null;
  status: GatewayStatus;
  adapter: GatewayAdapter;
  lastSeenAt?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface GatewayPairingResult {
  gateway: Gateway;
  gatewayToken: string;
  pairingToken?: string;
}

export interface GatewayBundleInput {
  name?: string;
  adapter?: GatewayAdapter;
  metadata?: Record<string, unknown>;
}

export interface PowerSession {
  id: string;
  totemId: string;
  gatewayId?: string | null;
  paymentId?: string | null;
  x402Nonce?: string | null;
  resource: string;
  amount: string;
  asset: string;
  durationSeconds: number;
  status: PowerSessionStatus;
  authorizationTokenPreview?: string | null;
  authorizedAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  expiresAt: string;
  failureReason?: string | null;
  events: PaymentEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface GatewayEvent {
  id: string;
  gatewayId?: string | null;
  totemId?: string | null;
  sessionId?: string | null;
  eventType: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface CreateGatewayEventInput {
  eventType: string;
  sessionId?: string | null;
  payload?: Record<string, unknown>;
}

export interface AssetBalance {
  assetCode: AssetCode;
  amount: string;
}

export interface Device {
  id: string;
  name: string;
  ownerId: string;
  apiKeyPreview: string;
  stellarPublicKey: string;
  status: DeviceStatus;
  metadata: Record<string, string>;
  balances: AssetBalance[];
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeviceInput {
  name: string;
  metadata?: Record<string, string>;
}

export interface DeviceRegistrationResult {
  device: Device;
  apiKey?: string;
}

export interface PaymentCondition {
  id: string;
  paymentId: string;
  conditionKey: ConditionType;
  expectedValue: string;
  actualValue?: string;
  proofData: Record<string, unknown>;
  metAt?: string;
  createdAt: string;
}

export interface PaymentEvent {
  id: string;
  label: string;
  description: string;
  status: 'done' | 'current' | 'failed' | 'waiting';
  createdAt: string;
}

export interface Payment {
  id: string;
  fromDeviceId: string;
  toDeviceId: string;
  amount: string;
  assetCode: AssetCode;
  assetIssuer?: string;
  conditionType: ConditionType;
  conditionValue?: string;
  status: PaymentStatus;
  stellarHash?: string;
  stellarLedger?: number;
  memo?: string;
  timeoutAt?: string;
  createdAt: string;
  confirmedAt?: string;
  failedReason?: string;
  feeCharged?: string;
  events: PaymentEvent[];
}

export interface CreatePaymentInput {
  fromDeviceId: string;
  toDeviceId: string;
  amount: string;
  assetCode: AssetCode;
  conditionType: ConditionType;
  conditionValue?: string;
  timeoutSeconds?: number;
  memo?: string;
}

export interface ConditionProofInput {
  conditionKey: ConditionType;
  actualValue: string;
  proofData: Record<string, unknown>;
}

export interface ConditionProofResult {
  conditionMet: boolean;
  payment: Payment;
  condition: PaymentCondition;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  secretPreview: string;
  active: boolean;
  createdAt: string;
  deliveryCount: number;
  lastDeliveryStatus: 'delivered' | 'failed' | 'pending';
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  paymentId?: string;
  event: string;
  payload: Record<string, unknown>;
  status: 'pending' | 'delivered' | 'failed';
  attempts: number;
  responseCode?: number;
  nextRetryAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

export interface WebhookTestResult {
  webhookId: string;
  status: WebhookDelivery['status'];
  responseCode: number;
  latencyMs: number;
  signedPayloadPreview: string;
  delivery: WebhookDelivery;
}

export interface ApiKey {
  id: string;
  name: string;
  keyPreview: string;
  scopes: string[];
  status: 'active' | 'expired' | 'revoked';
  lastUsedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export interface ApiKeyResult {
  apiKey: ApiKey;
  rawKey?: string;
}

export interface McpTool {
  id: string;
  name: string;
  title: string;
  description: string;
  safeForAutoUse: boolean;
  inputSchema: Record<string, unknown>;
  exampleInput: Record<string, unknown>;
}

export interface McpToolCallResult {
  isError: boolean;
  toolName: string;
  output: Record<string, unknown>;
  createdAt: string;
}

export interface McpAgentConfig {
  server: {
    name: string;
    transport: 'http' | 'stdio';
    url: string;
  };
  env: Record<string, string>;
  tools: string[];
  approvalPolicy: {
    autoApproveSafeTools: boolean;
    maxAutoPaymentAmount: string;
    requireHumanFor: string[];
  };
  sampleConfig: Record<string, unknown>;
}

export interface X402Challenge {
  status: 402;
  resource: string;
  scheme: 'stellar';
  network: 'testnet' | 'mainnet';
  payTo: string;
  amount: string;
  asset: string;
  maxTimeout: number;
  nonce: string;
  requiredHeader: string;
}

export interface X402PaidResponse {
  status: 200;
  paymentHeader: string;
  stellarHash: string;
  stellarLedger: number;
  data: Record<string, unknown>;
}

export interface X402UnlockedResponse {
  data?: unknown;
  unlocked?: boolean;
  timestamp?: string;
  [key: string]: unknown;
}

export interface X402PricingRule {
  id: string;
  resource: string;
  amount: string;
  asset: string;
  maxTimeout: number;
  enabled: boolean;
  description?: string;
  updatedAt: string;
}

export type X402PricingRuleInput = Omit<X402PricingRule, 'id' | 'updatedAt'>;

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'done' | 'running' | 'queued' | 'failed' | 'future';
  description: string;
}

export interface Workflow {
  id: string;
  name: string;
  type: 'payment_worker' | 'webhook_worker' | 'x402_settlement' | 'temporal_future';
  status: 'healthy' | 'delayed' | 'paused' | 'future';
  engine: 'supabase-edge' | 'redis-worker' | 'temporal-future';
  trigger: string;
  relatedPaymentId?: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

export interface SystemHealth {
  api: ApiHealth;
  db: ApiHealth;
  workers?: ApiHealth;
  redis?: ApiHealth;
  stellar: ApiHealth;
  mcp: ApiHealth;
  version: string;
  [key: string]: ApiHealth | string | undefined;
}

export interface DeployCheck {
  id: string;
  label: string;
  scope: 'frontend' | 'api' | 'workers' | 'stellar' | 'security';
  status: 'ready' | 'warning' | 'blocked';
  description: string;
  owner: string;
  value?: string;
}

export interface DeployServiceStatus {
  id: string;
  name: string;
  environment: 'local' | 'staging' | 'production' | 'supabase' | 'managed' | 'devnet' | 'sandbox';
  status: 'online' | 'degraded' | 'offline' | 'planned' | 'ready' | 'warning';
  region?: string;
  url?: string;
  description: string;
  updatedAt: string;
}

export interface EtherfuseStatus {
  mode: 'devnet' | 'sandbox' | 'production';
  configured: boolean;
  base_url: string;
  webhook_url?: string;
  webhook_verify: boolean;
  default_fiat: string;
  allowed_assets: string[];
  auth_header: string;
  network: 'testnet' | 'mainnet';
  last_checked_at: string;
}

export interface EtherfuseAsset {
  symbol: string;
  identifier: string;
  name: string;
  currency: string;
  balance: string | null;
  image?: string;
}

export interface EtherfuseAssetsResponse {
  providerMode?: 'devnet' | 'sandbox' | 'production';
  assets: EtherfuseAsset[];
}

export interface EtherfuseOnboardingInput {
  customerId: string;
  bankAccountId: string;
  publicKey: string;
  blockchain: 'stellar';
  userInfo?: {
    email?: string;
    displayName?: string;
  };
  [key: string]: unknown;
}

export interface EtherfuseOnboardingResponse {
  presigned_url?: string;
  presignedUrl?: string;
  url?: string;
  expiresAt?: string;
  [key: string]: unknown;
}

export interface EtherfuseQuoteInput {
  quoteId: string;
  customerId: string;
  blockchain: 'stellar';
  quoteAssets: {
    type: 'onramp' | 'offramp' | 'swap';
    sourceAsset: string;
    targetAsset: string;
  };
  sourceAmount: string;
  walletAddress: string;
  partnerFeeBps?: number;
  [key: string]: unknown;
}

export interface EtherfuseOrderInput {
  orderId: string;
  bankAccountId: string;
  publicKey: string;
  quoteId: string;
  memo?: string;
  [key: string]: unknown;
}

export interface EtherfuseQuoteResponse {
  quoteId?: string;
  id?: string;
  status?: string;
  type?: 'onramp' | 'offramp' | 'swap';
  expiresAt?: string;
  sourceAmount?: string;
  destinationAmount?: string;
  quoteAssets?: unknown;
  [key: string]: unknown;
}

export interface EtherfuseOrderResponse {
  orderId?: string;
  id?: string;
  quoteId?: string;
  status?: string;
  kivoStatus?: 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded';
  statusPage?: string;
  statusPageUrl?: string;
  providerStatus?: string;
  stellarClaimTransaction?: string;
  confirmedTxSignature?: string;
  [key: string]: unknown;
}

export interface DashboardSummary {
  totalDevices: number;
  activeDevices: number;
  totalVolumeUsdc: number;
  confirmedPayments: number;
  pendingPayments: number;
  failedPayments: number;
  health: SystemHealth;
}

export type KivoSolutionSurface = 'physical' | 'digital' | 'hybrid';
export type KivoInteractionModel = 'H2M' | 'M2M' | 'A2M' | 'mixed';
export type KivoGatewayMode =
  | 'raspberry'
  | 'edge_device'
  | 'physical_totem'
  | 'proxy'
  | 'middleware'
  | 'sidecar'
  | 'worker'
  | 'api_guard'
  | 'plugin'
  | 'serverless_function';

export type KivoStudioAgentId =
  | 'discovery'
  | 'flow_architect'
  | 'gateway'
  | 'sdk'
  | 'validation'
  | 'launch';

export type KivoValidationStatus =
  | 'not_configured'
  | 'needs_connection'
  | 'pending'
  | 'running'
  | 'passed'
  | 'failed'
  | 'needs_user_action';

export type KivoLaunchOptionId = 'private_mainnet' | 'stay_testnet' | 'public_template';
export type KivoTemplateStatus = 'functional' | 'planned' | 'research' | 'alpha' | 'beta';

export interface StudioIntentInput {
  prompt: string;
  surface: KivoSolutionSurface;
}

export interface StudioIntent {
  id: string;
  prompt: string;
  surface: KivoSolutionSurface;
  interactionModel: KivoInteractionModel;
  recommendedGatewayMode: KivoGatewayMode;
  createdAt: string;
}

export interface StudioFlow {
  id: string;
  intentId: string;
  name: string;
  surface: KivoSolutionSurface;
  interactionModel: KivoInteractionModel;
  gatewayMode: KivoGatewayMode;
  resourceName: string;
  price: string;
  asset: string;
  accessRule: string;
  status: 'draft' | 'needs_setup' | 'validating' | 'validated' | 'ready_to_launch' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface StudioFlowInput {
  intentId: string;
  prompt: string;
  surface: KivoSolutionSurface;
  interactionModel: KivoInteractionModel;
  gatewayMode: KivoGatewayMode;
}

export interface StudioValidationStep {
  id: 'gateway' | 'x402' | 'etherfuse' | 'payment' | 'release' | string;
  label: string;
  status: KivoValidationStatus;
  message: string;
  evidence?: Record<string, unknown>;
}

export interface StudioValidationRun {
  id: string;
  flowId: string;
  status: KivoValidationStatus;
  steps: StudioValidationStep[];
  createdAt: string;
  updatedAt: string;
}

export interface SdkExportBundle {
  flowId: string;
  packageName: '@kivo/sdk';
  version: string;
  downloadUrl: string;
  installCommand: string;
  snippets: Array<{
    id: string;
    label: string;
    language: 'ts' | 'bash' | 'json';
    code: string;
  }>;
}

export interface StudioLaunchOption {
  id: KivoLaunchOptionId;
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
}

export interface StudioTemplateSummary {
  id: string;
  name: string;
  status: KivoTemplateStatus;
  description: string;
  surface: KivoSolutionSurface;
  isFunctionalHackathonTemplate: boolean;
}
