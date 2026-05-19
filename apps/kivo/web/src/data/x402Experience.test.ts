import { describe, expect, it } from 'vitest';
import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';
import { formatX402AssetLabel, getX402CheckoutState, previewPublicKey, x402CheckoutResources } from './x402Experience';

const challenge: X402Challenge = {
  status: 402,
  resource: '/api/x402/data',
  scheme: 'stellar',
  network: 'testnet',
  payTo: 'GDESTINATIONTESTNETPUBLICKEY0000000000000000000000000000',
  amount: '0.0500000',
  asset: 'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
  maxTimeout: 300,
  nonce: 'nonce_real',
  requiredHeader: 'scheme=stellar,network=testnet,payTo=GDESTINATION,amount=0.0500000,asset=USDC,nonce=nonce_real',
};

const paid: X402PaidResponse = {
  status: 200,
  paymentHeader: 'X-PAYMENT.real.header',
  stellarHash: 'hash_real',
  stellarLedger: 123456,
  data: { unlocked: true },
};

const unlocked: X402UnlockedResponse = {
  unlocked: true,
  timestamp: '2026-05-17T12:00:00Z',
};

describe('x402Experience', () => {
  it('frames checkout resources as end-user purchases settled on Etherfuse and Stellar testnet', () => {
    expect(x402CheckoutResources).toHaveLength(3);
    expect(x402CheckoutResources[0]).toMatchObject({
      label: 'Sessao de recarga EV',
      customer: 'Motorista',
      settlementRail: 'Etherfuse testnet + Stellar testnet',
    });
    expect(x402CheckoutResources.every((resource) => resource.resource.startsWith('/api/x402/data'))).toBe(true);
  });

  it('moves the checkout state from blocked to priced, paid, and unlocked without fake success', () => {
    expect(getX402CheckoutState({}).primaryStatus).toBe('bloqueado');

    const priced = getX402CheckoutState({ challenge });
    expect(priced.primaryStatus).toBe('aguardando pagamento');
    expect(priced.summary).toContain('0.0500000 USDC');
    expect(priced.steps.map((step) => step.status)).toEqual(['complete', 'current', 'waiting']);

    const submitted = getX402CheckoutState({ challenge, paid });
    expect(submitted.primaryStatus).toBe('pagamento enviado');
    expect(submitted.steps.map((step) => step.status)).toEqual(['complete', 'complete', 'current']);

    const finished = getX402CheckoutState({ challenge, paid, unlocked });
    expect(finished.primaryStatus).toBe('liberado');
    expect(finished.steps.every((step) => step.status === 'complete')).toBe(true);
  });

  it('keeps payment instructions readable without exposing full issuer or wallet keys first', () => {
    expect(formatX402AssetLabel(challenge.asset)).toEqual({
      code: 'USDC',
      issuerPreview: 'GBBD47...LFLA5',
      label: 'USDC na Stellar testnet',
    });
    expect(previewPublicKey(challenge.payTo)).toBe('GDESTI...0000');
  });
});
