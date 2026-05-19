import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  useCase: string;
  fullDescription: string;
  steps: string[];
  actors: string;
  codeExample: string;
  savings: string;
}

const templates: Template[] = [
  {
    id: 'ev-charging',
    name: 'EV Charging Network',
    description: 'Vehicles paying for energy in real-time',
    icon: 'solar:car-2-linear',
    useCase: 'Electric vehicle at charging station',
    fullDescription:
      'Enable autonomous electric vehicles to pay for electricity as they charge. The payment is conditional on energy delivered, ensuring fair settlement for both parties.',
    steps: [
      'EV device detects charging station location',
      'Device initiates payment with condition: "Pay when 10 kWh delivered"',
      'Smart meter confirms energy delivery in real-time',
      'Payment executes automatically on Stellar',
      'Vehicle receives confirmation and continues driving'
    ],
    actors: 'Electric Vehicle (Payer) ↔ Charging Station (Payee)',
    codeExample: `const charging = await kivo.createPayment({
  from_device: 'EV-001',
  to_device: 'charger-05',
  amount: 2.50,
  condition: 'energy_delivered_kwh:10',
  timeout: 3600
});

// Settlement confirms delivery
const result = await charging.execute();`,
    savings: 'Save up to 75% on payment processing'
  },
  {
    id: 'energy-trading',
    name: 'Energy Trading P2P',
    description: 'Neighbors selling solar energy directly',
    icon: 'solar:bolt-circle-linear',
    useCase: 'House with solar panels selling to neighbor',
    fullDescription:
      'Peer-to-peer energy trading without intermediaries. Homeowners with solar panels can sell excess energy to neighbors in real-time with instant settlement.',
    steps: [
      'House A (solar producer) offers energy on P2P network',
      'House B (consumer) receives smart meter signal: "2.5 kWh available at $0.30"',
      'House B initiates payment with condition for delivery',
      'Smart meters execute energy transfer and payment atomically',
      'Both parties receive instant confirmation on Stellar'
    ],
    actors: 'House A (Solar Producer) ↔ House B (Consumer)',
    codeExample: `const energyTrade = await kivo.createPayment({
  from_device: 'smartmeter-b123',
  to_device: 'solar-panel-a456',
  amount: 0.75, // 2.5 kWh × $0.30
  condition: 'energy_delivered_kwh:2.5',
  timeout: 1800
});`,
    savings: 'Real-time settlement, zero middleman fees'
  },
  {
    id: 'ai-agents',
    name: 'Autonomous AI Agents',
    description: 'Agents paying for computational services',
    icon: 'solar:cpu-bolt-linear',
    useCase: 'AI agent paying for API and compute resources',
    fullDescription:
      'Autonomous AI agents can negotiate and pay for services without human intervention. Perfect for microservices and computational resources on-demand.',
    steps: [
      'AI agent identifies need for service (API call, compute resource)',
      'Agent queries MCP to find available provider',
      'Agent creates conditional payment: "Pay when service executed"',
      'Service provider executes and returns result',
      'Payment confirms automatically on Stellar'
    ],
    actors: 'AI Agent (Payer) ↔ Service Provider (Receiver)',
    codeExample: `const servicePayment = await kivo.mcp.createPayment({
  from_agent: 'analysis-bot-v2',
  to_service: 'compute-provider-api',
  amount: 5.00,
  condition: 'service_completed',
  timeout: 300
});

const result = await servicePayment.execute();`,
    savings: 'Zero human intervention, instant payments'
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
            Ready-to-Use Templates
          </h2>
          <p className="text-xl text-white/60 max-w-3xl">
            Start building M2M payment solutions with pre-configured templates. Each template includes
            architecture diagrams, code examples, and real-world scenarios.
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
                className="w-full text-left h-full p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col"
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderColor: 'rgba(16, 185, 129, 0.5)' }}
              >
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                  {/* @ts-ignore */}
                  <iconify-icon icon={template.icon} width="28" className="text-emerald-400"></iconify-icon>
                </div>

                {/* Content */}
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

                      {/* Actors & Savings */}
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
                          <p className="text-white font-medium">{template.savings}</p>
                        </div>

                        <a
                          href={`/doc/ai/kivopay#template-${template.id}`}
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
                        href={`/doc/ai/kivopay#template-${template.id}`}
                        whileHover={{ scale: 1.05 }}
                        className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
                      >
                        Read Full Guide →
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
