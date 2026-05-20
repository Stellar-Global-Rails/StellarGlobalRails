import { useState, type ReactNode } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { CopyButton } from '@/components/ui/CopyButton';
import { PageHeader } from '@/components/ui/PageHeader';
import { gatewayModes, studioAgents, studioTemplates } from '@/data/studioExperience';
import { kivoClient } from '@/services/kivoClient';
import type { GatewayPairingResult, PowerTotem, StudioFlow, StudioIntent } from '@/types/kivo';

const studioPath = [
  { label: 'Descrever', detail: 'Recurso, valor e contexto', icon: 'solar:chat-round-dots-linear' },
  { label: 'Gerar flow', detail: 'Gateway e regra x402', icon: 'solar:diagram-up-linear' },
  { label: 'Parear', detail: 'Token para simulador/Raspberry', icon: 'solar:server-square-cloud-linear' },
  { label: 'Validar', detail: 'x402 + Etherfuse + release', icon: 'solar:shield-check-linear' },
];

const defaultPrompt = 'Liberar um Power Totem por 30 segundos depois de um pagamento x402 em testnet.';

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
    const currentPrompt = (prompt.trim() || defaultPrompt).trim();
    setPrompt(currentPrompt);
    setIsCreating(true);
    setError('');
    setIntentResult(null);
    setFlowResult(null);
    try {
      const intent = await kivoClient.createStudioIntent({
        prompt: currentPrompt,
        surface: currentPrompt.toLowerCase().includes('totem') ? 'physical' : 'digital',
      });
      const flow = await kivoClient.createStudioFlow(intent);
      setIntentResult(intent);
      setFlowResult(flow);
    } catch (caught) {
      setIntentResult(null);
      setFlowResult(null);
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel gerar o flow.');
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
    <div className="space-y-6">
      <PageHeader
        title="Kivo Studio"
        icon="solar:stars-line-duotone"
        description="Uma bancada curta para transformar uma ideia em flow, gerar o Gateway e validar o caminho real. O Power Totem e o template funcional do hackathon; os demais casos ficam como roadmap."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:shield-check-linear" />
              Validar flow
            </Link>
            <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:gamepad-linear" />
              Simulador
            </Link>
          </div>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_30%),rgba(15,23,42,0.74)]">
        <div className="grid gap-3 md:grid-cols-4">
          {studioPath.map((step, index) => (
            <div key={step.label} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-black/20 p-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                <Icon icon={step.icon} className="text-xl" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">0{index + 1}</p>
                <p className="truncate text-sm font-bold text-white">{step.label}</p>
                <p className="truncate text-xs text-neutral-500">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.02fr_0.98fr]">
        <Card className="min-h-full">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="processing">AI agents</Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">1. Descreva o que quer controlar</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                Escreva em linguagem normal. O Studio gera o intent, escolhe o tipo de Gateway e cria um flow sem marcar sucesso artificial.
              </p>
            </div>
            {flowResult && <Badge tone="ready">flow gerado</Badge>}
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/25 p-4">
            <label htmlFor="studio-intent-prompt" className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              Ideia do recurso
            </label>
            <textarea
              id="studio-intent-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={5}
              className="mt-3 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm leading-6 text-neutral-100 outline-none transition placeholder:text-neutral-600 focus:border-emerald-500/50"
              placeholder={defaultPrompt}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleCreateIntent}
                disabled={isCreating}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Icon icon={isCreating ? 'solar:refresh-linear' : 'solar:stars-line-duotone'} />
                {isCreating ? 'Gerando flow' : 'Gerar flow'}
              </button>
              <button
                type="button"
                onClick={() => setPrompt(defaultPrompt)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-neutral-300 hover:bg-white/10"
              >
                <Icon icon="solar:magic-stick-3-linear" />
                Usar exemplo
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
              {error}
            </p>
          )}

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <ResultTile label="Surface" value={intentResult?.surface ?? 'aguardando'} />
            <ResultTile label="Modelo" value={intentResult?.interactionModel ?? 'aguardando'} />
            <ResultTile label="Gateway" value={intentResult?.recommendedGatewayMode ?? 'aguardando'} tone={flowResult ? 'ready' : 'neutral'} />
          </div>

          {flowResult && (
            <div className="mt-4 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Flow pronto para configurar</p>
              <p className="mt-2 font-bricolage text-xl font-bold text-white">{flowResult.name}</p>
              <p className="mt-1 text-sm text-neutral-400">{flowResult.resourceName} - {flowResult.price} {flowResult.asset}</p>
            </div>
          )}
        </Card>

        <Card className="min-h-full border-emerald-500/15">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="ready">template funcional</Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">2. Crie o Power Totem</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Este e o caminho apresentavel agora: cria o totem, emite o token do Gateway e abre o simulador com o pareamento.
              </p>
            </div>
            <Icon icon="solar:bolt-circle-bold-duotone" className="text-4xl text-emerald-300" />
          </div>

          {powerTotem && (
            <p className="mt-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-sm leading-6 text-neutral-300">
              {powerTotem.description}
            </p>
          )}

          <div className="mt-5 grid gap-3 sm:grid-cols-[1.35fr_0.75fr_0.65fr]">
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

          <button type="button" onClick={handleCreatePowerTotem} disabled={isCreatingTotem} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            <Icon icon={isCreatingTotem ? 'solar:refresh-linear' : 'solar:bolt-circle-linear'} />
            {isCreatingTotem ? 'Criando Power Totem' : 'Criar Power Totem e token'}
          </button>

          {totemError && <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">{totemError}</p>}

          {createdTotem && pairingResult ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white">{createdTotem.name}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-400">{createdTotem.resource}</p>
                </div>
                <Badge tone="ready">gateway emitido</Badge>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <CopyButton value={pairingResult.gateway.id} label="Copiar gatewayId" />
                <CopyButton value={pairingResult.gatewayToken} label="Copiar token" />
              </div>
              <Link
                to="/totem-simulator"
                state={{ gatewayId: pairingResult.gateway.id, gatewayToken: pairingResult.gatewayToken }}
                className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-100 hover:bg-emerald-500/15"
              >
                <Icon icon="solar:gamepad-linear" />
                Abrir simulador com token
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Proximo passo</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                Depois de criar o totem, copie o token ou abra o simulador para testar heartbeat, autorizacao e release.
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Disclosure
          title="Como os agentes ajudam"
          description="Ver os papeis sem poluir o fluxo principal."
          icon="solar:stars-line-duotone"
        >
          <div className="grid gap-3 md:grid-cols-2">
            {studioAgents.map((agent) => (
              <div key={agent.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="text-sm font-bold text-white">{agent.name}</p>
                <p className="mt-2 text-xs leading-5 text-neutral-400">{agent.role}</p>
              </div>
            ))}
          </div>
        </Disclosure>

        <Disclosure
          title="Onde o Gateway pode rodar"
          description="Fisico e digital, com detalhes sob demanda."
          icon="solar:server-square-cloud-linear"
        >
          <div className="grid gap-3">
            {gatewayModes.map((mode) => (
              <div key={mode.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-white">{mode.label}</p>
                  <Badge tone={mode.surface === 'physical' ? 'ready' : 'processing'}>{mode.surface}</Badge>
                </div>
                <p className="mt-2 text-xs leading-5 text-neutral-400">{mode.runtime}</p>
              </div>
            ))}
          </div>
        </Disclosure>
      </div>
    </div>
  );
}

function ResultTile({ label, value, tone = 'neutral' }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{label}</p>
      <div className="mt-2">
        <Badge tone={tone}>{value}</Badge>
      </div>
    </div>
  );
}

function Disclosure({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: string;
  children: ReactNode;
}) {
  return (
    <details className="group rounded-2xl border border-white/5 bg-neutral-900/70 p-5 premium-shadow">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-emerald-300">
            <Icon icon={icon} className="text-xl" />
          </span>
          <span className="min-w-0">
            <span className="block font-bricolage text-lg font-bold text-white">{title}</span>
            <span className="block truncate text-sm text-neutral-500">{description}</span>
          </span>
        </span>
        <Icon icon="solar:alt-arrow-down-linear" className="text-xl text-neutral-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-5">{children}</div>
    </details>
  );
}
