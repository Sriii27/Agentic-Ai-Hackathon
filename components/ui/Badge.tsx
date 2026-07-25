import type { ReactNode } from 'react';

export type BadgeTone = 'verified' | 'amber' | 'ink' | 'slate';

const TONE_CLASSES: Record<BadgeTone, string> = {
  verified: 'bg-verified-tint text-verified ring-verified/25',
  amber: 'bg-amber-tint text-amber ring-amber/30',
  ink: 'bg-ink-tint text-ink ring-ink/15',
  slate: 'bg-paper text-slate ring-hairline',
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
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
