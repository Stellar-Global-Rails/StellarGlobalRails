import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import FeatureVisualizer from './simulators/FeatureVisualizer';
import { useRef, useState, useEffect } from 'react';

function FloatingParticle({ delay = 0, color = "rgba(16, 185, 129, 0.2)" }) {
  return (
    <motion.div
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [-20, 20, -20], 
        opacity: [0, 0.3, 0],
        x: [-10, 10, -10]
      }}
      transition={{ 
        duration: 5 + Math.random() * 5, 
        repeat: Infinity, 
        delay,
        ease: "easeInOut" 
      }}
      className="absolute w-1 h-1 rounded-full blur-[1px] pointer-events-none"
      style={{ backgroundColor: color }}
    />
  );
}

export default function Platform() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="py-32 bg-neutral-950 text-white relative" id="platform">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        
        {/* Animated Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
        />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div key={i} style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }} className="absolute">
              <FloatingParticle delay={i * 0.5} />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center"
        >
          {/* Left Column: Text Content */}
          <div className="space-y-10">
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10 backdrop-blur-sm group">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse group-hover:scale-125 transition-transform" />
                <span className="text-emerald-500 text-[10px] font-mono uppercase tracking-[0.2em]">
                  Stellar Global Infrastructure
                </span>
              </div>
            </motion.div>

            <div className="space-y-6">
              <motion.h2 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-8xl font-bricolage font-medium leading-[0.85] tracking-tighter"
              >
                {t('platform.title')}
                <br />
                <span className="text-white/20 italic font-serif mt-2 block">{t('platform.subtitle')}</span>
              </motion.h2>

              <motion.p 
                variants={itemVariants}
                className="text-white/40 text-xl md:text-2xl font-light leading-relaxed max-w-xl"
              >
                {t('platform.desc')}
              </motion.p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { icon: "solar:bolt-circle-bold", title: t('platform.feature1.title'), desc: t('platform.feature1.desc'), color: "emerald" },
                { icon: "solar:global-bold", title: t('platform.feature2.title'), desc: t('platform.feature2.desc'), color: "blue" },
                { icon: "solar:shield-check-bold", title: t('platform.feature3.title'), desc: t('platform.feature3.desc'), color: "purple" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex gap-6 group cursor-default p-4 rounded-3xl hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 shadow-2xl`}>
                    {/* @ts-ignore */}
                    <iconify-icon icon={feature.icon} width="28" className={`${feature.color === 'emerald' ? 'text-emerald-400' : feature.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}></iconify-icon>
                  </div>
                  <div>
                    <h4 className="text-2xl font-medium mb-2 font-bricolage text-white/90 group-hover:text-white transition-colors">{feature.title}</h4>
                    <p className="text-white/40 leading-relaxed text-sm group-hover:text-white/60 transition-colors">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive 3D Visualizer */}
          <motion.div 
            variants={itemVariants}
            style={{ rotateX, rotateY, perspective: 1000, transformStyle: "preserve-3d" }}
            className="relative lg:h-[650px] w-full cursor-default group"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Visualizer Background Layer (with rounded corners and overflow hidden) */}
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] bg-neutral-900/40 backdrop-blur-3xl">
            </div>

            {/* The Core Content 3D Layer (NO overflow-hidden, preserves 3D) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
              <FeatureVisualizer id="platform-network" type="feature" icon="solar:globus-linear" color="#10b981" />
            </div>
            {/* Ambient Glows around the visualizer */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-[60px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}