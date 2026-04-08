# Task 038 — Spec 001 / T016 fix: mount router at locale route

**Branch:** `feat/001-the-cursor` (continue rolling PR #15)
**Why:** next-intl middleware rewrites `/` → `/[locale]` before `src/app/page.tsx` is reached. The T016 ship therefore never mounts the cinematic router for real users. Confirmed in 037-reply. Literal-whitelist interpretation was correct, this is the follow-up.

## Action

Move the T016 homepage body to the locale route. Keep the root file as a no-op fallback so it does not 404 if middleware ever changes.

## Whitelist

- `src/app/[locale]/page.tsx` — rewrite to the same body as current `src/app/page.tsx` (server component, same metadata, `<main className="min-h-screen bg-black text-white"><CinematicRouter /></main>`)
- `src/app/page.tsx` — reduce to a minimal redirect/no-op (re-export or `redirect("/en")` — your call, smallest viable)
- `tests/unit/locale-page.test.tsx` — new, mirror of existing `tests/unit/page.test.tsx` against the locale page
- `e2e/home.spec.ts` — add one assertion that `/en` response contains `<main>` (you already navigate there)
- `specs/001-the-cursor/tasks.md` — add a T016b note linking this fix

Do NOT touch `cinematic-router.tsx`, `hero.tsx`, layouts, middleware, or routing config.

## Acceptance

- Visiting `/` (which redirects to `/en`) renders `<main>` with `CinematicRouter` mounted.
- Locale page unit test passes; `/en` e2e asserts `<main>` present.
- Existing 266 tests still pass.

## Scripts (all 9 must pass)

typecheck, lint, vitest, playwright, gitleaks, npm audit, check-rls, check-tenant-id, check-forbidden + check-i18n.

## Bookkeeping

Product commit + bookkeeping commit with `.logs/038-T016b.log`, this inbox file, `.opus/outbox/038-reply.md`. Standby for T017 after green.
