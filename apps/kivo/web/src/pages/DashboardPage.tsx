import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatCurrency, formatDateTime, shortId, statusLabel } from '@/utils/format';

export default function DashboardPage() {
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const workflows = useAsyncData(() => kivoClient.listWorkflows(), []);

  if (summary.loading && !summary.data) {
    return <div className="h-96 rounded-2xl border border-white/5 bg-neutral-900 animate-pulse" />;
  }

  if (summary.error || !summary.data) {
    const normalizedError = summary.error?.toLowerCase() ?? '';
    const authHint =
      normalizedError.includes('supabase jwt') ||
      normalizedError.includes('supabase access token') ||
      normalizedError.includes('api key');

    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Kivo"
          title="Dashboard indisponivel"
          icon="solar:danger-triangle-bold-duotone"
          description="O shell carregou, mas a API nao retornou o resumo operacional."
        />

        <Card>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300">
                <Icon icon="solar:shield-warning-bold-duotone" className="text-2xl" />
              </div>
              <h2 className="font-bricolage text-2xl font-bold text-white">Nao foi possivel carregar o dashboard</h2>
              <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                {summary.error ?? 'A API nao retornou dados para o resumo.'}
              </p>
              {authHint ? (
                <p className="mt-4 text-sm leading-6 text-neutral-400">
                  Esse erro normalmente significa que o frontend esta autenticado no Supabase, mas a Kivo API nao conseguiu validar o token.
                  Confira se `SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` pertencem ao mesmo projeto usado em `VITE_SUPABASE_URL` e depois faca um novo login.
                </p>
              ) : (
                <p className="mt-4 text-sm leading-6 text-neutral-400">
                  Recarregue a chamada; se persistir, confira a saude da API em `/v1/health` e os logs da Supabase Edge Function.
                </p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={() => void summary.reload()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400"
              >
                Tentar novamente
                <Icon icon="solar:refresh-bold" />
              </button>
              <Link to="/settings" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">
                Ver configuracao
                <Icon icon="solar:settings-bold" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const healthEntries = Object.entries(summary.data.health).filter(([key]) => key !== 'version');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo"
        title="Operação M2M em tempo real"
        icon="solar:widget-5-bold-duotone"
        description="Controle devices, pagamentos condicionais, x402 e MCP a partir de um console operacional conectado ao contrato de API futuro."
        action={
          <Link to="/payments" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            Criar pagamento
            <Icon icon="solar:add-circle-bold" />
          </Link>
        }
      />

      <WorkspaceContextBanner
        eyebrow="Console avancado"
        title="Painel tecnico para operador e equipe de produto"
        icon="solar:widget-5-bold-duotone"
        tone="active"
        description="Esta area continua existindo para debug, saude e filas. A primeira experiencia do usuario agora fica na Home do workspace."
        checkpoints={['Health API', 'Worker queue', 'Atividade recente']}
        primaryAction={{ to: '/dashboard', label: 'Home do workspace' }}
        secondaryAction={{ to: '/operations', label: 'Operacao' }}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Devices" value={summary.data.totalDevices.toString()} detail={`${summary.data.activeDevices} ativos`} icon="solar:devices-bold-duotone" />
        <StatCard title="Volume USDC" value={formatCurrency(summary.data.totalVolumeUsdc)} icon="solar:wallet-money-bold-duotone" tone="blue" />
        <StatCard title="Confirmados" value={summary.data.confirmedPayments.toString()} icon="solar:check-circle-bold-duotone" tone="emerald" />
        <StatCard title="Pendentes" value={summary.data.pendingPayments.toString()} icon="solar:hourglass-bold-duotone" tone="amber" />
        <StatCard title="Falhas" value={summary.data.failedPayments.toString()} icon="solar:danger-circle-bold-duotone" tone="red" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Atividade recente</h2>
              <p className="text-sm text-neutral-500">Pagamentos, condições e liquidação Stellar.</p>
            </div>
            <Link to="/payments" className="text-xs font-bold text-emerald-400 hover:text-emerald-300">Ver todos</Link>
          </div>
          <div className="divide-y divide-white/5">
            {(payments.data ?? []).slice(0, 5).map((payment) => (
              <Link key={payment.id} to={`/payments/${payment.id}`} className="flex flex-col gap-3 py-4 hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-emerald-400">{shortId(payment.id)}</code>
                    <Badge tone={payment.status}>{statusLabel(payment.status)}</Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-white">{payment.amount} {payment.assetCode} · {payment.conditionType}</p>
                  <p className="mt-1 text-xs text-neutral-500">{payment.memo ?? 'sem memo'} · {formatDateTime(payment.createdAt)}</p>
                </div>
                <Icon icon="solar:arrow-right-up-linear" className="hidden text-neutral-600 md:block" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Saúde do sistema</h2>
          <p className="mt-1 text-sm text-neutral-500">Status reportado diretamente pelo health check `/v1/health`.</p>
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

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Jobs e automações</h2>
            <p className="text-sm text-neutral-500">Supabase Edge agora, Temporal como visão futura de orquestração durável.</p>
          </div>
          <Link to="/workflows" className="text-xs font-bold text-emerald-400">Abrir workflows</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {(workflows.data ?? []).slice(0, 2).map((workflow) => (
            <div key={workflow.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white">{workflow.name}</h3>
                  <p className="mt-1 text-xs text-neutral-500">{workflow.trigger}</p>
                </div>
                <Badge tone={workflow.status}>{statusLabel(workflow.status)}</Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {workflow.steps.map((step) => (
                  <span key={step.id} className="rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-neutral-400">{step.label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
