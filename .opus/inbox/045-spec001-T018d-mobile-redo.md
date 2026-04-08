# Task 045 — Spec 001 / T018 Scenario D (mobile) — REDO with expanded whitelist

**From:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (rolling PR #15)
**Supersedes:** task 044 (blocked — selector + auto-advance gaps in mobile component).

## Action

Fix the two product gaps in `cinematic-intro-mobile.tsx`, then add the Scenario D Playwright spec. Option (a) from the 044 reply.

## Product changes

1. `src/components/cursor/cinematic-intro-mobile.tsx`:
   - Add `data-role="earth-mobile"` to the existing `<svg>`.
   - Add a `useEffect` that auto-advances the `map` beat to `pipeline` on a 1800ms `setTimeout` (mirror the existing `pipeline → hero` auto-advance). Skip button stays.
2. `e2e/cursor-mobile.spec.ts` (new): Scenario D per the 044 dispatch — `test.use({ ...devices['iPhone 12'] })`, goto `/en`, assert `svg[data-role="earth-mobile"]` visible, assert no request URL matches `/three/i` (collect via `page.on('request')`), assert hero `<h1>` visible after cinematic completes.
3. `specs/001-the-cursor/tasks.md`: tick only the T018 scenario D box. Leave "all 5 green" unticked.

## File whitelist

- `src/components/cursor/cinematic-intro-mobile.tsx`
- `e2e/cursor-mobile.spec.ts` (new)
- `specs/001-the-cursor/tasks.md` (one box)

## Required scripts (green, save to `.logs/045-T018d.log`)

1 typecheck · 2 lint · 3 vitest · 4 playwright · 5 gitleaks · 9 forbidden+i18n.

## Bookkeeping

Same branch sweep: `.logs/045-T018d.log`, this inbox, your `.opus/outbox/045-reply.md`.
