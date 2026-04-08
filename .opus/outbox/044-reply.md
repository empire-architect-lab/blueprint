## Task 044 — Spec 001 / T018 Scenario D reply — **BLOCKED, no product commit**

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft, no new product commit on this task)
**Status:** STOPPED — two gaps in product wiring, see below.

## The gaps

### Gap 1 — `data-role="earth-mobile"` selector does not exist

The inbox says *"Assert: `svg[data-role="earth-mobile"]` is visible (the 2D mobile path from T014)"*. The mobile cinematic SVG in `src/components/cursor/cinematic-intro-mobile.tsx` is currently:

```tsx
<svg viewBox="0 0 460 200" className="w-full max-w-md" aria-hidden="true">
  <path d={WORLD_PATH} ... />
  <circle cx={...} cy={...} r="4" fill="#ffaa00"> ... </circle>
</svg>
```

There is no `data-role` attribute. T014 shipped the mobile component to a different visual contract — the only `data-role` in the cursor module is `data-role="earth"` on the desktop earth wrapper (T009/T010). The whitelist forbids editing `cinematic-intro-mobile.tsx`, so I cannot add the attribute in this task.

### Gap 2 — the mobile cinematic does not auto-complete to hero on its own

The inbox says *"Assert hero `<h1>` becomes visible after the mobile cinematic completes"*. Looking at how T014 wired the beats:

| Beat | How it advances |
|---|---|
| `typer` | `<TerminalTyper />`'s `onComplete` callback fires after the 50ms-per-char interval finishes — auto |
| `map` | **Only via the user clicking the skip button** — no auto-advance |
| `pipeline` | 350ms `setInterval` walks through 8 nodes, then `setTimeout(... 400ms)` to `hero` — auto |
| `hero` | Renders `<Hero />` |

So with no user input, the beat sequence stalls forever at `map`. A Playwright test running default-Chromium-with-iPhone-viewport would never see `hero` reveal. The skip-button click would also be needed *before* the test can assert "no `three` requests post-completion", which makes the route-interception window weird.

The whitelist forbids editing `cinematic-intro-mobile.tsx`, so I cannot give the map beat an auto-advance timer in this task either.

## Why both gaps are real product issues

Gap 1 is a missing selector contract that the spec assumed but T014 shipped without — easy fix, one attribute. Gap 2 is more substantive: the mobile cinematic's middle beat is **dead-ended without a user gesture**, which means a real mobile user who never taps skip stays stuck on the world map forever. That is itself a bug worth catching, and Scenario D is exactly the kind of test that should surface it.

Per the same STOP-and-report pattern from T042, I have **not committed any test, not ticked the T018 fourth checkbox, and not modified any source file**.

## What I need from you

A redo with the right whitelist. The smallest viable patch:

1. **`src/components/cursor/cinematic-intro-mobile.tsx`** — add `data-role="earth-mobile"` to the `<svg>` (one attribute), and add a `useEffect` that auto-advances `map` → `pipeline` on a 1500–2000ms `setTimeout` (mirror of how `pipeline` already auto-advances). The skip button can stay for accessibility.
2. **`e2e/cursor-mobile.spec.ts`** — the test I would have written, gated on the new selector + auto-flow.
3. **`specs/001-the-cursor/tasks.md`** — tick only the T018-D box.

Three options for how you dispatch this:

- **(a)** A single redo of T044 with the whitelist above. Recommended.
- **(b)** A tiny fix-only task on the mobile component, then re-dispatch T044 with the test. Two round-trips.
- **(c)** Drop the iPhone-viewport-and-route-intercept rigour, ship the spec as a stub that just asserts the mobile component mounts under the iPhone descriptor, and let a later task wire the real auto-advance. Less faithful to spec.scenarioD.

I would lean (a). Both gaps are surface bugs the cinematic-intro test is supposed to catch, and the whitelist for option (a) is still tightly bounded (one component file, one new e2e file, one tasks.md tick).

## Required scripts — not run

Nothing was changed; the repo is at `f82cdd8` (last green). Running scripts on no-op would be wasted CI cycles. Last green readout from 043:

- typecheck OK · lint OK · vitest 19 files / 268 tests · playwright 4 specs · gitleaks · forbidden+i18n

[.logs/044-T018d.log](.logs/044-T018d.log) is a one-liner explaining the stop.

## Bookkeeping commit to follow

Same task-018 rule even with no product commit:

- `.logs/044-T018d.log`
- `.opus/outbox/044-reply.md` (this file)
- `.opus/inbox/044-spec001-T018d-mobile.md`

## Standby

Awaiting your call on options (a) / (b) / (c).
