import { Icon } from '@iconify/react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { kivoClient } from '@/services/kivoClient';
import type { PowerSession } from '@/types/kivo';

interface SimulatorRouteState {
  gatewayId?: string;
  gatewayToken?: string;
}

type SimulatorState = 'locked' | 'polling' | 'unlocked';

export default function TotemSimulatorPage() {
  const location = useLocation();
  const routeState = (location.state ?? {}) as SimulatorRouteState;
  const [gatewayId, setGatewayId] = useState(routeState.gatewayId ?? '');
  const [gatewayToken, setGatewayToken] = useState(routeState.gatewayToken ?? '');
  const [state, setState] = useState<SimulatorState>('locked');
  const [authorization, setAuthorization] = useState<PowerSession | null>(null);
  const [log, setLog] = useState<string[]>(['Simulador pronto. Cole gatewayId e token ou use o modo local.']);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const appendLog = (entry: string) => setLog((current) => [`${new Date().toLocaleTimeString('pt-BR')} - ${entry}`, ...current].slice(0, 8));

  const heartbeat = async () => {
    setBusy(true);
    setError('');
    try {
      if (!gatewayId || !gatewayToken) {
        appendLog('Heartbeat local simulado sem chamar API.');
        return;
      }
      const gateway = await kivoClient.sendGatewayHeartbeat(gatewayId, gatewayToken);
      appendLog(`Heartbeat aceito para ${gateway.name}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Heartbeat falhou.');
    } finally {
      setBusy(false);
    }
  };

  const pollAuthorization = async () => {
    setBusy(true);
    setError('');
    setState('polling');
    try {
      if (!gatewayId || !gatewayToken) {
        appendLog('Autorizacao local encontrada para a demo.');
        setAuthorization(createLocalAuthorization());
        setState('unlocked');
        return;
      }
      const response = await kivoClient.getGatewayAuthorization(gatewayId, gatewayToken);
      setAuthorization(response.authorization);
      setState(response.authorization ? 'unlocked' : 'locked');
      appendLog(response.authorization ? `Autorizacao ${response.authorization.id.slice(0, 8)} recebida.` : 'Nenhuma autorizacao pendente.');
    } catch (err) {
      setState('locked');
      setError(err instanceof Error ? err.message : 'Consulta de autorizacao falhou.');
    } finally {
      setBusy(false);
    }
  };

  const sendEvent = async (eventType: string) => {
    setBusy(true);
    setError('');
    try {
      if (!gatewayId || !gatewayToken) {
        appendLog(`Evento local ${eventType}.`);
        return;
      }
      await kivoClient.createGatewayEvent(gatewayId, gatewayToken, {
        eventType,
        sessionId: authorization?.id,
        payload: {
          simulatorState: state,
          source: 'web-simulator',
        },
      });
      appendLog(`Evento ${eventType} enviado.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Nao foi possivel enviar evento.');
    } finally {
      setBusy(false);
    }
  };

  const lockAgain = () => {
    setState('locked');
    setAuthorization(null);
    appendLog('Saida bloqueada novamente.');
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Gateway"
        title="Simulador de Power Totem"
        icon="solar:gamepad-bold-duotone"
        description="Fallback local para demonstrar heartbeat, consulta de autorizacao e eventos do gateway sem depender de hardware fisico."
        action={<Badge tone={state === 'unlocked' ? 'ready' : state === 'polling' ? 'processing' : 'warning'}>{stateLabel(state)}</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Credenciais do gateway</h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">Use o token emitido no Studio. Se deixar vazio, o simulador roda em modo local para apresentacao.</p>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Gateway ID</span>
              <input value={gatewayId} onChange={(event) => setGatewayId(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-xs text-white outline-none focus:border-emerald-500" placeholder="gw_..." />
            </label>
            <label className="block">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">Gateway token</span>
              <textarea value={gatewayToken} onChange={(event) => setGatewayToken(event.target.value)} className="mt-2 min-h-28 w-full rounded-xl border border-white/10 bg-black/40 p-3 font-mono text-xs text-amber-100 outline-none focus:border-emerald-500" placeholder="kgw_..." />
            </label>
          </div>
          {gatewayToken && <div className="mt-4"><CopyButton value={gatewayToken} label="Copiar token" /></div>}
          {error && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</p>}
        </Card>

        <Card className="overflow-hidden">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className={`min-h-96 rounded-[2rem] border p-6 ${state === 'unlocked' ? 'border-emerald-500/25 bg-emerald-500/10' : 'border-amber-500/25 bg-amber-500/10'}`}>
              <div className="flex items-center justify-between gap-3">
                <Badge tone={state === 'unlocked' ? 'ready' : 'warning'}>{stateLabel(state)}</Badge>
                <Icon icon={state === 'unlocked' ? 'solar:lock-unlocked-bold-duotone' : 'solar:lock-keyhole-bold-duotone'} className={`text-4xl ${state === 'unlocked' ? 'text-emerald-300' : 'text-amber-300'}`} />
              </div>
              <div className="mt-10 grid place-items-center">
                <div className={`relative flex h-44 w-44 items-center justify-center rounded-full border ${state === 'unlocked' ? 'border-emerald-300/50 bg-emerald-400/15' : 'border-amber-300/50 bg-amber-400/15'}`}>
                  <span className={`absolute h-32 w-32 rounded-full ${state === 'unlocked' ? 'bg-emerald-400/10' : 'bg-amber-400/10'}`} />
                  <Icon icon="solar:bolt-circle-bold-duotone" className={`relative text-7xl ${state === 'unlocked' ? 'text-emerald-200' : 'text-amber-200'}`} />
                </div>
              </div>
              <p className="mt-8 text-center font-bricolage text-3xl font-bold text-white">{state === 'unlocked' ? 'Saida energizada' : 'Saida bloqueada'}</p>
              <p className="mt-2 text-center text-sm text-neutral-300">{authorization ? `Sessao ${authorization.id.slice(0, 8)} autorizada por ${authorization.durationSeconds}s.` : 'Aguardando autorizacao do Kivo Edge.'}</p>
            </div>

            <div className="space-y-3">
              <button type="button" disabled={busy} onClick={heartbeat} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                <Icon icon="solar:pulse-2-bold-duotone" />
                Enviar heartbeat
              </button>
              <button type="button" disabled={busy} onClick={pollAuthorization} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                <Icon icon="solar:shield-check-bold-duotone" />
                Consultar autorizacao
              </button>
              <button type="button" disabled={busy || state !== 'unlocked'} onClick={() => void sendEvent('relay.opened')} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                <Icon icon="solar:power-bold-duotone" />
                Enviar relay.opened
              </button>
              <button type="button" disabled={busy} onClick={lockAgain} className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">
                <Icon icon="solar:lock-keyhole-bold-duotone" />
                Bloquear saida
              </button>
              <Link to="/studio" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400">
                <Icon icon="solar:add-circle-bold-duotone" />
                Criar novo totem
              </Link>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-bricolage text-xl font-bold text-white">Log do gateway</h2>
          <Badge tone={busy ? 'processing' : 'neutral'}>{busy ? 'sincronizando' : 'local'}</Badge>
        </div>
        <div className="mt-4 grid gap-2">
          {log.map((entry) => (
            <p key={entry} className="rounded-xl border border-white/5 bg-black/25 px-4 py-3 font-mono text-xs text-neutral-300">{entry}</p>
          ))}
        </div>
      </Card>
    </div>
  );
}

function stateLabel(state: SimulatorState) {
  const labels: Record<SimulatorState, string> = {
    locked: 'bloqueado',
    polling: 'consultando',
    unlocked: 'liberado',
  };
  return labels[state];
}

function createLocalAuthorization(): PowerSession {
  const now = new Date().toISOString();
  return {
    id: `local_${Date.now()}`,
    totemId: 'local_totem',
    gatewayId: 'local_gateway',
    resource: '/power-totem/local/session',
    amount: '0.50',
    asset: 'USDC',
    durationSeconds: 30,
    status: 'authorized',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    events: [],
    createdAt: now,
    updatedAt: now,
  };
}
