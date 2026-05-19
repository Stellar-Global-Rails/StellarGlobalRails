import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';

export interface X402CheckoutResource {
  label: string;
  customer: string;
  operator: string;
  resource: string;
  detail: string;
  outcome: string;
  settlementRail: string;
  icon: string;
}

export type X402StepStatus = 'waiting' | 'current' | 'complete';

export interface X402CheckoutStep {
  label: string;
  title: string;
  description: string;
  icon: string;
  status: X402StepStatus;
}

export interface X402CheckoutState {
  primaryStatus: 'bloqueado' | 'aguardando pagamento' | 'pagamento enviado' | 'liberado';
  tone: 'neutral' | 'pending' | 'processing' | 'confirmed';
  summary: string;
  steps: X402CheckoutStep[];
}

export const x402CheckoutResources: X402CheckoutResource[] = [
  {
    label: 'Sessao de recarga EV',
    customer: 'Motorista',
    operator: 'Operador de carregador',
    resource: '/api/x402/data',
    detail: 'Libera o recibo tecnico de uma sessao de recarga depois do pagamento.',
    outcome: 'Acesso ao recibo, kWh consumidos e prova de liquidacao.',
    settlementRail: 'Etherfuse testnet + Stellar testnet',
    icon: 'solar:electric-refueling-bold-duotone',
  },
  {
    label: 'Pacote premium IoT',
    customer: 'Comprador de dados',
    operator: 'Marketplace de sensores',
    resource: '/api/x402/data?dataset=iot',
    detail: 'Libera uma amostra premium de sensores para integradores ou agentes.',
    outcome: 'Dataset assinado, timestamp e evento de entrega.',
    settlementRail: 'Etherfuse testnet + Stellar testnet',
    icon: 'solar:server-square-cloud-bold-duotone',
  },
  {
    label: 'Chamada de agente',
    customer: 'Agente ou app cliente',
    operator: 'API paga por uso',
    resource: '/api/x402/data?tool=agent',
    detail: 'Libera uma chamada protegida por x402 para um agente continuar a tarefa.',
    outcome: 'Resposta premium, payment header e hash Stellar.',
    settlementRail: 'Etherfuse testnet + Stellar testnet',
    icon: 'solar:cpu-bolt-bold-duotone',
  },
];

export const formatX402AssetLabel = (asset: string) => {
  const [code, issuer] = asset.split(':');

  return {
    code: code || asset,
    issuerPreview: issuer ? `${issuer.slice(0, 6)}...${issuer.slice(-5)}` : 'native',
    label: `${code || asset} na Stellar testnet`,
  };
};

export const previewPublicKey = (publicKey: string) => {
  if (publicKey.length <= 12) {
    return publicKey;
  }
  return `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`;
};

export const getX402CheckoutState = ({
  challenge,
  paid,
  unlocked,
}: {
  challenge?: X402Challenge | null;
  paid?: X402PaidResponse | null;
  unlocked?: X402UnlockedResponse | null;
}): X402CheckoutState => {
  const asset = challenge ? formatX402AssetLabel(challenge.asset) : null;
  const paymentSummary = challenge
    ? `${challenge.amount} ${asset?.code} para ${previewPublicKey(challenge.payTo)}. Expira em ${challenge.maxTimeout}s.`
    : 'O recurso ainda esta protegido. Solicite o preco para receber o challenge 402.';

  if (unlocked) {
    return {
      primaryStatus: 'liberado',
      tone: 'confirmed',
      summary: challenge ? `Acesso liberado apos pagamento de ${challenge.amount} ${asset?.code}.` : 'Acesso liberado.',
      steps: buildSteps(['complete', 'complete', 'complete']),
    };
  }

  if (paid) {
    return {
      primaryStatus: 'pagamento enviado',
      tone: 'processing',
      summary: `Pagamento aceito na Stellar ledger ${paid.stellarLedger}. Recurso pronto para retry com X-PAYMENT.`,
      steps: buildSteps(['complete', 'complete', 'current']),
    };
  }

  if (challenge) {
    return {
      primaryStatus: 'aguardando pagamento',
      tone: 'pending',
      summary: paymentSummary,
      steps: buildSteps(['complete', 'current', 'waiting']),
    };
  }

  return {
    primaryStatus: 'bloqueado',
    tone: 'neutral',
    summary: paymentSummary,
    steps: buildSteps(['current', 'waiting', 'waiting']),
  };
};

const buildSteps = (statuses: X402StepStatus[]): X402CheckoutStep[] => [
  {
    label: 'Preco',
    title: 'Challenge 402',
    description: 'O Kivo retorna valor, ativo, destino e nonce para este recurso.',
    icon: 'solar:tag-price-bold-duotone',
    status: statuses[0],
  },
  {
    label: 'Pagamento',
    title: 'Assinatura Stellar',
    description: 'A carteira ou SDK assina a transacao USDC e envia o XDR ao Kivo.',
    icon: 'solar:wallet-money-bold-duotone',
    status: statuses[1],
  },
  {
    label: 'Acesso',
    title: 'Retry pago',
    description: 'O cliente usa X-PAYMENT para repetir a chamada e receber o recurso.',
    icon: 'solar:lock-keyhole-unlocked-bold-duotone',
    status: statuses[2],
  },
];
