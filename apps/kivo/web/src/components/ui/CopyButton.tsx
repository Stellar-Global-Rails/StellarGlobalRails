import { Icon } from '@iconify/react';
import { useState } from 'react';

interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({ value, label = 'Copiar' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white transition-colors"
    >
      <Icon icon={copied ? 'solar:check-circle-bold' : 'solar:copy-linear'} className={copied ? 'text-emerald-400' : ''} />
      {copied ? 'Copiado' : label}
    </button>
  );
}
