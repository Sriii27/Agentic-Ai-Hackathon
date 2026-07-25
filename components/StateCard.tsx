import type { ReactNode } from 'react';

export function StateCard({
  tone = 'slate',
  title,
  description,
  action,
}: {
  tone?: 'slate' | 'amber';
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg border border-dashed p-8 text-center ${
        tone === 'amber' ? 'border-amber/40 bg-amber-tint' : 'border-hairline bg-paper-raised'
      }`}
    >
      <p className={`text-base font-semibold ${tone === 'amber' ? 'text-amber' : 'text-ink'}`}>
        {title}
      </p>
      {description && (
        <p className="mx-auto mt-3 max-w-md text-sm text-slate">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
