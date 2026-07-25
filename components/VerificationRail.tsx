import { VerificationStamp } from './VerificationStamp';

export type VerificationRailItem = {
  context: string;
  status: 'verified' | 'pending';
  label?: string;
  verb?: 'Verified' | 'Cross-checked';
};

export function VerificationRail({ items }: { items: VerificationRailItem[] }) {
  return (
    <div className="rounded-lg border border-hairline bg-paper-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Verification
      </p>
      <p className="mt-1 text-xs text-slate/80">
        What&apos;s been checked against a real source
      </p>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li key={item.context} className="space-y-1">
            <p className="text-sm text-slate">{item.context}</p>
            <VerificationStamp
              status={item.status}
              label={item.label}
              verb={item.verb}
              compact
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
