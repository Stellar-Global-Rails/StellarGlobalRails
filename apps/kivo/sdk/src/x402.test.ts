import { describe, expect, it } from 'vitest';
import { createPaymentHeader } from './x402';

describe('createPaymentHeader', () => {
  it('uses the server-issued X-PAYMENT proof instead of fabricating one from txXDR', () => {
    const header = createPaymentHeader({ paymentHeader: 'edge_confirmed_x402_header' });

    expect(header).toBe('edge_confirmed_x402_header');
    expect(header).not.toContain('AAAA_REAL_XDR');
    expect(header).not.toContain('SBOY');
    expect(header).not.toContain('SECRET');
  });
});
