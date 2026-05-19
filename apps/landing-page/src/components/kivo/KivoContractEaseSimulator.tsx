import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoContractEaseSimulator() {
  const [step, setStep] = useState(0);
  const [showWallet, setShowWallet] = useState(false);

  const simulate = () => {
    setShowWallet(true);
  };

  const confirmWallet = () => {
    setShowWallet(false);
    setStep(1); // Assinando
    setTimeout(() => setStep(2), 2000); // Registrando on-chain
    setTimeout(() => setStep(3), 4000); // Hash Confirmado
    setTimeout(() => setStep(0), 8000); // Reset
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador ContractEase</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Contratos com assinaturas digitais imutáveis, protegidos por 2FA (TOTP) e ancorados de forma permanente e descentralizada na rede Stellar.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
          
          {/* O Contrato (ContractEase) */}
          <motion.div 
            animate={step === 1 ? { x: [-8, 8, -6, 6, -4, 4, 0], y: [-4, 4, -3, 3, -2, 2, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-black/50 border border-white/10 p-6 rounded-2xl relative"
          >
            {/* Stamp de Assinatura */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div 
                  initial={{ scale: 5, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: -15 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
                >
                  <div className="border-[6px] border-emerald-500 text-emerald-500 font-bricolage text-3xl md:text-4xl p-4 rounded-xl uppercase tracking-widest backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.4)] bg-black/40">
                    Signed & Encrypted
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <h3 className="text-xl font-medium text-white mb-4 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:document-text-bold" class="text-cyan-400"></iconify-icon> Contrato de Prestação de Serviço
            </h3>
            
            <div className="space-y-3 mb-6 opacity-60">
              <div className="h-2 w-full bg-white/10 rounded"></div>
              <div className="h-2 w-5/6 bg-white/10 rounded"></div>
              <div className="h-2 w-4/6 bg-white/10 rounded"></div>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-white/50">Cláusula 4.1 - Pagamento</p>
                <p className="text-sm text-white font-mono">1.200 USDC na Assinatura</p>
              </div>
              <div className="text-cyan-400">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:link-circle-bold" width="24"></iconify-icon>
              </div>
            </div>

            <button 
              onClick={simulate}
              disabled={step > 0}
              className={`w-full py-4 rounded-xl font-medium transition-colors relative overflow-hidden flex justify-center items-center gap-2 ${
                step >= 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default' : 'bg-cyan-500 text-black hover:bg-cyan-400'
              }`}
            >
              {step === 0 && 'Assinar Digitalmente'}
              {step >= 1 && (
                <>
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:pen-bold"></iconify-icon> Contrato Assinado
                </>
              )}
            </button>

            {/* Mock Freighter Wallet (Item 25) */}
            <AnimatePresence>
              {showWallet && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[320px] bg-[#1a1c23] border border-white/10 rounded-2xl shadow-2xl p-6 z-[100]"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                        <span className="text-black font-bold text-xs">F</span>
                      </div>
                      <span className="text-white font-medium">Freighter</span>
                    </div>
                    <span className="text-[10px] text-white/50 bg-white/5 px-2 py-1 rounded-full">Testnet</span>
                  </div>
                  
                  <div className="text-center mb-6">
                    <h4 className="text-white text-lg font-medium">Sign Transaction</h4>
                    <p className="text-white/50 text-xs mt-1">ContractEase Smart Contract</p>
                  </div>

                  <div className="bg-black/50 rounded-xl p-4 mb-6 border border-white/5">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-white/50">Network Fee</span>
                      <span className="text-white">0.00001 XLM</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-white/50">Memo</span>
                      <span className="text-white/50 font-mono">HASH_29B4...</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setShowWallet(false)} className="flex-1 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors text-sm font-medium">Reject</button>
                    <button onClick={confirmWallet} className="flex-1 py-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors text-sm font-medium">Approve</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bastidores: API do Supabase e Stellar */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="bg-black/80 backdrop-blur-md border border-cyan-500/30 p-6 rounded-2xl w-full max-w-sm relative z-10 shadow-[0_0_50px_rgba(6,182,212,0.05)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:shield-check-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-white font-medium">ContractEase Indexer</h4>
                  <p className="text-[10px] text-cyan-400 font-mono">Stellar Network Worker</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-white/50 h-40 flex flex-col justify-end overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
                 
                 <p>{`> Monitorando eventos de assinatura...`}</p>
                 <AnimatePresence>
                   {step >= 1 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                       <p className="text-cyan-400">{`> EVENTO: Assinatura 2FA Confirmada`}</p>
                       <p className="text-white">{`> Gerando Hash SHA-256 do documento...`}</p>
                     </motion.div>
                   )}
                   {step >= 2 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mt-2">
                       <p className="text-yellow-400 animate-pulse">{`> Submetendo transação com Memo Hash para Stellar Testnet...`}</p>
                     </motion.div>
                   )}
                   {step >= 3 && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 mt-2">
                       <p className="text-emerald-400 font-bold">{`> Hash Ancorado com Sucesso! (0x8f2...9a1)`}</p>
                       <p className="text-emerald-400 font-bold">{`> QR Code de auditoria ativado.`}</p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
