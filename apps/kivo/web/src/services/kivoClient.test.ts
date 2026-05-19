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
          name: input.name,
          resource: '/power-totem/totem_1/session',
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
    expect(totem.resource).toBe('/power-totem/totem_1/session');
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

  it('starts Power Session checkout through the documented API route', async () => {
    let requestedUrl = '';
    let method = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        return jsonResponse({
          session: {
            id: 'sess_1',
            totemId: 'totem_1',
            gatewayId: 'gateway_1',
            resource: '/power-totem/totem_1/session',
            amount: '0.2500000',
            asset: 'USDC:GTEST',
            durationSeconds: 30,
            status: 'payment_required',
            x402Nonce: 'nonce_1',
            expiresAt: '2026-05-18T20:10:00Z',
            events: [],
            createdAt: '2026-05-18T20:00:00Z',
            updatedAt: '2026-05-18T20:01:00Z',
          },
          checkoutResource: '/power-totem/totem_1/session',
          challenge: {
            status: 402,
            resource: '/power-totem/totem_1/session',
            scheme: 'stellar',
            network: 'testnet',
            payTo: 'GDESTINATION',
            amount: '0.2500000',
            asset: 'USDC:GTEST',
            maxTimeout: 300,
            nonce: 'nonce_1',
            requiredHeader: 'scheme=stellar,nonce=nonce_1',
          },
        });
      },
    });

    const checkout = await client.startPowerSessionCheckout('sess_1');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/power-sessions/sess_1/start-checkout');
    expect(method).toBe('POST');
    expect(checkout.session.status).toBe('payment_required');
    expect(checkout.checkoutResource).toBe('/power-totem/totem_1/session');
    expect(checkout.challenge.nonce).toBe('nonce_1');
  });

  it('sends gateway events with the gateway token header', async () => {
    let requestedUrl = '';
    let method = '';
    let gatewayToken = '';
    let body = '';
    const input = {
      sessionId: 'session_1',
      eventType: 'relay.closed',
      payload: { watts: 1200 },
    };
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        gatewayToken = new Headers(init?.headers).get('x-gateway-token') ?? '';
        body = String(init?.body);
        return jsonResponse({
          id: 'event_1',
          gatewayId: 'gw_1',
          totemId: 'totem_1',
          sessionId: input.sessionId,
          eventType: input.eventType,
          payload: input.payload,
          createdAt: '2026-05-18T20:00:00Z',
        });
      },
    });

    const event = await client.createGatewayEvent('gw_1', 'kivo_gateway_secret', input);

    expect(requestedUrl).toBe('https://api.kivo.example/v1/gateways/gw_1/events');
    expect(method).toBe('POST');
    expect(gatewayToken).toBe('kivo_gateway_secret');
    expect(JSON.parse(body)).toEqual(input);
    expect(event.eventType).toBe(input.eventType);
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

  it('creates Studio solution intents through the real API route', async () => {
    let requestedUrl = '';
    let method = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        body = String(init?.body ?? '');
        return jsonResponse({
          id: 'intent_power_api',
          prompt: 'Quero cobrar por uma API de dados',
          surface: 'digital',
          interactionModel: 'M2M',
          recommendedGatewayMode: 'api_guard',
          createdAt: '2026-05-19T12:00:00Z',
        });
      },
    });

    const intent = await client.createStudioIntent({
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
    });

    expect(requestedUrl).toBe('https://api.kivo.example/v1/studio/intents');
    expect(method).toBe('POST');
    expect(JSON.parse(body)).toEqual({
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
    });
    expect(intent.recommendedGatewayMode).toBe('api_guard');
  });

  it('creates Studio flows with the full intent payload because intents are not persisted yet', async () => {
    let requestedUrl = '';
    let method = '';
    let body = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        body = String(init?.body ?? '');
        return jsonResponse({
          id: 'flow_power_api',
          intentId: 'intent_power_api',
          name: 'Quero cobrar por uma API de dados',
          surface: 'digital',
          interactionModel: 'M2M',
          gatewayMode: 'api_guard',
          resourceName: 'Protected API',
          price: '0.1000000',
          asset: 'USDC:testnet',
          accessRule: 'Require a valid x402 payment before releasing the protected resource.',
          status: 'needs_setup',
          createdAt: '2026-05-19T12:00:00Z',
          updatedAt: '2026-05-19T12:00:00Z',
        });
      },
    });

    const flow = await client.createStudioFlow({
      id: 'intent_power_api',
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
      interactionModel: 'M2M',
      recommendedGatewayMode: 'api_guard',
      createdAt: '2026-05-19T12:00:00Z',
    });

    expect(requestedUrl).toBe('https://api.kivo.example/v1/studio/flows');
    expect(method).toBe('POST');
    expect(JSON.parse(body)).toEqual({
      intentId: 'intent_power_api',
      prompt: 'Quero cobrar por uma API de dados',
      surface: 'digital',
      interactionModel: 'M2M',
      gatewayMode: 'api_guard',
    });
    expect(flow.name).toBe('Quero cobrar por uma API de dados');
  });

  it('starts validation runs without returning fabricated success', async () => {
    let requestedUrl = '';
    let method = '';
    const client = createKivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher: async (inputUrl, init) => {
        requestedUrl = String(inputUrl);
        method = init?.method ?? 'GET';
        return jsonResponse({
          id: 'val_1',
          flowId: 'flow_1',
          status: 'needs_connection',
          steps: [
            {
              id: 'gateway',
              label: 'Gateway',
              status: 'needs_connection',
              message: 'Conecte um Gateway antes de validar',
            },
          ],
          createdAt: '2026-05-19T12:00:00Z',
          updatedAt: '2026-05-19T12:00:00Z',
        });
      },
    });

    const validation = await client.startStudioValidation('flow_1');

    expect(requestedUrl).toBe('https://api.kivo.example/v1/studio/flows/flow_1/validation-runs');
    expect(method).toBe('POST');
    expect(validation.status).toBe('needs_connection');
    expect(validation.status).not.toBe('passed');
  });
});

const jsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
