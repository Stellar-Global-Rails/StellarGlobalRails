import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import MagneticButton from '../ui/MagneticButton';
import { useTranslation } from '../../hooks/useTranslation';

export default function CoreSimulator({ slug, color }: { slug?: string, color: string }) {
  if (slug === 'kivopay' || slug === 'kivo') return <KivoPaySimulator color={color} />;
  if (slug === 'socialpay') return <SocialPaySimulator color={color} />;
  return <ContractEaseSimulator color={color} />;
}

// 1. KIVO PAY: O Radar de Liquidação & Roteamento
function KivoPaySimulator({ color }: { color: string }) {
  const { t } = useTranslation();
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState('IDLE');
  const [detectedPaths, setDetectedPaths] = useState<any[]>([]);

  const startSimulation = () => {
    setActive(true);
    setStatus('SCANNING_NODES');
    setDetectedPaths([]);
    
    // Simulate finding nodes
    setTimeout(() => {
      setDetectedPaths([
        { x: 40, y: -80, label: 'STELLAR_NODE', time: '2s' },
        { x: -100, y: 30, label: 'PIX_GATEWAY', time: '1s' },
      ]);
    }, 1000);

    setTimeout(() => setStatus('RE_ROUTING'), 2500);
    setTimeout(() => setStatus('SETTLED'), 4500);
    setTimeout(() => { setActive(false); setStatus('IDLE'); setDetectedPaths([]); }, 7000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden relative group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.03),transparent)] pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> {t('simulator.kivo.engine_active')}
          </div>
          <h3 className="text-3xl font-bricolage text-white">{t('simulator.kivo.title')}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{t('simulator.kivo.desc')}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="text-[10px] text-white/30 uppercase mb-1">{t('simulator.kivo.status_label')}</div>
              <div className="text-sm font-mono uppercase" style={{ color: active ? color : '#333' }}>{status}</div>
            </div>
            <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
              <div className="text-[10px] text-white/30 uppercase mb-1">{t('simulator.kivo.latency_label')}</div>
              <div className="text-sm font-mono text-white">{active ? (status === 'SETTLED' ? '2.1s' : '12ms') : '--'}</div>
            </div>
          </div>

          <MagneticButton 
            onClick={startSimulation} 
            disabled={active}
            className="w-full py-6 rounded-2xl font-bold transition-all disabled:opacity-50 relative overflow-hidden group shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] border border-white/20"
            style={{ 
              background: `linear-gradient(135deg, ${color}, #059669)`,
              color: '#000',
              fontSize: '1.1rem',
              letterSpacing: '0.05em'
            }}
          >
            <motion.div 
              className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
            />
            <div className="relative z-10 flex items-center justify-center gap-3">
              {active ? (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full"
                  />
                  <span>{t('simulator.kivo.processing')}</span>
                </>
              ) : (
                <>
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:bolt-bold" width="24"></iconify-icon>
                  <span>{t('simulator.kivo.cta')}</span>
                </>
              )}
            </div>
            
            {/* Ambient inner glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_70%)] pointer-events-none" />
          </MagneticButton>
        </div>

        <div className="flex-1 relative aspect-square w-full flex items-center justify-center bg-black/40 rounded-full border border-white/5 overflow-hidden">
          {/* Technical Radar Grid */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
          
          {/* Distance Rings */}
          {[1, 0.75, 0.5, 0.25].map((scale, i) => (
            <div key={i} className="absolute rounded-full border border-white/5" 
                 style={{ width: `${scale * 100}%`, height: `${scale * 100}%` }} />
          ))}

          {/* Sweep Line */}
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }} 
            className="absolute inset-0 z-20 origin-center" 
            style={{ background: `conic-gradient(from 0deg, ${color}30, transparent 90deg)` }} 
          />
          
          {/* Central Node */}
          <div className="w-20 h-20 rounded-full border-2 bg-black flex items-center justify-center z-40 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]" style={{ borderColor: color }}>
             <motion.div animate={{ scale: active ? [1, 1.2, 1] : 1 }} transition={{ duration: 0.5, repeat: active ? Infinity : 0 }} className="absolute inset-0 rounded-full opacity-20" style={{ backgroundColor: color }} />
             {/* @ts-ignore */}
             <iconify-icon icon="solar:radar-2-bold" width="32" style={{ color }}></iconify-icon>
          </div>

          {/* Detected Paths Blips */}
          <AnimatePresence>
            {detectedPaths.map((blip, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute z-30 flex items-start gap-2"
                style={{ transform: `translate(${blip.x}px, ${blip.y}px)` }}
              >
                 <div className="w-2 h-2 rounded-full shadow-[0_0_10px_white] animate-pulse" style={{ backgroundColor: color }} />
                 <div className="flex flex-col">
                    <span className="text-[6px] font-mono text-white/60 font-bold">{blip.label}</span>
                    <span className="text-[5px] font-mono text-emerald-500">{blip.time}</span>
                 </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Rerouting Alert */}
          <AnimatePresence>
            {status === 'RE_ROUTING' && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }} 
                className="absolute top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-[10px] text-red-400 font-mono z-50 backdrop-blur-xl"
              >
                {t('simulator.kivo.alert_latency')}
              </motion.div>
            )}
            {status === 'SETTLED' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="absolute bottom-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-[10px] text-emerald-400 font-mono z-50 backdrop-blur-xl"
              >
                {t('simulator.kivo.alert_optimized')}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// 2. SOCIAL PAY: O Sandbox de Economia Social
function SocialPaySimulator({ color }: { color: string }) {
  const { t } = useTranslation();
  const [isDropped, setIsDropped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = () => {
    setIsDropped(true);
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden relative h-[500px] flex">
      {/* Left: Frontend (App) */}
      <div className="flex-1 p-8 md:p-12 border-r border-white/5 flex flex-col items-center justify-center relative bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-8">{t('simulator.social.interface')}</div>
        
        <div className="w-full max-w-[200px] aspect-[9/16] bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-4 flex flex-col relative shadow-2xl">
           <div className="w-12 h-1 bg-white/10 rounded-full self-center mb-6" />
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10" />
              <div className="flex-1 h-2 bg-white/5 rounded" />
           </div>

           <div className="flex-1 flex flex-col items-center justify-center">
              {!isDropped && (
                <motion.div
                  drag
                  dragConstraints={{ left: -100, right: 300, top: -100, bottom: 100 }}
                  onDragEnd={(e, info) => {
                    // Logic to detect drop on the right side
                    if (info.point.x > 300) onDrop();
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, cursor: "grabbing" }}
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-grab z-50 shadow-2xl"
                  style={{ backgroundColor: color }}
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:dollar-bold" width="32" className="text-black"></iconify-icon>
                </motion.div>
              )}
           </div>
           
           <div className="mt-auto h-12 w-full bg-white/5 rounded-2xl flex items-center px-4">
              <div className="w-full h-1 bg-white/10 rounded" />
           </div>
        </div>
        <div className="mt-6 text-white/20 text-xs italic">{t('simulator.social.desc')}</div>
      </div>

      {/* Right: Underworld (Ledger) */}
      <div className="flex-1 p-8 md:p-12 flex flex-col bg-[#020202] relative">
        <div className="text-[10px] text-white/30 uppercase tracking-widest mb-8 text-right">{t('simulator.social.blockchain')}</div>
        
        <div className="flex-1 flex flex-col gap-6 items-center justify-center relative">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
           
           {/* Node 1: Trust */}
           <motion.div 
             animate={{ borderColor: isProcessing ? color : 'rgba(255,255,255,0.1)' }}
             className="w-full max-w-[200px] h-14 rounded-xl border flex items-center px-4 gap-3 bg-black/40 z-10 transition-colors"
           >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isProcessing ? color : '#333' }} />
              <div className="flex-1 space-y-1">
                <div className="w-3/4 h-1 bg-white/10" />
                <div className="w-1/2 h-1 bg-white/5" />
              </div>
              <span className="text-[8px] font-mono text-white/30">{t('simulator.social.identity_ok')}</span>
           </motion.div>

           {/* Node 2: Split */}
           <motion.div 
             animate={{ borderColor: isProcessing ? color : 'rgba(255,255,255,0.1)' }}
             className="w-full max-w-[200px] h-14 rounded-xl border flex items-center px-4 gap-3 bg-black/40 z-10 transition-colors"
           >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isProcessing ? color : '#333' }} />
              <div className="flex-1 space-y-1">
                <div className="w-full h-1 bg-white/10" />
                <div className="w-2/3 h-1 bg-white/5" />
              </div>
              <span className="text-[8px] font-mono text-white/30">{t('simulator.social.split_routed')}</span>
           </motion.div>

           {/* Node 3: Success */}
           <AnimatePresence>
             {isDropped && !isProcessing && (
               <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-2xl flex items-center gap-3 z-20">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:check-circle-bold" width="24" className="text-emerald-400"></iconify-icon>
                  <div className="text-xs font-mono text-emerald-400">{t('simulator.social.ledger_settled')}</div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>

        {isDropped && (
          <button onClick={() => { setIsDropped(false); setIsProcessing(false); }} className="mt-auto text-xs text-white/30 hover:text-white underline self-end">{t('simulator.social.reset')}</button>
        )}
      </div>

      {/* Divider Line */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10 z-0" />
    </div>
  );
}

// 3. CONTRACT EASE: O Motor de Imutabilidade 3D
function ContractEaseSimulator({ color }: { color: string }) {
  const { t } = useTranslation();
  const [isSigned, setIsSigned] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#050505] border border-white/10 rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
      <div className="flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6 z-10">
          <h3 className="text-3xl font-bricolage text-white">{t('simulator.contract.title')}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{t('simulator.contract.desc')}</p>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3 text-xs text-white/40">
                <div className={`w-2 h-2 rounded-full ${isSigned ? 'bg-emerald-400' : 'bg-white/10'}`} />
                {t('simulator.contract.integrity')}
             </div>
             <div className="flex items-center gap-3 text-xs text-white/40">
                <div className={`w-2 h-2 rounded-full ${isSigned ? 'bg-emerald-400' : 'bg-white/10'}`} />
                {t('simulator.contract.onchain')}
             </div>
          </div>

          <MagneticButton 
            onClick={() => setIsSigned(true)} 
            disabled={isSigned}
            className="w-full py-4 rounded-xl font-bold transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
            style={{ 
              background: isSigned ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${color}, ${color}dd)`, 
              color: isSigned ? '#666' : '#000' 
            }}
          >
            {isSigned ? t('simulator.contract.sealed') : t('simulator.contract.cta')}
          </MagneticButton>
        </div>

        <div className="flex-1 relative aspect-square w-full flex items-center justify-center perspective-1000">
           <motion.div
             animate={{ 
               rotateY: isSigned ? 180 : 0,
               scale: isSigned ? 1.1 : 1
             }}
             transition={{ duration: 1.2, type: "spring", stiffness: 60 }}
             className="w-64 h-80 relative transform-style-3d shadow-2xl"
           >
              {/* FRONT: Documento Tradicional */}
              <div className="absolute inset-0 bg-[#f9f9f9] rounded-lg p-8 flex flex-col backface-hidden shadow-2xl">
                 <div className="w-1/2 h-4 bg-black/10 rounded mb-8" />
                 {[...Array(6)].map((_, i) => (
                   <div key={i} className="w-full h-2 bg-black/5 rounded mb-3" />
                 ))}
                 <div className="mt-auto flex justify-between items-end border-t border-black/10 pt-4">
                    <div className="w-24 h-6 bg-black/5 rounded italic text-[10px] p-1">Signature...</div>
                    <div className="w-10 h-10 rounded-full border-2 border-black/5" />
                 </div>
              </div>

              {/* BACK: Smart Contract (Dark/Code) */}
              <div className="absolute inset-0 bg-[#050505] rounded-lg p-6 flex flex-col backface-hidden [transform:rotateY(180deg)] border-2 border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)] overflow-hidden">
                 <div className="absolute inset-0 opacity-20 font-mono text-[6px] text-white p-2 break-all leading-tight">
                    {`contract Soroban {
                      function execute_escrow(buyer: address, seller: address, amount: i128) {
                        let hash = env.crypto().sha256(data);
                        env.storage().instance().set(&DataKey::Hash, &hash);
                      }
                    }`.repeat(5)}
                 </div>
                 
                 <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: isSigned ? 1 : 0 }} 
                      transition={{ delay: 0.8 }}
                      className="w-20 h-20 rounded-full flex items-center justify-center bg-black border-4 shadow-2xl mb-4"
                      style={{ borderColor: color }}
                    >
                       {/* @ts-ignore */}
                       <iconify-icon icon="solar:shield-keyhole-bold" width="40" style={{ color }}></iconify-icon>
                    </motion.div>
                    <div className="text-[10px] font-mono font-bold tracking-widest text-center" style={{ color }}>
                       {t('simulator.contract.secured')}<br/>
                       <span className="text-white/40">{t('simulator.contract.hash')}</span>
                    </div>
                 </div>
              </div>
           </motion.div>
           
           {/* Reset */}
           {isSigned && (
             <button onClick={() => setIsSigned(false)} className="absolute -bottom-8 text-xs text-white/30 hover:text-white underline">{t('simulator.contract.reset')}</button>
           )}
        </div>
      </div>
    </div>
  );
}
