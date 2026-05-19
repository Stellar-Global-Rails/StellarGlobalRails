import type {
  Gateway,
  GatewayAuthorizationResponse,
  GatewayClient,
  GatewayEvent,
  GatewayEventInput,
  PowerSession,
} from "./types.js";

export type GatewayFetch = typeof fetch;

export interface KivoGatewayClientOptions {
  baseUrl: string;
  gatewayId: string;
  gatewayToken: string;
  apiToken?: string;
  fetcher?: GatewayFetch;
}

export class KivoGatewayClient implements GatewayClient {
  private readonly baseUrl: string;
  private readonly gatewayId: string;
  private readonly gatewayToken: string;
  private readonly apiToken?: string;
  private readonly fetcher: GatewayFetch;

  constructor(options: KivoGatewayClientOptions) {
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.gatewayId = options.gatewayId;
    this.gatewayToken = options.gatewayToken;
    this.apiToken = options.apiToken;
    this.fetcher = options.fetcher ?? fetch;
  }

  assertCanCompleteSessions(): void {
    if (!this.apiToken?.trim()) {
      throw new Error(
        "KIVO_API_TOKEN is required before completing Power Sessions.",
      );
    }
  }

  heartbeat(): Promise<Gateway> {
    return this.request<Gateway>(
      `/v1/gateways/${encodeURIComponent(this.gatewayId)}/heartbeat`,
      { method: "POST" },
      { gatewayToken: true },
    );
  }

  getAuthorization(): Promise<GatewayAuthorizationResponse> {
    return this.request<GatewayAuthorizationResponse>(
      `/v1/gateways/${encodeURIComponent(this.gatewayId)}/authorization`,
      { method: "GET" },
      { gatewayToken: true },
    );
  }

  createGatewayEvent(input: GatewayEventInput): Promise<GatewayEvent> {
    return this.request<GatewayEvent>(
      `/v1/gateways/${encodeURIComponent(this.gatewayId)}/events`,
      { method: "POST", body: JSON.stringify(input) },
      { gatewayToken: true },
    );
  }

  async completeSession(sessionId: string): Promise<PowerSession> {
    this.assertCanCompleteSessions();
    return await this.request<PowerSession>(
      `/v1/power-sessions/${encodeURIComponent(sessionId)}/complete`,
      { method: "POST" },
      { gatewayToken: true, apiToken: true },
    );
  }

  private async request<T>(
    path: string,
    init: RequestInit,
    auth: { gatewayToken?: boolean; apiToken?: boolean },
  ): Promise<T> {
    const headers = new Headers(init.headers);
    if (auth.gatewayToken) {
      headers.set("x-gateway-token", this.gatewayToken);
    }
    const apiToken = this.apiToken?.trim();
    if (auth.apiToken && apiToken) {
      headers.set("authorization", `Bearer ${apiToken}`);
    } else if (auth.apiToken) {
      throw new Error(
        "KIVO_API_TOKEN is required before completing Power Sessions.",
      );
    }
    if (init.body && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw new Error(await responseErrorMessage(response));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return await response.json() as T;
  }
}

async function responseErrorMessage(response: Response): Promise<string> {
  const text = await response.text().catch(() => "");
  if (!text) {
    return `Kivo API request failed with status ${response.status}.`;
  }

  try {
    const body = JSON.parse(text) as {
      error?: { message?: string } | string;
      message?: string;
    };
    if (typeof body.message === "string" && body.message.trim()) {
      return body.message;
    }
    if (
      body.error &&
      typeof body.error === "object" &&
      typeof body.error.message === "string" &&
      body.error.message.trim()
    ) {
      return body.error.message;
    }
    return typeof body.error === "string" && body.error.trim()
      ? body.error
      : `Kivo API request failed with status ${response.status}.`;
  } catch {
    return text;
  }
}
