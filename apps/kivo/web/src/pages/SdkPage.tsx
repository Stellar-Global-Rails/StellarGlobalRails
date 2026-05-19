import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';

const sdkParts = [
  { label: 'Client', description: 'Chamadas tipadas para challenge x402, pagamento e heartbeat de Gateway.' },
  { label: 'x402 helpers', description: 'Headers e utilitarios para enviar prova de pagamento Stellar sem expor segredo.' },
  { label: 'Adapters', description: 'Raspberry e serverless agora; fisico e digital como familias de runtime.' },
  { label: 'Examples', description: 'Power Totem como primeiro exemplo testavel e adaptavel.' },
  { label: 'Tests', description: 'Vitest cobrindo cliente, headers e contratos publicos do pacote.' },
  { label: 'Studio export', description: 'O Studio prepara um bundle local para baixar, testar e versionar junto do flow.' },
];

const snippets = [
  { label: 'Install local export', code: 'npm install ./kivo-sdk' },
  { label: 'Client', code: "const client = new KivoClient({ baseUrl: 'https://api.kivo.example', apiKey: process.env.KIVO_API_KEY });" },
  { label: 'Protected resource', code: "const challenge = await client.getX402Challenge('/paid/resource');\nconst payment = createPaymentHeader({ nonce: challenge.nonce, txXDR });" },
];

export default function SdkPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Kivo SDK"
        title="SDK TypeScript para baixar, testar e adaptar"
        icon="solar:code-square-linear"
        description="O SDK e a primeira superficie exportavel do Studio: download privado, client, helpers x402, adapters fisicos/digitais, exemplos, testes e snippets gerados por flow para uso local."
        action={
          <Link to="/gateway" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
            <Icon icon="solar:server-square-cloud-linear" />
            Conectar Gateway
          </Link>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-emerald-500/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),rgba(15,23,42,0.72)]">
          <Badge tone="ready">@kivo/sdk 0.1.0</Badge>
          <h2 className="mt-4 font-bricolage text-2xl font-bold text-white">SDK TypeScript pequeno, contrato claro</h2>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            A primeira versao continua privada: o Studio entrega um bundle local para baixar, testar, adaptar e instalar pelo caminho do workspace.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link to="/validation" className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
              <Icon icon="solar:shield-check-linear" />
              Validar integracao
            </Link>
            <Link to="/create-flow" className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/25 px-4 py-3 text-sm font-bold text-neutral-200 hover:bg-white/10">
              <Icon icon="solar:diagram-up-linear" />
              Gerar flow
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="font-bricolage text-xl font-bold text-white">Incluido no esqueleto</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {sdkParts.map((part) => (
              <div key={part.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
                <p className="text-sm font-bold text-white">{part.label}</p>
                <p className="mt-1 text-xs leading-5 text-neutral-400">{part.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bricolage text-xl font-bold text-white">Snippets concisos</h2>
          <Badge tone="neutral">gerados pelo Studio</Badge>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-3">
          {snippets.map((snippet) => (
            <div key={snippet.label} className="rounded-2xl border border-white/5 bg-black/25 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">{snippet.label}</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap rounded-xl border border-white/5 bg-neutral-950/80 p-3 text-xs leading-5 text-neutral-200">
                <code>{snippet.code}</code>
              </pre>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
