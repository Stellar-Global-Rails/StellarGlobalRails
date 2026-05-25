import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { areDevControlsEnabled, formatProviderModeLabel } from '@/config/productMode';
import {
  buildEtherfuseOnboardingPayload,
  buildEtherfuseOrderPayload,
  buildEtherfuseQuotePayload,
  createEtherfuseUUID,
  DEFAULT_ETHERFUSE_ANCHOR_WALLET,
  DEFAULT_ETHERFUSE_BANK_ACCOUNT_ID,
  DEFAULT_ETHERFUSE_CUSTOMER_ID,
  DEFAULT_ETHERFUSE_TARGET_ASSET,
  extractExistingEtherfuseCustomerId,
  extractEtherfuseId,
  formatEtherfuseErrorMessage,
  getEtherfuseAssets,
  loadEtherfuseOnboardingDraft,
  previewEtherfuseJson,
  saveEtherfuseOnboardingDraft,
  selectEtherfuseTargetAsset,
} from '@/data/etherfuseExperience';
import {
  formatX402AssetLabel,
  getX402CheckoutState,
  previewPublicKey,
  x402CheckoutResources,
} from '@/data/x402Experience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type {
  EtherfuseAssetsResponse,
  EtherfuseOnboardingResponse,
  EtherfuseOrderResponse,
  EtherfuseQuoteResponse,
  PowerSession,
  X402Challenge,
  X402PaidResponse,
  X402UnlockedResponse,
} from '@/types/kivo';

type AnchorStep = 'onboarding' | 'assets' | 'quote' | 'order' | 'fiat';

const shortAsset = (asset: string) => {
  const [code, issuer] = asset.split(':');
  if (!issuer) {
    return asset;
  }
  return `${code}:${issuer.slice(0, 6)}...${issuer.slice(-5)}`;
};

export default function CheckoutPage() {
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const powerTotems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const [selectedResource, setSelectedResource] = useState(x402CheckoutResources[0]);
  const [selectedTotemId, setSelectedTotemId] = useState('');
  const [powerSession, setPowerSession] = useState<PowerSession | null>(null);
  const [authorizedPowerSession, setAuthorizedPowerSession] = useState<PowerSession | null>(null);
  const [txXDR, setTxXDR] = useState('');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [paid, setPaid] = useState<X402PaidResponse | null>(null);
  const [unlocked, setUnlocked] = useState<X402UnlockedResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [anchorWallet, setAnchorWallet] = useState(DEFAULT_ETHERFUSE_ANCHOR_WALLET);
  const [customerId, setCustomerId] = useState(() => DEFAULT_ETHERFUSE_CUSTOMER_ID ?? loadEtherfuseOnboardingDraft(DEFAULT_ETHERFUSE_ANCHOR_WALLET)?.customerId ?? createEtherfuseUUID());
  const [bankAccountId, setBankAccountId] = useState(() => DEFAULT_ETHERFUSE_BANK_ACCOUNT_ID ?? loadEtherfuseOnboardingDraft(DEFAULT_ETHERFUSE_ANCHOR_WALLET)?.bankAccountId ?? createEtherfuseUUID());
  const [sourceAmount, setSourceAmount] = useState('100');
  const [onboarding, setOnboarding] = useState<EtherfuseOnboardingResponse | null>(() => {
    const draft = loadEtherfuseOnboardingDraft(DEFAULT_ETHERFUSE_ANCHOR_WALLET);
    return draft?.onboardingUrl ? { presigned_url: draft.onboardingUrl } : null;
  });
  const [anchorAssets, setAnchorAssets] = useState<EtherfuseAssetsResponse | null>(null);
  const [anchorQuote, setAnchorQuote] = useState<EtherfuseQuoteResponse | null>(null);
  const [anchorOrder, setAnchorOrder] = useState<EtherfuseOrderResponse | null>(null);
  const [anchorLoading, setAnchorLoading] = useState<AnchorStep | null>(null);
  const [anchorError, setAnchorError] = useState('');

  const checkoutState = getX402CheckoutState({ challenge, paid, unlocked });
  const selectedPowerTotem = useMemo(
    () =>
      (powerTotems.data ?? []).find((totem) => totem.id === selectedTotemId) ??
      powerTotems.data?.[0] ??
      null,
    [powerTotems.data, selectedTotemId],
  );
  const asset = challenge ? formatX402AssetLabel(challenge.asset) : null;
  const fiatCurrency = etherfuse.data?.default_fiat ?? 'MXN';
  const assets = getEtherfuseAssets(anchorAssets);
  const targetAsset = selectEtherfuseTargetAsset({
    assets,
    allowedAssets: etherfuse.data?.allowed_assets,
    fallbackAsset: DEFAULT_ETHERFUSE_TARGET_ASSET,
  });
  const quoteId = extractEtherfuseId(anchorQuote, ['quoteId', 'id']);
  const orderId = extractEtherfuseId(anchorOrder, ['orderId', 'id']);
  const onboardingUrl = onboarding?.presigned_url ?? onboarding?.presignedUrl ?? onboarding?.url;
  const anchorPreview = anchorOrder ?? anchorQuote ?? anchorAssets ?? onboarding ?? etherfuse.data;
  const providerModeLabel = formatProviderModeLabel(etherfuse.data?.mode);
  const showDevControls = areDevControlsEnabled();

  const resetPaymentState = () => {
    setChallenge(null);
    setPaid(null);
    setUnlocked(null);
    setTxXDR('');
    setError('');
    setPowerSession(null);
    setAuthorizedPowerSession(null);
  };

  const runAnchorStep = async <T,>(step: AnchorStep, action: () => Promise<T>, onSuccess: (value: T) => void) => {
    setAnchorLoading(step);
    setAnchorError('');
    try {
      onSuccess(await action());
    } catch (err) {
      setAnchorError(formatEtherfuseErrorMessage(err instanceof Error ? err.message : 'Nao foi possivel concluir a etapa Etherfuse.'));
    } finally {
      setAnchorLoading(null);
    }
  };

  const createOnboardingUrl = () => {
    const wallet = anchorWallet.trim();
    if (!wallet || !customerId.trim() || !bankAccountId.trim()) {
      setAnchorError('Wallet, customerId e bankAccountId sao obrigatorios para criar onboarding.');
      return;
    }

    const payload = buildEtherfuseOnboardingPayload({
      customerId: customerId.trim(),
      bankAccountId: bankAccountId.trim(),
      publicKey: wallet,
      email: 'operator@kivo.example',
      displayName: 'Kivo Operator',
    });

    setAnchorLoading('onboarding');
    setAnchorError('');
    kivoClient
      .createEtherfuseOnboardingUrl(payload)
      .then((response) => {
        const url = response.presigned_url ?? response.presignedUrl ?? response.url;
        setOnboarding(response);
        saveEtherfuseOnboardingDraft({
          wallet,
          customerId: customerId.trim(),
          bankAccountId: bankAccountId.trim(),
          ...(url ? { onboardingUrl: url } : {}),
        });
        setAnchorQuote(null);
        setAnchorOrder(null);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : 'Nao foi possivel concluir a etapa Etherfuse.';
        const existingCustomerId = extractExistingEtherfuseCustomerId(message);
        if (existingCustomerId) {
          setCustomerId(existingCustomerId);
          saveEtherfuseOnboardingDraft({
            wallet,
            customerId: existingCustomerId,
            bankAccountId: bankAccountId.trim(),
          });
        }
        setAnchorError(formatEtherfuseErrorMessage(message));
      })
      .finally(() => setAnchorLoading(null));
  };

  const discoverEtherfuseAssets = () => {
    const wallet = anchorWallet.trim();
    if (!wallet) {
      setAnchorError('Informe uma Stellar public key para consultar assets na Etherfuse.');
      return;
    }

    void runAnchorStep('assets', () => kivoClient.listEtherfuseAssets(wallet, fiatCurrency), (response) => {
      setAnchorAssets(response);
      setAnchorQuote(null);
      setAnchorOrder(null);
    });
  };

  const createQuote = () => {
    const wallet = anchorWallet.trim();
    if (!wallet || !customerId.trim() || !sourceAmount.trim()) {
      setAnchorError('Wallet, customerId e valor fiat sao obrigatorios para criar quote.');
      return;
    }

    const payload = buildEtherfuseQuotePayload({
      quoteId: createEtherfuseUUID(),
      customerId: customerId.trim(),
      sourceAmount: sourceAmount.trim(),
      sourceAsset: fiatCurrency,
      targetAsset,
      walletAddress: wallet,
    });

    void runAnchorStep('quote', () => kivoClient.createEtherfuseQuote(payload), (response) => {
      setAnchorQuote(response);
      setAnchorOrder(null);
    });
  };

  const createOrder = () => {
    if (!quoteId) {
      setAnchorError('Crie uma quote Etherfuse antes de gerar a order.');
      return;
    }
    if (!bankAccountId.trim() || !anchorWallet.trim()) {
      setAnchorError('bankAccountId e publicKey sao obrigatorios para criar a order.');
      return;
    }

    const payload = buildEtherfuseOrderPayload({
      orderId: createEtherfuseUUID(),
      bankAccountId: bankAccountId.trim(),
      publicKey: anchorWallet.trim(),
      quoteId,
    });

    void runAnchorStep('order', () => kivoClient.createEtherfuseOrder(payload), setAnchorOrder);
  };

  const signalFiatReceived = () => {
    if (!orderId) {
      setAnchorError('Crie uma order Etherfuse antes de confirmar recebimento.');
      return;
    }

    void runAnchorStep('fiat', () => kivoClient.signalEtherfuseFiatReceived(orderId), setAnchorOrder);
  };

  const anchorSteps: Array<{
    key: AnchorStep;
    title: string;
    icon: string;
    detail: string;
    action: () => void;
    disabled: boolean;
  }> = [
    {
      key: 'onboarding',
      title: '0. Onboarding',
      icon: 'solar:user-check-bold-duotone',
      detail: onboardingUrl ? 'URL gerada para KYC/banco' : 'Vincula customer, banco e wallet',
      action: createOnboardingUrl,
      disabled: false,
    },
    {
      key: 'assets',
      title: '1. Assets',
      icon: 'solar:database-bold-duotone',
      detail: assets.length ? `${assets.length} asset(s) retornados` : 'Descobre USDC/rails disponiveis',
      action: discoverEtherfuseAssets,
      disabled: false,
    },
    {
      key: 'quote',
      title: '2. Quote',
      icon: 'solar:tag-price-bold-duotone',
      detail: quoteId ? previewPublicKey(quoteId) : `${sourceAmount || '100'} ${fiatCurrency} -> USDC`,
      action: createQuote,
      disabled: false,
    },
    {
      key: 'order',
      title: '3. Order',
      icon: 'solar:bill-list-bold-duotone',
      detail: orderId ? previewPublicKey(orderId) : 'Converte quote em ordem Etherfuse',
      action: createOrder,
      disabled: !quoteId,
    },
  ];

  if (showDevControls) {
    anchorSteps.push({
      key: 'fiat',
      title: '4. Confirmar recebimento',
      icon: 'solar:card-recive-bold-duotone',
      detail: anchorOrder?.status ? String(anchorOrder.status) : 'Registra recebimento controlado',
      action: signalFiatReceived,
      disabled: !orderId,
    });
  }

  const requestPrice = async () => {
    setLoading(true);
    setError('');
    setPaid(null);
    setUnlocked(null);
    try {
      const nextChallenge = await kivoClient.getX402Challenge(selectedResource.resource);
      setChallenge(nextChallenge);
      if (!anchorWallet.trim()) {
        setAnchorWallet(nextChallenge.payTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel iniciar o checkout.');
    } finally {
      setLoading(false);
    }
  };

  const startPowerTotemCheckout = async () => {
    if (!selectedPowerTotem) {
      setError('Crie ou selecione uma estacao EV Charge antes de iniciar o checkout.');
      return;
    }
    setLoading(true);
    setError('');
    setPaid(null);
    setUnlocked(null);
    setAuthorizedPowerSession(null);
    setTxXDR('');
    try {
      const session = await kivoClient.createPowerSession(selectedPowerTotem.id);
      const checkout = await kivoClient.startPowerSessionCheckout(session.id);
      setPowerSession(checkout.session);
      setChallenge(checkout.challenge);
      if (!anchorWallet.trim()) {
        setAnchorWallet(checkout.challenge.payTo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel iniciar o checkout da estacao EV Charge.');
    } finally {
      setLoading(false);
    }
  };

  const payAndUnlock = async () => {
    if (!challenge) return;
    setLoading(true);
    setError('');
    try {
      const paidResponse = await kivoClient.payX402Challenge(challenge.nonce, txXDR);
      setPaid(paidResponse);
      setUnlocked(await kivoClient.unlockX402Resource(challenge.resource, paidResponse.paymentHeader));
      if (powerSession) {
        const authorized = await kivoClient.authorizePowerSession(powerSession.id);
        setPowerSession(authorized.session);
        setAuthorizedPowerSession(authorized.session);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pagamento nao confirmado pela API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Checkout real"
        title="Testar checkout do flow"
        icon="solar:card-transfer-bold-duotone"
        description="Valide funding, challenge x402, assinatura Stellar e liberacao do recurso antes de publicar para clientes."
        action={<Link to="/x402" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Regras x402</Link>}
      />

      <Card className="min-w-0 overflow-hidden border-emerald-500/15">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={etherfuse.data?.configured ? 'ready' : 'warning'}>{etherfuse.data?.configured ? 'Etherfuse configurada' : 'aguardando API key'}</Badge>
              <Badge tone="neutral">{etherfuse.data?.network ?? 'testnet'}</Badge>
              <Badge tone="neutral">{fiatCurrency} onramp</Badge>
            </div>
            <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">Funding via Etherfuse</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">
              Este fluxo usa a integracao real no backend. A chave da Etherfuse fica no servidor; se o provedor negar cadastro, conta bancaria ou cotacao, o erro aparece aqui sem marcar sucesso artificial.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/25 p-4 xl:w-72">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Wallet destino</p>
            <p className="mt-2 break-all font-mono text-xs text-emerald-100">{anchorWallet}</p>
              <p className="mt-2 text-xs text-neutral-500">A Etherfuse abastece esta wallet; o x402 liquida na Stellar.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Stellar public key</label>
            <input
              value={anchorWallet}
              onChange={(event) => setAnchorWallet(event.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Customer ID</label>
                <input
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-xs text-neutral-200 outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Bank account ID</label>
                <input
                  value={bankAccountId}
                  onChange={(event) => setBankAccountId(event.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-xs text-neutral-200 outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-[0.45fr_0.55fr]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Valor fiat</label>
                <input
                  value={sourceAmount}
                  onChange={(event) => setSourceAmount(event.target.value)}
                  inputMode="decimal"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm font-bold text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Target asset</label>
                <p className="mt-2 rounded-xl border border-white/10 bg-black/40 px-3 py-3 font-mono text-xs text-neutral-200">{shortAsset(targetAsset)}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {anchorSteps.map((step) => (
              <button
                key={step.key}
                type="button"
                onClick={step.action}
                disabled={step.disabled || anchorLoading !== null}
                className="rounded-2xl border border-white/5 bg-black/25 p-4 text-left transition-colors hover:border-emerald-500/25 hover:bg-emerald-500/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <Icon icon={step.icon} className="text-2xl text-emerald-300" />
                  {anchorLoading === step.key ? <Icon icon="solar:refresh-circle-bold" className="text-xl text-amber-300" /> : <Icon icon="solar:round-arrow-right-up-bold" className="text-xl text-neutral-500" />}
                </div>
                <p className="mt-3 text-sm font-bold text-white">{anchorLoading === step.key ? 'Chamando...' : step.title}</p>
                <p className="mt-1 break-words text-xs leading-5 text-neutral-500">{step.detail}</p>
              </button>
            ))}
          </div>
        </div>

        {anchorError && <p className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{anchorError}</p>}

        {onboardingUrl && (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Onboarding Etherfuse</p>
              <p className="mt-1 break-all text-xs text-emerald-100">{onboardingUrl}</p>
              <p className="mt-2 text-xs text-neutral-500">Abra esta URL, conclua KYC/conta bancaria valida e depois rode Quote e Order com os mesmos IDs.</p>
            </div>
            <a href={onboardingUrl} target="_blank" rel="noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              Abrir onboarding
              <Icon icon="solar:arrow-right-up-bold" />
            </a>
          </div>
        )}

        <div className="mt-5 grid gap-4 xl:grid-cols-[0.45fr_0.55fr]">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Provider</p>
              <p className="mt-2 text-sm font-bold text-white">{providerModeLabel}</p>
              <p className="mt-1 text-xs text-neutral-500">{etherfuse.loading ? 'checando...' : etherfuse.error ?? 'via backend Kivo'}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Quote</p>
              <p className="mt-2 text-sm font-bold text-white">{quoteId ? 'criada' : 'pendente'}</p>
              <p className="mt-1 break-all text-xs text-neutral-500">{quoteId ?? 'sem quoteId ainda'}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order</p>
              <p className="mt-2 text-sm font-bold text-white">{anchorOrder?.status ? String(anchorOrder.status) : 'pendente'}</p>
              <p className="mt-1 break-all text-xs text-neutral-500">{orderId ?? 'sem orderId ainda'}</p>
            </div>
          </div>
          <details className="rounded-2xl border border-white/5 bg-black/25 p-4">
            <summary className="cursor-pointer text-sm font-bold text-white">Ver dados da integracao</summary>
            <pre className="mt-4 max-h-52 overflow-auto whitespace-pre-wrap break-all rounded-2xl border border-white/5 bg-black/35 p-4 text-xs text-emerald-100">
              {previewEtherfuseJson(anchorPreview)}
            </pre>
          </details>
        </div>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="min-w-0">
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">EV Charge session</p>
                <h2 className="mt-2 font-bricolage text-xl font-bold text-white">Checkout para recarga EV</h2>
              </div>
              <Badge tone={authorizedPowerSession ? 'ready' : powerSession ? powerSession.status : 'neutral'}>
                {authorizedPowerSession ? 'autorizada' : powerSession ? sessionStatusLabel(powerSession.status) : 'sem sessao'}
              </Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              Este pagamento libera uma sessao de recarga. Depois da confirmacao, o Gateway recebe uma autorizacao curta para sinalizar o EVSE, OCPP wallbox ou controlador local.
            </p>
            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Totem</span>
                <select
                  value={selectedPowerTotem?.id ?? ''}
                  onChange={(event) => {
                    setSelectedTotemId(event.target.value);
                    resetPaymentState();
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
                  disabled={powerTotems.loading || (powerTotems.data ?? []).length === 0}
                >
                  {(powerTotems.data ?? []).map((totem) => (
                    <option key={totem.id} value={totem.id}>
                      {totem.name} - {totem.price}/{totem.unit}
                    </option>
                  ))}
                </select>
              </label>
              {selectedPowerTotem && (
                <div className="rounded-xl border border-white/5 bg-black/25 p-3">
                  <p className="break-all font-mono text-xs text-emerald-200">{selectedPowerTotem.resource}</p>
                  <p className="mt-1 text-xs text-neutral-500">{selectedPowerTotem.sessionDurationSeconds}s por sessao</p>
                </div>
              )}
              {powerTotems.error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">{powerTotems.error}</p>}
              {!powerTotems.loading && !selectedPowerTotem && (
                <Link to="/library/power-totem" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
                  <Icon icon="solar:add-circle-bold-duotone" />
                  Configurar EV Charge
                </Link>
              )}
              <button
                type="button"
                onClick={startPowerTotemCheckout}
                disabled={loading || !selectedPowerTotem}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon="solar:bolt-circle-bold-duotone" />
                {loading && selectedPowerTotem ? 'Preparando...' : 'Criar sessao e iniciar x402'}
              </button>
              {authorizedPowerSession && (
                <Link to={`/totems/${authorizedPowerSession.totemId}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/15">
                  <Icon icon="solar:clipboard-list-bold-duotone" />
                  Ver autorizacao no totem
                </Link>
              )}
            </div>
          </div>

          <div className="mt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Catalogo pago</p>
              <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">O que o usuario quer acessar?</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Cada item abaixo e um recurso protegido por HTTP 402 e liquidado pelo mesmo trilho Etherfuse/Stellar.</p>
            </div>
            <Badge tone={checkoutState.tone}>{checkoutState.primaryStatus}</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {x402CheckoutResources.map((resource) => (
              <button
                key={resource.label}
                type="button"
                onClick={() => {
                  setSelectedResource(resource);
                  resetPaymentState();
                }}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedResource.label === resource.label ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/25 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-emerald-300">
                    <Icon icon={resource.icon} className="text-2xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-white">{resource.label}</h3>
                      {selectedResource.label === resource.label && <Icon icon="solar:check-circle-bold" className="text-xl text-emerald-400" />}
                    </div>
                    <p className="mt-1 text-xs text-neutral-500">{resource.customer} para {resource.operator}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-5 text-neutral-400">{resource.detail}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge tone="neutral">{resource.settlementRail}</Badge>
                  <Badge tone="neutral">{resource.resource}</Badge>
                </div>
              </button>
            ))}
          </div>

          <button type="button" onClick={requestPrice} disabled={loading} className="mt-5 w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            {loading ? 'Solicitando...' : challenge ? 'Atualizar preco' : 'Ver preco e pagar'}
          </button>
          </div>
        </Card>

        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Recurso protegido</p>
              <h2 className="mt-2 font-bricolage text-3xl font-bold text-white">{powerSession ? 'Sessao Kivo EV Charge' : selectedResource.label}</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                {powerSession
                  ? 'Pagamento x402 vinculado a uma sessao de recarga. Quando confirmado, a sessao fica pronta para autorizacao do gateway.'
                  : selectedResource.outcome}
              </p>
            </div>
            <Badge tone={checkoutState.tone}>{checkoutState.primaryStatus}</Badge>
          </div>

          <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-4">
            <p className="text-sm leading-6 text-neutral-300">{checkoutState.summary}</p>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {checkoutState.steps.map((step) => (
              <div key={step.label} className={`rounded-2xl border p-4 ${
                step.status === 'complete'
                  ? 'border-emerald-500/25 bg-emerald-500/10'
                  : step.status === 'current'
                    ? 'border-amber-500/25 bg-amber-500/10'
                    : 'border-white/5 bg-black/25'
              }`}
              >
                <Icon icon={step.icon} className={`text-2xl ${step.status === 'complete' ? 'text-emerald-400' : step.status === 'current' ? 'text-amber-400' : 'text-neutral-500'}`} />
                <p className="mt-3 text-sm font-bold text-white">{step.title}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Anchor</p>
              <p className="mt-2 text-sm font-bold text-white">Etherfuse {providerModeLabel}</p>
              <p className="mt-1 text-xs text-neutral-500">{etherfuse.loading ? 'checando status...' : etherfuse.error ?? (etherfuse.data?.configured ? 'configurado no backend' : 'aguardando secrets')}</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Rede</p>
              <p className="mt-2 text-sm font-bold text-white">{challenge?.network ?? etherfuse.data?.network ?? 'testnet'}</p>
              <p className="mt-1 text-xs text-neutral-500">Stellar + USDC allowlist</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Moeda base</p>
              <p className="mt-2 text-sm font-bold text-white">{fiatCurrency}</p>
              <p className="mt-1 text-xs text-neutral-500">conversao anchor-side</p>
            </div>
          </div>

          {challenge && (
            <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Pagamento necessario</p>
                  <p className="mt-1 text-sm text-neutral-300">
                    {challenge.amount} {asset?.label} para {previewPublicKey(challenge.payTo)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">Ativo {asset?.issuerPreview} - prova {challenge.nonce}</p>
                </div>
                <CopyButton value={challenge.requiredHeader} label="Copiar challenge" />
              </div>
              <pre className="mt-4 max-h-32 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-amber-100">{challenge.requiredHeader}</pre>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Pagamento real</p>
                <h3 className="mt-1 font-bricolage text-xl font-bold text-white">Carteira assina a transacao</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">Kivo nao marca sucesso sozinho: a API so libera o recurso quando recebe uma transacao assinada, com pagamento exato e prova do desafio, aceita pela Stellar testnet.</p>
              </div>
              {paid && <Badge tone="processing">ledger {paid.stellarLedger}</Badge>}
            </div>

            <label className="mt-5 block text-xs font-bold uppercase tracking-wider text-neutral-500">Comprovante assinado da carteira</label>
            <textarea
              value={txXDR}
              onChange={(event) => setTxXDR(event.target.value)}
              placeholder="Cole aqui a transacao assinada pela carteira Stellar"
              className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500"
            />
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button type="button" onClick={payAndUnlock} disabled={!challenge || !txXDR.trim() || loading} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
                Enviar pagamento e liberar
                <Icon icon="solar:lock-keyhole-unlocked-bold" />
              </button>
              <p className="text-xs text-neutral-500">A transacao deve bater com destino, valor, ativo e prova gerados pelo Kivo.</p>
            </div>
          </div>

          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}

          {paid && (
            <div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Pagamento aceito</p>
                  <p className="mt-1 text-sm text-neutral-300">Confirmado na Stellar: {paid.stellarHash}</p>
                </div>
                <CopyButton value={paid.paymentHeader} label="Copiar comprovante" />
              </div>
              <pre className="mt-4 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-emerald-100">{unlocked ? JSON.stringify(unlocked, null, 2) : JSON.stringify(paid.data, null, 2)}</pre>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

function sessionStatusLabel(status: PowerSession['status']) {
  const labels: Record<PowerSession['status'], string> = {
    requested: 'solicitada',
    payment_required: 'pagamento',
    paid: 'paga',
    authorized: 'autorizada',
    running: 'rodando',
    completed: 'completa',
    expired: 'expirada',
    failed: 'falhou',
  };
  return labels[status] ?? status;
}
