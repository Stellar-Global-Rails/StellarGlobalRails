import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { formatProviderModeLabel } from '@/config/productMode';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { formatDateTime, statusLabel } from '@/utils/format';

const healthTone = (value?: string) => {
  if (value === 'ok' || value === 'ready' || value === 'online') {
    return 'online';
  }
  if (value === 'down' || value === 'failed' || value === 'offline') {
    return 'failed';
  }
  return 'degraded';
};

export default function StatusPage() {
  const health = useAsyncData(() => kivoClient.getHealth(), []);
  const services = useAsyncData(() => kivoClient.listDeployServices(), []);
  const etherfuse = useAsyncData(() => kivoClient.getEtherfuseStatus(), []);

  const system = health.data;
  const gatewaySignal = typeof system?.gateway === 'string'
    ? system.gateway
    : typeof system?.gateways === 'string'
      ? system.gateways
      : undefined;
  const apiReady = system?.api === 'ok';
  const stellarReady = system?.stellar === 'ok';
  const etherfuseReady = Boolean(etherfuse.data?.configured);
  const gatewayReady = gatewaySignal === 'ok' || gatewaySignal === 'online';
  const powerPathReady = apiReady && stellarReady && etherfuseReady && gatewayReady;

  const readinessChecks = [
    {
      id: 'api',
      label: 'Kivo API',
      description: 'Supabase Edge Function responde as rotas de checkout e gateway.',
      status: system?.api ?? 'degraded',
      detail: health.error ?? (system?.version ? `Versao ${system.version}` : 'Aguardando leitura do health.'),
      icon: 'solar:server-square-cloud-bold-duotone',
    },
    {
      id: 'stellar',
      label: 'Stellar settlement',
      description: 'Backend consegue validar e liquidar pagamentos assinados no Horizon.',
      status: system?.stellar ?? 'degraded',
      detail: stellarReady ? 'Health Stellar ok.' : 'Aguardando health Stellar ok.',
      icon: 'solar:star-fall-bold-duotone',
    },
    {
      id: 'etherfuse',
      label: 'Etherfuse anchor/funding',
      description: 'Anchor e funding para demo estao configurados no servidor.',
      status: etherfuseReady ? 'ok' : 'degraded',
      detail: etherfuse.data ? `${formatProviderModeLabel(etherfuse.data.mode)} - ${etherfuse.data.network}` : etherfuse.error ?? 'Checando Etherfuse.',
      icon: 'solar:banknote-2-bold-duotone',
    },
    {
      id: 'gateway',
      label: 'Power Gateway heartbeat',
      description: 'Sinal do Gateway local instalado que marca a operacao online.',
      status: gatewaySignal ?? 'degraded',
      detail: gatewaySignal ? `Health reportou ${gatewaySignal}.` : 'Sem heartbeat agregado no status; instale o pacote Docker do Power Totem.',
      icon: 'solar:radio-minimalistic-bold-duotone',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Power Totem"
        title="Status do Power Totem"
        icon="solar:pulse-2-bold-duotone"
        description="Quatro sinais para decidir se o caminho Power Totem esta pronto para palco."
        action={<Link to="/health" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Ver readiness</Link>}
      />

      <WorkspaceContextBanner
        eyebrow="Go/No-Go"
        title={powerPathReady ? 'Power Totem pronto para teste' : 'Power Totem precisa de atencao'}
        icon="solar:shield-check-bold-duotone"
        tone={powerPathReady ? 'ready' : 'warning'}
        description="Use esta tela para conferir API, Stellar, Etherfuse e o sinal honesto do gateway antes de iniciar checkout e autorizacao fisica."
        checkpoints={['Kivo API', 'Stellar', 'Etherfuse', 'Gateway']}
        primaryAction={{ to: '/checkout', label: 'Abrir checkout' }}
        secondaryAction={{ to: '/library/power-totem', label: 'Abrir Power Totem' }}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Kivo API"
          value={apiReady ? 'OK' : 'Atencao'}
          detail={health.error ?? 'Edge health'}
          icon="solar:server-square-cloud-bold-duotone"
          tone={apiReady ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Stellar"
          value={stellarReady ? 'OK' : 'Atencao'}
          detail="Settlement XDR"
          icon="solar:star-fall-bold-duotone"
          tone={stellarReady ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Etherfuse"
          value={etherfuseReady ? 'OK' : 'Pendente'}
          detail={etherfuse.data ? formatProviderModeLabel(etherfuse.data.mode) : etherfuse.error ?? 'anchor/funding'}
          icon="solar:banknote-2-bold-duotone"
          tone={etherfuseReady ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Gateway"
          value={gatewayReady ? 'Online' : 'Aguardando'}
          detail="heartbeat do runtime local"
          icon="solar:radio-minimalistic-bold-duotone"
          tone={gatewayReady ? 'emerald' : 'amber'}
        />
      </div>

      <Card>
        <h2 className="font-bricolage text-xl font-bold text-white">Checks Power Totem</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {readinessChecks.map((check) => {
            const tone = healthTone(check.status);
            return (
              <div key={check.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-emerald-300">
                      <Icon icon={check.icon} className="text-xl" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-white">{check.label}</p>
                      <p className="mt-1 text-sm leading-6 text-neutral-500">{check.description}</p>
                      <p className="mt-2 text-xs text-neutral-600">{check.detail}</p>
                    </div>
                  </div>
                  <Badge tone={tone}>{statusLabel(tone)}</Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <h2 className="font-bricolage text-xl font-bold text-white">Infraestrutura conectada</h2>
        <div className="mt-4 divide-y divide-white/5">
          {(services.data ?? []).map((service) => (
            <div key={service.id} className="py-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-bold text-white">{service.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{service.description}</p>
                </div>
                <Badge tone={service.status}>{statusLabel(service.status)}</Badge>
              </div>
              <p className="mt-2 text-xs text-neutral-600">Atualizado {formatDateTime(service.updatedAt)}</p>
            </div>
          ))}
          {!services.data?.length && (
            <p className="py-6 text-sm text-neutral-500">{services.loading ? 'Carregando servicos...' : services.error ?? 'Nenhum servico reportado ainda.'}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
