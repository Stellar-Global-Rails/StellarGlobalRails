import { productsData } from '../data/content';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, MotionValue } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';
import KivoShowcase from './kivo/KivoShowcase';
import KivoSimulator from './kivo/KivoSimulator';
import KivoSplit from './kivo/KivoSplit';
import KivoOffRamp from './kivo/KivoOffRamp';
import KivoSandbox from './kivo/KivoSandbox';
import KivoEcosystem from './kivo/KivoEcosystem';
import KivoInvoiceSimulator from './kivo/KivoInvoiceSimulator';
import KivoPayoutsSimulator from './kivo/KivoPayoutsSimulator';
import KivoSafeCheckoutSimulator from './kivo/KivoSafeCheckoutSimulator';
import KivoVakinhaSimulator from './kivo/KivoVakinhaSimulator';
import KivoFamilyBridgeSimulator from './kivo/KivoFamilyBridgeSimulator';
import KivoQuiloVoltSimulator from './kivo/KivoQuiloVoltSimulator';
import KivoContractEaseSimulator from './kivo/KivoContractEaseSimulator';
import KivoOnyxSimulator from './kivo/KivoOnyxSimulator';
import KivoKonamiCode from './kivo/KivoKonamiCode';
import KivoTerminalCLI from './kivo/KivoTerminalCLI';
import KivoVoiceCommand from './kivo/KivoVoiceCommand';
import KivoExitIntent from './kivo/KivoExitIntent';
import KivoCommandPalette from './kivo/KivoCommandPalette';
import KivoSaude360Simulator from './kivo/KivoSaude360Simulator';
import KivoSocialPaySimulator from './kivo/KivoSocialPaySimulator';

interface Props {
  slug?: string;
}

function StepCard({ step, idx, total, scrollYProgress }: { step: string, idx: number, total: number, scrollYProgress: MotionValue<number> }) {
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
      <div 
        className="group relative rounded-3xl bg-neutral-900/50 p-8 md:p-10 flex flex-col gap-6 transition-colors duration-500 h-full overflow-hidden block shadow-2xl"
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
          className="w-16 h-16 rounded-2xl border border-white/10 flex items-center justify-center relative z-10 shadow-lg font-bricolage font-bold text-2xl"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {idx + 1}
        </motion.div>
        
        <div className="relative z-10 mt-2 flex-grow">
          <h4 className="text-xl md:text-2xl text-white font-bricolage font-medium mb-4">
            {t('product.step')} {idx + 1}
          </h4>
          <p className="text-base md:text-lg text-white/50 leading-relaxed font-light">{step}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function ProductPage({ slug = '' }: Props) {
  const { t } = useTranslation();
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

  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  const xTransform = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  
  const { scrollYProgress: docScroll } = useScroll();
  const backgroundY = useTransform(docScroll, [0, 1], ["0%", "30%"]);
  
  const cleanPath = slug?.replace(/\/$/, '') || '';
  const currentPath = '/' + cleanPath;
  
  const productData = productsData.find(prod => prod.path === currentPath || prod.path === '/' + cleanPath);

  const isDev = profile === 'dev';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPath]);

  if (!productData) {
    return (
      <div className="pt-32 pb-32 text-center">
        <h1 className="text-4xl text-white mb-4">{t('product.not_found')}</h1>
        <a href="/" className="text-emerald-500 hover:underline">{t('product.back_to_home')}</a>
      </div>
    );
  }

  const isKivoCore = productData.id === 'kivopay';
  
  const heroTitle = isDev 
    ? (isKivoCore 
        ? `${t('product.dev.hero_title_kivo')} ${productData.name}`
        : `${t('product.dev.hero_title_other')} ${productData.name}`)
    : t(`product.${productData.id}.hero_title`) || productData.hero.title || '';

  const heroSubtitle = isDev 
    ? (isKivoCore ? t('product.dev.hero_subtitle_kivo') : (t(`product.${productData.id}.tech_desc`) || productData.techDetails?.description || productData.hero.subtitle)) 
    : t(`product.${productData.id}.hero_subtitle`) || productData.hero.subtitle;
    
  const problemTitle = isDev ? t('product.dev.problem_title') : t(`product.${productData.id}.problem_title`) || productData.problem.title;
  const solutionTitle = isDev ? t('product.dev.solution_title') : t(`product.${productData.id}.solution_title`) || productData.solution.title;
  const solutionDesc = isDev 
    ? (isKivoCore ? t('product.dev.solution_desc_kivo') : (productData.techDetails?.points.join(' • ') || productData.solution.description)) 
    : t(`product.${productData.id}.solution_desc`) || productData.solution.description;

  const steps = productData.steps.map((s, i) => t(`product.${productData.id}.step_${i}`) || s) || [];
  const problemItems = productData.problem.items.map((item, i) => t(`product.${productData.id}.problem_item_${i}`) || item) || [];
  const forWhomItems = productData.forWhom?.map((item, i) => t(`product.${productData.id}.for_whom_${i}`) || item) || [];
  const benefitsItems = productData.benefits?.map((ben, i) => ({
    ...ben,
    title: t(`product.${productData.id}.benefit_${i}_title`) || ben.title,
    description: t(`product.${productData.id}.benefit_${i}_desc`) || ben.description
  })) || [];
  const techPoints = productData.techDetails?.points.map((p, i) => t(`product.${productData.id}.tech_point_${i}`) || p) || [];
  const faqItems = productData.faq?.map((f, i) => ({
    question: t(`product.${productData.id}.faq_${i}_q`) || f.question,
    answer: t(`product.${productData.id}.faq_${i}_a`) || f.answer
  })) || [];

  return (
    <div className="pt-24 pb-24 relative z-0">
      <KivoCommandPalette />
      <KivoKonamiCode />
      <KivoVoiceCommand />
      <KivoExitIntent />
      
      <div className="fixed inset-0 z-[-2] bg-neutral-950 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] blur-[140px] rounded-full mix-blend-screen"
          style={{ backgroundColor: `${productData.color}40` }}
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] blur-[150px] rounded-full mix-blend-screen"
          style={{ backgroundColor: `${productData.color}20` }}
        ></motion.div>
      </div>
      
      <motion.div 
        style={{ y: backgroundY }}
        className="fixed inset-0 z-[-1] pointer-events-none"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </motion.div>
      
      <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <a href="/#products" className="inline-flex items-center text-sm text-white/40 hover:text-white mb-8 transition-colors">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('product.back_to_products')}
        </a>
        <div className="flex items-center gap-4 mb-6">
          <div 
            className="w-12 h-12 rounded-xl border flex items-center justify-center"
            style={{ backgroundColor: `${productData.color}15`, borderColor: `${productData.color}30`, color: productData.color }}
          >
            {/* @ts-ignore */}
            <iconify-icon icon={productData.icon} width="24"></iconify-icon>
          </div>
          <span className="font-mono text-sm uppercase tracking-widest" style={{ color: productData.color }}>{t(`product.${productData.id}.tagline`) || productData.tagline}</span>
        </div>
        <h1 className="text-fluid-h1 font-bricolage font-medium text-white mb-6 leading-tight">
          {heroTitle}
        </h1>
        <p className="text-xl text-white/50 mb-10 max-w-3xl leading-relaxed font-light">
          {heroSubtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button className="px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-colors">
            {t(`product.${productData.id}.cta_0`) || productData.hero.ctas[0]}
          </button>
          <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-medium hover:bg-white/10 transition-colors">
            {t(`product.${productData.id}.cta_1`) || productData.hero.ctas[1]}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {productData.features.map((feature, i) => (
            <div 
              key={feature.id}
              id={feature.id}
              className="group p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-white/20 transition-all duration-500"
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-colors"
                style={{ backgroundColor: `${productData.color}10`, color: productData.color }}
              >
                {/* @ts-ignore */}
                <iconify-icon icon={feature.icon} width="24"></iconify-icon>
              </div>
              <h4 className="text-xl text-white font-medium mb-3">
                {t(`product.${productData.id}.feature${i+1}`).split('(')[0]}
              </h4>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                {t(`product.${productData.id}.feature${i+1}`).split('(')[1]?.replace(')', '') || feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="problem" className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 md:p-12 transition-all duration-500">
          <h3 className="text-2xl md:text-3xl font-bricolage font-medium text-white mb-8">
            {problemTitle || ''}
          </h3>
          <ul className="space-y-4">
            {problemItems.map((item, idx) => (
              <li key={idx} className="flex items-start text-white/70">
                <span className="text-red-500 mr-4 font-bold text-lg mt-0.5">×</span>
                <span className="text-lg leading-relaxed">{isDev ? `Error 504 (Timeout): ${item}` : item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="solution" className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden transition-all duration-500">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center text-emerald-500 text-sm font-bold tracking-widest uppercase mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              {isDev ? t('product.dev.solution_tech') : t('product.how_it_works')}
            </div>
            <h3 className="text-3xl md:text-4xl font-bricolage font-medium text-white mb-6">
              {solutionTitle || ''}
            </h3>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl mb-8">
              {solutionDesc}
            </p>

            <AnimatePresence>
              {isDev && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-black/50 border border-emerald-500/20 rounded-xl p-6 font-mono text-sm text-emerald-400 overflow-hidden"
                >
                  <pre><code>
{`// Example integration ${productData.id}
import { KivoClient } from '@kivopay/sdk';

const kivo = new KivoClient(process.env.KIVO_API_KEY);

const response = await kivo.${productData.id}.init({
  environment: "production",
  apiKey: "sk_live_..."
});

console.log(response.status); // "READY" - 3s latency`}
                  </code></pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      
      {/* Integrated Features Section */}
      <section id="features" className="py-24 bg-neutral-950 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 gs-fade-up">
            <span className="text-sm font-mono uppercase tracking-[0.3em] mb-4 block" style={{ color: productData.color }}>
              {t('product.integrated_features')}
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bricolage font-medium text-white">
              {t('product.capabilities_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productData.features.map((feature, i) => (
              <motion.div
                key={feature.id}
                id={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500"
              >
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                  style={{ backgroundColor: `${productData.color}10`, color: productData.color, border: `1px solid ${productData.color}20` }}
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon={feature.icon} width="28"></iconify-icon>
                </div>
                <h4 className="text-2xl font-bricolage font-medium text-white mb-3">{feature.name}</h4>
                <p className="text-white/40 leading-relaxed mb-6">
                  {feature.description}
                </p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-widest text-white/20">Powering by</span>
                  <span className="text-[11px] font-mono text-emerald-500/50 uppercase tracking-widest">{feature.originModule}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" ref={targetRef} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden py-16">
          <h3 className="text-fluid-h3 font-bricolage font-medium text-white mb-16 text-center px-6">
            {t('product.how_it_works')}
          </h3>
          <div className="w-full overflow-hidden border-t border-white/5 pt-16 mt-8">
            <motion.div style={{ x: xTransform }} className="flex gap-16 md:gap-24 px-6 md:px-[20vw] w-max items-center h-[550px]">
              {steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  step={step}
                  idx={idx}
                  total={steps.length}
                  scrollYProgress={scrollYProgress}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {forWhomItems.length > 0 && (
        <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bricolage text-white">{t('product.for_whom')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forWhomItems.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white/80">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {benefitsItems.length > 0 && (
        <section id="benefits" className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bricolage text-white">{t('product.benefits')}</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefitsItems.map((ben, idx) => (
              <div key={idx} className="bg-neutral-900/50 border border-white/10 p-8 rounded-3xl hover:bg-white/5 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-6">
                  {/* @ts-ignore */}
                  <iconify-icon icon={ben.icon} width="24"></iconify-icon>
                </div>
                <h4 className="text-xl font-medium text-white mb-4">{ben.title}</h4>
                <p className="text-white/60 leading-relaxed">{ben.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {productData.techDetails && (
        <section className="px-6 max-w-5xl mx-auto mb-20 gs-fade-up">
          <div className="bg-black/50 border border-emerald-500/20 p-8 md:p-12 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-1/2 h-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
             <div className="relative z-10 flex flex-col md:flex-row gap-12">
                <div className="md:w-1/3">
                  <h3 className="text-2xl font-bricolage text-emerald-400 mb-4">{t('product.under_the_hood')}</h3>
                  <p className="text-white/70">{t(`product.${productData.id}.tech_desc`) || productData.techDetails.description}</p>
                </div>
                <div className="md:w-2/3">
                  <ul className="space-y-4">
                    {techPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                        </div>
                        <span className="text-white/80 font-mono text-sm">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
             </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="px-6 max-w-3xl mx-auto mb-32 gs-fade-up">
           <div className="text-center mb-12">
            <h3 className="text-3xl font-bricolage text-white">{t('product.faq')}</h3>
          </div>
          <div className="space-y-4">
            {faqItems.map((q, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h4 className="text-lg font-medium text-white mb-2">{q.question}</h4>
                <p className="text-white/60">{q.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="px-6 max-w-5xl mx-auto text-center gs-fade-up">
        <button 
          className="px-10 py-5 text-black rounded-full font-medium text-lg transition-colors shadow-2xl"
          style={{ backgroundColor: productData.color }}
        >
          {t(`product.${productData.id}.final_cta`) || productData.finalCta}
        </button>
      </section>

      {productData.id === 'kivopay' && (
        <>
          <KivoShowcase />
          <KivoEcosystem />
          <KivoSimulator />
          <KivoSplit />
          <KivoOffRamp />
          <KivoSandbox />
          <KivoInvoiceSimulator />
          <KivoPayoutsSimulator />
          <KivoFamilyBridgeSimulator />
          <KivoQuiloVoltSimulator />
          <div className="px-6 max-w-3xl mx-auto mb-32 gs-fade-up">
             <div className="text-center mb-8">
               <h2 className="text-2xl font-bricolage text-white">Kivo CLI Simulado</h2>
               <p className="text-white/50 text-sm">Controle a infraestrutura direto do terminal</p>
             </div>
             <KivoTerminalCLI />
          </div>
          <KivoOnyxSimulator />
        </>
      )}

      {productData.id === 'socialpay' && (
        <>
          <KivoSocialPaySimulator />
          <KivoSaude360Simulator />
          <KivoVakinhaSimulator />
        </>
      )}

      {productData.id === 'contractease' && (
        <>
          <KivoContractEaseSimulator />
          <KivoSafeCheckoutSimulator />
        </>
      )}
    </div>
  );
}