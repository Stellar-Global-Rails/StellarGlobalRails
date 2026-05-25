import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime } from '@/utils/format';

const readySessionStatuses = new Set(['authorized', 'running', 'completed']);

export default function HealthPage() {
  const health = useAsyncData(() => kivoClient.getHealth(), []);
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);
  const powerTotems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const powerSessions = useAsyncData(() => kivoClient.listPowerSessions(), []);

  const totems = powerTotems.data ?? [];
  const sessions = powerSessions.data ?? [];
  const activeTotems = totems.filter((totem) => ['active', 'testing', 'pairing'].includes(totem.status));
  const readySessions = sessions.filter((session) => readySessionStatuses.has(session.status));
  const failedSessions = sessions.filter((session) => session.status === 'failed' || session.status === 'expired');
  const latestTotem = [...totems].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const loadError = health.error || etherfuse.error || powerTotems.error || powerSessions.error;
  const platformReady = health.data?.api === 'ok' && health.data?.stellar === 'ok' && etherfuse.data?.configured;
  const gatewayReady = sessions.some((session) => ['running', 'completed'].includes(session.status));
  const runtimeReady = platformReady && activeTotems.length > 0 && gatewayReady;
  const overallTone = loadError || failedSessions.length || (platformReady && activeTotems.length && !gatewayReady) ? 'warning' : runtimeReady ? 'ready' : 'processing';
  const overallLabel = loadError
    ? 'Leitura parcial'
    : runtimeReady
      ? 'Runtime pronto'
      : platformReady && activeTotems.length && !gatewayReady
        ? 'Aguardando gateway'
        : 'Preparando runtime';

  const readiness = [
    {
      id: 'totem',
      label: 'Estacao EV criada',
      complete: activeTotems.length > 0,
      detail: activeTotems.length ? `${activeTotems.length} estacao ativa/teste` : 'Configure o template na Biblioteca antes do checkout.',
    },
    {
      id: 'x402',
      label: 'x402 de sessao',
      complete: sessions.some((session) => session.x402Nonce || session.status !== 'requested'),
      detail: sessions.length ? `${sessions.length} sessoes registradas` : 'Inicie um checkout para gerar o challenge.',
    },
    {
      id: 'stellar',
      label: 'Stellar settlement',
      complete: health.data?.stellar === 'ok',
      detail: health.data?.stellar === 'ok' ? 'Horizon e validacao ativos.' : 'Aguardando health ok do backend.',
    },
    {
      id: 'etherfuse',
      label: 'Etherfuse funding',
      complete: Boolean(etherfuse.data?.configured),
      detail: etherfuse.data?.configured ? `${etherfuse.data.mode} em ${etherfuse.data.network}` : 'Anchor/funding ainda nao confirmado.',
    },
    {
      id: 'gateway',
      label: 'Gateway local',
      complete: gatewayReady,
      detail: 'Instale o pacote Docker no Raspberry ou mini PC para reportar eventos.',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo EV Charge"
        title="Saude da recarga EV"
        icon="solar:electric-refueling-bold-duotone"
        description="EV Charge: flow, gateway, x402, Stellar, Etherfuse e autorizacao de sessao."
        action={<Link to="/studio" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Abrir Studio</Link>}
      />

      <WorkspaceContextBanner
        eyebrow="Demo readiness"
        title={overallLabel}
        icon="solar:shield-check-bold-duotone"
        tone={overallTone}
        description="Esta pagina acompanha se o caminho de palco esta pronto: criar estacao, cobrar por x402/Stellar, autorizar uma sessao curta e receber evento do gateway."
        checkpoints={['EV Charge', 'x402', 'Stellar', 'Etherfuse', 'Gateway']}
        primaryAction={{ to: '/checkout', label: 'Testar checkout' }}
        secondaryAction={{ to: '/library/power-totem', label: 'Abrir template' }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Estacoes" value={activeTotems.length.toString()} detail={`${totems.length} cadastradas`} icon="solar:electric-refueling-bold-duotone" tone={activeTotems.length ? 'emerald' : 'amber'} />
        <StatCard title="Sessoes" value={readySessions.length.toString()} detail={`${sessions.length} no total`} icon="solar:bolt-circle-bold-duotone" tone={readySessions.length ? 'emerald' : 'blue'} />
        <StatCard title="Stellar" value={health.data?.stellar === 'ok' ? 'OK' : 'Pendente'} detail={health.error ?? 'health do backend'} icon="solar:star-fall-bold-duotone" tone={health.data?.stellar === 'ok' ? 'emerald' : 'amber'} />
        <StatCard title="Gateway" value={readiness[4].complete ? 'Eventos' : 'Aguardando'} detail={readiness[4].detail} icon="solar:radio-minimalistic-bold-duotone" tone={readiness[4].complete ? 'emerald' : 'amber'} />
      </div>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Checklist EV Charge</h2>
            <p className="mt-1 text-sm text-neutral-500">O que precisa estar verde antes de operar a recarga EV.</p>
          </div>
          <Badge tone={overallTone}>{overallLabel}</Badge>
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {readiness.map((item) => (
            <div key={item.id} className={`rounded-2xl border p-4 ${item.complete ? 'border-emerald-500/20 bg-emerald-500/10' : 'border-amber-500/20 bg-amber-500/10'}`}>
              <div className="flex items-start gap-3">
                <Icon icon={item.complete ? 'solar:check-circle-bold' : 'solar:clock-circle-bold'} className={`mt-0.5 text-xl ${item.complete ? 'text-emerald-300' : 'text-amber-300'}`} />
                <div>
                  <p className="font-bold text-white">{item.label}</p>
                  <p className="mt-1 text-sm leading-6 text-neutral-400">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Ultima estacao EV</h2>
            <p className="mt-1 text-sm text-neutral-500">Resumo operacional para conferir QR, duracao e recurso protegido.</p>
          </div>
          {latestTotem && <Badge tone={latestTotem.status}>{latestTotem.status}</Badge>}
        </div>

        {latestTotem ? (
          <div className="mt-5 rounded-2xl border border-white/5 bg-black/25 p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h3 className="font-bold text-white">{latestTotem.name}</h3>
                <p className="mt-1 break-all font-mono text-xs text-emerald-200">{latestTotem.resource}</p>
                <p className="mt-2 text-sm text-neutral-400">
                  {latestTotem.price} por {latestTotem.unit} - {latestTotem.sessionDurationSeconds}s de autorizacao
                </p>
              </div>
              <p className="text-xs text-neutral-600">Atualizado {formatDateTime(latestTotem.updatedAt)}</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
            <Icon icon="solar:electric-refueling-bold-duotone" className="mx-auto text-4xl text-emerald-300" />
            <h3 className="mt-3 font-bricolage text-xl font-bold text-white">Nenhuma estacao EV criada ainda</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">
              Adquira o Kivo EV Charge no Marketplace e configure o template pela Biblioteca.
            </p>
            <Link to="/marketplace" className="mt-5 inline-flex rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              Abrir Marketplace
            </Link>
          </div>
        )}

        {loadError && <p className="mt-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{loadError}</p>}
      </Card>
    </div>
  );
}
