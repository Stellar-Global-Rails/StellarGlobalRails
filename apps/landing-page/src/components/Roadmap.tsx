import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function Roadmap() {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start center", "end center"]
  });

  const lineHeight = useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]);

  return (
    <section id="roadmap" ref={container} className="py-32 bg-neutral-950 relative overflow-hidden border-t border-white/5 perspective-1000">
      <div className="absolute inset-0 z-0 opacity-[0.03] scale-150 rotate-12" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 2px, transparent 2px)', backgroundSize: '60px 60px' }}></div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <span className="text-emerald-500 font-mono text-xs uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20">
            {t('roadmap.badge')}
          </span>
          <h2 className="text-5xl md:text-7xl font-bricolage text-white mt-6 font-semibold tracking-tight">
            {t('roadmap.title')}
          </h2>
        </motion.div>
        
        <div className="relative roadmap-container pb-12">
          <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/5 -translate-x-1/2 hidden md:block"></div>
          
          <motion.div 
            style={{ height: lineHeight }}
            className="absolute left-1/2 top-0 w-[2px] bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 -translate-x-1/2 hidden md:block origin-top shadow-[0_0_10px_rgba(52,211,153,0.5)]"
          />

          <div className="flex flex-col md:flex-row items-center justify-between mb-32 md:mb-48 group relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 pr-0 md:pr-12 order-2 md:order-1 text-center md:text-right relative z-10 transition-transform duration-500 group-hover:-translate-x-4"
            >
              <h3 className="text-3xl text-white font-bricolage mb-3">{t('roadmap.s1.title')}</h3>
              <p className="text-white/50 text-lg font-light leading-relaxed">
                {t('roadmap.s1.desc')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-emerald-500 z-20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(52,211,153,0.3)] order-1 md:order-2 mb-6 md:mb-0 relative transition-transform duration-500 group-hover:scale-110"
            >
              <span className="font-mono text-sm tracking-widest">S1</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 pl-0 md:pl-12 order-3 relative z-10 transition-transform duration-500 group-hover:translate-x-4"
            >
              <span className="text-[120px] font-bricolage text-white/5 font-bold absolute -translate-y-[40%] select-none pointer-events-none group-hover:text-white/10 transition-colors duration-500">
                CORE
              </span>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between mb-32 md:mb-48 group relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 text-center md:text-right pr-0 md:pr-12 order-2 md:order-1 relative z-10 transition-transform duration-500 group-hover:-translate-x-4"
            >
              <span className="text-[120px] font-bricolage text-white/5 font-bold absolute right-6 md:right-12 -translate-y-[40%] select-none pointer-events-none hidden md:block group-hover:text-white/10 transition-colors duration-500">
                B2B 
              </span>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-blue-500 z-20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(59,130,246,0.3)] order-1 md:order-2 mb-6 md:mb-0 relative transition-transform duration-500 group-hover:scale-110"
            >
              <span className="font-mono text-sm tracking-widest">S3</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 pl-0 md:pl-12 order-3 text-center md:text-left relative z-10 transition-transform duration-500 group-hover:translate-x-4"
            >
              <h3 className="text-3xl text-white font-bricolage mb-3">{t('roadmap.s3.title')}</h3>
              <p className="text-white/50 text-lg font-light leading-relaxed">
                {t('roadmap.s3.desc')}
              </p>
            </motion.div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between group relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 pr-0 md:pr-12 order-2 md:order-1 text-center md:text-right relative z-10 transition-transform duration-500 group-hover:-translate-x-4"
            >
              <h3 className="text-3xl text-white font-bricolage mb-3">{t('roadmap.s5.title')}</h3>
              <p className="text-white/50 text-lg font-light leading-relaxed">
                {t('roadmap.s5.desc')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0, opacity: 0, rotate: -45 }}
              whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
              className="w-16 h-16 rounded-full bg-neutral-900 border-2 border-purple-500 z-20 flex items-center justify-center text-white shadow-[0_0_30px_rgba(168,85,247,0.3)] order-1 md:order-2 mb-6 md:mb-0 relative transition-transform duration-500 group-hover:scale-110"
            >
              <span className="font-mono text-sm tracking-widest flex items-center gap-1">S5</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full md:w-5/12 pl-0 md:pl-12 order-3 relative z-10 transition-transform duration-500 group-hover:translate-x-4"
            >
              <span className="text-[120px] font-bricolage text-white/5 font-bold absolute -translate-y-[40%] select-none pointer-events-none group-hover:text-white/10 transition-colors duration-500">
                LIVE
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}