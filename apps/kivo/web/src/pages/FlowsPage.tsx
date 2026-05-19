import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { deriveSoloFlows } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { KivoFlowStatus } from '@/types/kivo';
import { formatCurrency, formatDateTime, statusLabel } from '@/utils/format';

const flowTone: Record<KivoFlowStatus, string> = {
  active: 'active',
  needs_setup: 'warning',
  testing: 'processing',
  draft: 'paused',
  failed: 'failed',
};

const flowStatusLabel = (status: KivoFlowStatus) => {
  if (status === 'needs_setup') {
    return statusLabel('warning');
  }

  if (status === 'testing') {
    return statusLabel('processing');
  }

  return statusLabel(status);
};

const sortByNewest = (left?: string, right?: string) => {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;

  return rightTime - leftTime;
};

const loaderLabels = {
  devices: 'Devices',
  payments: 'Pagamentos',
  pricingRules: 'Regras de preco',
} as const;

export default function FlowsPage() {
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const pricingRules = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  const flows = useMemo(
    () =>
      deriveSoloFlows({
        devices: devices.data ?? [],
        payments: payments.data ?? [],
        pricingRules: pricingRules.data ?? [],
      }).sort((left, right) => sortByNewest(left.lastActivityAt, right.lastActivityAt)),
    [devices.data, payments.data, pricingRules.data],
  );

  const loaders = [
    { id: 'devices', label: loaderLabels.devices, state: devices },
    { id: 'payments', label: loaderLabels.payments, state: payments },
    { id: 'pricingRules', label: loaderLabels.pricingRules, state: pricingRules },
  ];
  const failedLoaders = loaders.filter((loader) => loader.state.error);
  const pendingLoaders = loaders.filter((loader) => loader.state.loading && loader.state.data === null);
  const hasPendingLoaders = pendingLoaders.length > 0;
  const hasLoadErrors = failedLoaders.length > 0;

  const retryFailedLoaders = () => {
    void Promise.all(failedLoaders.map((loader) => loader.state.reload()));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flows"
        title="Recursos monetizados"
        icon="solar:bolt-circle-bold-duotone"
        description="Cada flow junta template, preco, integracao, pagamento e monitoramento."
        action={
          <Link
            to="/create-flow"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
          >
            Create Flow
            <Icon icon="solar:add-circle-bold-duotone" className="text-lg" />
          </Link>
        }
      />

      {(hasLoadErrors || hasPendingLoaders) && (
        <Card className={hasLoadErrors ? 'border-amber-500/20 bg-amber-500/[0.06]' : 'border-blue-500/20 bg-blue-500/[0.06]'}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Icon
                  icon={hasLoadErrors ? 'solar:danger-triangle-bold-duotone' : 'solar:refresh-circle-bold-duotone'}
                  className={hasLoadErrors ? 'text-2xl text-amber-300' : 'text-2xl text-blue-300'}
                />
                <h2 className="font-bricolage text-lg font-bold text-white">
                  {hasLoadErrors ? 'Alguns dados nao carregaram' : 'Carregando flows'}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {hasLoadErrors
                  ? 'Os cards abaixo podem estar incompletos ate que as fontes sejam recarregadas.'
                  : 'Buscando devices, pagamentos e regras de preco para montar os recursos monetizados.'}
              </p>
              {hasLoadErrors && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {failedLoaders.map((loader) => (
                    <button
                      key={loader.id}
                      type="button"
                      onClick={() => {
                        void loader.state.reload();
                      }}
                      className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:border-amber-300/50"
                    >
                      <Icon icon="solar:refresh-linear" className="shrink-0" />
                      <span className="truncate">Tentar {loader.label}: {loader.state.error}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {hasLoadErrors ? (
              <button
                type="button"
                onClick={retryFailedLoaders}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-amber-300"
              >
                Tentar novamente
                <Icon icon="solar:refresh-linear" />
              </button>
            ) : (
              <Badge tone="processing">{pendingLoaders.length} carregando</Badge>
            )}
          </div>
        </Card>
      )}

      {flows.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {flows.map((flow) => (
            <Link
              key={flow.id}
              to={`/flows/${flow.id}`}
              className="group block min-w-0 rounded-2xl border border-white/5 bg-neutral-900/80 p-5 premium-shadow transition hover:border-emerald-400/35 hover:bg-white/[0.04]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={flowTone[flow.status]}>{flowStatusLabel(flow.status)}</Badge>
                  </div>
                  <h2 className="mt-4 break-words font-bricolage text-xl font-bold text-white">{flow.name}</h2>
                  <p className="mt-2 break-words text-sm leading-6 text-neutral-400">{flow.resource}</p>
                </div>
                <Icon
                  icon="solar:arrow-right-up-linear"
                  className="mt-1 shrink-0 text-xl text-neutral-600 transition group-hover:text-emerald-300"
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-xl border border-white/5 bg-black/25 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">Preco</p>
                  <p className="mt-2 break-words text-sm font-bold text-white">
                    {formatCurrency(flow.price)} / {flow.unit}
                  </p>
                </div>
                <div className="min-w-0 rounded-xl border border-white/5 bg-black/25 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">Receita</p>
                  <p className="mt-2 break-words text-sm font-bold text-emerald-300">{formatCurrency(flow.revenueUsdc)}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-white/5 bg-black/25 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">Sessoes</p>
                  <p className="mt-2 text-sm font-bold text-white">{flow.sessionsCount}</p>
                </div>
                <div className="min-w-0 rounded-xl border border-white/5 bg-black/25 p-3">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">Atividade</p>
                  <p className="mt-2 break-words text-sm font-bold text-white">{formatDateTime(flow.lastActivityAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !hasPendingLoaders && (
          <Card className="border-dashed border-white/10 bg-black/25">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                  <Icon icon="solar:bolt-circle-bold-duotone" className="text-2xl" />
                </div>
                <h2 className="mt-4 font-bricolage text-xl font-bold text-white">Nenhum flow criado ainda</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                  Crie um recurso pago a partir de um device, endpoint ou feed e acompanhe preco, pagamentos e atividade aqui.
                </p>
              </div>
              <Link
                to="/create-flow"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
              >
                Create Flow
                <Icon icon="solar:arrow-right-bold" />
              </Link>
            </div>
          </Card>
        )
      )}
    </div>
  );
}
