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
  const platformOnline = system?.api === 'ok' && system.db === 'ok' && system.stellar === 'ok';
  const serviceRows = [
    { id: 'app', label: 'Aplicacao Kivo', description: 'Frontend, login e experiencia do workspace.', status: system?.api ?? 'degraded', icon: 'solar:monitor-bold-duotone' },
    { id: 'db', label: 'Dados e autenticacao', description: 'Supabase Auth, banco e regras de acesso.', status: system?.db ?? 'degraded', icon: 'solar:database-bold-duotone' },
    { id: 'stellar', label: 'Liquidacao Stellar', description: 'Rede usada para confirmar pagamentos assinados.', status: system?.stellar ?? 'degraded', icon: 'solar:star-fall-bold-duotone' },
    { id: 'workers', label: 'Automacoes', description: 'Processos que acompanham pagamentos, webhooks e eventos.', status: system?.workers ?? 'degraded', icon: 'solar:refresh-circle-bold-duotone' },
    { id: 'anchor', label: 'Etherfuse Devnet', description: 'Rampa e anchor para funding antes do checkout.', status: etherfuse.data?.configured ? 'ok' : 'degraded', icon: 'solar:banknote-2-bold-duotone' },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Sistema"
        title="Status do Kivo"
        icon="solar:pulse-2-bold-duotone"
        description="Visao simples da disponibilidade da plataforma que sustenta os workspaces Kivo."
        action={<Link to="/health" className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-white hover:bg-white/5">Ver meus flows</Link>}
      />

      <WorkspaceContextBanner
        eyebrow="Plataforma"
        title={platformOnline ? 'Kivo operacional' : 'Kivo precisa de atencao'}
        icon="solar:shield-check-bold-duotone"
        tone={platformOnline ? 'ready' : 'warning'}
        description="Esta pagina responde a pergunta: o Kivo esta pronto para autenticar, cobrar e liquidar pagamentos agora?"
        checkpoints={['Frontend', 'Supabase', 'Stellar', 'Etherfuse']}
        primaryAction={{ to: '/dashboard', label: 'Voltar para Home' }}
        secondaryAction={{ to: '/deploy', label: 'Checklist de deploy' }}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Plataforma"
          value={platformOnline ? 'Online' : 'Atenção'}
          detail={health.error ?? 'Servicos principais monitorados'}
          icon="solar:pulse-2-bold-duotone"
          tone={platformOnline ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Anchor"
          value={etherfuse.data?.configured ? 'Conectada' : 'Pendente'}
          detail={etherfuse.data ? formatProviderModeLabel(etherfuse.data.mode) : etherfuse.error ?? 'checando Etherfuse'}
          icon="solar:banknote-2-bold-duotone"
          tone={etherfuse.data?.configured ? 'emerald' : 'amber'}
        />
        <StatCard
          title="Ambiente"
          value={etherfuse.data?.network ?? 'testnet'}
          detail={system?.version ? 'Versao validada no backend' : 'Aguardando leitura'}
          icon="solar:server-square-cloud-bold-duotone"
          tone="blue"
        />
      </div>

      <Card>
        <h2 className="font-bricolage text-xl font-bold text-white">Servicos principais</h2>
        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {serviceRows.map((service) => (
            <div key={service.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-emerald-300">
                    <Icon icon={service.icon} className="text-xl" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-white">{service.label}</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-500">{service.description}</p>
                  </div>
                </div>
                <Badge tone={healthTone(service.status)}>{statusLabel(healthTone(service.status))}</Badge>
              </div>
            </div>
          ))}
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
