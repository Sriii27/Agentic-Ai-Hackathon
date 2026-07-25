import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge, type BadgeTone } from './ui/Badge';
import { VerificationStamp } from './VerificationStamp';
import { formatCurrency } from '@/lib/utils';
import type { CoverageExplainer, NetworkStatus } from '@/lib/types';

const NETWORK_LABEL: Record<NetworkStatus, string> = {
  'in-network': 'In-network',
  'out-of-network': 'Out-of-network',
  unknown: 'Network status unknown',
};

const NETWORK_TONE: Record<NetworkStatus, BadgeTone> = {
  'in-network': 'verified',
  'out-of-network': 'amber',
  unknown: 'slate',
};

export function CoverageExplainerCard({
  coverageExplainer,
}: {
  coverageExplainer: CoverageExplainer;
}) {
  const { covered, coverageLimit, waitingPeriodCleared, exclusionsApplicable, networkStatus } =
    coverageExplainer;

  const summary = covered
    ? `This procedure is covered under the patient's policy, up to ${formatCurrency(coverageLimit)}.`
    : "This procedure is not covered under the patient's current policy.";

  return (
    <Card>
      <CardHeader
        title="Coverage Explainer"
        subtitle="Plain-language summary of what's covered"
        action={<Badge tone={NETWORK_TONE[networkStatus]} className="whitespace-nowrap">{NETWORK_LABEL[networkStatus]}</Badge>}
      />
      <CardBody className="space-y-4">
        <p className="text-sm text-slate">{summary}</p>

        {!waitingPeriodCleared && (
          <div className="rounded-lg border border-amber/30 bg-amber-tint px-4 py-4">
            <p className="text-sm font-medium text-amber">
              Waiting period not yet cleared
            </p>
            <p className="mt-2 text-sm text-amber/90">
              Part of this claim relates to a condition still inside its policy
              waiting period, which limits what can be approved right now.
            </p>
          </div>
        )}
        {waitingPeriodCleared && (
          <p className="flex items-center gap-1.5 text-sm text-verified">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-verified" />
            Waiting period cleared
          </p>
        )}

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate">
            Coverage limit
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-ink">
            {formatCurrency(coverageLimit)}
          </p>
          <div className="mt-2">
            <VerificationStamp status="verified" verb="Verified" label="policy coverage table" compact />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate">
              Exclusions that apply to this case
            </p>
            <VerificationStamp status="verified" verb="Cross-checked" label="policy terms" compact />
          </div>
          {exclusionsApplicable.length === 0 ? (
            <p className="mt-1.5 text-sm text-slate">None</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5">
              {exclusionsApplicable.map((exclusion) => (
                <li
                  key={exclusion}
                  className="flex items-start gap-2 text-sm text-slate"
                >
                  <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {exclusion}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
