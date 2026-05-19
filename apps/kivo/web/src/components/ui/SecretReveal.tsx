import { Icon } from '@iconify/react';
import { CopyButton } from './CopyButton';

interface SecretRevealProps {
  label: string;
  value?: string;
  emptyText?: string;
}

export function SecretReveal({ label, value, emptyText = 'A chave raw aparece apenas uma vez.' }: SecretRevealProps) {
  return (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-emerald-400">
        <Icon icon="solar:key-minimalistic-bold" />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      {value ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <code className="break-all rounded-lg bg-black/40 px-3 py-2 text-xs text-emerald-200">{value}</code>
          <CopyButton value={value} />
        </div>
      ) : (
        <p className="text-sm text-neutral-500">{emptyText}</p>
      )}
    </div>
  );
}
