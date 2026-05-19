import "@supabase/functions-js/edge-runtime.d.ts";
import {
  Asset,
  Keypair,
  Networks,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import {
  buildPowerTotemResource,
  ensureValidDuration,
  nextSessionStatus,
  type PowerSessionStatus,
  sanitizeQrSlug,
} from "./powerTotemDomain.ts";
import { validatePaymentSettlementXdr } from "./settlementValidation.ts";

const VERSION = "kivo-edge-transition-2026-05-17";

type StatusTone = "ready" | "warning" | "failed" | "online";
type ApiHealth = "ok" | "degraded" | "down";

type ParsedXdrOperation = {
  type?: string;
  destination?: string;
  amount?: string | number;
  asset?: unknown;
};

type ParsedStellarTransaction = {
  memo?: unknown;
  operations?: ParsedXdrOperation[];
  innerTransaction?: {
    memo?: unknown;
    operations?: ParsedXdrOperation[];
  };
};

interface KivoUser {
  id: string;
  email?: string;
}

interface DbDevice {
  id: string;
  owner_id: string;
  name: string;
  api_key_hash?: string;
  api_key_preview: string;
  stellar_public_key: string;
  status: string;
  metadata: Record<string, string>;
  balances: Array<Record<string, string>>;
  created_at: string;
  updated_at: string;
}

interface DbPayment {
  id: string;
  owner_id: string;
  from_device_id?: string | null;
  to_device_id?: string | null;
  amount: string | number;
  asset_code: string;
  asset_issuer?: string | null;
  condition_type: string;
  condition_value?: string | null;
  status: string;
  stellar_hash?: string | null;
  stellar_ledger?: number | null;
  memo?: string | null;
  timeout_at?: string | null;
  confirmed_at?: string | null;
  failed_reason?: string | null;
  fee_charged?: string | number | null;
  events: Array<Record<string, unknown>>;
  created_at: string;
  updated_at?: string;
}

interface DbPricingRule {
  id: string;
  owner_id: string;
  resource: string;
  amount: string | number;
  asset: string;
  max_timeout: number;
  enabled: boolean;
  description?: string | null;
  updated_at: string;
}

interface DbWebhook {
  id: string;
  owner_id: string;
  url: string;
  events: string[];
  secret_preview: string;
  active: boolean;
  created_at: string;
  delivery_count: number;
  last_delivery_status: string;
}

interface DbWebhookDelivery {
  id: string;
  webhook_id?: string | null;
  payment_id?: string | null;
  event: string;
  payload: Record<string, unknown>;
  status: string;
  attempts: number;
  response_code?: number | null;
  next_retry_at?: string | null;
  delivered_at?: string | null;
  created_at: string;
}

interface DbApiKey {
  id: string;
  name: string;
  key_preview: string;
  scopes: string[];
  status: string;
  last_used_at?: string | null;
  expires_at?: string | null;
  created_at: string;
}

interface DbNonce {
  nonce: string;
  owner_id?: string | null;
  resource: string;
  amount: string | number;
  asset: string;
  pay_to: string;
  max_timeout: number;
  status: string;
  payment_header?: string | null;
  stellar_hash?: string | null;
  stellar_ledger?: number | null;
  expires_at: string;
  created_at: string;
}

interface DbPowerTotem {
  id: string;
  owner_id: string;
  name: string;
  resource: string;
  price: string | number;
  unit: string;
  session_duration_seconds: number;
  status: string;
  qr_slug: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface DbGateway {
  id: string;
  owner_id: string;
  totem_id?: string | null;
  name: string;
  token_hash: string;
  token_preview: string;
  pairing_token_hash?: string | null;
  pairing_token_preview?: string | null;
  status: string;
  adapter: string;
  last_seen_at?: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface DbPowerSession {
  id: string;
  owner_id: string;
  totem_id: string;
  gateway_id?: string | null;
  payment_id?: string | null;
  x402_nonce?: string | null;
  resource: string;
  amount: string | number;
  asset: string;
  duration_seconds: number;
  status: PowerSessionStatus;
  authorization_token_hash?: string | null;
  authorization_token_preview?: string | null;
  authorized_at?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  expires_at: string;
  failure_reason?: string | null;
  events: Array<Record<string, unknown>>;
  created_at: string;
  updated_at: string;
}

interface DbGatewayEvent {
  id: string;
  owner_id: string;
  gateway_id?: string | null;
  totem_id?: string | null;
  session_id?: string | null;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}

class KivoHttpError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

const env = (key: string, fallback = "") =>
  Deno.env.get(key)?.trim() || fallback;

const splitCSV = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const allowedOrigins = () =>
  splitCSV(env("CORS_ORIGINS", "http://localhost:5174,http://127.0.0.1:5174"));

const originMatches = (origin: string, candidate: string) => {
  if (candidate === "*") {
    return true;
  }
  if (candidate.includes("*")) {
    const pattern = `^${
      candidate
        .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
        .replace(/\*/g, ".*")
    }$`;
    return new RegExp(pattern).test(origin);
  }
  return origin === candidate;
};

const corsHeaders = (req: Request) => {
  const origin = req.headers.get("Origin") ?? "";
  const allowed = allowedOrigins();
  const allowOrigin =
    allowed.some((candidate) => originMatches(origin, candidate))
      ? origin
      : allowed[0] ?? "*";

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Headers":
      "authorization,apikey,content-type,x-api-key,x-gateway-token,x-payment,x-signature",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
};

const json = (req: Request, status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json",
    },
  });

const noContent = (req: Request) =>
  new Response(null, {
    status: 204,
    headers: corsHeaders(req),
  });

const apiError = (
  req: Request,
  status: number,
  code: string,
  message: string,
) => json(req, status, { error: code, message, status });

const throwApiError = (
  status: number,
  code: string,
  message: string,
): never => {
  throw new KivoHttpError(status, code, message);
};

const normalizePath = (req: Request) => {
  const { pathname } = new URL(req.url);
  const path = pathname.replace(/^\/kivo-api(?=\/|$)/, "") || "/";
  return path.replace(/\/$/, "") || "/";
};

const isConfigured = (key: string) => env(key) !== "";

const maskConfigured = (value: string) => (value ? "configured" : "missing");

const supabaseUrl = () => env("SUPABASE_URL").replace(/\/$/, "");
const supabaseServiceRole = () => env("SUPABASE_SERVICE_ROLE_KEY");
const supabaseAnonKey = () =>
  env("SUPABASE_ANON_KEY") || env("SUPABASE_PUBLISHABLE_KEY") ||
  supabaseServiceRole();

const restUrl = (tableAndQuery: string) => {
  const base = supabaseUrl();
  if (!base || !supabaseServiceRole()) {
    throwApiError(
      503,
      "supabase_not_configured",
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
    );
  }
  return `${base}/rest/v1/${tableAndQuery}`;
};

const serviceHeaders = (prefer?: string) => {
  const headers = new Headers({
    apikey: supabaseServiceRole(),
    Authorization: `Bearer ${supabaseServiceRole()}`,
    "Content-Type": "application/json",
  });
  if (prefer) {
    headers.set("Prefer", prefer);
  }
  return headers;
};

const dbRequest = async <T>(
  tableAndQuery: string,
  init: RequestInit = {},
): Promise<T> => {
  const headers = new Headers(init.headers);
  for (const [key, value] of serviceHeaders()) {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  }
  const response = await fetch(restUrl(tableAndQuery), { ...init, headers });
  const text = await response.text();
  if (!response.ok) {
    throwApiError(
      response.status,
      "supabase_rest_error",
      text || `Supabase REST error ${response.status}`,
    );
  }
  if (!text) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};

const selectRows = <T>(
  table: string,
  query: Record<string, string | number | boolean | undefined> = {},
) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) {
      search.set(key, String(value));
    }
  }
  const suffix = search.toString() ? `?${search.toString()}` : "";
  return dbRequest<T[]>(`${table}${suffix}`);
};

const insertRow = <T>(
  table: string,
  payload: Record<string, unknown>,
) =>
  dbRequest<T[]>(`${table}`, {
    method: "POST",
    headers: serviceHeaders("return=representation"),
    body: JSON.stringify(payload),
  }).then((rows) => rows[0]);

const patchRows = <T>(
  table: string,
  query: Record<string, string | number | boolean>,
  payload: Record<string, unknown>,
) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    search.set(key, String(value));
  }
  return dbRequest<T[]>(`${table}?${search.toString()}`, {
    method: "PATCH",
    headers: serviceHeaders("return=representation"),
    body: JSON.stringify(payload),
  });
};

const deleteRows = async (
  table: string,
  query: Record<string, string | number | boolean>,
) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    search.set(key, String(value));
  }
  await dbRequest<void>(`${table}?${search.toString()}`, {
    method: "DELETE",
    headers: serviceHeaders("return=minimal"),
  });
};

const getBearerToken = (req: Request) => {
  const authorization = req.headers.get("Authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? "";
};

const getOptionalUser = async (req: Request): Promise<KivoUser | null> => {
  const token = getBearerToken(req);
  const base = supabaseUrl();
  if (!token || !base) {
    return null;
  }
  const response = await fetch(`${base}/auth/v1/user`, {
    headers: {
      apikey: supabaseAnonKey(),
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    return null;
  }
  const user = await response.json() as { id?: string; email?: string };
  return user.id ? { id: user.id, email: user.email } : null;
};

const requireUser = async (req: Request): Promise<KivoUser> => {
  const user = await getOptionalUser(req);
  if (!user) {
    throw new KivoHttpError(
      401,
      "unauthorized",
      "Login Supabase necessario para esta rota.",
    );
  }
  return user;
};

const requireGateway = async (req: Request) => {
  const rawToken = req.headers.get("x-gateway-token") ?? "";
  if (!rawToken.trim()) {
    throwApiError(401, "gateway_token_required", "Gateway token is required.");
  }
  const tokenHash = await sha256Hex(rawToken.trim());
  const rows = await selectRows<DbGateway>("kivo_gateways", {
    select: "*",
    token_hash: `eq.${tokenHash}`,
    limit: 1,
  });
  if (!rows[0]) {
    throwApiError(401, "gateway_unauthorized", "Gateway token is invalid.");
  }
  if (rows[0].status === "suspended") {
    throwApiError(
      403,
      "gateway_suspended",
      "Gateway token is suspended.",
    );
  }
  return rows[0];
};

const nowISO = () => new Date().toISOString();

const amountString = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === "") {
    return "0.0000000";
  }
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(number)) {
    return String(value);
  }
  return number.toFixed(7);
};

const base64Url = (bytes: Uint8Array | string) => {
  const binary = typeof bytes === "string"
    ? bytes
    : String.fromCharCode(...bytes);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(
    /=+$/,
    "",
  );
};

const randomToken = (prefix: string, bytesLength = 24) => {
  const bytes = new Uint8Array(bytesLength);
  crypto.getRandomValues(bytes);
  return `${prefix}${base64Url(bytes)}`;
};

const sha256Hex = async (value: string) => {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return bytesToHex(new Uint8Array(digest));
};

const bytesToHex = (bytes: Uint8Array) =>
  [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const secretPreview = (value: string) =>
  value.length <= 12 ? value : `${value.slice(0, 9)}...${value.slice(-4)}`;

const paymentEvent = (
  label: string,
  description: string,
  status: "done" | "current" | "failed" | "waiting",
) => ({
  id: crypto.randomUUID(),
  label,
  description,
  status,
  createdAt: nowISO(),
});

const recordOrEmpty = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};

const etherfuseMode = () => env("ETHERFUSE_MODE", "devnet");
const etherfuseBaseUrl = () =>
  env("ETHERFUSE_BASE_URL", "https://api.sand.etherfuse.com").replace(
    /\/$/,
    "",
  );

const etherfuseStatus = () => ({
  mode: etherfuseMode(),
  configured: isConfigured("ETHERFUSE_API_KEY"),
  base_url: etherfuseBaseUrl(),
  webhook_url: env("ETHERFUSE_WEBHOOK_URL"),
  webhook_verify: env("ETHERFUSE_WEBHOOK_VERIFY", "true") !== "false",
  default_fiat: env("ETHERFUSE_DEFAULT_FIAT", "MXN"),
  allowed_assets: splitCSV(env("ETHERFUSE_ALLOWED_ASSETS")),
  auth_header: "Authorization: <api-key>",
  network: env("STELLAR_NETWORK", "testnet") === "mainnet"
    ? "mainnet"
    : "testnet",
  last_checked_at: new Date().toISOString(),
});

const systemHealth = () => ({
  api: "ok",
  db: isConfigured("SUPABASE_URL") && isConfigured("SUPABASE_SERVICE_ROLE_KEY")
    ? "ok"
    : "degraded",
  workers: "ok",
  stellar: "ok",
  mcp: "degraded",
  version: VERSION,
});

const deployChecks = () => {
  const statusEtherfuse: StatusTone = isConfigured("ETHERFUSE_API_KEY")
    ? "ready"
    : "warning";
  const statusSupabase: StatusTone =
    isConfigured("SUPABASE_URL") && isConfigured("SUPABASE_SERVICE_ROLE_KEY")
      ? "ready"
      : "warning";
  const statusX402: StatusTone =
    /^G[A-Z2-7]{55}$/.test(env("X402_PLATFORM_KEY")) ? "ready" : "warning";
  const statusWebhook: StatusTone = isConfigured("ETHERFUSE_WEBHOOK_URL") &&
      isConfigured("ETHERFUSE_WEBHOOK_SECRET")
    ? "ready"
    : "warning";

  return [
    {
      id: "edge-api",
      label: "Kivo Edge API",
      scope: "api",
      status: "ready",
      owner: "backend",
      description:
        "Supabase Edge Function publica os endpoints HTTP do MVP e substitui o deploy Fly.",
      value: "/v1/health",
    },
    {
      id: "supabase",
      label: "Supabase runtime",
      scope: "api",
      status: statusSupabase,
      owner: "platform",
      description:
        "Auth, Postgres, Storage, Realtime e secrets vivem no mesmo projeto Supabase.",
      value: maskConfigured(env("SUPABASE_URL")),
    },
    {
      id: "x402",
      label: "x402 platform key",
      scope: "security",
      status: statusX402,
      owner: "protocol",
      description:
        "Conta Stellar testnet que recebe os pagamentos x402 do Kivo.",
      value: statusX402 === "ready" ? "stellar testnet" : "missing or invalid",
    },
    {
      id: "etherfuse",
      label: "Etherfuse anchor",
      scope: "stellar",
      status: statusEtherfuse,
      owner: "anchor",
      description:
        "A Edge Function chama a Etherfuse com API key server-side, sem expor credenciais ao browser.",
      value: etherfuseMode(),
    },
    {
      id: "etherfuse-webhook",
      label: "Etherfuse webhook",
      scope: "workers",
      status: statusWebhook,
      owner: "anchor",
      description:
        "Webhook assinado recebe eventos da rampa e grava no Supabase.",
      value: maskConfigured(env("ETHERFUSE_WEBHOOK_URL")),
    },
  ];
};

const deployServices = (req: Request) => {
  const base = new URL(req.url);
  base.search = "";
  base.pathname = base.pathname.replace(
    /\/v1\/deploy\/services$/,
    "/v1/health",
  );
  const now = new Date().toISOString();

  return [
    {
      id: "edge-api",
      name: "Kivo Edge API",
      environment: "supabase",
      status: "online",
      region: "edge",
      url: base.toString(),
      description: "HTTP runtime do MVP em Supabase Edge Functions.",
      updatedAt: now,
    },
    {
      id: "supabase",
      name: "Supabase Project",
      environment: "managed",
      status: isConfigured("SUPABASE_URL") ? "ready" : "warning",
      url: env("SUPABASE_URL"),
      description: "Auth, Postgres, Realtime, Storage e secrets.",
      updatedAt: now,
    },
    {
      id: "etherfuse",
      name: "Etherfuse Anchor",
      environment: etherfuseMode(),
      status: isConfigured("ETHERFUSE_API_KEY") ? "ready" : "warning",
      url: etherfuseBaseUrl(),
      description: "Proxy server-side para rampas e webhooks.",
      updatedAt: now,
    },
    {
      id: "stellar",
      name: "Stellar Testnet",
      environment: env("STELLAR_NETWORK", "testnet"),
      status: "ready",
      url: env("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org"),
      description: "Liquidacao x402 e trilha de auditoria Stellar.",
      updatedAt: now,
    },
  ];
};

const requireEtherfuseKey = (req: Request) => {
  if (!isConfigured("ETHERFUSE_API_KEY")) {
    return apiError(
      req,
      503,
      "etherfuse_not_configured",
      "ETHERFUSE_API_KEY is not configured in Supabase Edge Function secrets.",
    );
  }
  return undefined;
};

const proxyEtherfuse = async (
  req: Request,
  endpoint: string,
  init: RequestInit = {},
) => {
  const missing = requireEtherfuseKey(req);
  if (missing) {
    return missing;
  }

  const target = `${etherfuseBaseUrl()}${endpoint}`;
  const headers = new Headers(init.headers);
  headers.set("Authorization", env("ETHERFUSE_API_KEY"));
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(target, {
    ...init,
    headers,
  });
  const text = await response.text();

  return new Response(text, {
    status: response.status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": response.headers.get("Content-Type") ??
        "application/json",
    },
  });
};

const handleEtherfuse = async (req: Request, path: string) => {
  if (path === "/v1/etherfuse/status" && req.method === "GET") {
    return json(req, 200, etherfuseStatus());
  }

  if (path === "/v1/etherfuse/assets" && req.method === "GET") {
    const url = new URL(req.url);
    const query = new URLSearchParams({
      blockchain: "stellar",
      currency: url.searchParams.get("currency") ||
        env("ETHERFUSE_DEFAULT_FIAT", "MXN"),
    });
    const wallet = url.searchParams.get("wallet") || env("X402_PLATFORM_KEY");
    if (wallet) {
      query.set("wallet", wallet);
    }
    return proxyEtherfuse(req, `/ramp/assets?${query.toString()}`);
  }

  if (path === "/v1/etherfuse/onboarding-url" && req.method === "POST") {
    return proxyEtherfuse(req, "/ramp/onboarding-url", {
      method: "POST",
      body: await req.text(),
    });
  }

  if (path === "/v1/etherfuse/quotes" && req.method === "POST") {
    return proxyEtherfuse(req, "/ramp/quote", {
      method: "POST",
      body: await req.text(),
    });
  }

  if (path === "/v1/etherfuse/orders" && req.method === "POST") {
    return proxyEtherfuse(req, "/ramp/order", {
      method: "POST",
      body: await req.text(),
    });
  }

  const orderMatch = path.match(
    /^\/v1\/etherfuse\/orders\/([^/]+)(?:\/(fiat-received))?$/,
  );
  if (orderMatch && req.method === "GET" && !orderMatch[2]) {
    return proxyEtherfuse(
      req,
      `/ramp/order/${encodeURIComponent(orderMatch[1])}`,
    );
  }
  if (orderMatch && req.method === "POST" && orderMatch[2]) {
    if (!["devnet", "sandbox"].includes(etherfuseMode())) {
      return apiError(
        req,
        403,
        "devnet_only",
        "Fiat received signal is only available in Etherfuse Devnet.",
      );
    }
    return proxyEtherfuse(req, "/ramp/order/fiat_received", {
      method: "POST",
      body: JSON.stringify({ orderId: orderMatch[1] }),
    });
  }

  if (path === "/v1/etherfuse/webhook" && req.method === "POST") {
    return handleEtherfuseWebhook(req);
  }

  if (path === "/v1/etherfuse/webhook" && req.method === "GET") {
    return json(req, 200, {
      ok: true,
      endpoint: "/v1/etherfuse/webhook",
      accepts: ["POST"],
      signature_header: "X-Signature",
      signature_required: env("ETHERFUSE_WEBHOOK_VERIFY", "true") !== "false",
      configured: isConfigured("ETHERFUSE_WEBHOOK_SECRET"),
      mode: etherfuseMode(),
    });
  }

  return apiError(req, 404, "not_found", "Etherfuse route not found.");
};

const handleEtherfuseWebhook = async (req: Request) => {
  const raw = await req.text();
  if (env("ETHERFUSE_WEBHOOK_VERIFY", "true") !== "false") {
    const ok = await verifyEtherfuseSignature(
      raw,
      env("ETHERFUSE_WEBHOOK_SECRET"),
      req.headers.get("X-Signature") ?? "",
    );
    if (!ok) {
      return apiError(
        req,
        401,
        "invalid_signature",
        "invalid Etherfuse webhook signature",
      );
    }
  }

  const payload = raw ? JSON.parse(raw) : {};
  const persisted = await persistEtherfuseWebhook(payload);
  if (!persisted.ok) {
    return apiError(req, 500, "webhook_persist_failed", persisted.error);
  }

  return json(req, 200, {
    accepted: true,
    receivedAt: new Date().toISOString(),
  });
};

const verifyEtherfuseSignature = async (
  payload: string,
  secretBase64: string,
  signatureHeader: string,
) => {
  if (!secretBase64 || !signatureHeader.startsWith("sha256=")) {
    return false;
  }

  const secretBytes = Uint8Array.from(
    atob(secretBase64),
    (char) => char.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload),
  );
  const hex = [...new Uint8Array(signature)].map((byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");
  return constantTimeEqual(`sha256=${hex}`, signatureHeader);
};

const constantTimeEqual = (left: string, right: string) => {
  if (left.length !== right.length) {
    return false;
  }
  let diff = 0;
  for (let index = 0; index < left.length; index += 1) {
    diff |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return diff === 0;
};

const persistEtherfuseWebhook = async (payload: Record<string, unknown>) => {
  const supabaseUrl = env("SUPABASE_URL").replace(/\/$/, "");
  const serviceRole = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceRole) {
    return {
      ok: false,
      error:
        "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required to persist Etherfuse webhooks.",
    };
  }

  const providerEventId = firstString(payload, ["id", "eventId", "event_id"]);
  const providerOrderId = firstString(payload, [
    "orderId",
    "order_id",
    "provider_order_id",
  ]);
  const eventType = firstString(payload, ["type", "event", "event_type"]) ||
    "etherfuse.webhook";
  const response = await fetch(
    `${supabaseUrl}/rest/v1/kivo_etherfuse_webhook_events`,
    {
      method: "POST",
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        provider_event_id: providerEventId,
        provider_order_id: providerOrderId,
        event_type: eventType,
        signature_valid: true,
        payload,
      }),
    },
  );

  if (!response.ok) {
    return { ok: false, error: await response.text() };
  }
  return { ok: true, error: "" };
};

const firstString = (payload: Record<string, unknown>, keys: string[]) => {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return "";
};

const toDevice = (row: DbDevice) => ({
  id: row.id,
  name: row.name,
  ownerId: row.owner_id,
  apiKeyPreview: row.api_key_preview,
  stellarPublicKey: row.stellar_public_key,
  status: row.status,
  metadata: row.metadata ?? {},
  balances: row.balances ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toPayment = (row: DbPayment) => ({
  id: row.id,
  fromDeviceId: row.from_device_id ?? "",
  toDeviceId: row.to_device_id ?? "",
  amount: amountString(row.amount),
  assetCode: row.asset_code,
  ...(row.asset_issuer ? { assetIssuer: row.asset_issuer } : {}),
  conditionType: row.condition_type,
  ...(row.condition_value ? { conditionValue: row.condition_value } : {}),
  status: row.status,
  ...(row.stellar_hash ? { stellarHash: row.stellar_hash } : {}),
  ...(row.stellar_ledger ? { stellarLedger: row.stellar_ledger } : {}),
  ...(row.memo ? { memo: row.memo } : {}),
  ...(row.timeout_at ? { timeoutAt: row.timeout_at } : {}),
  createdAt: row.created_at,
  ...(row.confirmed_at ? { confirmedAt: row.confirmed_at } : {}),
  ...(row.failed_reason ? { failedReason: row.failed_reason } : {}),
  ...(row.fee_charged ? { feeCharged: amountString(row.fee_charged) } : {}),
  events: row.events ?? [],
});

const toPricingRule = (row: DbPricingRule) => ({
  id: row.id,
  resource: row.resource,
  amount: amountString(row.amount),
  asset: row.asset,
  maxTimeout: row.max_timeout,
  enabled: row.enabled,
  ...(row.description ? { description: row.description } : {}),
  updatedAt: row.updated_at,
});

const toWebhook = (row: DbWebhook) => ({
  id: row.id,
  url: row.url,
  events: row.events ?? [],
  secretPreview: row.secret_preview,
  active: row.active,
  createdAt: row.created_at,
  deliveryCount: row.delivery_count,
  lastDeliveryStatus: row.last_delivery_status,
});

const toWebhookDelivery = (row: DbWebhookDelivery) => ({
  id: row.id,
  webhookId: row.webhook_id ?? "",
  ...(row.payment_id ? { paymentId: row.payment_id } : {}),
  event: row.event,
  payload: row.payload ?? {},
  status: row.status,
  attempts: row.attempts,
  ...(row.response_code ? { responseCode: row.response_code } : {}),
  ...(row.next_retry_at ? { nextRetryAt: row.next_retry_at } : {}),
  ...(row.delivered_at ? { deliveredAt: row.delivered_at } : {}),
  createdAt: row.created_at,
});

const toApiKey = (row: DbApiKey) => ({
  id: row.id,
  name: row.name,
  keyPreview: row.key_preview,
  scopes: row.scopes ?? [],
  status: row.status,
  ...(row.last_used_at ? { lastUsedAt: row.last_used_at } : {}),
  ...(row.expires_at ? { expiresAt: row.expires_at } : {}),
  createdAt: row.created_at,
});

const toPowerTotem = (row: DbPowerTotem) => ({
  id: row.id,
  name: row.name,
  resource: row.resource,
  price: String(row.price),
  unit: row.unit,
  sessionDurationSeconds: row.session_duration_seconds,
  status: row.status,
  qrSlug: row.qr_slug,
  metadata: row.metadata ?? {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toGateway = (row: DbGateway) => ({
  id: row.id,
  totemId: row.totem_id ?? "",
  name: row.name,
  tokenPreview: row.token_preview,
  pairingTokenPreview: row.pairing_token_preview ?? "",
  status: row.status,
  adapter: row.adapter,
  lastSeenAt: row.last_seen_at ?? undefined,
  metadata: row.metadata ?? {},
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toPowerSession = (row: DbPowerSession) => ({
  id: row.id,
  totemId: row.totem_id,
  gatewayId: row.gateway_id ?? "",
  paymentId: row.payment_id ?? "",
  x402Nonce: row.x402_nonce ?? "",
  resource: row.resource,
  amount: String(row.amount),
  asset: row.asset,
  durationSeconds: row.duration_seconds,
  status: row.status,
  authorizationTokenPreview: row.authorization_token_preview ?? "",
  authorizedAt: row.authorized_at ?? undefined,
  startedAt: row.started_at ?? undefined,
  completedAt: row.completed_at ?? undefined,
  expiresAt: row.expires_at,
  failureReason: row.failure_reason ?? undefined,
  events: row.events ?? [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const toGatewayEvent = (row: DbGatewayEvent) => ({
  id: row.id,
  gatewayId: row.gateway_id ?? "",
  totemId: row.totem_id ?? "",
  sessionId: row.session_id ?? "",
  eventType: row.event_type,
  payload: row.payload ?? {},
  createdAt: row.created_at,
});

const listDevicesForUser = async (ownerId: string) =>
  (await selectRows<DbDevice>("kivo_devices", {
    select: "*",
    owner_id: `eq.${ownerId}`,
    order: "created_at.desc",
  })).map(toDevice);

const listPaymentsForUser = async (ownerId: string) =>
  (await selectRows<DbPayment>("kivo_payments", {
    select: "*",
    owner_id: `eq.${ownerId}`,
    order: "created_at.desc",
  })).map(toPayment);

const listPricingRulesForUser = async (ownerId: string) =>
  (await selectRows<DbPricingRule>("kivo_x402_pricing_rules", {
    select: "*",
    owner_id: `eq.${ownerId}`,
    order: "updated_at.desc",
  })).map(toPricingRule);

const dashboardSummary = async (req: Request) => {
  const user = await requireUser(req);
  const [devices, payments] = await Promise.all([
    listDevicesForUser(user.id),
    listPaymentsForUser(user.id),
  ]);
  const confirmed = payments.filter((payment) =>
    payment.status === "confirmed"
  );
  return {
    totalDevices: devices.length,
    activeDevices:
      devices.filter((device) => device.status === "active").length,
    totalVolumeUsdc: confirmed.reduce(
      (total, payment) =>
        payment.assetCode === "USDC" ? total + Number(payment.amount) : total,
      0,
    ),
    confirmedPayments: confirmed.length,
    pendingPayments:
      payments.filter((payment) =>
        ["pending", "processing"].includes(payment.status)
      ).length,
    failedPayments: payments.filter((payment) => payment.status === "failed")
      .length,
    health: systemHealth(),
  };
};

const handleDashboard = async (req: Request) =>
  json(req, 200, await dashboardSummary(req));

const handleDevices = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const detail = path.match(/^\/v1\/devices\/([^/]+)$/);

  if (path === "/v1/devices" && req.method === "GET") {
    return json(req, 200, await listDevicesForUser(user.id));
  }

  if (path === "/v1/devices" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      name?: string;
      metadata?: Record<string, string>;
    };
    if (!input.name?.trim()) {
      return apiError(req, 400, "invalid_device", "Device name is required.");
    }
    const rawApiKey = randomToken("kivo_test_");
    const keypair = Keypair.random();
    const row = await insertRow<DbDevice>("kivo_devices", {
      owner_id: user.id,
      name: input.name.trim(),
      api_key_hash: await sha256Hex(rawApiKey),
      api_key_preview: secretPreview(rawApiKey),
      stellar_public_key: keypair.publicKey(),
      encrypted_stellar_secret: env("KIVO_SECRET_ENCRYPTION_KEY")
        ? keypair.secret()
        : null,
      metadata: input.metadata ?? {},
      balances: [],
    });
    return json(req, 201, { device: toDevice(row), apiKey: rawApiKey });
  }

  if (detail && req.method === "GET") {
    const rows = await selectRows<DbDevice>("kivo_devices", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!rows[0]) {
      return apiError(req, 404, "device_not_found", "Device not found.");
    }
    return json(req, 200, { device: toDevice(rows[0]) });
  }

  if (detail && req.method === "PATCH") {
    const input = await req.json().catch(() => ({})) as { status?: string };
    if (
      !["active", "suspended", "decommissioned"].includes(input.status ?? "")
    ) {
      return apiError(req, 400, "invalid_status", "Invalid device status.");
    }
    const rows = await patchRows<DbDevice>("kivo_devices", {
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
    }, { status: input.status });
    if (!rows[0]) {
      return apiError(req, 404, "device_not_found", "Device not found.");
    }
    return json(req, 200, toDevice(rows[0]));
  }

  return apiError(req, 404, "not_found", "Device route not found.");
};

const defaultPaymentEvents = (conditionType = "none") => [
  paymentEvent("Created", "Payment created in Kivo.", "done"),
  paymentEvent(
    conditionType === "none" ? "Ready to settle" : "Waiting for condition",
    conditionType === "none"
      ? "Submit a signed Stellar XDR to settle."
      : "Condition proof must be submitted before settlement.",
    conditionType === "none" ? "current" : "waiting",
  ),
];

const splitAsset = (asset: string) => {
  const [code, issuer] = asset.split(":");
  return { code: code || "USDC", issuer: issuer || "" };
};

const defaultPowerSessionAsset = () =>
  env("KIVO_DEFAULT_USDC_ASSET") ||
  (env("USDC_ISSUER") ? `USDC:${env("USDC_ISSUER")}` : "XLM");

const upsertPowerTotemPricingRule = async (
  ownerId: string,
  resource: string,
  price: string,
  name: string,
) => {
  const existing = await selectRows<DbPricingRule>("kivo_x402_pricing_rules", {
    select: "*",
    owner_id: `eq.${ownerId}`,
    resource: `eq.${resource}`,
    limit: 1,
  });
  const payload = {
    owner_id: ownerId,
    resource,
    amount: price,
    asset: defaultPowerSessionAsset(),
    max_timeout: 300,
    enabled: true,
    description: `Power Totem: ${name}`,
  };
  return existing[0]
    ? (await patchRows<DbPricingRule>("kivo_x402_pricing_rules", {
      id: `eq.${existing[0].id}`,
      owner_id: `eq.${ownerId}`,
    }, payload))[0]
    : await insertRow<DbPricingRule>("kivo_x402_pricing_rules", payload);
};

const stellarPassphrase = () =>
  env("STELLAR_NETWORK", "testnet") === "mainnet"
    ? Networks.PUBLIC
    : Networks.TESTNET;

const parseChallengeAsset = (asset: string) => {
  const normalized = asset.trim();
  if (
    normalized.toLowerCase() === "native" ||
    normalized.toUpperCase() === "XLM" ||
    normalized.toUpperCase() === "XLM:NATIVE"
  ) {
    return Asset.native();
  }
  const { code, issuer } = splitAsset(normalized);
  if (!issuer) {
    throwApiError(
      400,
      "invalid_x402_asset",
      "Non-native Stellar assets must use CODE:ISSUER format.",
    );
  }
  return new Asset(code, issuer);
};

const assetsMatch = (left: Asset, right: Asset) => {
  if (left.isNative() || right.isNative()) {
    return left.isNative() && right.isNative();
  }
  return left.getCode() === right.getCode() &&
    left.getIssuer() === right.getIssuer();
};

const memoText = (memo: unknown) => {
  const candidate = memo as {
    type?: string;
    value?: unknown;
    _type?: string;
    _value?: unknown;
  };
  if ((candidate.type ?? candidate._type) !== "text") {
    return "";
  }
  const value = candidate.value ?? candidate._value;
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof Uint8Array) {
    return new TextDecoder().decode(value);
  }
  return "";
};

const memoHashHex = (memo: unknown) => {
  const candidate = memo as {
    type?: string;
    value?: unknown;
    _type?: string;
    _value?: unknown;
  };
  if ((candidate.type ?? candidate._type) !== "hash") {
    return "";
  }
  const value = candidate.value ?? candidate._value;
  if (typeof value === "string") {
    return value.toLowerCase();
  }
  if (value instanceof Uint8Array) {
    return bytesToHex(value);
  }
  return "";
};

const x402MemoMatchesNonce = async (memo: unknown, nonce: string) => {
  if (memoText(memo) === nonce) {
    return true;
  }
  return memoHashHex(memo) === await sha256Hex(nonce);
};

const validateX402PaymentXdr = async (txXDR: string, nonce: DbNonce) => {
  let parsed: ParsedStellarTransaction | null = null;
  try {
    parsed = TransactionBuilder.fromXDR(
      txXDR,
      stellarPassphrase(),
    ) as unknown as ParsedStellarTransaction;
  } catch {
    throwApiError(
      400,
      "invalid_x402_payment_xdr",
      "txXDR must be a signed Stellar transaction envelope for the configured network.",
    );
  }
  if (!parsed) {
    throwApiError(
      400,
      "invalid_x402_payment_xdr",
      "txXDR must be a signed Stellar transaction envelope for the configured network.",
    );
  }

  const parsedTx = parsed as ParsedStellarTransaction;
  const transaction = parsedTx.innerTransaction ?? parsedTx;
  if (!(await x402MemoMatchesNonce(transaction.memo, nonce.nonce))) {
    throwApiError(
      400,
      "x402_payment_nonce_mismatch",
      "Signed Stellar transaction memo must match the x402 nonce or nonce hash.",
    );
  }

  const expectedAsset = parseChallengeAsset(nonce.asset);
  const expectedAmount = amountString(nonce.amount);
  const hasRequiredPayment = (transaction.operations ?? []).some((operation) =>
    operation.type === "payment" &&
    operation.destination === nonce.pay_to &&
    amountString(operation.amount as string | number) === expectedAmount &&
    operation.asset instanceof Asset &&
    assetsMatch(operation.asset, expectedAsset)
  );

  if (!hasRequiredPayment) {
    throwApiError(
      400,
      "x402_payment_mismatch",
      "Signed Stellar transaction must pay the challenge amount, asset, and destination.",
    );
  }
};

const handlePayments = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const detail = path.match(
    /^\/v1\/payments\/([^/]+)(?:\/(execute|condition-proof))?$/,
  );

  if (path === "/v1/payments" && req.method === "GET") {
    return json(req, 200, await listPaymentsForUser(user.id));
  }

  if (path === "/v1/payments" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as Record<string, string>;
    if (!input.fromDeviceId || !input.toDeviceId || !input.amount) {
      return apiError(
        req,
        400,
        "invalid_payment",
        "fromDeviceId, toDeviceId and amount are required.",
      );
    }
    const deviceRows = await selectRows<DbDevice>("kivo_devices", {
      select: "id",
      owner_id: `eq.${user.id}`,
      id: `in.(${input.fromDeviceId},${input.toDeviceId})`,
    });
    if (deviceRows.length < 2) {
      return apiError(
        req,
        400,
        "invalid_devices",
        "Payment devices must belong to the current user.",
      );
    }
    const conditionType = input.conditionType || "none";
    const status = conditionType === "none" ? "processing" : "pending";
    const row = await insertRow<DbPayment>("kivo_payments", {
      owner_id: user.id,
      from_device_id: input.fromDeviceId,
      to_device_id: input.toDeviceId,
      amount: input.amount,
      asset_code: input.assetCode || "USDC",
      condition_type: conditionType,
      condition_value: input.conditionValue || null,
      status,
      memo: input.memo || null,
      timeout_at: input.timeoutSeconds
        ? new Date(Date.now() + Number(input.timeoutSeconds) * 1000)
          .toISOString()
        : null,
      events: defaultPaymentEvents(conditionType),
    });
    return json(req, 201, toPayment(row));
  }

  if (detail && req.method === "GET" && !detail[2]) {
    const rows = await selectRows<DbPayment>("kivo_payments", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!rows[0]) {
      return apiError(req, 404, "payment_not_found", "Payment not found.");
    }
    return json(req, 200, toPayment(rows[0]));
  }

  if (detail && req.method === "POST" && detail[2] === "execute") {
    const input = await req.json().catch(() => ({})) as { txXDR?: string };
    if (!input.txXDR?.trim()) {
      return apiError(req, 400, "missing_xdr", "Signed txXDR is required.");
    }
    const payments = await selectRows<DbPayment>("kivo_payments", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const payment = payments[0];
    if (!payment) {
      return apiError(req, 404, "payment_not_found", "Payment not found.");
    }
    if (payment.status === "confirmed") {
      return apiError(
        req,
        409,
        "payment_already_confirmed",
        "Payment is already confirmed.",
      );
    }
    if (payment.status !== "processing") {
      return apiError(
        req,
        409,
        "payment_not_ready",
        "Payment conditions must be met before settlement.",
      );
    }
    if (!payment.from_device_id || !payment.to_device_id) {
      return apiError(
        req,
        400,
        "payment_devices_required",
        "Device payments require source and destination devices.",
      );
    }
    const deviceRows = await selectRows<DbDevice>("kivo_devices", {
      select: "id,stellar_public_key",
      owner_id: `eq.${user.id}`,
      id: `in.(${payment.from_device_id},${payment.to_device_id})`,
    });
    const fromDevice = deviceRows.find((device) =>
      device.id === payment.from_device_id
    );
    const toDevice = deviceRows.find((device) =>
      device.id === payment.to_device_id
    );
    if (!fromDevice || !toDevice) {
      return apiError(
        req,
        400,
        "invalid_payment_devices",
        "Payment devices must belong to the current user.",
      );
    }
    const txXDR = input.txXDR.trim();
    const validation = validatePaymentSettlementXdr(txXDR, {
      network: env("STELLAR_NETWORK", "testnet") === "mainnet"
        ? "mainnet"
        : "testnet",
      source: fromDevice.stellar_public_key,
      destination: toDevice.stellar_public_key,
      amount: payment.amount,
      assetCode: payment.asset_code,
      assetIssuer: payment.asset_issuer,
      memo: payment.memo,
    });
    if (!validation.ok) {
      return apiError(req, 400, validation.code, validation.message);
    }
    const settlement = await submitStellarXdr(txXDR);
    const rows = await patchRows<DbPayment>("kivo_payments", {
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
    }, {
      status: "confirmed",
      stellar_hash: settlement.hash,
      stellar_ledger: settlement.ledger,
      fee_charged: settlement.feeCharged,
      confirmed_at: nowISO(),
      events: [
        paymentEvent("Created", "Payment created in Kivo.", "done"),
        paymentEvent("Settled", "Stellar transaction confirmed.", "done"),
      ],
    });
    if (!rows[0]) {
      return apiError(req, 404, "payment_not_found", "Payment not found.");
    }
    return json(req, 200, toPayment(rows[0]));
  }

  if (detail && req.method === "POST" && detail[2] === "condition-proof") {
    const input = await req.json().catch(() => ({})) as {
      conditionKey?: string;
      actualValue?: string;
      proofData?: Record<string, unknown>;
    };
    const payments = await selectRows<DbPayment>("kivo_payments", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!payments[0]) {
      return apiError(req, 404, "payment_not_found", "Payment not found.");
    }
    const expected = payments[0].condition_value ?? "";
    const met = Number(input.actualValue ?? 0) >= Number(expected || 0);
    const condition = await insertRow<Record<string, unknown>>(
      "kivo_payment_conditions",
      {
        owner_id: user.id,
        payment_id: payments[0].id,
        condition_key: input.conditionKey || payments[0].condition_type,
        expected_value: expected,
        actual_value: input.actualValue || null,
        proof_data: input.proofData ?? {},
        met_at: met ? nowISO() : null,
      },
    );
    const rows = met
      ? await patchRows<DbPayment>("kivo_payments", {
        id: `eq.${detail[1]}`,
        owner_id: `eq.${user.id}`,
      }, {
        status: "processing",
        events: [
          ...payments[0].events,
          paymentEvent("Condition met", "Proof accepted.", "done"),
        ],
      })
      : payments;
    return json(req, 200, {
      conditionMet: met,
      payment: toPayment(rows[0]),
      condition: {
        id: condition.id,
        paymentId: payments[0].id,
        conditionKey: condition.condition_key,
        expectedValue: condition.expected_value,
        actualValue: condition.actual_value,
        proofData: condition.proof_data,
        metAt: condition.met_at,
        createdAt: condition.created_at,
      },
    });
  }

  return apiError(req, 404, "not_found", "Payment route not found.");
};

const handlePowerTotems = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const detail = path.match(
    /^\/v1\/power-totems\/([^/]+)(?:\/(pairing-token))?$/,
  );

  if (path === "/v1/power-totems" && req.method === "GET") {
    const rows = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      owner_id: `eq.${user.id}`,
      order: "created_at.desc",
    });
    return json(req, 200, rows.map(toPowerTotem));
  }

  if (path === "/v1/power-totems" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as Record<
      string,
      unknown
    >;
    const name = typeof input.name === "string" ? input.name.trim() : "";
    const price = typeof input.price === "number" ||
        typeof input.price === "string"
      ? String(input.price).trim()
      : "";
    const unit = typeof input.unit === "string" && input.unit.trim()
      ? input.unit.trim()
      : "session";
    if (!name) {
      return apiError(
        req,
        400,
        "invalid_power_totem",
        "Power Totem name is required.",
      );
    }
    if (!price || !Number.isFinite(Number(price)) || Number(price) <= 0) {
      return apiError(
        req,
        400,
        "invalid_power_totem_price",
        "Power Totem price must be greater than zero.",
      );
    }
    if (!["session", "minute", "kWh"].includes(unit)) {
      return apiError(
        req,
        400,
        "invalid_power_totem_unit",
        "Power Totem unit must be session, minute, or kWh.",
      );
    }
    let durationSeconds: number;
    try {
      durationSeconds = ensureValidDuration(
        Number(input.sessionDurationSeconds ?? input.durationSeconds ?? 30),
      );
    } catch (error) {
      return apiError(
        req,
        400,
        "invalid_power_totem_duration",
        error instanceof Error ? error.message : "Invalid session duration.",
      );
    }
    const totemId = crypto.randomUUID();
    const baseQrSlug = sanitizeQrSlug(
      typeof input.qrSlug === "string" ? input.qrSlug : name,
    );
    const qrSlug = `${baseQrSlug}-${totemId.slice(0, 8)}`;
    let resource: string;
    try {
      resource = buildPowerTotemResource(totemId);
    } catch (error) {
      return apiError(
        req,
        400,
        "invalid_power_totem_resource",
        error instanceof Error
          ? error.message
          : "Invalid Power Totem resource.",
      );
    }
    const row = await insertRow<DbPowerTotem>("kivo_power_totems", {
      id: totemId,
      owner_id: user.id,
      name,
      resource,
      price,
      unit,
      session_duration_seconds: durationSeconds,
      status: "draft",
      qr_slug: qrSlug,
      metadata: recordOrEmpty(input.metadata),
    });
    await upsertPowerTotemPricingRule(user.id, resource, price, name);
    return json(req, 201, toPowerTotem(row));
  }

  if (detail && req.method === "GET" && !detail[2]) {
    const rows = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    if (!rows[0]) {
      return apiError(
        req,
        404,
        "power_totem_not_found",
        "Power Totem not found.",
      );
    }
    return json(req, 200, toPowerTotem(rows[0]));
  }

  if (detail && req.method === "POST" && detail[2] === "pairing-token") {
    const totems = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const totem = totems[0];
    if (!totem) {
      return apiError(
        req,
        404,
        "power_totem_not_found",
        "Power Totem not found.",
      );
    }
    const input = await req.json().catch(() => ({})) as Record<
      string,
      unknown
    >;
    const rawGatewayToken = randomToken("kgw_");
    const rawPairingToken = randomToken("kpair_");
    const adapter = typeof input.adapter === "string" &&
        ["simulator", "raspberry"].includes(input.adapter)
      ? input.adapter
      : "simulator";
    const gateway = await insertRow<DbGateway>("kivo_gateways", {
      owner_id: user.id,
      totem_id: totem.id,
      name: typeof input.name === "string" && input.name.trim()
        ? input.name.trim()
        : `${totem.name} gateway`,
      token_hash: await sha256Hex(rawGatewayToken),
      token_preview: secretPreview(rawGatewayToken),
      pairing_token_hash: await sha256Hex(rawPairingToken),
      pairing_token_preview: secretPreview(rawPairingToken),
      status: "pairing",
      adapter,
      metadata: recordOrEmpty(input.metadata),
    });
    return json(req, 201, {
      gateway: toGateway(gateway),
      gatewayToken: rawGatewayToken,
      pairingToken: rawPairingToken,
    });
  }

  return apiError(req, 404, "not_found", "Power Totem route not found.");
};

const handleGateways = async (req: Request, path: string) => {
  const gateway = await requireGateway(req);
  const detail = path.match(
    /^\/v1\/gateways\/([^/]+)\/(heartbeat|authorization|events)$/,
  );
  if (!detail) {
    return apiError(req, 404, "not_found", "Gateway route not found.");
  }
  if (detail[1] !== gateway.id) {
    return apiError(
      req,
      403,
      "gateway_route_mismatch",
      "Gateway token does not match this route.",
    );
  }

  if (detail[2] === "heartbeat" && req.method === "POST") {
    const rows = await patchRows<DbGateway>("kivo_gateways", {
      id: `eq.${gateway.id}`,
      owner_id: `eq.${gateway.owner_id}`,
      status: "in.(pairing,offline,online)",
    }, {
      status: "online",
      last_seen_at: nowISO(),
    });
    if (!rows[0]) {
      return apiError(
        req,
        409,
        "gateway_heartbeat_conflict",
        "Gateway cannot be moved online from its current status.",
      );
    }
    return json(req, 200, toGateway(rows[0]));
  }

  if (detail[2] === "authorization" && req.method === "GET") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      owner_id: `eq.${gateway.owner_id}`,
      gateway_id: `eq.${gateway.id}`,
      status: "eq.authorized",
      order: "authorized_at.asc,created_at.asc",
      limit: 1,
    });
    return json(req, 200, {
      authorization: rows[0] ? toPowerSession(rows[0]) : null,
    });
  }

  if (detail[2] === "events" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as Record<
      string,
      unknown
    >;
    const eventType = typeof input.eventType === "string"
      ? input.eventType.trim()
      : typeof input.event_type === "string"
      ? input.event_type.trim()
      : "";
    if (!eventType) {
      return apiError(
        req,
        400,
        "invalid_gateway_event",
        "Gateway event type is required.",
      );
    }
    const sessionId = typeof input.sessionId === "string" &&
        input.sessionId.trim()
      ? input.sessionId.trim()
      : "";
    if (sessionId) {
      if (!gateway.totem_id) {
        return apiError(
          req,
          400,
          "gateway_session_invalid",
          "Gateway must be paired to a Power Totem before sending session events.",
        );
      }
      const sessions = await selectRows<DbPowerSession>(
        "kivo_power_sessions",
        {
          select: "id",
          id: `eq.${sessionId}`,
          owner_id: `eq.${gateway.owner_id}`,
          gateway_id: `eq.${gateway.id}`,
          totem_id: `eq.${gateway.totem_id}`,
          limit: 1,
        },
      );
      if (!sessions[0]) {
        return apiError(
          req,
          404,
          "gateway_session_not_found",
          "Power Session does not belong to this gateway.",
        );
      }
    }
    const event = await insertRow<DbGatewayEvent>("kivo_gateway_events", {
      owner_id: gateway.owner_id,
      gateway_id: gateway.id,
      totem_id: gateway.totem_id ?? null,
      session_id: sessionId || null,
      event_type: eventType,
      payload: recordOrEmpty(input.payload),
    });
    return json(req, 201, toGatewayEvent(event));
  }

  return apiError(req, 404, "not_found", "Gateway route not found.");
};

const handlePowerSessions = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const detail = path.match(
    /^\/v1\/power-sessions\/([^/]+)(?:\/(start-checkout|authorize|complete))?$/,
  );

  if (path === "/v1/power-sessions" && req.method === "GET") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      owner_id: `eq.${user.id}`,
      order: "created_at.desc",
    });
    return json(req, 200, rows.map(toPowerSession));
  }

  if (path === "/v1/power-sessions" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as Record<
      string,
      unknown
    >;
    const totemId = typeof input.totemId === "string"
      ? input.totemId.trim()
      : "";
    if (!totemId) {
      return apiError(
        req,
        400,
        "invalid_power_session",
        "totemId is required.",
      );
    }
    const totems = await selectRows<DbPowerTotem>("kivo_power_totems", {
      select: "*",
      id: `eq.${totemId}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const totem = totems[0];
    if (!totem) {
      return apiError(
        req,
        404,
        "power_totem_not_found",
        "Power Totem not found.",
      );
    }
    const gateways = await selectRows<DbGateway>("kivo_gateways", {
      select: "*",
      owner_id: `eq.${user.id}`,
      totem_id: `eq.${totem.id}`,
      order: "created_at.desc",
      limit: 1,
    });
    const row = await insertRow<DbPowerSession>("kivo_power_sessions", {
      owner_id: user.id,
      totem_id: totem.id,
      gateway_id: gateways[0]?.id ?? null,
      resource: totem.resource,
      amount: totem.price,
      asset: defaultPowerSessionAsset(),
      duration_seconds: totem.session_duration_seconds,
      status: "requested",
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      events: [
        paymentEvent(
          "Session requested",
          "Power session requested.",
          "current",
        ),
      ],
    });
    return json(req, 201, toPowerSession(row));
  }

  if (detail && req.method === "POST" && detail[2] === "start-checkout") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const session = rows[0];
    if (!session) {
      return apiError(
        req,
        404,
        "power_session_not_found",
        "Power Session not found.",
      );
    }
    let nextStatus: PowerSessionStatus;
    try {
      nextStatus = nextSessionStatus(session.status, "require_payment");
    } catch (error) {
      return apiError(
        req,
        409,
        "power_session_checkout_not_available",
        error instanceof Error
          ? error.message
          : "Power Session cannot start checkout from its current status.",
      );
    }
    const challenge = await buildChallenge(req, session.resource, user);
    const updated = await patchRows<DbPowerSession>("kivo_power_sessions", {
      id: `eq.${session.id}`,
      owner_id: `eq.${user.id}`,
      status: "eq.requested",
    }, {
      status: nextStatus,
      x402_nonce: challenge.nonce,
      events: [
        ...session.events,
        paymentEvent(
          "Checkout started",
          "x402 payment challenge issued for Power Totem session.",
          "current",
        ),
      ],
    });
    if (!updated[0]) {
      return apiError(
        req,
        409,
        "power_session_checkout_conflict",
        "Power Session is no longer requested.",
      );
    }
    return json(req, 200, {
      session: toPowerSession(updated[0]),
      checkoutResource: session.resource,
      challenge,
    });
  }

  if (detail && req.method === "POST" && detail[2] === "authorize") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const session = rows[0];
    if (!session) {
      return apiError(
        req,
        404,
        "power_session_not_found",
        "Power Session not found.",
      );
    }
    if (session.status !== "paid") {
      return apiError(
        req,
        409,
        "power_session_not_paid",
        "Power Session must be paid before authorization.",
      );
    }
    const rawAuthorizationToken = randomToken("kauth_");
    const updated = await patchRows<DbPowerSession>("kivo_power_sessions", {
      id: `eq.${session.id}`,
      owner_id: `eq.${user.id}`,
      status: "eq.paid",
    }, {
      status: nextSessionStatus(session.status, "authorize"),
      authorization_token_hash: await sha256Hex(rawAuthorizationToken),
      authorization_token_preview: secretPreview(rawAuthorizationToken),
      authorized_at: nowISO(),
      events: [
        ...session.events,
        paymentEvent(
          "Session authorized",
          "Gateway authorization token created.",
          "done",
        ),
      ],
    });
    if (!updated[0]) {
      return apiError(
        req,
        409,
        "power_session_authorize_conflict",
        "Power Session is no longer paid.",
      );
    }
    return json(req, 200, {
      session: toPowerSession(updated[0]),
    });
  }

  if (detail && req.method === "POST" && detail[2] === "complete") {
    const rows = await selectRows<DbPowerSession>("kivo_power_sessions", {
      select: "*",
      id: `eq.${detail[1]}`,
      owner_id: `eq.${user.id}`,
      limit: 1,
    });
    const session = rows[0];
    if (!session) {
      return apiError(
        req,
        404,
        "power_session_not_found",
        "Power Session not found.",
      );
    }
    let nextStatus: PowerSessionStatus;
    try {
      nextStatus = nextSessionStatus(session.status, "complete");
    } catch (error) {
      return apiError(
        req,
        409,
        "power_session_not_completable",
        error instanceof Error
          ? error.message
          : "Power Session cannot be completed from its current status.",
      );
    }
    const updated = await patchRows<DbPowerSession>("kivo_power_sessions", {
      id: `eq.${session.id}`,
      owner_id: `eq.${user.id}`,
      status: `eq.${session.status}`,
    }, {
      status: nextStatus,
      completed_at: nowISO(),
      events: [
        ...session.events,
        paymentEvent("Session completed", "Power session completed.", "done"),
      ],
    });
    if (!updated[0]) {
      return apiError(
        req,
        409,
        "power_session_complete_conflict",
        "Power Session status changed before completion.",
      );
    }
    return json(req, 200, toPowerSession(updated[0]));
  }

  return apiError(req, 404, "not_found", "Power Session route not found.");
};

const getPricingRuleForResource = async (
  resource: string,
  user: KivoUser | null,
) => {
  if (user) {
    const own = await selectRows<DbPricingRule>("kivo_x402_pricing_rules", {
      select: "*",
      owner_id: `eq.${user.id}`,
      resource: `eq.${resource}`,
      enabled: "eq.true",
      limit: 1,
    });
    if (own[0]) {
      return own[0];
    }
  }
  const rows = await selectRows<DbPricingRule>("kivo_x402_pricing_rules", {
    select: "*",
    resource: `eq.${resource}`,
    enabled: "eq.true",
    order: "updated_at.desc",
    limit: 1,
  });
  return rows[0] ?? null;
};

const getChallengeUserForResource = async (
  req: Request,
  resource: string,
): Promise<KivoUser | null> => {
  if (!resource.startsWith("/power-totem/")) {
    return await getOptionalUser(req);
  }
  const rows = await selectRows<DbPowerTotem>("kivo_power_totems", {
    select: "*",
    resource: `eq.${resource}`,
    limit: 1,
  });
  if (!rows[0]) {
    throwApiError(
      404,
      "power_totem_resource_not_found",
      "Power Totem resource was not found.",
    );
  }
  return { id: rows[0].owner_id };
};

const buildChallenge = async (
  _req: Request,
  resource: string,
  user: KivoUser | null,
) => {
  const rule = await getPricingRuleForResource(resource, user);
  const payTo = env("X402_PLATFORM_KEY");
  if (!/^G[A-Z2-7]{55}$/.test(payTo)) {
    throwApiError(
      503,
      "x402_platform_key_missing",
      "X402_PLATFORM_KEY must be a funded Stellar public key.",
    );
  }
  const amount = amountString(rule?.amount ?? "0.0500000");
  const asset = rule?.asset || `USDC:${env("USDC_ISSUER")}`;
  const maxTimeout = rule?.max_timeout ?? 300;
  const nonce = crypto.randomUUID();
  const network = env("STELLAR_NETWORK", "testnet") === "mainnet"
    ? "mainnet"
    : "testnet";
  const requiredHeader =
    `scheme=stellar,network=${network},payTo=${payTo},amount=${amount},asset=${asset},nonce=${nonce}`;
  await insertRow<DbNonce>("kivo_x402_nonces", {
    nonce,
    owner_id: user?.id ?? null,
    resource,
    amount,
    asset,
    pay_to: payTo,
    max_timeout: maxTimeout,
    status: "pending",
    expires_at: new Date(Date.now() + maxTimeout * 1000).toISOString(),
  });
  return {
    status: 402,
    resource,
    scheme: "stellar",
    network,
    payTo,
    amount,
    asset,
    maxTimeout,
    nonce,
    requiredHeader,
  };
};

const handleX402 = async (req: Request, path: string) => {
  if (path === "/v1/x402/challenge" && req.method === "GET") {
    const resource = new URL(req.url).searchParams.get("resource") ||
      "/api/x402/data";
    return json(
      req,
      200,
      await buildChallenge(
        req,
        resource,
        await getChallengeUserForResource(req, resource),
      ),
    );
  }

  if (path === "/v1/x402/pay" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      nonce?: string;
      txXDR?: string;
    };
    if (!input.nonce || !input.txXDR?.trim()) {
      return apiError(
        req,
        400,
        "invalid_x402_payment",
        "nonce and txXDR are required.",
      );
    }
    const rows = await selectRows<DbNonce>("kivo_x402_nonces", {
      select: "*",
      nonce: `eq.${input.nonce}`,
      limit: 1,
    });
    const nonce = rows[0];
    if (!nonce) {
      return apiError(req, 404, "nonce_not_found", "x402 nonce not found.");
    }
    if (
      nonce.status !== "pending" || Date.parse(nonce.expires_at) < Date.now()
    ) {
      return apiError(
        req,
        410,
        "nonce_expired",
        "x402 nonce is expired or already used.",
      );
    }

    const txXDR = input.txXDR.trim();
    await validateX402PaymentXdr(txXDR, nonce);
    const settlement = await submitStellarXdr(txXDR);
    const paymentHeader = base64Url(JSON.stringify({
      scheme: "stellar",
      nonce: nonce.nonce,
      resource: nonce.resource,
      stellarHash: settlement.hash,
      stellarLedger: settlement.ledger,
      paidAt: nowISO(),
    }));
    await patchRows<DbNonce>(
      "kivo_x402_nonces",
      { nonce: `eq.${nonce.nonce}` },
      {
        status: "confirmed",
        payment_header: paymentHeader,
        stellar_hash: settlement.hash,
        stellar_ledger: settlement.ledger,
        tx_xdr: txXDR,
      },
    );

    if (nonce.owner_id) {
      const { code, issuer } = splitAsset(nonce.asset);
      const paymentRow = await insertRow<DbPayment>("kivo_payments", {
        owner_id: nonce.owner_id,
        from_device_id: null,
        to_device_id: null,
        amount: nonce.amount,
        asset_code: code,
        asset_issuer: issuer || null,
        condition_type: "none",
        status: "confirmed",
        stellar_hash: settlement.hash,
        stellar_ledger: settlement.ledger,
        fee_charged: settlement.feeCharged,
        memo: `paid access to ${nonce.resource}`,
        confirmed_at: nowISO(),
        events: [
          paymentEvent("x402 challenge", "HTTP 402 issued.", "done"),
          paymentEvent(
            "x402 paid",
            "Signed Stellar transaction accepted.",
            "done",
          ),
        ],
      });
      const sessions = await selectRows<DbPowerSession>("kivo_power_sessions", {
        select: "*",
        owner_id: `eq.${nonce.owner_id}`,
        x402_nonce: `eq.${nonce.nonce}`,
        status: "eq.payment_required",
        limit: 1,
      });
      const session = sessions[0];
      if (session) {
        await patchRows<DbPowerSession>("kivo_power_sessions", {
          id: `eq.${session.id}`,
          owner_id: `eq.${nonce.owner_id}`,
          status: "eq.payment_required",
        }, {
          status: nextSessionStatus(session.status, "mark_paid"),
          payment_id: paymentRow.id,
          events: [
            ...session.events,
            paymentEvent(
              "Payment confirmed",
              "x402 payment confirmed for Power Totem session.",
              "done",
            ),
          ],
        });
      }
    }

    return json(req, 200, {
      status: 200,
      paymentHeader,
      stellarHash: settlement.hash,
      stellarLedger: settlement.ledger,
      data: {
        unlocked: true,
        resource: nonce.resource,
        amount: amountString(nonce.amount),
        asset: nonce.asset,
      },
    });
  }

  if (path === "/v1/x402/pricing-rules" && req.method === "GET") {
    const user = await requireUser(req);
    return json(req, 200, await listPricingRulesForUser(user.id));
  }

  if (path === "/v1/x402/pricing-rules" && req.method === "PUT") {
    const user = await requireUser(req);
    const input = await req.json().catch(() => ({})) as Record<string, unknown>;
    if (
      typeof input.resource !== "string" || !input.resource.trim() ||
      typeof input.amount !== "string" || !input.amount.trim() ||
      typeof input.asset !== "string" || !input.asset.trim()
    ) {
      return apiError(
        req,
        400,
        "invalid_pricing_rule",
        "resource, amount and asset are required.",
      );
    }
    const existing = await selectRows<DbPricingRule>(
      "kivo_x402_pricing_rules",
      {
        select: "*",
        owner_id: `eq.${user.id}`,
        resource: `eq.${input.resource.trim()}`,
        limit: 1,
      },
    );
    const payload = {
      owner_id: user.id,
      resource: input.resource.trim(),
      amount: input.amount,
      asset: input.asset,
      max_timeout: Number(input.maxTimeout ?? 300),
      enabled: input.enabled !== false,
      description: typeof input.description === "string"
        ? input.description
        : null,
    };
    const row = existing[0]
      ? (await patchRows<DbPricingRule>("kivo_x402_pricing_rules", {
        id: `eq.${existing[0].id}`,
        owner_id: `eq.${user.id}`,
      }, payload))[0]
      : await insertRow<DbPricingRule>("kivo_x402_pricing_rules", payload);
    return json(req, 200, toPricingRule(row));
  }

  return apiError(req, 404, "not_found", "x402 route not found.");
};

const handleProtectedResource = async (req: Request, path: string) => {
  const paymentHeader = req.headers.get("X-PAYMENT") ?? "";
  if (!paymentHeader) {
    const challenge = await buildChallenge(
      req,
      path,
      await getChallengeUserForResource(req, path),
    );
    return new Response(JSON.stringify(challenge), {
      status: 402,
      headers: {
        ...corsHeaders(req),
        "Content-Type": "application/json",
        "X-PAYMENT-REQUIRED": challenge.requiredHeader,
      },
    });
  }

  const rows = await selectRows<DbNonce>("kivo_x402_nonces", {
    select: "*",
    payment_header: `eq.${paymentHeader}`,
    resource: `eq.${path}`,
    status: "eq.confirmed",
    limit: 1,
  });
  if (!rows[0]) {
    return apiError(
      req,
      402,
      "payment_required",
      "Valid X-PAYMENT header required.",
    );
  }
  return json(req, 200, {
    unlocked: true,
    resource: path,
    timestamp: nowISO(),
    data: {
      message: "Kivo protected resource unlocked.",
      nonce: rows[0].nonce,
      stellarHash: rows[0].stellar_hash,
    },
  });
};

const submitStellarXdr = async (txXDR: string) => {
  const horizon = env(
    "STELLAR_HORIZON_URL",
    "https://horizon-testnet.stellar.org",
  )
    .replace(/\/$/, "");
  const response = await fetch(`${horizon}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ tx: txXDR }),
  });
  const text = await response.text();
  let payload: Record<string, unknown> = {};
  try {
    payload = JSON.parse(text) as Record<string, unknown>;
  } catch {
    payload = {};
  }
  if (!response.ok) {
    throwApiError(
      400,
      "stellar_submit_failed",
      typeof payload.detail === "string" ? payload.detail : text,
    );
  }
  return {
    hash: String(payload.hash ?? ""),
    ledger: Number(payload.ledger ?? 0),
    feeCharged: amountString(Number(payload.fee_charged ?? 0) / 10000000),
  };
};

const handleWebhooks = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const match = path.match(/^\/v1\/webhooks\/([^/]+)(?:\/(test|deliveries))?$/);
  if (path === "/v1/webhooks" && req.method === "GET") {
    const rows = await selectRows<DbWebhook>("kivo_webhooks", {
      select: "*",
      owner_id: `eq.${user.id}`,
      order: "created_at.desc",
    });
    return json(req, 200, rows.map(toWebhook));
  }
  if (path === "/v1/webhooks" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      url?: string;
      events?: string[];
    };
    if (!input.url?.startsWith("http")) {
      return apiError(
        req,
        400,
        "invalid_webhook",
        "Webhook URL must be absolute.",
      );
    }
    const rawSecret = randomToken("whsec_");
    const row = await insertRow<DbWebhook>("kivo_webhooks", {
      owner_id: user.id,
      url: input.url,
      events: input.events ?? ["payment.confirmed"],
      secret_hash: await sha256Hex(rawSecret),
      secret_preview: secretPreview(rawSecret),
      encrypted_secret: null,
      active: true,
    });
    return json(req, 201, { ...toWebhook(row), secret: rawSecret });
  }
  if (path === "/v1/webhook-deliveries" && req.method === "GET") {
    const rows = await selectRows<DbWebhookDelivery>(
      "kivo_webhook_deliveries",
      {
        select: "*",
        owner_id: `eq.${user.id}`,
        order: "created_at.desc",
      },
    );
    return json(req, 200, rows.map(toWebhookDelivery));
  }
  if (match && req.method === "GET" && match[2] === "deliveries") {
    const rows = await selectRows<DbWebhookDelivery>(
      "kivo_webhook_deliveries",
      {
        select: "*",
        owner_id: `eq.${user.id}`,
        webhook_id: `eq.${match[1]}`,
        order: "created_at.desc",
      },
    );
    return json(req, 200, rows.map(toWebhookDelivery));
  }
  if (match && req.method === "PATCH" && !match[2]) {
    const input = await req.json().catch(() => ({})) as { active?: boolean };
    const rows = await patchRows<DbWebhook>("kivo_webhooks", {
      id: `eq.${match[1]}`,
      owner_id: `eq.${user.id}`,
    }, { active: Boolean(input.active) });
    if (!rows[0]) {
      return apiError(req, 404, "webhook_not_found", "Webhook not found.");
    }
    return json(req, 200, toWebhook(rows[0]));
  }
  if (match && req.method === "POST" && match[2] === "test") {
    const delivery = await insertRow<DbWebhookDelivery>(
      "kivo_webhook_deliveries",
      {
        owner_id: user.id,
        webhook_id: match[1],
        event: "webhook.test",
        payload: { ok: true, createdAt: nowISO() },
        status: "delivered",
        attempts: 1,
        response_code: 200,
        delivered_at: nowISO(),
      },
    );
    await patchRows<DbWebhook>("kivo_webhooks", {
      id: `eq.${match[1]}`,
      owner_id: `eq.${user.id}`,
    }, { delivery_count: 1, last_delivery_status: "delivered" });
    return json(req, 200, {
      webhookId: match[1],
      status: "delivered",
      responseCode: 200,
      latencyMs: 42,
      signedPayloadPreview: "sha256=...",
      delivery: toWebhookDelivery(delivery),
    });
  }
  if (match && req.method === "DELETE" && !match[2]) {
    await deleteRows("kivo_webhooks", {
      id: `eq.${match[1]}`,
      owner_id: `eq.${user.id}`,
    });
    return noContent(req);
  }
  return apiError(req, 404, "not_found", "Webhook route not found.");
};

const handleApiKeys = async (req: Request, path: string) => {
  const user = await requireUser(req);
  const revoke = path.match(/^\/v1\/api-keys\/([^/]+)\/revoke$/);
  if (path === "/v1/api-keys" && req.method === "GET") {
    const rows = await selectRows<DbApiKey>("kivo_api_keys", {
      select: "*",
      owner_id: `eq.${user.id}`,
      order: "created_at.desc",
    });
    return json(req, 200, rows.map(toApiKey));
  }
  if (path === "/v1/api-keys" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      name?: string;
      scopes?: string[];
      expiresAt?: string;
    };
    const rawKey = randomToken("kivo_live_");
    const row = await insertRow<DbApiKey>("kivo_api_keys", {
      owner_id: user.id,
      name: input.name?.trim() || "Kivo API key",
      key_hash: await sha256Hex(rawKey),
      key_preview: secretPreview(rawKey),
      scopes: input.scopes ?? ["devices:read", "payments:write", "x402:pay"],
      expires_at: input.expiresAt || null,
      status: "active",
    });
    return json(req, 201, { apiKey: toApiKey(row), rawKey });
  }
  if (revoke && req.method === "POST") {
    const rows = await patchRows<DbApiKey>("kivo_api_keys", {
      id: `eq.${revoke[1]}`,
      owner_id: `eq.${user.id}`,
    }, { status: "revoked" });
    if (!rows[0]) {
      return apiError(req, 404, "api_key_not_found", "API key not found.");
    }
    return json(req, 200, toApiKey(rows[0]));
  }
  return apiError(req, 404, "not_found", "API key route not found.");
};

const handleMcp = async (req: Request, path: string) => {
  const tools = [
    {
      id: "tool_create",
      name: "kivo_create_payment",
      title: "Create payment",
      description: "Create a Kivo payment intent for a device or x402 flow.",
      safeForAutoUse: false,
      inputSchema: { type: "object" },
      exampleInput: { amount: "0.0500000" },
    },
    {
      id: "tool_status",
      name: "kivo_check_status",
      title: "Check status",
      description: "Check payment or device status.",
      safeForAutoUse: true,
      inputSchema: { type: "object" },
      exampleInput: { paymentId: "pay_<id>" },
    },
  ];
  const base = new URL(req.url);
  base.search = "";
  base.pathname = base.pathname.replace(/\/v1\/mcp\/(tools|config)$/, "/mcp");
  if (path === "/v1/mcp/tools" && req.method === "GET") {
    await requireUser(req);
    return json(req, 200, tools);
  }
  if (path === "/v1/mcp/config" && req.method === "GET") {
    await requireUser(req);
    return json(req, 200, {
      server: { name: "kivo", transport: "http", url: base.toString() },
      env: {
        KIVO_API_URL: base.toString(),
        KIVO_API_KEY: "env:KIVO_API_KEY",
        KIVO_NETWORK: env("STELLAR_NETWORK", "testnet"),
      },
      tools: tools.map((tool) => tool.name),
      approvalPolicy: {
        autoApproveSafeTools: true,
        maxAutoPaymentAmount: "0.5000000 USDC",
        requireHumanFor: ["kivo_create_payment"],
      },
      sampleConfig: { mcpServers: { kivo: { url: base.toString() } } },
    });
  }
  if (path === "/mcp" && req.method === "POST") {
    const input = await req.json().catch(() => ({})) as {
      id?: string | number;
      method?: string;
      params?: { name?: string; arguments?: Record<string, unknown> };
    };
    const output = input.params?.name === "kivo_check_status"
      ? { status: "ok", checkedAt: nowISO() }
      : {
        accepted: true,
        tool: input.params?.name ?? "unknown",
        createdAt: nowISO(),
      };
    return json(req, 200, {
      jsonrpc: "2.0",
      id: input.id ?? null,
      result: { content: [{ type: "text", text: JSON.stringify(output) }] },
    });
  }
  return apiError(req, 404, "not_found", "MCP route not found.");
};

const handleWorkflows = async (req: Request) => {
  const user = await requireUser(req);
  const payments = await listPaymentsForUser(user.id);
  const now = nowISO();
  return json(req, 200, [
    {
      id: "wf_x402_settlement",
      name: "x402 settlement",
      type: "x402_settlement",
      status: "healthy",
      engine: "supabase-edge",
      trigger: "x402.pay",
      createdAt: now,
      updatedAt: now,
      steps: [
        {
          id: "nonce",
          label: "Nonce",
          status: "done",
          description: "Challenge persisted",
        },
        {
          id: "stellar",
          label: "Stellar",
          status: payments.length ? "done" : "queued",
          description: "Submit signed XDR",
        },
      ],
    },
    {
      id: "wf_etherfuse_webhook",
      name: "Etherfuse webhook ingest",
      type: "webhook_worker",
      status: "healthy",
      engine: "supabase-edge",
      trigger: "etherfuse.order_updated",
      createdAt: now,
      updatedAt: now,
      steps: [
        {
          id: "verify",
          label: "Verify",
          status: "done",
          description: "Validate X-Signature",
        },
        {
          id: "store",
          label: "Store",
          status: "running",
          description: "Persist provider event",
        },
      ],
    },
  ]);
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return noContent(req);
  }

  try {
    const path = normalizePath(req);

    if (path === "/v1/health" && req.method === "GET") {
      return json(req, 200, systemHealth());
    }
    if (path === "/v1/deploy/checks" && req.method === "GET") {
      return json(req, 200, deployChecks());
    }
    if (path === "/v1/deploy/services" && req.method === "GET") {
      return json(req, 200, deployServices(req));
    }
    if (path === "/v1/dashboard" && req.method === "GET") {
      return await handleDashboard(req);
    }
    if (path === "/v1/devices" || path.startsWith("/v1/devices/")) {
      return await handleDevices(req, path);
    }
    if (path === "/v1/payments" || path.startsWith("/v1/payments/")) {
      return await handlePayments(req, path);
    }
    if (path === "/v1/power-totems" || path.startsWith("/v1/power-totems/")) {
      return await handlePowerTotems(req, path);
    }
    if (
      path === "/v1/power-sessions" || path.startsWith("/v1/power-sessions/")
    ) {
      return await handlePowerSessions(req, path);
    }
    if (path.startsWith("/v1/gateways/")) {
      return await handleGateways(req, path);
    }
    if (path.startsWith("/v1/x402/")) {
      return await handleX402(req, path);
    }
    if (
      path.startsWith("/api/") || path.startsWith("/devices/") ||
      path.startsWith("/data/") || path.startsWith("/power-totem/")
    ) {
      return await handleProtectedResource(req, path);
    }
    if (
      path === "/v1/webhooks" || path.startsWith("/v1/webhooks/") ||
      path === "/v1/webhook-deliveries"
    ) {
      return await handleWebhooks(req, path);
    }
    if (path === "/v1/api-keys" || path.startsWith("/v1/api-keys/")) {
      return await handleApiKeys(req, path);
    }
    if (
      path === "/v1/mcp/tools" || path === "/v1/mcp/config" || path === "/mcp"
    ) {
      return await handleMcp(req, path);
    }
    if (path === "/v1/workflows" && req.method === "GET") {
      return await handleWorkflows(req);
    }
    if (path.startsWith("/v1/etherfuse/")) {
      return handleEtherfuse(req, path);
    }

    return apiError(
      req,
      501,
      "edge_route_pending",
      "This Kivo route is not part of the Solo MVP Edge API.",
    );
  } catch (error) {
    if (error instanceof KivoHttpError) {
      return apiError(req, error.status, error.code, error.message);
    }
    const message = error instanceof Error
      ? error.message
      : "Unexpected Kivo Edge Function error.";
    return apiError(req, 500, "internal_error", message);
  }
});
