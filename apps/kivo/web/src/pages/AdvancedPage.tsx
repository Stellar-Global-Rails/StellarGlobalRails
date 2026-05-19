import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { advancedTools } from '@/data/advancedTools';

export default function AdvancedPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Advanced"
        title="Ferramentas avancadas"
        icon="solar:settings-bold-duotone"
        description="Superficie tecnica para operadores e builders: dispositivos, credenciais, webhooks, x402, MCP, deploy e configuracoes. O fluxo principal continua em Home, Create Flow e Payments."
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {advancedTools.map((tool) => (
          <Link
            key={tool.route}
            to={tool.route}
            className="group rounded-2xl border border-white/5 bg-neutral-900/80 p-4 premium-shadow transition-colors hover:border-emerald-500/30 hover:bg-neutral-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon icon={tool.icon} className="text-xl" />
              </div>
              <Icon icon="solar:arrow-right-up-linear" className="text-lg text-neutral-600 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-400" />
            </div>
            <h2 className="mt-4 font-bricolage text-lg font-bold text-white">{tool.title}</h2>
            <p className="mt-2 min-h-14 text-sm leading-5 text-neutral-400">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
