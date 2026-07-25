'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCase } from '@/lib/case-context';
import { deriveStage } from '@/lib/utils';
import { CaseFileShell } from '@/components/CaseFileShell';
import { CaseStatusStepper } from '@/components/CaseStatusStepper';
import { CaseNotificationBanner } from '@/components/CaseNotificationBanner';
import { TimelineRail, TimelineRailEmpty } from '@/components/TimelineRail';
import { VerificationRail } from '@/components/VerificationRail';
import { CaseSummaryHeader } from '@/components/CaseSummaryHeader';
import { PrintButton } from '@/components/PrintButton';
import { CompletenessChecklist } from '@/components/CompletenessChecklist';
import { DocumentChecklist, DOCUMENT_IDS } from '@/components/DocumentChecklist';
import type { DocumentId } from '@/lib/types';
import { Ledger } from '@/components/Ledger';
import { CoverageExplainerCard } from '@/components/CoverageExplainerCard';
import { LoanOffers } from '@/components/LoanOffers';
import { ComparisonTray } from '@/components/ComparisonTray';
import { ReportIssueModal } from '@/components/ReportIssueModal';
import { VerificationStamp } from '@/components/VerificationStamp';
import { StateCard } from '@/components/StateCard';
import { formatDateTime } from '@/lib/utils';

export default function PatientPage() {
  const { caseData, loading, error } = useCase();
  const [uploadedDocs, setUploadedDocs] = useState<DocumentId[]>([]);

  const stage = deriveStage(caseData?.claimStatus);

  const timeline = caseData ? (
    <TimelineRail events={caseData.timeline} />
  ) : (
    <TimelineRailEmpty message="No case yet — start by entering patient details from the Hospital view." />
  );

  const rightRail = caseData ? (
    <>
      <VerificationRail
        items={[
          { context: 'Hospital estimate', status: 'verified', verb: 'Verified', label: 'CGHS rate list' },
          { context: 'Coverage exclusions', status: 'verified', verb: 'Cross-checked', label: 'policy terms' },
          {
            context: 'Recommended financing',
            status: 'verified',
            verb: 'Verified',
            label: 'lowest true cost',
          },
          ...(caseData.loanOffers.some((o) => o.flagged)
            ? [{ context: 'Flagged financing offer', status: 'pending' as const }]
            : []),
        ]}
      />
      <ComparisonTray />
    </>
  ) : (
    <div className="cm-card-note space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Verification
      </p>
      <p className="text-sm text-slate">
        Verified stamps and side-by-side policy comparisons appear after a hospital submits a case.
      </p>
      <Link href="/hospital" className="cm-button">
        Go to Hospital view
      </Link>
    </div>
  );

  const documentsComplete = uploadedDocs.length === DOCUMENT_IDS.length;

  // Find the patient consent event from the timeline
  const consentEvent = caseData?.timeline.find(
    (e) => e.actor === 'patient' || e.event.toLowerCase().includes('consent')
  );

  return (
    <CaseFileShell
      role="Patient"
      roleTone="verified"
      stepper={<CaseStatusStepper stage={stage} />}
      notification={<CaseNotificationBanner />}
      timeline={timeline}
      right={rightRail}
    >
      {loading && !caseData && !error && (
        <StateCard title="Loading case…" description="Pulling the latest case record." />
      )}

      {error && (
        <StateCard
          tone="amber"
          title="Case not found"
          description={error}
        />
      )}

      {!loading && !error && !caseData && (
        <StateCard
          title="No case yet"
          description="Start by entering patient details from the Hospital view."
          action={
            <Link href="/hospital" className="cm-button">
              Open Hospital view
            </Link>
          }
        />
      )}

      {caseData && (
        <>
          <CaseSummaryHeader caseData={caseData} action={<PrintButton />} />

          {/* Consent record — visible signed-on line for the patient */}
          <div className="rounded-lg border border-hairline border-l-4 border-l-verified bg-paper-raised p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
              Consent Record
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Patient</p>
                <p className="mt-0.5 text-sm text-ink">{caseData.patientName}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Consent granted</p>
                <p className="mt-0.5 font-mono text-sm text-ink">
                  {consentEvent ? formatDateTime(consentEvent.timestamp) : formatDateTime(caseData.submittedAt)}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate">Scope</p>
                <p className="mt-0.5 text-sm text-slate">
                  Patient authorised sharing of medical records and cost estimate with{' '}
                  {caseData.coverageExplainer.networkStatus !== 'unknown'
                    ? 'the listed insurer'
                    : 'the insurer on record'}{' '}
                  for the purpose of this claim.
                </p>
              </div>
            </div>
            <div className="mt-3">
              <VerificationStamp status="verified" verb="Verified" label="patient authorisation on file" compact />
            </div>
          </div>

          <CompletenessChecklist
            items={[
              { label: 'All required documents uploaded', done: documentsComplete },
              { label: 'Patient consent recorded', done: true },
              {
                label: 'No unresolved objectivity flags',
                done: caseData.objectivityReport.flags.length === 0,
              },
              {
                label: 'Insurance provider details confirmed',
                done: caseData.coverageExplainer.networkStatus !== 'unknown',
              },
            ]}
          />

          <Ledger
            hospitalEstimate={caseData.hospitalEstimate}
            insurerApproved={caseData.insurerApproved}
            gap={caseData.gap}
            claimStatus={caseData.claimStatus}
          />

          <CoverageExplainerCard coverageExplainer={caseData.coverageExplainer} />

          <LoanOffers
            offers={caseData.loanOffers}
            recommendedOffer={caseData.recommendedOffer}
          />

          <DocumentChecklist caseId={caseData.caseId} onChange={setUploadedDocs} />

          <div className="no-print">
            <ReportIssueModal caseId={caseData.caseId} />
          </div>
        </>
      )}
    </CaseFileShell>
  );
}
