import type { ReactNode } from 'react';
import { formatDateTime } from '@/lib/utils';
import type { CaseData } from '@/lib/types';

export function CaseSummaryHeader({
  caseData,
  action,
}: {
  caseData: CaseData;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-hairline border-l-4 border-l-ink bg-paper-raised p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-slate">
            Case {caseData.caseId}
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-ink">
            {caseData.patientName}
          </h1>
        </div>
        {action}
      </div>
      <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate">
            Hospital
          </dt>
          <dd className="mt-0.5 text-sm text-ink">{caseData.hospitalName}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate">
            Procedure
          </dt>
          <dd className="mt-0.5 text-sm text-ink">{caseData.procedure}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate">
            Submitted
          </dt>
          <dd className="mt-0.5 font-mono text-sm text-ink">
            {formatDateTime(caseData.submittedAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
