'use client';

import { useState } from 'react';
import { getCase, reportIssue, ApiError } from '@/lib/api';
import { useCase } from '@/lib/case-context';

const ISSUE_TYPES = [
  'Billing discrepancy',
  'Coverage denied unfairly',
  'Incorrect procedure or diagnosis code',
  'Financing offer concern',
  'Other',
];

export function ReportIssueModal({ caseId }: { caseId: string }) {
  const { applyCaseUpdate } = useCase();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [issueType, setIssueType] = useState(ISSUE_TYPES[0]);
  const [description, setDescription] = useState('');

  function close() {
    setOpen(false);
    setSubmitted(false);
    setSubmitError(null);
    setIssueType(ISSUE_TYPES[0]);
    setDescription('');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await reportIssue(caseId, issueType, description);
      // The backend appends a timeline event for this — pull the fresh
      // case so the shared timeline reflects it immediately.
      const updated = await getCase(caseId);
      applyCaseUpdate(updated);
      setSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not report the issue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cm-button"
      >
        Report an issue
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-issue-heading"
          onClick={close}
        >
          <div
            className="w-full max-w-md rounded-lg border border-hairline bg-paper-raised"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="p-6 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-verified-tint">
                  <span className="text-verified">✓</span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-ink">
                  Issue reported
                </h3>
                <p className="mt-1 text-sm text-slate">
                  Logged against this case and added to the shared timeline —
                  the insurer will see it too.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="cm-button cm-button-primary mt-6"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <h3 id="report-issue-heading" className="text-base font-semibold text-ink">
                  Report an issue
                </h3>
                <p className="mt-1 text-sm text-slate">
                  Case <span className="font-mono">{caseId}</span> — this goes
                  to the insurer&apos;s case queue.
                </p>

                <label className="mt-4 block text-sm font-medium text-ink">
                  Issue type
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="cm-field"
                  >
                    {ISSUE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="mt-4 block text-sm font-medium text-ink">
                  Description
                  <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Describe what looks wrong..."
                    className="cm-field"
                  />
                </label>

                {submitError && <p className="mt-3 text-xs text-amber">{submitError}</p>}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={close}
                    className="cm-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="cm-button cm-button-primary"
                  >
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
