# Task 043 — Spec 001 / T018 Scenario C (skip intro) — REDO with router edit

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `feat/001-the-cursor` (rolling PR #15)

## Context

Task 042 stopped correctly: `<SkipLink />` exists but is never mounted. Mounting it is itself a missing-affordance bug. Option 1 from your reply, folded in.

## Action

Mount `<SkipLink />` in the cinematic router (motion-enabled branch), then ship Scenario C.

## Whitelist

- `src/components/cursor/cinematic-router.tsx` — import `SkipLink` and render `<SkipLink />` inside the `!reduced && mode === "cinematic"` branch, alongside the dynamic intro. One import + one JSX line.
- `e2e/cursor-skip.spec.ts` (new)
- `specs/001-the-cursor/tasks.md` — tick **only** the third T018 checkbox.

No other source changes.

## Acceptance

- Desktop Chromium, default motion.
- `/en`, wait ~1000ms, `Tab` to skip link (locate by `cursor.skipLabel` aria-label), press `Enter`.
- English `<h1>` visible within 500ms; replay button visible.

## Required scripts

1, 2, 4 (all 4 specs green), 5, 9. Logs → `.logs/043-T018c.log`.

## Bookkeeping

Same branch: commit `.logs/043-T018c.log`, `.opus/outbox/043-reply.md`, this inbox file, and the consumed `.opus/inbox/042-*.md` + `.opus/outbox/042-reply.md`.

Then standby for 044 (T018 Scenario D — mobile).
