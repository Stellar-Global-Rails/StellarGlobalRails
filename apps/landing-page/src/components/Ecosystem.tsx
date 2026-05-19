import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

export default function Ecosystem() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<'all' | 'consumer' | 'institucional'>('all');

  return (
    <section id="ecosystem" className="relative py-24 md:py-32 bg-neutral-950 text-white overflow-hidden selection:bg-emerald-500/30">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[600px] bg-emerald-900/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      ></motion.div>
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-0 w-[60vw] h-[600px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen"
      ></motion.div>

      <div className="md:px-12 z-10 w-full max-w-7xl mr-auto ml-auto pr-6 pl-6 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl relative gs-fade-up">
            <div className="absolute -left-4 md:-left-8 top-1 bottom-1 w-1 bg-gradient-to-b from-emerald-500 to-transparent opacity-50"></div>
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <motion.svg 
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="m9 12 2 2 4-4"></path>
              </motion.svg>
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-emerald-400/80">
                {t('ecosystem.tagline')}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bricolage font-medium tracking-tighter text-white leading-[0.9]">
              {t('ecosystem.title')}
              <span className="text-white/20 font-light italic font-serif">{t('ecosystem.highlight')}</span>
            </h2>
          </div>

          <div className="relative group gs-fade-up" data-delay="0.1">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center p-1.5 rounded-full bg-neutral-900/90 border border-white/10 backdrop-blur-xl shadow-2xl">
              {['all', 'consumer', 'institucional'].map((f) => (
                <motion.button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${filter === f ? 'text-neutral-950' : 'text-white/50 hover:text-white'}`}
                  whileHover={{ scale: filter === f ? 1 : 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {filter === f && (
                    <motion.div
                      layoutId="ecosystem-filter"
                      className="absolute inset-0 bg-white rounded-full z-0 shadow-lg shadow-white/5"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10 whitespace-nowrap">
                    {t(`ecosystem.filter.${f}`)}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px] transition-all duration-500">
          <AnimatePresence>
            {filter !== 'institucional' && (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(52, 211, 153, 0.15)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative md:col-span-8 md:row-span-2 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl origin-left cursor-pointer"
                onClick={() => window.location.href = '/modules/kivopay'}
              >
                <div className="absolute inset-0 z-0">
                  <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-1000 ease-out grayscale group-hover:grayscale-0" alt="Kivo Terminal" />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent"></div>
                </div>

                <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-mono text-white/80">{t('ecosystem.filter.consumer')}</span>
                    <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[10px] uppercase tracking-widest font-mono text-emerald-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                      {t('ecosystem.mobile_terminal')}
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20 overflow-hidden">
                  <div className="max-w-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 relative">
                    <h3 className="text-4xl md:text-6xl font-bricolage font-medium text-white mb-4 relative z-10 tracking-tight">{t('module.kivopay.name')}</h3>
                    <p className="text-white/70 text-lg font-light leading-relaxed mb-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 max-w-md">
                      {t('ecosystem.kivo.desc')}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={`md:row-span-2 flex flex-col gap-6 ${filter === 'institucional' ? 'md:col-span-12' : filter === 'consumer' ? 'md:col-span-4' : 'md:col-span-4'}`}>
            <AnimatePresence>
              {filter !== 'consumer' && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileHover={{ y: -8 }}
                  className="group relative flex-1 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl cursor-pointer"
                  onClick={() => window.location.href = '/modules/payouts'}
                >
                  <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all grayscale group-hover:grayscale-0" alt="Payouts" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span className="text-[10px] uppercase text-amber-400 tracking-widest font-mono">{t('ecosystem.b2b_b2g')}</span>
                    </div>
                    <h3 className="text-3xl font-bricolage font-medium text-white mb-2">{t('module.payouts.name')}</h3>
                    <p className="text-white/60 text-sm">{t('ecosystem.payouts.desc')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {filter !== 'institucional' && (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  whileHover={{ y: -8 }}
                  className="group relative flex-1 rounded-[2rem] overflow-hidden bg-neutral-900 border border-white/10 shadow-xl cursor-pointer"
                  onClick={() => window.location.href = '/modules/familybridge'}
                >
                  <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-all grayscale group-hover:grayscale-0" alt="FamilyBridge" />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span className="text-[10px] uppercase text-blue-400 tracking-widest font-mono">{t('ecosystem.p2p_global')}</span>
                    </div>
                    <h3 className="text-3xl font-bricolage font-medium text-white mb-2">{t('module.familybridge.name')}</h3>
                    <p className="text-white/60 text-sm">{t('ecosystem.familybridge.desc')}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}