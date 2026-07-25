import { CASE_STAGES } from '@/lib/utils';

/** stage is 1-based against CASE_STAGES; 0 renders a "not started" hint. */
export function CaseStatusStepper({ stage }: { stage: number }) {
  if (stage === 0) {
    return (
      <div className="no-print border-b border-hairline bg-paper-raised">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <p className="text-sm text-slate">
            No case started yet — the stepper appears once a case is
            submitted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="no-print border-b border-hairline bg-paper-raised">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-3 sm:px-6">
        {CASE_STAGES.map((label, i) => {
          const n = i + 1;
          const done = stage > n;
          const current = stage === n;
          const stepState = done ? 'complete' : current ? 'current' : 'upcoming';
          return (
            <div key={label} className="flex shrink-0 items-center gap-2">
              <div
                aria-label={`Step ${n}: ${label} — ${stepState}`}
                className={[
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold',
                  done
                    ? 'border-verified bg-verified text-paper'
                    : current
                      ? 'border-ink bg-ink text-paper'
                      : 'border-hairline text-slate',
                ].join(' ')}
              >
                {done ? '✓' : n}
              </div>
              <span
                className={[
                  'whitespace-nowrap text-sm font-medium',
                  current ? 'text-ink' : done ? 'text-verified' : 'text-slate',
                ].join(' ')}
              >
                {label}
              </span>
              {i !== CASE_STAGES.length - 1 && (
                <span className="mx-1 h-px w-8 shrink-0 bg-hairline" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
