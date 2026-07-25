'use client';

import Link from 'next/link';
import { useCase } from '@/lib/case-context';
import { deriveStage } from '@/lib/utils';
import { CaseFileShell } from '@/components/CaseFileShell';
import { CaseStatusStepper } from '@/components/CaseStatusStepper';
import { TimelineRail, TimelineRailEmpty } from '@/components/TimelineRail';
import { VerificationRail } from '@/components/VerificationRail';
import { CaseSummaryHeader } from '@/components/CaseSummaryHeader';
import { Ledger } from '@/components/Ledger';
import { CoverageExplainerCard } from '@/components/CoverageExplainerCard';
import { InsurerActionPanel } from '@/components/InsurerActionPanel';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StateCard } from '@/components/StateCard';

export default function InsurerPage() {
  const { caseData, loading, error } = useCase();

  const stage = deriveStage(caseData?.claimStatus);
  const hasFlags = (caseData?.objectivityReport.flags.length ?? 0) > 0;

  const timeline = caseData ? (
    <TimelineRail events={caseData.timeline} />
  ) : (
    <TimelineRailEmpty message="No case yet — nothing has been submitted for review." />
  );

  const rightRail = caseData ? (
    <div className="space-y-4">
      <VerificationRail
        items={[
          { context: 'Hospital estimate', status: 'verified', verb: 'Verified', label: 'CGHS rate list' },
          { context: 'Coverage exclusions', status: 'verified', verb: 'Cross-checked', label: 'policy terms' },
          {
            context: 'Objectivity check',
            status: 'verified',
            verb: 'Verified',
            label: hasFlags ? 'flags raised — see below' : 'no discrepancies',
          },
        ]}
      />
      <InsurerActionPanel key={caseData.caseId} />
    </div>
  ) : (
    <div className="cm-card-note space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Verification
      </p>
      <p className="text-sm text-slate">
        Once a case is submitted and checked, source verification stamps appear here.
      </p>
      <Link href="/hospital" className="cm-button">
        Open Hospital queue
      </Link>
    </div>
  );

  return (
    <CaseFileShell
      role="Insurer"
      roleTone="slate"
      stepper={<CaseStatusStepper stage={stage} />}
      timeline={timeline}
      right={rightRail}
    >
      {loading && !caseData && !error && (
        <StateCard title="Loading case…" description="Pulling the latest case record." />
      )}

      {error && <StateCard tone="amber" title="Case not found" description={error} />}

      {!loading && !error && !caseData && (
        <StateCard
          title="No case in your queue"
          description="Cases appear here once a hospital submits and the objectivity check completes."
          action={
            <Link href="/hospital" className="cm-button">
              Go to Hospital view
            </Link>
          }
        />
      )}

      {caseData && (
        <>
          <CaseSummaryHeader caseData={caseData} />

          <Card className={hasFlags ? 'border-amber/40' : 'border-verified/30'}>
            <CardHeader
              title="Objectivity Report"
              subtitle={
                hasFlags
                  ? 'Issues found before this reached your queue'
                  : 'No issues found before this reached your queue'
              }
            />
            <CardBody className="space-y-3">
              <p className="text-sm text-slate">
                {caseData.objectivityReport.summary}
              </p>
              {hasFlags ? (
                <ul className="space-y-2">
                  {caseData.objectivityReport.flags.map((flag) => (
                    <li
                      key={flag}
                      className="flex items-start gap-3 rounded-lg border border-amber/30 bg-amber-tint px-4 py-3 text-sm text-amber"
                    >
                      <span
                        aria-hidden
                        className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-amber"
                      />
                      {flag}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="flex items-center gap-1.5 text-sm text-verified">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-verified" />
                  Consistent across hospital records, diagnosis codes, and
                  policy terms.
                </p>
              )}
            </CardBody>
          </Card>

          <Ledger
            hospitalEstimate={caseData.hospitalEstimate}
            insurerApproved={caseData.insurerApproved}
            gap={caseData.gap}
            claimStatus={caseData.claimStatus}
          />

          <CoverageExplainerCard coverageExplainer={caseData.coverageExplainer} />
        </>
      )}
    </CaseFileShell>
  );
}
