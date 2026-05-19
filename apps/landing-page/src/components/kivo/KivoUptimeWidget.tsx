import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function KivoUptimeWidget() {
  const [ping, setPing] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setPing(prev => prev + (Math.floor(Math.random() * 5) - 2));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-[9000] hidden md:flex items-center gap-3 bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-xl">
      <div className="flex items-center gap-2">
        <motion.div 
          animate={{ opacity: [1, 0.4, 1] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"
        />
        <span className="text-white/80 text-xs font-medium">API UPTIME 99.99%</span>
      </div>
      <div className="w-px h-4 bg-white/20"></div>
      <span className="text-emerald-400 font-mono text-[10px]">{ping}ms ping</span>
    </div>
  );
}
