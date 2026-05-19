import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return <div className={`rounded-2xl border border-white/5 bg-neutral-900/80 p-5 premium-shadow ${className}`}>{children}</div>;
}
