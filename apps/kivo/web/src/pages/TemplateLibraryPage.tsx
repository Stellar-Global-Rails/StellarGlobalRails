import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { getOwnedTemplates } from '@/data/templateMarketplace';
import { useTemplateLibraryStore } from '@/stores';

export default function TemplateLibraryPage() {
  const items = useTemplateLibraryStore((state) => state.items);
  const templates = getOwnedTemplates(items.map((item) => item.templateId));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Biblioteca"
        title="Templates adquiridos"
        icon="solar:folder-with-files-linear"
        description="Aqui ficam os templates que o usuario decidiu usar. O Studio cria solucoes custom; a Biblioteca configura e instala templates adquiridos."
        action={
          <Link to="/marketplace" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:widget-linear" />
            Abrir Marketplace
          </Link>
        }
      />

      {templates.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {templates.map((template) => (
            <Link
              key={template.id}
              to={`/library/${template.id}`}
              className="group rounded-2xl border border-emerald-500/15 bg-neutral-900/80 p-5 premium-shadow transition-colors hover:border-emerald-400/35 hover:bg-neutral-900"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="ready">adquirido</Badge>
                    <Badge tone="neutral">{template.surface}</Badge>
                  </div>
                  <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">{template.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-neutral-400">{template.tagline}</p>
                </div>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                  <Icon icon="solar:arrow-right-linear" className="text-2xl transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {template.heroPoints.map((point) => (
                  <div key={point} className="rounded-2xl border border-white/5 bg-black/20 p-3 text-xs leading-5 text-neutral-400">
                    {point}
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-white/10 bg-black/20 text-center">
          <Icon icon="solar:folder-with-files-linear" className="mx-auto text-4xl text-neutral-600" />
          <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Sua biblioteca ainda esta vazia</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Adquira o Power Totem no Marketplace para configurar o template, criar o recurso real e baixar o Gateway Docker.
          </p>
          <Link to="/marketplace" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
            <Icon icon="solar:add-circle-linear" />
            Escolher template
          </Link>
        </Card>
      )}
    </div>
  );
}
