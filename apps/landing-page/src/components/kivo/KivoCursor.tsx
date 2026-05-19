import { useEffect, useState } from 'react';
import { motion, useSpring, AnimatePresence } from 'motion/react';

export default function KivoCursor() {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  const springConfig1 = { damping: 25, stiffness: 300, mass: 0.2 };
  const springConfig2 = { damping: 25, stiffness: 250, mass: 0.4 };
  const springConfig3 = { damping: 25, stiffness: 200, mass: 0.6 };

  const cursorX1 = useSpring(-100, springConfig1);
  const cursorY1 = useSpring(-100, springConfig1);
  
  const cursorX2 = useSpring(-100, springConfig2);
  const cursorY2 = useSpring(-100, springConfig2);

  const cursorX3 = useSpring(-100, springConfig3);
  const cursorY3 = useSpring(-100, springConfig3);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      const targetX = e.clientX - (isHovering ? 24 : 8);
      const targetY = e.clientY - (isHovering ? 24 : 8);
      
      cursorX1.set(targetX);
      cursorY1.set(targetY);
      
      cursorX2.set(targetX);
      cursorY2.set(targetY);
      
      cursorX3.set(targetX);
      cursorY3.set(targetY);

      // Item 48: Cursor Heatmap Analytics Anônimo (Simulação Invisível)
      if (Math.random() > 0.95) { // Envia ~5% das coordenadas para não poluir
        console.debug('[Kivo Analytics] Ponto de calor registrado:', { x: targetX, y: targetY });
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'button' || 
        target.closest('button') || 
        target.tagName.toLowerCase() === 'a' || 
        target.closest('a') || 
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    document.body.classList.add('hide-cursor-global');

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('hide-cursor-global');
    };
  }, [cursorX1, cursorY1, cursorX2, cursorY2, cursorX3, cursorY3, isHovering]);

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .hide-cursor-global, .hide-cursor-global * {
          cursor: none !important;
        }
        
        /* Gooey Filter SVG (Cursor Líquido) */
        .gooey-cursor-container {
          filter: url('#gooey');
        }
      `}} />

      <svg width="0" height="0" className="absolute hidden">
        <filter id="gooey">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="gooey" />
          <feBlend in="SourceGraphic" in2="gooey" />
        </filter>
      </svg>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] gooey-cursor-container mix-blend-difference hidden md:block">
        {/* Rastro 3 (Último/Menor) */}
        <motion.div
          style={{ x: cursorX3, y: cursorY3, width: isHovering ? 48 : 12, height: isHovering ? 48 : 12 }}
          className="absolute top-0 left-0 rounded-full bg-emerald-500/30"
        />
        {/* Rastro 2 (Meio) */}
        <motion.div
          style={{ x: cursorX2, y: cursorY2, width: isHovering ? 48 : 14, height: isHovering ? 48 : 14 }}
          className="absolute top-0 left-0 rounded-full bg-emerald-500/60"
        />
        {/* Cursor Principal Macio (Frente) */}
        <motion.div
          style={{ x: cursorX1, y: cursorY1, width: isHovering ? 48 : 16, height: isHovering ? 48 : 16 }}
          className={`absolute top-0 left-0 rounded-full transition-colors duration-300 flex items-center justify-center ${
            isHovering ? 'bg-emerald-500 border border-emerald-400' : 'bg-emerald-400'
          }`}
        >
          <AnimatePresence>
            {isHovering && (
              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-[8px] text-black font-bold uppercase font-mono tracking-widest mix-blend-normal">
                Click
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Ponto duro absoluto para precisão */}
      <div 
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference hidden md:block"
        style={{ transform: `translate(${mousePosition.x - 0.5}px, ${mousePosition.y - 0.5}px)` }}
      />
    </>
  );
}
