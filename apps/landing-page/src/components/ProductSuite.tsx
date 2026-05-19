import { productsData } from '../data/content';
import type { Product } from '../data/content';
import { motion, useScroll, useTransform, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import SpotlightCard from './ui/SpotlightCard';

function FeaturePill({ feature, delay, productId }: { feature: Product['features'][0]; delay: number; productId: string }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="group"
    >
      <SpotlightCard 
        href={`/products/${productId}#${feature.id}`} 
        className="flex items-center gap-5 p-6 rounded-[1.5rem] bg-white/[0.01] border border-white/5 hover:border-white/10 hover:bg-white/[0.03] transition-all duration-500 group overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] -translate-x-[-50%] -translate-y-[50%] blur-2xl group-hover:bg-white/[0.05] transition-colors" />
        <div className="w-12 h-12 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300">
          {/* @ts-ignore */}
          <iconify-icon icon={feature.icon} width="24" class="text-white/60 group-hover:text-white transition-colors"></iconify-icon>
        </div>
        <div className="flex-1">
          <h5 className="text-white font-medium text-base mb-1 group-hover:text-emerald-400 transition-colors">{t(`product.${productId}.feature.${feature.id}.name`)}</h5>
          <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/50 transition-colors">{t(`product.${productId}.feature.${feature.id}.desc`)}</p>
        </div>
        <div className="font-mono text-[9px] text-white/10 uppercase tracking-widest self-end pb-1">
          {feature.originModule}
        </div>
      </SpotlightCard>
    </motion.div>
  );
}

function AIAgentCard({ agent, delay, color, productId }: { agent: Product['aiAgents'][0]; delay: number; color: string; productId: string }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div className="relative p-5 rounded-2xl bg-neutral-900/40 border border-white/5 group-hover:border-white/10 transition-all duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 opacity-20" style={{ backgroundColor: color }} />
        <div className="flex items-start justify-between mb-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                {/* @ts-ignore */}
                <iconify-icon icon={agent.icon} width="18" style={{ color }}></iconify-icon>
             </div>
             <span className="text-white/80 text-sm font-medium uppercase tracking-wider">{t(`product.${productId}.agent.${agent.id}.title`)}</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
        </div>
        <p className="text-white/30 text-xs leading-relaxed group-hover:text-white/50 transition-colors">{t(`product.${productId}.agent.${agent.id}.desc`)}</p>
        
        {/* Tech decorative numbers */}
        <div className="absolute bottom-2 right-3 font-mono text-[8px] text-white/5">
           AGENT_NODE_{Math.floor(Math.random() * 1000)}
        </div>
      </div>
    </motion.div>
  );
}

function ProductSection({ product, index }: { product: Product; index: number }) {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const isReversed = index % 2 !== 0;

  return (
    <motion.div
      ref={sectionRef}
      className="relative py-32 md:py-48"
    >
      {/* Background Section Ambient Glow */}
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[250px] pointer-events-none opacity-[0.03]"
        style={{ 
          backgroundColor: product.color,
          [isReversed ? 'left' : 'right']: '-300px'
        }}
      ></div>

      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 ${isReversed ? 'lg:flex-row-reverse' : ''}`}>
          
          {/* Info column */}
          <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'}`}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl border flex items-center justify-center shadow-lg"
                  style={{ backgroundColor: `${product.color}10`, borderColor: `${product.color}30`, color: product.color }}
                >
                  {/* @ts-ignore */}
                  <iconify-icon icon={product.icon} width="28"></iconify-icon>
                </div>
                <div className="space-y-1">
                   <h4 className="text-white/40 text-xs font-mono uppercase tracking-[0.3em]">{t('suite.product')} {index + 1}</h4>
                   <h3 className="text-3xl font-bricolage font-semibold text-white tracking-tight">{t(`product.${product.id}.name`)}</h3>
                </div>
              </div>

              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bricolage font-medium text-white leading-[0.9] tracking-tighter">
                {t(`suite.${product.id}.tagline`)}
              </h2>

              <p className="text-white/40 text-xl md:text-2xl font-light leading-relaxed max-w-xl">
                {t(`suite.${product.id}.desc`)}
              </p>

              <div className="flex flex-wrap gap-3">
                 {product.differentials.map((diff, i) => (
                    <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-[11px] text-white/50 uppercase tracking-widest font-mono">
                       <div className="w-1 h-1 rounded-full" style={{ backgroundColor: product.color }} />
                       {t(`product.${product.id}.diff.${i}`)}
                    </div>
                 ))}
              </div>

              <div className="pt-6">
                <motion.a
                  href={product.path}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-4 px-10 py-5 rounded-[1.5rem] font-bold text-black transition-all duration-500 shadow-xl"
                  style={{ backgroundColor: product.color }}
                >
                  <span className="uppercase tracking-widest text-xs">{t('suite.explore_product')}</span>
                  {/* @ts-ignore */}
                  <iconify-icon icon="solar:arrow-right-bold" width="20"></iconify-icon>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Features column */}
          <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} relative`}>
            <div className="lg:sticky lg:top-32 h-fit">
            {/* Background Decorative Frame */}
            <div className="absolute -inset-10 border border-white/[0.03] rounded-[4rem] -z-10 pointer-events-none" />
            <div className="absolute -top-20 -right-10 font-mono text-[80px] text-white/[0.02] font-bold pointer-events-none uppercase">
               {product.id}
            </div>

            <div className="space-y-6">
              {product.features.map((feature, i) => (
                <FeaturePill key={feature.id} feature={feature} delay={0.2 + i * 0.1} productId={product.id} />
              ))}
            </div>

            {/* AI Agents Section: Enhanced */}
            {product.aiAgents.length > 0 && (
              <div className="mt-12">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold">{t('suite.ai_agents')}</span>
                  <div className="h-px w-8 bg-white/5" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.aiAgents.map((agent, i) => (
                    <AIAgentCard key={agent.id} agent={agent} delay={0.4 + i * 0.1} color={product.color} productId={product.id} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </motion.div>
  );
}

export default function ProductSuite() {
  const { t } = useTranslation();

  return (
    <section id="products" className="bg-neutral-950 relative border-t border-white/5">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />

      {/* Section header */}
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 pt-48 pb-12 relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-[2px] w-12 bg-emerald-500 shadow-[0_0_10px_#10b981]"></div>
            <span className="text-emerald-500 font-bold tracking-[0.4em] uppercase text-xs">{t('suite.badge')}</span>
          </div>
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bricolage font-medium text-white leading-[0.8] tracking-tighter">
            {t('suite.title')}
          </h2>
          <p className="text-white/40 text-2xl md:text-3xl font-light max-w-4xl leading-relaxed">
            {t('suite.subtitle')}
          </p>
        </motion.div>
      </div>

      {/* Product sections */}
      <div className="divide-y divide-white/5">
        {productsData.map((product, idx) => (
          <ProductSection key={product.id} product={product} index={idx} />
        ))}
      </div>

      {/* Closing banner: ONYX Compliance - Reimagined as a Vault */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full max-w-[90rem] mx-auto px-6 md:px-12 py-32"
      >
        <div className="relative rounded-[3rem] border border-amber-500/10 bg-gradient-to-br from-amber-500/[0.03] to-transparent backdrop-blur-2xl p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden group">
          
          {/* Vault Background Decor */}
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[150px] bg-amber-500/5 pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
          <div className="absolute -bottom-10 -left-10 font-mono text-[120px] text-white/[0.01] font-bold pointer-events-none">ONYX</div>

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10 text-center md:text-left">
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
              {/* @ts-ignore */}
              <iconify-icon icon="lucide:shield-check" width="48"></iconify-icon>
            </div>
            <div>
              <h4 className="text-white font-bricolage font-medium text-4xl mb-4 tracking-tight">{t('suite.onyx.title')}</h4>
              <p className="text-white/40 text-lg max-w-2xl font-light leading-relaxed">{t('suite.onyx.desc')}</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 shrink-0 relative z-10">
             <div className="px-8 py-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-amber-500 text-sm font-bold tracking-[0.2em] uppercase shadow-lg">
                {t('suite.onyx.badge')}
             </div>
             <span className="font-mono text-[10px] text-white/20">VERIFIED_PROTOCOL_ID: 0x8A2C</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
