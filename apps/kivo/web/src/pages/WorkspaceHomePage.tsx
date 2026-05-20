import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { getAvailableTemplates, getComingSoonTemplates, getOwnedTemplates } from '@/data/templateMarketplace';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useAuthStore, useTemplateLibraryStore } from '@/stores';
import { formatCurrency, formatDateTime, shortId, statusLabel } from '@/utils/format';

const loaderLabels = {
  summary: 'Resumo',
  health: 'Saude',
  etherfuse: 'Etherfuse',
  payments: 'Pagamentos',
  gateways: 'Gateways',
  totems: 'Templates',
  sessions: 'Sessoes',
} as const;

const productModules = [
  {
    id: 'studio',
    title: 'Kivo Studio',
    route: '/studio',
    icon: 'solar:stars-line-duotone',
    description: 'AI agents para desenhar solucao, arquitetura, SDK/config e checklist.',
  },
  {
    id: 'marketplace',
    title: 'Marketplace',
    route: '/marketplace',
    icon: 'solar:widget-linear',
    description: 'Templates prontos, roadmap e comunidade publica.',
  },
  {
    id: 'library',
    title: 'Biblioteca',
    route: '/library',
    icon: 'solar:folder-with-files-linear',
    description: 'Templates adquiridos, configuracao e pacote do runtime.',
  },
  {
    id: 'gateway',
    title: 'Gateway',
    route: '/gateway',
    icon: 'solar:server-square-cloud-linear',
    description: 'Runtimes fisicos e digitais conectados ao backend Kivo.',
  },
  {
    id: 'sdk',
    title: 'SDK TypeScript',
    route: '/sdk',
    icon: 'solar:code-square-linear',
    description: 'Adapters, snippets e contratos para integracao propria.',
  },
  {
    id: 'validation',
    title: 'Validacao',
    route: '/validation',
    icon: 'solar:shield-check-linear',
    description: 'Provas x402, Etherfuse, Stellar e release do Gateway.',
  },
  {
    id: 'launch',
    title: 'Launch & Billing',
    route: '/launch',
    icon: 'solar:rocket-linear',
    description: 'Publicacao testnet, mainnet privada ou template publico.',
  },
];

const sortByNewest = (left?: string, right?: string) => {
  const leftTime = left ? Date.parse(left) : 0;
  const rightTime = right ? Date.parse(right) : 0;

  return rightTime - leftTime;
};

export default function WorkspaceHomePage() {
  const user = useAuthStore((state) => state.user);
  const libraryItems = useTemplateLibraryStore((state) => state.items);
  const summary = useAsyncData(() => kivoClient.getDashboardSummary(), []);
  const health = useAsyncData(() => kivoClient.getHealth(), []);
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const payments = useAsyncData(() => kivoClient.listPayments(), []);
  const gateways = useAsyncData(() => kivoClient.listGateways(), []);
  const powerTotems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const sessions = useAsyncData(() => kivoClient.listPowerSessions(), []);

  const workspaceName = user?.organization?.trim() || 'Kivo workspace';
  const ownedTemplates = getOwnedTemplates(libraryItems.map((item) => item.templateId));
  const availableTemplates = getAvailableTemplates();
  const comingSoonTemplates = getComingSoonTemplates();
  const summaryData = summary.data;
  const healthData = health.data ?? summaryData?.health;
  const paymentList = payments.data ?? [];
  const gatewayList = gateways.data ?? [];
  const totemList = powerTotems.data ?? [];
  const sessionList = sessions.data ?? [];
  const onlineGateways = gatewayList.filter((gateway) => gateway.status === 'online');
  const activeTotems = totemList.filter((totem) => ['active', 'testing', 'pairing'].includes(totem.status));
  const completedSessions = sessionList.filter((session) => ['authorized', 'running', 'completed'].includes(session.status));
  const confirmedPayments = paymentList.filter((payment) => payment.status === 'confirmed');
  const totalRevenue = summaryData?.totalVolumeUsdc ?? confirmedPayments.reduce((total, payment) => total + Number(payment.amount || 0), 0);
  const platformReady = healthData?.api === 'ok' && healthData?.stellar === 'ok' && Boolean(etherfuse.data?.configured);
  const validationReady = platformReady && onlineGateways.length > 0 && completedSessions.length > 0;

  const loaders = [
    { id: 'summary', label: loaderLabels.summary, state: summary },
    { id: 'health', label: loaderLabels.health, state: health },
    { id: 'etherfuse', label: loaderLabels.etherfuse, state: etherfuse },
    { id: 'payments', label: loaderLabels.payments, state: payments },
    { id: 'gateways', label: loaderLabels.gateways, state: gateways },
    { id: 'totems', label: loaderLabels.totems, state: powerTotems },
    { id: 'sessions', label: loaderLabels.sessions, state: sessions },
  ];
  const failedLoaders = loaders.filter((loader) => loader.state.error);
  const loadingLoaders = loaders.filter((loader) => loader.state.loading);
  const hasLoadErrors = failedLoaders.length > 0;
  const isInitialLoad = loadingLoaders.length > 0 && loaders.every((loader) => !loader.state.data);

  const recentActivity = [
      ...paymentList.map((payment) => ({
        id: `payment-${payment.id}`,
        label: `Pagamento ${statusLabel(payment.status)}`,
        detail: `${payment.amount} ${payment.assetCode} - ${formatDateTime(payment.createdAt)}`,
        route: `/payments/${payment.id}`,
        tone: payment.status === 'confirmed' ? 'ready' : payment.status === 'failed' ? 'failed' : 'processing',
        icon: 'solar:card-transfer-bold-duotone',
        date: payment.createdAt,
      })),
      ...gatewayList.map((gateway) => ({
        id: `gateway-${gateway.id}`,
        label: `Gateway ${gateway.status}`,
        detail: `${gateway.name} - ${gateway.lastSeenAt ? formatDateTime(gateway.lastSeenAt) : 'sem heartbeat recente'}`,
        route: '/gateway',
        tone: gateway.status === 'online' ? 'ready' : gateway.status === 'suspended' ? 'failed' : 'warning',
        icon: 'solar:server-square-cloud-linear',
        date: gateway.updatedAt,
      })),
      ...totemList.map((totem) => ({
        id: `totem-${totem.id}`,
        label: `Template configurado`,
        detail: `${totem.name} - ${totem.price}/${totem.unit}`,
        route: `/totems/${totem.id}`,
        tone: totem.status === 'active' ? 'ready' : totem.status === 'failed' ? 'failed' : 'processing',
        icon: 'solar:bolt-circle-bold-duotone',
        date: totem.updatedAt,
      })),
    ].sort((left, right) => sortByNewest(left.date, right.date)).slice(0, 6);

  const nextStep = getNextStep({
    hasTemplate: ownedTemplates.length > 0,
    hasConfiguredResource: totemList.length > 0,
    hasGateway: gatewayList.length > 0,
    hasCheckout: completedSessions.length > 0 || confirmedPayments.length > 0,
    validationReady,
  });

  const productStages = [
    {
      label: 'Studio',
      route: '/studio',
      icon: 'solar:stars-line-duotone',
      status: 'active',
      detail: 'Criar solucao custom com AI agents.',
    },
    {
      label: 'Marketplace',
      route: '/marketplace',
      icon: 'solar:widget-linear',
      status: availableTemplates.length ? 'ready' : 'warning',
      detail: `${availableTemplates.length} template disponivel; ${comingSoonTemplates.length} em roadmap.`,
    },
    {
      label: 'Biblioteca',
      route: '/library',
      icon: 'solar:folder-with-files-linear',
      status: ownedTemplates.length ? 'ready' : 'pending',
      detail: ownedTemplates.length ? `${ownedTemplates.length} template adquirido` : 'Nenhum template adquirido.',
    },
    {
      label: 'Gateway',
      route: '/gateway',
      icon: 'solar:server-square-cloud-linear',
      status: gatewayList.length ? 'ready' : 'pending',
      detail: gatewayList.length ? `${onlineGateways.length}/${gatewayList.length} online` : 'Nenhum runtime provisionado.',
    },
    {
      label: 'Checkout',
      route: '/checkout',
      icon: 'solar:card-transfer-bold-duotone',
      status: completedSessions.length || confirmedPayments.length ? 'ready' : 'pending',
      detail: completedSessions.length ? `${completedSessions.length} sessoes autorizadas` : 'Aguardando primeiro pagamento.',
    },
    {
      label: 'Validacao',
      route: '/validation',
      icon: 'solar:shield-check-linear',
      status: validationReady ? 'ready' : platformReady ? 'active' : 'warning',
      detail: validationReady ? 'Caminho validado.' : 'Aguardando x402, Etherfuse e Gateway.',
    },
    {
      label: 'Launch',
      route: '/launch',
      icon: 'solar:rocket-linear',
      status: validationReady ? 'active' : 'pending',
      detail: validationReady ? 'Preparar publicacao.' : 'Disponivel apos validacao.',
    },
  ];

  const retryFailedLoaders = () => {
    void Promise.all(failedLoaders.map((loader) => loader.state.reload()));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo command center"
        title={`Construa, valide e publique flows pagos em ${workspaceName}`}
        icon="solar:home-2-bold-duotone"
        description="Orquestre Studio com AI agents, templates, SDK, Gateway fisico/digital, validacao x402/Etherfuse e publicacao em um unico lugar."
        action={
          <div className="flex flex-wrap gap-3">
            <Link
              to={nextStep.route}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400"
            >
              {nextStep.action}
              <Icon icon="solar:arrow-right-linear" className="text-lg" />
            </Link>
            <Link
              to="/studio"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
            >
              Abrir Studio
              <Icon icon="solar:stars-line-duotone" className="text-lg" />
            </Link>
          </div>
        }
      />

      {(hasLoadErrors || isInitialLoad) && (
        <Card className="border-amber-500/20 bg-amber-500/[0.06]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Icon
                  icon={hasLoadErrors ? 'solar:danger-triangle-bold-duotone' : 'solar:refresh-circle-bold-duotone'}
                  className={hasLoadErrors ? 'text-2xl text-amber-300' : 'text-2xl text-blue-300'}
                />
                <h2 className="font-bricolage text-lg font-bold text-white">
                  {hasLoadErrors ? 'Leitura parcial do workspace' : 'Carregando command center'}
                </h2>
              </div>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {hasLoadErrors
                  ? 'A Home mostra os dados disponiveis e sinaliza o que ainda nao respondeu.'
                  : 'Buscando status da API, Etherfuse, gateways, templates, pagamentos e sessoes.'}
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
                      className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-200 transition hover:border-amber-300/50"
                    >
                      <Icon icon="solar:refresh-linear" />
                      Tentar {loader.label}
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
              <Badge tone="processing">{loadingLoaders.length} carregando</Badge>
            )}
          </div>
        </Card>
      )}

      <section className="grid gap-6 xl:grid-cols-[1.12fr_0.88fr]">
        <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),rgba(15,23,42,0.74)]">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Badge tone={validationReady ? 'ready' : ownedTemplates.length ? 'processing' : 'warning'}>
                {validationReady ? 'pronto para launch' : ownedTemplates.length ? 'em construcao' : 'comece por template ou Studio'}
              </Badge>
              <h2 className="mt-4 max-w-3xl font-bricolage text-3xl font-bold leading-tight text-white md:text-4xl">
                Seu cockpit para monetizar qualquer recurso com x402.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300">
                Fisico, digital ou hibrido: desenhe a solucao, escolha ou crie templates, conecte um Gateway e valide o fluxo antes de publicar.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4 lg:w-72">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Proximo melhor passo</p>
              <h3 className="mt-2 font-bricolage text-xl font-bold text-white">{nextStep.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">{nextStep.description}</p>
              <Link to={nextStep.route} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
                {nextStep.action}
                <Icon icon="solar:arrow-right-linear" />
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <ProductSignal label="Templates" value={ownedTemplates.length ? ownedTemplates.map((template) => template.shortName).join(', ') : 'Nenhum'} detail={`${availableTemplates.length} disponivel agora`} />
            <ProductSignal label="Gateway" value={gatewayList.length ? `${onlineGateways.length}/${gatewayList.length} online` : 'Nao provisionado'} detail="Fisico ou digital" />
            <ProductSignal label="Validacao" value={validationReady ? 'Completa' : 'Pendente'} detail="x402 + Etherfuse + release" />
            <ProductSignal label="Launch" value={validationReady ? 'Preparar' : 'Bloqueado'} detail="Mainnet privada ou publico" />
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Status do workspace</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Sinais reais que afetam qualquer template ou flow.</p>
            </div>
            <Badge tone={platformReady ? 'ready' : 'warning'}>{platformReady ? 'base pronta' : 'revisar conexoes'}</Badge>
          </div>
          <div className="mt-5 grid gap-3">
            <HealthRow label="Kivo API" value={statusLabel(healthData?.api === 'ok' ? 'online' : healthData?.api ?? 'degraded')} tone={healthData?.api === 'ok' ? 'ready' : 'warning'} />
            <HealthRow label="Stellar" value={statusLabel(healthData?.stellar === 'ok' ? 'online' : healthData?.stellar ?? 'degraded')} tone={healthData?.stellar === 'ok' ? 'ready' : 'warning'} />
            <HealthRow label="Etherfuse" value={etherfuse.data?.configured ? etherfuse.data.mode : 'pendente'} tone={etherfuse.data?.configured ? 'ready' : 'warning'} />
            <HealthRow label="x402" value={completedSessions.length || confirmedPayments.length ? 'com evidencias' : 'sem validacao'} tone={completedSessions.length || confirmedPayments.length ? 'ready' : 'neutral'} />
          </div>
        </Card>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Templates"
          value={ownedTemplates.length.toString()}
          detail={`${availableTemplates.length} disponivel, ${comingSoonTemplates.length} em breve`}
          icon="solar:widget-bold-duotone"
          tone={ownedTemplates.length ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Gateways"
          value={gatewayList.length.toString()}
          detail={`${onlineGateways.length} online`}
          icon="solar:server-square-cloud-bold-duotone"
          tone={gatewayList.length ? 'emerald' : 'neutral'}
        />
        <StatCard
          title="Recursos"
          value={activeTotems.length.toString()}
          detail={`${totemList.length} configurados`}
          icon="solar:bolt-circle-bold-duotone"
          tone={activeTotems.length ? 'blue' : 'neutral'}
        />
        <StatCard
          title="Pagamentos"
          value={(summaryData?.confirmedPayments ?? confirmedPayments.length).toString()}
          detail={`${summaryData?.pendingPayments ?? 0} pendentes`}
          icon="solar:card-transfer-bold-duotone"
          tone="violet"
        />
        <StatCard
          title="Receita"
          value={formatCurrency(totalRevenue)}
          detail="volume confirmado"
          icon="solar:wallet-money-bold-duotone"
          tone={totalRevenue > 0 ? 'emerald' : 'neutral'}
        />
      </div>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Trilha do produto</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Da ideia ate launch, sem depender de um unico template.</p>
          </div>
          <Link to="/launch" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
            Ver launch
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {productStages.map((stage, index) => (
            <Link key={stage.label} to={stage.route} className="group rounded-2xl border border-white/5 bg-black/25 p-4 transition-colors hover:border-emerald-500/25 hover:bg-white/[0.04]">
              <div className="flex items-start justify-between gap-3">
                <Icon icon={stage.icon} className="text-2xl text-emerald-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600">0{index + 1}</span>
              </div>
              <p className="mt-4 text-sm font-bold text-white">{stage.label}</p>
              <p className="mt-2 min-h-10 text-xs leading-5 text-neutral-500">{stage.detail}</p>
              <Badge tone={stage.status}>{stageLabel(stage.status)}</Badge>
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Modulos do Kivo</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Entrada rapida para cada parte do produto final.</p>
            </div>
            <Badge tone="neutral">{productModules.length} modulos</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {productModules.map((module) => (
              <Link key={module.id} to={module.route} className="group rounded-2xl border border-white/5 bg-black/25 p-4 transition-colors hover:border-emerald-500/25 hover:bg-white/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-white/[0.04] text-emerald-300">
                    <Icon icon={module.icon} className="text-2xl" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-bold text-white">{module.title}</h3>
                      <Icon icon="solar:arrow-right-linear" className="shrink-0 text-neutral-600 transition-transform group-hover:translate-x-1 group-hover:text-emerald-300" />
                    </div>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{module.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Atividade recente</h2>
              <p className="mt-1 text-sm leading-6 text-neutral-500">Eventos reais do workspace, quando existirem.</p>
            </div>
            <Link to="/status" className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 hover:text-emerald-300">
              Status
              <Icon icon="solar:arrow-right-linear" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity.length ? (
              recentActivity.map((item) => (
                <Link key={item.id} to={item.route} className="flex items-start justify-between gap-4 rounded-xl border border-white/5 bg-black/25 p-4 transition-colors hover:border-white/15 hover:bg-white/[0.04]">
                  <div className="flex min-w-0 items-start gap-3">
                    <Icon icon={item.icon} className="mt-0.5 shrink-0 text-xl text-emerald-300" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-white">{item.label}</p>
                      <p className="mt-1 truncate text-xs text-neutral-500">{item.detail}</p>
                    </div>
                  </div>
                  <Badge tone={item.tone}>{shortId(item.id)}</Badge>
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-black/25 p-6 text-center">
                <Icon icon="solar:clipboard-list-linear" className="mx-auto text-4xl text-neutral-600" />
                <h3 className="mt-3 font-bricolage text-lg font-bold text-white">Sem atividade operacional ainda</h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
                  Quando templates, gateways, sessoes ou pagamentos forem criados, eles aparecem aqui.
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function getNextStep({
  hasTemplate,
  hasConfiguredResource,
  hasGateway,
  hasCheckout,
  validationReady,
}: {
  hasTemplate: boolean;
  hasConfiguredResource: boolean;
  hasGateway: boolean;
  hasCheckout: boolean;
  validationReady: boolean;
}) {
  if (!hasTemplate) {
    return {
      title: 'Escolha um template',
      description: 'Adquira o Power Totem ou acompanhe os proximos templates no Marketplace.',
      action: 'Abrir Marketplace',
      route: '/marketplace',
    };
  }

  if (!hasConfiguredResource) {
    return {
      title: 'Configure o template',
      description: 'Abra a Biblioteca para criar o recurso real e preparar o Gateway.',
      action: 'Abrir Biblioteca',
      route: '/library/power-totem',
    };
  }

  if (!hasGateway) {
    return {
      title: 'Conecte um Gateway',
      description: 'Gere o bundle Docker e rode o runtime fisico ou digital.',
      action: 'Provisionar Gateway',
      route: '/library/power-totem',
    };
  }

  if (!hasCheckout) {
    return {
      title: 'Execute o primeiro checkout',
      description: 'Crie uma sessao x402 e confirme a liberacao do recurso.',
      action: 'Abrir Checkout',
      route: '/checkout',
    };
  }

  if (!validationReady) {
    return {
      title: 'Feche a validacao',
      description: 'Consolide x402, Etherfuse, Stellar e release do Gateway.',
      action: 'Validar flow',
      route: '/validation',
    };
  }

  return {
    title: 'Prepare o launch',
    description: 'Escolha mainnet privada, testnet ou publicacao como template publico.',
    action: 'Abrir Launch',
    route: '/launch',
  };
}

function ProductSignal({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="mt-2 truncate font-bricolage text-xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-neutral-500">{detail}</p>
    </div>
  );
}

function HealthRow({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/5 bg-black/25 p-4">
      <p className="text-sm font-bold text-white">{label}</p>
      <Badge tone={tone}>{value}</Badge>
    </div>
  );
}

function stageLabel(status: string) {
  if (status === 'ready') return 'pronto';
  if (status === 'active') return 'proximo';
  if (status === 'warning') return 'atencao';
  return 'pendente';
}
