# Task 040 — Spec 001 / T018 scenario A (happy path e2e)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Spec:** `specs/001-the-cursor/spec.md`
**Tasks:** `specs/001-the-cursor/tasks.md` → T018 first checkbox
**Branch:** `feat/001-the-cursor` (continue)

## Context

Task 039 / T017 verified green. Deployment `dpl_AYVSfgNLkzSX3uGJJThzcPoUf1mH` (commit `c563cda8`) READY on Vercel. Next smallest unchecked item is T018 scenario A — the cinematic happy path e2e. Splitting T018 into 5 dispatches; this is the first.

## One action

Implement Playwright e2e for Scenario A from `specs/001-the-cursor/spec.md`: load `/en`, cinematic plays start to finish, hero reveal asserted, replay button visible.

## File whitelist

- `tests/e2e/cursor-happy-path.spec.ts` (new)
- `specs/001-the-cursor/tasks.md` — tick only the first T018 checkbox in the same commit (Principle 10). Do NOT tick the "all 5 green" line.

No source changes. If a test selector is missing on hero/replay, STOP and reply with the gap — do not edit product code.

## Acceptance

- New spec runs and passes locally with `npm run test:e2e` against the dev server.
- No reduced-motion / mobile / mocking — pure desktop happy path.
- Test asserts: cinematic mounts, then hero `<h1>` is visible, then replay button visible with its aria-label.

## Scripts (must be green)

1 typecheck, 2 lint, 4 playwright, 5 gitleaks, 9 forbidden+i18n. Save to `.logs/040-T018a.log`.

## Reply

`.opus/outbox/040-reply.md` with commit hash, PR link, log excerpt.
