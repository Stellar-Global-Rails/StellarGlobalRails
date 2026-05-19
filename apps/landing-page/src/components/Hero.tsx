import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import StellarNetwork from './ui/StellarNetwork';

export default function Hero() {
  const [profile, setProfile] = useState<'ceo' | 'dev'>('ceo');
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse Parallax Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const dx = useSpring(mouseX, springConfig);
  const dy = useSpring(mouseY, springConfig);

  const rotateX = useTransform(dy, [-300, 300], [5, -5]);
  const rotateY = useTransform(dx, [-300, 300], [-5, 5]);

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  useEffect(() => {
    const currentProfile = localStorage.getItem('kivo_profile') || 'ceo';
    setProfile(currentProfile as 'ceo' | 'dev');

    const handleProfileChange = (e: CustomEvent) => {
      setProfile(e.detail);
    };

    window.addEventListener('kivo_profile_change', handleProfileChange as EventListener);
    return () => window.removeEventListener('kivo_profile_change', handleProfileChange as EventListener);
  }, []);

  const isDev = profile === 'dev';
  const subtitleKey = isDev ? 'hero.subtitle.dev' : 'hero.subtitle.ceo';

  const pillars = [
    { icon: 'solar:users-group-rounded-linear', label: 'SocialPay', color: '#EC4899' },
    { icon: 'solar:document-text-linear', label: 'ContractEase', color: '#8B5CF6' },
    { icon: 'solar:wallet-linear', label: 'Kivo Pay', color: '#10B981' },
  ];

  return (
    <header 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden flex flex-col justify-end pb-12 md:pb-24 min-h-screen md:h-screen perspective-1000"
    >
      <div className="absolute inset-0 z-0 bg-[#050505] overflow-hidden">
        {/* ThreeJS WebGL Particle Network */}
        <StellarNetwork />
        
        {/* Texture & Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_90%)] z-10 pointer-events-none"></div>
        <div className="bg-noise absolute inset-0 z-10 mix-blend-overlay opacity-30 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10 pointer-events-none"></div>
        
        {/* Moving Technical Light */}
        <motion.div 
          style={{ x: dx, y: dy }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 1.8 }}
        className="absolute top-32 right-6 md:right-12 z-20 flex flex-col items-end gap-2"
      >
        <div className="px-4 py-2 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 flex items-center gap-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono tracking-wider uppercase text-white/90">
            {t('hero.live_status')}
          </span>
        </div>
      </motion.div>

      <motion.div 
        style={{ rotateX, rotateY }}
        className="relative z-20 w-full max-w-[90rem] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-6 items-end"
      >
        <div className="md:col-span-7 relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-[1px] w-8 bg-white/60"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-white/80">
              {t('hero.version')}
            </span>
          </motion.div>

          <h1 className="font-bricolage text-white leading-[0.85] tracking-tight font-semibold">
            <span className="block text-[12vw] md:text-[6rem] lg:text-[7rem] mix-blend-normal text-white drop-shadow-2xl">
              <span className="inline-block overflow-hidden pb-2">
                <motion.span initial={{ y: "120%", rotateZ: 2, opacity: 0 }} animate={{ y: 0, rotateZ: 0, opacity: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 1.0 }} className="inline-block">
                  {t('hero.rail')}
                </motion.span>
              </span>
            </span>
            <div className="flex flex-col gap-2 mt-4 md:mt-2">
              <span className="text-[8vw] md:text-[4rem] lg:text-[4rem] font-serif italic font-thin text-emerald-400 mt-2">
                <span className="inline-block overflow-hidden pb-2">
                  <motion.span initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.5, ease: "easeOut", delay: 1.4 }} className="inline-block">
                    {t('hero.title')}
                  </motion.span>
                </span>
              </span>
            </div>
          </h1>

          {/* Product pillars - animated badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 2.0 }}
            className="flex flex-wrap gap-3 mt-10"
          >
            {pillars.map((p, i) => (
              <motion.div
                key={p.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                transition={{ delay: 2.2 + i * 0.15, duration: 0.6, ease: "easeOut" }}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md cursor-default"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }}></div>
                {/* @ts-ignore */}
                <iconify-icon icon={p.icon} width="18" style={{ color: p.color }}></iconify-icon>
                <span className="text-sm text-white font-medium">{p.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="md:col-span-4 md:col-start-9 flex flex-col justify-end pb-4 md:pb-8">
          <motion.div 
            initial={{ opacity: 0, x: 40, rotateY: 10 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 1.6 }}
            className="overflow-hidden md:p-10 bg-neutral-950/60 border-white/10 border rounded-3xl ring-white/5 ring-1 p-8 relative shadow-[0_0_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl"
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent z-0 pointer-events-none animate-shimmer-effect"></div>

            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-10 antialiased drop-shadow-md">
                {t(subtitleKey)}
              </p>

              <div className="flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">
                      {t('hero.settlement')}
                    </span>
                    <span className="text-3xl font-bricolage text-white">3-5s</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest text-white/30 mb-2 font-mono">
                      {t('hero.products_count')}
                    </span>
                    <span className="text-3xl font-bricolage text-white">3</span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-white/10 pt-8">
                  <motion.a 
                    href="#products" 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative flex items-center justify-between w-full p-4 bg-emerald-500 rounded-2xl text-black font-bold transition-all shadow-xl"
                  >
                    <span className="text-xs uppercase tracking-widest">
                      {t('hero.cta')}
                    </span>
                    {/* @ts-ignore */}
                    <iconify-icon icon="solar:arrow-right-bold" class="group-hover:translate-x-1 transition-transform" width="20"></iconify-icon>
                    
                    {/* Inner Glow */}
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 2.0 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-mono">
          {t('hero.scroll')}
        </span>
        <motion.div 
          animate={{ height: [48, 24, 48] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-[1px] bg-gradient-to-b from-emerald-500 to-transparent shadow-[0_0_10px_#10b981]" 
        />
      </motion.div>
    </header>
  );
}