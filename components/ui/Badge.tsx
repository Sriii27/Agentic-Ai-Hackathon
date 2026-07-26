import type { ReactNode } from 'react';

export type BadgeTone = 'verified' | 'amber' | 'ink' | 'slate';

const TONE_CLASSES: Record<BadgeTone, string> = {
  verified: 'bg-teal-50 text-teal-800 border border-teal-200',
  amber: 'bg-amber-50 text-amber-800 border border-amber-200',
  ink: 'bg-slate-900 text-white border border-slate-900',
  slate: 'bg-slate-100 text-slate-700 border border-slate-200',
};

export function Badge({
  children,
  tone = 'slate',
  className = '',
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const toneClass = TONE_CLASSES[tone] ?? TONE_CLASSES.slate;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide uppercase shadow-2xs ${toneClass} ${className}`}
    >
      {children}
    </span>
  );
}
