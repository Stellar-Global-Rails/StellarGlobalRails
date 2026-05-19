import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function KivoKonamiCode() {
  const [active, setActive] = useState(false);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          setActive(true);
          konamiIndex = 0;
          
          // Wireframe CSS
          const style = document.createElement('style');
          style.id = 'konami-wireframe';
          style.innerHTML = `
            * { outline: 1px solid rgba(16, 185, 129, 0.2) !important; background: rgba(0,0,0,0.8) !important; color: #10B981 !important; }
            img, video, canvas { opacity: 0.2 !important; }
          `;
          document.head.appendChild(style);
        }
      } else {
        konamiIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (!active) return;
    let frameCount = 0;
    let lastTime = performance.now();
    
    const updateFps = () => {
      const now = performance.now();
      frameCount++;
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      requestAnimationFrame(updateFps);
    };
    
    const raf = requestAnimationFrame(updateFps);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-[99999] bg-black border border-emerald-500 p-4 rounded-xl font-mono text-emerald-400 text-xs shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-500/30">
            {/* @ts-ignore */}
            <iconify-icon icon="solar:bug-bold-duotone" width="16"></iconify-icon>
            <span>DEV MODE: ACTIVE</span>
          </div>
          <div>FPS: {fps}</div>
          <div>Z-INDEX: LAYERS EXPOSED</div>
          <div>WEBGL: COMPILED</div>
          <button 
            onClick={() => {
              setActive(false);
              document.getElementById('konami-wireframe')?.remove();
            }}
            className="mt-4 w-full bg-emerald-500/20 py-1 hover:bg-emerald-500/40 rounded transition-colors"
          >
            EXIT
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
