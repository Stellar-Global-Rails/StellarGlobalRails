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
});
