import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoExitIntent() {
  const [show, setShow] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setShow(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-neutral-900 border border-emerald-500/30 p-8 rounded-3xl max-w-md w-full shadow-[0_0_80px_rgba(16,185,129,0.2)] text-center relative"
          >
            <button 
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white"
            >
              {/* @ts-ignore */}
              <iconify-icon icon="solar:close-circle-bold" width="24"></iconify-icon>
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {/* @ts-ignore */}
              <iconify-icon icon="solar:rocket-bold" width="32" class="text-white"></iconify-icon>
            </div>
            
            <h2 className="text-2xl font-bricolage text-white mb-2">Já vai?</h2>
            <p className="text-white/60 mb-8">
              Você ainda não testou nosso console de desenvolvedor. Acesse a Sandbox agora e veja a mágica acontecer.
            </p>
            
            <button 
              onClick={() => {
                setShow(false);
                window.location.hash = "#sandbox";
              }}
              className="w-full py-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              Abrir Kivo Sandbox
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
