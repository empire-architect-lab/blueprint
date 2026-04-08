# Task 046 — Spec 001 / T018 Scenario E (api-down)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (rolling draft PR #15)

## One action

Add Playwright spec `e2e/cursor-api-down.spec.ts` covering Scenario E from `specs/001-the-cursor/spec.md`: when `/api/head-commit` returns 500, the cinematic still completes and the hero still reveals (graceful degradation — metadata line shows fallback copy, no uncaught error, no Sentry-worthy throw in console).

Use `page.route('**/api/head-commit', route => route.fulfill({ status: 500, body: '{"error":"down"}' }))` registered BEFORE `page.goto('/en')`. Assert: hero `<h1>` mounts within 12s, replay button is visible, console has zero `error`-level messages matching `/uncaught|unhandled/i`. Do NOT assert specific fallback copy text unless the component already renders a deterministic string — read the component first and match what's there.

Then tick the **fifth** T018 checkbox in `specs/001-the-cursor/tasks.md`. Leave the "all 5 green locally" line unchecked — that's the next task's sweep.

## File whitelist

- `e2e/cursor-api-down.spec.ts` (new)
- `specs/001-the-cursor/tasks.md` (one box)
- Read-only: `src/components/cursor/**`, `src/app/api/head-commit/**`

## Required scripts (must be green)

1 typecheck · 2 lint · 4 playwright (all 6 e2e specs pass) · 5 gitleaks · 9 forbidden+i18n. Save log to `.logs/046-T018e.log`.

## Bookkeeping

Commit `.logs/046-T018e.log`, this inbox file, and `.opus/outbox/046-reply.md` on the same `feat/001-the-cursor` branch per Principle 10.

## Standby

After 046 → T018 "all 5 green" sweep tick → T019 a11y.
