import { motion } from 'motion/react';

export default function KivoOffRamp() {
  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Off-ramp direto pro seu Banco.</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-6">
            O dinheiro caiu em segundos na sua carteira USDC. Precisa pagar fornecedores ou custos locais? Saque para o seu banco via Pix em instantes.
          </p>
          <ul className="space-y-4">
            <motion.li 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1">1</div>
              <div>
                <p className="text-white font-medium">Saldo On-Chain (USDC)</p>
                <p className="text-white/40 text-sm">Protegido de inflação em moeda forte.</p>
              </div>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1">2</div>
              <div>
                <p className="text-white font-medium">Ancoras Locais (SEP-24)</p>
                <p className="text-white/40 text-sm">Integração nativa com parceiros regulados da rede Stellar.</p>
              </div>
            </motion.li>
            <motion.li 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 mt-1">3</div>
              <div>
                <p className="text-white font-medium">Liquidação via Pix</p>
                <p className="text-white/40 text-sm">Receba em R$ na sua conta corporativa tradicional.</p>
              </div>
            </motion.li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-neutral-900 border border-white/10 rounded-3xl p-6 relative z-10 shadow-2xl">
            <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
              <span className="text-white/50 text-sm">Saldo Disponível</span>
              <span className="text-2xl font-bricolage text-white">450.00 <span className="text-white/40 text-sm">USDC</span></span>
            </div>

            <div className="mb-4">
              <div className="text-white/40 text-xs uppercase mb-2">Sacar para</div>
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black/30 border border-white/5 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center p-1.5">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/1/19/Ita%C3%BA_Unibanco_logo_2023.svg" alt="Itaú" className="w-full h-full object-contain grayscale brightness-150" />
                  </div>
                  <div>
                    <div className="text-white text-sm">Banco Itaú</div>
                    <div className="text-white/40 text-xs font-mono">*** 3456</div>
                  </div>
                </div>
                <div className="text-emerald-400 text-xs">PIX</div>
              </motion.div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-white text-black py-4 rounded-xl font-medium hover:bg-emerald-400 hover:text-black transition-colors flex items-center justify-center gap-2"
            >
              Sacar 450.00 USDC
              {/* @ts-ignore */}
              <iconify-icon icon="solar:arrow-right-linear" width="16"></iconify-icon>
            </motion.button>
          </div>
          
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] pointer-events-none -z-10"
          />
        </motion.div>
      </div>
    </section>
  );
}