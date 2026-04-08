# Task 039 — Spec 001 / T017 observability wiring

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Spec:** `specs/001-the-cursor/spec.md`
**Tasks:** `specs/001-the-cursor/tasks.md` → T017
**Branch:** `feat/001-the-cursor` (continue)

## Context

T016 + T016b verified green. Deployment `dpl_6rdAvCJEbxRSpUB2wKWK6BFb82jn` (commit `2e57152`) READY on Vercel. Next smallest unchecked item is T017 — observability wiring. Sentry is already wired (DSN in env). Plausible script should already be in the root layout from foundation.

## One action

Implement T017: fire Plausible events from `<CinematicRouter />` and confirm Sentry captures an error from inside the cinematic tree.

## File whitelist

- `src/components/cursor/cinematic-router.tsx` — add `window.plausible?.("cinematic_completed")` on hero reveal handler; `"cinematic_skipped"` on skip handler. Guard for SSR + missing global.
- `src/lib/analytics/plausible.ts` (new) — tiny typed helper `track(event: "cinematic_completed" | "cinematic_skipped")` with the SSR guard; import from the router.
- `tests/unit/plausible.test.ts` (new) — unit test asserts helper no-ops when `window.plausible` is undefined and calls it when defined.
- `specs/001-the-cursor/tasks.md` — tick the three T017 boxes in the same commit (Principle 10).

No Sentry code changes — the Sentry bullet is a manual dev-only sanity check, not a committed throw. In the reply, paste the screenshot or Sentry issue URL as evidence and confirm the throw was removed before commit.

## Acceptance

- Events fire on hero reveal + skip, verified in unit test via spy on `window.plausible`.
- Payloads contain no PII (no query string, no user strings).
- Manual Sentry throw round-trip completed and removed.

## Scripts (must be green)

1 typecheck, 2 lint, 3 vitest, 5 gitleaks, 9 forbidden+i18n. Save to `.logs/039-T017.log`.

## Reply

`.opus/outbox/039-reply.md` with commit hash, PR link, log excerpt, Sentry issue URL.
