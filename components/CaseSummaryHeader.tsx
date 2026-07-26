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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
              Case Reference
            </span>
            <span className="rounded-md bg-slate-100 font-mono text-xs font-bold px-2 py-0.5 text-slate-800">
              {caseData.caseId}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 tracking-tight sm:text-3xl">
            {caseData.patientName}
          </h1>
        </div>
        {action}
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Hospital Facility
          </dt>
          <dd className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900">{caseData.hospitalName}</dd>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Medical Procedure
          </dt>
          <dd className="mt-0.5 text-xs sm:text-sm font-semibold text-slate-900">{caseData.procedure}</dd>
        </div>
        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Date Submitted
          </dt>
          <dd className="mt-0.5 font-mono text-xs font-semibold text-slate-800">
            {formatDateTime(caseData.submittedAt)}
          </dd>
        </div>
      </dl>
    </div>
  );
}
