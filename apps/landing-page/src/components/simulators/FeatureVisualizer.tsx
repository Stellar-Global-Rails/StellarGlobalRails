import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { motion, AnimatePresence } from 'motion/react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': any;
    }
  }
}

export default function FeatureVisualizer({ id, type, icon, color }: { id: string, type: 'feature' | 'agent', icon: string, color: string }) {
  
  // 1. SocialPay Agents
  if (id === 'identity') return <IdentityVisualizer icon={icon} color={color} />;
  if (id === 'engagement') return <EngagementVisualizer color={color} />;
  if (id === 'health') return <HealthVisualizer color={color} />;

  // 2. SocialPay Features
  if (id === 'data-vault') return <DataVaultVisualizer color={color} />;
  if (id === 'community-marketplace') return <MarketplaceVisualizer color={color} />;
  if (id === 'p2p-split') return <SplitVisualizer color={color} />;
  if (id === 'reputation-score') return <ReputationVisualizer color={color} />;

  // 3. ContractEase Agents
  if (id === 'ia-juridica') return <JuridicaVisualizer icon={icon} color={color} />;
  if (id === 'ia-negociacao') return <NegotiationVisualizer color={color} />;
  if (id === 'ia-arbitragem') return <ArbitrationVisualizer color={color} />;

  // 4. ContractEase Features
  if (id === 'programmable-escrow') return <EscrowVisualizer color={color} />;
  if (id === 'onchain-invoicing') return <InvoicingVisualizer color={color} />;
  if (id === 'asset-tokenization') return <TokenizationVisualizer color={color} />;
  if (id === 'compliance-ledger') return <ComplianceVisualizer color={color} />;
  if (id === 'multi-sig-workflow') return <MultiSigVisualizer color={color} />;
  if (id === 'immutability-motor') return <ImmutabilityVisualizer color={color} />;

  // 5. Kivo Pay Agents
  if (id === 'settlement') return <H2MVisualizer color={color} />; // H2M
  if (id === 'autonomous') return <M2MVisualizer color={color} variant="agent" />; // M2M Agent
  if (id === 'compliance') return <ComplianceVisualizer color={color} />;
  if (id === 'fraud-predictor') return <RadarVisualizer color={color} title="Fraud Predictor" variant="neural" />;

  // 6. Kivo Pay Features
  if (id === 'cross-border') return <CrossBorderVisualizer color={color} />;
  if (id === 'mass-disbursements') return <MassDisbursementVisualizer color={color} />;
  if (id === 'social-fundraising') return <FundraisingVisualizer color={color} />;
  if (id === 'm2m-payments') return <M2MVisualizer color={color} variant="feature" />;
  if (id === 'kivo-terminal') return <TerminalVisualizer color={color} />;

  // 7. Platform & System
  if (id === 'platform-network') return <PlatformNetworkVisualizer color={color} />;

  // Fallback para IDs não mapeados
  return <GenericVisualizer icon={icon} color={color} />;
}

// --- CORE VISUALIZERS ---

function PlatformNetworkVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-transparent group pointer-events-none">
      
      {/* Dynamic Aurora Gradient Background */}
      <div className="absolute inset-0 rounded-[3rem] bg-gradient-to-tr from-emerald-500/0 via-emerald-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* 3D Floating Content */}
      <div style={{ transform: "translateZ(80px)" }} className="relative z-10 text-center flex flex-col items-center pointer-events-none">
        
        {/* Glowing Icon Container */}
        <div className="mb-10 w-28 h-28 rounded-[2rem] bg-white text-black flex items-center justify-center shadow-[0_20px_50px_rgba(255,255,255,0.2)] border-2 border-white/50 relative">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-white to-transparent opacity-50 mix-blend-overlay" />
          {/* @ts-ignore */}
          <iconify-icon icon="solar:globus-bold" width="56"></iconify-icon>
        </div>

        {/* Cinematic Text */}
        <h3 className="text-6xl lg:text-8xl font-bricolage font-medium text-white mb-6 drop-shadow-2xl tracking-tighter">
          {t('fv.core.title')}
        </h3>
        
        <p className="text-white/60 font-light text-xl lg:text-2xl drop-shadow-lg max-w-md leading-relaxed">
          {t('fv.core.desc')}
        </p>

        {/* Subtle Ping */}
        <div className="mt-12 flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 shadow-2xl">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold">{t('fv.core.status')}</span>
        </div>

      </div>
    </div>
  );
}

function RadarVisualizer({ color, title, variant = 'normal' }: { color: string, title: string, variant?: 'normal' | 'neural' }) {
  const { t } = useTranslation();
  if (variant === 'neural') {
    // ... (keep the neural variant as is since it was just upgraded)
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-[#050505] p-8 overflow-hidden">
        <div className="relative w-64 h-64">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
               {[...Array(5)].map((_, i) => (
                 <line key={i} x1={Math.random() * 100} y1={Math.random() * 100} x2={Math.random() * 100} y2={Math.random() * 100} stroke="white" strokeWidth="0.5" />
               ))}
            </svg>
          </div>
          {[...Array(8)].map((_, i) => (
            <motion.div key={i} animate={{ x: [Math.random() * 200 - 100, Math.random() * 200 - 100], y: [Math.random() * 200 - 100, Math.random() * 200 - 100], opacity: [0.1, 0.4, 0.1] }} transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, repeatType: "reverse" }} className="absolute w-1 h-1 bg-white rounded-full" />
          ))}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="w-32 h-32 rounded-full border border-white/5 flex items-center justify-center relative">
              <div className="w-20 h-20 bg-black rounded-full border-2 flex items-center justify-center z-10 shadow-2xl relative" style={{ borderColor: color }}>
                 <div className="flex flex-col items-center">
                   <iconify-icon icon="solar:shield-warning-bold" width="32" style={{ color }}></iconify-icon>
                   <span className="text-[6px] font-mono mt-1 text-white/40 uppercase">{t('fv.radar.risk_scan')}</span>
                 </div>
              </div>
            </motion.div>
          </div>
          <motion.div animate={{ scale: [0, 4], opacity: [0, 0.4, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 border-2 border-red-500 rounded-full" />
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-[8px] font-bold text-red-500">{t('fv.radar.fraud_denied')}</div>
          <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-[8px] font-bold text-emerald-500">{t('fv.radar.safe_batch')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] overflow-hidden p-8">
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

      <div className="relative w-80 h-80 rounded-full border border-white/10 flex items-center justify-center">
        {/* Distance Rings */}
        {[1, 0.8, 0.6, 0.4, 0.2].map((scale, i) => (
          <div key={i} className="absolute rounded-full border border-white/5" 
               style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[6px] text-white/10">{1000 - (i * 200)}km</span>
          </div>
        ))}

        {/* The Sweep Line */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 origin-center z-20"
          style={{ background: `conic-gradient(from 0deg, ${color}60 0deg, transparent 90deg)` }}
        />

        {/* Liquidity Blips (Points of Interest) */}
        {[
          { x: 40, y: -80, label: 'STELLAR_NODE', time: '2s' },
          { x: -100, y: 30, label: 'PIX_GATEWAY', time: '1s' },
          { x: 60, y: 90, label: 'SWIFT_INT', time: '4d' },
          { x: -50, y: -110, label: 'REMIT_HUB', time: '10s' }
        ].map((blip, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.2, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.8 }}
            className="absolute z-30 flex items-start gap-2"
            style={{ transform: `translate(${blip.x}px, ${blip.y}px)` }}
          >
             <div className="w-2 h-2 rounded-full shadow-[0_0_10px_white]" style={{ backgroundColor: color }} />
             <div className="flex flex-col">
                <span className="text-[6px] font-mono text-white/60 font-bold">{blip.label}</span>
                <span className="text-[5px] font-mono text-emerald-500">{blip.time}</span>
             </div>
          </motion.div>
        ))}

        {/* Central Core */}
        <div className="relative z-40 w-16 h-16 rounded-full bg-black border-2 flex items-center justify-center shadow-2xl" style={{ borderColor: color }}>
           <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-20" />
           <iconify-icon icon="solar:radar-2-bold" width="32" style={{ color }}></iconify-icon>
        </div>
      </div>

      {/* Technical Data Bar */}
      <div className="absolute bottom-6 left-8 right-8 flex justify-between items-end border-t border-white/5 pt-4">
         <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{t('fv.radar.status')}</span>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-mono text-emerald-500 font-bold">{t('fv.radar.paths')}</span>
            </div>
         </div>
         <div className="text-right">
            <span className="text-[14px] font-bricolage font-bold text-white tracking-tighter">{t('fv.radar.optimizing')}</span>
         </div>
      </div>
    </div>
  );
}

function H2MVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center bg-[#050505] p-4 overflow-hidden">
      {/* {t('fv.h2m.routing')} Header - Pushed to the very top */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-50 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono text-white/80 tracking-[0.2em] uppercase">{t('fv.h2m.routing')}</span>
        </div>
        <span className="text-[8px] font-mono text-white/30 tracking-widest">{t('fv.h2m.analyzing')}</span>
      </div>

      <div className="relative w-full max-w-3xl flex items-center justify-between gap-2 px-8 mt-24">
        
        {/* LEFT: SOURCE (Smartphone) */}
        <div className="flex flex-col items-center gap-4 z-20">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="w-16 h-32 bg-[#111] border-2 border-white/5 rounded-2xl p-1.5 relative shadow-2xl">
              <div className="w-full h-full bg-black rounded-xl p-2 flex flex-col items-center">
                <div className="w-4 h-4 rounded bg-white/5 mb-2" />
                <div className="w-full space-y-1">
                  <div className="w-full h-0.5 bg-white/10 rounded" />
                  <div className="w-3/4 h-0.5 bg-white/10 rounded" />
                </div>
                <div className="mt-auto text-[8px] font-bold" style={{ color }}>$500.00</div>
              </div>
            </div>
          </motion.div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{t('fv.h2m.input')}</span>
        </div>

        {/* MIDDLE: THE AGENT & PATHS */}
        <div className="flex-1 relative h-32 flex items-center justify-center">
          
          {/* Main Stellar Path */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-0.5 opacity-30" style={{ backgroundColor: color }} />
          </div>

          {/* Money Pulse */}
          <motion.div
            animate={{ 
              x: [-150, 150],
              opacity: [0, 1, 0]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute w-3 h-3 rounded-full shadow-[0_0_15px_white] z-30"
            style={{ backgroundColor: color }}
          />

          {/* The Status Badge - Perfectly Centered */}
          <div className="relative z-40">
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 backdrop-blur-sm shadow-xl">
               <motion.div 
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1.5, repeat: Infinity }} 
                className="w-2 h-2 rounded-full bg-emerald-400" 
               />
               <span className="tracking-widest uppercase">{t('fv.h2m.network')}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: DESTINATION (Wallet) */}
        <div className="flex flex-col items-center gap-4 z-20">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-16 h-16 rounded-2xl bg-black border-2 flex items-center justify-center relative shadow-2xl" style={{ borderColor: color }}>
               <iconify-icon icon="solar:wallet-money-bold" width="28" style={{ color }}></iconify-icon>
               <motion.div 
                animate={{ opacity: [0, 1, 0], y: [-20, -40] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-6 text-[10px] font-bold text-emerald-500 whitespace-nowrap"
               >
                 +BRL PIX
               </motion.div>
            </div>
          </motion.div>
          <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest">{t('fv.h2m.settled')}</span>
        </div>
      </div>

      {/* FOOTER: Cost Comparison */}
      <div className="mt-12 flex items-center gap-6 z-50">
         <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] text-white/20 uppercase">{t('fv.h2m.traditional')}</span>
            <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] text-white/40 font-mono">
               {t('fv.h2m.cost')}: $45.00
            </div>
         </div>
         
         <div className="w-8 h-px bg-white/10" />

         <div className="flex flex-col items-center gap-1">
            <span className="text-[8px] text-emerald-500/40 uppercase font-bold tracking-widest">{t('fv.h2m.kivo_routing')}</span>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-bold font-mono shadow-[0_0_20px_rgba(16,185,129,0.1)]">
               {t('fv.h2m.cost')}: $0.0001
            </div>
         </div>
      </div>
    </div>
  );
}

function M2MVisualizer({ color, variant = 'feature' }: { color: string, variant?: 'agent' | 'feature' }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] p-12 overflow-hidden">
      <div className="relative w-full max-w-lg flex items-center justify-between z-10">
        <div className="flex flex-col items-center gap-4">
           <motion.div animate={variant === 'agent' ? { scale: [1, 1.05, 1] } : {}} transition={{ duration: 2, repeat: Infinity }} className="w-24 h-24 rounded-2xl bg-black border border-white/10 p-4 relative flex items-center justify-center">
              <iconify-icon icon={variant === 'agent' ? "solar:cpu-bold" : "solar:plug-circle-bold"} width="40" className="text-white/40"></iconify-icon>
           </motion.div>
           <span className="text-[10px] font-mono text-white/20">AGENT_01 (M)</span>
        </div>

        <div className="flex-1 px-12 relative h-16 flex items-center">
           <div className="w-full h-px bg-white/10 relative">
              {[0, 1, 2].map((i) => (
                <motion.div key={i} animate={{ left: ['0%', '100%'] }} transition={{ duration: 2, delay: i * 0.6, repeat: Infinity, ease: "linear" }} className="absolute -top-1 w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
              ))}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-center">
                 <div className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-[8px] font-mono text-emerald-400">PROTOCOL: X402</div>
              </div>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4">
           <div className="w-24 h-24 rounded-2xl bg-black border-2 p-4 relative flex items-center justify-center" style={{ borderColor: color }}>
              <iconify-icon icon={variant === 'agent' ? "solar:server-bold" : "solar:bolt-circle-bold"} width="40" style={{ color }}></iconify-icon>
           </div>
           <span className="text-[10px] font-mono text-white/20">SERVICE_M_42 (M)</span>
        </div>
      </div>
    </div>
  );
}

function DataVaultVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-40 h-40 bg-black/60 backdrop-blur-2xl border-2 rounded-[2rem] flex items-center justify-center relative z-10" style={{ borderColor: color, boxShadow: `0 0 50px ${color}30` }}>
          {/* @ts-ignore */}
          <iconify-icon icon="solar:shield-keyhole-bold-duotone" width="64" style={{ color }}></iconify-icon>
      </motion.div>
    </div>
  );
}

function ReputationVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90">
          <circle cx="50%" cy="50%" r="90" className="fill-none stroke-white/5" strokeWidth="12" />
          <motion.circle cx="50%" cy="50%" r="90" className="fill-none" strokeWidth="12" strokeLinecap="round" style={{ stroke: color, strokeDasharray: '565', strokeDashoffset: '113' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bricolage font-bold text-white">98.4</span>
          <span className="text-[10px] font-mono tracking-widest text-white/40 uppercase">{t('fv.reputation.score')}</span>
        </div>
      </div>
    </div>
  );
}

function IdentityVisualizer({ icon, color }: { icon: string, color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="w-56 h-80 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="w-20 h-20 rounded-xl bg-black border border-white/5 flex items-center justify-center mb-6">
          <iconify-icon icon="solar:user-bold" width="40" className="text-white/20"></iconify-icon>
        </div>
        <div className="space-y-4">
          <div className="w-32 h-3 bg-white/20 rounded" />
          <div className="w-full h-3 bg-white/10 rounded" />
          <div className="pt-4 mt-4 border-t border-white/5 font-mono text-[8px] text-white/20 break-all">did:stellar:GA...J4K2L9M1N0P</div>
        </div>
      </div>
    </div>
  );
}

function TerminalVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((s: number) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-[#050505] p-4 overflow-hidden">
      <div className="relative w-72 h-[600px] bg-[#1a1a1a] rounded-[3rem] border-[6px] border-[#333] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] p-4 flex flex-col items-center">
        {/* Paper Slot */}
        <div className="w-24 h-1 bg-black rounded-full mb-6 border-b border-white/5" />

        {/* Screen Area - 9:16 Aspect Ratio */}
        <div className="w-full aspect-[9/16] bg-black rounded-3xl border border-white/5 overflow-hidden flex flex-col relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="mb-auto pt-8">
                   <iconify-icon icon="solar:card-2-bold" width="32" className="text-white/10"></iconify-icon>
                </div>
                <span className="text-[10px] font-mono text-white/40 mb-2 uppercase tracking-widest">{t('fv.terminal.amount')}</span>
                <div className="text-4xl font-bricolage font-bold text-white">R$ 150,00</div>
                <div className="mt-4 flex gap-1">
                   {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 animate-pulse" />)}
                </div>
                <div className="mt-auto pb-8">
                   <div className="px-4 py-2 rounded-full border border-white/10 text-[8px] font-mono text-white/40">KIVO_TERMINAL_v2.0</div>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="absolute top-12">
                   <iconify-icon icon="solar:nfc-bold-duotone" width="64" className="text-emerald-500/20 animate-pulse"></iconify-icon>
                </div>
                
                <span className="text-xs font-mono text-white/60 mt-20">{t('fv.terminal.tap')}</span>
                
                {/* Floating Card Animation */}
                <motion.div 
                  animate={{ y: [60, -20], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute bottom-20 w-32 h-20 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-center backdrop-blur-md"
                >
                   <div className="w-10 h-6 bg-white/10 rounded-md" />
                   <div className="absolute bottom-2 right-2 text-[6px] text-white/20 font-mono">CHIP_NFC</div>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 relative mb-8">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-0 border-2 border-emerald-500 border-t-transparent rounded-full"
                   />
                   <div className="absolute inset-4 border border-white/5 rounded-full animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-emerald-500 animate-pulse uppercase tracking-[0.3em]">{t('fv.terminal.processing')}</span>
                <span className="text-[8px] font-mono text-white/20 mt-2">{t('fv.terminal.via')}</span>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center"
              >
                <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mb-6 shadow-[0_0_50px_#10b98140]">
                   <iconify-icon icon="solar:check-read-bold" width="40" className="text-black"></iconify-icon>
                </div>
                <span className="text-xl font-bold text-white uppercase tracking-tighter">{t('fv.terminal.approved')}</span>
                <div className="mt-8 space-y-1">
                   <div className="text-[8px] font-mono text-white/40 uppercase">{t('fv.terminal.auth')}: 992-B8</div>
                   <div className="text-[8px] font-mono text-white/40 uppercase">{t('fv.terminal.total')}: R$ 150,00</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Physical Buttons Grid - Positioned at bottom */}
        <div className="grid grid-cols-3 gap-2 mt-auto mb-4 w-full px-2">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="h-10 bg-[#222] border border-white/5 rounded-xl shadow-inner flex items-center justify-center">
               <span className="text-[10px] text-white/20 font-bold">{i + 1}</span>
            </div>
          ))}
          <div className="h-10 bg-red-500/10 border border-red-500/20 rounded-xl" />
          <div className="h-10 bg-[#222] border border-white/5 rounded-xl" />
          <div className="h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ImmutabilityVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <motion.div key={i} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="w-40 h-16 bg-white/5 border border-white/10 rounded-xl flex items-center px-4 gap-4">
              <iconify-icon icon="solar:lock-bold" width="16" className="text-white/40"></iconify-icon>
              <div className="w-full h-1.5 bg-white/10 rounded" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MarketplaceVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="grid grid-cols-3 gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="w-16 h-16 rounded-2xl bg-white/[0.03] border-2 flex items-center justify-center" style={{ borderColor: i === 4 ? color : 'rgba(255,255,255,0.1)' }}>
            <div className="w-8 h-8 rounded-lg bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SplitVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        {[0, 1, 2, 3].map((i) => (
          <motion.div key={i} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 flex items-start justify-center" style={{ transform: `rotate(${i * 90}deg)` }}>
            <div className="w-16 h-16 rounded-2xl bg-black border-2 flex items-center justify-center" style={{ borderColor: i === 0 ? color : 'rgba(255,255,255,0.1)' }} />
          </motion.div>
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full" style={{ backgroundColor: color }} />
        </div>
      </div>
    </div>
  );
}

function InvoicingVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center p-12">
      <div className="w-full max-w-sm bg-white/[0.03] border border-white/10 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="text-lg font-bold text-white">#ST-2024-08</div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><div className="w-5 h-5 rounded-full" style={{ backgroundColor: color }} /></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="px-4 py-2 rounded-lg text-xs font-bold text-black" style={{ backgroundColor: color }}>PAID ON-CHAIN</div>
        </div>
      </div>
    </div>
  );
}

function EscrowVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
       <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="w-24 h-24 rounded-[2rem] bg-black border-2 flex items-center justify-center relative" style={{ borderColor: color }}>
             <iconify-icon icon="solar:shield-keyhole-bold" width="40" style={{ color }}></iconify-icon>
          </motion.div>
       </div>
    </div>
  );
}

function ArbitrationVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12">
      <div className="w-20 h-20 rounded-full bg-black border-2 flex items-center justify-center" style={{ borderColor: color }}>
         <iconify-icon icon="solar:scale-bold" width="40" style={{ color }}></iconify-icon>
      </div>
      <div className="mt-8 text-[10px] font-mono text-emerald-500 animate-pulse">{t('fv.arbitration.analyzing')}</div>
    </div>
  );
}

function CrossBorderVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#050505] p-8 overflow-hidden">
      {/* Mini Map Decoration */}
      <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
         <iconify-icon icon="solar:map-bold" width="400" className="text-white/20"></iconify-icon>
      </div>

      <div className="relative w-full max-w-md flex items-center justify-between z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shadow-2xl">
             <span className="text-xs font-bold text-white">USD</span>
          </div>
          <span className="text-[8px] font-mono text-white/40 uppercase">New York</span>
        </div>

        {/* Global Transfer Arc */}
        <div className="flex-1 px-4 relative h-32 flex items-center justify-center">
           <svg className="w-full h-full overflow-visible">
              <motion.path 
                d="M 0 60 Q 150 -40 300 60"
                stroke={color}
                strokeWidth="2"
                fill="none"
                strokeDasharray="5 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, repeat: Infinity }}
              />
           </svg>
           
           <motion.div
             animate={{ 
               offsetDistance: ["0%", "100%"],
               opacity: [0, 1, 0]
             }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="absolute w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_20px_white]"
             style={{ 
               backgroundColor: color,
               offsetPath: "path('M 0 60 Q 150 -40 300 60')"
             }}
           >
              <iconify-icon icon="solar:transfer-horizontal-bold" width="8" className="text-black"></iconify-icon>
           </motion.div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-black border-2 flex items-center justify-center shadow-2xl" style={{ borderColor: color }}>
             <span className="text-xs font-bold text-emerald-400">BRL</span>
          </div>
          <span className="text-[8px] font-mono text-white/40 uppercase">São Paulo</span>
        </div>
      </div>

      <div className="mt-12 text-center">
         <div className="text-2xl font-bold text-white">$12,450.00</div>
         <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-[0.3em] mt-1">{t('fv.crossborder.settled')}</div>
      </div>
    </div>
  );
}

function ComplianceVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-12 bg-black/20 rounded-3xl overflow-hidden">
      <div className="relative w-48 h-64 bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden p-4">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 rounded bg-white/10" />
            <div className="flex-1 space-y-1">
              <div className="w-full h-2 bg-white/10 rounded" />
              <div className="w-2/3 h-2 bg-white/5 rounded" />
            </div>
          </div>
          <div className="w-full h-px bg-white/5" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-full h-1.5 bg-white/5 rounded" />
            ))}
          </div>
        </div>

        {/* Laser Scanner */}
        <motion.div 
          animate={{ top: ['-10%', '110%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_#10b981] z-20"
        />
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
          {t('fv.compliance.aml')}
        </div>
      </div>
    </div>
  );
}

function FundraisingVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-black/20 rounded-3xl">
       <div className="w-full max-w-sm flex flex-col gap-6">
          <div className="text-3xl font-bold text-white">$145,280.00</div>
          <div className="h-4 bg-white/5 rounded-full p-1 relative overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full rounded-full" style={{ backgroundColor: color }} />
          </div>
       </div>
    </div>
  );
}

function MassDisbursementVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm h-64 bg-white/[0.01] border border-white/5 rounded-3xl p-6">
         <div className="text-emerald-400 text-[8px] font-bold">{t('fv.mass.executing')}</div>
      </div>
    </div>
  );
}

function HealthVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/20 p-8 rounded-3xl">
       <div className="w-full max-w-sm aspect-video bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          <div className="text-2xl font-bold text-white">94 mg/dL</div>
       </div>
    </div>
  );
}

function EngagementVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="w-24 h-24 rounded-full bg-black border-2 flex items-center justify-center" style={{ borderColor: color }}>
          <iconify-icon icon="solar:chat-round-dots-bold-duotone" width="40" style={{ color }}></iconify-icon>
       </div>
    </div>
  );
}

function JuridicaVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return <HealthVisualizer color={color} />;
}

function NegotiationVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return <M2MVisualizer color={color} />;
}

function TokenizationVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  return <InvoicingVisualizer color={color} />;
}

function MultiSigVisualizer({ color }: { color: string }) {
  const { t } = useTranslation();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Cycle through 4 stages: 
    // 0: 1st signing
    // 1: 2nd signing
    // 2: 3rd signing
    // 3: Completed (Lock flashes)
    const timer = setInterval(() => {
      setStage((s) => (s + 1) % 4);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-8 bg-black/20 rounded-3xl overflow-hidden group">
      {/* 3D Technical Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ 
             backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, 
             backgroundSize: '30px 30px', 
             transform: 'perspective(500px) rotateX(60deg) translateY(20%) scale(2)',
             maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
           }} />

      {/* Central Authority Node (The Ledger/Smart Contract) */}
      <div className="relative z-20 mb-16">
        <motion.div 
          animate={{ 
            scale: stage === 3 ? [1, 1.2, 1] : 1,
            rotate: stage === 3 ? [0, 5, -5, 0] : 0,
            borderColor: stage >= 1 ? color : 'rgba(255,255,255,0.1)'
          }}
          className="w-24 h-24 rounded-[2.5rem] bg-black border-2 flex items-center justify-center relative shadow-[0_0_60px_rgba(0,0,0,0.8)]"
        >
          <div className="absolute inset-0 rounded-[2.5rem] bg-white opacity-[0.02] blur-xl" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={stage === 3 ? 'success' : 'lock'}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                filter: stage === 3 ? ['brightness(1)', 'brightness(2)', 'brightness(1)'] : 'none'
              }}
              transition={stage === 3 ? { duration: 0.5, repeat: 3 } : { duration: 0.3 }}
            >
              <iconify-icon 
                icon={stage === 3 ? "solar:lock-unlocked-bold-duotone" : "solar:shield-keyhole-bold-duotone"} 
                width="48" 
                style={{ color: stage >= 1 ? color : 'rgba(255,255,255,0.2)' }}
              ></iconify-icon>
            </motion.div>
          </AnimatePresence>
          
          {/* Internal Loading Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border border-dashed rounded-full opacity-20"
            style={{ borderColor: color }}
          />
        </motion.div>
        
        {/* Glow Pulse */}
        <AnimatePresence>
          {stage === 3 && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.8, opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-full blur-3xl"
              style={{ backgroundColor: color }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* The Signers Bridge */}
      <div className="relative z-10 flex gap-10">
        
        {/* BRIDGE LINE - Horizontal link between signers */}
        <div className="absolute top-8 left-8 right-8 h-0.5 bg-white/5 overflow-hidden">
           <motion.div 
            animate={{ 
              width: stage === 0 ? '33%' : stage === 1 ? '66%' : '100%',
              backgroundColor: stage >= 1 ? color : 'rgba(255,255,255,0.1)'
            }}
            className="h-full"
            style={{ boxShadow: stage >= 1 ? `0 0 10px ${color}` : 'none' }}
           />
        </div>

        {[0, 1, 2].map((i) => {
          const hasSigned = stage > i;
          const currentlySigning = stage === i;
          const isComplete = stage === 3;
          
          return (
            <div key={i} className="relative flex flex-col items-center">
              {/* Vertical Connection Beam to Core - Only for the middle one */}
              {i === 1 && (
                <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[2px] h-16 overflow-visible">
                  <div className="w-full h-full bg-white/5" />
                  {(hasSigned || currentlySigning || isComplete) && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      className="absolute top-0 left-0 w-full"
                      style={{ 
                        backgroundColor: color, 
                        boxShadow: `0 0 15px ${color}`,
                        opacity: currentlySigning ? 0.4 : 1 
                      }}
                    />
                  )}
                </div>
              )}

              <motion.div
                animate={{ 
                  scale: currentlySigning ? 1.1 : 1,
                  y: currentlySigning ? -5 : 0,
                  boxShadow: (currentlySigning || (isComplete && i === 2)) ? `0 10px 30px ${color}30` : '0 10px 20px rgba(0,0,0,0.4)'
                }}
                className="w-16 h-16 rounded-2xl bg-black border-2 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500"
                style={{ borderColor: (hasSigned || currentlySigning || isComplete) ? color : 'rgba(255,255,255,0.05)' }}
              >
                {(hasSigned || isComplete) && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    className="absolute inset-0"
                    style={{ backgroundColor: color }}
                  />
                )}
                
                <AnimatePresence mode="wait">
                  {(hasSigned || isComplete) ? (
                    <motion.div key="check" initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
                       <iconify-icon icon="solar:check-read-bold" width="28" style={{ color }}></iconify-icon>
                    </motion.div>
                  ) : currentlySigning ? (
                    <motion.div key="signing" animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }}>
                       <iconify-icon icon="solar:pen-new-square-bold" width="24" style={{ color }}></iconify-icon>
                    </motion.div>
                  ) : (
                    <motion.div key="idle">
                       <iconify-icon icon="solar:user-bold" width="24" className="text-white/10"></iconify-icon>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Signing Progress Ring */}
                {currentlySigning && (
                  <svg className="absolute inset-0 -rotate-90 pointer-events-none">
                    <motion.circle 
                      cx="50%" cy="50%" r="28" 
                      fill="none" stroke={color} strokeWidth="2" 
                      strokeDasharray="176" 
                      initial={{ strokeDashoffset: 176 }}
                      animate={{ strokeDashoffset: 0 }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  </svg>
                )}
              </motion.div>
              
              <span className="mt-3 text-[7px] font-mono opacity-30 uppercase tracking-[0.2em]">Auth_Node_{i+1}</span>
            </div>
          );
        })}
      </div>

      {/* Cinematic HUD Footer */}
      <div className="absolute bottom-6 left-8 right-8 flex flex-col gap-4">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Workflow Consensus</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bricolage font-bold text-white tracking-tighter">
                {stage === 0 ? "0" : stage === 1 ? "1" : stage === 2 ? "2" : "3"} <span className="text-white/20 text-sm">/ 3</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold opacity-80 uppercase tracking-widest">
                {stage === 3 ? "Execution Verified" : "Collecting Proofs"}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-1">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-4 h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div 
                    animate={{ width: (stage > i || stage === 3) ? '100%' : '0%' }}
                    className="h-full"
                    style={{ backgroundColor: color }}
                  />
                </div>
              ))}
            </div>
            <span className="text-[8px] font-mono text-white/20 uppercase">Network Stability: 100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericVisualizer({ icon, color }: { icon: string, color: string }) {
  const { t } = useTranslation();
  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-48 h-48 rounded-full border border-white/20 flex items-center justify-center">
        <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl flex items-center justify-center z-10">
          <iconify-icon icon={icon} width="32" style={{ color }}></iconify-icon>
        </div>
      </motion.div>
    </div>
  );
}
