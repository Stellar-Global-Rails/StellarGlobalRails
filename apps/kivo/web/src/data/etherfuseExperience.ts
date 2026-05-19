import type {
  EtherfuseAsset,
  EtherfuseAssetsResponse,
  EtherfuseOnboardingInput,
  EtherfuseOrderInput,
  EtherfuseQuoteInput,
} from '@/types/kivo';

export const DEFAULT_ETHERFUSE_ANCHOR_WALLET =
  (import.meta.env.VITE_KIVO_ANCHOR_WALLET as string | undefined) ??
  'GCZ7N7BY3VI75OR5WWUXMGRYDSLUV3NUNRJGXRMG47DXKR5MVF2U2NWC';

export const DEFAULT_ETHERFUSE_CUSTOMER_ID =
  import.meta.env.VITE_KIVO_ETHERFUSE_CUSTOMER_ID as string | undefined;

export const DEFAULT_ETHERFUSE_BANK_ACCOUNT_ID =
  import.meta.env.VITE_KIVO_ETHERFUSE_BANK_ACCOUNT_ID as string | undefined;

export const DEFAULT_ETHERFUSE_TARGET_ASSET =
  (import.meta.env.VITE_KIVO_ETHERFUSE_TARGET_ASSET as string | undefined) ??
  'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export const buildEtherfuseQuotePayload = ({
  quoteId,
  customerId,
  sourceAmount,
  sourceAsset = 'MXN',
  targetAsset,
  walletAddress,
  partnerFeeBps = 0,
}: {
  quoteId: string;
  customerId: string;
  sourceAmount: string;
  sourceAsset?: string;
  targetAsset: string;
  walletAddress: string;
  partnerFeeBps?: number;
}): EtherfuseQuoteInput => ({
  quoteId,
  customerId,
  blockchain: 'stellar',
  quoteAssets: {
    type: 'onramp',
    sourceAsset,
    targetAsset,
  },
  sourceAmount,
  walletAddress,
  partnerFeeBps,
});

export const buildEtherfuseOnboardingPayload = ({
  customerId,
  bankAccountId,
  publicKey,
  email,
  displayName,
}: {
  customerId: string;
  bankAccountId: string;
  publicKey: string;
  email?: string;
  displayName?: string;
}): EtherfuseOnboardingInput => {
  const userInfo =
    email || displayName
      ? {
          ...(email ? { email } : {}),
          ...(displayName ? { displayName } : {}),
        }
      : undefined;

  return {
    customerId,
    bankAccountId,
    publicKey,
    blockchain: 'stellar',
    ...(userInfo ? { userInfo } : {}),
  };
};

export const buildEtherfuseOrderPayload = ({
  orderId,
  bankAccountId,
  publicKey,
  quoteId,
  memo = 'kivo-x402-payment',
}: {
  orderId: string;
  bankAccountId: string;
  publicKey: string;
  quoteId: string;
  memo?: string;
}): EtherfuseOrderInput => ({
  orderId,
  bankAccountId,
  publicKey,
  quoteId,
  memo,
});

export const extractEtherfuseId = (payload: Record<string, unknown> | null | undefined, keys: string[]): string | null => {
  if (!payload) {
    return null;
  }

  for (const key of keys) {
    const value = payload[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return null;
};

export const getEtherfuseAssets = (payload: EtherfuseAssetsResponse | null | undefined): EtherfuseAsset[] => {
  if (!payload) {
    return [];
  }
  if (Array.isArray(payload.assets)) {
    return payload.assets;
  }
  return [];
};

export const selectEtherfuseTargetAsset = ({
  assets,
  allowedAssets = [],
  fallbackAsset,
}: {
  assets: EtherfuseAsset[];
  allowedAssets?: string[];
  fallbackAsset: string;
}): string => {
  const allowedMatch = allowedAssets.find((allowedAsset) =>
    assets.some((asset) => asset.identifier === allowedAsset),
  );
  if (allowedMatch) {
    return allowedMatch;
  }

  const discoveredUsdc = assets.find((asset) => asset.symbol.toUpperCase() === 'USDC')?.identifier;
  if (discoveredUsdc) {
    return discoveredUsdc;
  }

  return allowedAssets[0] ?? assets[0]?.identifier ?? fallbackAsset;
};

export const previewEtherfuseJson = (payload: unknown): string => JSON.stringify(payload ?? {}, null, 2);

export const formatEtherfuseErrorMessage = (message: string): string => {
  const normalized = message.toLowerCase();
  const existingCustomerId = extractExistingEtherfuseCustomerId(message);
  if (existingCustomerId) {
    return `Esta wallet ja existe na Etherfuse com customerId ${existingCustomerId}. Mantive esse ID no formulario; gere uma nova URL de onboarding com ele ou conclua a URL ja emitida.`;
  }
  if (normalized.includes('proxy account not found')) {
    return 'Conclua o onboarding Etherfuse com a URL gerada antes de criar a order. Depois gere uma nova quote e tente novamente.';
  }
  if (normalized.includes('uuid parsing failed')) {
    return 'Customer ID e Bank Account ID precisam ser UUIDs gerados pelo Kivo ou retornados do onboarding Etherfuse.';
  }
  if (normalized.includes('forbidden')) {
    return 'A Etherfuse recusou a chamada. Verifique se a credencial do ambiente de teste tem permissao de ramp e se customerId, bankAccountId e wallet pertencem ao mesmo onboarding.';
  }
  return message || 'Nao foi possivel concluir a etapa Etherfuse.';
};

export const extractExistingEtherfuseCustomerId = (message: string): string | null => {
  const match = message.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
  return match?.[1] ?? null;
};

export interface EtherfuseOnboardingDraft {
  wallet: string;
  customerId: string;
  bankAccountId: string;
  onboardingUrl?: string;
}

const onboardingDraftKey = (wallet: string) => `kivo:etherfuse:onboarding:${wallet}`;

export const loadEtherfuseOnboardingDraft = (wallet: string): EtherfuseOnboardingDraft | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  const raw = localStorage.getItem(onboardingDraftKey(wallet));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as EtherfuseOnboardingDraft;
  } catch {
    return null;
  }
};

export const saveEtherfuseOnboardingDraft = (draft: EtherfuseOnboardingDraft): void => {
  if (typeof localStorage === 'undefined') {
    return;
  }
  localStorage.setItem(onboardingDraftKey(draft.wallet), JSON.stringify(draft));
};

export const createEtherfuseUUID = (): string => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (token) => {
    const random = Math.floor(Math.random() * 16);
    const value = token === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
};
