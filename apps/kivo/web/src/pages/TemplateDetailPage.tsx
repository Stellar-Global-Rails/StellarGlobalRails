import { Icon } from '@iconify/react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { getTemplateById } from '@/data/templateMarketplace';
import { useTemplateLibraryStore } from '@/stores';

const surfaceLabel = {
  physical: 'Fisico',
  digital: 'Digital',
  hybrid: 'Hibrido',
};

export default function TemplateDetailPage() {
  const { templateId = '' } = useParams();
  const navigate = useNavigate();
  const template = getTemplateById(templateId);
  const acquireTemplate = useTemplateLibraryStore((state) => state.acquireTemplate);
  const hasTemplate = useTemplateLibraryStore((state) => state.hasTemplate);

  if (!template) {
    return (
      <div className="space-y-6">
        <PageHeader title="Template nao encontrado" icon="solar:widget-linear" description="Este template nao existe no catalogo atual do Kivo." />
        <Card>
          <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:arrow-left-linear" />
            Voltar ao Marketplace
          </Link>
        </Card>
      </div>
    );
  }

  const owned = hasTemplate(template.id);
  const isAvailable = template.isFunctionalHackathonTemplate;

  const handleAcquire = () => {
    if (!isAvailable) return;
    acquireTemplate(template.id);
    navigate(`/library/${template.id}`);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow={template.category}
        title={template.name}
        icon="solar:widget-linear"
        description={template.tagline}
        action={
          <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:arrow-left-linear" />
            Marketplace
          </Link>
        }
      />

      <section className="overflow-hidden rounded-[2rem] border border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.24),transparent_34%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(2,6,23,0.98))] p-6 premium-shadow md:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={isAvailable ? 'ready' : 'planned'}>{template.badge}</Badge>
              <Badge tone="neutral">{surfaceLabel[template.surface]}</Badge>
            </div>
            <h2 className="mt-5 max-w-4xl font-bricolage text-4xl font-bold leading-tight text-white md:text-5xl">
              {template.outcome}
            </h2>
            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-300">{template.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {isAvailable ? (
                <button
                  type="button"
                  onClick={handleAcquire}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-400"
                >
                  <Icon icon={owned ? 'solar:folder-with-files-linear' : 'solar:add-circle-linear'} />
                  {owned ? 'Abrir na biblioteca' : template.acquisitionLabel}
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-neutral-400"
                >
                  <Icon icon="solar:lock-keyhole-linear" />
                  Entrar na lista
                </button>
              )}
              <Link to="/studio" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
                <Icon icon="solar:stars-line-duotone" />
                Criar variacao no Studio
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/25 p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Destaques</p>
            <div className="mt-4 grid gap-3">
              {template.heroPoints.map((point) => (
                <div key={point} className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                  <Icon icon="solar:check-circle-bold-duotone" className="shrink-0 text-xl text-emerald-300" />
                  <span className="text-sm text-neutral-200">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Para quem serve</h2>
          <div className="mt-4 grid gap-3">
            {template.idealFor.map((item) => (
              <div key={item} className="rounded-2xl border border-white/5 bg-black/25 p-4 text-sm leading-6 text-neutral-300">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Arquitetura do template</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {template.architecture.map((item, index) => (
              <div key={item.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600">0{index + 1}</span>
                <p className="mt-2 text-sm font-bold text-white">{item.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <InfoList title="O que vem junto" items={template.includes} icon="solar:box-linear" />
        <InfoList title="Requisitos" items={template.requirements} icon="solar:settings-linear" />
        <InfoList title="Validacao" items={template.validation} icon="solar:shield-check-linear" />
      </div>
    </div>
  );
}

function InfoList({ title, items, icon }: { title: string; items: string[]; icon: string }) {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
          <Icon icon={icon} className="text-xl" />
        </div>
        <h2 className="font-bricolage text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="mt-4 grid gap-3">
        {items.map((item) => (
          <div key={item} className="flex gap-3 text-sm leading-6 text-neutral-300">
            <Icon icon="solar:round-alt-arrow-right-linear" className="mt-1 shrink-0 text-emerald-300" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
