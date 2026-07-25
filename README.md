# Care Mediator

A healthcare insurance mediator app with three role-scoped views —
Hospital, Patient, Insurer — sharing one case record. Next.js (App
Router) + TypeScript + Tailwind frontend, Express + TypeScript backend.

## Run it

This app needs **both** servers running — the frontend calls the
backend over HTTP, there's no more local fake data.

```bash
# Terminal 1 — backend (port 4000)
cd backend
npm install
cp .env.example .env
npm run dev

# Terminal 2 — frontend (port 3000), from the repo root
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The amber **DEV**
switcher (bottom-right, every page) lets you flip between demo cases —
it lists whatever the backend currently has, starting with the two
seeded ones (`clean-case`, `gotcha-case`) plus anything you submit
through the Hospital view.

If the backend isn't running, pages show a clear "could not reach the
backend" error instead of failing silently — start it and reload.

See [`backend/README.md`](backend/README.md) for the API reference and
what the domain logic (CGHS rate checks, policy-terms lookup,
objectivity check, financing offers) actually does.

## Structure

```
app/            Next.js App Router pages (/, /hospital, /patient, /insurer)
components/     UI components — Ledger, CoverageExplainerCard, LoanOffers,
                the three-rail case-file shell, VerificationStamp, etc.
lib/            types.ts (shared data contract), api.ts (backend client),
                case-context.tsx (shared case state), utils.ts
backend/        Express API — see backend/README.md
```

## Learn more about the stack

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
