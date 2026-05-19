import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import createGlobe from 'cobe';

function CobeGlobe({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;
    
    if (!canvasRef.current) return;
    
    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 384, // 192px * 2
      height: 384,
      phi: 0,
      theta: 0.2,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 32000,
      mapBrightness: 10,
      baseColor: [0.1, 0.1, 0.15],
      markerColor: [249 / 255, 115 / 255, 22 / 255], // Orange 500
      glowColor: [1.2, 0.5, 0.1], // Glow laranja forte
      markers: [
        { location: [37.0902, -95.7129], size: 0.1 }, // US
        { location: [-14.2350, -51.9253], size: 0.1 }  // BR
      ],
      onRender: (state) => {
        state.phi = phi;
        if (active) {
          phi += 0.05; // Spin faster when processing
        } else {
          phi += 0.005; // Idle spin
        }
      }
    });

    return () => globe.destroy();
  }, [active]);

  return <canvas ref={canvasRef} style={{ width: 192, height: 192 }} className="opacity-100 mix-blend-screen" />;
}

export default function KivoFamilyBridgeSimulator() {
  const [step, setStep] = useState(0);

  const simulate = () => {
    setStep(1); // Envio iniciado (US -> Globe)
    setTimeout(() => setStep(2), 1500); // Kivo convertendo (Globe spin)
    setTimeout(() => setStep(3), 3500); // Liquidação Pix (Globe -> BR)
    setTimeout(() => setStep(4), 5000); // Finalizado
    setTimeout(() => setStep(0), 8000); // Reset
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador FamilyBridge</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Remessas globais ultrarrápidas sem passar por bancos correspondentes, utilizando as rampas de liquidação do Kivo Payouts.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Partícula voadora US -> Engine */}
          <AnimatePresence>
            {step === 1 && (
               <motion.div 
                 initial={{ left: '16%', top: '50%', scale: 0.5, opacity: 0 }}
                 animate={{ left: '50%', top: '50%', scale: 1, opacity: 1 }}
                 exit={{ opacity: 0, scale: 0 }}
                 transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
                 className="hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-orange-500 shadow-[0_0_30px_#f97316] z-50 items-center justify-center text-white"
               >
                 {/* @ts-ignore */}
                 <iconify-icon icon="solar:dollar-minimalistic-bold" width="20"></iconify-icon>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Partícula voadora Engine -> BR */}
          <AnimatePresence>
            {step === 3 && (
               <motion.div 
                 initial={{ left: '50%', top: '50%', scale: 1, opacity: 1 }}
                 animate={{ left: '84%', top: '50%', scale: 0.5, opacity: 0 }}
                 transition={{ duration: 1.2, type: 'spring', bounce: 0.3 }}
                 className="hidden md:flex absolute -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-emerald-400 shadow-[0_0_30px_#34d399] z-50 items-center justify-center text-white"
               >
                 {/* @ts-ignore */}
                 <iconify-icon icon="solar:check-circle-bold" width="20"></iconify-icon>
               </motion.div>
            )}
          </AnimatePresence>

          {/* EUA (USDC) */}
          <div className={`p-6 rounded-2xl border transition-all w-full md:w-1/3 ${step === 0 ? 'bg-white/10 border-white/30' : 'bg-black/50 border-white/10'}`}>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 justify-center">
              {/* @ts-ignore */}
              <iconify-icon icon="flag:us-4x3" class="text-xl"></iconify-icon> Remetente (EUA)
            </h3>
            <div className="text-center mb-6">
              <span className="text-3xl font-bricolage text-white">USDC 100</span>
            </div>
            
            <button 
              onClick={simulate}
              disabled={step > 0}
              className="w-full py-3 rounded-xl bg-orange-500 text-white font-medium hover:bg-orange-400 transition-colors disabled:opacity-50"
            >
              {step === 0 ? 'Enviar Remessa' : 'Enviado...'}
            </button>
          </div>

          {/* KIVO ENGINE (Stellar) */}
          <div className="flex flex-col items-center justify-center w-full md:w-1/3 relative">
             <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-6 flex items-center gap-2 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
               Kivo Payment Engine
             </div>
             
             <div className="w-48 h-48 rounded-full border border-orange-500/20 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm relative shadow-[0_0_60px_rgba(249,115,22,0.15)]">
                <CobeGlobe active={step === 2} />
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-orange-400/50 animate-spin-slow pointer-events-none"
                  ></motion.div>
                )}
             </div>

             <div className="text-center mt-8 h-12">
               <AnimatePresence mode="wait">
                 {step === 1 && <motion.p key="1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-white/50 font-mono">1. Recebendo USDC via Anchor...</motion.p>}
                 {step === 2 && <motion.p key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-orange-400 font-mono">2. Path Payment Strict Receive (Câmbio BRL)</motion.p>}
                 {step === 3 && <motion.p key="3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-emerald-400 font-mono">3. Gatilho de liquidação instantânea!</motion.p>}
               </AnimatePresence>
             </div>
          </div>

          {/* BRASIL (PIX) */}
          <div className={`p-6 rounded-2xl border transition-all w-full md:w-1/3 ${step >= 3 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-black/50 border-white/10'}`}>
            <h3 className="text-white font-medium mb-4 flex items-center gap-2 justify-center">
              {/* @ts-ignore */}
              <iconify-icon icon="flag:br-4x3" class="text-xl"></iconify-icon> Beneficiário (Brasil)
            </h3>
            <div className="text-center mb-6">
               <span className={`text-3xl font-bricolage transition-colors ${step === 3 ? 'text-emerald-400' : 'text-white/20'}`}>
                 R$ 550,00
               </span>
            </div>
            
            <div className={`w-full py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${step >= 3 ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-white/30'}`}>
              {/* @ts-ignore */}
              <iconify-icon icon={step >= 3 ? "solar:check-circle-bold" : "solar:clock-circle-linear"} width="20"></iconify-icon>
              {step >= 3 ? 'Recebido via Pix ✓' : 'Aguardando fundos'}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
