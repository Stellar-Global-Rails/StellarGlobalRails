import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { getTemplateById } from '@/data/templateMarketplace';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';
import { useTemplateLibraryStore } from '@/stores';
import type { PowerTotem } from '@/types/kivo';

const installSteps = [
  {
    label: 'Configurar template',
    detail: 'Nome, preco, unidade e duracao ficam na API Kivo.',
    icon: 'solar:tuning-square-linear',
  },
  {
    label: 'Provisionar Gateway',
    detail: 'Kivo cria gatewayId e emite gatewayToken uma unica vez.',
    icon: 'solar:key-minimalistic-square-3-linear',
  },
  {
    label: 'Baixar Docker',
    detail: 'Bundle com runtime local, banco local, UI local e .env.',
    icon: 'solar:download-minimalistic-bold-duotone',
  },
  {
    label: 'Validar',
    detail: 'Checkout x402, Etherfuse/Stellar e release real.',
    icon: 'solar:shield-check-linear',
  },
];

export default function TemplateLibraryDetailPage() {
  const { templateId = '' } = useParams();
  const template = getTemplateById(templateId);
  const hasTemplate = useTemplateLibraryStore((state) => state.hasTemplate);
  const acquireTemplate = useTemplateLibraryStore((state) => state.acquireTemplate);
  const owned = Boolean(template && hasTemplate(template.id));
  const isPowerTotem = template?.id === 'power-totem';

  if (!template) {
    return (
      <div className="space-y-6">
        <PageHeader title="Template nao encontrado" icon="solar:folder-with-files-linear" description="Este item nao existe na biblioteca atual." />
        <Card>
          <Link to="/library" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:arrow-left-linear" />
            Voltar a biblioteca
          </Link>
        </Card>
      </div>
    );
  }

  if (!owned) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Biblioteca"
          title={`${template.name} ainda nao foi adquirido`}
          icon="solar:folder-with-files-linear"
          description="Adquira o template antes de configurar recursos, provisionar Gateway ou baixar pacote local."
        />
        <Card>
          <div className="flex flex-wrap gap-3">
            {template.availability === 'available' && (
              <button
                type="button"
                onClick={() => acquireTemplate(template.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400"
              >
                <Icon icon="solar:add-circle-linear" />
                Adquirir template
              </button>
            )}
            <Link to={`/templates/${template.id}`} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:widget-linear" />
              Ver apresentacao
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (!isPowerTotem) {
    return (
      <div className="space-y-6">
        <PageHeader
          eyebrow="Biblioteca"
          title={template.name}
          icon="solar:folder-with-files-linear"
          description="Este template esta na biblioteca, mas o runtime ainda esta no roadmap."
        />
        <Card>
          <Badge tone="planned">em breve</Badge>
          <p className="mt-3 text-sm leading-6 text-neutral-400">{template.roadmapReason ?? 'O runtime ainda nao foi fechado para operacao real.'}</p>
        </Card>
      </div>
    );
  }

  return <PowerTotemLibraryExperience templateName={template.name} />;
}

function PowerTotemLibraryExperience({ templateName }: { templateName: string }) {
  const totems = useAsyncData(() => kivoClient.listPowerTotems(), []);
  const [selectedTotemId, setSelectedTotemId] = useState('');
  const [totemName, setTotemName] = useState('EV Charger Demo');
  const [totemPrice, setTotemPrice] = useState('0.2500000');
  const [sessionDuration, setSessionDuration] = useState('120');
  const [gatewayName, setGatewayName] = useState('Kivo EV Charge Gateway');
  const [isCreatingTotem, setIsCreatingTotem] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totemList = useMemo(() => totems.data ?? [], [totems.data]);
  const selectedTotem = useMemo(
    () => totemList.find((totem) => totem.id === selectedTotemId) ?? totemList[0],
    [selectedTotemId, totemList],
  );

  const handleCreatePowerTotem = async () => {
    setIsCreatingTotem(true);
    setError('');
    setSuccess('');
    try {
      const totem = await kivoClient.createPowerTotem({
        name: totemName.trim() || 'EV Charger Demo',
        price: totemPrice.trim() || '0.2500000',
        unit: 'session',
        sessionDurationSeconds: Number(sessionDuration) || 30,
        metadata: {
          source: 'kivo-template-library',
          templateId: 'power-totem',
        },
      });
      totems.setData([totem, ...totemList.filter((item) => item.id !== totem.id)]);
      setSelectedTotemId(totem.id);
      setSuccess('Estacao EV Charge criada na API. Agora voce pode baixar o Gateway Docker.');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel criar a estacao EV Charge.');
    } finally {
      setIsCreatingTotem(false);
    }
  };

  const downloadBundle = async () => {
    if (!selectedTotem) {
      setError('Crie ou selecione uma estacao EV Charge antes de baixar o Gateway Docker.');
      return;
    }
    setDownloading(true);
    setError('');
    setSuccess('');
    try {
      const bundle = await kivoClient.downloadPowerTotemGatewayBundle(selectedTotem.id, {
        adapter: 'raspberry',
        name: gatewayName.trim() || `${selectedTotem.name} Gateway`,
        metadata: {
          source: 'kivo-template-library',
          templateId: 'power-totem',
          totemId: selectedTotem.id,
        },
      });
      const url = URL.createObjectURL(bundle);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `kivo-power-totem-${selectedTotem.id.slice(0, 8)}.zip`;
      anchor.click();
      URL.revokeObjectURL(url);
      setSuccess('Bundle Docker gerado. O gatewayId e o gatewayToken foram colocados no .env do pacote.');
      void totems.reload();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Nao foi possivel gerar o pacote Docker.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Biblioteca"
        title={templateName}
        icon="solar:bolt-circle-bold-duotone"
        description="Configure o template adquirido, crie o recurso real na API e baixe o Gateway Docker para Raspberry Pi, mini PC ou runtime local."
        action={
          <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:shield-check-linear" />
            Validar depois
          </Link>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        {installSteps.map((step, index) => (
          <Card key={step.label} className="bg-black/20">
            <div className="flex items-center justify-between gap-3">
              <Icon icon={step.icon} className="text-2xl text-emerald-300" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">0{index + 1}</span>
            </div>
            <p className="mt-4 font-bricolage text-lg font-bold text-white">{step.label}</p>
            <p className="mt-1 text-xs leading-5 text-neutral-400">{step.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone="ready">template adquirido</Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">1. Criar estacao EV Charge</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                Esta etapa grava uma estacao real na API. O Kivo autoriza a sessao; a energizacao deve ficar com EVSE, OCPP wallbox ou controlador eletrico seguro.
              </p>
            </div>
            <Icon icon="solar:tuning-square-linear" className="text-4xl text-emerald-300" />
          </div>

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
            <Icon icon={isCreatingTotem ? 'solar:refresh-linear' : 'solar:add-circle-linear'} />
            {isCreatingTotem ? 'Criando estacao' : 'Criar estacao EV'}
          </button>
        </Card>

        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <Badge tone={totems.loading ? 'processing' : selectedTotem ? 'ready' : 'warning'}>
                {totems.loading ? 'carregando' : selectedTotem ? 'pronto para bundle' : 'sem recurso'}
              </Badge>
              <h2 className="mt-3 font-bricolage text-2xl font-bold text-white">2. Baixar Gateway Docker</h2>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                O bundle provisiona Gateway, token de runtime, banco local, UI local e comandos para rodar perto da estacao.
              </p>
            </div>
            <Icon icon="solar:download-minimalistic-bold-duotone" className="text-4xl text-emerald-300" />
          </div>

          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Estacao EV</span>
              <select
                value={selectedTotem?.id ?? ''}
                onChange={(event) => setSelectedTotemId(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
              >
                {!totemList.length && <option value="">Nenhuma estacao criada</option>}
                {totemList.map((totem) => (
                  <option key={totem.id} value={totem.id}>{totem.name}</option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Nome do Gateway</span>
              <input
                value={gatewayName}
                onChange={(event) => setGatewayName(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-3 py-3 text-sm text-white outline-none focus:border-emerald-500"
              />
            </label>

            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Conteudo do bundle</p>
              <p className="mt-2 text-sm leading-6 text-neutral-300">
                docker-compose.yml, .env.example, README.md, gatewayId, gatewayToken, KIVO_API_URL, runtime local, banco local e UI local da estacao.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={downloadBundle}
            disabled={downloading || !selectedTotem}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Icon icon={downloading ? 'solar:refresh-linear' : 'solar:download-minimalistic-bold-duotone'} />
            {downloading ? 'Gerando pacote Docker' : 'Baixar Gateway Docker'}
          </button>
        </Card>
      </div>

      {(error || totems.error) && <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error || totems.error}</p>}
      {success && <p className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">{success}</p>}

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Recursos criados neste template</h2>
            <p className="mt-1 text-sm text-neutral-500">Lista real vinda da API Kivo.</p>
          </div>
          <Badge tone={totemList.length ? 'ready' : 'warning'}>{totemList.length} estacoes</Badge>
        </div>
        <div className="mt-5 grid gap-3">
          {totemList.map((totem) => (
            <PowerTotemRow key={totem.id} totem={totem} />
          ))}
          {!totems.loading && !totemList.length && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-sm leading-6 text-neutral-500">
              Nenhuma estacao criada ainda. Crie o primeiro recurso acima para habilitar o download do Gateway.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

function PowerTotemRow({ totem }: { totem: PowerTotem }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-white">{totem.name}</p>
            <Badge tone={totem.status}>{totem.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-neutral-400">{totem.resource}</p>
          <p className="mt-1 break-all font-mono text-xs text-neutral-600">{totem.id}</p>
        </div>
        <div className="text-right text-sm text-neutral-400">
          <p className="font-mono text-white">{totem.price}</p>
          <p>{totem.sessionDurationSeconds}s por sessao</p>
        </div>
      </div>
    </div>
  );
}
