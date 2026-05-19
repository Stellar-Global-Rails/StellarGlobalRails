import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

const NAMES = ['Uber Eats BV', 'Freelancer Alex', 'Google Ads', 'Amazon AWS', 'Meta Platforms', 'Digital Ocean', 'Supabase Inc', 'Vercel Inc', 'Stripe Payments', 'Twilio BV'];
const generateItems = () => Array.from({ length: 50 }).map((_, i) => {
  const pseudoRandom = ((i * 137 + 42) % 100) / 100;
  return {
    id: i + 1,
    name: NAMES[i % NAMES.length] + (i > 9 ? ` #${i}` : ''),
    amount: (pseudoRandom * 5000 + 100).toFixed(2),
  };
});

export default function KivoPayoutsSimulator() {
  const [step, setStep] = useState(0);
  const [items] = useState(generateItems());
  const [paidCount, setPaidCount] = useState(0);

  const total = items.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toLocaleString('en-US', { minimumFractionDigits: 2 });

  const handleProcess = () => {
    setStep(1); // Uploaded/Processing
    setPaidCount(0);
    
    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      if (count >= items.length) {
        clearInterval(interval);
        setPaidCount(items.length);
        setStep(2); // Done
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#a855f7', '#d946ef', '#ffffff']
        });
        
        setTimeout(() => {
           setStep(0);
           setPaidCount(0);
        }, 5000);
      } else {
        setPaidCount(count);
      }
    }, 100);
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador Kivo Payouts</h2>
        <p className="text-white/50 text-lg">Envie dezenas de pagamentos simultâneos sem pagar taxas Swift usando o motor de Payouts do Kivo.</p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* Painel de Controle */}
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bricolage text-white mb-2">Disparo em Lote</h3>
            <p className="text-white/50 mb-8">Faça o upload da sua planilha CSV e dispare pagamentos on-chain.</p>

            <div className="bg-black/50 border border-white/10 p-6 rounded-2xl mb-6">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-white/60 text-sm">Arquivo:</span>
                 <span className="text-purple-400 font-mono text-sm bg-purple-500/10 px-2 py-1 rounded">pagamentos_março.csv</span>
               </div>
               <div className="flex justify-between items-center mb-6">
                 <span className="text-white/60 text-sm">Total a pagar:</span>
                 <span className="text-white font-mono text-xl">{total} USDC</span>
               </div>

               <button 
                 onClick={handleProcess}
                 disabled={step > 0}
                 className="w-full py-4 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-400 transition-colors disabled:opacity-50 relative overflow-hidden"
               >
                 {step === 0 && 'Confirmar e Disparar'}
                 {step === 1 && 'Processando envelopes na Stellar...'}
                 {step === 2 && 'Lote Liquidado com Sucesso ✓'}
                 
                 {step === 1 && (
                   <motion.div 
                     className="absolute top-0 left-0 h-1 bg-white/50"
                     style={{ width: `${(paidCount / items.length) * 100}%` }}
                   ></motion.div>
                 )}
               </button>
            </div>
          </div>

          {/* Lista de Destinatários / Status em tempo real */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 z-20 relative">
              <h4 className="text-white font-medium">Status da Planilha</h4>
              <span className="text-xs font-mono text-white/40">{paidCount} de {items.length} pagos</span>
            </div>

            <div className="relative h-64 overflow-hidden rounded-xl">
              <div className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-neutral-900 to-transparent z-10 pointer-events-none"></div>
              <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-neutral-900 to-transparent z-10 pointer-events-none"></div>
              
              <motion.div 
                className="space-y-3 pt-8 pb-8"
                animate={{ y: -(Math.min(paidCount, items.length - 4) * 60) }} // 60px height approx
                transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
              >
                {items.map((rec, idx) => {
                  const isPaid = idx < paidCount;
                  return (
                    <div key={rec.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5 h-[36px] box-content">
                      <div className="flex-1 truncate pr-4">
                        <p className="text-sm text-white/80 font-mono truncate">{rec.name}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className="text-[10px] text-white/40 font-mono w-16 text-right">{rec.amount}</span>
                        <span className={`text-[10px] px-2 py-1 rounded-full font-mono w-20 text-center transition-colors duration-300 ${
                          isPaid 
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/20' 
                            : 'bg-white/10 text-white/30 border border-white/10'
                        }`}>
                          {isPaid ? 'PAGO ✓' : 'PENDENTE'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            </div>

            {/* Animação de envio (raios) overlay leve */}
            <AnimatePresence>
              {step === 1 && (
                 <motion.div 
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="absolute inset-0 bg-purple-500/5 backdrop-blur-[1px] rounded-2xl flex items-center justify-center pointer-events-none z-20"
                 >
                 </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </section>
  );
}
