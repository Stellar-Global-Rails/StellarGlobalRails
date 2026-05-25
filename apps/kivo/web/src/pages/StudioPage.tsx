import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { gatewayModes, studioAgents, studioSteps } from '@/data/studioExperience';
import { kivoClient } from '@/services/kivoClient';
import type { KivoSolutionSurface, StudioFlow, StudioIntent } from '@/types/kivo';

const defaultPrompt =
  'Quero monetizar um recurso que pode ser fisico ou digital, cobrar antes do uso e liberar acesso apenas depois da validacao x402 em testnet.';

const surfaceOptions: Array<{ id: KivoSolutionSurface; label: string; detail: string; icon: string }> = [
  {
    id: 'physical',
    label: 'Fisico',
    detail: 'Raspberry Pi, totem, relay, sensor, bancada ou equipamento local.',
    icon: 'solar:bolt-circle-linear',
  },
  {
    id: 'digital',
    label: 'Digital',
    detail: 'API, proxy, worker, plugin, sidecar, middleware ou serverless function.',
    icon: 'solar:server-square-cloud-linear',
  },
  {
    id: 'hybrid',
    label: 'Hibrido',
    detail: 'Recurso local com API, painel, agente ou entrega digital.',
    icon: 'solar:link-round-angle-linear',
  },
];

export default function StudioPage() {
  const [prompt, setPrompt] = useState('');
  const [surface, setSurface] = useState<KivoSolutionSurface>('hybrid');
  const [intentResult, setIntentResult] = useState<StudioIntent | null>(null);
  const [flowResult, setFlowResult] = useState<StudioFlow | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

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
        surface,
      });
      const flow = await kivoClient.createStudioFlow(intent);
      setIntentResult(intent);
      setFlowResult(flow);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel gerar a solucao.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo Studio"
        title="Desenhe solucoes com AI agents"
        icon="solar:stars-line-duotone"
        description="O Studio ajuda o usuario a explicar o que quer monetizar ou controlar, escolher fisico/digital/hibrido e receber flow, arquitetura, SDK/config, testes e checklist. Gateway e token entram depois, na etapa de runtime."
        action={
          <div className="flex flex-wrap gap-2">
            <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:widget-linear" />
              Ver Marketplace
            </Link>
            <Link to="/library" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:folder-with-files-linear" />
              Minha biblioteca
            </Link>
          </div>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.15),transparent_32%),rgba(15,23,42,0.76)]">
        <div className="grid gap-3 md:grid-cols-6">
          {studioSteps.map((step, index) => (
            <div key={step.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">0{index + 1}</span>
              <p className="mt-2 text-sm font-bold text-white">{step.label}</p>
              <p className="mt-1 text-xs leading-5 text-neutral-500">{step.description}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="processing">AI builder</Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">1. Explique a solucao</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-400">
                O Studio nao cria tokens nem instala runtime. Ele estrutura a ideia e prepara o caminho para SDK, validacao e publicacao.
              </p>
            </div>
            {flowResult && <Badge tone="ready">flow gerado</Badge>}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {surfaceOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSurface(option.id)}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  surface === option.id
                    ? 'border-emerald-500/40 bg-emerald-500/10'
                    : 'border-white/5 bg-black/20 hover:border-white/15 hover:bg-white/[0.04]'
                }`}
              >
                <Icon icon={option.icon} className="text-2xl text-emerald-300" />
                <p className="mt-3 text-sm font-bold text-white">{option.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{option.detail}</p>
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/5 bg-black/25 p-4">
            <label htmlFor="studio-intent-prompt" className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              O que voce quer monetizar ou controlar?
            </label>
            <textarea
              id="studio-intent-prompt"
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              rows={6}
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
                {isCreating ? 'Gerando solucao' : 'Gerar arquitetura inicial'}
              </button>
              <button
                type="button"
                onClick={() => setPrompt(defaultPrompt)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-bold text-neutral-300 hover:bg-white/10"
              >
                <Icon icon="solar:magic-stick-3-linear" />
                Usar exemplo neutro
              </button>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs leading-5 text-red-200">
              {error}
            </p>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="border-emerald-500/15">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Badge tone={flowResult ? 'ready' : 'neutral'}>{flowResult ? 'saida do Studio' : 'aguardando'}</Badge>
                <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">Flow, SDK e checklist</h2>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  A saida do Studio deve virar um artefato reutilizavel, nao uma credencial de Gateway.
                </p>
              </div>
              <Icon icon="solar:diagram-up-linear" className="text-4xl text-emerald-300" />
            </div>

            <div className="mt-5 grid gap-3">
              <ResultTile label="Surface" value={intentResult?.surface ?? surface} />
              <ResultTile label="Modelo" value={intentResult?.interactionModel ?? 'pendente'} />
              <ResultTile label="Gateway recomendado" value={intentResult?.recommendedGatewayMode ?? 'pendente'} tone={flowResult ? 'ready' : 'neutral'} />
            </div>

            {flowResult ? (
              <div className="mt-5 rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.06] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">Flow gerado</p>
                <h3 className="mt-2 font-bricolage text-xl font-bold text-white">{flowResult.name}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  {flowResult.resourceName} - {flowResult.price} {flowResult.asset}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/sdk" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-neutral-200 hover:bg-white/10">
                    <Icon icon="solar:code-square-linear" />
                    Preparar SDK/config
                  </Link>
                  <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-100 hover:bg-emerald-500/15">
                    <Icon icon="solar:shield-check-linear" />
                    Validar testnet
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-white/5 bg-black/20 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">Estado honesto</p>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  Sem flow gerado ainda. Esta tela nao mostra template pronto nem token antes de existir uma solucao.
                </p>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-bricolage text-xl font-bold text-white">Agentes do Studio</h2>
              <Badge tone="processing">orquestracao</Badge>
            </div>
            <div className="mt-5 grid gap-3">
              {studioAgents.slice(0, 3).map((agent) => (
                <div key={agent.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                  <p className="text-sm font-bold text-white">{agent.name}</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-400">{agent.output}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Onde a solucao pode rodar</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-400">
              O Gateway vem depois do Studio e pode ser fisico, digital ou hibrido dependendo do flow.
            </p>
          </div>
          <Link to="/gateway" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:server-square-cloud-linear" />
            Ver Gateway
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {gatewayModes.slice(0, 10).map((mode) => (
            <div key={mode.id} className="rounded-2xl border border-white/5 bg-black/20 p-4">
              <p className="text-sm font-bold text-white">{mode.label}</p>
              <p className="mt-2 text-xs leading-5 text-neutral-500">{mode.bestFor}</p>
            </div>
          ))}
        </div>
      </Card>
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
