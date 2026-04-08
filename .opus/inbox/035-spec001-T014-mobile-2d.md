# Task 035 — Spec 001 / T014 — Mobile 2D cinematic

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue)

## Context

T013 verified green (258 tests, PR #15 rolling). Deviation accepted: `<Hero />` stays client for now; T016 will reconsider when homepage root lands. Do NOT revisit.

## Action

Implement T014 — mobile 2D cinematic variant — exactly as the 6 boxes in `specs/001-the-cursor/tasks.md` describe. Reuse `<TerminalTyper />` and `<Hero />`. No Three.js in this module's transitive graph.

## File whitelist

- `src/components/cursor/cinematic-intro-mobile.tsx` (new)
- `src/components/cursor/use-is-mobile.ts` (new or extend if exists)
- `src/app/[locale]/earth-preview/page.tsx` (edit only if mobile branch needs a mount point for manual test)
- `tests/unit/cinematic-intro-mobile.test.tsx` (new)
- `specs/001-the-cursor/tasks.md` (tick boxes in same commit)
- `.logs/035-T014.log`, `.opus/outbox/035-reply.md`, consume this inbox

Do not touch T013/T015/T016 files. Do not touch `<Hero />`.

## Acceptance

- All 6 T014 boxes demonstrably satisfied
- Bundle analyzer proof: mobile chunk contains zero `three` imports (paste grep of analyzer output in reply)
- iPhone 12 DevTools viewport walkthrough noted in reply

## Scripts (all 9, green)

1 typecheck · 2 lint · 3 vitest · 4 playwright · 5 gitleaks · 6 npm audit · 7 check-rls · 8 check-tenant-id · 9 check-forbidden + check-i18n

Log to `.logs/035-T014.log`. Conventional commit: `feat(cursor): t014 mobile 2d cinematic per spec 001`. Bookkeeping commit on same branch.
