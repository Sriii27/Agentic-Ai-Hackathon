'use client';

import { useCase } from '@/lib/case-context';

const CASE_LABELS: Record<string, string> = {
  'clean-case': 'Clean case (smooth approval)',
  'gotcha-case': 'Gotcha case (gap + flags)',
};

export function DevCaseSwitcher() {
  const { caseId, setCaseId, availableCaseIds, loading } = useCase();

  return (
    <div className="no-print fixed bottom-4 right-4 z-40 flex items-center gap-3 rounded-lg border border-dashed border-amber bg-amber-tint px-4 py-3">
      <span className="rounded-sm bg-amber px-2 py-1 font-mono text-xs font-bold uppercase tracking-[0.08em] text-paper">
        Dev
      </span>
      <label className="flex items-center gap-2 text-sm font-medium text-amber">
        Demo case:
        <select
          value={caseId}
          onChange={(e) => setCaseId(e.target.value)}
          className="rounded-md border border-amber/50 bg-paper-raised px-3 py-2 font-mono text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber"
        >
          {availableCaseIds.map((id) => (
            <option key={id} value={id}>
              {CASE_LABELS[id] ?? id}
            </option>
          ))}
        </select>
      </label>
      {loading && <span className="text-xs text-amber">loading…</span>}
    </div>
  );
}
