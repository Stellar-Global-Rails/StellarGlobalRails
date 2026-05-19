import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { studioTemplates } from '@/data/studioExperience';

const toneByStatus: Record<string, string> = {
  functional: 'ready',
  planned: 'planned',
  research: 'future',
  alpha: 'processing',
  beta: 'processing',
};

const iconBySurface: Record<string, string> = {
  physical: 'solar:bolt-circle-linear',
  digital: 'solar:server-square-cloud-linear',
  hybrid: 'solar:link-round-angle-linear',
};

export default function TemplatesPage() {
  const functionalTemplates = studioTemplates.filter((template) => template.isFunctionalHackathonTemplate);
  const futureTemplates = studioTemplates.filter((template) => !template.isFunctionalHackathonTemplate);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Templates"
        title="Power Totem agora, marketplace depois"
        icon="solar:widget-linear"
        description="O catalogo do Studio comeca com um template funcional. Os proximos casos ficam marcados como roadmap, pesquisa ou planejado ate existir runtime validado."
        action={
          <Link to="/studio" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:stars-line-duotone" />
            Abrir Studio
          </Link>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.72)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge tone="ready">funcional</Badge>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Template pronto para testar</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-300">Power Totem e o caminho operacional atual para validar recurso fisico, Gateway e simulador.</p>
          </div>
          <Link to="/totem-simulator" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:gamepad-linear" />
            Simulador
          </Link>
        </div>
        <div className="mt-5 grid gap-4">
          {functionalTemplates.map((template) => (
            <div key={template.id} className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
                    <Icon icon={iconBySurface[template.surface]} className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bricolage text-lg font-bold text-white">{template.name}</h3>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">{template.description}</p>
                  </div>
                </div>
                <Badge tone={toneByStatus[template.status]}>{template.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bricolage text-xl font-bold text-white">Marketplace futuro</h2>
          <Badge tone="future">roadmap</Badge>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {futureTemplates.map((template) => (
            <div key={template.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <Icon icon={iconBySurface[template.surface]} className="text-2xl text-violet-300" />
                <Badge tone={toneByStatus[template.status]}>{template.status}</Badge>
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{template.name}</h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">{template.description}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">{template.surface}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
