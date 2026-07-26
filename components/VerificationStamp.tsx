'use client';

type VerificationStampProps = {
  status: 'verified' | 'pending';
  label?: string;
  verb?: 'Verified' | 'Cross-checked';
  compact?: boolean;
};

export function VerificationStamp({
  status,
  label,
  verb = 'Verified',
  compact = false,
}: VerificationStampProps) {
  const isPending = status === 'pending';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
        isPending
          ? 'bg-amber-50 text-amber-800 border border-amber-200'
          : 'bg-teal-50 text-teal-800 border border-teal-200'
      }`}
    >
      <span
        aria-hidden
        className={`flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
          isPending ? 'bg-amber-500 text-white h-3.5 w-3.5' : 'bg-teal-600 text-white h-3.5 w-3.5'
        }`}
      >
        {isPending ? '!' : '✓'}
      </span>
      <span className="font-medium text-[11px] truncate">
        {isPending ? 'Pending' : label ? `${verb} — ${label}` : verb}
      </span>
    </span>
  );
}
