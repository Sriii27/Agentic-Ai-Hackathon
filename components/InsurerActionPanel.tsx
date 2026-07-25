'use client';

import { useState, useRef } from 'react';
import { useCase } from '@/lib/case-context';
import { ApiError } from '@/lib/api';
import { VerificationStamp } from './VerificationStamp';
import { formatDateTime } from '@/lib/utils';
import type { ClaimStatus, DecisionInput } from '@/lib/types';

type ActionMode = null | 'approve' | 'more-info' | 'deny';

const ACTION_LABELS: Record<NonNullable<ActionMode>, string> = {
  approve: 'Approve claim',
  'more-info': 'Request more information',
  deny: 'Deny claim',
};

/**
 * Insurer-only panel. Three distinct actions, each with a confirmation
 * step. Every action calls `POST /api/cases/:caseId/decision` on the real
 * backend, which appends a timeline event server-side — so all three
 * role-views see the decision update as soon as they (re)fetch the case.
 */
export function InsurerActionPanel() {
  const { caseData, submitDecision } = useCase();
  const [mode, setMode] = useState<ActionMode>(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [committedAt, setCommittedAt] = useState<string | null>(null);
  const [committedStatus, setCommittedStatus] = useState<ClaimStatus | null>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);

  if (!caseData) return null;

  // Once a decision is made this session, show a stamp instead of buttons.
  if (committedAt && committedStatus) {
    const isApproved = committedStatus === 'approved';
    const label = isApproved
      ? 'Claim approved'
      : committedStatus === 'more-info-requested'
        ? 'More info requested'
        : 'Claim denied';

    return (
      <div className="rounded-lg border border-hairline bg-paper-raised">
        <div className="border-b border-hairline px-6 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
            Insurer Decision
          </h2>
          <p className="mt-2 text-base text-ink">Decision recorded</p>
        </div>
        <div className="space-y-3 px-6 py-4">
          <div className="rounded-lg border border-verified/30 bg-verified-tint px-4 py-3">
            <p className="text-sm font-semibold text-verified">{label}</p>
            <p className="mt-1 font-mono text-xs text-slate">{formatDateTime(committedAt)}</p>
          </div>
          <VerificationStamp
            status="verified"
            verb="Verified"
            label="decision saved on the backend"
            compact
          />
          <p className="text-xs text-slate">
            Persisted on the server — switch to the Patient or Hospital view (or reload) to confirm.
          </p>
        </div>
      </div>
    );
  }

  async function commit(status: ClaimStatus) {
    if (!caseData) return;
    setSubmitting(true);
    setSubmitError(null);

    const trimmedNote = note.trim();
    let decision: DecisionInput;
    if (status === 'approved') {
      decision = { action: 'approve' };
    } else if (status === 'denied') {
      decision = { action: 'deny', note: trimmedNote || 'No reason given.' };
    } else {
      decision = { action: 'more-info', note: trimmedNote || 'No detail given.' };
    }

    try {
      await submitDecision(decision);
      setCommittedAt(new Date().toISOString());
      setCommittedStatus(status);
      setMode(null);
      setNote('');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'Could not save the decision.');
    } finally {
      setSubmitting(false);
    }
  }

  // Already decided from a previous session / seed data.
  const alreadyDecided =
    caseData.claimStatus !== 'pending' && caseData.claimStatus !== 'more-info-requested';

  return (
    <div className="rounded-lg border border-hairline bg-paper-raised">
      <div className="border-b border-hairline px-6 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
          Insurer Decision
        </h2>
        <p className="mt-2 text-base text-ink">
          {alreadyDecided ? 'Review existing decision' : 'Take action on this case'}
        </p>
      </div>

      <div className="space-y-3 px-6 py-4">
        {alreadyDecided && (
          <div className="rounded-lg border border-amber/30 bg-amber-tint px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-amber">
              Already decided
            </p>
            <p className="mt-1 text-sm text-amber/90">
              This case already has a recorded decision ({caseData.claimStatus}). You can override
              it using the actions below.
            </p>
          </div>
        )}

        {submitError && (
          <div className="rounded-lg border border-amber/30 bg-amber-tint px-4 py-3 text-sm text-amber">
            {submitError}
          </div>
        )}

        {mode === null && (
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => commit('approved')}
              disabled={submitting}
              className="cm-button cm-button-primary flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span
                aria-hidden
                className="flex h-4 w-4 items-center justify-center rounded-full border border-paper bg-paper/20"
              >
                <svg
                  viewBox="0 0 12 12"
                  className="h-2 w-2 text-paper"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M2.5 6.2 5 8.7 9.5 3.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {submitting ? 'Saving…' : 'Approve claim'}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setMode('more-info');
                setTimeout(() => noteRef.current?.focus(), 50);
              }}
              className="cm-button cm-button-amber flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber" />
              Request more information
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => {
                setMode('deny');
                setTimeout(() => noteRef.current?.focus(), 50);
              }}
              className="cm-button flex items-center justify-center gap-2 border-amber/50 text-amber hover:bg-amber-tint disabled:opacity-60"
            >
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-amber" />
              Deny claim
            </button>
          </div>
        )}

        {(mode === 'more-info' || mode === 'deny') && (
          <div className="space-y-3">
            <p className="text-sm font-semibold text-ink">{ACTION_LABELS[mode]}</p>
            <label className="block text-sm font-medium text-ink">
              {mode === 'deny' ? 'Denial reason' : 'Information needed'}
              <textarea
                ref={noteRef}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="cm-field mt-1"
                placeholder={
                  mode === 'deny'
                    ? 'State the reason for denial…'
                    : 'Describe what additional information is needed…'
                }
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => commit(mode === 'deny' ? 'denied' : 'more-info-requested')}
                className="cm-button cm-button-primary flex-1 disabled:opacity-60"
              >
                {submitting ? 'Saving…' : 'Confirm'}
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  setMode(null);
                  setNote('');
                }}
                className="cm-button disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <p className="text-xs text-slate">
          Actions are saved on the backend and appended to the shared timeline.
        </p>
      </div>
    </div>
  );
}
