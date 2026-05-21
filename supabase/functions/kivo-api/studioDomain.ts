export type StudioSurface = "physical" | "digital" | "hybrid";
export type StudioInteractionModel = "H2M" | "M2M" | "A2M" | "mixed";
export type StudioGatewayMode =
  | "raspberry"
  | "edge_device"
  | "physical_totem"
  | "proxy"
  | "middleware"
  | "sidecar"
  | "worker"
  | "api_guard"
  | "plugin"
  | "serverless_function";

export type StudioValidationStatus =
  | "not_configured"
  | "needs_connection"
  | "pending"
  | "running"
  | "passed"
  | "failed"
  | "needs_user_action";

export interface StudioIntent {
  id: string;
  prompt: string;
  surface: StudioSurface;
  interactionModel: StudioInteractionModel;
  recommendedGatewayMode: StudioGatewayMode;
  createdAt: string;
}

export interface StudioFlow {
  id: string;
  intentId: string;
  name: string;
  surface: StudioSurface;
  interactionModel: StudioInteractionModel;
  gatewayMode: StudioGatewayMode;
  resourceName: string;
  price: string;
  asset: string;
  accessRule: string;
  status:
    | "draft"
    | "needs_setup"
    | "validating"
    | "validated"
    | "ready_to_launch"
    | "published";
  createdAt: string;
  updatedAt: string;
}

export interface StudioLaunchOption {
  id: "private_mainnet" | "stay_testnet" | "public_template";
  label: string;
  description: string;
  enabled: boolean;
  reason?: string;
}

export interface StudioTemplateSummary {
  id: string;
  name: string;
  status: "functional" | "planned" | "research" | "alpha" | "beta";
  description: string;
  surface: StudioSurface;
  isFunctionalHackathonTemplate: boolean;
}

export function createStudioFlowFromIntent(
  intent: StudioIntent,
  now = new Date().toISOString(),
): StudioFlow {
  return {
    id: `flow_${crypto.randomUUID()}`,
    intentId: intent.id,
    name: inferFlowName(intent.prompt),
    surface: intent.surface,
    interactionModel: intent.interactionModel,
    gatewayMode: intent.recommendedGatewayMode,
    resourceName: inferResourceName(intent.prompt),
    price: "0.1000000",
    asset: "USDC:testnet",
    accessRule:
      "Require a valid x402 payment before releasing the protected resource.",
    status: "needs_setup",
    createdAt: now,
    updatedAt: now,
  };
}

export function getLaunchOptionsForValidation(
  status: StudioValidationStatus,
): StudioLaunchOption[] {
  const validationPassed = status === "passed";
  return [
    {
      id: "private_mainnet",
      label: "Publicar privado em mainnet",
      description:
        "Mantem o flow privado, versionado e pronto para uso comercial.",
      enabled: validationPassed,
      reason: validationPassed
        ? undefined
        : "Validacao testnet precisa passar antes de mainnet privada.",
    },
    {
      id: "stay_testnet",
      label: "Manter em testnet",
      description: "Continua testando sem ativar uso comercial.",
      enabled: true,
    },
    {
      id: "public_template",
      label: "Transformar em template publico",
      description:
        "Remove credenciais privadas e permite reuso pela comunidade.",
      enabled: true,
    },
  ];
}

export function listStudioTemplates(): StudioTemplateSummary[] {
  return [
    {
      id: "power-totem",
      name: "Kivo EV Charge",
      status: "functional",
      description:
        "Template funcional do hackathon para vender sessoes de recarga EV com Gateway.",
      surface: "physical",
      isFunctionalHackathonTemplate: true,
    },
    {
      id: "api-toll",
      name: "API Toll",
      status: "planned",
      description: "Gateway digital para cobrar acesso a endpoints e dados.",
      surface: "digital",
      isFunctionalHackathonTemplate: false,
    },
    {
      id: "agent-tool-paywall",
      name: "Agent Tool Paywall",
      status: "research",
      description: "Agentes pagando por ferramentas, compute ou dados premium.",
      surface: "digital",
      isFunctionalHackathonTemplate: false,
    },
  ];
}

function inferFlowName(prompt: string): string {
  const clean = prompt.trim();
  if (!clean) {
    return "Novo Kivo flow";
  }
  return clean.length > 48 ? `${clean.slice(0, 45)}...` : clean;
}

function inferResourceName(prompt: string): string {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("api")) {
    return "Protected API";
  }
  if (
    normalized.includes("energia") ||
    normalized.includes("recarga") ||
    normalized.includes("ev") ||
    normalized.includes("totem")
  ) {
    return "Kivo EV Charge";
  }
  return "Protected resource";
}
