import { describe, expect, it } from 'vitest';
import { createPaymentHeader } from './x402';

describe('createPaymentHeader', () => {
  it('serializes the nonce and transaction XDR without private key material', () => {
    const header = createPaymentHeader({ nonce: 'nonce_1', txXDR: 'AAAA_REAL_XDR' });

    expect(header).toContain('nonce_1');
    expect(header).toContain('AAAA_REAL_XDR');
    expect(header).not.toContain('SBOY');
    expect(header).not.toContain('SECRET');
  });
});
