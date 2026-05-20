import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { gatewayModes } from '@/data/studioExperience';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import type { GatewayStatus } from '@/types/kivo';
import { formatDateTime, shortId } from '@/utils/format';

const contract = [
  { label: 'Heartbeat', description: 'Gateway prova que o runtime esta vivo antes de liberar qualquer recurso.', icon: 'solar:pulse-2-linear' },
  { label: 'Authorization', description: 'Runtime recebe decisao de acesso depois do challenge e pagamento x402.', icon: 'solar:shield-keyhole-linear' },
  { label: 'Events', description: 'Cada tentativa, liberacao, timeout e falha volta para o historico do flow.', icon: 'solar:calendar-mark-linear' },
  { label: 'Health', description: 'Estado operacional separa pronto, pendente, offline e bloqueado sem inventar sucesso.', icon: 'solar:heart-pulse-linear' },
];

const modeCopy = {
  physical: {
    title: 'Modos fisicos',
    description: 'Raspberry Pi, edge device e totem rodam perto do recurso real para acionar relay, tela, sensor ou controlador local.',
    tone: 'ready',
  },
  digital: {
    title: 'Modos digitais',
    description: 'Proxy, middleware, sidecar, worker, API guard, plugin e serverless function protegem software, dados e automacoes.',
    tone: 'processing',
  },
} as const;

const gatewayTone: Record<GatewayStatus, string> = {
  pairing: 'pending',
  online: 'ready',
  offline: 'warning',
  suspended: 'blocked',
};

export default function GatewayPage() {
  const gateways = useAsyncData(() => kivoClient.listGateways(), []);
  const totems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const sessions = useAsyncData(() => kivoClient.listPowerSessions(), []);
  const gatewayList = gateways.data ?? [];
  const totemList = totems.data ?? [];
  const sessionList = sessions.data ?? [];
  const totemById = new Map(totemList.map((totem) => [totem.id, totem]));
  const onlineGateways = gatewayList.filter((gateway) => gateway.status === 'online');
  const pendingAuthorizations = sessionList.filter((session) => session.status === 'authorized');
  const loadError = gateways.error || totems.error || sessions.error;
  const loading = gateways.loading || totems.loading || sessions.loading;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo Gateway"
        title="Runtime conectado ao backend"
        icon="solar:server-square-cloud-linear"
        description="Aqui aparecem apenas gateways criados pela API do Kivo. Se nada estiver pareado, o produto mostra estado vazio em vez de inventar runtime online."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/studio" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:add-circle-linear" />
              Criar Gateway
            </Link>
            <Link to="/sdk" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:code-square-linear" />
              Ver SDK
            </Link>
          </div>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.72)]">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Badge tone={loadError ? 'failed' : loading ? 'processing' : gatewayList.length ? 'ready' : 'warning'}>
              {loadError ? 'API indisponivel' : loading ? 'carregando API' : gatewayList.length ? 'API conectada' : 'sem gateway'}
            </Badge>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Estado real dos runtimes</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              O Gateway so aparece aqui depois de ser criado pelo Studio e persistido no Supabase. Heartbeats, autorizacoes e eventos passam pela Edge Function.
            </p>
            {loadError && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">{loadError}</p>}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <GatewayMetric label="Gateways" value={gatewayList.length} detail="persistidos" />
            <GatewayMetric label="Online" value={onlineGateways.length} detail="com heartbeat" tone={onlineGateways.length ? 'ready' : 'warning'} />
            <GatewayMetric label="Totens" value={totemList.length} detail="recursos criados" />
            <GatewayMetric label="Autorizar" value={pendingAuthorizations.length} detail="sessoes prontas" tone={pendingAuthorizations.length ? 'processing' : 'neutral'} />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Gateways pareados</h2>
            <p className="mt-1 text-sm text-neutral-500">Lista vinda de `/v1/gateways`; tokens completos aparecem uma unica vez no pareamento.</p>
          </div>
          <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:gamepad-linear" />
            Abrir runtime web
          </Link>
        </div>

        <div className="mt-5 grid gap-3">
          {gatewayList.map((gateway) => {
            const totem = gateway.totemId ? totemById.get(gateway.totemId) : undefined;
            return (
              <div key={gateway.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-white">{gateway.name}</p>
                      <Badge tone={gatewayTone[gateway.status]}>{gateway.status}</Badge>
                      <Badge tone="neutral">{gateway.adapter}</Badge>
                    </div>
                    <p className="mt-2 break-all font-mono text-xs text-neutral-500">{gateway.id}</p>
                    <p className="mt-2 text-sm text-neutral-400">{totem ? `Pareado com ${totem.name}` : 'Gateway ainda sem Power Totem associado.'}</p>
                  </div>
                  <div className="grid gap-2 text-right text-xs text-neutral-500">
                    <span>Token {gateway.tokenPreview}</span>
                    <span>Ultimo sinal {formatDateTime(gateway.lastSeenAt ?? undefined)}</span>
                    <span>Atualizado {formatDateTime(gateway.updatedAt)}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && !gatewayList.length && (
            <div className="rounded-2xl border border-amber-500/15 bg-amber-500/10 p-5">
              <Badge tone="warning">acao necessaria</Badge>
              <h3 className="mt-3 font-bricolage text-xl font-bold text-white">Nenhum Gateway real foi pareado</h3>
              <p className="mt-2 text-sm leading-6 text-amber-50/80">
                Crie um Power Totem no Studio e gere o token do Gateway. Depois rode o runtime web ou o pacote `apps/kivo/gateway` com o gatewayId e token emitidos.
              </p>
              <Link to="/studio" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
                <Icon icon="solar:stars-line-duotone" />
                Ir para Studio
              </Link>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Contrato HTTP do Gateway</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">O runtime precisa destas tres chamadas reais para liberar um recurso.</p>
          </div>
          {gatewayList[0] && <Badge tone="neutral">{shortId(gatewayList[0].id)}</Badge>}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contract.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <Icon icon={item.icon} className="text-2xl text-emerald-300" />
              <p className="mt-3 text-sm font-bold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-400">{item.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        {(['physical', 'digital'] as const).map((surface) => (
          <Card key={surface}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-bricolage text-xl font-bold text-white">{modeCopy[surface].title}</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">{modeCopy[surface].description}</p>
              </div>
              <Badge tone={modeCopy[surface].tone}>{surface}</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              {gatewayModes.filter((mode) => mode.surface === surface).map((mode) => (
                <div key={mode.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-bold text-white">{mode.label}</p>
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{mode.id.replaceAll('_', ' ')}</span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-neutral-400">{mode.bestFor}</p>
                  <p className="mt-2 text-xs leading-5 text-emerald-200">{mode.runtime}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GatewayMetric({ label, value, detail, tone = 'neutral' }: { label: string; value: number; detail: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <p className="mt-2 font-bricolage text-3xl font-bold text-white">{value}</p>
      <Badge tone={tone}>{detail}</Badge>
    </div>
  );
}
