import { modulesData } from '../data/content';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

function ModuleCard({ mod, idx, total, scrollYProgress }: { key?: any, mod: any, idx: number, total: number, scrollYProgress: MotionValue<number> }) {
  const { t } = useTranslation();
  const target = idx / Math.max(1, (total - 1));
  const distance = 0.35;
  const yStagger = idx % 2 !== 0 ? 80 : 0;

  const scale = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0.85;
    return 0.85 + (1.05 - 0.85) * (1 - dist / distance);
  });
  
  const opacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0.3;
    return 0.3 + (1 - 0.3) * (1 - dist / distance);
  });
  
  const y = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return yStagger + 40;
    return yStagger + 40 + ((yStagger - 15) - (yStagger + 40)) * (1 - dist / distance);
  });
  
  const glowOpacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0;
    return 0 + (0.15 - 0) * (1 - dist / distance);
  });
  
  const iconScale = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return 0.9;
    return 0.9 + (1.15 - 0.9) * (1 - dist / distance);
  });
  
  const iconBg = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,0.05)";
    const mix = 1 - dist / distance;
    return `rgba(${Math.round(255 - mix*239)}, ${Math.round(255 - mix*70)}, ${Math.round(255 - mix*126)}, ${0.05 + mix*0.10})`;
  });

  const borderOpacity = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,0.05)";
    const mix = 1 - dist / distance;
    return `rgba(${255 - mix*(255-16)}, ${255 - mix*(255-185)}, ${255 - mix*(255-129)}, ${0.05 + mix*0.45})`;
  });

  const iconColor = useTransform(scrollYProgress, (v) => {
    const dist = Math.abs(v - target);
    if (dist >= distance) return "rgba(255,255,255,1)";
    const mix = 1 - dist / distance;
    return `rgba(${255 - mix*(255-16)}, ${255 - mix*(255-185)}, ${255 - mix*(255-129)}, 1)`;
  });
  
  return (
    <motion.div 
      className="w-[340px] md:w-[480px] h-[400px] shrink-0"
      style={{ scale, opacity, y }}
    >
      <a 
        href={mod.path}
        className="group relative rounded-3xl bg-neutral-900/50 hover:bg-neutral-800/80 p-8 md:p-10 flex flex-col gap-6 transition-colors duration-500 h-full overflow-hidden block shadow-2xl"
      >
        <motion.div 
          className="absolute inset-0 rounded-3xl border pointer-events-none transition-colors duration-300"
          style={{ borderColor: borderOpacity }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 blur-[90px] rounded-full pointer-events-none transition-opacity duration-300"
          style={{ opacity: glowOpacity }}
        ></motion.div>
        
        <motion.div 
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center relative z-10 shadow-lg"
          style={{ scale: iconScale, backgroundColor: iconBg, color: iconColor }}
        >
          {/* @ts-ignore */}
          <iconify-icon icon={mod.icon} width="36"></iconify-icon>
        </motion.div>
        
        <div className="relative z-10 mt-2 flex-grow">
          <h4 className="text-2xl md:text-3xl text-white font-bricolage font-medium mb-4">
             {/* @ts-ignore */}
             {t(`module.${mod.id}.name`) || mod.name}
          </h4>
          <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">
             {/* @ts-ignore */}
             {t(`module.${mod.id}.tagline`) || mod.tagline}
          </p>
        </div>

        <div className="mt-auto pt-6 border-t border-white/5 flex items-center text-emerald-500 text-sm md:text-base font-medium tracking-widest uppercase relative z-10 group-hover:text-emerald-400">
          {t('hero.cta').split(' ')[0]}
          <motion.svg 
            className="w-5 h-5 ml-3" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            animate={{ x: 5 }}
            transition={{ duration: 0.75, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </motion.svg>
        </div>
      </a>
    </motion.div>
  );
}

export default function ModuleGrid() {
  const { t } = useTranslation();
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  const [profile, setProfile] = useState<'ceo' | 'dev'>('ceo');

  useEffect(() => {
    const currentProfile = localStorage.getItem('kivo_profile') || 'ceo';
    setProfile(currentProfile as 'ceo' | 'dev');

    const handleProfileChange = (e: CustomEvent) => {
      setProfile(e.detail);
    };

    window.addEventListener('kivo_profile_change', handleProfileChange as EventListener);
    return () => window.removeEventListener('kivo_profile_change', handleProfileChange as EventListener);
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  
  const isDev = profile === 'dev';

  return (
    <section id="modules" ref={targetRef} className="h-[300vh] bg-neutral-950 relative">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden border-t border-white/5 py-24">
        <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 relative z-10 mb-8 md:mb-16 shrink-0 gs-fade-up">
          <h3 className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium text-white mb-6 leading-[0.9] tracking-tight">
            {isDev ? t('modules.dev.title') : t('modules.title')}
          </h3>
          <p className="text-white/50 text-xl font-light max-w-3xl">
            {isDev ? t('modules.dev.subtitle') : t('modules.subtitle')}
          </p>
        </div>

        <motion.div 
          style={{ x }}
          className="flex gap-16 md:gap-24 px-6 md:px-12 w-max items-center h-[550px] pt-8"
        >
          {modulesData.map((mod, idx) => (
            <ModuleCard 
              key={mod.id} 
              mod={mod} 
              idx={idx} 
              total={modulesData.length} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}