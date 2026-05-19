import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import Tilt from 'react-parallax-tilt';

// --- Sound Engine Synthesizer (Spatial & Haptic) ---
const triggerHaptic = (pattern: number | number[]) => {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch(e){}
}

const playPing = (x?: number) => {
  try {
    triggerHaptic([30, 50, 30]);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    
    if (x !== undefined) panner.pan.value = (x / window.innerWidth) * 2 - 1;
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    osc.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
};

const playClick = (x?: number) => {
  try {
    triggerHaptic(10);
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const panner = ctx.createStereoPanner();
    if (x !== undefined) panner.pan.value = (x / window.innerWidth) * 2 - 1;
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(panner);
    panner.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch(e){}
};

const playUnlock = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e){}
};

// --- Visual Interativo: Kivo Invoicing ---
function InvoiceVisual() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s) => {
        const next = (s + 1) % 4;
        if (next === 3) playPing();
        if (next === 1) playClick();
        return next;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden h-64 flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
      
      <div className="flex gap-4 items-center justify-between z-10 relative">
        {/* Painel do Vendedor */}
        <div className="w-1/3 space-y-3">
          <div className="h-4 w-16 bg-white/10 rounded"></div>
          <div className={`h-12 border rounded-xl flex items-center justify-center transition-all ${step === 0 ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
            <span className="text-xs font-mono">Gerar Fatura</span>
          </div>
        </div>

        {/* Link / Envio */}
        <div className="grow flex justify-center">
          <motion.div 
            animate={{ x: step === 1 ? [0, 20, 0] : 0, opacity: step >= 1 ? 1 : 0.3 }}
            className="text-blue-500"
          >
            {/* @ts-ignore */}
            <iconify-icon icon="solar:arrow-right-linear" width="24"></iconify-icon>
          </motion.div>
        </div>

        {/* Cliente / Pagamento */}
        <div className="w-1/3 space-y-3">
           <div className={`p-3 border rounded-xl transition-all ${step === 2 ? 'bg-emerald-500/20 border-emerald-500/50' : 'bg-white/5 border-white/10'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-white/50">Total</span>
                <span className="text-xs font-mono text-emerald-400">USDC 500</span>
              </div>
              <div className={`h-6 rounded flex items-center justify-center text-[10px] font-bold ${step === 3 ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/30'}`}>
                {step === 3 ? 'PAGO ✓' : 'PAGAR'}
              </div>
           </div>
        </div>
      </div>
      
      <div className="mt-8 text-center z-10 relative">
        <p className="text-sm text-white/60 font-mono h-6">
          {step === 0 && "1. Criando Invoice..."}
          {step === 1 && "2. Enviando Link..."}
          {step === 2 && "3. Cliente visualiza..."}
          {step === 3 && "4. Liquidação instantânea!"}
        </p>
      </div>
    </div>
  );
}

// --- Visual Interativo: Kivo Payouts ---
function PayoutsVisual() {
  const [processing, setProcessing] = useState(false);
  
  const handleProcess = () => {
    setProcessing(true);
    let clicks = 0;
    const interval = setInterval(() => {
      if (clicks < 4) playClick();
      clicks++;
    }, 300);
    
    setTimeout(() => {
      clearInterval(interval);
      playPing();
      setProcessing(false);
    }, 3000);
  }

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center">
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full"></div>
      
      {!processing ? (
        <div className="text-center z-10">
          {/* @ts-ignore */}
          <iconify-icon icon="solar:document-add-linear" width="48" class="text-white/20 mb-4"></iconify-icon>
          <p className="text-sm text-white/50 mb-4">Upload planilha_pagamentos.csv (200 linhas)</p>
          <button onClick={handleProcess} className="px-6 py-2 bg-purple-500 text-white rounded-full text-sm font-medium hover:bg-purple-400">
            Executar Lote
          </button>
        </div>
      ) : (
        <div className="w-full max-w-sm z-10 space-y-2">
          {[1,2,3,4].map((i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="flex justify-between items-center bg-white/5 border border-white/10 p-2 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <span className="text-[10px] text-purple-400">ID</span>
                </div>
                <div className="h-2 w-16 bg-white/20 rounded"></div>
              </div>
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: (i * 0.2) + 0.3 }}
                className="text-emerald-400 text-xs font-mono"
              >
                + USDC 50 ✓
              </motion.div>
            </motion.div>
          ))}
          <p className="text-center text-xs text-purple-400 mt-4 animate-pulse">Enviando Transações Stellar...</p>
        </div>
      )}
    </div>
  );
}

// --- Visual Interativo: Kivo Escrow ---
function EscrowVisual() {
  const [status, setStatus] = useState(0); // 0: dep, 1: lock, 2: deliver, 3: unlock

  useEffect(() => {
    const timer = setInterval(() => {
      setStatus((s) => {
        const next = (s + 1) % 4;
        if (next === 1) playClick(); // Lock sound
        if (next === 3) playUnlock(); // Unlock / Receive sound
        return next;
      });
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl relative overflow-hidden h-64 flex flex-col justify-center items-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-emerald-500/10 blur-[50px] rounded-full"></div>
      
      <div className="flex items-center gap-4 z-10 w-full max-w-sm">
        {/* Buyer */}
        <div className={`p-3 rounded-xl border ${status === 0 ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'} text-center w-24`}>
          {/* @ts-ignore */}
          <iconify-icon icon="solar:user-bold" width="24" class="text-white/40 mb-1"></iconify-icon>
          <p className="text-[10px] text-white/50">Comprador</p>
        </div>

        {/* Smart Contract */}
        <div className="grow flex flex-col items-center">
          <motion.div 
            animate={{ 
              scale: status === 1 ? 1.2 : 1,
              borderColor: status === 3 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(255,255,255,0.2)'
            }}
            className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center bg-black relative"
          >
            {/* @ts-ignore */}
            <iconify-icon 
              icon={status === 1 || status === 2 ? "solar:lock-bold" : "solar:check-circle-bold"} 
              width="24" 
              class={status === 3 ? "text-emerald-400" : "text-white/60"}
            ></iconify-icon>
            
            {status >= 1 && status <= 2 && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="absolute -top-6 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"
              >
                1000 USDC
              </motion.span>
            )}
          </motion.div>
        </div>

        {/* Seller */}
        <div className={`p-3 rounded-xl border ${status === 2 ? 'bg-white/10 border-white/30' : 'bg-white/5 border-white/10'} text-center w-24`}>
          {/* @ts-ignore */}
          <iconify-icon icon="solar:shop-bold" width="24" class="text-white/40 mb-1"></iconify-icon>
          <p className="text-[10px] text-white/50">Vendedor</p>
        </div>
      </div>

      <p className="text-sm text-white/50 mt-8 font-mono h-4">
        {status === 0 && "> Aguardando depósito..."}
        {status === 1 && "> Fundos travados no Smart Contract."}
        {status === 2 && "> Vendedor enviando mercadoria..."}
        {status === 3 && "> Comprador confirmou. Pagamento liberado!"}
      </p>
    </div>
  );
}

// --- Mouse Spotlight Card Wrapper ---
function SpotlightCard({ mod, activeTab, onClick, children }: any) {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  // Calcula sombra dinâmica baseada na posição do mouse
  const shadowX = (position.x - 150) / 10;
  const shadowY = (position.y - 150) / 10;
  const dynamicShadow = opacity > 0 ? `${-shadowX}px ${-shadowY}px 30px rgba(16, 185, 129, 0.1)` : 'none';

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      onClick={onClick}
      style={{ boxShadow: dynamicShadow }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`h-full p-6 rounded-3xl border ${mod.border} ${activeTab === 'native' ? mod.bg : 'bg-neutral-900/50'} backdrop-blur-sm relative overflow-hidden group cursor-pointer transition-all duration-300`}
    >
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-3xl z-0"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`
        }}
      />
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

// --- Main Ecosystem Component ---
export default function KivoEcosystem() {
  const [activeTab, setActiveTab] = useState<'native' | 'powered'>('native');
  const [selectedModule, setSelectedModule] = useState<any | null>(null);

  const nativeModules = [
    {
      id: 'invoicing',
      icon: 'solar:bill-list-linear',
      name: 'Kivo Invoicing',
      desc: 'Criação e gestão de faturas B2B diretamente no seu Dashboard.',
      longDesc: 'Gere faturas internacionais em segundos. O cliente recebe um link mágico, escolhe se quer pagar em cartão local ou cripto (USDC), e o Kivo liquida instantaneamente na sua carteira. Tudo conciliado automaticamente.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      visual: <InvoiceVisual />
    },
    {
      id: 'payouts',
      icon: 'solar:buildings-linear',
      name: 'Kivo Payouts',
      desc: 'Pague 200 bolsistas ou fornecedores com um clique via planilhas.',
      longDesc: 'Diga adeus as remessas Swift caras. Faça o upload de uma planilha CSV com e-mails ou carteiras, deposite o valor total em USDC e nosso motor dispara centenas de pagamentos simultâneos em menos de 5 segundos.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      visual: <PayoutsVisual />
    },
    {
      id: 'escrow',
      icon: 'solar:shield-keyhole-linear',
      name: 'Kivo Safe Checkout',
      desc: 'Retenção de fundos segura (Escrow) até a confirmação de entrega B2B.',
      longDesc: 'Para vendas de alto risco (B2B), o dinheiro do comprador fica retido num Smart Contract Soroban imutável. O fornecedor tem a certeza de que o dinheiro existe, e o comprador sabe que só libera quando receber a mercadoria.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      visual: <EscrowVisual />
    }
  ];

  const poweredModules = [
    {
      id: 'familybridge',
      icon: 'solar:home-smile-linear',
      name: 'FamilyBridge',
      desc: 'Remessas internacionais B2C liquidadas no Brasil via Kivo Payouts.',
      longDesc: 'FamilyBridge usa o Kivo Payouts nos bastidores para conectar USDC em contas estrangeiras diretamente ao Pix de familiares no Brasil, sem passar por bancos correspondentes.',
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      id: 'vakinha',
      icon: 'solar:heart-pulse-linear',
      name: 'Vakinha Global',
      desc: 'Crowdfunding processado via Kivo Gateway para aceitação em 180+ países.',
      longDesc: 'Usando o Checkout Transparente do Kivo, ONGs podem receber doações de qualquer lugar do planeta, com os fundos travados on-chain até a meta ser batida.',
      color: 'text-pink-400',
      bg: 'bg-pink-500/10',
      border: 'border-pink-500/20'
    },
    {
      id: 'quilovolt',
      icon: 'solar:bolt-circle-linear',
      name: 'QuiloVolt EV',
      desc: 'Postos de recarga IoT rodando hardware Kivo Terminal modificado.',
      longDesc: 'Ao acoplar o SDK do Kivo Terminal num totem elétrico, o Quilovolt usa a API de "Hold" do Kivo para ir cobrando do cliente por minuto, sem fricção.',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20'
    },
    {
      id: 'contractease',
      icon: 'solar:document-text-linear',
      name: 'ContractEase',
      desc: 'Certificados on-chain que usam a API de pagamento Kivo para gatilhos.',
      longDesc: 'Contratos inteligentes que, ao serem assinados digitalmente por ambas as partes, acionam a API de Invoicing do Kivo para disparar a cobrança automaticamente.',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      id: 'saude360',
      icon: 'solar:health-linear',
      name: 'Saúde 360',
      desc: 'Monetização de dados de saúde pagos nativamente via carteira Kivo.',
      longDesc: 'Pacientes criam carteiras usando a infraestrutura Wallet do Kivo. Quando empresas médicas compram seus dados anonimizados, o pagamento pinga direto no Kivo App.',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10',
      border: 'border-teal-500/20'
    },
    {
      id: 'onyx',
      icon: 'lucide:shield-check',
      name: 'ONYX Risk',
      desc: 'O Kivo Pay consome o ONYX para barrar fraudes e lavar dinheiro em tempo real.',
      longDesc: 'Toda transação no Kivo Gateway passa pelos nós do Onyx. Se o score de risco for alto, o Kivo rejeita a transação antes mesmo de ir para o Ledger Stellar.',
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      border: 'border-red-500/20'
    }
  ];

  const currentList = activeTab === 'native' ? nativeModules : poweredModules;

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up relative z-20" id="kivo-ecosystem">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">O Ecossistema Kivo OS</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Muito mais que um checkout. O Kivo é um Sistema Operacional Financeiro completo, absorvendo soluções vitais e empoderando produtos independentes.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="bg-black/50 p-1.5 rounded-full border border-white/10 flex gap-2">
          <button
            onClick={() => setActiveTab('native')}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              activeTab === 'native' 
                ? 'bg-emerald-500 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Módulos Nativos Kivo
          </button>
          <button
            onClick={() => setActiveTab('powered')}
            className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all ${
              activeTab === 'powered' 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            Soluções Powered by Kivo
          </button>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`grid grid-cols-1 ${activeTab === 'native' ? 'md:grid-cols-3' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}
          >
            {currentList.map((mod, idx) => (
              <motion.div 
                key={mod.id}
                layoutId={`card-${mod.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="h-full"
                drag={activeTab === 'powered' ? false : true}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.1}
                whileDrag={{ scale: 1.05, zIndex: 100 }}
              >
                <Tilt 
                  tiltMaxAngleX={5} 
                  tiltMaxAngleY={5} 
                  glareEnable={true} 
                  glareMaxOpacity={0.15} 
                  glareColor="#ffffff" 
                  glarePosition="all"
                  trackOnWindow={true} // Gyroscope Device Orientation Support (Item 15)
                  className="h-full rounded-3xl"
                >
                  <SpotlightCard mod={mod} activeTab={activeTab} onClick={(e: any) => {
                    playClick(e.clientX); // Spatial Audio Trigger
                    setSelectedModule(mod);
                  }}>
                    {activeTab === 'native' && (
                      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full blur-[40px] opacity-50 bg-current ${mod.color} group-hover:scale-150 transition-transform duration-700`}></div>
                    )}
                    <motion.div 
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${activeTab === 'native' ? 'bg-black/40' : mod.bg} border ${mod.border} ${mod.color} mb-6`}
                      whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {/* @ts-ignore */}
                      <iconify-icon icon={mod.icon} width="24"></iconify-icon>
                    </motion.div>
                    <h3 className="text-xl font-medium text-white mb-3 group-hover:text-emerald-400 transition-colors">{mod.name}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{mod.desc}</p>
                    
                    <div className="mt-6 flex items-center justify-between text-xs font-mono">
                      <div className={`uppercase tracking-widest ${activeTab === 'native' ? 'text-emerald-400' : 'text-white/40'} flex items-center`}>
                        {activeTab === 'native' ? (
                          <><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse"></span> Nativo</>
                        ) : (
                          <><iconify-icon icon="solar:link-circle-bold" width="16" class="mr-2"></iconify-icon> API</>
                        )}
                      </div>
                      <span className="text-white/30 group-hover:text-white transition-colors">Ver Detalhes &rarr;</span>
                    </div>
                  </SpotlightCard>
                </Tilt>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* POPUP / MODAL INTERATIVO */}
      <AnimatePresence>
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedModule(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            ></motion.div>
            
            <motion.div 
              layoutId={`card-${selectedModule.id}`}
              initial={{ opacity: 0, borderRadius: 24 }}
              animate={{ opacity: 1, borderRadius: 24 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-neutral-950 border border-white/10 p-8 max-w-3xl w-full relative z-10 shadow-2xl overflow-hidden"
            >
              <div className={`absolute -top-32 -right-32 w-64 h-64 blur-[100px] rounded-full opacity-30 ${selectedModule.bg.replace('/10', '')}`}></div>
              
              <button 
                onClick={() => setSelectedModule(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
              >
                {/* @ts-ignore */}
                <iconify-icon icon="solar:close-circle-linear" width="24"></iconify-icon>
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-black/40 border ${selectedModule.border} ${selectedModule.color}`}>
                  {/* @ts-ignore */}
                  <iconify-icon icon={selectedModule.icon} width="32"></iconify-icon>
                </div>
                <div>
                  <div className={`text-xs font-mono uppercase tracking-widest ${selectedModule.color} mb-1 flex items-center gap-2`}>
                    {activeTab === 'native' ? 'Módulo Nativo Kivo' : 'Powered by Kivo'}
                  </div>
                  <h3 className="text-3xl font-bricolage text-white">{selectedModule.name}</h3>
                </div>
              </div>

              <p className="text-white/70 text-lg leading-relaxed mb-8">
                {selectedModule.longDesc}
              </p>

              {/* Área Interativa da Simulação */}
              <div className="mb-6">
                <h4 className="text-sm font-mono text-white/40 uppercase tracking-widest mb-4">Simulação em Tempo Real</h4>
                {selectedModule.visual ? (
                  selectedModule.visual
                ) : (
                  <div className="bg-neutral-900 border border-white/10 p-6 rounded-2xl h-64 flex flex-col justify-center items-center text-center">
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:programming-linear" width="48" class="text-white/20 mb-4 animate-pulse"></iconify-icon>
                    <p className="text-white/50 text-sm max-w-sm">
                      A integração entre o {selectedModule.name} e a API do Kivo opera no background. Dados fluem de forma transparente sem que o usuário final perceba que está usando o Kivo.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                 <a href={activeTab === 'native' ? `/${selectedModule.id}` : `/${selectedModule.id}`} className={`px-6 py-3 rounded-full font-medium text-sm transition-all text-black ${selectedModule.bg.replace('bg-', 'bg-').replace('/10', '')} hover:brightness-110`}>
                   Explorar Página do Módulo
                 </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
