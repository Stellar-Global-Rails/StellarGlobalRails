import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Template {
  id: string;
  name: string;
  status: 'functional' | 'roadmap';
  description: string;
  icon: string;
  useCase: string;
  fullDescription: string;
  steps: string[];
  actors: string;
  codeExample: string;
  impact: string;
}

const templates: Template[] = [
  {
    id: 'power-totem',
    name: 'Power Totem',
    status: 'functional',
    description: 'Template funcional do hackathon para liberar um recurso fisico com pagamento x402.',
    icon: 'solar:bolt-circle-linear',
    useCase: 'Raspberry Pi + tela + QR + carga segura',
    fullDescription:
      'Power Totem mostra o Kivo Gateway no mundo fisico: uma tela exibe o QR, o checkout exige pagamento x402, Kivo valida Stellar/Etherfuse e o gateway libera uma carga segura por uma sessao curta.',
    steps: [
      'Operador cria o flow Power Totem no Kivo',
      'Gateway no Raspberry Pi pareia com o flow',
      'Visitante escaneia o QR do totem',
      'Checkout x402 solicita pagamento',
      'Kivo valida Stellar e mostra contexto Etherfuse',
      'Gateway libera a carga segura e registra health/recibo'
    ],
    actors: 'Visitante -> Checkout Kivo -> Stellar/Etherfuse -> Raspberry Gateway',
    codeExample: `import { KivoGateway } from '@kivo/gateway';

const gateway = new KivoGateway({
  flowId: 'power-totem-rj-01',
  mode: 'physical',
  output: { type: 'gpio', pin: 17 }
});

await gateway.start();`,
    impact: 'Demo fisica e online pronta para hackathon'
  },
  {
    id: 'api-toll',
    name: 'API Toll',
    status: 'roadmap',
    description: 'Gateway digital para cobrar acesso a endpoints e respostas premium.',
    icon: 'solar:programming-linear',
    useCase: 'API protegida por x402 antes de responder',
    fullDescription:
      'API Toll sera um template para times que querem vender acesso a endpoints, dados ou automacoes sem criar billing do zero.',
    steps: [
      'Usuario descreve endpoint e politica no Studio',
      'AI agents geram middleware com SDK TypeScript',
      'Gateway digital intercepta a requisicao',
      'x402 exige pagamento antes da resposta',
      'Kivo valida e libera a chamada',
      'Mainnet privada exige billing Kivo'
    ],
    actors: 'Cliente API -> Gateway digital -> Kivo -> API privada',
    codeExample: `import { requireKivoAccess } from '@kivo/sdk/http';

export const GET = requireKivoAccess({
  resource: 'premium-weather-api',
  price: '0.05',
  asset: 'USDC'
})(handler);`,
    impact: 'Roadmap pos-hackathon'
  },
  {
    id: 'agent-tool-paywall',
    name: 'Agent Tool Paywall',
    status: 'roadmap',
    description: 'Agentes de IA pagando por tools, compute, dados e automacoes.',
    icon: 'solar:cpu-bolt-linear',
    useCase: 'Tool call liberada somente apos pagamento',
    fullDescription:
      'Agent Tool Paywall sera o caminho para agentes autonomos consumirem recursos pagos com autorizacao verificavel.',
    steps: [
      'Studio modela a tool e o preco',
      'SDK gera wrapper da ferramenta',
      'Agente recebe requisito x402',
      'Pagamento e validado',
      'Tool executa com recibo',
      'Uso privado em mainnet passa por billing'
    ],
    actors: 'AI Agent -> Kivo tool gateway -> Provider',
    codeExample: `import { paidTool } from '@kivo/sdk/agents';

export const enrichLead = paidTool({
  name: 'enrich_lead',
  price: '0.10',
  asset: 'USDC',
  handler: enrichLeadHandler
});`,
    impact: 'Roadmap para economia de agentes'
  }
];

export default function KivoTemplateGallery() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
            Power Totem e roadmap de templates
          </h2>
          <p className="text-xl text-white/60 max-w-3xl">
            O produto e Kivo Gateway + Kivo Studio. Templates sao aceleradores: Power Totem funciona no hackathon; os demais entram depois como blueprints reutilizaveis.
          </p>
        </motion.div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {templates.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <motion.button
                onClick={() => setExpanded(expanded === template.id ? null : template.id)}
                className="relative w-full text-left h-full p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(16, 185, 129, 0.5)' }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  {/* @ts-ignore */}
                  <iconify-icon icon={template.icon} width="28" className="text-emerald-400"></iconify-icon>
                </div>

                {/* Content */}
                <span className={`inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-widest ${
                  template.status === 'functional'
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-400/20'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}>
                  {template.status === 'functional' ? 'Funcional agora' : 'Roadmap'}
                </span>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-white/50 mb-4 flex-1 group-hover:text-white/60 transition-colors">
                  {template.description}
                </p>

                {/* Use Case */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-emerald-400/70 mb-2">USE CASE</p>
                  <p className="text-sm text-white/70 group-hover:text-white/80 transition-colors">
                    {template.useCase}
                  </p>
                </div>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: expanded === template.id ? 180 : 0 }}
                  className="absolute top-6 right-6 text-emerald-400"
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:alt-arrow-down-linear" width="20"></iconify-icon>
                </motion.div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Expanded Template Details */}
        <AnimatePresence mode="wait">
          {expanded && (
            <motion.div
              key={expanded}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="p-12 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
            >
              {templates
                .filter((t) => t.id === expanded)
                .map((template) => (
                  <div key={template.id}>
                    {/* Header */}
                    <div className="flex items-start gap-6 mb-8">
                      <div className="w-16 h-16 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                        {/* @ts-ignore */}
                        <iconify-icon icon={template.icon} width="32" className="text-emerald-400"></iconify-icon>
                      </div>
                      <div>
                        <h3 className="text-3xl font-bricolage font-bold text-white mb-2">
                          {template.name}
                        </h3>
                        <p className="text-lg text-white/60">{template.fullDescription}</p>
                      </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                      {/* Steps */}
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-4">How It Works</h4>
                        <ol className="space-y-3">
                          {template.steps.map((step, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="flex items-start gap-3"
                            >
                              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-sm text-white font-semibold mt-0.5">
                                {idx + 1}
                              </div>
                              <p className="text-white/80 pt-0.5">{step}</p>
                            </motion.li>
                          ))}
                        </ol>
                      </div>

                      {/* Actors & Impact */}
                      <div className="space-y-6">
                        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                            Actors
                          </p>
                          <p className="text-white font-medium">{template.actors}</p>
                        </div>

                        <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                            Impact
                          </p>
                          <p className="text-white font-medium">{template.impact}</p>
                        </div>

                        <a
                          href={`/doc/ai/kivo#template-${template.id}`}
                          className="block p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/50 transition-all group"
                        >
                          <p className="text-white font-medium group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                            View Full Documentation
                            {/* @ts-ignore */}
                            <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon>
                          </p>
                        </a>
                      </div>
                    </div>

                    {/* Code Example */}
                    <div className="mb-8">
                      <h4 className="text-lg font-semibold text-white mb-4">Code Example</h4>
                      <div className="relative">
                        <pre className="bg-black/50 p-6 rounded-xl text-sm text-emerald-300 overflow-auto max-h-48 border border-white/5">
                          {template.codeExample}
                        </pre>
                        <button
                          onClick={() => navigator.clipboard.writeText(template.codeExample)}
                          className="absolute top-4 right-4 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/60 hover:text-white transition-colors text-xs font-medium"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex gap-4">
                      <motion.a
                        href={`/doc/ai/kivo#template-${template.id}`}
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        Read Full Guide -&gt;
                      </motion.a>
                      <motion.button
                        onClick={() => setExpanded(null)}
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-3 rounded-lg border border-white/20 text-white font-semibold hover:border-white/40 transition-colors"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
