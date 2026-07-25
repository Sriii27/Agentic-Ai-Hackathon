import type { ReactNode } from 'react';
import { AppHeader } from './AppHeader';
import type { BadgeTone } from './ui/Badge';

export function CaseFileShell({
  role,
  roleTone,
  stepper,
  notification,
  timeline,
  right,
  children,
}: {
  role: string;
  roleTone: BadgeTone;
  stepper?: ReactNode;
  /** Optional banner rendered between the stepper and main grid (e.g. insurer decision alerts). */
  notification?: ReactNode;
  timeline: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <AppHeader role={role} tone={roleTone} />
      {stepper}
      {notification}
      <main className="case-file-main mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <p className="print-header mb-6 hidden font-mono text-xs uppercase tracking-[0.08em] text-slate">
          Care Mediator — Case Summary — {role} view
        </p>
        <div className="case-file-grid grid grid-cols-1 gap-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
          <aside className="no-print lg:sticky lg:top-6 lg:self-start">
            {timeline}
          </aside>
          <div className="min-w-0 space-y-6">{children}</div>
          <aside className="no-print space-y-6 lg:sticky lg:top-6 lg:self-start">
            {right}
          </aside>
        </div>
      </main>
    </div>
  );
}
