import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoSocialPaySimulator() {
  const [handle, setHandle] = useState('obra-shopping-vitoria');
  const [amount, setAmount] = useState('5000');
  const [step, setStep] = useState(0);

  const handleSimulate = () => {
    if (!handle || !amount) return;
    setStep(2); // Processando na Stellar
    setTimeout(() => setStep(3), 2500); // Confirmado no Feed
    setTimeout(() => {
      setStep(0); // Reset
      setHandle('');
      setAmount('');
    }, 6000); 
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador SocialPay</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Veja como é fácil enviar valores para um @ e acompanhar em um feed financeiro auditável.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* O App SocialPay */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative flex flex-col h-[400px]">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:users-group-two-rounded-bold" class="text-emerald-400"></iconify-icon> Novo Pagamento
            </h3>

            <div className="flex-1 space-y-4">
              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/50 mb-1">Para quem?</p>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-emerald-500 font-bold">@</span>
                  <input 
                    type="text" 
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    placeholder="nome_do_usuario"
                    disabled={step > 0}
                    className="bg-transparent border-none outline-none text-white font-mono w-full placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/50 mb-1">Valor</p>
                <div className="flex items-center gap-2 text-white text-2xl font-light">
                  <span className="text-white/30 text-sm mt-1">USDC</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    disabled={step > 0}
                    className="bg-transparent border-none outline-none text-white w-full placeholder:text-white/30"
                  />
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                <p className="text-xs text-white/50 mb-1">Privacidade da Transação</p>
                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:shield-check-bold"></iconify-icon>
                  Organizacional (Auditável pela Empresa)
                </div>
              </div>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={step > 0 || !handle || !amount}
              className={`w-full py-4 rounded-xl font-medium transition-colors relative overflow-hidden flex justify-center items-center gap-2 mt-4 ${
                step > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 cursor-default' : 'bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50'
              }`}
            >
              {step === 0 && 'Iniciar Pagamento'}
              {step === 2 && 'Processando na Stellar...'}
              {step === 3 && (
                <>
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:check-circle-bold"></iconify-icon> Enviado com Sucesso
                </>
              )}
            </button>
          </div>

          {/* O Feed Social / Auditável */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative flex flex-col h-[400px]">
            <h3 className="text-xl font-medium text-white mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* @ts-ignore */}
                <iconify-icon icon="solar:list-bold" class="text-white/50"></iconify-icon> Feed de Projetos
              </div>
              <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/50 font-mono">Live</span>
            </h3>

            <div className="flex-1 overflow-hidden relative flex flex-col gap-4">
              
              <AnimatePresence>
                {step >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -20, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    className="bg-white/5 border border-emerald-500/30 p-4 rounded-xl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">A</div>
                        <div>
                          <p className="text-sm text-white font-medium">Você</p>
                          <p className="text-xs text-white/50">agora mesmo</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">+ {amount} USDC</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/70">
                      Enviado para <span className="text-emerald-400 font-mono">@{handle}</span>
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs text-white/30 font-mono bg-black/50 p-2 rounded">
                      {/* @ts-ignore */}
                      <iconify-icon icon="solar:link-bold"></iconify-icon> Hash: 0x8f2...9a1
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="bg-white/5 border border-white/5 p-4 rounded-xl opacity-70">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">O</div>
                    <div>
                      <p className="text-sm text-white font-medium">@obra-shopping-vitoria</p>
                      <p className="text-xs text-white/50">2 horas atrás</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">- 450 USDC</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Pagamento para <span className="text-blue-400 font-mono">@material-construcao</span>
                </p>
              </div>

              <div className="bg-white/5 border border-white/5 p-4 rounded-xl opacity-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold">E</div>
                    <div>
                      <p className="text-sm text-white font-medium">@equipe-marketing</p>
                      <p className="text-xs text-white/50">1 dia atrás</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-white">- 1,200 USDC</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  Pagamento para <span className="text-purple-400 font-mono">@agencia-design</span>
                </p>
              </div>

              {/* Fading bottom edge */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
