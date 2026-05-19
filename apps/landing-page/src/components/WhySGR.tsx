import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import SpotlightCard from './ui/SpotlightCard';

export default function WhySGR() {
  const { t } = useTranslation();

  const pillars = [
    {
      id: 'SocialPay',
      title: t('whysgr.p1.title'),
      desc: t('whysgr.p1.desc'),
      icon: 'solar:users-group-rounded-bold-duotone',
      color: '#EC4899',
      label: 'Identity Protocol',
      tech: 'DID_LAYER'
    },
    {
      id: 'ContractEase',
      title: t('whysgr.p2.title'),
      desc: t('whysgr.p2.desc'),
      icon: 'solar:document-text-bold-duotone',
      color: '#8B5CF6',
      label: 'Compliance Rules',
      tech: 'SMART_LOGIC'
    },
    {
      id: 'KivoPay',
      title: t('whysgr.p3.title'),
      desc: t('whysgr.p3.desc'),
      icon: 'solar:flash-drive-bold-duotone',
      color: '#10B981',
      label: 'Instant Execution',
      tech: 'ATOMIC_SWAP'
    }
  ];

  return (
    <section id="why-sgr" className="py-48 bg-neutral-950 relative">
      {/* 3D Perspective Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ 
        backgroundImage: `perspective(1000px) rotateX(60deg) linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), perspective(1000px) rotateX(60deg) linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        transformOrigin: 'top'
      }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-500 font-mono text-[10px] uppercase tracking-[0.4em]">Core Foundations</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl font-bricolage font-medium text-white mb-10 tracking-tighter leading-[0.85]"
          >
            {t('whysgr.title')}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-2xl text-white/30 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {t('whysgr.subtitle')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <SpotlightCard 
                className="group relative p-12 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all duration-700 h-full flex flex-col"
              >
                {/* Product Logo / Icon Projector Effect */}
                <div className="relative mb-12">
                   <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full scale-150 group-hover:scale-200 transition-transform duration-700 opacity-0 group-hover:opacity-20" style={{ backgroundColor: pillar.color }} />
                   <div 
                     className="w-20 h-20 rounded-3xl flex items-center justify-center relative z-10 shadow-2xl transition-all duration-500 group-hover:translate-y-[-10px] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                     style={{ backgroundColor: `${pillar.color}15`, color: pillar.color, border: `1px solid ${pillar.color}30` }}
                   >
                     {/* @ts-ignore */}
                     <iconify-icon icon={pillar.icon} width="40"></iconify-icon>
                   </div>
                   {/* Technical Scanline across icon */}
                   <div className="absolute top-0 left-0 right-0 h-px bg-white/20 -translate-y-10 group-hover:translate-y-20 transition-all duration-1000 opacity-0 group-hover:opacity-100" />
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 mb-3 block font-mono font-bold">
                      {pillar.label}
                    </span>
                    <h3 className="text-4xl font-bricolage font-medium text-white/90 group-hover:text-white transition-colors leading-tight">
                      {pillar.title}
                    </h3>
                  </div>
                  
                  <p className="text-white/30 leading-relaxed text-lg font-light group-hover:text-white/50 transition-colors">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
                   <div className="font-mono text-[9px] text-white/10 tracking-widest uppercase">
                      TECH_STK: {pillar.tech}
                   </div>
                   <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest transition-all duration-300 group-hover:gap-5" style={{ color: pillar.color }}>
                     <span>{t('suite.explore_product')}</span>
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                     </svg>
                   </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
