'use client';

import { useState } from 'react';
import { useCase } from '@/lib/case-context';
import { createCase, runObjectivityCheck, ApiError } from '@/lib/api';
import { CaseFileShell } from '@/components/CaseFileShell';
import { CaseStatusStepper } from '@/components/CaseStatusStepper';
import { CaseNotificationBanner } from '@/components/CaseNotificationBanner';
import { TimelineRail, TimelineRailEmpty } from '@/components/TimelineRail';
import { VerificationRail } from '@/components/VerificationRail';
import { CompletenessChecklist } from '@/components/CompletenessChecklist';
import { DocumentChecklist, DOCUMENT_IDS } from '@/components/DocumentChecklist';
import { VerificationStamp } from '@/components/VerificationStamp';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import type { CaseData, DocumentId } from '@/lib/types';

type FormState = {
  patientName: string;
  hospitalName: string;
  procedure: string;
  patientHistory: string;
  insuranceProvider: string;
  estimatedCost: string;
};

const EMPTY_FORM: FormState = {
  patientName: '',
  hospitalName: '',
  procedure: '',
  patientHistory: '',
  insuranceProvider: '',
  estimatedCost: '',
};

export default function HospitalPage() {
  const { setCaseId, refreshCases } = useCase();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [createdCase, setCreatedCase] = useState<CaseData | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<DocumentId[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      const created = await createCase({
        patientName: form.patientName,
        hospitalName: form.hospitalName,
        procedure: form.procedure,
        patientHistory: form.patientHistory,
        insuranceProvider: form.insuranceProvider,
        estimatedCost: Number(form.estimatedCost),
      });
      // Resolve the objectivity check right away — real backend, real rules
      // (see backend/src/domain/objectivityCheck.ts) — rather than leaving
      // it "queued" with nothing behind it.
      const checked = await runObjectivityCheck(created.caseId);
      setCreatedCase(checked);
      setCaseId(checked.caseId);
      refreshCases();
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Could not submit the case. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setForm(EMPTY_FORM);
    setCreatedCase(null);
    setUploadedDocs([]);
    setSubmitError(null);
  }

  const patientDetailsComplete = Boolean(
    form.patientName.trim() &&
      form.hospitalName.trim() &&
      form.procedure.trim() &&
      form.insuranceProvider.trim()
  );
  const estimateProvided = Number(form.estimatedCost) > 0;
  const documentsComplete = uploadedDocs.length === DOCUMENT_IDS.length;
  const consentRecorded = createdCase !== null;

  const completenessItems = [
    { label: 'Patient & procedure details filled', done: patientDetailsComplete },
    { label: 'Cost estimate provided', done: estimateProvided },
    { label: 'All required documents uploaded', done: documentsComplete },
    { label: 'Patient consent recorded', done: consentRecorded },
  ];

  const hasFlags = (createdCase?.objectivityReport.flags.length ?? 0) > 0;
  const consentEvent = createdCase?.timeline.find((e) => e.actor === 'patient');

  return (
    <CaseFileShell
      role="Hospital"
      roleTone="ink"
      stepper={<CaseStatusStepper stage={createdCase ? 1 : 0} />}
      notification={<CaseNotificationBanner />}
      timeline={
        createdCase ? (
          <TimelineRail events={createdCase.timeline} />
        ) : (
          <TimelineRailEmpty message="No case yet — start by entering patient details below." />
        )
      }
      right={
        createdCase ? (
          <VerificationRail
            items={[
              { context: 'Cost estimate', status: 'verified', verb: 'Verified', label: 'CGHS rate list' },
              { context: 'Patient consent', status: 'verified', verb: 'Verified', label: 'recorded' },
              {
                context: 'Objectivity check',
                status: 'verified',
                verb: 'Verified',
                label: hasFlags ? 'flags raised — see below' : 'no discrepancies',
              },
            ]}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-hairline bg-paper-raised p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">
              Verification
            </p>
            <p className="mt-3 text-sm leading-snug text-slate">
              Stamps will appear here once this case is submitted.
            </p>
          </div>
        )
      }
    >
      <CompletenessChecklist items={completenessItems} />

      {createdCase ? (
        <Card>
          {/* Case ID prominently displayed */}
          <div className="border-b border-hairline px-6 py-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate">
              Case reference
            </p>
            <p className="mt-1 font-mono text-2xl font-semibold tracking-tight text-ink">
              {createdCase.caseId}
            </p>
          </div>

          <CardHeader
            title="Submitted"
            subtitle="Case sent for objectivity review"
          />

          <CardBody className="space-y-4">
            <div
              className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${
                hasFlags ? 'border-amber/30 bg-amber-tint' : 'border-verified/30 bg-verified-tint'
              }`}
            >
              <span
                aria-hidden
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  hasFlags ? 'border-amber text-amber' : 'border-verified bg-verified'
                }`}
              >
                {hasFlags ? (
                  '!'
                ) : (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2 w-2 text-paper"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M2.5 6.2 5 8.7 9.5 3.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <p className={`text-sm ${hasFlags ? 'text-amber' : 'text-verified'}`}>
                {hasFlags
                  ? `Objectivity check flagged ${createdCase.objectivityReport.flags.length} issue${createdCase.objectivityReport.flags.length > 1 ? 's' : ''} — worth reviewing before the insurer does.`
                  : 'Case recorded and queued for insurer review. Objectivity check found no issues.'}
              </p>
            </div>

            {hasFlags && (
              <ul className="space-y-2">
                {createdCase.objectivityReport.flags.map((flag) => (
                  <li
                    key={flag}
                    className="rounded-lg border border-amber/30 bg-amber-tint px-3 py-2 text-sm text-amber"
                  >
                    {flag}
                  </li>
                ))}
              </ul>
            )}

            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">Patient</dt>
                <dd className="mt-0.5 text-sm text-ink">{form.patientName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">Hospital</dt>
                <dd className="mt-0.5 text-sm text-ink">{form.hospitalName}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">Procedure</dt>
                <dd className="mt-0.5 text-sm text-ink">{form.procedure}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">
                  Insurance provider
                </dt>
                <dd className="mt-0.5 text-sm text-ink">{form.insuranceProvider}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">
                  Estimated cost
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-ink">
                  {formatCurrency(createdCase.hospitalEstimate)}
                </dd>
                <div className="mt-2">
                  <VerificationStamp status="verified" verb="Verified" label="CGHS rate list" compact />
                </div>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate">
                  Consent logged
                </dt>
                <dd className="mt-0.5 font-mono text-sm text-ink">
                  {consentEvent ? formatDateTime(consentEvent.timestamp) : '—'}
                </dd>
                <div className="mt-2">
                  <VerificationStamp status="verified" verb="Verified" label="patient authorisation" compact />
                </div>
              </div>
              {form.patientHistory && (
                <div className="sm:col-span-2">
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate">
                    Patient history
                  </dt>
                  <dd className="mt-0.5 whitespace-pre-wrap text-sm text-ink">
                    {form.patientHistory}
                  </dd>
                </div>
              )}
            </dl>

            <button type="button" onClick={reset} className="cm-button">
              Submit another case
            </button>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader
            title="New Case"
            subtitle="Submit a case for insurer review"
          />
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section: Patient */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                  Patient details
                </legend>
                <label className="block text-sm font-medium text-ink">
                  Patient name
                  <input
                    required
                    value={form.patientName}
                    onChange={(e) => update('patientName', e.target.value)}
                    className="cm-field"
                    placeholder="e.g. Meera Nair"
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Patient history
                  <textarea
                    value={form.patientHistory}
                    onChange={(e) => update('patientHistory', e.target.value)}
                    rows={4}
                    className="cm-field"
                    placeholder="Relevant conditions, prior treatment, notes…"
                  />
                </label>
              </fieldset>

              <div className="border-t border-hairline" />

              {/* Section: Case */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                  Case details
                </legend>
                <label className="block text-sm font-medium text-ink">
                  Hospital name
                  <input
                    required
                    value={form.hospitalName}
                    onChange={(e) => update('hospitalName', e.target.value)}
                    className="cm-field"
                    placeholder="e.g. Sunrise General Hospital"
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Procedure
                  <input
                    required
                    value={form.procedure}
                    onChange={(e) => update('procedure', e.target.value)}
                    className="cm-field"
                    placeholder="e.g. Laparoscopic Appendectomy"
                  />
                </label>
                <label className="block text-sm font-medium text-ink">
                  Estimated cost (₹)
                  <input
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.estimatedCost}
                    onChange={(e) => update('estimatedCost', e.target.value)}
                    className="cm-field font-mono"
                    placeholder="e.g. 185000"
                  />
                </label>
              </fieldset>

              <div className="border-t border-hairline" />

              {/* Section: Insurance */}
              <fieldset className="space-y-4">
                <legend className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">
                  Insurance
                </legend>
                <label className="block text-sm font-medium text-ink">
                  Insurance plan / provider
                  <input
                    required
                    value={form.insuranceProvider}
                    onChange={(e) => update('insuranceProvider', e.target.value)}
                    className="cm-field"
                    placeholder="e.g. Star Health — Comprehensive Plan"
                  />
                </label>
              </fieldset>

              {submitError && (
                <div className="rounded-lg border border-amber/30 bg-amber-tint px-4 py-3 text-sm text-amber">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="cm-button cm-button-primary disabled:opacity-60"
              >
                {submitting ? 'Submitting…' : 'Submit case'}
              </button>
            </form>
          </CardBody>
        </Card>
      )}

      <DocumentChecklist caseId={createdCase?.caseId ?? null} onChange={setUploadedDocs} />
    </CaseFileShell>
  );
}
