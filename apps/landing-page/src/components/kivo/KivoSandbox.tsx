import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoSandbox() {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [code, setCode] = useState(`{
  "apiKey": "pk_live_kivo_...",
  "amount": 45.00,
  "currency": "EUR"
}`);
  const [parsed, setParsed] = useState({ amount: 45, currency: 'EUR' });

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    try {
      const j = JSON.parse(e.target.value);
      setParsed({ amount: j.amount || 0, currency: j.currency || 'USD' });
    } catch(e) {}
  };

  const handleTest = () => {
    setStatus('processing');
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        setStatus('idle');
      }, 4000);
    }, 2500);
  };

  return (
    <section className="px-6 max-w-5xl mx-auto mb-32 gs-fade-up">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-5xl font-bricolage text-white mb-6">Live Sandbox: Gateway Global</h2>
        <p className="text-white/50 text-lg">Veja o que acontece nos bastidores quando uma compra transfronteiriça é feita usando 3 linhas de código.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-[#0d1117] border border-white/10 rounded-2xl p-6 relative overflow-hidden flex flex-col"
        >
          <div className="flex gap-2 mb-6 opacity-50">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-white/30 text-xs font-mono mb-4">// checkout.ts</p>
          <div className="relative grow font-mono text-sm group">
            <textarea
              value={code}
              onChange={handleCodeChange}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-transparent text-emerald-300 p-4 font-mono text-sm resize-none outline-none border border-transparent focus:border-white/10 rounded-xl transition-colors z-10"
            />
            {/* Syntax Highlighting Fake Background */}
            <div className="absolute inset-0 p-4 pointer-events-none opacity-50 bg-black/20 rounded-xl border border-white/5"></div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-neutral-900 border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden text-center z-10"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none -z-10"></div>
          
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 w-full"
              >
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10 mb-6">
                   {/* @ts-ignore */}
                  <iconify-icon icon="solar:global-linear" width="32" class="text-white/60"></iconify-icon>
                </div>
                <h3 className="text-xl font-medium text-white">Pronto para receber</h3>
                <p className="text-white/50 text-sm">Simule um pagamento de {parsed.currency} {parsed.amount.toFixed(2)} para a sua carteira em USDC.</p>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleTest}
                  className="w-full mt-4 bg-white text-black py-4 rounded-xl font-medium hover:bg-emerald-400 hover:text-black transition-colors"
                >
                  Testar Checkout Transfronteiriço
                </motion.button>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-8 w-full flex flex-col items-center"
              >
                <div className="relative flex items-center justify-between w-full max-w-[240px] mx-auto">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30 font-mono text-blue-400 text-xs font-bold z-10"
                  >
                    {parsed.currency}
                  </motion.div>
                  
                  <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -z-0 -translate-y-1/2 overflow-hidden">
                    <motion.div 
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-full bg-emerald-400 shadow-[0_0_10px_#34d399] w-1/2"
                    ></motion.div>
                  </div>

                  <motion.div 
                    animate={{ rotate: 180 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-14 h-14 bg-neutral-800 rounded-xl flex items-center justify-center border border-white/20 shadow-xl z-10"
                  >
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:refresh-circle-bold-duotone" width="28" class="text-white/80"></iconify-icon>
                  </motion.div>

                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 font-mono text-emerald-400 text-xs z-10"
                  >
                    USDC
                  </motion.div>
                </div>

                <div className="space-y-2 mt-8">
                  <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity }} className="text-emerald-400 font-mono text-sm">Capturando {parsed.currency} {parsed.amount.toFixed(2)}...</motion.p>
                  <p className="text-white/40 font-mono text-xs">PathPaymentStrictReceive via AMM...</p>
                  <p className="text-white/40 font-mono text-xs">Convertendo {parsed.currency} → USDC...</p>
                </div>
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 w-full"
              >
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:check-read-bold-duotone" width="48" class="text-emerald-400"></iconify-icon>
                </div>
                <div>
                  <h3 className="text-2xl font-bricolage text-white">{(parsed.amount * 1.09).toFixed(2)} USDC</h3>
                  <p className="text-emerald-400 text-sm mt-2">Liquidado on-chain com sucesso</p>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 mt-6 text-left">
                  <p className="text-white/30 text-xs font-mono break-all">
                    TxHash: <span className="text-white/60">0ef9...4b2d</span>
                  </p>
                  <p className="text-white/30 text-xs font-mono mt-1">
                    Tempo total: <span className="text-emerald-400">3.4s</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}