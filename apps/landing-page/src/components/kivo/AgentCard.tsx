import { motion } from 'motion/react';
import SpotlightCard from '../ui/SpotlightCard';

interface AgentCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export default function AgentCard({ id, title, description, icon }: AgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <SpotlightCard className="p-8 h-full bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 transition-all duration-300 group rounded-2xl flex flex-col">
        {/* Icon */}
        <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
          {/* @ts-ignore */}
          <iconify-icon icon={icon} width="28" className="text-emerald-400"></iconify-icon>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
          {title}
        </h3>
        <p className="text-sm text-white/50 mb-4 flex-1 group-hover:text-white/60 transition-colors">
          {description}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-2 text-emerald-400/70 text-xs">
          {/* @ts-ignore */}
          <iconify-icon icon="solar:arrow-right-linear" width="14"></iconify-icon>
          <span>Learn More</span>
        </div>
      </SpotlightCard>
    </motion.div>
  );
}
