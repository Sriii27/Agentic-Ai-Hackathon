import { formatDateTime } from '@/lib/utils';
import type { TimelineActor, TimelineEvent } from '@/lib/types';

const ACTOR_LABEL: Record<TimelineActor, string> = {
  hospital: 'Hospital',
  insurer: 'Insurer',
  patient: 'Patient',
  system: 'System',
};

const ACTOR_DOT: Record<TimelineActor, string> = {
  hospital: 'bg-ink',
  insurer: 'bg-slate',
  patient: 'bg-verified',
  system: 'bg-slate/40',
};

/**
 * The left rail on every full page. Renders identically no matter which
 * role is viewing it — newest event first, same dots, same order.
 */
export function TimelineRail({ events }: { events: TimelineEvent[] }) {
  const ordered = [...events].reverse();

  return (
    <div className="rounded-lg border border-hairline bg-paper-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Case Timeline
      </p>
      <p className="mt-1 text-xs text-slate/80">
        Identical for every role
      </p>

      <ol className="mt-4 space-y-0">
        {ordered.map((event, index) => (
          <li
            key={`${event.timestamp}-${index}`}
            className="relative flex gap-3 pb-5 last:pb-0"
          >
            {index !== ordered.length - 1 && (
              <span
                className="absolute left-1.5 top-3 h-full w-px bg-hairline"
                aria-hidden
              />
            )}
            <span
              className={`relative mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${ACTOR_DOT[event.actor]}`}
              aria-hidden
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-ink">
                {ACTOR_LABEL[event.actor]}
              </p>
              <p className="font-mono text-xs text-slate">
                {formatDateTime(event.timestamp)}
              </p>
              <p className="mt-1 text-xs leading-snug text-slate">
                {event.event}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TimelineRailEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-hairline bg-paper-raised p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate">
        Case Timeline
      </p>
      <p className="mt-3 text-sm leading-snug text-slate">{message}</p>
    </div>
  );
}
