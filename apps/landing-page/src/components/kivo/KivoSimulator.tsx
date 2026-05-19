import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoSimulator() {
  const [amount, setAmount] = useState<number>(1000);

  const traditionalFee = amount * 0.045;
  const traditionalPayout = amount - traditionalFee;

  const kivoFee = amount * 0.001;
  const kivoPayout = amount - kivoFee;

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador de Custos e Liquidação</h2>
        <p className="text-white/50 text-lg">Veja na prática a diferença entre a infraestrutura tradicional (D+30) e a liquidação instantânea da Stellar.</p>
      </motion.div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-2xl bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center mb-12">
          <label className="text-white/60 mb-4 font-mono uppercase tracking-widest text-sm">Valor da Venda (R$)</label>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileFocus={{ scale: 1.05 }}
            className="flex items-center gap-4 bg-black/40 border border-white/20 rounded-2xl px-6 py-4 focus-within:border-emerald-500/50 transition-colors"
          >
            <span className="text-2xl text-white/40">R$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              className="bg-transparent border-none outline-none text-4xl text-white font-bricolage text-center w-48"
              min="0"
            />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6 md:p-8 flex flex-col transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:card-2-linear" width="24"></iconify-icon>
              </div>
              <h3 className="text-xl font-medium text-white">Maquininha Comum</h3>
            </div>
            
            <div className="space-y-4 mb-8 grow">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Taxa média (Antecipação + MDR)</span>
                <span className="text-red-400 font-mono">~4.5%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Prazo de liquidação</span>
                <span className="text-white">Até 30 dias</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Custo total</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={traditionalFee}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 font-mono"
                  >
                    - R$ {traditionalFee.toFixed(2)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t border-red-500/20 pt-6">
              <p className="text-white/50 text-sm mb-2">Você recebe em 30 dias:</p>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={traditionalPayout}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-3xl font-bricolage text-white"
                >
                  R$ {traditionalPayout.toFixed(2)}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 md:p-8 flex flex-col relative overflow-hidden group transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:bolt-circle-linear" width="24"></iconify-icon>
                </div>
                <h3 className="text-xl font-medium text-white">Kivo Pay</h3>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-mono uppercase tracking-widest border border-emerald-500/20">Recomendado</span>
            </div>
            
            <div className="space-y-4 mb-8 grow relative z-10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Taxa de transação</span>
                <span className="text-emerald-400 font-mono">~0.1%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Prazo de liquidação</span>
                <span className="text-emerald-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  &lt; 5 Segundos
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/50">Custo total</span>
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={kivoFee}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-emerald-400 font-mono"
                  >
                    - R$ {kivoFee.toFixed(2)}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="border-t border-emerald-500/30 pt-6 relative z-10">
              <p className="text-white/50 text-sm mb-2">Você recebe agora (USDC):</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={kivoPayout}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <p className="text-4xl font-bricolage text-emerald-400">R$ {kivoPayout.toFixed(2)}</p>
                  <p className="text-emerald-400/50 text-xs mt-2 font-mono">+{((kivoPayout - traditionalPayout) / traditionalPayout * 100).toFixed(1)}% de lucro retido</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}