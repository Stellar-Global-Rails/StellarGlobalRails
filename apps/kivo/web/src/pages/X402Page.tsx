import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { formatProviderModeLabel } from '@/config/productMode';
import { formatX402AssetLabel, previewPublicKey, x402CheckoutResources } from '@/data/x402Experience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import type { X402Challenge, X402PaidResponse, X402UnlockedResponse } from '@/types/kivo';

const defaultAsset = 'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5';

export default function X402Page() {
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const notify = useNotificationStore((state) => state.add);
  const [resource, setResource] = useState('/api/x402/data');
  const [amount, setAmount] = useState('0.0500000');
  const [asset, setAsset] = useState(defaultAsset);
  const [maxTimeout, setMaxTimeout] = useState(300);
  const [txXDR, setTxXDR] = useState('');
  const [challenge, setChallenge] = useState<X402Challenge | null>(null);
  const [paid, setPaid] = useState<X402PaidResponse | null>(null);
  const [unlocked, setUnlocked] = useState<X402UnlockedResponse | null>(null);
  const [busy, setBusy] = useState<'challenge' | 'pay' | 'save' | null>(null);
  const [error, setError] = useState('');

  const challengeAsset = challenge ? formatX402AssetLabel(challenge.asset) : null;
  const providerModeLabel = formatProviderModeLabel(etherfuse.data?.mode);

  const requestChallenge = async () => {
    setBusy('challenge');
    setError('');
    setPaid(null);
    setUnlocked(null);
    try {
      setChallenge(await kivoClient.getX402Challenge(resource));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel obter o challenge x402.');
    } finally {
      setBusy(null);
    }
  };

  const pay = async () => {
    if (!challenge) return;
    setBusy('pay');
    setError('');
    try {
      const paidResponse = await kivoClient.payX402Challenge(challenge.nonce, txXDR);
      setPaid(paidResponse);
      setUnlocked(await kivoClient.unlockX402Resource(resource, paidResponse.paymentHeader));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry pago nao foi confirmado.');
    } finally {
      setBusy(null);
    }
  };

  const savePricing = async (event: FormEvent) => {
    event.preventDefault();
    setBusy('save');
    setError('');
    try {
      const rule = await kivoClient.upsertX402PricingRule({
        resource,
        amount,
        asset,
        maxTimeout,
        enabled: true,
        description: 'Regra operacional para recursos protegidos por x402.',
      });
      notify({ type: 'success', title: 'Regra x402 salva', message: `${rule.amount} em ${rule.resource}` });
      await pricing.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel salvar a regra.');
    } finally {
      setBusy(null);
    }
  };

  const selectResource = (nextResource: string) => {
    setResource(nextResource);
    setChallenge(null);
    setPaid(null);
    setUnlocked(null);
    setError('');
  };

  const clientSnippet = `const initial = await fetch('${resource}');
if (initial.status === 402) {
  const challenge = await initial.json();
  const signedTransactionXdr = await wallet.signPayment({
    destination: challenge.payTo,
    amount: challenge.amount,
    asset: challenge.asset,
    memo: sha256(challenge.nonce)
  });

  const paid = await fetch('/v1/x402/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nonce: challenge.nonce, txXDR: signedTransactionXdr })
  }).then((res) => res.json());

  const unlocked = await fetch('${resource}', {
    headers: { 'X-PAYMENT': paid.paymentHeader }
  });
}`;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="HTTP 402"
        title="Regras x402"
        icon="solar:shield-keyhole-bold-duotone"
        description="Configure recursos pagos, gere desafios de pagamento e valide a liberacao do acesso."
      />
      <WorkspaceContextBanner
        eyebrow="Ponte usuario final + integrador"
        title="Regra de preco por recurso, com checkout real separado"
        icon="solar:shield-keyhole-bold-duotone"
        tone="active"
        description="O usuario final usa Checkout. Aqui o integrador configura recurso, preco, tempo de expiracao e ativo aceito."
        checkpoints={['Regra de preco', 'Pagamento necessario', 'Acesso liberado']}
        primaryAction={{ to: '/checkout', label: 'Testar pagamento' }}
        secondaryAction={{ to: '/integrations', label: 'Hub integrador' }}
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <Card className="min-w-0 xl:col-span-3">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Fluxo de validacao</p>
              <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">Do pagamento necessario ao acesso liberado</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">Esse fluxo nao cria sucesso falso: sem transacao assinada e compativel com destino, valor, ativo e prova do desafio, o backend responde erro. Com pagamento aceito, a proxima chamada ao recurso libera o acesso.</p>
            </div>
            <Badge tone={unlocked ? 'confirmed' : paid ? 'processing' : challenge ? 'pending' : 'neutral'}>
              {unlocked ? 'acesso liberado' : paid ? 'pagamento aceito' : challenge ? 'pagamento solicitado' : 'sem desafio'}
            </Badge>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {x402CheckoutResources.map((item) => (
              <button
                key={item.resource}
                type="button"
                onClick={() => selectResource(item.resource)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  item.resource === resource ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-white/5 bg-black/25 hover:bg-white/5'
                }`}
              >
                <Icon icon={item.icon} className="text-2xl text-emerald-300" />
                <p className="mt-3 text-sm font-bold text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{item.resource}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <h3 className="font-bricolage text-xl font-bold text-white">Teste da cobranca</h3>
              <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-neutral-500">Recurso</label>
              <input value={resource} onChange={(event) => selectResource(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs outline-none focus:border-emerald-500" />
              <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-neutral-500">Comprovante assinado</label>
              <textarea value={txXDR} onChange={(event) => setTxXDR(event.target.value)} placeholder="Cole a transacao assinada pela carteira Stellar" className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={requestChallenge} disabled={busy === 'challenge'} className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:opacity-50">
                  {busy === 'challenge' ? 'Gerando...' : 'Gerar desafio'}
                </button>
                <button type="button" onClick={pay} disabled={!challenge || !txXDR.trim() || busy === 'pay'} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-300 disabled:cursor-not-allowed disabled:opacity-40">
                  {busy === 'pay' ? 'Confirmando...' : 'Liberar acesso'}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-400">Pagamento necessario</p>
                    {challenge && (
                      <p className="mt-1 text-sm text-neutral-300">
                        {challenge.amount} {challengeAsset?.label} - destino {previewPublicKey(challenge.payTo)}
                      </p>
                    )}
                  </div>
                  {challenge && <CopyButton value={challenge.requiredHeader} label="Copiar" />}
                </div>
                <pre className="mt-3 max-h-36 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-amber-100">{challenge?.requiredHeader ?? 'O desafio de pagamento aparecera aqui depois do primeiro teste.'}</pre>
              </div>
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-emerald-400">Acesso liberado</p>
                    {paid && <p className="mt-1 text-sm text-neutral-300">Ledger {paid.stellarLedger} - hash {paid.stellarHash}</p>}
                  </div>
                  {paid && <CopyButton value={paid.paymentHeader} label="Copiar comprovante" />}
                </div>
                <pre className="mt-3 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-xl bg-black/35 p-3 text-xs text-emerald-100">{unlocked ? JSON.stringify(unlocked, null, 2) : paid ? JSON.stringify(paid.data, null, 2) : 'Resposta liberada aparecera aqui depois do retry pago.'}</pre>
              </div>
            </div>
          </div>
          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        </Card>

        <Card className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Anchor</p>
          <h2 className="mt-2 font-bricolage text-xl font-bold text-white">Etherfuse Devnet</h2>
          <div className="mt-4 space-y-3">
            <InfoRow label="Modo" value={providerModeLabel} />
            <InfoRow label="Rede" value={etherfuse.data?.network ?? 'testnet'} />
            <InfoRow label="Fiat base" value={etherfuse.data?.default_fiat ?? 'MXN'} />
            <InfoRow label="Status" value={etherfuse.loading ? 'checando' : etherfuse.error ?? (etherfuse.data?.configured ? 'configurado' : 'sem secrets')} />
          </div>
          <div className="mt-4 rounded-xl border border-white/5 bg-black/25 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Assets permitidos</p>
            <div className="mt-2 space-y-2">
              {(etherfuse.data?.allowed_assets ?? [defaultAsset]).map((allowedAsset) => (
                <code key={allowedAsset} className="block break-all text-[11px] text-emerald-200">{allowedAsset}</code>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="min-w-0">
          <h2 className="font-bricolage text-xl font-bold text-white">Pricing rule</h2>
          <form onSubmit={savePricing} className="mt-4 space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Amount</label>
            <input value={amount} onChange={(event) => setAmount(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm outline-none focus:border-emerald-500" />
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Asset</label>
            <input value={asset} onChange={(event) => setAsset(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs outline-none focus:border-emerald-500" />
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Timeout</label>
            <input type="number" min={30} max={900} value={maxTimeout} onChange={(event) => setMaxTimeout(Number(event.target.value))} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
            <button disabled={busy === 'save'} className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:opacity-50">
              {busy === 'save' ? 'Salvando...' : 'Salvar regra'}
            </button>
          </form>
        </Card>

        <Card className="min-w-0">
          <h2 className="font-bricolage text-xl font-bold text-white">Recursos ativos</h2>
          <div className="mt-4 space-y-3">
            {pricing.loading && <p className="rounded-xl border border-white/5 bg-black/25 p-3 text-sm text-neutral-400">Carregando regras...</p>}
            {pricing.error && <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-100">{pricing.error}</p>}
            {(pricing.data ?? []).map((rule) => (
              <button key={rule.id} type="button" onClick={() => {
                setResource(rule.resource);
                setAmount(rule.amount);
                setAsset(rule.asset);
                setMaxTimeout(rule.maxTimeout);
              }} className="w-full rounded-xl border border-white/5 bg-black/25 p-3 text-left transition-colors hover:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <span className="break-all font-mono text-xs text-white">{rule.resource}</span>
                  <Badge tone={rule.enabled ? 'active' : 'paused'}>{rule.enabled ? 'on' : 'off'}</Badge>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{rule.amount} - {rule.maxTimeout}s</p>
              </button>
            ))}
          </div>
        </Card>

        <Card className="min-w-0">
          <div className="flex items-center justify-between gap-3">
          <h2 className="font-bricolage text-xl font-bold text-white">Snippet do cliente</h2>
            <CopyButton value={clientSnippet} label="Copiar" />
          </div>
          <pre className="mt-4 max-h-96 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-white/10 bg-black/50 p-4 text-xs text-blue-100">{clientSnippet}</pre>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/25 p-3">
      <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">{label}</p>
      <p className="mt-1 break-all text-sm font-bold text-white">{value}</p>
    </div>
  );
}
