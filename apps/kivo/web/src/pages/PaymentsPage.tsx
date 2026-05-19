import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { AssetCode, ConditionType, PaymentStatus } from '@/types/kivo';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function PaymentsPage() {
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus | 'all'>('all');
  const [fromDeviceId, setFromDeviceId] = useState('');
  const [toDeviceId, setToDeviceId] = useState('');
  const [amount, setAmount] = useState('');
  const [assetCode, setAssetCode] = useState<AssetCode>('USDC');
  const [conditionType, setConditionType] = useState<ConditionType>('none');
  const [conditionValue, setConditionValue] = useState('');
  const [memo, setMemo] = useState('');

  const filtered = useMemo(() => {
    const data = payments.data ?? [];
    return status === 'all' ? data : data.filter((payment) => payment.status === status);
  }, [payments.data, status]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await kivoClient.createPayment({
      fromDeviceId,
      toDeviceId,
      amount,
      assetCode,
      conditionType,
      conditionValue: conditionType === 'none' ? undefined : conditionValue,
      timeoutSeconds: 3600,
      memo,
    });
    setModalOpen(false);
    await payments.reload();
  };

  const deviceName = (id: string) => devices.data?.find((device) => device.id === id)?.name ?? id;
  const canCreate = Boolean(fromDeviceId && toDeviceId && fromDeviceId !== toDeviceId && amount);
  const totalPayments = payments.data?.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Payment gateway"
        title="Payments"
        icon="solar:wallet-money-bold-duotone"
        description="Ledger legivel para acompanhar pagamentos, status Stellar, falhas e comprovantes."
        action={<Link to="/checkout" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Testar pagamento</Link>}
      />

      <WorkspaceContextBanner
        eyebrow="Ledger compartilhado"
        title="Linha do tempo dos pagamentos do workspace"
        icon="solar:wallet-money-bold-duotone"
        tone="active"
        description="Acompanhe cada cobranca como registro auditavel: origem, destino, condicao, liquidacao Stellar e conciliacao financeira no mesmo workspace."
        checkpoints={['Registro auditavel', 'Status Stellar', 'Falhas e comprovantes']}
        primaryAction={{ to: '/finance', label: 'Ver financeiro' }}
        secondaryAction={{ to: '/checkout', label: 'Testar pagamento' }}
      />

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Filtro do ledger</p>
            <p className="mt-1 text-sm text-neutral-400">{filtered.length} de {totalPayments} pagamentos em exibicao</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending', 'processing', 'confirmed', 'failed'] as const).map((item) => (
              <button key={item} onClick={() => setStatus(item)} className={`rounded-xl border px-3 py-2 text-xs font-bold ${status === item ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-white/10 bg-white/5 text-neutral-500 hover:bg-white/10'}`}>
                {item === 'all' ? 'Todos' : statusLabel(item)}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="min-w-0 overflow-hidden">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Ledger</p>
            <h2 className="mt-1 font-bricolage text-2xl font-bold text-white">Pagamentos registrados</h2>
          </div>
          <p className="text-xs text-neutral-500">Abra um registro para ver o comprovante e detalhes operacionais.</p>
        </div>

        <div className="mt-5 divide-y divide-white/5">
          {filtered.map((payment) => (
            <Link
              key={payment.id}
              to={`/payments/${payment.id}`}
              className="grid min-w-0 gap-4 py-4 transition-colors hover:bg-white/[0.02] sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1fr)_auto]"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-emerald-400">{shortId(payment.id)}</p>
                <p className="mt-1 break-words text-lg font-bold text-white">{payment.amount} {payment.assetCode}</p>
                <p className="mt-1 text-xs text-neutral-500">{formatDateTime(payment.createdAt)}</p>
              </div>
              <div className="grid min-w-0 gap-3 md:grid-cols-2">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Origem</p>
                  <p className="mt-1 truncate text-sm text-neutral-300" title={deviceName(payment.fromDeviceId)}>{deviceName(payment.fromDeviceId)}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Destino</p>
                  <p className="mt-1 truncate text-sm text-neutral-300" title={deviceName(payment.toDeviceId)}>{deviceName(payment.toDeviceId)}</p>
                </div>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">Condicao</p>
                <p className="mt-1 break-words text-sm text-neutral-400">{payment.conditionType}{payment.conditionValue ? ` = ${payment.conditionValue}` : ''}</p>
              </div>
              <div className="flex items-start sm:justify-end">
                <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
              </div>
            </Link>
          ))}
          {!filtered.length && (
            <div className="rounded-2xl border border-white/5 bg-black/25 p-6 text-sm text-neutral-400">
              Nenhum pagamento encontrado para este filtro.
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Advanced</p>
            <h2 className="mt-1 font-bricolage text-2xl font-bold text-white">Advanced: criar pagamento manual</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
              Use apenas para montar um pagamento direto entre devices quando precisar validar casos fora do checkout guiado.
            </p>
          </div>
          <button onClick={() => setModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">
            Criar pagamento manual
            <Icon icon="solar:arrow-right-up-bold" />
          </button>
        </div>
      </Card>

      <Modal open={modalOpen} title="Advanced: criar pagamento manual" onClose={() => setModalOpen(false)}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={fromDeviceId} onChange={(event) => setFromDeviceId(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="">Origem</option>
              {(devices.data ?? []).map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
            </select>
            <select value={toDeviceId} onChange={(event) => setToDeviceId(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="">Destino</option>
              {(devices.data ?? []).map((device) => <option key={device.id} value={device.id}>{device.name}</option>)}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input value={amount} onChange={(event) => setAmount(event.target.value)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="0.0000000" />
            <select value={assetCode} onChange={(event) => setAssetCode(event.target.value as AssetCode)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="USDC">USDC</option>
              <option value="XLM">XLM</option>
            </select>
            <select value={conditionType} onChange={(event) => setConditionType(event.target.value as ConditionType)} className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-emerald-500">
              <option value="none">none</option>
              <option value="energy_kwh">energy_kwh</option>
              <option value="time_elapsed">time_elapsed</option>
              <option value="service_complete">service_complete</option>
              <option value="custom">custom</option>
            </select>
          </div>
          {conditionType !== 'none' && <input value={conditionValue} onChange={(event) => setConditionValue(event.target.value)} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Valor da condicao" />}
          <input value={memo} onChange={(event) => setMemo(event.target.value)} maxLength={28} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 outline-none focus:border-emerald-500" placeholder="Memo Stellar" />
          <button disabled={!canCreate} className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-50">
            Criar pagamento
            <Icon icon="solar:arrow-right-bold" />
          </button>
        </form>
      </Modal>
    </div>
  );
}
