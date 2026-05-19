import { Icon } from '@iconify/react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function DeviceDetailPage() {
  const { id = '' } = useParams();
  const deviceResult = useAsyncData(() => kivoClient.getDevice(id), [id]);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);

  if (deviceResult.loading || !deviceResult.data) return <Card>Carregando device...</Card>;
  const device = deviceResult.data.device;
  const devicePayments = (payments.data ?? []).filter((payment) => payment.fromDeviceId === id || payment.toDeviceId === id);

  const updateStatus = async (status: typeof device.status) => {
    await kivoClient.updateDeviceStatus(device.id, status);
    await deviceResult.reload();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Device detail"
        title={device.name}
        icon="solar:devices-bold-duotone"
        description="Chave Stellar, saldos reportados pela API, metadata e histórico de pagamentos do device."
        action={<Badge tone={device.status}>{statusLabel(device.status)}</Badge>}
      />

      <WorkspaceContextBanner
        eyebrow="Ativo operacional"
        title="Um device visto como ponto de receita e risco"
        icon="solar:devices-bold-duotone"
        tone={device.status}
        description="Detalhe do device conecta operador, integrador e financeiro: wallet, API key, metadata, saldo e pagamentos relacionados em um unico contexto."
        checkpoints={['Wallet copiavel', 'Status governado', 'Pagamentos relacionados']}
        primaryAction={{ to: '/operations', label: 'Voltar a operacao' }}
        secondaryAction={{ to: '/payments', label: 'Ver pagamentos' }}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-neutral-500 font-bold">Stellar public key</p>
              <code className="mt-2 block break-all rounded-xl bg-black/30 px-3 py-3 text-xs text-emerald-300">{device.stellarPublicKey}</code>
            </div>
            <CopyButton value={device.stellarPublicKey} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {device.balances.map((balance) => (
              <div key={balance.assetCode} className="rounded-xl border border-white/5 bg-black/25 p-4">
                <p className="text-xs text-neutral-500">{balance.assetCode}</p>
                <p className="mt-1 font-bricolage text-2xl font-bold text-white">{balance.amount}</p>
              </div>
            ))}
            <div className="rounded-xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs text-neutral-500">API key</p>
              <p className="mt-1 font-mono text-sm text-white">{device.apiKeyPreview}</p>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Ações</h2>
          <div className="mt-4 grid gap-3">
            <button onClick={() => updateStatus('active')} className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-400">Ativar</button>
            <button onClick={() => updateStatus('suspended')} className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-400">Suspender</button>
            <button onClick={() => updateStatus('decommissioned')} className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-400">Descomissionar</button>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Metadata</h2>
          <div className="mt-4 space-y-3">
            {Object.entries(device.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between rounded-xl bg-black/25 p-3 text-sm">
                <span className="text-neutral-500">{key}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-neutral-500">Criado em {formatDateTime(device.createdAt)}</p>
        </Card>

        <Card className="xl:col-span-2">
          <h2 className="font-bricolage text-xl font-bold text-white">Pagamentos relacionados</h2>
          <div className="mt-4 divide-y divide-white/5">
            {devicePayments.map((payment) => (
              <Link key={payment.id} to={`/payments/${payment.id}`} className="flex items-center justify-between py-3 hover:bg-white/[0.02]">
                <div>
                  <code className="text-xs text-emerald-400">{shortId(payment.id)}</code>
                  <p className="mt-1 text-sm text-white">{payment.amount} {payment.assetCode}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
                  <Icon icon="solar:arrow-right-linear" className="text-neutral-600" />
                </div>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
