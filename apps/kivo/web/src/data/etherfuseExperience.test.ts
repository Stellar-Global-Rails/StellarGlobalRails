import { describe, expect, it } from 'vitest';
import {
  buildEtherfuseOnboardingPayload,
  buildEtherfuseOrderPayload,
  buildEtherfuseQuotePayload,
  extractEtherfuseId,
  extractExistingEtherfuseCustomerId,
  formatEtherfuseErrorMessage,
  previewEtherfuseJson,
  selectEtherfuseTargetAsset,
} from './etherfuseExperience';

describe('etherfuseExperience', () => {
  it('builds the hosted onboarding payload required before quotes', () => {
    expect(
      buildEtherfuseOnboardingPayload({
        customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
        bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
        publicKey: 'GDESTINATION',
        email: 'operator@kivo.example',
        displayName: 'Kivo Operator',
      }),
    ).toEqual({
      customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
      bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
      publicKey: 'GDESTINATION',
      blockchain: 'stellar',
      userInfo: {
        email: 'operator@kivo.example',
        displayName: 'Kivo Operator',
      },
    });
  });

  it('builds the documented Etherfuse Stellar onramp quote payload', () => {
    expect(
      buildEtherfuseQuotePayload({
        quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
        customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
        sourceAmount: '100',
        sourceAsset: 'MXN',
        targetAsset: 'USDC:GTEST',
        walletAddress: 'GDESTINATION',
      }),
    ).toEqual({
      quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
      customerId: '2a1d9134-e6d0-4b7e-bf88-00b79c25155b',
      blockchain: 'stellar',
      quoteAssets: {
        type: 'onramp',
        sourceAsset: 'MXN',
        targetAsset: 'USDC:GTEST',
      },
      sourceAmount: '100',
      walletAddress: 'GDESTINATION',
      partnerFeeBps: 0,
    });
  });

  it('builds the documented Etherfuse order payload and extracts provider ids', () => {
    const order = buildEtherfuseOrderPayload({
      orderId: 'ed14a9d7-f9be-4584-8f11-527d32ddab31',
      bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
      publicKey: 'GDESTINATION',
      quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
    });

    expect(order).toEqual({
      orderId: 'ed14a9d7-f9be-4584-8f11-527d32ddab31',
      bankAccountId: '80dd9b70-581f-4b43-b634-b4cfdd481d6d',
      publicKey: 'GDESTINATION',
      quoteId: '6edc1703-e8f6-47b1-a33a-ac776d01332a',
      memo: 'kivo-x402-payment',
    });
    expect(extractEtherfuseId({ orderId: order.orderId }, ['orderId', 'id'])).toBe(order.orderId);
    expect(extractEtherfuseId({ id: order.quoteId }, ['quoteId', 'id'])).toBe(order.quoteId);
  });

  it('formats provider responses as short auditable JSON previews', () => {
    const preview = previewEtherfuseJson({ status: 'created', nested: { amount: '100' } });

    expect(preview).toContain('"status": "created"');
    expect(preview).toContain('"amount": "100"');
  });

  it('turns provider onboarding errors into actionable operator guidance', () => {
    expect(formatEtherfuseErrorMessage('Proxy account not found')).toContain('Conclua o onboarding Etherfuse');
    expect(formatEtherfuseErrorMessage('Json deserialize error: UUID parsing failed')).toContain('UUID');
    expect(formatEtherfuseErrorMessage('Forbidden')).toContain('credencial');
    expect(extractExistingEtherfuseCustomerId('You have already added user with this address, see org: bc154aec-46bb-4807-8384-8c995fa44783')).toBe('bc154aec-46bb-4807-8384-8c995fa44783');
  });

  it('prefers the Kivo allowlisted USDC asset over the first Etherfuse asset', () => {
    const target = selectEtherfuseTargetAsset({
      assets: [
        { symbol: 'CETES', identifier: 'CETES:GISSUER', name: 'CETES', currency: 'mxn', balance: null },
        { symbol: 'USDC', identifier: 'USDC:GUSDC', name: 'USDC', currency: 'usd', balance: '20.0000000' },
      ],
      allowedAssets: ['USDC:GUSDC'],
      fallbackAsset: 'USDC:GFALLBACK',
    });

    expect(target).toBe('USDC:GUSDC');
  });
});
