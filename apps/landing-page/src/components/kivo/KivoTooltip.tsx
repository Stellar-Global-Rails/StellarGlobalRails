import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  word: string;
  explanation: string;
}

export default function KivoTooltip({ word, explanation }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <span 
      className="relative inline-block border-b border-dashed border-emerald-500/50 cursor-help"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className="text-emerald-400 font-medium">{word}</span>
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-50 text-xs text-white/80 pointer-events-none"
          >
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 border-8 border-transparent border-t-neutral-900"></div>
            {explanation}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
