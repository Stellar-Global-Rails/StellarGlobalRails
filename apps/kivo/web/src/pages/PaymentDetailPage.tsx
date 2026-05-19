import { Icon } from '@iconify/react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function PaymentDetailPage() {
  const { id = '' } = useParams();
  const paymentData = useAsyncData(() => kivoClient.getPayment(id), [id]);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const [actualValue, setActualValue] = useState('');
  const [txXDR, setTxXDR] = useState('');

  if (paymentData.loading || !paymentData.data) return <Card>Carregando pagamento...</Card>;
  const payment = paymentData.data;
  const fromDevice = devices.data?.find((device) => device.id === payment.fromDeviceId);
  const toDevice = devices.data?.find((device) => device.id === payment.toDeviceId);

  const execute = async () => {
    await kivoClient.executePayment(payment.id, txXDR);
    await paymentData.reload();
  };

  const submitProof = async (event: FormEvent) => {
    event.preventDefault();
    await kivoClient.submitConditionProof(payment.id, {
      conditionKey: payment.conditionType,
      actualValue,
      proofData: { operator_submitted_at: new Date().toISOString() },
    });
    await paymentData.reload();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment detail"
        title={shortId(payment.id, 14, 8)}
        icon="solar:wallet-money-bold-duotone"
        description={`${payment.amount} ${payment.assetCode} · ${fromDevice?.name ?? payment.fromDeviceId} → ${toDevice?.name ?? payment.toDeviceId}`}
        action={<Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>}
      />

      <WorkspaceContextBanner
        eyebrow="Prova de liquidacao"
        title="Pagamento como trilha comum entre produto e financeiro"
        icon="solar:wallet-money-bold-duotone"
        tone={payment.status}
        description="O detalhe mostra o ciclo completo: evento de uso, condicao, XDR, hash Stellar, devices participantes e auditoria para conciliacao."
        checkpoints={['Timeline', 'Condicao/proof', 'Hash Stellar']}
        primaryAction={{ to: '/finance', label: 'Ver financeiro' }}
        secondaryAction={{ to: '/payments', label: 'Lista de pagamentos' }}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Timeline</h2>
          <div className="mt-5 space-y-4">
            {payment.events.map((event, index) => (
              <div key={event.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full border ${event.status === 'failed' ? 'border-red-500/30 bg-red-500/10 text-red-400' : event.status === 'current' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-neutral-400'}`}>
                    <Icon icon={event.status === 'failed' ? 'solar:close-circle-bold' : 'solar:check-circle-bold'} />
                  </div>
                  {index < payment.events.length - 1 && <div className="h-full min-h-8 w-px bg-white/10" />}
                </div>
                <div className="pb-4">
                  <p className="font-bold text-white">{event.label}</p>
                  <p className="mt-1 text-sm text-neutral-400">{event.description}</p>
                  <p className="mt-1 text-xs text-neutral-600">{formatDateTime(event.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ações</h2>
          <label className="mt-4 block text-xs font-bold uppercase tracking-wider text-neutral-500">Stellar transaction XDR</label>
          <textarea value={txXDR} onChange={(event) => setTxXDR(event.target.value)} className="mt-2 min-h-32 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-emerald-100 outline-none focus:border-emerald-500" />
          <button onClick={execute} disabled={!txXDR.trim()} className="mt-3 w-full rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400 disabled:cursor-not-allowed disabled:opacity-40">Submeter na Stellar</button>
          {payment.conditionType !== 'none' && (
            <form onSubmit={submitProof} className="mt-4 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">Prova da condição</label>
              <input value={actualValue} onChange={(event) => setActualValue(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" />
              <button className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black">Submeter proof</button>
            </form>
          )}
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Stellar</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-xl bg-black/25 p-3">
              <p className="text-xs text-neutral-500">Transaction hash</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <code className="break-all text-xs text-neutral-300">{payment.stellarHash ?? 'Ainda não confirmado'}</code>
                {payment.stellarHash && <CopyButton value={payment.stellarHash} />}
              </div>
            </div>
            {payment.stellarHash && (
              <a href={`https://stellar.expert/explorer/testnet/tx/${payment.stellarHash}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
                Abrir no explorer
                <Icon icon="solar:arrow-right-up-linear" />
              </a>
            )}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Participantes</h2>
          <div className="mt-4 grid gap-3">
            {[fromDevice, toDevice].map((device, index) => (
              <Link key={device?.id ?? index} to={`/devices/${device?.id ?? ''}`} className="rounded-xl border border-white/5 bg-black/25 p-4 hover:border-emerald-500/20">
                <p className="text-xs text-neutral-500">{index === 0 ? 'Pagador' : 'Recebedor'}</p>
                <p className="mt-1 font-bold text-white">{device?.name ?? 'Device desconhecido'}</p>
                <p className="mt-1 font-mono text-xs text-neutral-500">{shortId(device?.stellarPublicKey)}</p>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
