export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
  }).format(new Date(iso));
}

export const CASE_STAGES = [
  'Submitted',
  'Objectivity Check',
  'Insurer Review',
  'Decision',
] as const;

/**
 * Maps a claim's lifecycle to a stage index (1-based against CASE_STAGES).
 * 0 means no case exists yet.
 */
export function deriveStage(claimStatus?: 'approved' | 'partial' | 'denied' | 'pending' | 'more-info-requested'): number {
  if (!claimStatus) return 0;
  if (claimStatus === 'pending') return 3;
  if (claimStatus === 'more-info-requested') return 3;
  return 4;
}
