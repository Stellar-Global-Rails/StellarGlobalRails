import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function OperationsPage() {
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const workflows = useAsyncData(() => kivoClient.listWorkflows(), []);

  const activeDevices = (devices.data ?? []).filter((device) => device.status === 'active');
  const pendingPayments = (payments.data ?? []).filter((payment) => payment.status === 'pending' || payment.status === 'processing');
  const failedPayments = (payments.data ?? []).filter((payment) => payment.status === 'failed');
  const healthEntries = Object.entries(summary.data?.health ?? {}).filter(([key]) => key !== 'version');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operacao"
        title="Infraestrutura M2M"
        icon="solar:devices-bold-duotone"
        description="Acompanhe devices, sessoes, filas e incidentes como operador do negocio em uma operacao real."
        action={
          <Link to="/devices" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            Gerenciar devices
            <Icon icon="solar:add-circle-bold" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Ativos" value={activeDevices.length.toString()} detail={`${devices.data?.length ?? 0} cadastrados`} icon="solar:devices-bold-duotone" />
        <StatCard title="Em curso" value={pendingPayments.length.toString()} detail="pagamentos ou sessoes" icon="solar:hourglass-bold-duotone" tone="amber" />
        <StatCard title="Falhas" value={failedPayments.length.toString()} detail="requerem acao" icon="solar:danger-circle-bold-duotone" tone="red" />
        <StatCard title="Saude" value={summary.data?.health.api ?? 'ok'} detail={`Stellar ${summary.data?.health.stellar ?? 'ok'}`} icon="solar:pulse-2-bold-duotone" tone="blue" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Devices e sites</h2>
              <p className="text-sm text-neutral-500">Pontos de infraestrutura que geram eventos de uso e pagamento.</p>
            </div>
            <Link to="/devices" className="text-xs font-bold text-emerald-400">Abrir lista</Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {(devices.data ?? []).slice(0, 6).map((device) => (
              <Link key={device.id} to={`/devices/${device.id}`} className="rounded-2xl border border-white/5 bg-black/25 p-4 transition-colors hover:border-emerald-500/20 hover:bg-white/[0.03]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Icon icon="solar:devices-bold" className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{device.name}</h3>
                      <p className="text-xs text-neutral-500">{device.metadata.location ?? 'sem local'}</p>
                    </div>
                  </div>
                  <Badge tone={device.status}>{statusLabel(device.status)}</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-black/30 p-3">
                    <p className="text-neutral-500">Saldo</p>
                    <p className="mt-1 font-bold text-white">{device.balances[0]?.amount ?? '0'} USDC</p>
                  </div>
                  <div className="rounded-xl bg-black/30 p-3">
                    <p className="text-neutral-500">Wallet</p>
                    <p className="mt-1 font-mono text-emerald-300">{shortId(device.stellarPublicKey, 6, 4)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Saude operacional</h2>
          <p className="mt-1 text-sm text-neutral-500">Servicos que sustentam checkout, liquidacao e webhooks.</p>
          <div className="mt-5 space-y-3">
            {healthEntries.map(([key, value]) => {
              const healthTone = value ?? 'degraded';
              return (
                <div key={key} className="flex items-center justify-between rounded-xl bg-black/30 p-3">
                  <span className="text-sm capitalize text-neutral-300">{key}</span>
                  <Badge tone={healthTone}>{statusLabel(healthTone)}</Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Fila de trabalho</h2>
              <p className="text-sm text-neutral-500">Workers atuais e readiness para orquestracao duravel.</p>
            </div>
            <Link to="/workflows" className="text-xs font-bold text-emerald-400">Workflows</Link>
          </div>
          <div className="space-y-3">
            {(workflows.data ?? []).slice(0, 4).map((workflow) => (
              <div key={workflow.id} className="rounded-xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-white">{workflow.name}</h3>
                    <p className="mt-1 text-xs text-neutral-500">{workflow.trigger}</p>
                  </div>
                  <Badge tone={workflow.status}>{statusLabel(workflow.status)}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {workflow.steps.map((step) => (
                    <span key={step.id} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">{step.label}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Eventos recentes</h2>
              <p className="text-sm text-neutral-500">Pagamentos que afetam a operacao agora.</p>
            </div>
            <Link to="/payments" className="text-xs font-bold text-emerald-400">Pagamentos</Link>
          </div>
          <div className="space-y-3">
            {(payments.data ?? []).slice(0, 5).map((payment) => (
              <Link key={payment.id} to={`/payments/${payment.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/5 bg-black/25 p-3 hover:bg-white/5">
                <div>
                  <p className="font-mono text-xs text-emerald-400">{shortId(payment.id)}</p>
                  <p className="mt-1 text-sm text-white">{payment.amount} {payment.assetCode} - {payment.conditionType}</p>
                  <p className="mt-1 text-xs text-neutral-500">{formatDateTime(payment.createdAt)}</p>
                </div>
                <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
