import { Card, CardBody, CardHeader } from './ui/Card';
import { Badge } from './ui/Badge';

export type CompletenessItem = {
  label: string;
  done: boolean;
};

/**
 * What's still required before the insurer can review this case. Meant
 * to be prominent — this is the thing that prevents a denial later.
 */
export function CompletenessChecklist({ items }: { items: CompletenessItem[] }) {
  const doneCount = items.filter((i) => i.done).length;
  const allDone = doneCount === items.length;

  return (
    <Card className={allDone ? 'border-verified/30' : 'border-amber/40'}>
      <CardHeader
        title="Before Insurer Review"
        subtitle={`${doneCount} of ${items.length} ready`}
        action={
          <Badge tone={allDone ? 'verified' : 'amber'}>
            {allDone ? 'Ready' : 'Action needed'}
          </Badge>
        }
      />
      <CardBody>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.label} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  item.done ? 'border-verified bg-verified' : 'border-amber bg-transparent'
                }`}
              >
                {item.done && (
                  <svg
                    viewBox="0 0 12 12"
                    className="h-2 w-2 text-paper"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M2.5 6.2 5 8.7 9.5 3.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className={item.done ? 'text-slate' : 'font-semibold text-ink'}>
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      </CardBody>
    </Card>
  );
}
