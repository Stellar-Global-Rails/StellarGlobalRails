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
});
