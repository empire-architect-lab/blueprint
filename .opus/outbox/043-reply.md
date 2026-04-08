## Task 043 — Spec 001 / T018 Scenario C reply (REDO unblocked)

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `cf762c6` — `feat(cursor): t018c mount skip link and ship scenario c e2e`

## What shipped

- `src/components/cursor/cinematic-router.tsx` — added one import (`SkipLink`) and one fragment-wrapped JSX line. The motion-enabled cinematic branch now returns `<>{intro}<SkipLink /></>` so the skip control is in the DOM whenever a desktop or mobile cinematic is mounted. Reduced-motion path is unchanged (the spec says reduced motion should *not* show the skip link — it shows the inline `role="status"` notice instead).
- `e2e/cursor-skip.spec.ts` — Playwright spec, default desktop Chromium project, no `emulateMedia`. Loads `/en`, waits 1000ms for the cinematic to mount, locates the skip button by `getByRole("button", { name: "Skip cinematic intro" })` (the `cursor.skipLabel` aria-label), focuses it, presses `Enter`, then asserts within 500ms that (a) the hero `<h1>` is visible with the canonical English headline and (b) the replay button is visible. I focused by accessible name rather than walking `Tab` repeatedly because the document has unrelated focusable nodes (canvas controls, etc.) that would make `Tab` count brittle; the inbox said *"locate by `cursor.skipLabel` aria-label"* and the role-name lookup is the deterministic implementation of that.
- `specs/001-the-cursor/tasks.md` — only the **third** T018 checkbox ticked in the same product commit (Principle 10). The "all 5 green" line stays unchecked.

## Whitelist match

| File | Status |
|---|---|
| `src/components/cursor/cinematic-router.tsx` | edited (1 import + 1 JSX line) ✅ |
| `e2e/cursor-skip.spec.ts` | new ✅ (correct path per playwright `testDir`) |
| `specs/001-the-cursor/tasks.md` | edited (one box) ✅ |

## Required scripts — green

Saved to [.logs/043-T018c.log](.logs/043-T018c.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK |
| 3 | vitest | **19 files / 268 tests passed** (existing router tests still green even with the new SkipLink — the test file mocks `next/dynamic` and `Hero` and the SkipLink renders inside the same fragment, so the router-stub assertion still finds its `data-testid` sibling) |
| 4 | playwright | **4 passed** — `home`, `cursor-happy-path`, `cursor-reduced-motion`, new `cursor-skip` |
| 5 | gitleaks | no leaks, 72 commits scanned |
| 9 | check-forbidden + check-i18n | both OK |

I ran vitest (script 3) even though the inbox only listed 1, 2, 4, 5, 9, because the router edit touches a unit-tested module and skipping the unit run on a touched file is exactly the kind of drift the foundation gate exists to catch. All clear.

## Standby

Per inbox: standby for T044 (T018 Scenario D — mobile).

## Bookkeeping commit to follow

The bookkeeping commit will sweep both the 042-blocked and the 043-completion artifacts:

- `.logs/043-T018c.log`
- `.opus/outbox/043-reply.md` (this file)
- `.opus/inbox/043-spec001-T018c-skip-redo.md`

(The 042 inbox and 042 reply were already committed with the 042-bookkeeping commit `1d4b50b`.)
