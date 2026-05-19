export interface KivoClientOptions {
  baseUrl: string;
  apiKey?: string;
  fetcher?: typeof fetch;
}

export interface KivoX402Challenge {
  nonce: string;
  resource?: string;
  scheme?: 'stellar';
  network?: 'testnet' | 'mainnet';
  payTo?: string;
  amount?: string;
  asset?: string;
  requiredHeader?: string;
  [key: string]: unknown;
}

export class KivoClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly fetcher: typeof fetch;

  constructor({ baseUrl, apiKey, fetcher = fetch }: KivoClientOptions) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.fetcher = fetcher;
  }

  getX402Challenge(resource: string): Promise<KivoX402Challenge> {
    const encodedResource = encodeURIComponent(resource);
    return this.request<KivoX402Challenge>(`/v1/x402/challenge?resource=${encodedResource}`, {
      method: 'GET',
    });
  }

  payX402Challenge(nonce: string, txXDR: string): Promise<unknown> {
    return this.request('/v1/x402/pay', {
      method: 'POST',
      body: JSON.stringify({ nonce, txXDR }),
    });
  }

  sendGatewayHeartbeat(gatewayId: string, gatewayToken: string): Promise<unknown> {
    return this.request(`/v1/gateways/${encodeURIComponent(gatewayId)}/heartbeat`, {
      method: 'POST',
      headers: {
        'x-gateway-token': gatewayToken,
      },
      body: JSON.stringify({ status: 'online' }),
    });
  }

  private async request<T = unknown>(path: string, init: RequestInit): Promise<T> {
    const headers = new Headers(init.headers);

    if (this.apiKey) {
      headers.set('Authorization', `Bearer ${this.apiKey}`);
    }

    if (init.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const response = await this.fetcher(`${this.baseUrl}${path}`, {
      ...init,
      headers,
    });

    if (!response.ok) {
      throw new Error(`Kivo request failed: ${response.status}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();

    if (!text) {
      return undefined as T;
    }

    return JSON.parse(text) as T;
  }
}
