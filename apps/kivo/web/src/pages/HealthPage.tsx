import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { deriveSoloFlows } from '@/data/soloMvp';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatCurrency, formatDateTime } from '@/utils/format';

export default function HealthPage() {
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const devices = useAsyncData(() => kivoClient.listDevices(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const pricingRules = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  const flows = deriveSoloFlows({
    devices: devices.data ?? [],
    payments: payments.data ?? [],
    pricingRules: pricingRules.data ?? [],
  });
  const activeFlows = flows.filter((flow) => flow.status === 'active');
  const flowsWithFailures = flows.filter((flow) => flow.failedPaymentsCount > 0);
  const completedChecklist = flows.reduce((total, flow) => total + flow.setupChecklist.filter((item) => item.complete).length, 0);
  const totalChecklist = flows.reduce((total, flow) => total + flow.setupChecklist.length, 0);
  const loadError = summary.error || devices.error || payments.error || pricingRules.error;
  const overallTone = loadError || flowsWithFailures.length ? 'warning' : flows.length ? 'ready' : 'processing';
  const overallLabel = loadError ? 'Dados incompletos' : flowsWithFailures.length ? 'Requer atencao' : flows.length ? 'Flows saudaveis' : 'Pronto para criar';

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flows"
        title="Saude dos seus flows"
        icon="solar:heart-pulse-bold-duotone"
        description="Acompanhe se seus recursos pagos estao prontos para receber usuarios finais."
        action={<Link to="/create-flow" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Criar flow</Link>}
      />

      <WorkspaceContextBanner
        eyebrow="Seu produto"
        title={overallLabel}
        icon="solar:heart-pulse-bold-duotone"
        tone={overallTone}
        description="Esta pagina responde a pergunta: meus dispositivos, APIs ou feeds estao cobrando e liberando acesso do jeito esperado?"
        checkpoints={['Configuracao', 'Checkout', 'Pagamentos', 'Falhas']}
        primaryAction={{ to: '/checkout', label: 'Testar checkout' }}
        secondaryAction={{ to: '/status', label: 'Status do Kivo' }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Flows ativos" value={activeFlows.length.toString()} detail={`${flows.length} no total`} icon="solar:bolt-circle-bold-duotone" tone="emerald" />
        <StatCard title="Setup" value={totalChecklist ? `${completedChecklist}/${totalChecklist}` : '0/0'} detail="Checks completos" icon="solar:checklist-minimalistic-bold-duotone" tone={completedChecklist === totalChecklist && totalChecklist ? 'emerald' : 'amber'} />
        <StatCard title="Receita" value={formatCurrency(summary.data?.totalVolumeUsdc ?? 0)} detail={`${summary.data?.confirmedPayments ?? 0} confirmados`} icon="solar:wallet-money-bold-duotone" tone="blue" />
        <StatCard title="Falhas" value={flowsWithFailures.length.toString()} detail={flowsWithFailures.length ? 'flows com falha' : 'nenhuma falha recente'} icon="solar:danger-circle-bold-duotone" tone={flowsWithFailures.length ? 'red' : 'neutral'} />
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Flows monitorados</h2>
            <p className="mt-1 text-sm text-neutral-500">Cada flow mostra configuracao, uso e risco operacional em linguagem de produto.</p>
          </div>
          <Badge tone={overallTone}>{overallLabel}</Badge>
        </div>

        <div className="mt-5 space-y-3">
          {flows.map((flow) => {
            const complete = flow.setupChecklist.filter((item) => item.complete).length;
            const total = flow.setupChecklist.length;
            const tone = flow.failedPaymentsCount ? 'failed' : complete === total ? 'ready' : 'warning';
            return (
              <Link key={flow.id} to={`/flows/${flow.id}`} className="block rounded-2xl border border-white/5 bg-black/25 p-4 transition hover:border-emerald-500/25 hover:bg-white/[0.04]">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-white">{flow.name}</h3>
                      <Badge tone={tone}>{flow.failedPaymentsCount ? 'Atenção' : complete === total ? 'Pronto' : 'Setup pendente'}</Badge>
                    </div>
                    <p className="mt-1 break-all text-sm text-neutral-500">{flow.resource}</p>
                    <p className="mt-2 text-sm text-neutral-400">
                      {flow.price} por {flow.unit} · {flow.paymentsCount} pagamentos · {formatCurrency(flow.revenueUsdc)} em receita
                    </p>
                  </div>
                  <p className="text-xs text-neutral-600">{flow.lastActivityAt ? `Atualizado ${formatDateTime(flow.lastActivityAt)}` : 'Sem atividade ainda'}</p>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  {flow.setupChecklist.map((item) => (
                    <div key={item.id} className={`rounded-xl border px-3 py-2 text-xs font-bold ${item.complete ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/20 bg-amber-500/10 text-amber-200'}`}>
                      <Icon icon={item.complete ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'} className="mr-1 inline text-sm" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </Link>
            );
          })}

          {!flows.length && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
              <Icon icon="solar:bolt-circle-bold-duotone" className="mx-auto text-4xl text-emerald-300" />
              <h3 className="mt-3 font-bricolage text-xl font-bold text-white">Nenhum flow para monitorar ainda</h3>
              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">
                Crie um flow de device, API ou dados para acompanhar saude, setup e pagamentos aqui.
              </p>
              <Link to="/create-flow" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
                Criar primeiro flow
              </Link>
            </div>
          )}
        </div>

        {loadError && <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{loadError}</p>}
      </Card>
    </div>
  );
}
