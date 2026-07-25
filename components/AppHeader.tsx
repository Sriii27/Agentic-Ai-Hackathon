'use client';

import Link from 'next/link';
import { Badge, type BadgeTone } from './ui/Badge';
import { useCase } from '@/lib/case-context';

/**
 * Persistent header present on every page.
 * When a case is loaded it shows the case ID and patient name in the centre
 * so any role can always see which case they are looking at.
 */
export function AppHeader({
  role,
  tone,
}: {
  role: string;
  tone: BadgeTone;
}) {
  const { caseData } = useCase();

  return (
    <header className="no-print border-b border-hairline bg-paper-raised">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2 rounded-sm px-1 py-1 hover:bg-ink-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink"
        >
          <span className="text-base font-semibold tracking-tight text-ink">Care Mediator</span>
        </Link>

        {/* Active case — grows to fill centre space */}
        <div className="flex min-w-0 flex-1 items-baseline gap-2 overflow-hidden">
          {caseData ? (
            <>
              <span
                aria-label={`Case ${caseData.caseId}`}
                className="shrink-0 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-slate"
              >
                {caseData.caseId}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-xs text-hairline"
              >
                ·
              </span>
              <span className="truncate text-sm font-medium text-ink">
                {caseData.patientName}
              </span>
            </>
          ) : (
            <span className="hidden text-xs uppercase tracking-[0.08em] text-slate sm:inline">
              Case file
            </span>
          )}
        </div>

        {/* Right: role badge + switch */}
        <div className="flex shrink-0 items-center gap-3">
          <Badge tone={tone}>{role}</Badge>
          <Link
            href="/"
            className="hidden rounded-sm px-1 py-1 text-sm font-medium text-slate hover:bg-ink-tint hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink sm:inline"
          >
            Switch role
          </Link>
        </div>
      </div>
    </header>
  );
}
