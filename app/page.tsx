import Link from 'next/link';
import { VerificationStamp } from '@/components/VerificationStamp';

/**
 * Landing page — the "pitch in five seconds" view.
 *
 * No sidebar rails here. The shared-case-record concept is explained through
 * a three-step flow diagram that reuses the timeline-dot motif, so the
 * visual language carries across every role view.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Minimal top bar — no role badge, just the wordmark */}
      <header className="border-b border-hairline bg-paper-raised">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="text-lg font-semibold tracking-tight text-ink">Care Mediator</span>
          <span className="rounded-full bg-verified-tint px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-verified">
            Live demo
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-16">

        {/* ── Hero ───────────────────────────────────────────────────── */}
        <section className="mb-12">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            Shared case record
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            One case. Every side of the table.<br className="hidden sm:block" /> No hidden version.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate">
            When a hospital submits a case, an objectivity agent checks every number against a
            neutral source before the insurer sees it. The patient, hospital, and insurer all read
            the same verified file — nothing is redacted or rewritten for any party.
          </p>
        </section>

        {/* ── How it works — three-step flow ─────────────────────────── */}
        <section
          className="mb-14 rounded-xl border border-hairline bg-paper-raised p-6 sm:p-8"
          aria-label="How the shared case record works"
        >
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-slate">
            How it works
          </p>

          <ol className="relative space-y-0">
            {/* Step 1 */}
            <li className="relative flex gap-5 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-ink font-mono text-xs font-bold text-paper"
                >
                  1
                </span>
                <span className="mt-1 flex-1 border-l-2 border-dashed border-hairline" aria-hidden />
              </div>
              <div className="pb-2 pt-0.5">
                <p className="text-sm font-semibold text-ink">Hospital submits the case</p>
                <p className="mt-1 text-sm text-slate">
                  Patient details, procedure code, cost estimate, and supporting documents.
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg border border-hairline bg-paper px-3 py-2">
                  <span className="font-mono text-xs text-slate">Estimated cost</span>
                  <span className="font-mono text-xs font-semibold text-ink">₹1,85,000</span>
                </div>
              </div>
            </li>

            {/* Step 2 */}
            <li className="relative flex gap-5 pb-8 last:pb-0">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-slate bg-paper font-mono text-xs font-bold text-slate"
                >
                  2
                </span>
                <span className="mt-1 flex-1 border-l-2 border-dashed border-hairline" aria-hidden />
              </div>
              <div className="pb-2 pt-0.5">
                <p className="text-sm font-semibold text-ink">Objectivity agent checks every number</p>
                <p className="mt-1 text-sm text-slate">
                  The estimate is cross-referenced against the CGHS rate list. Coverage exclusions
                  are checked against policy terms. No manual step — this happens before the
                  insurer&apos;s queue.
                </p>
                <div className="mt-2">
                  <VerificationStamp status="verified" verb="Verified" label="CGHS rate list" />
                </div>
              </div>
            </li>

            {/* Step 3 */}
            <li className="relative flex gap-5">
              <div className="flex flex-col items-center">
                <span
                  aria-hidden
                  className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-verified bg-verified font-mono text-xs font-bold text-paper"
                >
                  ✓
                </span>
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-ink">All three parties read the same file</p>
                <p className="mt-1 text-sm text-slate">
                  Patient, hospital, and insurer each see the verified case — same numbers, same
                  timeline, same stamps. No version is softer or harder than another.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(['Hospital', 'Patient', 'Insurer'] as const).map((role) => (
                    <span
                      key={role}
                      className="rounded-full border border-hairline bg-paper px-3 py-1 text-xs font-semibold text-slate"
                    >
                      {role}
                    </span>
                  ))}
                  <span className="rounded-full border border-verified/40 bg-verified-tint px-3 py-1 text-xs font-semibold text-verified">
                    Same record
                  </span>
                </div>
              </div>
            </li>
          </ol>
        </section>

        {/* ── Role entry cards ────────────────────────────────────────── */}
        <section aria-labelledby="role-cards-heading">
          <p
            id="role-cards-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate"
          >
            Choose a role to explore
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <RoleCard
              href="/hospital"
              title="Hospital"
              action="Submit a new case"
              description="Enter patient details, cost estimate, and supporting documents. The objectivity check runs automatically."
              accent="border-l-ink"
              badge={{ text: 'Submitter', tone: 'ink' }}
            />
            <RoleCard
              href="/patient"
              title="Patient"
              action="View your case"
              description="See exactly what the insurer sees — the ledger, coverage, financing options, and the full shared timeline."
              accent="border-l-verified"
              badge={{ text: 'Your record', tone: 'verified' }}
            />
            <RoleCard
              href="/insurer"
              title="Insurer"
              action="Review and decide"
              description="Read the verified case file and take a decision. Every action is appended to the shared timeline immediately."
              accent="border-l-slate"
              badge={{ text: 'Decision maker', tone: 'slate' }}
            />
          </div>
        </section>

        {/* ── Verification callout ────────────────────────────────────── */}
        <section className="mt-10 flex items-start gap-3 rounded-lg border border-hairline bg-paper-raised p-4">
          <VerificationStamp status="verified" verb="Verified" label="every figure has a source" />
          <p className="text-sm text-slate">
            Look for this stamp anywhere a number has been checked against a real source. Pending
            items show an amber outline instead.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-paper-raised">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <p className="text-sm text-slate">
            <span className="font-semibold text-ink">Need help? </span>
            If you disagree with a decision on this case, you can contact your policy&apos;s
            grievance officer, or your state&apos;s insurance ombudsman, to ask about next steps
            for escalation.
          </p>
        </div>
      </footer>
    </div>
  );
}

type RoleCardProps = {
  href: string;
  title: string;
  action: string;
  description: string;
  accent: string;
  badge: { text: string; tone: 'ink' | 'verified' | 'slate' };
};

const BADGE_TONE_CLASSES: Record<'ink' | 'verified' | 'slate', string> = {
  ink: 'bg-ink-tint text-ink ring-ink/15',
  verified: 'bg-verified-tint text-verified ring-verified/25',
  slate: 'bg-paper text-slate ring-hairline',
};

function RoleCard({ href, title, action, description, accent, badge }: RoleCardProps) {
  return (
    <Link
      href={href}
      className={`group flex flex-col rounded-xl border border-hairline border-l-4 bg-paper-raised p-5 transition-colors hover:bg-ink-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink ${accent}`}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-base font-semibold text-ink">{title}</span>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${BADGE_TONE_CLASSES[badge.tone]}`}
        >
          {badge.text}
        </span>
      </div>
      <span className="mt-2 flex-1 text-sm leading-snug text-slate">{description}</span>
      <span className="mt-5 text-sm font-semibold text-ink group-hover:underline">
        {action} →
      </span>
    </Link>
  );
}
