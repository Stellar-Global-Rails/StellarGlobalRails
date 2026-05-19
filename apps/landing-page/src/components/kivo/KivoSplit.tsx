import { motion } from 'motion/react';

export default function KivoSplit() {
  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 relative z-10"
        >
          <span className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-widest text-emerald-400 mb-6 inline-block">Smart Contracts Soroban</span>
          <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Split de Pagamentos Nativo</h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Abandone gateways complexos. Com nossa infraestrutura, você divide recebimentos na origem (on-chain), antes que o saldo llegue na carteira. Ideal para marketplaces e franquias.
          </p>
        </motion.div>

        <div className="relative w-full max-w-3xl mx-auto py-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="w-32 h-32 mx-auto bg-black border border-white/20 rounded-2xl flex flex-col items-center justify-center relative z-20 shadow-2xl transition-transform"
          >
            <span className="text-3xl font-bricolage text-white">US$ 100</span>
            <span className="text-white/50 text-xs">Venda efetuada</span>
          </motion.div>

          <div className="w-[2px] h-16 bg-gradient-to-b from-white/20 to-emerald-500/50 mx-auto relative z-10 overflow-hidden">
            <motion.div 
              initial={{ y: "-100%" }}
              whileInView={{ y: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-full h-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-900 border border-emerald-500/50 text-emerald-400 text-[10px] uppercase font-mono px-2 py-1 rounded">Soroban Contract</div>
          </div>

          <div className="w-3/4 h-[2px] bg-emerald-500/50 mx-auto relative z-10 overflow-hidden">
            <motion.div 
              initial={{ x: "0%", width: "0%" }}
              whileInView={{ width: "100%", x: ["50%", "0%"] }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full w-full bg-emerald-400 shadow-[0_0_10px_#34d399] origin-center"
            />
          </div>
          
          <div className="flex justify-between w-3/4 mx-auto">
            <div className="w-[2px] h-12 bg-emerald-500/50 overflow-hidden">
              <motion.div 
                initial={{ y: "-100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-full h-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
              />
            </div>
            <div className="w-[2px] h-12 bg-emerald-500/50 overflow-hidden">
              <motion.div 
                initial={{ y: "-100%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
                className="w-full h-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
              />
            </div>
          </div>

          <div className="flex justify-between w-full max-w-2xl mx-auto -mt-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 w-40 text-center relative z-20 backdrop-blur-sm group hover:border-emerald-400 transition-colors cursor-pointer"
            >
              <div className="text-lg font-bricolage text-emerald-400">US$ 90</div>
              <div className="text-white/50 text-xs">Kivo Pay Vendedor</div>
              <div className="bg-emerald-400/10 text-emerald-400 text-[10px] uppercase mt-2 rounded py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Liquidado</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 w-40 text-center relative z-20 backdrop-blur-sm group hover:border-blue-400 transition-colors cursor-pointer"
            >
              <div className="text-lg font-bricolage text-blue-400">US$ 10</div>
              <div className="text-white/50 text-xs">Licença / Marketplace</div>
              <div className="bg-blue-400/10 text-blue-400 text-[10px] uppercase mt-2 rounded py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">Liquidado</div>
            </motion.div>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none z-0"></div>
        </div>
      </div>
    </section>
  );
}