import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { useRef, useState, useEffect } from 'react';

function Counter({ value, duration = 2 }: { value: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const target = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[0-9]/g, '');

  useEffect(() => {
    let start = 0;
    const end = target;
    const totalFrames = duration * 60;
    let frame = 0;

    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      setCount(Math.floor(end * progress));

      if (frame === totalFrames) clearInterval(timer);
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}{suffix}</span>;
}

function WorldMap() {
  return (
    <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
      {/* Stylized Dots Map Background */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle, rgba(16,185,129,0.2) 1px, transparent 1px)', 
        backgroundSize: '30px 30px' 
      }} />
      
      {/* Radar Pulse from Brazil */}
      <div className="absolute top-[65%] left-[30%] w-4 h-4">
         <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping" />
         <div className="absolute inset-[-40px] border border-emerald-500/20 rounded-full animate-[ping_4s_linear_infinite]" />
         <div className="absolute inset-[-80px] border border-emerald-500/10 rounded-full animate-[ping_6s_linear_infinite]" />
      </div>

      {/* Global Connections Lines (Simplified) */}
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 1000 500">
        <motion.path 
          d="M300,325 Q500,100 800,200" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1" 
          strokeDasharray="10,10"
          animate={{ strokeDashoffset: -100 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.path 
          d="M300,325 Q200,150 100,250" 
          fill="none" 
          stroke="url(#lineGrad)" 
          strokeWidth="1" 
          strokeDasharray="10,10"
          animate={{ strokeDashoffset: 100 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10b981" stopOpacity="1" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function MagneticStatCard({ item, isVisible, delay }: any) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  function handleMouseMove(e: React.MouseEvent) {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-[400px] rounded-[2.5rem] bg-gradient-to-br from-neutral-900 to-black border border-white/10 p-10 cursor-default shadow-2xl group"
      >
        <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500/0 to-emerald-500/5 group-hover:from-emerald-500/10 transition-colors duration-500 pointer-events-none" />
        
        <div style={{ transform: "translateZ(50px)" }} className="relative z-10 text-center flex flex-col items-center pointer-events-none h-full justify-center">
          <div className="mb-6 w-16 h-16 rounded-2xl bg-white text-black flex items-center justify-center shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
            {/* @ts-ignore */}
            <iconify-icon icon={item.icon} width="32"></iconify-icon>
          </div>
          <h3 className="text-5xl lg:text-6xl font-bricolage font-medium text-emerald-400 mb-4 drop-shadow-xl tracking-tighter">
            {isVisible ? <Counter value={item.title} /> : item.title}
          </h3>
          <p className="text-white/60 font-light drop-shadow-md leading-relaxed">{item.desc}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function GlobalReach() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section className="py-32 bg-neutral-950 text-white relative">
      <WorldMap />

      {/* Technical Scanning Line */}
      <motion.div 
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent z-10"
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          onViewportEnter={() => setIsVisible(true)}
          viewport={{ once: true }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 mb-6">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
             <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">Live Network Status</span>
          </div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bricolage font-medium mb-8 leading-[0.85] tracking-tighter">
            {t('reach.title.part1')}
            <span className="block text-emerald-400">{t('reach.title.part2')}</span>
          </h2>
          <p className="text-white/40 text-xl font-light max-w-3xl mx-auto leading-relaxed">
            {t('reach.desc')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { title: t('reach.stat1.title'), desc: t('reach.stat1.desc'), icon: "solar:globus-linear" },
            { title: t('reach.stat2.title'), desc: t('reach.stat2.desc'), icon: "solar:bill-list-linear" },
            { title: t('reach.stat3.title'), desc: t('reach.stat3.desc'), icon: "solar:stopwatch-linear" }
          ].map((item, i) => (
            <MagneticStatCard key={i} item={item} isVisible={isVisible} delay={i * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
}