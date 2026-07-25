import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge, type BadgeTone } from './ui/Badge';
import { VerificationStamp } from './VerificationStamp';
import { formatCurrency } from '@/lib/utils';
import type { ClaimStatus } from '@/lib/types';

const STATUS_LABEL: Record<ClaimStatus, string> = {
  approved: 'Approved',
  partial: 'Partially approved',
  denied: 'Denied',
  pending: 'Pending',
  'more-info-requested': 'More info requested',
};

const STATUS_TONE: Record<ClaimStatus, BadgeTone> = {
  approved: 'verified',
  partial: 'amber',
  denied: 'amber',
  pending: 'slate',
  'more-info-requested': 'amber',
};

export function Ledger({
  hospitalEstimate,
  insurerApproved,
  gap,
  claimStatus,
}: {
  hospitalEstimate: number;
  insurerApproved: number;
  gap: number;
  claimStatus: ClaimStatus;
}) {
  const approvedPct = hospitalEstimate > 0
    ? Math.min(100, Math.round((insurerApproved / hospitalEstimate) * 100))
    : 0;
  const gapPct = 100 - approvedPct;

  return (
    <Card>
      <CardHeader
        title="Cost Ledger"
        subtitle="Hospital estimate vs. what the insurer approved"
        action={<Badge tone={STATUS_TONE[claimStatus]}>{STATUS_LABEL[claimStatus]}</Badge>}
      />
      <CardBody>
        <div
          className="flex h-3 w-full overflow-hidden rounded bg-ink-tint"
          role="img"
          aria-label={`${approvedPct}% approved, ${gapPct}% gap`}
        >
          {approvedPct > 0 && (
            <div
              className="h-full bg-ink"
              style={{ width: `${approvedPct}%` }}
            />
          )}
          {gapPct > 0 && (
            <div
              className="h-full bg-amber"
              style={{ width: `${gapPct}%` }}
            />
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate">
              Hospital estimate
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-ink">
              {formatCurrency(hospitalEstimate)}
            </p>
            <div className="mt-2">
              <VerificationStamp status="verified" verb="Verified" label="CGHS rate list" compact />
            </div>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate">
              <span className="inline-block h-2 w-2 rounded-full bg-ink" />
              Insurer approved
            </p>
            <p className="mt-2 font-mono text-xl font-semibold text-ink">
              {formatCurrency(insurerApproved)}
            </p>
            <div className="mt-2">
              <VerificationStamp status="verified" verb="Cross-checked" label="insurer approval memo" compact />
            </div>
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate">
              <span className="inline-block h-2 w-2 rounded-full bg-amber" />
              Gap (patient owes)
            </p>
            <p
              className={`mt-1 font-mono text-xl font-semibold ${gap > 0 ? 'text-amber' : 'text-ink'}`}
            >
              {formatCurrency(gap)}
            </p>
            <div className="mt-2">
              <VerificationStamp
                status={gap > 0 ? 'pending' : 'verified'}
                verb="Verified"
                label="zero patient liability"
                compact
              />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
