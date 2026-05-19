import { Icon } from '@iconify/react';
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { buildIntegrationSnippet, deriveSoloFlows, isDirectPricingRulePayment } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { KivoFlow, KivoFlowStatus, Payment } from '@/types/kivo';
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

export default function FlowDetailPage() {
  const { id } = useParams();
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const pricingRules = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  const flows = useMemo(
    () =>
      deriveSoloFlows({
        devices: devices.data ?? [],
        payments: payments.data ?? [],
        pricingRules: pricingRules.data ?? [],
      }),
    [devices.data, payments.data, pricingRules.data],
  );
  const flow = flows.find((item) => item.id === id);

  const paymentMatches = useMemo(() => {
    if (!flow) {
      return { payments: [], isHeuristic: false };
    }

    return findRelatedPayments(payments.data ?? [], flow);
  }, [flow, payments.data]);
  const relatedPayments = paymentMatches.payments;

  const snippet = flow
    ? buildIntegrationSnippet({
        templateId: flow.templateId,
        resource: flow.resource,
        price: flow.price,
        unit: flow.unit,
      })
    : '';
  const completedSetupItems = flow?.setupChecklist.filter((item) => item.complete).length ?? 0;
  const totalSetupItems = flow?.setupChecklist.length ?? 0;
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

  if (!flow && !hasPendingLoaders && !hasLoadErrors) {
    return (
      <div className="space-y-8">
        <PageHeader
          eyebrow="Flow"
          title="Flow nao encontrado"
          icon="solar:bolt-circle-bold-duotone"
          description="Nao encontramos um recurso monetizado com esse identificador."
          action={
            <Link
              to="/flows"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:border-emerald-400/40"
            >
              Voltar para flows
              <Icon icon="solar:arrow-right-bold" />
            </Link>
          }
        />
        <Card className="border-dashed border-white/10 bg-black/25">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h2 className="font-bricolage text-xl font-bold text-white">Nada por aqui</h2>
              <p className="mt-2 break-words text-sm leading-6 text-neutral-400">
                O flow solicitado pode ter sido removido ou ainda nao foi criado neste workspace.
              </p>
            </div>
            <Link
              to="/create-flow"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Create Flow
              <Icon icon="solar:add-circle-bold-duotone" />
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flow"
        title={flow?.name ?? 'Carregando flow'}
        icon="solar:bolt-circle-bold-duotone"
        description={flow ? `Preco, pagamentos e monitoramento em um unico detalhe.` : 'Montando recurso monetizado.'}
        action={
          <div className="flex flex-wrap items-center gap-2">
            {flow && <Badge tone={flowTone[flow.status]}>{flowStatusLabel(flow.status)}</Badge>}
            <Link
              to="/checkout"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              Testar pagamento
              <Icon icon="solar:card-transfer-bold-duotone" className="text-lg" />
            </Link>
          </div>
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
                  {hasLoadErrors ? 'Alguns dados nao carregaram' : 'Carregando detalhe do flow'}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {hasLoadErrors
                  ? 'As metricas, checklist ou pagamentos podem ficar incompletos ate a recarga.'
                  : 'Buscando devices, pagamentos e regras de preco antes de abrir o detalhe.'}
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

      {flow && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard title="Preco" value={`${formatCurrency(flow.price)} / ${flow.unit}`} icon="solar:tag-price-bold-duotone" />
            <MetricCard title="Receita" value={formatCurrency(flow.revenueUsdc)} icon="solar:wallet-money-bold-duotone" tone="emerald" />
            <MetricCard title="Sessoes" value={flow.sessionsCount.toString()} icon="solar:play-circle-bold-duotone" tone="blue" />
            <MetricCard title="Falhas" value={flow.failedPaymentsCount.toString()} icon="solar:danger-triangle-bold-duotone" tone="amber" />
          </div>

          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Card>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-bricolage text-xl font-bold text-white">Setup</h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    {completedSetupItems}/{totalSetupItems} etapas concluidas para operar com confianca.
                  </p>
                </div>
                <Badge tone={completedSetupItems === totalSetupItems ? 'ready' : 'warning'}>
                  {completedSetupItems === totalSetupItems ? 'Pronto' : 'Pendente'}
                </Badge>
              </div>

              <div className="mt-6 space-y-3">
                {flow.setupChecklist.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 rounded-xl border border-white/5 bg-black/25 p-4">
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        item.complete
                          ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300'
                          : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
                      }`}
                    >
                      <Icon icon={item.complete ? 'solar:check-circle-bold-duotone' : 'solar:clock-circle-bold-duotone'} />
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-bold text-white">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-neutral-500">
                        {item.complete ? 'Concluido' : 'Ainda precisa de atencao'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="font-bricolage text-xl font-bold text-white">Integracao</h2>
                  <p className="mt-1 text-sm leading-6 text-neutral-500">
                    Use este trecho como ponto de partida para cobrar antes de liberar o recurso.
                  </p>
                </div>
                <Link to="/checkout" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">
                  Testar pagamento
                </Link>
              </div>
              <pre className="mt-5 max-h-[420px] overflow-auto rounded-xl border border-white/5 bg-black/50 p-4 text-xs leading-6 text-neutral-200">
                <code>{snippet}</code>
              </pre>
            </Card>
          </div>

          <Card>
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h2 className="font-bricolage text-xl font-bold text-white">Pagamentos relacionados</h2>
                <p className="mt-1 text-sm leading-6 text-neutral-500">
                  Transacoes associadas ao device ou ao resource deste flow.
                </p>
              </div>
              <Badge tone="neutral">{relatedPayments.length} registros</Badge>
            </div>

            {relatedPayments.length ? (
              <div className="space-y-3">
                {relatedPayments.map((payment) => (
                  <Link
                    key={payment.id}
                    to={`/payments/${payment.id}`}
                    className="flex min-w-0 flex-col gap-3 rounded-xl border border-white/5 bg-black/25 p-4 transition hover:bg-white/[0.04] md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-white">
                          {payment.amount} {payment.assetCode}
                        </p>
                        <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
                      </div>
                      <p className="mt-1 break-words text-xs leading-5 text-neutral-500">
                        Criado em {formatDateTime(payment.createdAt)}
                        {payment.memo ? ` · ${payment.memo}` : ''}
                      </p>
                    </div>
                    <Icon icon="solar:arrow-right-linear" className="shrink-0 text-neutral-600" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 bg-black/25 p-5 text-sm leading-6 text-neutral-500">
                Nenhum pagamento relacionado ainda. Use o checkout para validar a primeira cobranca deste flow.
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  tone = 'violet',
}: {
  title: string;
  value: string;
  icon: string;
  tone?: 'violet' | 'emerald' | 'blue' | 'amber';
}) {
  const tones = {
    violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    blue: 'border-blue-500/20 bg-blue-500/10 text-blue-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
  };

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-500">{title}</p>
          <p className="mt-3 break-words font-bricolage text-2xl font-bold text-white">{value}</p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${tones[tone]}`}>
          <Icon icon={icon} className="text-xl" />
        </span>
      </div>
    </Card>
  );
}

function findRelatedPayments(payments: Payment[], flow: KivoFlow) {
  if (flow.deviceId) {
    return {
      payments: payments
        .filter((payment) => payment.fromDeviceId === flow.deviceId || payment.toDeviceId === flow.deviceId)
        .sort((left, right) => sortByNewest(left.createdAt, right.createdAt)),
      isHeuristic: false,
    };
  }

  const directMatches = payments.filter((payment) => isDirectPricingRulePayment(payment, flow));

  return {
    payments: directMatches.sort((left, right) => sortByNewest(left.createdAt, right.createdAt)),
    isHeuristic: false,
  };
}
