import { formatDateTime } from '@/lib/utils';
import type { TimelineActor, TimelineEvent } from '@/lib/types';

const ACTOR_LABEL: Record<TimelineActor, string> = {
  hospital: 'Hospital',
  insurer: 'Insurer',
  patient: 'Patient',
  system: 'System',
};

const ACTOR_BADGE: Record<TimelineActor, string> = {
  hospital: 'bg-slate-900 text-white',
  insurer: 'bg-slate-600 text-white',
  patient: 'bg-teal-600 text-white',
  system: 'bg-amber-500 text-white',
};

const ACTOR_ICON: Record<TimelineActor, string> = {
  hospital: '🏥',
  insurer: '🛡️',
  patient: '👤',
  system: '🤖',
};

export function TimelineRail({ events }: { events: TimelineEvent[] }) {
  const ordered = [...events].reverse();

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between border-b border-white/40 pb-2.5 mb-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Activity Log
        </h2>
        <span className="font-mono text-[10px] font-bold text-slate-400">
          {events.length}
        </span>
      </div>

      <ol className="space-y-3">
        {ordered.map((event, index) => (
          <li key={`${event.timestamp}-${index}`} className="relative flex gap-2.5">
            <div className={`relative z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${ACTOR_BADGE[event.actor]}`}>
              {ACTOR_ICON[event.actor]}
            </div>
            <div className="min-w-0 flex-1 text-xs">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-slate-900">{ACTOR_LABEL[event.actor]}</span>
                <span className="font-mono text-[10px] text-slate-400">{formatDateTime(event.timestamp)}</span>
              </div>
              <p className="mt-0.5 text-[11px] text-slate-600 leading-snug">{event.event}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TimelineRailEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/60 bg-white/25 backdrop-blur-md p-4 text-center">
      <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
        Activity Log
      </h2>
      <p className="mt-2 text-xs text-slate-500">{message}</p>
    </div>
  );
}
