# Task 037 — Spec 001 / T016 Homepage integration

**Branch:** `feat/001-the-cursor` (continue rolling PR #15)
**Prereq:** T015 green (router lives at `src/components/cursor/cinematic-router.tsx`).

## Action

Replace Next.js default homepage with the cinematic router mount.

## Whitelist

- `src/app/page.tsx` — rewrite
- `tests/unit/page.test.tsx` — new (smoke test: renders `<main>`, mounts `CinematicRouter`)
- `specs/001-the-cursor/tasks.md` — tick T016 boxes

Do NOT touch `cinematic-router.tsx`, `hero.tsx`, layout, or metadata files outside `page.tsx`.

## Acceptance

- `page.tsx` is a server component exporting `metadata = { title: "Blueprint Lab", description: <ROADMAP pitch line> }` and a default function returning `<main className="min-h-screen bg-black text-white"><CinematicRouter /></main>`. The router already owns Hero rendering, so do NOT also render `<Hero />` here — note this deviation from the spec line in your reply (router-owns-hero is correct per T015).
- Unit test mocks `CinematicRouter` and asserts `<main>` exists with the right classes.
- Manual 4-path walkthrough is REPLACED by: existing T012/T015 unit tests + a new minimal Playwright check that `/` returns 200 and contains `<main>`. No human gate.

## Scripts that must pass (all 9)

typecheck, lint, vitest, playwright, gitleaks, npm audit, check-rls, check-tenant-id, check-forbidden + check-i18n.

## Bookkeeping

Same commit pattern: product commit + bookkeeping commit with `.logs/037-T016.log`, this inbox file, and `.opus/outbox/037-reply.md`.

Standby after green for T017 observability.
