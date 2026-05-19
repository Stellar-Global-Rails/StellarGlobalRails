import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function KivoSafeCheckoutSimulator() {
  const [status, setStatus] = useState(0); // 0: setup, 1: locked, 2: delivery, 3: unlocked

  const handleNext = () => {
    setStatus((prev) => {
      const next = (prev + 1) % 4;
      if (next === 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10b981', '#f59e0b', '#ffffff']
        });
      }
      return next;
    });
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador Kivo Safe Checkout</h2>
        <p className="text-white/50 text-lg">Veja como o Escrow da Stellar garante segurança 100% para o comprador e o vendedor em transações de alto valor.</p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Comprador */}
          <div className={`flex flex-col items-center p-6 rounded-2xl border transition-all w-full md:w-1/3 ${status === 0 ? 'bg-white/10 border-white/30' : 'bg-black/50 border-white/10'}`}>
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:cart-large-bold" width="32"></iconify-icon>
            </div>
            <h3 className="text-white font-medium mb-1">Comprador B2B</h3>
            <p className="text-xs text-white/40 text-center mb-6 h-8">
              {status === 0 ? 'Pronto para depositar 5.000 USDC.' : status === 2 ? 'Aguardando mercadoria...' : 'Recebe a mercadoria em segurança.'}
            </p>
            
            <button 
              onClick={handleNext}
              disabled={status !== 0 && status !== 2}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                status === 0 
                  ? 'bg-blue-500 text-white hover:bg-blue-400' 
                  : status === 2 
                    ? 'bg-emerald-500 text-black hover:bg-emerald-400'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {status === 0 ? 'Depositar no Kivo' : status === 2 ? 'Confirmar Recebimento' : 'Aguardando...'}
            </button>
          </div>

          {/* O Smart Contract do Kivo */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3">
             <div className="text-xs font-mono text-emerald-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
               Kivo Smart Contract
             </div>
             
             <motion.div 
               animate={{ 
                 scale: status === 1 || status === 2 ? 1.1 : 1,
                 borderColor: status === 3 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.2)'
               }}
               className="w-32 h-32 rounded-full border-4 border-white/20 flex flex-col items-center justify-center bg-black relative"
             >
                {/* @ts-ignore */}
                <iconify-icon 
                  icon={status === 0 ? "solar:shield-linear" : status === 3 ? "solar:check-circle-bold" : "solar:lock-bold"} 
                  width="48" 
                  class={status === 3 ? "text-emerald-400" : status > 0 ? "text-yellow-400" : "text-white/20"}
                ></iconify-icon>

                <AnimatePresence>
                  {status === 1 && (
                    <motion.div 
                      initial={{ left: '-100%', opacity: 0, scale: 0.5 }}
                      animate={{ left: '50%', opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400 z-50 shadow-[0_0_20px_rgba(250,204,21,0.5)] bg-black rounded-full p-2 border border-yellow-500/20"
                    >
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:wad-of-money-bold" width="32"></iconify-icon>
                    </motion.div>
                  )}
                  {status === 3 && (
                    <motion.div 
                      initial={{ left: '50%', opacity: 1, scale: 1 }}
                      animate={{ left: '200%', opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', bounce: 0.4, duration: 1 }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-emerald-400 z-50 shadow-[0_0_20px_rgba(16,185,129,0.5)] bg-black rounded-full p-2 border border-emerald-500/20"
                    >
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:wad-of-money-bold" width="32"></iconify-icon>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {(status === 1 || status === 2) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: -20 }}
                      className="absolute -bottom-6 bg-yellow-500/20 text-yellow-400 text-[10px] font-mono px-3 py-1 rounded-full border border-yellow-500/30 whitespace-nowrap"
                    >
                      5.000 USDC Retidos
                    </motion.div>
                  )}
                </AnimatePresence>
             </motion.div>

             <p className="text-white/50 text-xs text-center mt-8 h-10">
               {status === 0 && "Contrato vazio."}
               {status === 1 && "Dinheiro seguro no Blockchain. O vendedor pode enviar a carga."}
               {status === 2 && "Carga em trânsito."}
               {status === 3 && "Pagamento liberado para a carteira do fornecedor!"}
             </p>
          </div>

          {/* Fornecedor */}
          <div className={`flex flex-col items-center p-6 rounded-2xl border transition-all w-full md:w-1/3 ${status === 1 ? 'bg-white/10 border-white/30' : 'bg-black/50 border-white/10'}`}>
            <div className="w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center mb-4">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:box-minimalistic-bold" width="32"></iconify-icon>
            </div>
            <h3 className="text-white font-medium mb-1">Fornecedor B2B</h3>
            <p className="text-xs text-white/40 text-center mb-6 h-8">
              {status === 0 ? 'Aguardando depósito...' : status === 1 ? 'Dinheiro garantido. Pronto para despachar.' : 'Aguardando liberação dos fundos...'}
            </p>
            
            <button 
              onClick={handleNext}
              disabled={status !== 1 && status !== 3}
              className={`w-full py-3 rounded-xl font-medium transition-all ${
                status === 1 
                  ? 'bg-orange-500 text-white hover:bg-orange-400' 
                  : status === 3 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {status === 1 ? 'Despachar Carga' : status === 3 ? '+ 5.000 USDC Recebidos' : 'Aguardando...'}
            </button>
          </div>

        </div>
        
        {status === 3 && (
          <div className="mt-8 text-center">
            <button onClick={() => setStatus(0)} className="text-white/50 hover:text-white text-sm underline">
              Reiniciar Simulação
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
