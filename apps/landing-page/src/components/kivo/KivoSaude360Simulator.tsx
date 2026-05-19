import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoSaude360Simulator() {
  const [step, setStep] = useState(0);

  const handlePurchase = () => {
    setStep(1); // Laboratório solicita
    setTimeout(() => setStep(2), 2000); // Kivo transfere os fundos
    setTimeout(() => setStep(3), 4000); // Dados liberados
    setTimeout(() => setStep(0), 8000); // Reset
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador Saúde 360</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Veja como a infraestrutura de carteira do Kivo Pay viabiliza a monetização de dados de saúde. Você aprova o acesso e os fundos caem instantaneamente na sua Wallet.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 items-center">
          
          {/* Laboratório de Pesquisa */}
          <div className={`p-6 rounded-2xl border transition-all ${step >= 1 ? 'bg-black/50 border-white/10' : 'bg-white/5 border-white/30'}`}>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:test-tube-bold" class="text-teal-400 text-xl"></iconify-icon> Lab de Pesquisa
            </h3>
            
            <div className="bg-black/50 border border-white/10 p-4 rounded-xl mb-6">
               <p className="text-xs text-white/50 mb-1">Dataset Necessário:</p>
               <p className="text-sm text-white font-mono mb-3">Histórico de Exames - Tipo Sanguíneo</p>
               <p className="text-xs text-white/50 mb-1">Oferta de Compra:</p>
               <p className="text-teal-400 font-mono font-bold">15 USDC</p>
            </div>

            <button 
              onClick={handlePurchase}
              disabled={step > 0}
              className="w-full py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 bg-teal-500 text-black hover:bg-teal-400"
            >
              {step === 0 ? 'Comprar Dados' : 'Aguardando Descriptografia...'}
            </button>
          </div>

          {/* O Motor Kivo / Smart Contract */}
          <div className="flex flex-col items-center justify-center h-48">
             <div className="text-[10px] font-mono text-teal-400 uppercase tracking-widest mb-4">
               Kivo Wallet Infra
             </div>
             
             <div className="relative flex items-center justify-center w-full">
                {/* Linha de conexão animada */}
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2 -z-10">
                  <AnimatePresence>
                    {step === 2 && (
                      <motion.div 
                        initial={{ width: 0, left: 0 }} 
                        animate={{ width: '100%', left: 0 }} 
                        exit={{ opacity: 0 }}
                        className="absolute top-0 h-full bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.8)]"
                      ></motion.div>
                    )}
                    {step === 3 && (
                      <motion.div 
                        initial={{ width: 0, right: 0 }} 
                        animate={{ width: '100%', right: 0 }} 
                        className="absolute top-0 h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                      ></motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={`w-16 h-16 rounded-full flex flex-col items-center justify-center z-10 transition-colors border-2 ${
                  step === 2 ? 'bg-teal-500/20 border-teal-500/50 text-teal-400' : 
                  step === 3 ? 'bg-white/20 border-white/50 text-white' : 
                  'bg-black border-white/20 text-white/20'
                }`}>
                  {/* @ts-ignore */}
                  <iconify-icon icon={step === 3 ? "solar:document-text-bold" : "solar:wallet-money-bold"} width="28"></iconify-icon>
                </div>
             </div>

             <div className="text-center mt-6 h-10">
               <AnimatePresence mode="wait">
                 {step === 1 && <motion.p key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-white/50 font-mono">Solicitando Consentimento...</motion.p>}
                 {step === 2 && <motion.p key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-teal-400 font-mono">Kivo liquida USDC na carteira do paciente...</motion.p>}
                 {step === 3 && <motion.p key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] text-white font-mono">Dados descriptografados e entregues ao Lab!</motion.p>}
               </AnimatePresence>
             </div>
          </div>

          {/* Paciente (App Saúde 360 / Kivo) */}
          <div className={`p-6 rounded-2xl border transition-all ${step === 2 ? 'bg-white/10 border-white/30' : 'bg-black/50 border-white/10'}`}>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:user-bold" class="text-white/60 text-xl"></iconify-icon> Seu App Kivo
            </h3>
            
            <div className="flex flex-col items-center justify-center py-6 relative">
              {/* Overlay de Scanner Biométrico / Consentimento */}
              <AnimatePresence>
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-[-1rem] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center z-20 rounded-xl border border-teal-500/20"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center text-teal-500 overflow-hidden rounded-md">
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:fingerprint-linear" width="56"></iconify-icon>
                      {/* Laser do Scanner */}
                      <motion.div 
                        animate={{ top: ['-10%', '110%', '-10%'] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[2px] bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,1)] z-30"
                      ></motion.div>
                    </div>
                    <span className="text-[10px] text-teal-400 uppercase tracking-widest mt-4 font-mono animate-pulse">Descriptografando...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <span className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Saldo em Conta</span>
              <span className="text-4xl font-bricolage text-white flex items-center gap-2">
                <AnimatePresence mode="wait">
                   <motion.span key={step < 2 ? "0" : "15"} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                     {step < 2 ? "0.00" : "15.00"}
                   </motion.span>
                </AnimatePresence>
                <span className="text-lg text-white/40">USDC</span>
              </span>
              
              {step >= 2 && (
                 <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono">
                   +15 USDC Recebido
                 </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
