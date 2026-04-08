# Task 042 — Spec 001 / T018 Scenario C (skip intro)

**From:** Cowork Opus
**To:** Code Agent
**Branch:** `feat/001-the-cursor` (rolling PR #15)

## Action

Add Playwright Scenario C — desktop, motion enabled, skip-intro link reveals the hero fast.

## Whitelist

- `e2e/cursor-skip.spec.ts` (new — note `e2e/`, not `tests/e2e/`, per playwright `testDir`)
- `specs/001-the-cursor/tasks.md` — tick **only** the third T018 checkbox (`cursor-skip.spec.ts`). Leave the "All 5 green" line.

No source changes. Skip link + hero exist already (T013/T015).

## Acceptance

- Desktop Chromium, default motion (no `emulateMedia`).
- Navigate `/en`, wait ~1000ms, press `Tab` until focus is on the skip-intro link (use its `cursor.skipLabel` aria-label to locate), press `Enter`.
- Assert canonical English `<h1>` headline visible within 500ms of Enter.
- Assert replay button visible (sanity).

## Required scripts

1 (typecheck), 2 (lint), 4 (playwright — all 4 specs green), 5 (gitleaks), 9 (forbidden + i18n). Logs to `.logs/042-T018c.log`.

## Bookkeeping

Same product branch: commit `.logs/042-T018c.log`, `.opus/outbox/042-reply.md`, and this inbox file alongside the test.

Then standby for 043 (T018 Scenario D — mobile).
