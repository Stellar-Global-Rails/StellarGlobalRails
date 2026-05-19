import { useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

function FlowStepCard({ step, index, setActiveIndex }: { key?: any, step: any, index: number, setActiveIndex: (i: number) => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  if (isInView) {
    setActiveIndex(index);
  }

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0.3, scale: 0.95 }}
      animate={{ 
        opacity: isInView ? 1 : 0.3, 
        scale: isInView ? 1 : 0.95,
      }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="p-8 md:p-12 rounded-3xl border border-white/10 bg-neutral-900/40 backdrop-blur-md transition-all duration-500"
    >
      <div className="text-[6rem] md:text-[8rem] font-bricolage font-bold text-white/5 absolute -top-12 -left-4 pointer-events-none select-none">
        {step.num}
      </div>
      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-[1px] mb-8 relative z-10`}>
        <div className="w-full h-full bg-neutral-900 rounded-2xl flex items-center justify-center">
           {/* @ts-ignore */}
          <iconify-icon icon={step.icon} width="28" class="text-white"></iconify-icon>
        </div>
      </div>
      <h3 className="text-3xl md:text-4xl font-bricolage font-medium mb-4 text-white relative z-10">{step.title}</h3>
      <p className="text-lg text-white/60 leading-relaxed font-light relative z-10">
        {step.desc}
      </p>
    </motion.div>
  );
}

export default function Flow() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      num: "01",
      title: t('flow.step1.title'),
      desc: t('flow.step1.desc'),
      icon: "solar:user-rounded-linear",
      color: "from-emerald-500 to-emerald-700"
    },
    {
      num: "02",
      title: t('flow.step2.title'),
      desc: t('flow.step2.desc'),
      icon: "solar:qr-code-linear",
      color: "from-blue-500 to-blue-700"
    },
    {
      num: "03",
      title: t('flow.step3.title'),
      desc: t('flow.step3.desc'),
      icon: "solar:bolt-linear",
      color: "from-purple-500 to-purple-700"
    },
    {
      num: "04",
      title: t('flow.step4.title'),
      desc: t('flow.step4.desc'),
      icon: "solar:card-send-linear",
      color: "from-amber-500 to-amber-700"
    }
  ];

  return (
    <section className="text-white bg-neutral-950 border-white/5 border-t relative">
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row relative">
          
          <div className="lg:w-1/2 relative">
            <div className="sticky top-0 h-screen flex flex-col justify-center py-20 pr-12">
              <span className="text-xs uppercase tracking-[0.3em] text-emerald-500 font-medium mb-4 block">
                {t('flow.badge')}
              </span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bricolage font-medium text-white mb-6 leading-tight tracking-tight">
                {t('flow.title.part1')} <span className="text-white/40 italic font-serif">{t('flow.title.part2')}</span>
              </h2>
              <p className="text-white/50 text-lg max-w-md font-light mb-16">
                {t('flow.desc')}
              </p>

              <div className="relative w-full aspect-square max-w-md bg-neutral-900/50 rounded-3xl border border-white/10 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)]"></div>
                
                {steps.map((step, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: activeIndex === i ? 1 : 0, 
                      scale: activeIndex === i ? 1 : 0.8 
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="absolute inset-0 flex flex-col items-center justify-center p-8"
                  >
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${step.color} opacity-20 blur-2xl absolute`}></div>
                    <div className="w-24 h-24 rounded-2xl bg-neutral-900 border border-white/20 flex items-center justify-center relative z-10 shadow-2xl skew-y-3 transform-gpu">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                         {/* @ts-ignore */}
                        <iconify-icon icon={step.icon} width="48" class="text-white"></iconify-icon>
                      </motion.div>
                    </div>
                    <div className="mt-8 text-center text-white/40 font-mono text-sm tracking-widest uppercase">
                      {t('flow.process_label')} {step.num}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 py-20 lg:py-[50vh]">
            <div className="flex flex-col gap-[30vh]">
              {steps.map((step, i) => (
                <FlowStepCard key={i} step={step} index={i} setActiveIndex={setActiveIndex} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}