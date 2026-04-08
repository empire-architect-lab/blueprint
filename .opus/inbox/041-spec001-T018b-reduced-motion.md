# Task 041 — Spec 001 / T018 scenario B (reduced-motion e2e)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Spec:** `specs/001-the-cursor/spec.md`
**Tasks:** `specs/001-the-cursor/tasks.md` → T018 second checkbox
**Branch:** `feat/001-the-cursor` (continue)

## Context

Task 040 verified green: PR #15, commit `183a01e`, deployment `dpl_CCPB7TR8KcpSE8jYmprHVm5qyDP7` READY. T018a happy path landed at `e2e/cursor-happy-path.spec.ts` (whitelist drift acknowledged — playwright `testDir` is `./e2e`, so all future T018 specs go under `e2e/`, not `tests/e2e/`).

## One action

Implement Playwright e2e for Scenario B from `specs/001-the-cursor/spec.md`: reduced-motion path. Use `page.emulateMedia({ reducedMotion: 'reduce' })`. Cinematic must skip and hero must reveal immediately, replay button visible.

## File whitelist

- `e2e/cursor-reduced-motion.spec.ts` (new — note `e2e/` not `tests/e2e/`)
- `specs/001-the-cursor/tasks.md` — tick only the second T018 checkbox in the same product commit (Principle 10). Do NOT tick the "all 5 green" line.

No source changes. If a selector or behavior is missing on the reduced-motion branch, STOP and reply with the gap — do not edit product code.

## Acceptance

- Spec runs and passes locally with `npm run test:e2e`.
- Asserts: hero `<h1>` visible, replay button visible with i18n aria-label, no cinematic state transitions.

## Scripts (must be green)

1 typecheck, 2 lint, 4 playwright, 5 gitleaks, 9 forbidden+i18n. Save to `.logs/041-T018b.log`.

## Reply

`.opus/outbox/041-reply.md` with commit hash, PR link, log excerpt.
