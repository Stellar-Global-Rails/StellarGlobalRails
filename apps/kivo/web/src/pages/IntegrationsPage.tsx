import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { advancedTools } from '@/data/advancedTools';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';

const integrationToolRoutes = ['/api-keys', '/webhooks', '/mcp', '/x402', '/deploy'];

const integrationCards = [
  {
    title: 'Templates',
    route: '/templates',
    icon: 'solar:bolt-circle-bold-duotone',
    description: 'Tres pontos de partida do Solo MVP para configurar flows sem catalogo amplo.',
    status: 'ready',
  },
  ...advancedTools
    .filter((tool) => integrationToolRoutes.includes(tool.route))
    .map((tool) => ({
      ...tool,
      status: tool.route === '/deploy' ? 'warning' : 'ready',
    })),
];

export default function IntegrationsPage() {
  const tools = useAsyncData(() => kivoClient.listMcpTools(), []);
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Advanced"
        title="Ferramentas de integracao"
        icon="solar:code-square-bold-duotone"
        description="Superficie tecnica para conectar SDKs, webhooks, x402 e agentes quando o flow principal ja precisa virar integracao."
        action={<Link to="/api-keys" className="rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">Gerar credencial</Link>}
      />

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {integrationCards.map((card) => (
          <Link key={card.title} to={card.route} className="group rounded-2xl border border-white/5 bg-neutral-900/80 p-5 premium-shadow transition-colors hover:border-emerald-500/30 hover:bg-neutral-900">
            <div className="flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                <Icon icon={card.icon} className="text-2xl" />
              </div>
              <Badge tone={card.status}>{card.status}</Badge>
            </div>
            <h2 className="mt-5 font-bricolage text-xl font-bold text-white">{card.title}</h2>
            <p className="mt-3 min-h-16 text-sm leading-6 text-neutral-400">{card.description}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-emerald-400">
              Abrir
              <Icon icon="solar:arrow-right-up-linear" className="transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Sequencia tecnica de integracao</h2>
          <p className="mt-1 text-sm text-neutral-500">Atalhos para validar credenciais, eventos e pagamento depois que o flow base ja foi escolhido.</p>
          <div className="mt-5 space-y-3">
            {[
              ['Escolher template MVP', '/templates'],
              ['Criar API key', '/api-keys'],
              ['Configurar webhook', '/webhooks'],
              ['Testar pagamento x402', '/checkout'],
            ].map(([label, route], index) => (
              <Link key={label} to={route} className="flex items-center justify-between rounded-xl bg-black/30 p-3 hover:bg-white/5">
                <span className="flex items-center gap-3 text-sm text-neutral-300">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs font-bold text-black">{index + 1}</span>
                  {label}
                </span>
                <Icon icon="solar:arrow-right-linear" className="text-neutral-600" />
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">MCP tools</p>
              <p className="mt-2 font-bricolage text-3xl font-bold text-white">{tools.data?.length ?? 0}</p>
              <p className="mt-2 text-sm text-neutral-500">Ferramentas disponiveis para agentes.</p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">x402 rules</p>
              <p className="mt-2 font-bricolage text-3xl font-bold text-white">{pricing.data?.length ?? 0}</p>
              <p className="mt-2 text-sm text-neutral-500">Recursos pagos configurados.</p>
            </div>
          </div>
          <pre className="mt-5 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-6 text-blue-100">{`import { KivoClient } from '@kivo/sdk';

const kivo = new KivoClient({ apiKey: process.env.KIVO_API_KEY });

const payment = await kivo.payments.create({
  amount: '0.0500000',
  assetCode: 'USDC',
  conditionType: 'service_complete'
});`}</pre>
        </Card>
      </div>
    </div>
  );
}
