import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAsyncData } from '@/hooks/useAsyncData';
import { kivoClient } from '@/services/kivoClient';

const sdkSteps = [
  {
    title: 'Baixe o Gateway SDK',
    description: 'Um pacote pequeno com cliente TypeScript e exemplo de gateway EV Charge para Raspberry.',
    icon: 'solar:download-bold-duotone',
  },
  {
    title: 'Instale o runtime',
    description: 'Use o bundle Docker para receber gatewayId, token, banco local e UI da estacao.',
    icon: 'solar:key-minimalistic-bold-duotone',
  },
  {
    title: 'Proteja o recurso',
    description: 'Crie a sessao de uso, cobre com x402 e libere acesso quando o pagamento confirmar.',
    icon: 'solar:shield-keyhole-bold-duotone',
  },
  {
    title: 'Receba eventos',
    description: 'Configure webhooks para status de pagamento, falhas e confirmacoes de settlement.',
    icon: 'solar:bell-bing-bold-duotone',
  },
];

const starterFiles = [
  'README.md',
  'package.json',
  'src/cli.ts',
  'src/client.ts',
  'src/runner.ts',
  'src/adapters/raspberry.ts',
];

const flowCards = [
  {
    title: 'API Toll',
    description: 'Roadmap para proteger rotas premium com os mesmos contratos x402.',
    icon: 'solar:code-square-bold-duotone',
  },
  {
    title: 'Data Gate',
    description: 'Roadmap para vender leituras autenticadas de sensores e telemetria.',
    icon: 'solar:database-bold-duotone',
  },
  {
    title: 'Agent Tool Paywall',
    description: 'Roadmap para cobrar chamadas de ferramentas de agentes depois do EV Charge.',
    icon: 'solar:magic-stick-3-bold-duotone',
  },
];

export default function IntegrationsPage() {
  const apiKeys = useAsyncData(() => kivoClient.listApiKeys(), []);
  const webhooks = useAsyncData(() => kivoClient.listWebhooks(), []);
  const pricing = useAsyncData(() => kivoClient.listX402PricingRules(), []);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo EV Charge SDK"
        title="Conecte o gateway de recarga EV"
        icon="solar:code-square-bold-duotone"
        description="Baixe o pacote Docker do Gateway, rode no Raspberry e envie heartbeat, autorizacao e eventos para liberar o recurso fisico."
        action={
          <a
            href="/sdk/kivo-sdk-starter.zip"
            download
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400"
          >
            <Icon icon="solar:download-bold" />
            Baixar Gateway SDK
          </a>
        }
      />

      <Card className="border-emerald-500/20 bg-emerald-500/[0.06]">
        <div className="flex items-start gap-3">
          <Icon icon="solar:electric-refueling-bold-duotone" className="mt-0.5 text-2xl text-emerald-300" />
          <p className="text-sm leading-6 text-neutral-200">
            No hackathon, o SDK operacional foca no Kivo EV Charge. Depois, os mesmos contratos suportam API Toll, Data Gate, Agent Tool Paywall e outros templates.
          </p>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        {sdkSteps.map((step, index) => (
          <Card key={step.title}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
                <Icon icon={step.icon} className="text-2xl" />
              </div>
              <Badge tone="ready">{index + 1}</Badge>
            </div>
            <h2 className="mt-4 font-bricolage text-lg font-bold text-white">{step.title}</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">{step.description}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.82fr]">
        <Card>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-bricolage text-xl font-bold text-white">Starter do Gateway SDK</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
                O bundle Docker e o caminho recomendado: baixar, rodar no Raspberry e adaptar os comandos locais da estacao EV Charge.
              </p>
            </div>
            <a
              href="/sdk/kivo-sdk-starter.zip"
              download
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/15"
            >
              <Icon icon="solar:download-bold" />
              Download .zip
            </a>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {starterFiles.map((file) => (
              <div key={file} className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/25 p-3 text-sm text-neutral-300">
                <Icon icon="solar:file-text-bold-duotone" className="text-lg text-emerald-300" />
                {file}
              </div>
            ))}
          </div>

          <pre className="mt-5 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-6 text-blue-100">{`import { KivoGatewayClient } from './src/client';
import { runOnce } from './src/runner';
import { RaspberryShellAdapter } from './src/adapters/raspberry';

const client = new KivoGatewayClient({
  baseUrl: process.env.KIVO_API_URL!,
  gatewayId: process.env.KIVO_GATEWAY_ID!,
  gatewayToken: process.env.KIVO_GATEWAY_TOKEN!,
});

await runOnce({
  client,
  adapter: new RaspberryShellAdapter({
    enableCommand: process.env.KIVO_GATEWAY_ENABLE_COMMAND!,
    disableCommand: process.env.KIVO_GATEWAY_DISABLE_COMMAND!,
  }),
});`}</pre>
        </Card>

        <div className="space-y-6">
          <Card>
            <h2 className="font-bricolage text-xl font-bold text-white">Pronto para operar a estacao?</h2>
            <div className="mt-5 space-y-3">
              <Link to="/studio" className="flex items-center justify-between rounded-xl bg-black/30 p-3 text-sm font-bold text-neutral-200 hover:bg-white/5">
                Abrir Kivo Studio
                <Icon icon="solar:arrow-right-linear" />
              </Link>
              <Link to="/library/power-totem" className="flex items-center justify-between rounded-xl bg-black/30 p-3 text-sm font-bold text-neutral-200 hover:bg-white/5">
                Abrir EV Charge na biblioteca
                <Icon icon="solar:arrow-right-linear" />
              </Link>
              <Link to="/checkout" className="flex items-center justify-between rounded-xl bg-emerald-500/10 p-3 text-sm font-bold text-emerald-300 hover:bg-emerald-500/15">
                Testar checkout x402
                <Icon icon="solar:arrow-right-linear" />
              </Link>
            </div>
          </Card>

          <Card>
            <h2 className="font-bricolage text-xl font-bold text-white">Estado da integracao</h2>
            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between rounded-xl bg-black/25 p-3">
                <span className="text-sm text-neutral-400">API keys</span>
                <Badge tone={(apiKeys.data?.length ?? 0) ? 'ready' : 'warning'}>{apiKeys.data?.length ?? 0}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-black/25 p-3">
                <span className="text-sm text-neutral-400">Webhooks</span>
                <Badge tone={(webhooks.data?.length ?? 0) ? 'ready' : 'warning'}>{webhooks.data?.length ?? 0}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-black/25 p-3">
                <span className="text-sm text-neutral-400">Recursos x402</span>
                <Badge tone={(pricing.data?.length ?? 0) ? 'ready' : 'warning'}>{pricing.data?.length ?? 0}</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-bricolage text-xl font-bold text-white">Roadmap de templates</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Estes templates nao sao o caminho primario do hackathon; eles reaproveitam os contratos depois que o EV Charge estiver fechado.
            </p>
          </div>
          <Badge tone="paused">Depois do MVP</Badge>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {flowCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-white/5 bg-black/25 p-5">
              <Icon icon={card.icon} className="text-3xl text-emerald-300" />
              <h3 className="mt-4 font-bricolage text-xl font-bold text-white">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{card.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-neutral-500">
                Roadmap nao funcional agora
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
