import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { RailsLogo } from './ui/Logo';
import { useTranslation } from '../hooks/useTranslation';
import { useRef, useState } from 'react';

function ComparisonRow({ row, index, t }: { row: any, index: number, t: any }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      className="grid grid-cols-2 border-b border-white/5 last:border-0 relative z-10 group overflow-hidden"
    >
      {/* Dynamic Spotlight Background */}
      <motion.div
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, rgba(16, 185, 129, 0.05), transparent 80%)`
          ),
        }}
      />

      <div className="p-8 flex gap-5 hover:bg-red-500/[0.02] transition-colors relative z-10">
        <span className="text-red-500/40 mt-1 flex-shrink-0 text-xl leading-none group-hover:text-red-500 transition-colors font-bold">✖</span>
        <div>
          <h4 className="font-medium mb-2 text-white/70 text-lg group-hover:text-white transition-colors">{row.bad.title}</h4>
          <p className="text-sm text-white/30 leading-relaxed pr-8 group-hover:text-white/50 transition-colors">{row.bad.desc}</p>
        </div>
      </div>

      <div className="p-8 flex gap-5 bg-emerald-500/[0.01] hover:bg-emerald-500/[0.04] transition-colors group/good relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="text-emerald-500/40 mt-1 flex-shrink-0 text-xl leading-none group-hover:text-emerald-400 transition-colors">✓</span>
        <div>
          <h4 className="font-medium mb-2 text-white/80 text-lg group-hover:text-white transition-colors">{row.good.title}</h4>
          <p className="text-sm text-white/40 leading-relaxed pr-8 group-hover:text-white/70 transition-colors">{row.good.desc}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function StatusQuo() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  const comparisons = [
    {
      bad: { title: t('status.bad1.title'), desc: t('status.bad1.desc') },
      good: { title: t('status.good1.title'), desc: t('status.good1.desc') }
    },
    {
      bad: { title: t('status.bad2.title'), desc: t('status.bad2.desc') },
      good: { title: t('status.good2.title'), desc: t('status.good2.desc') }
    },
    {
      bad: { title: t('status.bad3.title'), desc: t('status.bad3.desc') },
      good: { title: t('status.good3.title'), desc: t('status.good3.desc') }
    },
    {
      bad: { title: t('status.bad4.title'), desc: t('status.bad4.desc') },
      good: { title: t('status.good4.title'), desc: t('status.good4.desc') }
    }
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <section className="py-32 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5" id="status-quo">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
      <div className="absolute top-0 left-1/4 w-px h-64 bg-gradient-to-b from-emerald-500/10 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-64 bg-gradient-to-b from-blue-500/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center mb-24"
        >
          <motion.span 
             animate={{ opacity: [0.4, 1, 0.4] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="text-emerald-500 text-[10px] font-mono uppercase tracking-[0.4em] mb-4 block"
          >
            The Evolution of Finance
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-bricolage font-medium mb-8 tracking-tighter leading-[0.9]">
            {t('status.title')}
          </h2>
          <p className="text-white/40 text-xl max-w-3xl mx-auto font-light leading-relaxed">
            {t('status.desc')}
          </p>
        </motion.div>

        {/* Desktop Comparison Table */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="hidden md:block bg-neutral-900/20 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        >
          <div className="grid grid-cols-2 border-b border-white/10">
            {/* Header: Traditional */}
            <div className="p-10 bg-red-500/[0.02] flex items-center gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/5 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
               <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-red-500/50 shadow-inner">
                 {/* @ts-ignore */}
                 <iconify-icon icon="solar:history-bold" width="32"></iconify-icon>
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-mono text-red-500/40 uppercase tracking-widest">Legacy Systems</span>
                 <h3 className="text-3xl font-bricolage text-white/90">{t('status.traditional')}</h3>
               </div>
            </div>

            {/* Header: Rails */}
            <div className="p-10 bg-emerald-500/[0.02] flex items-center gap-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[60px] rounded-full translate-x-10 -translate-y-10" />
               <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                 <RailsLogo className="w-9 h-9" />
               </div>
               <div className="space-y-1">
                 <span className="text-[10px] font-mono text-emerald-500/40 uppercase tracking-widest">Global Protocol</span>
                 <h3 className="text-3xl font-bricolage text-emerald-400">{t('status.rails')}</h3>
               </div>
            </div>
          </div>

          <div className="flex flex-col relative bg-black/40">
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/5 z-0" />
            {comparisons.map((row, i) => (
              <ComparisonRow key={i} row={row} index={i} t={t} />
            ))}
          </div>
        </motion.div>

        {/* Mobile View: Enhanced */}
        <div className="grid grid-cols-1 md:hidden gap-10">
          {[
            { type: 'bad', title: t('status.traditional'), color: 'red', icon: 'solar:history-bold' },
            { type: 'good', title: t('status.rails'), color: 'emerald', icon: 'solar:bolt-bold' }
          ].map((view, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className={`bg-${view.color}-500/[0.02] border border-${view.color}-500/10 rounded-[2rem] p-8 relative overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${view.color}-500/10 blur-[50px] rounded-full`}></div>
              <div className="flex items-center gap-4 mb-10">
                <div className={`w-14 h-14 rounded-2xl bg-${view.color}-500/10 flex items-center justify-center text-${view.color}-500`}>
                  {view.type === 'good' ? <RailsLogo className="w-8 h-8" /> : 
                  /* @ts-ignore */
                  <iconify-icon icon={view.icon} width="32"></iconify-icon>}
                </div>
                <h3 className={`text-2xl font-bricolage ${view.type === 'good' ? 'text-emerald-400' : 'text-white'}`}>{view.title}</h3>
              </div>
              <ul className="space-y-8 relative z-10">
                {comparisons.map((row, j) => (
                  <li key={j} className="flex gap-5">
                    <span className={`text-${view.color}-500/60 mt-1 flex-shrink-0 font-bold`}>{view.type === 'good' ? '✓' : '✖'}</span>
                    <div>
                      <h4 className="font-medium mb-1 text-white/90 text-lg">{(row as any)[view.type].title}</h4>
                      <p className="text-sm text-white/40 leading-relaxed">{(row as any)[view.type].desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}