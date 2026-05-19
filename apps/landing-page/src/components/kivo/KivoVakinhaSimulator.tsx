import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

export default function KivoVakinhaSimulator() {
  const [goal] = useState(10000);
  const [current, setCurrent] = useState(7500);
  const [donating, setDonating] = useState(false);

  const handleDonate = () => {
    setDonating(true);
    setTimeout(() => {
      setCurrent((prev) => {
        const next = Math.min(prev + 500, goal);
        if (next >= goal && prev < goal) {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f472b6', '#fb7185', '#34d399', '#ffffff']
          });
        }
        return next;
      });
      setDonating(false);
    }, 2000);
  };

  const percentage = (current / goal) * 100;

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador Vakinha Global</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Veja como o Kivo Gateway opera nos bastidores de uma campanha internacional, convertendo doações em dólares e euros para USDC instantaneamente na carteira da ONG.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
          
          {/* Interface da Vakinha (Visão do Doador) */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative">
            <h3 className="text-xl font-medium text-white mb-2">Ajude a construir nossa escola</h3>
            <p className="text-white/50 text-sm mb-6">ONG Educação Global • São Paulo, BR</p>

            <div className="mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bricolage text-pink-400">USDC {current.toLocaleString()}</span>
                <span className="text-sm text-white/40">meta: {goal.toLocaleString()}</span>
              </div>
              <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                ></motion.div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
               <p className="text-sm text-white/60 mb-3">Fazer uma doação (USDC 500)</p>
               <button 
                 onClick={handleDonate}
                 disabled={donating || current >= goal}
                 className="w-full py-4 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-400 transition-colors disabled:opacity-50 relative overflow-hidden flex justify-center items-center gap-2"
               >
                 {donating ? (
                   <>
                     {/* @ts-ignore */}
                     <iconify-icon icon="solar:spinner-linear" class="animate-spin"></iconify-icon> Processando no Kivo...
                   </>
                 ) : current >= goal ? (
                   'Meta Atingida!'
                 ) : (
                   'Doar com Cartão Internacional'
                 )}
               </button>
            </div>
          </div>

          {/* Bastidores: API do Kivo Gateway */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent)] rounded-full"></div>
            
            <div className="bg-black/80 backdrop-blur-md border border-emerald-500/30 p-6 rounded-2xl w-full max-w-sm relative z-10 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:code-circle-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-white font-medium">Kivo Gateway API</h4>
                  <p className="text-[10px] text-emerald-400 font-mono">Running in Background</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-white/50 h-40 flex flex-col justify-end overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
                 
                 <p>{`> Listening for incoming payments...`}</p>
                 <AnimatePresence>
                   {donating && (
                     <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                       <p className="text-yellow-400">{`> [POST] /v1/checkout/charge`}</p>
                       <p>{`> Source: Credit Card (EUR)`}</p>
                       <p className="text-emerald-400 animate-pulse">{`> Converting to 500 USDC via Stellar DEX...`}</p>
                       <p>{`> Liquidation successful (2.1s)`}</p>
                       <p className="text-emerald-400 font-bold">{`> +500 USDC added to Campaign Wallet`}</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </div>

            <div className="mt-8 text-center text-white/40 text-sm max-w-xs leading-relaxed">
              Enquanto o doador tem uma interface simples de crowdfunding, o **Kivo Gateway** faz todo o trabalho pesado de conversão de câmbio e liquidação on-chain.
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
