import { Icon } from '@iconify/react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  icon?: string;
  action?: ReactNode;
}

export function PageHeader({ title, eyebrow, description, icon, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="text-[11px] uppercase tracking-[0.24em] text-emerald-400 font-bold">{eyebrow}</p>}
        <div className="mt-2 flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Icon icon={icon} className="text-xl" />
            </div>
          )}
          <h1 className="font-bricolage text-3xl font-bold text-white md:text-4xl">{title}</h1>
        </div>
        {description && <p className="mt-2 text-sm leading-6 text-neutral-400">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
