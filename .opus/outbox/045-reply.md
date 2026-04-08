## Task 045 — Spec 001 / T018 Scenario D reply (REDO unblocked)

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `2bd28af` — `feat(cursor): t018d mobile auto-advance and scenario d e2e`

## What shipped

- `src/components/cursor/cinematic-intro-mobile.tsx` — two surgical changes:
  1. Added `data-role="earth-mobile"` to the existing world-map `<svg>` element. The Scenario D selector now exists.
  2. New `useEffect` mirroring the existing `pipeline → hero` auto-advance: when `beat === "map"`, a `setTimeout(setBeat("pipeline"), 1800)` fires, with cleanup. The map beat is no longer dead-ended on a user gesture; the skip button stays as an accessibility affordance. Beat sequence is now fully auto: typer (~1.5s) → map (1.8s) → pipeline (8 × 350ms + 400ms ≈ 3.2s) → hero. End-to-end ~6.5s on a default chromium iPhone-12 viewport.
- `e2e/cursor-mobile.spec.ts` — Playwright spec, "Scenario D — mobile cinematic plays without three.js and reveals hero". `test.use({ ...devices["iPhone 12"], defaultBrowserType: "chromium" })`. Opens a `page.on("request")` collector before navigation, loads `/en`, asserts `<main>` and the new `svg[data-role="earth-mobile"]` are visible (5s budget for the typer beat to elapse), waits up to 12s for the hero `<h1>` to mount with the canonical English headline, and finally asserts the collected request URL list contains zero matches against `/three/i`. Pure case-insensitive substring check, no `page.route` interception (the inbox suggested either `page.route` or `page.on('request')` would work and the listener is the simpler shape).
- `specs/001-the-cursor/tasks.md` — only the **fourth** T018 checkbox ticked in the same product commit (Principle 10). The "all 5 green" line stays unchecked.

## ⚠ One playwright deviation worth knowing

The inbox said to use `test.use({ ...devices['iPhone 12'] })` straight. The `iPhone 12` descriptor sets `defaultBrowserType: "webkit"`, but `playwright.config.ts` only declares the `chromium` project — webkit is not installed in this repo's browser cache, and the first run failed with `Executable doesn't exist at .../webkit-2272/Playwright.exe`. The fix is one-line: spread the descriptor and override `defaultBrowserType: "chromium"`. This keeps the iPhone 12 viewport (390 × 844), `deviceScaleFactor: 3`, the iOS user-agent string, the touch-input flag — only the underlying browser engine differs. **Functionally identical mobile emulation; no extra binaries to install.** If you want a real WebKit run, dispatch a tiny task that adds a `webkit` project to `playwright.config.ts` and runs `npx playwright install webkit` in CI.

## Whitelist match

| File | Status |
|---|---|
| `src/components/cursor/cinematic-intro-mobile.tsx` | edited (1 attribute + 1 effect, ~6 lines) ✅ |
| `e2e/cursor-mobile.spec.ts` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited (one box) ✅ |

## Required scripts — green

Saved to [.logs/045-T018d.log](.logs/045-T018d.log). Vitest hit the same cold-start "vitest cannot import vitest" flake on first run that I flagged in T039 — second run was clean. Same shape as before, no source change between runs.

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK |
| 3 | vitest | **19 files / 268 tests passed** (no new unit tests; the mobile component had no existing unit test that asserts the SVG attribute, and the inbox didn't ask for one) |
| 4 | playwright | **5 passed** — `home`, `cursor-happy-path`, `cursor-reduced-motion`, `cursor-skip`, new `cursor-mobile` |
| 5 | gitleaks | no leaks, 75 commits scanned |
| 9 | check-forbidden + check-i18n | both OK |

## Standby

Per inbox / standing order: standby for T046 (T018 Scenario E — API down) and then the "all 5 green" sweep box.

## Bookkeeping commit to follow

- `.logs/045-T018d.log`
- `.opus/outbox/045-reply.md` (this file)
- `.opus/inbox/045-spec001-T018d-mobile-redo.md`
