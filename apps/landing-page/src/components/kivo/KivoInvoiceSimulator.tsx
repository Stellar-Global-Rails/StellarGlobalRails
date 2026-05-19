import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoInvoiceSimulator() {
  const [amount, setAmount] = useState<number>(1500);
  const [displayAmount, setDisplayAmount] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 2) {
      const inc = amount / 20; // 20 frames = ~1 second
      let current = 0;
      interval = setInterval(() => {
        current += inc;
        if (current >= amount) {
          current = amount;
          clearInterval(interval);
        }
        setDisplayAmount(current);
      }, 50);
    } else if (step === 3) {
      setDisplayAmount(amount);
    } else {
      setDisplayAmount(0);
    }
    return () => clearInterval(interval);
  }, [step, amount]);

  const simulate = () => {
    setStep(1);
    setTimeout(() => setStep(2), 2000);
    setTimeout(() => setStep(3), 4000);
    setTimeout(() => setStep(0), 7000);
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador Kivo Invoicing</h2>
        <p className="text-white/50 text-lg">Veja como o Kivo Pay transforma uma cobrança global num link mágico liquidado em segundos.</p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
          
          {/* Painel do Vendedor */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:laptop-linear" class="text-blue-400"></iconify-icon> Seu Painel Kivo
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] text-white/40 uppercase">Valor a cobrar (USDC)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={step > 0}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono mt-1"
                />
              </div>
              <button 
                onClick={simulate}
                disabled={step > 0}
                className="w-full py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors disabled:opacity-50"
              >
                {step === 0 ? 'Gerar Link de Pagamento' : 'Processando...'}
              </button>
            </div>
          </div>

          {/* O Link Mágico (Física de Mola/Vôo) */}
          <div className="absolute inset-0 pointer-events-none z-50">
            <AnimatePresence>
              {step === 1 && (
                <motion.div
                  initial={{ left: '16%', top: '50%', scale: 0, opacity: 0 }}
                  animate={{ left: '84%', top: '50%', scale: 1, opacity: 1 }}
                  exit={{ left: '84%', top: '50%', scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', bounce: 0.4, duration: 1.2 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-md border border-blue-500/50 p-4 rounded-full flex items-center gap-3 text-blue-400 shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:link-circle-bold" width="24" class="animate-pulse"></iconify-icon>
                  <span className="text-xs font-mono">pay.kivo.com/inv_789</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* API Playground (Item 26) */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl flex flex-col justify-between relative z-20">
            <div>
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:code-square-linear" class="text-white/50"></iconify-icon> API Playground
              </h3>
              <div className="bg-[#0d1117] border border-white/5 p-3 rounded-lg text-[10px] font-mono text-white/50 mb-4 whitespace-pre-wrap">
                <span className="text-emerald-400">curl</span> -X POST https://api.kivo.com/v1/invoices \<br/>
                &nbsp;&nbsp;-H <span className="text-yellow-300">"Authorization: Bearer sk_test_..."</span> \<br/>
                &nbsp;&nbsp;-d <span className="text-yellow-300">'{`{"amount": ${amount}, "currency": "USDC"}`}'</span>
              </div>
            </div>
            <button 
              onClick={simulate}
              disabled={step > 0}
              className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2 font-mono"
            >
              {/* @ts-ignore */}
              <iconify-icon icon="solar:play-circle-bold"></iconify-icon> Executar cURL
            </button>
          </div>

          {/* Visão do Cliente */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
             {step === 3 && <div className="absolute inset-0 bg-emerald-500/10 z-0"></div>}
              <div className="relative z-10">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:smartphone-linear" class="text-emerald-400"></iconify-icon> Tela do Cliente
                </h3>
                
                <AnimatePresence mode="wait">
                  {step < 2 ? (
                    <motion.div key="waiting" className="h-32 flex items-center justify-center text-white/20 text-sm">
                      Aguardando fatura...
                    </motion.div>
                  ) : step === 2 ? (
                    <motion.div key="paying" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                       <div className="text-center mb-4">
                         <span className="text-[10px] text-white/40 uppercase block">Total a Pagar</span>
                         <span className="text-3xl text-white font-bricolage tabular-nums">${displayAmount.toFixed(2)}</span>
                       </div>
                       <motion.div 
                         initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1 }}
                         className="h-10 bg-white text-black font-medium rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                       >
                         {/* @ts-ignore */}
                         <iconify-icon icon="solar:card-bold"></iconify-icon> Pagar com Apple Pay
                       </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div key="paid" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="h-32 flex flex-col items-center justify-center text-emerald-400 relative">
                       {/* Efeito sonoro visual (Ping) */}
                       <motion.div 
                         initial={{ scale: 0.5, opacity: 1 }} animate={{ scale: 2.5, opacity: 0 }} transition={{ duration: 1, ease: "easeOut" }}
                         className="absolute w-16 h-16 rounded-full border-2 border-emerald-500"
                       ></motion.div>
                       
                       {/* @ts-ignore */}
                       <iconify-icon icon="solar:check-circle-bold" width="56" class="mb-2 relative z-10 bg-black rounded-full"></iconify-icon>
                       <span className="font-medium">Pagamento Concluído</span>
                       <span className="text-xs text-emerald-400/50 mt-1 font-mono">Liquidado instantaneamente.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
}
