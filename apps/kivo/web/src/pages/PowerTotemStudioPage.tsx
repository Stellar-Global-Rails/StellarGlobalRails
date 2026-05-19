import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { gatewayModes, studioAgents, studioSteps, studioTemplates } from '@/data/studioExperience';
import { kivoClient } from '@/services/kivoClient';
import type { GatewayPairingResult, PowerTotem, StudioFlow, StudioIntent } from '@/types/kivo';

const gatewayGroups = [
  { id: 'physical', label: 'Fisico', description: 'Runtime perto do recurso real: Raspberry Pi, edge device ou totem.' },
  { id: 'digital', label: 'Digital', description: 'Runtime na borda de software: proxy, middleware, sidecar, worker, API guard, plugin ou function.' },
] as const;

const stepIcons: Record<string, string> = {
  describe: 'solar:chat-round-dots-linear',
  gateway: 'solar:server-square-cloud-linear',
  flow: 'solar:diagram-up-linear',
  sdk: 'solar:code-square-linear',
  validate: 'solar:shield-check-linear',
  launch: 'solar:rocket-linear',
};

export default function PowerTotemStudioPage() {
  const [prompt, setPrompt] = useState('');
  const [intentResult, setIntentResult] = useState<StudioIntent | null>(null);
  const [flowResult, setFlowResult] = useState<StudioFlow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [totemName, setTotemName] = useState('Power Totem Demo');
  const [totemPrice, setTotemPrice] = useState('0.2500000');
  const [sessionDuration, setSessionDuration] = useState('30');
  const [createdTotem, setCreatedTotem] = useState<PowerTotem | null>(null);
  const [pairingResult, setPairingResult] = useState<GatewayPairingResult | null>(null);
  const [isCreatingTotem, setIsCreatingTotem] = useState(false);
  const [totemError, setTotemError] = useState('');
  const [error, setError] = useState('');
  const powerTotem = studioTemplates.find((template) => template.id === 'power-totem');

  const handleCreateIntent = async () => {
    setIsCreating(true);
    setError('');
    setIntentResult(null);
    setFlowResult(null);
    try {
      const intent = await kivoClient.createStudioIntent({
        prompt,
        surface: prompt.toLowerCase().includes('totem') ? 'physical' : 'digital',
      });
      const flow = await kivoClient.createStudioFlow(intent);
      setIntentResult(intent);
      setFlowResult(flow);
    } catch (caught) {
      setIntentResult(null);
      setFlowResult(null);
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel criar o intent.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreatePowerTotem = async () => {
    setIsCreatingTotem(true);
    setTotemError('');
    setCreatedTotem(null);
    setPairingResult(null);
    try {
      const totem = await kivoClient.createPowerTotem({
        name: totemName.trim() || 'Power Totem Demo',
        price: totemPrice.trim() || '0.2500000',
        unit: 'session',
        sessionDurationSeconds: Number(sessionDuration) || 30,
        metadata: {
          source: 'kivo-studio',
          studioFlowId: flowResult?.id,
        },
      });
      const pairing = await kivoClient.createPowerTotemPairingToken(totem.id);
      setCreatedTotem(totem);
      setPairingResult(pairing);
    } catch (caught) {
      setTotemError(caught instanceof Error ? caught.message : 'Nao foi possivel criar o Power Totem.');
    } finally {
      setIsCreatingTotem(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo Studio"
        title="Criacao guiada por agentes"
        icon="solar:stars-line-duotone"
        description="Descreva o recurso, trabalhe com AI agents, escolha o Gateway, gere o flow, receba o SDK, valide x402 + Etherfuse e prepare o launch sem limitar a experiencia ao Power Totem."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/create-flow" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:add-circle-linear" />
              Criar flow
            </Link>
            <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:shield-check-linear" />
              Validar
            </Link>
          </div>
        }
      />

      <Card className="overflow-hidden border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_34%),rgba(15,23,42,0.76)]">
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="ready">produto em construcao</Badge>
              <Badge tone="processing">AI agents</Badge>
              <Badge tone="neutral">Power Totem funcional</Badge>
            </div>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Um Studio para qualquer recurso pago</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              O Studio transforma uma intencao em runtime de acesso: fisico quando existe uma maquina, digital quando existe uma API, hibrido quando os dois precisam conversar.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/gateway" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-200 hover:bg-emerald-500/15">
                <Icon icon="solar:server-square-cloud-linear" />
                Ver Gateway
              </Link>
              <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
                <Icon icon="solar:gamepad-linear" />
                Simular Power Totem
              </Link>
            </div>
            <div className="mt-6 rounded-2xl border border-white/5 bg-black/25 p-4">
              <label htmlFor="studio-intent-prompt" className="text-sm font-bold text-white">
                Descreva o recurso pago
              </label>
              <textarea
                id="studio-intent-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                rows={4}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm leading-6 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-emerald-500/50"
                placeholder="Ex.: cobrar acesso a uma API de dados ou liberar um totem fisico por pagamento"
              />
              <button
                type="button"
                onClick={handleCreateIntent}
                disabled={isCreating || !prompt.trim()}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={isCreating ? 'solar:refresh-linear' : 'solar:stars-line-duotone'} />
                {isCreating ? 'Criando intent' : 'Criar intent'}
              </button>
              {error && (
                <p className="mt-3 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
                  {error}
                </p>
              )}
              {intentResult && (
                <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">Intent criado</p>
                  <p className="mt-2 text-sm font-bold text-white">{intentResult.prompt}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge tone="neutral">{intentResult.surface}</Badge>
                    <Badge tone="processing">{intentResult.interactionModel}</Badge>
                    <Badge tone="ready">Gateway {intentResult.recommendedGatewayMode}</Badge>
                  </div>
                  {flowResult && (
                    <div className="mt-3 rounded-xl border border-white/5 bg-black/25 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Flow gerado</p>
                      <p className="mt-1 text-sm font-bold text-white">{flowResult.name}</p>
                      <p className="mt-1 text-xs text-neutral-500">{flowResult.gatewayMode} - {flowResult.resourceName}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {studioSteps.map((step, index) => (
              <div key={step.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <Icon icon={stepIcons[step.id]} className="text-2xl text-emerald-300" />
                  <span className="text-xs font-bold text-neutral-500">0{index + 1}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-white">{step.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-bricolage text-xl font-bold text-white">Agentes do Studio</h2>
            <Badge tone="processing">{studioAgents.length} agentes</Badge>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {studioAgents.map((agent) => (
              <div key={agent.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="text-sm font-bold text-white">{agent.name}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-400">{agent.role}</p>
                <div className="mt-3 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">Output</p>
                  <p className="mt-1 text-xs leading-5 text-emerald-100">{agent.output}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Template funcional</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">Power Totem prova o caminho fisico agora; os demais templates entram como marketplace depois.</p>
            </div>
            <Badge tone="ready">funcional</Badge>
          </div>
          {powerTotem && (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                  <Icon icon="solar:bolt-circle-linear" className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bricolage text-lg font-bold text-white">{powerTotem.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-neutral-300">{powerTotem.description}</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 rounded-2xl border border-white/5 bg-black/25 p-4">
                <div>
                  <p className="text-sm font-bold text-white">Criar Power Totem real</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-400">
                    Esta acao chama a API atual, cria o totem e emite o token unico do gateway para o simulador ou Raspberry.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1.3fr_0.7fr_0.6fr]">
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Nome</span>
                    <input value={totemName} onChange={(event) => setTotemName(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Preco</span>
                    <input value={totemPrice} onChange={(event) => setTotemPrice(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none focus:border-emerald-500" />
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Segundos</span>
                    <input value={sessionDuration} onChange={(event) => setSessionDuration(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-white outline-none focus:border-emerald-500" />
                  </label>
                </div>
                <button type="button" onClick={handleCreatePowerTotem} disabled={isCreatingTotem} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
                  <Icon icon={isCreatingTotem ? 'solar:refresh-linear' : 'solar:bolt-circle-linear'} />
                  {isCreatingTotem ? 'Criando Power Totem' : 'Criar Power Totem e token'}
                </button>
                {totemError && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">{totemError}</p>}
                {createdTotem && pairingResult && (
                  <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">{createdTotem.name}</p>
                        <p className="mt-1 text-xs leading-5 text-neutral-400">{createdTotem.resource} - {createdTotem.price} {createdTotem.unit}</p>
                      </div>
                      <Badge tone="ready">gateway emitido</Badge>
                    </div>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <CopyButton value={pairingResult.gateway.id} label="Copiar gatewayId" />
                      <CopyButton value={pairingResult.gatewayToken} label="Copiar gateway token" />
                    </div>
                    <Link
                      to="/totem-simulator"
                      state={{ gatewayId: pairingResult.gateway.id, gatewayToken: pairingResult.gatewayToken }}
                      className="mt-3 inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/15"
                    >
                      <Icon icon="solar:gamepad-linear" />
                      Abrir simulador com token
                    </Link>
                  </div>
                )}
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
                  <Icon icon="solar:gamepad-linear" />
                  Abrir simulador
                </Link>
                <Link to="/gateway" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
                  <Icon icon="solar:server-square-cloud-linear" />
                  Ver Gateway
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Modos de Gateway</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">O mesmo contrato libera recursos fisicos e digitais; muda apenas onde o runtime roda.</p>
          </div>
          <Link to="/gateway" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300 hover:text-emerald-200">
            Detalhes do runtime
            <Icon icon="solar:arrow-right-linear" />
          </Link>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {gatewayGroups.map((group) => (
            <div key={group.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white">{group.label}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">{group.description}</p>
                </div>
                <Badge tone={group.id === 'physical' ? 'ready' : 'processing'}>{group.id}</Badge>
              </div>
              <div className="mt-4 grid gap-2">
                {gatewayModes.filter((mode) => mode.surface === group.id).map((mode) => (
                  <div key={mode.id} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                    <p className="text-sm font-bold text-neutral-100">{mode.label}</p>
                    <p className="mt-1 text-xs leading-5 text-neutral-500">{mode.runtime}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
