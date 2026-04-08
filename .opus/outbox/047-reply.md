## Task 047 — Spec 001 / T019 reply — **BLOCKED, real a11y violation found**

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**Status:** STOPPED — axe found a real product violation, source is read-only per whitelist.

## What the audit found

I integrated `@axe-core/playwright` into all 6 specs (`cursor-happy-path`, `cursor-reduced-motion`, `cursor-skip`, `cursor-mobile`, `cursor-api-down`, plus the existing `home`), each at the test's final state, with the four required tag families: `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`. Five of the six specs ended with **0 violations**. One failed with a real product bug:

```
Scenario D — mobile cinematic plays without three.js and reveals hero
  Element has insufficient color contrast of 2.38 (foreground color: #ebebeb,
  background color: #999999, font size: 10.5pt (14px), font weight: normal).
  Expected contrast ratio of 4.5:1
  <button type="button" aria-label="Skip cinematic intro" class="fixed bottom-6 right…">
  Tags: wcag2aa, wcag143, EN-301-549, EN-9.1.4.3
```

The offending element is the `<SkipLink />` button (`src/components/cursor/skip-link.tsx`). Its `text-white/80` foreground on a `bg-black/40 backdrop-blur` background produces 2.38:1 contrast against the page's mid-grey region — well below the WCAG AA 4.5:1 minimum. This is a real bug, not a test misconfiguration.

## Why only the mobile spec catches it

The `cursor-skip` spec also exercises the skip button, but only *before* clicking it; immediately after Enter, the router swaps `mode` to `"hero"` and returns just `<Hero />` (no SkipLink), so the final-state axe scan in cursor-skip never sees the skip button. The mobile spec is different: in the mobile branch the router renders `<>{CinematicIntroMobile}<SkipLink /></>`, the mobile component internally advances to its `hero` beat and returns `<Hero />`, but the **router-level** `<SkipLink />` sibling stays mounted because the router's `mode` is still `"cinematic"` (the mobile component never dispatches `cinematic-complete`). Result: the skip button is in the DOM next to the hero on mobile, and axe scans both. The 2.38 contrast against the dark hero is what fails.

So this is actually two product gaps surfaced by T019:

1. **Insufficient contrast on the skip-link button** — fails WCAG AA full stop, regardless of which screen.
2. **The mobile cinematic doesn't bubble its completion up to the router**, so the router-level SkipLink overlay stays alive past the visual hand-off to Hero. A user on mobile sees a skip button hovering on the corner of the hero forever. (The desktop path eventually fires the white-flash → cinematic-complete event, but that wiring only lives in `/en/earth-preview`, not in the homepage's placeholder dynamic-import.)

## What the whitelist forbids

Inbox 047 marks `src/**` read-only. Both fixes touch source files:

- **Fix 1** (contrast): edit `src/components/cursor/skip-link.tsx` — change `text-white/80` to `text-white` and bump the background to `bg-black/70`. Or pick fully-opaque WCAG-AA-passing colors. Two-character diff in the className string.
- **Fix 2** (mobile router teardown): either (a) make `CinematicIntroMobile` dispatch `blueprint:cinematic-complete` when its `hero` beat first renders, so the router moves to `mode="hero"` and stops rendering `<SkipLink />`, **or** (b) gate the router-level `<SkipLink />` on `mode === "cinematic" && !isMobile`. Both approaches edit either `cinematic-router.tsx` or `cinematic-intro-mobile.tsx`.

Per the established STOP pattern (tasks 042 and 044), I have **not committed any test changes, not ticked the T019 boxes, and not modified any source file**. The e2e files have axe added in my working tree but those edits are not committed — they were only used to discover the violation and they will be re-added in the redo task.

## What I need from you

A redo with an expanded whitelist. The smallest viable patch:

- **(a)** Single redo of T047 with `src/components/cursor/skip-link.tsx` + `src/components/cursor/cinematic-router.tsx` (or `cinematic-intro-mobile.tsx`) added to the whitelist. I implement both fixes in the same product commit, finish the axe integration on all 6 specs, write `.logs/001-a11y-walkthrough.log`, tick T019 + the T018 sweep line. Recommended.
- **(b)** Two side tasks: one to fix the contrast on `skip-link.tsx`, one to fix the mobile router teardown. Then re-dispatch T047 with src read-only. Three round-trips, more friction, but isolates each product change to its own product commit.
- **(c)** Drop the wcag2aa contrast tag from the audit to make the existing source pass, ship T019 as-is, and file the contrast bug for a later spec. Not recommended — T019 is the audit task; suppressing the failure here defeats its purpose.

I'd lean (a). Both bugs are real, both fixes are tiny, and they're the kind of issue T019 exists to surface — bundling them in the audit task itself is the cleanest history.

## Required scripts — partially run

- `npm run typecheck` — OK
- `npm run lint` — OK after `prettier --write` on the modified e2e files
- `npm run test:e2e` — **5 of 6 passed**, `cursor-mobile` fails on the axe assertion as described above
- `npm run scan:secrets` — not run (nothing to commit yet)
- `check-forbidden-terms` + `check-i18n` — not run

[.logs/047-T019.log](.logs/047-T019.log) has the failing-run output, including the full axe violation JSON. The walkthrough log is also drafted at `.logs/001-a11y-walkthrough.log` but I will ship it in the redo so it lands with the fixed source.

## Bookkeeping commit to follow

Only the inbox + reply + log files (working-tree e2e edits stay uncommitted until the redo):

- `.logs/047-T019.log`
- `.opus/outbox/047-reply.md` (this file)
- `.opus/inbox/047-spec001-T019-a11y.md`

## Standby

Awaiting your call on options (a) / (b) / (c).
