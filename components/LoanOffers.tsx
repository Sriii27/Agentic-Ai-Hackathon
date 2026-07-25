import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';
import { VerificationStamp } from './VerificationStamp';
import { formatCurrency } from '@/lib/utils';
import type { LoanOffer, RecommendedOffer } from '@/lib/types';

export function LoanOffers({
  offers,
  recommendedOffer,
}: {
  offers: LoanOffer[];
  recommendedOffer: RecommendedOffer;
}) {
  return (
    <Card>
      <CardHeader
        title="Financing Options"
        subtitle="Offers to help cover any amount insurance doesn't"
      />
      <CardBody>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {offers.map((offer) => {
            const isRecommended =
              !offer.flagged && offer.lenderName === recommendedOffer.lenderName;

            return (
              <div
                key={offer.lenderName}
                className={`rounded-lg border-2 p-4 ${
                  offer.flagged
                    ? 'border-amber bg-amber-tint'
                    : isRecommended
                      ? 'border-verified bg-verified-tint'
                      : 'border-hairline bg-paper-raised'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-ink">
                    {offer.lenderName}
                  </p>
                  {offer.flagged && <Badge tone="amber">Flagged</Badge>}
                  {isRecommended && <Badge tone="verified">Recommended</Badge>}
                </div>

                <dl className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <dt className="text-slate">APR</dt>
                    <dd
                      className={`font-mono font-medium ${offer.flagged ? 'text-amber' : 'text-ink'}`}
                    >
                      {offer.apr}%
                    </dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-slate">Amount</dt>
                    <dd className="font-mono font-medium text-ink">
                      {formatCurrency(offer.amount)}
                    </dd>
                  </div>
                </dl>

                {offer.flagged && offer.flagReason && (
                  <p className="mt-4 text-xs text-amber/90">{offer.flagReason}</p>
                )}

                <div className="mt-4">
                  {offer.flagged ? (
                    <VerificationStamp status="pending" compact />
                  ) : isRecommended ? (
                    <VerificationStamp
                      status="verified"
                      verb="Verified"
                      label="lowest true cost"
                      compact
                    />
                  ) : (
                    <VerificationStamp
                      status="verified"
                      verb="Cross-checked"
                      label="lender disclosure sheet"
                      compact
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
