import { Icon } from '@iconify/react';
import { Link, useParams } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useNotificationStore } from '@/stores';
import type { PowerSession, PowerTotem } from '@/types/kivo';

export default function PowerTotemDetailPage() {
  const { id = '' } = useParams();
  const notify = useNotificationStore((state) => state.add);
  const totemResult = useAsyncData(() => kivoClient.getPowerTotem(id), [id]);
  const sessionsResult = useAsyncData(() => kivoClient.listPowerSessions(), []);
  const [creatingSession, setCreatingSession] = useState(false);
  const [error, setError] = useState('');

  const sessions = useMemo(
    () => (sessionsResult.data ?? []).filter((session) => session.totemId === id),
    [id, sessionsResult.data],
  );
  const activeSessions = sessions.filter((session) => ['requested', 'payment_required', 'paid', 'authorized', 'running'].includes(session.status));
  const completedSessions = sessions.filter((session) => session.status === 'completed');

  const createSession = async () => {
    setCreatingSession(true);
    setError('');
    try {
      const session = await kivoClient.createPowerSession(id);
      notify({
        type: 'success',
        title: 'Sessao criada',
        message: `Sessao ${session.id.slice(0, 8)} aguardando pagamento.`,
      });
      await sessionsResult.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel criar a sessao.');
    } finally {
      setCreatingSession(false);
    }
  };

  if (totemResult.loading) {
    return <Card>Carregando Power Totem...</Card>;
  }

  if (totemResult.error || !totemResult.data) {
    return (
      <Card className="border-red-500/20 bg-red-500/[0.06]">
        <p className="font-bold text-red-100">Nao foi possivel carregar o Power Totem.</p>
        <p className="mt-2 text-sm text-red-200/80">{totemResult.error ?? 'Totem nao encontrado.'}</p>
      </Card>
    );
  }

  const totem = totemResult.data;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Power Totem"
        title={totem.name}
        icon="solar:bolt-circle-bold-duotone"
        description="Superficie operacional para acompanhar recurso x402, sessoes e o proximo passo de checkout."
        action={<Badge tone={totem.status}>{statusLabel(totem.status)}</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-4">
        <MetricCard title="Preco" value={`${totem.price} / ${unitLabel(totem.unit)}`} icon="solar:tag-price-bold-duotone" />
        <MetricCard title="Duracao" value={`${totem.sessionDurationSeconds}s`} icon="solar:clock-circle-bold-duotone" tone="blue" />
        <MetricCard title="Sessoes abertas" value={activeSessions.length.toString()} icon="solar:play-circle-bold-duotone" tone="amber" />
        <MetricCard title="Finalizadas" value={completedSessions.length.toString()} icon="solar:check-circle-bold-duotone" tone="emerald" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="min-w-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Resource protegido</p>
              <h2 className="mt-2 font-bricolage text-xl font-bold text-white">x402 na frente do totem</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">O recurso abaixo e a ancora do checkout. A etapa de binding completo entre pagamento x402 e sessao entra no Task 8; aqui o operador ja consegue criar sessao, mostrar QR e testar o gateway.</p>
            </div>
            <CopyButton value={totem.resource} />
          </div>
          <code className="mt-4 block break-all rounded-2xl border border-white/5 bg-black/30 p-4 text-sm text-emerald-200">{totem.resource}</code>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link to={`/totem/${totem.id}/display`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
              <Icon icon="solar:monitor-bold-duotone" />
              Display QR
            </Link>
            <Link to="/checkout" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
              <Icon icon="solar:wallet-money-bold-duotone" />
              Contexto checkout
            </Link>
            <Link to="/totem-simulator" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10">
              <Icon icon="solar:gamepad-bold-duotone" />
              Simulador
            </Link>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">Sessao manual</p>
              <h2 className="mt-2 font-bricolage text-xl font-bold text-white">Preparar autorizacao</h2>
            </div>
            <Badge tone="pending">Task 8 conecta pagamento</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-neutral-400">Crie uma sessao solicitada para validar o fluxo operacional. O checkout x402 ainda nao escreve o pagamento na sessao neste task.</p>
          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
          <button type="button" onClick={createSession} disabled={creatingSession} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:opacity-60">
            <Icon icon={creatingSession ? 'solar:refresh-bold-duotone' : 'solar:play-circle-bold-duotone'} />
            {creatingSession ? 'Criando sessao...' : 'Criar sessao solicitada'}
          </button>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bricolage text-xl font-bold text-white">Sessoes do totem</h2>
          <Badge tone={sessionsResult.loading ? 'processing' : 'neutral'}>{sessionsResult.loading ? 'carregando' : `${sessions.length} registros`}</Badge>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-neutral-500">
              <tr>
                <th className="py-3">Sessao</th>
                <th>Status</th>
                <th>Gateway</th>
                <th>Valor</th>
                <th>Expira</th>
                <th>Eventos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))}
            </tbody>
          </table>
          {!sessionsResult.loading && sessions.length === 0 && <p className="rounded-xl border border-white/5 bg-black/25 p-4 text-sm text-neutral-400">Nenhuma sessao registrada para este totem.</p>}
        </div>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, tone = 'emerald' }: { title: string; value: string; icon: string; tone?: 'emerald' | 'blue' | 'amber' }) {
  const tones = {
    emerald: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  };

  return (
    <Card>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl border ${tones[tone]}`}>
        <Icon icon={icon} className="text-2xl" />
      </div>
      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-neutral-500">{title}</p>
      <p className="mt-1 font-bricolage text-2xl font-bold text-white">{value}</p>
    </Card>
  );
}

function SessionRow({ session }: { session: PowerSession }) {
  return (
    <tr className="align-top text-neutral-300">
      <td className="py-3 font-mono text-xs text-white">{session.id.slice(0, 12)}</td>
      <td><Badge tone={session.status}>{sessionStatusLabel(session.status)}</Badge></td>
      <td className="font-mono text-xs">{session.gatewayId || 'sem gateway'}</td>
      <td>{session.amount} {session.asset.split(':')[0]}</td>
      <td>{formatDate(session.expiresAt)}</td>
      <td>{session.events.length}</td>
    </tr>
  );
}

function statusLabel(status: PowerTotem['status']) {
  const labels: Record<PowerTotem['status'], string> = {
    draft: 'rascunho',
    pairing: 'pareando',
    testing: 'teste',
    active: 'ativo',
    paused: 'pausado',
    failed: 'falhou',
  };
  return labels[status] ?? status;
}

function sessionStatusLabel(status: PowerSession['status']) {
  const labels: Record<PowerSession['status'], string> = {
    requested: 'solicitada',
    payment_required: 'pagamento',
    paid: 'paga',
    authorized: 'autorizada',
    running: 'rodando',
    completed: 'completa',
    expired: 'expirada',
    failed: 'falhou',
  };
  return labels[status] ?? status;
}

function unitLabel(unit: PowerTotem['unit']) {
  if (unit === 'minute') return 'min';
  return unit;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
