import { motion, useScroll, useTransform } from 'motion/react';
import React from 'react';

export default function Atmosphere() {
  const { scrollYProgress } = useScroll();
  
  // Orbs move slightly with scroll for depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Primary Emerald Orb */}
      <motion.div 
        style={{ y: y1 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-5%] w-[60vw] h-[60vw] bg-emerald-500/20 rounded-full blur-[120px]"
      />

      {/* Secondary Blue Orb */}
      <motion.div 
        style={{ y: y2 }}
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[40%] right-[-10%] w-[50vw] h-[50vw] bg-blue-500/10 rounded-full blur-[100px]"
      />

      {/* Tertiary Purple Orb */}
      <motion.div 
        style={{ y: y3 }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.05, 0.15, 0.05],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] bg-purple-500/10 rounded-full blur-[100px]"
      />

      {/* The Rail: A subtle vertical line that shows progress */}
      <div className="absolute right-4 md:right-12 top-0 bottom-0 w-[1px] bg-white/5 z-50">
        <motion.div 
          style={{ scaleY: scrollYProgress }}
          className="w-full h-full bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 origin-top shadow-[0_0_15px_rgba(16,185,129,0.5)]"
        />
      </div>

      {/* Cinematic Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10 pointer-events-none" />

      {/* Scanline Effect - Enhanced */}
      <motion.div 
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent h-40 w-full z-20 pointer-events-none"
      />
    </div>
  );
}
