import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/Badge';
import { statusLabel } from '@/utils/format';

interface WorkspaceContextAction {
  to: string;
  label: string;
  icon?: string;
}

interface WorkspaceContextBannerProps {
  eyebrow: string;
  title: string;
  description: string;
  icon: string;
  tone?: string;
  checkpoints?: string[];
  primaryAction?: WorkspaceContextAction;
  secondaryAction?: WorkspaceContextAction;
}

export function WorkspaceContextBanner({
  eyebrow,
  title,
  description,
  icon,
  tone = 'active',
  checkpoints = [],
  primaryAction,
  secondaryAction,
}: WorkspaceContextBannerProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/10 via-neutral-900/80 to-cyan-500/5 p-5 premium-shadow">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-300">
            <Icon icon={icon} className="text-2xl" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-emerald-400">{eyebrow}</p>
              <Badge tone={tone}>{statusLabel(tone)}</Badge>
            </div>
            <h2 className="mt-2 font-bricolage text-2xl font-bold text-white">{title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-neutral-400">{description}</p>
            {checkpoints.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {checkpoints.map((checkpoint) => (
                  <span key={checkpoint} className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/25 px-2.5 py-1.5 text-[11px] font-medium text-neutral-300">
                    <Icon icon="solar:check-circle-bold" className="text-emerald-400" />
                    {checkpoint}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
            {primaryAction && (
              <Link to={primaryAction.to} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-black hover:bg-emerald-400">
                {primaryAction.label}
                <Icon icon={primaryAction.icon ?? 'solar:arrow-right-up-linear'} />
              </Link>
            )}
            {secondaryAction && (
              <Link to={secondaryAction.to} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white hover:bg-white/10">
                {secondaryAction.label}
                <Icon icon={secondaryAction.icon ?? 'solar:arrow-right-linear'} />
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
