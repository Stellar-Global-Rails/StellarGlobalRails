import { motion } from 'motion/react';
import { useTranslation } from '../hooks/useTranslation';

const builderIcons = [
  "solar:code-square-linear",
  "solar:document-text-linear",
  "solar:chat-round-dots-linear",
  "solar:box-linear",
  "solar:bell-linear",
  "solar:cloud-check-linear"
];

export default function BuiltForBuilders() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-black text-white relative overflow-hidden border-t border-white/5">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ 
        backgroundImage: `linear-gradient(to right, #ffffff10 1px, transparent 1px), linear-gradient(to bottom, #ffffff10 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-emerald-500 font-mono text-sm uppercase tracking-[0.3em] mb-4 block"
          >
            {t('builders.badge')}
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-bricolage font-medium mb-6 leading-[0.9] tracking-tight"
          >
            {t('builders.title.part1')}
            <span className="block text-white/30">{t('builders.title.part2')}</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: t('builders.card1.title'), desc: t('builders.card1.desc') },
            { title: t('builders.card2.title'), desc: t('builders.card2.desc') },
            { title: t('builders.card3.title'), desc: t('builders.card3.desc') },
            { title: t('builders.card4.title'), desc: t('builders.card4.desc') },
            { title: t('builders.card5.title'), desc: t('builders.card5.desc') },
            { title: t('builders.card6.title'), desc: t('builders.card6.desc') }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, borderColor: 'rgba(16,185,129,0.3)' }}
              className="bg-neutral-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-neutral-900 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-emerald-500/10 transition-colors">
                {/* @ts-ignore */}
                <iconify-icon icon={builderIcons[i]} width="24" className="text-white/50 group-hover:text-emerald-400 transition-colors"></iconify-icon>
              </div>
              <h4 className="text-xl font-bricolage font-medium text-white mb-2">{item.title}</h4>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}