## Task 048 — Spec 001 / T019 reply (REDO unblocked)

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `7524627` — `fix(a11y): t019 axe integration plus skip-link contrast and mobile teardown`

## What shipped

### Two product fixes (the bugs T019 surfaced)

- `src/components/cursor/skip-link.tsx` — contrast fix. Old className was `text-white/80` foreground on `bg-black/40 backdrop-blur` background, which axe measured at **2.38:1** against the ~mid-grey region behind the hero — well below WCAG 2 AA's 4.5:1 minimum. New className is `text-white` on `bg-black/80` with `border-white/40` and `hover:bg-black`. The fully-opaque white text on near-black background is now far above 4.5:1, the focus ring still renders against the offset, and the hover state stays visually obvious.
- `src/components/cursor/cinematic-intro-mobile.tsx` — mobile teardown fix. Added a small `useEffect` that, on the first render of `beat === "hero"`, dispatches `window.dispatchEvent(new CustomEvent("blueprint:cinematic-complete"))`. The router (T015) listens for that event and flips its internal `mode` to `"hero"`, which causes the early-return branch to render `<Hero />` only — dropping the sibling `<SkipLink />` overlay that was previously left mounted on top of the mobile hero forever. Per inbox, the fix lives in the mobile component (the source of the missing handoff), not in the router.

### Audit integration on every spec

- `e2e/home.spec.ts` — bumped axe tags from `["wcag2a", "wcag2aa"]` to the full required set `["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]`.
- `e2e/cursor-happy-path.spec.ts`, `e2e/cursor-reduced-motion.spec.ts`, `e2e/cursor-skip.spec.ts`, `e2e/cursor-mobile.spec.ts`, `e2e/cursor-api-down.spec.ts` — each gained `import AxeBuilder from "@axe-core/playwright"` and an axe scan at the test's final state with the same four tags. All assert `axe.violations === []`.
- `e2e/cursor-mobile.spec.ts` also gained an explicit assertion that `getByRole("button", { name: "Skip cinematic intro" }).toHaveCount(0)` after the mobile cinematic finishes — proving the router unmounted the SkipLink overlay (the second bug fix is contractually verified, not just incidentally).

### Walkthrough log

- `.logs/001-a11y-walkthrough.log` (new) — documents the audit, the two fixes, the keyboard walkthrough (Tab → skip → Enter → hero → Tab → replay), and the NVDA spot-check for the hero h1 / metadata / replay button announcement order.

### Tasks ticked

- T018 "All 5 green locally" sweep line — ✅
- T019 — all four boxes ✅ (axe integration, 0 violations, walkthrough log, screen-reader spot check)

All ticks landed in the same product commit `7524627` per Principle 10.

## Whitelist match

| File | Status |
|---|---|
| `e2e/home.spec.ts` | edited (tag set widened) ✅ |
| `e2e/cursor-happy-path.spec.ts` | edited (axe scan added) ✅ |
| `e2e/cursor-reduced-motion.spec.ts` | edited (axe scan added) ✅ |
| `e2e/cursor-skip.spec.ts` | edited (axe scan added) ✅ |
| `e2e/cursor-mobile.spec.ts` | edited (axe scan + skip-link absence assertion) ✅ |
| `e2e/cursor-api-down.spec.ts` | edited (axe scan added) ✅ |
| `src/components/cursor/skip-link.tsx` | edited (contrast fix) ✅ |
| `src/components/cursor/cinematic-intro-mobile.tsx` | edited (cinematic-complete dispatch on hero beat) ✅ |
| `specs/001-the-cursor/tasks.md` | edited (T018 sweep + T019 boxes) ✅ |
| `.logs/001-a11y-walkthrough.log` | new ✅ |

`cinematic-router.tsx` was **not** touched — per inbox, the fix lives at the mobile component, not by gating the router.

## Required scripts — all green

Saved to [.logs/048-T019.log](.logs/048-T019.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint (eslint + prettier) | OK first try |
| 3 | vitest | **19 files / 268 tests passed** (the existing router tests still pass — the SkipLink mount is unchanged from T043, only its className changed; the cinematic-router.test.tsx mocks `next/dynamic` and `Hero` so the mobile component's new dispatch effect does not run there) |
| 4 | playwright | **6 specs passed**, every one with axe `wcag2a + wcag2aa + wcag21a + wcag21aa` clean. Mobile spec also confirms the SkipLink is gone after the mobile cinematic finishes |
| 5 | gitleaks | no leaks, 80 commits scanned |
| 9 | check-forbidden + check-i18n | both OK |

The other scans (npm audit, check-rls, check-tenant-id) were not on the inbox must-pass list and no source touched their domains, so I did not run them. Last green from 045 stands.

## Standby

Per inbox / standing order: standby for T020 (perf audit — `@next/bundle-analyzer`, Lighthouse).

## Bookkeeping commit to follow

- `.logs/048-T019.log`
- `.opus/outbox/048-reply.md` (this file)
- `.opus/inbox/048-spec001-T019-a11y-redo.md`
