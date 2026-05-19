import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import OnyxVault3D from './OnyxVault3D';

export default function KivoOnyxSimulator() {
  const [step, setStep] = useState(0);
  const [isFraud, setIsFraud] = useState(false);

  const simulateSafe = () => {
    setIsFraud(false);
    setStep(1); // Scanning
    setTimeout(() => setStep(2), 2000); // Result
    setTimeout(() => setStep(0), 6000); // Reset
  };

  const simulateFraud = () => {
    setIsFraud(true);
    setStep(1); // Scanning
    setTimeout(() => setStep(2), 2000); // Result
    setTimeout(() => setStep(0), 6000); // Reset
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador ONYX Risk</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Toda transação que passa pelo Kivo Gateway é analisada em milissegundos pelo motor ONYX, criando grafos de relacionamento on-chain para bloquear fraudes antes que aconteçam.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Nova Transação no Kivo */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative w-full md:w-1/3">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:card-send-bold" class="text-white/60"></iconify-icon> Kivo Checkout
            </h3>
            
            <p className="text-xs text-white/50 mb-6">Selecione uma transação para o ONYX avaliar em tempo real:</p>

            <div className="space-y-4">
               <button 
                 onClick={simulateSafe}
                 disabled={step > 0}
                 className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-colors disabled:opacity-50"
               >
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-white text-sm">Cliente VIP</span>
                   <span className="text-emerald-400 font-mono text-sm">USDC 200</span>
                 </div>
                 <p className="text-[10px] text-white/40 font-mono">Endereço: GBOO...7XYZ</p>
               </button>

               <button 
                 onClick={simulateFraud}
                 disabled={step > 0}
                 className="w-full p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-left transition-colors disabled:opacity-50"
               >
                 <div className="flex justify-between items-center mb-1">
                   <span className="text-white text-sm">Carteira Desconhecida</span>
                   <span className="text-red-400 font-mono text-sm">USDC 50,000</span>
                 </div>
                 <p className="text-[10px] text-white/40 font-mono">Endereço: GABC...9FRA</p>
               </button>
            </div>
          </div>

          {/* O Motor ONYX (Grafo) */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 h-64">
             <div className="text-xs font-mono text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
               ONYX Risk Scanner
             </div>
             
             <div className="relative w-48 h-48 flex items-center justify-center rounded-full border border-red-500/10 shadow-[0_0_40px_rgba(239,68,68,0.05)] overflow-hidden">
                {/* Radar Grid/Background */}
                <div className="absolute inset-0 rounded-full border border-white/5"></div>
                <div className="absolute inset-8 rounded-full border border-white/5"></div>
                <div className="absolute inset-16 rounded-full border border-white/5"></div>
               
                {/* Radar Sweep */}
                <AnimatePresence>
                  {step === 1 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, rotate: 360 }}
                      exit={{ opacity: 0 }}
                      transition={{ rotate: { duration: 1.5, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
                      className="absolute inset-0 rounded-full z-10"
                      style={{
                        background: 'conic-gradient(from 0deg, transparent 0%, rgba(239, 68, 68, 0.05) 60%, rgba(239, 68, 68, 0.4) 100%)',
                        borderRadius: '50%'
                      }}
                    ></motion.div>
                  )}
                </AnimatePresence>

                {/* Nodes (Dots) */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const angle = (i * 360) / 12;
                  const isFraudNode = isFraud && (i === 2 || i === 5 || i === 9);
                  const radius = i % 2 === 0 ? 80 : 50;
                  return (
                    <div key={i} className="absolute inset-0 z-20 pointer-events-none" style={{ transform: `rotate(${angle}deg)` }}>
                      {/* The Dot */}
                      <motion.div 
                        className={`absolute left-1/2 -ml-1.5 w-3 h-3 rounded-full transition-all duration-500 ${
                          step === 2 && isFraudNode ? 'bg-red-500 shadow-[0_0_15px_red] scale-150' : step === 2 && !isFraud ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/10'
                        }`}
                        style={{ top: `calc(50% - ${radius}px)` }}
                      ></motion.div>
                      
                      {/* The Infection Line */}
                      <AnimatePresence>
                        {step === 2 && isFraudNode && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: radius - 16, opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute left-1/2 -ml-[1px] w-[2px] bg-gradient-to-b from-red-500 to-transparent"
                            style={{ top: `calc(50% - ${radius}px)` }}
                          ></motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Central Shield / 3D Vault */}
                <motion.div 
                  animate={{ scale: step === 1 ? [1, 1.1, 1] : 1 }}
                  transition={{ repeat: step === 1 ? Infinity : 0, duration: 0.5 }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center z-30 relative shadow-2xl overflow-hidden ${
                    step === 2 
                      ? isFraud ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.6)]' : 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.6)]' 
                      : 'bg-neutral-800 border border-white/20'
                  }`}
                >
                  {step === 0 ? (
                    <OnyxVault3D />
                  ) : (
                    <iconify-icon 
                      icon={step === 2 ? (isFraud ? "solar:shield-cross-bold" : "solar:shield-check-bold") : "solar:shield-bold"} 
                      class="text-white text-3xl"
                    ></iconify-icon>
                  )}
                </motion.div>
             </div>
          </div>

          {/* Resultado da Decisão do Kivo */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative w-full md:w-1/3">
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:gavel-bold" class="text-white/60"></iconify-icon> Decisão do Kivo
            </h3>
            
            <div className="h-32 flex flex-col justify-center items-center text-center">
              <AnimatePresence mode="wait">
                {step === 0 && <motion.div key="0" className="text-white/30 text-sm">Aguardando transação...</motion.div>}
                {step === 1 && <motion.div key="1" className="text-white/50 text-sm font-mono animate-pulse">Consultando Nós da Stellar e Histórico de AML...</motion.div>}
                {step === 2 && !isFraud && (
                  <motion.div key="safe" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-emerald-400">
                     {/* @ts-ignore */}
                     <iconify-icon icon="solar:check-circle-bold" width="48" class="mb-2"></iconify-icon>
                     <p className="font-medium">Transação Aprovada</p>
                     <p className="text-xs text-emerald-400/50 mt-1">Score: 98/100</p>
                  </motion.div>
                )}
                {step === 2 && isFraud && (
                  <motion.div key="fraud" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-red-400">
                     {/* @ts-ignore */}
                     <iconify-icon icon="solar:close-circle-bold" width="48" class="mb-2"></iconify-icon>
                     <p className="font-medium">Transação Bloqueada</p>
                     <p className="text-xs text-red-400/50 mt-1">Ligação com endereço sancionado (OFAC).</p>
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
