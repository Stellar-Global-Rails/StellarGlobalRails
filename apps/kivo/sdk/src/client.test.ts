import { describe, expect, it, vi } from 'vitest';
import { KivoClient } from './client';

describe('KivoClient', () => {
  it('gets an x402 challenge for an encoded resource', async () => {
    const fetcher = vi.fn(async () => new Response(JSON.stringify({ nonce: 'nonce_123' })));
    const client = new KivoClient({
      baseUrl: 'https://api.kivo.example/',
      fetcher,
    });

    const challenge = await client.getX402Challenge('/paid/resource');

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.kivo.example/v1/x402/challenge?resource=%2Fpaid%2Fresource',
      expect.objectContaining({ method: 'GET' }),
    );
    expect(challenge.nonce).toBe('nonce_123');
  });

  it('accepts an empty successful gateway heartbeat response', async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 204 }));
    const client = new KivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher,
    });

    await expect(client.sendGatewayHeartbeat('gateway_1', 'gateway_token_1')).resolves.toBeUndefined();

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.kivo.example/v1/gateways/gateway_1/heartbeat',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('submits signed XDR and uses the returned payment header to unlock x402 resources', async () => {
    const fetcher = vi.fn(async (inputUrl: RequestInfo | URL, init?: RequestInit) => {
      const url = String(inputUrl);
      if (url.endsWith('/v1/x402/pay')) {
        return new Response(JSON.stringify({
          status: 200,
          paymentHeader: 'edge_confirmed_x402_header',
          stellarHash: 'abc123',
          stellarLedger: 12345,
          data: { unlocked: true },
        }));
      }
      if (url.endsWith('/paid/resource')) {
        return new Response(JSON.stringify({ unlocked: true }));
      }
      return new Response(null, { status: 404 });
    });
    const client = new KivoClient({
      baseUrl: 'https://api.kivo.example',
      fetcher,
    });

    const paid = await client.payX402Challenge('nonce_1', 'AAAA_SIGNED_XDR');
    const unlocked = await client.unlockX402Resource('/paid/resource', paid.paymentHeader);

    expect(fetcher).toHaveBeenCalledWith(
      'https://api.kivo.example/v1/x402/pay',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ nonce: 'nonce_1', txXDR: 'AAAA_SIGNED_XDR' }),
      }),
    );
    expect(fetcher).toHaveBeenCalledWith(
      'https://api.kivo.example/paid/resource',
      expect.objectContaining({
        method: 'GET',
        headers: expect.any(Headers),
      }),
    );
    const unlockCall = fetcher.mock.calls.find(([url]) => String(url).endsWith('/paid/resource'));
    expect(new Headers(unlockCall?.[1]?.headers).get('X-PAYMENT')).toBe('edge_confirmed_x402_header');
    expect(unlocked).toEqual({ unlocked: true });
  });
});
