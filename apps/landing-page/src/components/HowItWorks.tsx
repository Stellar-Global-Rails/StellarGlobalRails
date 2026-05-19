import { motion, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';

function BlueprintGrid() {
  return (
    <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <div className="absolute inset-0" style={{ 
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />
      <motion.div 
        animate={{ 
          opacity: [0.05, 0.1, 0.05],
          scale: [1, 1.02, 1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)]" 
      />
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: t('howitworks.step1.title'),
      desc: t('howitworks.step1.desc'),
      icon: "solar:wallet-money-bold-duotone",
      color: "#3b82f6",
      tech: t('howitworks.step1.tech'),
      techDesc: t('howitworks.step1.tech_desc')
    },
    {
      id: 2,
      title: t('howitworks.step2.title'),
      desc: t('howitworks.step2.desc'),
      icon: "solar:cpu-bold-duotone",
      color: "#10b981",
      tech: t('howitworks.step2.tech'),
      techDesc: t('howitworks.step2.tech_desc')
    },
    {
      id: 3,
      title: t('howitworks.step3.title'),
      desc: t('howitworks.step3.desc'),
      icon: "solar:server-square-bold-duotone",
      color: "#a855f7",
      tech: t('howitworks.step3.tech'),
      techDesc: t('howitworks.step3.tech_desc')
    },
    {
      id: 4,
      title: t('howitworks.step4.title'),
      desc: t('howitworks.step4.desc'),
      icon: "solar:hand-money-bold-duotone",
      color: "#f97316",
      tech: t('howitworks.step4.tech'),
      techDesc: t('howitworks.step4.tech_desc')
    }
  ];

  return (
    <section ref={containerRef} className="bg-neutral-950 text-white relative border-t border-white/5 isolate">
      <BlueprintGrid />
      
      {/* Moving Ambient Orb */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-1/4 w-[60vw] h-[60vw] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-[90rem] mx-auto px-6 md:px-12 py-32 md:py-48 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
          
          {/* Left Column: Narrative Content */}
          <div className="space-y-[40vh] pb-[40vh]">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-xl"
            >
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono text-white/60 uppercase tracking-[0.2em]">{t('howitworks.sysarch')}</span>
              </div>
              <h2 className="text-4xl md:text-8xl font-bricolage font-medium mb-10 leading-[0.95] tracking-tighter">
                {t('howitworks.title')}
              </h2>
              <p className="text-white/40 text-xl md:text-2xl font-light leading-relaxed">
                {t('howitworks.subtitle')}
              </p>
            </motion.div>

            {steps.map((step, idx) => (
              <motion.div 
                key={step.id} 
                initial={{ opacity: 0.1, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20% 0px -20% 0px", amount: 0.5 }}
                onViewportEnter={() => setActiveStep(idx)}
                className="group relative"
              >
                <div className="absolute -left-12 top-0 bottom-0 w-px bg-white/5 overflow-hidden">
                   <AnimatePresence>
                     {activeStep === idx && (
                       <motion.div 
                         initial={{ y: "-100%" }}
                         animate={{ y: "100%" }}
                         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                         className="w-full h-20 bg-gradient-to-b from-transparent via-emerald-500 to-transparent"
                       />
                     )}
                   </AnimatePresence>
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <span className="text-5xl font-bricolage font-bold text-white/5 tabular-nums">0{step.id}</span>
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="font-mono text-[10px] text-white/20 tracking-[0.3em] uppercase">{step.tech}</span>
                </div>
                
                <h4 className="font-bricolage text-4xl md:text-6xl mb-8 text-white/90 group-hover:text-white transition-colors tracking-tight">
                  {step.title}
                </h4>
                
                <p className="text-xl md:text-2xl text-white/40 group-hover:text-white/60 transition-colors leading-relaxed font-light">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Holographic Terminal */}
          <div className="hidden lg:block relative h-full">
            <div className="sticky top-24 h-[calc(100vh-120px)] flex items-center justify-center">
              
              <div className="relative w-full max-w-[600px] aspect-square group">
                {/* 3D Container Effect */}
                <div className="absolute inset-0 rounded-[4rem] bg-neutral-900/40 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                  
                  {/* Dynamic Technical Overlay */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                  
                  {/* Animated Grid on the terminal */}
                  <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

                  {/* Terminal Frame Items */}
                  <div className="absolute top-10 left-10 z-20 flex gap-1.5">
                     {[...Array(3)].map((_, i) => <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />)}
                  </div>
                  <div className="absolute top-10 right-10 z-20 font-mono text-[10px] text-white/20">
                     SECURE_RAILS_V2.0
                  </div>

                  {/* Step Visualizers */}
                  <AnimatePresence mode="wait">
                    {steps.map((step, idx) => activeStep === idx && (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9, rotateX: 20 }}
                        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                        exit={{ opacity: 0, scale: 1.1, rotateX: -20 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-20"
                      >
                        {/* Glow Behind Icon */}
                        <div 
                          className="absolute w-80 h-80 rounded-full blur-[100px] opacity-20 animate-pulse"
                          style={{ backgroundColor: step.color }}
                        />

                        {/* Technical Circle */}
                        <div className="relative w-80 h-80 flex items-center justify-center">
                           <motion.div 
                             animate={{ rotate: 360 }}
                             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-0 border border-dashed border-white/10 rounded-full" 
                           />
                           <motion.div 
                             animate={{ rotate: -360 }}
                             transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-8 border border-dotted border-white/5 rounded-full" 
                           />
                           
                           {/* The Core Icon */}
                           <div className="relative z-20 w-48 h-48 rounded-[3rem] bg-black border-2 flex items-center justify-center shadow-2xl overflow-hidden" style={{ borderColor: `${step.color}40` }}>
                              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent" />
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                              >
                                 {/* @ts-ignore */}
                                 <iconify-icon icon={step.icon} width="96" style={{ color: step.color }}></iconify-icon>
                              </motion.div>
                           </div>
                        </div>

                        {/* Bottom Metadata */}
                        <div className="mt-12 text-center space-y-4">
                           <motion.div 
                             initial={{ opacity: 0, y: 10 }}
                             animate={{ opacity: 1, y: 0 }}
                             className="px-6 py-2 rounded-xl bg-white/[0.03] border border-white/5 backdrop-blur-xl"
                           >
                              <span className="font-mono text-sm tracking-[0.2em] uppercase" style={{ color: step.color }}>
                                {step.tech}
                              </span>
                           </motion.div>
                           <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest max-w-[200px]">
                              {step.techDesc}
                           </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Progress Line on the terminal border */}
                  <div className="absolute inset-x-12 bottom-10 h-[1px] bg-white/5">
                     <motion.div 
                       animate={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
                       className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]"
                     />
                  </div>
                </div>

                {/* Ambient Shadow/Glow */}
                <div className="absolute -inset-10 bg-emerald-500/5 blur-[80px] rounded-full -z-10 opacity-50" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}