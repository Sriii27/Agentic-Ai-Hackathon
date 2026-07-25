'use client';

type VerificationStampProps = {
  status: 'verified' | 'pending';
  /** What was checked, e.g. "CGHS rate list". Only shown when status is 'verified'. */
  label?: string;
  /** The verb preceding the label — "Verified" for a direct check, "Cross-checked" for a comparison. */
  verb?: 'Verified' | 'Cross-checked';
  compact?: boolean;
};

/**
 * The one due-diligence device used everywhere a fact has actually been
 * checked against a source. Filled + checkmark once verified; a hollow
 * outline in amber for anything still pending or unverified.
 */
export function VerificationStamp({
  status,
  label,
  verb = 'Verified',
  compact = false,
}: VerificationStampProps) {
  const isPending = status === 'pending';
  const showFilled = status === 'verified';

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs`}
    >
      <span
        aria-hidden
        className={[
          'flex shrink-0 items-center justify-center rounded-full border',
          compact ? 'h-3.5 w-3.5' : 'h-4 w-4',
          isPending
            ? 'border-amber bg-transparent'
            : showFilled
              ? 'border-verified bg-verified'
              : 'border-verified/50 bg-transparent',
        ].join(' ')}
      >
        {showFilled && (
          <svg
            viewBox="0 0 12 12"
            className="h-2 w-2 text-paper"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              d="M2.5 6.2 5 8.7 9.5 3.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span
        className={`font-medium ${isPending ? 'text-amber' : 'text-verified'}`}
      >
        {isPending ? 'Pending' : `${verb} — ${label}`}
      </span>
    </span>
  );
}
