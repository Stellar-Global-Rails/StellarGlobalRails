import { Icon } from '@iconify/react';
import { motion } from 'motion/react';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  tone?: 'emerald' | 'amber' | 'red' | 'blue' | 'neutral' | 'violet';
  detail?: string;
}

const toneClasses = {
  emerald: 'bg-emerald-500/10 text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-400',
  red: 'bg-red-500/10 text-red-400',
  blue: 'bg-blue-500/10 text-blue-400',
  violet: 'bg-violet-500/10 text-violet-400',
  neutral: 'bg-white/5 text-neutral-300',
};

export function StatCard({ title, value, icon, tone = 'emerald', detail }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-neutral-900 p-5 hover:border-white/15 transition-colors"
    >
      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-neutral-500 font-bold">{title}</p>
          <p className="mt-2 font-bricolage text-3xl font-bold text-white">{value}</p>
          {detail && <p className="mt-1 text-xs text-neutral-500">{detail}</p>}
        </div>
        <div className={`rounded-xl p-3 ${toneClasses[tone]}`}>
          <Icon icon={icon} className="text-2xl" />
        </div>
      </div>
      <Icon icon={icon} className="absolute -bottom-5 -right-4 text-[7rem] text-white/[0.03]" />
    </motion.div>
  );
}
