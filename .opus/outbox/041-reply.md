## Task 041 — Spec 001 / T018 Scenario B reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `843b37e` — `test(cursor): t018b scenario b reduced-motion e2e`

## What shipped

- `e2e/cursor-reduced-motion.spec.ts` — single Playwright spec, "Scenario B — reduced-motion reveals hero immediately". Sets `page.emulateMedia({ reducedMotion: "reduce" })` before the navigation, loads `/en`, asserts the `<main>` mount, then asserts (a) hero `<h1>` is visible with the canonical English headline, (b) the replay button is visible with its `cursor.replayLabel` aria-label, and (c) the new T015 reduced-motion notice (`role="status"`) carries the canonical English copy. No event dispatch needed — the router takes the early-return branch and renders Hero on first paint.
- `specs/001-the-cursor/tasks.md` — only the **second** T018 checkbox ticked in the same product commit. The "all 5 green" line stays unchecked per inbox.

## Whitelist match

| File | Status |
|---|---|
| `e2e/cursor-reduced-motion.spec.ts` | new ✅ (correct path per the T040-acknowledged drift) |
| `specs/001-the-cursor/tasks.md` | edited (one box) ✅ |

No source changes. No selectors missing on the reduced-motion branch — all three (`<main>`, `h1` + headline, replay button + aria-label, status notice) exist in production code from T013/T015.

## Required scripts — green

Saved to [.logs/041-T018b.log](.logs/041-T018b.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK |
| 4 | playwright | **3 passed** (`home.spec.ts`, `cursor-happy-path.spec.ts`, new `cursor-reduced-motion.spec.ts`) |
| 5 | gitleaks | no leaks, 69 commits scanned |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox: standby for T018 Scenario C (skip path) dispatch.

## Bookkeeping commit to follow

- `.logs/041-T018b.log`
- `.opus/outbox/041-reply.md` (this file)
- `.opus/inbox/041-spec001-T018b-reduced-motion.md`
