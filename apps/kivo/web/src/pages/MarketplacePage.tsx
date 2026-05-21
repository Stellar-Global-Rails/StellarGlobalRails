import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { communityTemplates, getAvailableTemplates, getComingSoonTemplates } from '@/data/templateMarketplace';
import { useTemplateLibraryStore } from '@/stores';

const surfaceIcon = {
  physical: 'solar:bolt-circle-linear',
  digital: 'solar:server-square-cloud-linear',
  hybrid: 'solar:link-round-angle-linear',
};

export default function MarketplacePage() {
  const hasTemplate = useTemplateLibraryStore((state) => state.hasTemplate);
  const availableTemplates = getAvailableTemplates();
  const comingSoonTemplates = getComingSoonTemplates();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Marketplace"
        title="Templates Kivo"
        icon="solar:widget-linear"
        description="Templates sao produtos reutilizaveis. Hoje o Kivo EV Charge e o template funcional: recarga eletrica pay-per-use com gateway local, x402, Stellar e Etherfuse."
        action={
          <Link to="/library" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:folder-with-files-linear" />
            Minha biblioteca
          </Link>
        }
      />

      <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.75)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge tone="ready">disponivel agora</Badge>
            <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">Recarga EV funcional</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-300">
              Um kit pronto para apresentar ao cliente final: tela com QR, checkout x402 e gateway local autorizando a sessao de recarga.
            </p>
          </div>
          <Link to="/studio" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:stars-line-duotone" />
            Criar solucao custom
          </Link>
        </div>

        <div className="mt-5 grid gap-4">
          {availableTemplates.map((template) => (
            <Link
              key={template.id}
              to={`/templates/${template.id}`}
              className="group rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-5 transition-colors hover:border-emerald-400/40 hover:bg-emerald-500/[0.09]"
            >
              <div className="grid gap-5 lg:grid-cols-[1fr_0.45fr]">
                <div className="flex gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-300">
                    <Icon icon={surfaceIcon[template.surface]} className="text-3xl" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bricolage text-2xl font-bold text-white">{template.name}</h3>
                      <Badge tone={hasTemplate(template.id) ? 'ready' : 'processing'}>
                        {hasTemplate(template.id) ? 'na biblioteca' : template.badge}
                      </Badge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">{template.tagline}</p>
                    <p className="mt-3 text-xs leading-5 text-neutral-500">{template.outcome}</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-white/5 bg-black/20 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500">Runtime principal</p>
                  <p className="mt-2 text-sm font-bold text-white">{template.primaryRuntime}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
                    Ver template
                    <Icon icon="solar:arrow-right-linear" className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Proximos templates</h2>
            <p className="mt-1 text-sm text-neutral-500">Roadmap publico, sem vender como pronto.</p>
          </div>
          <Badge tone="future">em breve</Badge>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {comingSoonTemplates.map((template) => (
            <div key={template.id} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <div className="flex items-start justify-between gap-3">
                <Icon icon={surfaceIcon[template.surface]} className="text-2xl text-violet-300" />
                <Badge tone="planned">{template.badge}</Badge>
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">{template.name}</h3>
              <p className="mt-2 text-xs leading-5 text-neutral-400">{template.tagline}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-600">{template.category}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Comunidade</h2>
            <p className="mt-1 text-sm text-neutral-500">Templates publicos criados por usuarios aparecem aqui depois do launch publico.</p>
          </div>
          <Badge tone="neutral">{communityTemplates.length} publicados</Badge>
        </div>
        <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-black/20 p-6 text-center">
          <Icon icon="solar:users-group-rounded-linear" className="mx-auto text-3xl text-neutral-600" />
          <h3 className="mt-3 font-bricolage text-lg font-bold text-white">Nenhum template da comunidade ainda</h3>
          <p className="mt-2 text-sm leading-6 text-neutral-500">
            Quando alguem validar um flow e escolher publicar como template publico, ele entra nesta prateleira.
          </p>
        </div>
      </Card>
    </div>
  );
}
