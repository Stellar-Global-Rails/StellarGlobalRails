import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import BlurImage from './BlurImage';

const KivoGlobalMap = React.lazy(() => import('./KivoGlobalMap'));

export default function KivoShowcase() {
  const { ref, inView } = useInView({ rootMargin: '100px', triggerOnce: true });

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up relative">
      <div ref={ref} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none z-[-1] flex items-center justify-center">
        {inView && (
          <Suspense fallback={
            <motion.div 
              layoutId="globe-skeleton"
              animate={{ opacity: [0.5, 1, 0.5] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-[400px] h-[400px] rounded-full border border-white/5 bg-gradient-to-br from-white/5 to-transparent shadow-[0_0_50px_rgba(255,255,255,0.05)]"
            />
          }>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
              <KivoGlobalMap />
            </motion.div>
          </Suspense>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Hardware & Software. Zero Atrito.</h2>
        <p className="text-white/50 text-lg max-w-xl mx-auto backdrop-blur-md bg-black/20 rounded-full py-2 px-4">A infraestrutura global se adapta ao seu negócio, não importa onde ele opera.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
        >
          {/* Item 30: Blurhash Simulated */}
          <BlurImage 
            src="/fake-mobile.png" 
            alt="Kivo Mobile App" 
            blurColor="#065f46"
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          />

          <div className="relative z-10">
            <h3 className="text-2xl font-bricolage text-white mb-3">Kivo Mobile</h3>
            <p className="text-white/50 mb-8 max-w-[280px]">
              Com o Tap-to-Pay, qualquer celular com NFC se torna um ponto de venda global. Sem CNPJ, basta instalar e receber.
            </p>
            <ul className="space-y-3 mb-12">
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> Pagamento por aproximação (NFC)
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> Links de pagamento
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> QRCode Pix via OpenFinance
              </motion.li>
            </ul>
          </div>
          
          <div className="absolute -bottom-20 -right-20 w-80 h-[400px] bg-black border-[6px] border-neutral-800 rounded-[3rem] shadow-2xl rotate-12 group-hover:rotate-6 transition-transform duration-700 p-2 opacity-50 xl:opacity-100 flex flex-col pointer-events-none">
            <div className="w-full h-full bg-neutral-900 rounded-[2.5rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-emerald-500/10"></div>
              <div className="p-6 pt-12 flex flex-col items-center">
                <div className="text-sm text-white/50 mb-2">Cobrar</div>
                <div className="text-4xl font-bricolage text-white mb-12">R$ 45,00</div>
                <motion.div 
                  animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30"
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:wireless-charge-linear" width="48" class="text-emerald-400"></iconify-icon>
                </motion.div>
                <p className="mt-8 text-white/60 text-sm">Aproxime o cartão</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group"
        >
          {/* Item 30: Blurhash Simulated */}
          <BlurImage 
            src="/fake-terminal.png" 
            alt="Kivo Terminal Device" 
            blurColor="#1e3a8a"
            className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
          />

          <div className="relative z-10">
            <h3 className="text-2xl font-bricolage text-white mb-3">Kivo Terminal</h3>
            <p className="text-white/50 mb-8 max-w-[280px]">
              Offline? Sem internet? O hardware dedicado de baixo custo foi feito para as bordas do mundo.
            </p>
            <ul className="space-y-3 mb-12">
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> Chip 4G global embutido
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> Bateria para 7 dias em uso
              </motion.li>
              <motion.li 
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:check-read-linear" width="18" class="text-emerald-400"></iconify-icon> Visor e-ink ultra-resistente
              </motion.li>
            </ul>
          </div>

          <div className="absolute -bottom-10 -right-10 w-72 h-[320px] bg-neutral-800 rounded-3xl shadow-2xl -rotate-6 group-hover:rotate-0 transition-transform duration-700 p-4 opacity-50 xl:opacity-100 flex flex-col justify-between pointer-events-none border border-white/5">
            <div className="w-full h-32 bg-black rounded-xl p-4 flex flex-col justify-center border border-white/10 relative overflow-hidden">
              <div className="w-full flex justify-between items-center text-white/30 text-xs mb-4">
                <span>4G</span>
                <span>89%</span>
              </div>
              <motion.div 
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-center font-mono text-xl text-emerald-400"
              >
                APROVADO
              </motion.div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-4 px-2">
              {[1,2,3,4,5,6,7,8,9,'*',0,'#'].map((key, i) => (
                <div key={i} className="bg-white/5 h-10 rounded-lg flex items-center justify-center text-white/30 font-medium">
                  {key}
                </div>
              ))}
            </div>
            <div className="h-4 w-1/2 bg-black mx-auto mt-4 rounded-full border border-white/5"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}