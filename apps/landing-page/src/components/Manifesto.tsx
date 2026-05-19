import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import { RailsLogo } from './ui/Logo';

export default function Manifesto() {
  const { t } = useTranslation();

  return (
    <section className="py-48 bg-neutral-950 text-white relative overflow-hidden border-t border-white/5">
      {/* Deep Space Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.15)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      </div>

      {/* The Rail Termination Point */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-emerald-500 to-transparent opacity-50" />
      
      <div className="max-w-5xl mx-auto px-6 md:px-12 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 flex justify-center"
        >
          <div className="relative group">
            <div className="absolute -inset-10 bg-emerald-500/10 blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <RailsLogo className="w-24 h-24 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity duration-1000" />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 space-y-6"
        >
          <span className="text-emerald-500 font-mono text-xs uppercase tracking-[0.5em] mb-4 block">{t('manifesto.mission')}</span>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bricolage font-medium leading-[0.85] tracking-tighter">
            {t('manifesto.title')}
          </h2>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white/40 text-xl md:text-2xl leading-relaxed font-light mb-20 max-w-3xl mx-auto"
        >
          {t('manifesto.desc')}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.a 
            href="/investidores" 
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white text-black rounded-2xl font-bold uppercase tracking-widest text-xs transition-all"
          >
            {t('manifesto.cta_investors')}
          </motion.a>
          
          <motion.a 
            href="#products" 
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-2xl font-bold uppercase tracking-widest text-xs backdrop-blur-md transition-all"
          >
            {t('manifesto.cta_modules')}
          </motion.a>
        </motion.div>

        {/* Final signature decoration */}
        <div className="mt-40 pt-10 border-t border-white/5">
           <p className="font-mono text-[10px] text-white/10 tracking-[0.6em] uppercase">
             Stellar Global Rails — Built for the Next Century of Finance
           </p>
        </div>
      </div>
    </section>
  );
}