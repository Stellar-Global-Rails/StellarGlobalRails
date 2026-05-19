import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function OnyxPage() {
  const { t } = useTranslation();

  const features = [
    {
      title: "Auditoria em Tempo Real",
      desc: "Todas as transações dos 3 produtos principais passam pelo crivo do ONYX antes de serem registradas na blockchain, garantindo conformidade absoluta.",
      icon: "solar:shield-check-linear"
    },
    {
      title: "Detecção de Padrões (AML/KYC)",
      desc: "IA treinada para identificar lavagem de dinheiro, estruturação de pagamentos e anomalias baseadas em comportamento histórico on-chain.",
      icon: "solar:radar-linear"
    },
    {
      title: "Verificação Global de Sanções",
      desc: "Integração instantânea com listas OFAC, ONU e listas locais de sanções para barrar transferências para endereços ilícitos.",
      icon: "solar:global-linear"
    },
    {
      title: "Provas de Conhecimento Zero (ZKP)",
      desc: "Valide dados de clientes sem expô-los. O Protocolo 25 da rede Stellar garante privacidade mantendo a total auditabilidade regulatória.",
      icon: "solar:eye-closed-linear"
    }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden pb-32">
      {/* Background Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[40vh] blur-[120px] opacity-20 pointer-events-none bg-blue-500"></div>
      <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay pointer-events-none"></div>

      {/* Nav spacing */}
      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          {/* Back button */}
          <a href="/" className="inline-flex items-center justify-center gap-2 text-white/50 hover:text-white transition-colors mb-12">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span className="text-sm">Voltar para o Início</span>
          </a>

          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="flex flex-col items-center">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:shield-network-bold-duotone" width="20" className="text-blue-400"></iconify-icon>
              <span className="text-sm font-medium text-blue-200 tracking-wider uppercase">Camada Transversal</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bricolage font-semibold text-white leading-tight mb-8">
              ONYX Compliance Engine
            </h1>
            
            <p className="text-xl md:text-2xl text-white/50 leading-relaxed max-w-3xl mx-auto font-light">
              O escudo invisível da Nova Economia B2B. Inteligência artificial e blockchain trabalhando juntas para proteger cada transação da suíte Stellar Global Rails.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Visual Abstract Box - Full width */}
      <div className="max-w-6xl mx-auto px-6 mb-32 relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative h-[400px] w-full rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent border border-white/10 overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15)_0%,transparent_70%)]"></div>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute w-[600px] h-[600px] border border-blue-500/20 rounded-full animate-[spin_20s_linear_infinite]"></div>
            <div className="absolute w-[400px] h-[400px] border border-blue-500/40 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            <div className="absolute w-[200px] h-[200px] border border-blue-400/60 rounded-full animate-[spin_10s_linear_infinite]"></div>
            
            <div className="w-32 h-32 rounded-3xl bg-black/80 backdrop-blur-xl border border-blue-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.5)] z-10 relative">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:shield-network-bold-duotone" width="64" className="text-blue-400"></iconify-icon>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Proteção em nível institucional</h2>
          <p className="text-xl text-white/40 max-w-2xl mx-auto">Construído para bancos, mas acessível a todos os produtos da nossa suíte.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-blue-500/30 transition-all duration-500 group">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 text-blue-400 group-hover:scale-110 transition-transform duration-500">
                {/* @ts-ignore */}
                <iconify-icon icon={feat.icon} width="32"></iconify-icon>
              </div>
              <h3 className="text-2xl font-medium text-white mb-4">{feat.title}</h3>
              <p className="text-white/50 leading-relaxed text-lg">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cross-Product Integration */}
      <div className="mt-32 max-w-6xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bricolage text-white mb-6">Presente em toda a Suíte</h2>
            <p className="text-white/50 text-lg leading-relaxed mb-8">
              O ONYX não é um módulo isolado que você precisa integrar. Ele é a camada de segurança inerente ao <strong>SocialPay</strong>, <strong>ContractEase</strong> e <strong>Kivo Pay</strong>. Nenhuma transação é executada sem o carimbo de conformidade do ONYX.
            </p>
            <div className="flex gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center border border-pink-500/30"><iconify-icon icon="solar:users-group-rounded-linear" width="24" className="text-pink-400"></iconify-icon></div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-center">
                <div className="w-8 h-px bg-white/20"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-500/30"><iconify-icon icon="solar:document-text-linear" width="24" className="text-purple-400"></iconify-icon></div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-center">
                <div className="w-8 h-px bg-white/20"></div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"><iconify-icon icon="solar:wallet-linear" width="24" className="text-emerald-400"></iconify-icon></div>
              </div>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-auto text-center md:text-left">
             <a href="/#products" className="inline-block px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors">
               Explorar os Produtos
             </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
