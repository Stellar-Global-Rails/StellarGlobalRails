import type { ReactNode } from 'react';

const variants: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  healthy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  ready: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  online: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  processing: 'bg-blue-500/10 text-blue-400 border-blue-500/25',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  delayed: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  degraded: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  failed: 'bg-red-500/10 text-red-400 border-red-500/25',
  suspended: 'bg-red-500/10 text-red-400 border-red-500/25',
  blocked: 'bg-red-500/10 text-red-400 border-red-500/25',
  offline: 'bg-red-500/10 text-red-400 border-red-500/25',
  future: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
  planned: 'bg-violet-500/10 text-violet-400 border-violet-500/25',
  paused: 'bg-white/5 text-neutral-300 border-white/10',
  neutral: 'bg-white/5 text-neutral-300 border-white/10',
};

interface BadgeProps {
  children: ReactNode;
  tone?: string;
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${variants[tone] ?? variants.neutral}`}>{children}</span>;
}
