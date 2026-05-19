import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoQuiloVoltSimulator() {
  const [chargingStatus, setChargingStatus] = useState<'idle' | 'charging' | 'done'>('idle');
  const [targetPercentage, setTargetPercentage] = useState(80);
  const [kwh, setKwh] = useState(0);

  const MAX_KWH = 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (chargingStatus === 'charging') {
      const targetKwh = (targetPercentage / 100) * MAX_KWH;
      const step = targetKwh / 60; // about 3 seconds
      
      interval = setInterval(() => {
        setKwh((prev) => {
          const next = prev + step;
          if (next >= targetKwh) {
            clearInterval(interval);
            setChargingStatus('done');
            return targetKwh;
          }
          return next;
        });
      }, 50);
    }
    return () => clearInterval(interval);
  }, [chargingStatus, targetPercentage]);

  const handleCharge = () => {
    if (chargingStatus === 'idle') {
      setKwh(0);
      setChargingStatus('charging');
    } else if (chargingStatus === 'done') {
      setKwh(0);
      setChargingStatus('idle');
    }
  };

  const cost = kwh * 0.25;
  const targetCost = ((targetPercentage / 100) * MAX_KWH) * 0.25;

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Simulador QuiloVolt EV</h2>
        <p className="text-white/50 text-lg max-w-2xl mx-auto">
          Postos de recarga elétrica inteligentes integrados ao Kivo Terminal, permitindo pagamentos streaming via hold de saldo no cartão.
        </p>
      </div>

      <div className="bg-neutral-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">
          
          {/* Interface do Posto (IoT) */}
          <div className="bg-black/50 border border-white/10 p-6 rounded-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
               <h3 className="text-xl font-medium text-white flex items-center gap-2">
                 {/* @ts-ignore */}
                 <iconify-icon icon="solar:bolt-circle-bold" class="text-yellow-400"></iconify-icon> Estação #402
               </h3>
               <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-mono">ONLINE</span>
            </div>

            <div className="flex justify-center gap-2 mb-6">
              {[20, 50, 80, 100].map(pct => (
                <button 
                  key={pct}
                  onClick={() => setTargetPercentage(pct)}
                  disabled={chargingStatus !== 'idle'}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    targetPercentage === pct 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-white/10 text-white/50 hover:bg-white/20'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-48 rounded-[2rem] border-[6px] border-yellow-500/20 mb-4 relative overflow-hidden bg-black shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                 {/* Liquid Fill */}
                 <motion.div 
                   className="absolute bottom-0 left-0 right-0 bg-yellow-500"
                   initial={{ height: '0%' }}
                   animate={{ height: `${(kwh / MAX_KWH) * 100}%` }}
                   transition={{ duration: 0.1, ease: "linear" }}
                 ></motion.div>

                 {/* Bubbles if charging */}
                 {chargingStatus === 'charging' && (
                   <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48Y2lyY2xlIGN4PSc1MCcgY3k9JzUwJyByPSc1JyBmaWxsPSdyZ2JhKDI1NSwyNTUsMjU1LDAuMiknLz48L3N2Zz4=')] bg-[length:20px_20px] animate-[pulse_1s_infinite]"></div>
                 )}

                 <div className="flex flex-col relative z-10 text-white mix-blend-difference">
                   <span className="text-4xl font-bricolage">{kwh.toFixed(1)}</span>
                   <span className="text-xs opacity-80 text-center">kWh</span>
                 </div>
              </div>
              <div className="text-2xl text-yellow-400 font-mono flex flex-col">
                <span>USDC {cost.toFixed(2)}</span>
                {chargingStatus === 'idle' && (
                  <span className="text-[10px] text-white/30 uppercase tracking-widest mt-1">Est. {targetCost.toFixed(2)} USDC</span>
                )}
              </div>
            </div>

            <motion.button 
              onClick={handleCharge}
              disabled={chargingStatus === 'charging'}
              whileTap={{ scale: 0.95 }}
              animate={chargingStatus === 'charging' ? { x: [-2, 2, -2, 2, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`w-full py-4 rounded-xl font-medium transition-colors relative overflow-hidden flex justify-center items-center gap-2 ${
                chargingStatus === 'done' ? 'bg-emerald-500 text-black hover:bg-emerald-400' : 'bg-yellow-500 text-black hover:bg-yellow-400'
              }`}
            >
              {chargingStatus === 'charging' ? (
                <>
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:spinner-linear" class="animate-spin"></iconify-icon> Carregando...
                </>
              ) : chargingStatus === 'done' ? (
                'Finalizado. Nova Recarga'
              ) : (
                'Aproximar Cartão NFC'
              )}
            </motion.button>
          </div>

          {/* Bastidores: API do Kivo Gateway */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="bg-black/80 backdrop-blur-md border border-yellow-500/30 p-6 rounded-2xl w-full max-w-sm relative z-10 shadow-[0_0_50px_rgba(234,179,8,0.05)]">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:server-square-linear" width="24"></iconify-icon>
                </div>
                <div>
                  <h4 className="text-white font-medium">Kivo Streaming API</h4>
                  <p className="text-[10px] text-yellow-400 font-mono">IoT Payment Channel</p>
                </div>
              </div>

              <div className="space-y-3 font-mono text-[10px] text-white/50 h-40 flex flex-col justify-end overflow-hidden relative">
                 <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-b from-black/80 to-transparent z-10"></div>
                 
                 <p>{`> Status: IDLE`}</p>
                 <AnimatePresence>
                   {chargingStatus === 'charging' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                       <p className="text-white">{`> NFC Detected. Pre-auth Hold: ${targetCost.toFixed(2)} USDC`}</p>
                       <p className="text-emerald-400">{`> Channel Opened. Target: ${targetPercentage}%`}</p>
                       <p className="text-yellow-400">{`> Streaming payment... ${cost.toFixed(2)} USDC`}</p>
                     </motion.div>
                   )}
                   {chargingStatus === 'done' && (
                     <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                       <p className="text-emerald-400">{`> Charge complete at ${targetPercentage}%.`}</p>
                       <p className="text-white font-bold">{`> Captured via Kivo API: ${cost.toFixed(2)} USDC`}</p>
                       <p>{`> Channel Closed.`}</p>
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
