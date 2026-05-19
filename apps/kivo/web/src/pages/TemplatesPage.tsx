import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { WorkspaceContextBanner } from '@/components/WorkspaceContextBanner';
import { createFlowRoute, soloMvpTemplates } from '@/data/soloMvp';

export default function TemplatesPage() {
  return (
    <div className="space-y-8">
      <PageHeader eyebrow="MVP flows" title="Templates operacionais" icon="solar:bolt-circle-bold-duotone" description="Pontos de partida para os tres fluxos do Solo MVP: device pay, API paga e feed de dados IoT." />
      <WorkspaceContextBanner
        eyebrow="Inicio rapido"
        title="Escolha um dos tres fluxos base"
        icon="solar:bolt-circle-bold-duotone"
        tone="ready"
        description="Esta tela nao e catalogo amplo: os templates apenas preenchem o create flow com o caminho minimo para validar um MVP operacional."
        checkpoints={['Device pay', 'Paid API', 'IoT data feed']}
        primaryAction={{ to: createFlowRoute(soloMvpTemplates[0].id), label: 'Criar flow' }}
        secondaryAction={{ to: '/create-flow', label: 'Abrir criador' }}
      />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {soloMvpTemplates.map((template) => (
          <Card key={template.name} className="relative overflow-hidden">
            <Icon icon={template.icon} className="absolute -bottom-6 -right-5 text-[8rem] text-white/[0.03]" />
            <div className="relative z-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Icon icon={template.icon} className="text-2xl" />
              </div>
              <h2 className="font-bricolage text-xl font-bold text-white">{template.name}</h2>
              <p className="mt-3 text-sm leading-6 text-neutral-400">{template.description}</p>
              <p className="mt-3 text-xs leading-5 text-neutral-500">{template.bestFor}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <code className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-emerald-300">{template.defaultPrice} USDC</code>
                <code className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-emerald-300">por {template.defaultUnit}</code>
                <code className="rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-emerald-300">{template.integrationMode}</code>
              </div>
              <Link to={createFlowRoute(template.id)} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-emerald-400">
                {template.primaryActionLabel}
                <Icon icon="solar:arrow-right-linear" className="text-base" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
