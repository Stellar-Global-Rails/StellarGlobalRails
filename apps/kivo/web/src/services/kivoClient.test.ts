import { describe, expect, it } from 'vitest';
import { createKivoClient } from './kivoClient';

describe('HttpKivoApiClient', () => {
  it('uses HTTP by default instead of silently falling back to mock data', async () => {
    let requestedUrl = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input) => {
        requestedUrl = String(input);
        return jsonResponse({ version: '0.1.0-real', api: 'ok', db: 'ok', workers: 'ok', stellar: 'ok', mcp: 'ok' });
      },
    });

    await expect(client.getHealth()).resolves.toMatchObject({ version: '0.1.0-real' });
    expect(requestedUrl).toBe('https://api.kivo.example/v1/health');
  });

  it('preserves path-based Edge Function base URLs', async () => {
    let requestedUrl = '';
    const client = createKivoClient({
      baseUrl: 'https://project.supabase.co/functions/v1/kivo-api',
      fetcher: async (input) => {
        requestedUrl = String(input);
        return jsonResponse({ version: '0.1.0-real', api: 'ok', db: 'ok', workers: 'ok', stellar: 'ok', mcp: 'ok' });
      },
    });

    await client.getHealth();

    expect(requestedUrl).toBe('https://project.supabase.co/functions/v1/kivo-api/v1/health');
  });

  it('submits payment execution with a real Stellar XDR payload', async () => {
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (_input, init) => {
        body = String(init?.body);
        return jsonResponse({
          id: 'pay_real',
          fromDeviceId: 'dev_a',
          toDeviceId: 'dev_b',
          amount: '0.0500000',
          assetCode: 'USDC',
          conditionType: 'none',
          status: 'confirmed',
          stellarHash: 'hash_real',
          stellarLedger: 123,
          createdAt: new Date().toISOString(),
          events: [],
        });
      },
    });

    const payment = await client.executePayment('pay_real', 'AAAA_REAL_XDR');

    expect(JSON.parse(body)).toEqual({ txXDR: 'AAAA_REAL_XDR' });
    expect(payment.stellarHash).toBe('hash_real');
  });

  it('pays x402 only by sending a signed transaction XDR', async () => {
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (_input, init) => {
        body = String(init?.body);
        return jsonResponse({
          status: 200,
          paymentHeader: 'encoded',
          stellarHash: 'hash_real',
          stellarLedger: 456,
          data: { unlocked: true },
        });
      },
    });

    const paid = await client.payX402Challenge('nonce_real', 'AAAA_REAL_XDR');

    expect(JSON.parse(body)).toEqual({ nonce: 'nonce_real', txXDR: 'AAAA_REAL_XDR' });
    expect(paid.stellarHash).toBe('hash_real');
  });

  it('creates Power Totems through the documented API route', async () => {
    let requestedUrl = '';
    let body = '';
    const input = {
      name: 'Station A',
      price: '0.2500000',
      unit: 'session' as const,
      sessionDurationSeconds: 30,
    };
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        body = String(init?.body);
        return jsonResponse({
          id: 'totem_1',
          ownerId: 'user_1',
          name: input.name,
          resource: 'kivo:power-totem:totem_1',
          price: input.price,
          unit: input.unit,
          sessionDurationSeconds: input.sessionDurationSeconds,
          status: 'draft',
          qrSlug: 'station-a-totem-1',
          metadata: {},
          createdAt: '2026-05-18T20:00:00Z',
          updatedAt: '2026-05-18T20:00:00Z',
        });
      },
    });

    const totem = await client.createPowerTotem(input);

    expect(requestedUrl).toBe('https://api.kivo.example/v1/power-totems');
    expect(JSON.parse(body)).toEqual(input);
    expect(totem.resource).toBe('kivo:power-totem:totem_1');
  });

  it('creates Power Totem pairing tokens without exposing service secrets', async () => {
    let requestedUrl = '';
    let method = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        return jsonResponse({
          gateway: {
            id: 'gateway_1',
            totemId: 'totem_1',
            name: 'Station A gateway',
            tokenPreview: 'kgw_...1234',
            pairingTokenPreview: 'kpair_...5678',
            status: 'pairing',
            adapter: 'simulator',
            metadata: {},
            createdAt: '2026-05-18T20:00:00Z',
            updatedAt: '2026-05-18T20:00:00Z',
          },
          gatewayToken: 'kgw_secret_token',
        });
      },
    });

    const result = await client.createPowerTotemPairingToken('totem_1');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/power-totems/totem_1/pairing-token');
    expect(method).toBe('POST');
    expect(result.gatewayToken).toBe('kgw_secret_token');
    expect(result).not.toHaveProperty('serviceRoleKey');
    expect(result).not.toHaveProperty('serviceRoleSecret');
  });

  it('proxies Etherfuse quote creation through the Kivo API', async () => {
    let requestedUrl = '';
    let body = '';
    const input = {
      quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
      customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
      blockchain: 'stellar' as const,
      quoteAssets: {
        type: 'onramp' as const,
        sourceAsset: 'MXN',
        targetAsset: 'USDC:GTEST',
      },
      sourceAmount: '100',
      walletAddress: 'GDESTINATION',
    };
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        body = String(init?.body);
        return jsonResponse({ quoteId: input.quoteId, expiresAt: '2026-05-16T18:00:00Z' });
      },
    });

    const quote = await client.createEtherfuseQuote(input);

    expect(requestedUrl).toBe('https://api.kivo.example/v1/etherfuse/quotes');
    expect(JSON.parse(body)).toEqual(input);
    expect(quote.quoteId).toBe(input.quoteId);
  });

  it('creates Etherfuse onboarding URLs through the server-side proxy', async () => {
    let requestedUrl = '';
    let body = '';
    const input = {
      customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
      bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
      publicKey: 'GDESTINATION',
      blockchain: 'stellar' as const,
      userInfo: { email: 'operator@kivo.example', displayName: 'Kivo Operator' },
    };
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        body = String(init?.body);
        return jsonResponse({ presigned_url: 'https://onboard.etherfuse.example/session' });
      },
    });

    const onboarding = await client.createEtherfuseOnboardingUrl(input);

    expect(requestedUrl).toBe('https://api.kivo.example/v1/etherfuse/onboarding-url');
    expect(JSON.parse(body)).toEqual(input);
    expect(onboarding.presigned_url).toContain('etherfuse');
  });

  it('creates and advances Etherfuse orders through documented Kivo routes', async () => {
    const requested: Array<{ url: string; method?: string; body?: string }> = [];
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requested.push({ url: String(inputUrl), method: init?.method, body: String(init?.body ?? '') });
        if (String(inputUrl).endsWith('/fiat-received')) {
          return jsonResponse({ orderId: 'ed14a9d7-f9be-4584-8f11-527d32ddab31', status: 'funded' });
        }
        return jsonResponse({ orderId: 'ed14a9d7-f9be-4584-8f11-527d32ddab31', status: 'created' });
      },
    });
    const input = {
      orderId: 'ed14a9d7-f9be-4584-8f11-527d32ddab31',
      bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
      publicKey: 'GDESTINATION',
      quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
    };

    const order = await client.createEtherfuseOrder(input);
    const advanced = await client.signalEtherfuseFiatReceived(input.orderId);

    expect(requested[0]).toMatchObject({ url: 'https://api.kivo.example/v1/etherfuse/orders', method: 'POST' });
    expect(JSON.parse(requested[0].body ?? '{}')).toEqual(input);
    expect(requested[1]).toMatchObject({
      url: 'https://api.kivo.example/v1/etherfuse/orders/ed14a9d7-f9be-4584-8f11-527d32ddab31/fiat-received',
      method: 'POST',
    });
    expect(order.status).toBe('created');
    expect(advanced.status).toBe('funded');
  });

  it('calls MCP tools through JSON-RPC instead of a simulate endpoint', async () => {
    let requestedUrl = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (input, init) => {
        requestedUrl = String(input);
        body = String(init?.body);
        return jsonResponse({
          jsonrpc: '2.0',
          id: 1,
          result: {
            content: [{ type: 'text', text: JSON.stringify({ status: 'confirmed' }) }],
            isError: false,
          },
        });
      },
    });

    const result = await client.callMcpTool('kivo_check_status', { paymentId: 'pay_real' });

    expect(requestedUrl).toBe('https://api.kivo.example/mcp');
    expect(JSON.parse(body)).toMatchObject({ method: 'tools/call', params: { name: 'kivo_check_status' } });
    expect(result.output).toEqual({ status: 'confirmed' });
  });

  it('surfaces API error messages instead of raw JSON strings', async () => {
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async () =>
        jsonResponse(
          {
            code: 'unauthorized',
            message: 'valid Supabase JWT or Kivo API key is required',
          },
          401,
        ),
    });

    let errorMessage = '';
    try {
      await client.getDashboardSummary();
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : String(error);
    }

    expect(errorMessage).toBe('valid Supabase JWT or Kivo API key is required');
  });
});

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
