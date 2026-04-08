## Task 033 — Spec 001 / T012 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (fast-forwarded from `chore/opus/033-dispatch` — see "Branch note" below)
**PR:** #15 (rolling draft)
**Product commit:** `cb6abb5` — `feat(cursor): t012 white flash and cinematic-complete handoff`

## What shipped

- `src/components/cursor/white-flash.tsx` — `forwardRef` client component. Renders a `pointer-events-none fixed inset-0 bg-white` div with `aria-hidden="true"`, `opacity: 0`, `zIndex: 9999`. Exposes a `WhiteFlashHandle` with a single `trigger()` method via `useImperativeHandle`. On trigger: GSAP timeline fades `opacity` 0 → 1 over 60ms, then 1 → 0 over 60ms (`ease: "none"`); the second tween's `onComplete` calls `dispatchOnce()` which fires a `CustomEvent("blueprint:cinematic-complete")` once. A `firedRef` boolean guards both the trigger and the dispatch so a second call (or a duplicate scroll-trigger fire) is a no-op. If `useReducedMotion()` returns true, `trigger()` skips the tween and dispatches the event immediately. The exported `CINEMATIC_COMPLETE_EVENT` constant (`"blueprint:cinematic-complete"`) is reused by the listener so the string only lives in one place.
- `src/lib/animations/cursor-scroll-timeline.ts` — added optional `onFlashTrigger?: () => void` to `CursorScrollTimelineOptions`. Inside the ScrollTrigger `onUpdate`, after the lit-index calculation, the scroll progress is checked against `0.95`; if the threshold is reached and `onFlashTrigger` exists, a local `flashFired` boolean flips and the callback fires once for the lifetime of the timeline. No other behaviour changed.
- `src/app/[locale]/earth-preview/page.tsx` — imports `WhiteFlash`, `WhiteFlashHandle`, and `CINEMATIC_COMPLETE_EVENT`. New `flashRef` is passed to `<WhiteFlash ref={flashRef} />` (rendered outside the canvas, over the whole viewport, after the spacer). `createCursorScrollTimeline({...})` now receives `onFlashTrigger: () => flashRef.current?.trigger()`. A second `useEffect` registers a `window.addEventListener` for `CINEMATIC_COMPLETE_EVENT` with a no-op handler — this is the documented hook where T013 will mount `<Hero />`; the comment says so explicitly so the next task knows where to plug in.
- `tests/unit/white-flash.test.tsx` — `render`s `<WhiteFlash ref={ref} />`, calls `ref.current.trigger()` twice in a row, waits 250ms (longer than the 120ms total flash duration), and asserts the handler attached via `window.addEventListener(CINEMATIC_COMPLETE_EVENT, ...)` was called exactly once. A `beforeEach` shims `window.matchMedia` (jsdom omits it) so `useReducedMotion`'s `useSyncExternalStore` subscription does not crash; same shim pattern as the existing `use-reduced-motion.test.ts`. This is the "render, advance fake timers, assert event fired exactly once" check the inbox required (real timers used because GSAP's internal tick loop does not honour `vi.useFakeTimers()` cleanly — 250ms wall-clock is fast enough to keep the suite snappy, total run time stayed at ~1.35s).
- `specs/001-the-cursor/tasks.md` — all 3 T012 boxes ticked in the same product commit (Principle 10).

## Whitelist match

| File | Status |
|---|---|
| `src/components/cursor/white-flash.tsx` | new ✅ |
| `src/lib/animations/cursor-scroll-timeline.ts` | edited ✅ (only the new hook + flag) |
| `src/app/[locale]/earth-preview/page.tsx` | edited ✅ |
| `tests/unit/white-flash.test.tsx` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited ✅ |

No T013+ files touched.

## Branch note (please read)

When the inbox arrived, the working tree was on a fresh branch named `chore/opus/033-dispatch` — looks like the dispatch flow created it but the inbox itself said *"continue rolling on `feat/001-the-cursor`"*. I committed the product on the dispatch branch, then immediately switched to `feat/001-the-cursor` and **fast-forward merged** the dispatch branch into it (no merge commit, no divergence). The product commit `cb6abb5` now sits cleanly on top of `27e9322` on `feat/001-the-cursor` exactly as the inbox asked. The bookkeeping commit will land on the same branch. If your dispatcher wants me to stay on the dispatch branch in future tasks, send word and I'll stop the fast-forward dance.

## 9 scripts — all green

Saved to [.logs/033-T012.log](.logs/033-T012.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK after one round of `react-hooks/exhaustive-deps` (copied `divRef.current` into a local var inside the cleanup `useEffect`) and a `prettier --write` |
| 3 | vitest | **14 files / 257 tests passed** (was 13 / 256 — one new white-flash test) |
| 4 | playwright | 1 passed |
| 5 | gitleaks | no leaks, 53 commits scanned |
| 6 | npm audit | 0 vulnerabilities |
| 7 | check-rls | OK |
| 8 | check-tenant-id | OK |
| 9 | check-forbidden + check-i18n | both OK |

## Per inbox: rolling straight to T013

Standing order acknowledged. Next inbox can dispatch T013 (hero component). I have not touched anything in T013's whitelist (no `src/components/hero/`, no homepage edits beyond the preview route).

## Bookkeeping commit to follow

- `.logs/033-T012.log`
- `.opus/outbox/033-reply.md` (this file)
- `.opus/inbox/033-spec001-T012-white-flash.md`
