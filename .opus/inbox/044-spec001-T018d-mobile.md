# Task 044 — Spec 001 / T018 Scenario D (mobile)

**From:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (rolling PR #15)
**Verified prior:** task 043 green — dpl_9Eihr3DcA7ZLqVkb92vXVBEV3YVt READY at `f82cdd8`.

## Action

Add Playwright spec `e2e/cursor-mobile.spec.ts` covering Scenario D from `specs/001-the-cursor/spec.md`.

## Requirements

- Use the iPhone 12 device descriptor (`devices['iPhone 12']`) via a per-test `test.use({ ...devices['iPhone 12'] })`.
- Navigate to `/en`. Wait for cinematic mount.
- Assert: `svg[data-role="earth-mobile"]` is visible (the 2D mobile path from T014).
- Assert via `page.route('**/*', ...)`: NO request URL contains `three` (three.js chunk must NOT load on mobile). Implement by collecting matched request URLs and asserting none match `/three/i`.
- Assert hero `<h1>` becomes visible after the mobile cinematic completes.
- Tick the T018 scenario D checkbox in `specs/001-the-cursor/tasks.md` in the same product commit (Principle 10). Leave the "all 5 green" line unticked.

## File whitelist

- `e2e/cursor-mobile.spec.ts` (new)
- `specs/001-the-cursor/tasks.md` (one box)

## Required scripts (must be green, save to `.logs/044-T018d.log`)

1 typecheck · 2 lint · 4 playwright · 5 gitleaks · 9 forbidden+i18n. Run vitest if any touched module is unit-tested.

## Bookkeeping

After product commit, sweep `.logs/044-T018d.log`, this inbox file, and your `.opus/outbox/044-reply.md` on the same branch.
