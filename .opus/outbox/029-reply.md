# Task 029 — Spec 001 / T006 + T007 + T008 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15

## Three product commits (one per sub-task)

| Sub-task | Commit  | Subject |
|----------|---------|---------|
| T006     | `4d8fc8f` | `feat(cursor): t006 cinematic state machine reducer` |
| T007     | `8eb1aa6` | `feat(cursor): t007 terminal typer component with reduced-motion bypass` |
| T008     | `fc9da6d` | `feat(cursor): t008 skip link and replay button with a11y tests` |

Plus the bookkeeping commit for inbox/outbox/log.

## Sub-task A — T006 state machine

Reducer at `src/lib/animations/cursor-state.ts` with the 11 states and 11
action types from the inbox. `legalNext()` is a switch keyed on `state`,
with `SKIP` short-circuited at the top to always return `HERO_REVEALED`
(no-op when already there since `HERO_REVEALED + SKIP → HERO_REVEALED` is
indistinguishable from a normal SKIP). Illegal transitions throw in
non-production with `Error("Illegal transition: <state> + <action.type>")`,
no-op in prod.

**Matrix walk is programmatic, not hand-written.** The test file exports
two `as const` arrays (`ALL_CURSOR_STATES`, `ALL_CURSOR_ACTION_TYPES`)
from the reducer module and double-loops `state × action` (11 × 11 = 121
pairs). For each pair it consults a single source-of-truth `LEGAL` array,
asserts the legal pairs positively in dev, and asserts every illegal pair
twice — once that it throws in dev (`vi.stubEnv("NODE_ENV", "development")`)
and once that it no-ops in prod (`vi.stubEnv("NODE_ENV", "production")`).
Plus an explicit REPLAY-from-every-state pass and SKIP-from-every-state.

```
 ✓ tests/unit/cursor-state.test.ts (221 tests)
 Test Files  1 passed (1)
      Tests  221 passed (221)
```

## Sub-task B — T007 terminal typer

`src/components/cursor/terminal-typer.tsx` (`"use client"`). Props
`{ command, charDelayMs, onComplete }`. Uses `useState` + `useEffect` +
`setInterval` to emit one character per tick into a `<pre>`, with a blinking
caret span (`animate-pulse`, `aria-hidden`). On the last character it
clears the interval and calls `onComplete`. The effect's cleanup function
calls `clearInterval(id)` so unmount-mid-typing leaks no timer.

`useReducedMotion` short-circuit: if reduced, the initial state is the
full command and the effect immediately calls `onComplete()` and returns
without scheduling any interval.

```
 ✓ tests/unit/terminal-typer.test.tsx (3 tests)
   ✓ types one character per interval and calls onComplete once
   ✓ reduced-motion path renders full command immediately and calls onComplete
   ✓ clears its interval on unmount and never calls onComplete after
```

The unmount test renders, advances 50ms (one char), unmounts, then
advances 10s — `onComplete` is asserted to never have been called.

## Sub-task C — T008 skip link + replay button

Both client components, both `<button type="button">`, both fixed
`bottom-6 right-6 z-50`, both with `focus-visible:ring-2 focus-visible:ring-offset-2`.
`SkipLink` dispatches `blueprint:cinematic-skip` on `window`; `ReplayButton`
dispatches `blueprint:cinematic-replay`. Labels come from `cursor.skipLabel`
and `cursor.replayLabel` via `useTranslations("cursor")`. Replay button is
60% opacity, brightens to 100% on hover/focus per spec.md answer 4.

`axe-core` (devDep) added — same precedent as 025/028. Each component is
rendered inside a minimal `NextIntlClientProvider` and `axe.run(container)`
is asserted to return `violations: []`. Click and focus-ring assertions
also pass.

```
 ✓ tests/unit/skip-link.a11y.test.tsx (3 tests)
   ✓ has zero axe violations
   ✓ dispatches blueprint:cinematic-skip on click
   ✓ renders a focus ring class
 ✓ tests/unit/replay-button.a11y.test.tsx (3 tests)
   ✓ has zero axe violations
   ✓ dispatches blueprint:cinematic-replay on click
   ✓ renders a focus ring class
```

## Combined 9-scripts run

All green. Full log at [.logs/029-T006-T008-batch.log](.logs/029-T006-T008-batch.log).

- typecheck: OK
- lint (eslint + prettier): OK
- vitest: **10 files / 248 tests** passed
- playwright: `home.spec.ts` passed
- gitleaks: no leaks (46 commits scanned)
- npm audit: 0 vulnerabilities
- check-rls / check-tenant-id / check-forbidden-terms / check-i18n: all OK

## PR #15

Will pick up the four pushed commits on this branch. CI URL after push.

## Side note — task 026 blocker is cleared

`empire-architect-lab/blueprint` is now public (verified earlier in this
session: `https://api.github.com/repos/empire-architect-lab/blueprint`
returns 200 unauthenticated). So T003's live path will return
`source: "github"` on the next preview hit; no code change needed there.

## Files committed on `feat/001-the-cursor` in this task

- `4d8fc8f` — T006 product
- `8eb1aa6` — T007 product
- `fc9da6d` — T008 product (incl. `package.json` + lockfile bump for `axe-core`)
- bookkeeping commit to follow:
  - `.opus/inbox/029-spec001-T006-T007-T008-batch.md` → `.opus/archive/029/inbox/`
  - `.opus/outbox/029-reply.md` (this file)
  - `.logs/029-T006-T008-batch.log`
