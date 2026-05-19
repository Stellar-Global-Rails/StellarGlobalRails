import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface MCPTool {
  id: string;
  title: string;
  description: string;
  icon: string;
  example: {
    input: Record<string, any>;
    output: Record<string, any>;
  };
}

const tools: MCPTool[] = [
  {
    id: 'create-access-flow',
    title: 'Create Access Flow',
    description: 'Define a protected physical or digital resource with x402 requirements',
    icon: 'solar:wallet-2-linear',
    example: {
      input: {
        resource_id: 'power-totem-rj-01',
        gateway_mode: 'physical',
        price: '1.00',
        asset: 'USDC',
        condition: 'session_60_seconds'
      },
      output: {
        flow_id: 'flow_power_totem_01',
        status: 'ready_for_testnet',
        created_at: '2026-05-15T11:04:00Z'
      }
    }
  },
  {
    id: 'generate-sdk-snippet',
    title: 'Generate SDK Snippet',
    description: 'Generate TypeScript setup code for gateway pairing and authorization',
    icon: 'solar:document-text-linear',
    example: {
      input: {
        flow_id: 'flow_power_totem_01',
        runtime: 'raspberry-pi',
        output: { type: 'gpio', pin: 17 }
      },
      output: {
        sdk_package: '@kivo/sdk',
        gateway_package: '@kivo/gateway',
        status: 'snippet_ready'
      }
    }
  },
  {
    id: 'validate-testnet',
    title: 'Validate Testnet',
    description: 'Check x402, Stellar proof, Etherfuse context, and gateway health',
    icon: 'solar:eye-linear',
    example: {
      input: {
        flow_id: 'flow_power_totem_01',
        authorization_id: 'auth_7a4f2c8b'
      },
      output: {
        x402: 'valid',
        stellar: 'confirmed',
        etherfuse: 'visible',
        gateway: 'healthy'
      }
    }
  },
  {
    id: 'subscribe-events',
    title: 'Subscribe Events',
    description: 'Receive gateway release, health, receipt, and payment events',
    icon: 'solar:widget-2-linear',
    example: {
      input: {
        webhook_url: 'https://api.myapp.com/kivo-events',
        events: ['authorization.created', 'gateway.released', 'receipt.created']
      },
      output: {
        webhook_id: 'hook-xyz789',
        status: 'active',
        verified: true
      }
    }
  }
];

export default function KivoMCPDemo() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-5xl lg:text-6xl font-bricolage font-bold text-white mb-6">
            Kivo Studio Agent Tools
          </h2>
          <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
            Connect AI agents to Kivo Studio so they can model resources, generate TypeScript SDK setup,
            validate x402/Stellar/Etherfuse flows, and monitor gateway events.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <motion.button
                onClick={() => setExpanded(expanded === tool.id ? null : tool.id)}
                className="w-full text-left p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group"
                whileHover={{ borderColor: 'rgba(16, 185, 129, 0.5)', backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
              >
                {/* Tool Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/30 transition-colors">
                      {/* @ts-ignore */}
                      <iconify-icon icon={tool.icon} width="24" className="text-emerald-400"></iconify-icon>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-sm text-white/50 group-hover:text-white/60 transition-colors">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded === tool.id ? 180 : 0 }}
                    className="text-emerald-400"
                  >
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:alt-arrow-down-linear" width="20"></iconify-icon>
                  </motion.div>
                </div>
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expanded === tool.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Input Example */}
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                          Input
                        </h4>
                        <pre className="bg-black/50 p-4 rounded-lg text-xs text-emerald-300 overflow-auto max-h-48 border border-white/5">
                          {JSON.stringify(tool.example.input, null, 2)}
                        </pre>
                      </div>

                      {/* Output Example */}
                      <div>
                        <h4 className="text-sm font-semibold text-emerald-400 mb-3 uppercase tracking-wider">
                          Output
                        </h4>
                        <pre className="bg-black/50 p-4 rounded-lg text-xs text-emerald-300 overflow-auto max-h-48 border border-white/5">
                          {JSON.stringify(tool.example.output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Real-World Example */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
        >
          <h3 className="text-2xl font-bricolage font-bold text-white mb-6">
            Real-World Example: Power Totem Agent
          </h3>
          <div className="space-y-4">
            {[
              { num: 1, title: 'Builder describes the resource', desc: 'Studio captures the Power Totem device, price, session length, and gateway mode.' },
              { num: 2, title: 'Agent generates SDK setup', desc: 'Kivo returns TypeScript snippets for x402 requirements, pairing, and gateway authorization.' },
              { num: 3, title: 'Testnet validation runs', desc: 'The flow checks Stellar proof, Etherfuse context, webhook signatures, and gateway health.' },
              { num: 4, title: 'Gateway release is recorded', desc: 'A short-lived authorization releases the physical resource and stores the receipt.' }
            ].map((step) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + step.num * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
                  {step.num}
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-1">{step.title}</h4>
                  <p className="text-white/60 text-sm">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-4 mt-8">
            <motion.a
              href="/doc/ai/kivo/mcp-tools#mcp"
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors"
            >
              View MCP Docs →
            </motion.a>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-lg border border-emerald-500 text-emerald-400 font-semibold hover:bg-emerald-500/10 transition-colors"
            >
              Try Demo
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
