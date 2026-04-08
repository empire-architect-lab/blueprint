## Task 046 — Spec 001 / T018 Scenario E reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft)
**Product commit:** `f9bbb4e` — `test(cursor): t018e scenario e api-down e2e`

## What shipped

- `e2e/cursor-api-down.spec.ts` — Playwright spec, "Scenario E — head-commit API down still reveals hero". Registers `page.route("**/api/head-commit", ...)` to fulfill with HTTP 500 + a JSON error body **before** `page.goto()`. Attaches a `page.on("console")` collector that captures every error-level message. Forces `emulateMedia({ reducedMotion: "reduce" })` so the router renders Hero immediately — Scenario E is the API failure mode, not the cinematic happy path (Scenario A already covers that). Asserts `<main>` is visible, the hero `<h1>` mounts within 12s with the canonical English headline, the replay button is visible, and the collected console errors contain zero entries matching `/uncaught|unhandled/i`.
- I deliberately did not assert any specific fallback metadata copy. Hero's `useEffect` swallows the failed fetch in `.then((r) => (r.ok ? r.json() : FALLBACK_HEAD))` and falls back to `FALLBACK_COMMIT` (the build-time snapshot from `src/content/fallback-commit.ts`), so the metadata `<p>` will read `commit <whatever the build snapshot says> · 2 specs · 184 tasks · 0 lies` — that string is *deterministic per build* but it embeds a sha that changes commit-to-commit, which would make the test brittle. Per the inbox instruction *"Do NOT assert specific fallback copy text unless the component already renders a deterministic string"*, I matched the spirit by asserting only the headline + presence of the replay button. The fallback path is exercised — if `useEffect` had thrown an uncaught promise instead of swallowing it, the console assertion would catch it.
- `specs/001-the-cursor/tasks.md` — only the **fifth** T018 checkbox ticked in the same product commit (Principle 10). The "all 5 green locally" sweep line stays unchecked per inbox.

## Read-only confirms

- `src/components/hero/hero.tsx` — `useEffect` fetch with `.catch(() => setHead(FALLBACK_HEAD))`. Confirmed swallowing path; no `throw`.
- `src/app/api/head-commit/route.ts` — returns `Response.json(fallback())` on its own internal error, but the route **handler** isn't reached in this test because Playwright's `page.route` interception fulfills the request at the network layer before it hits Next. The 500 the test simulates is a wire-level failure, not a server-side fallback. Hero's client-side `.catch` is what's actually exercised.

## Whitelist match

| File | Status |
|---|---|
| `e2e/cursor-api-down.spec.ts` | new ✅ |
| `specs/001-the-cursor/tasks.md` | edited (one box) ✅ |
| `src/components/cursor/**` + `src/app/api/head-commit/**` | read-only ✅ |

## Required scripts — green

Saved to [.logs/046-T018e.log](.logs/046-T018e.log).

| # | Script | Result |
|---|---|---|
| 1 | typecheck | OK |
| 2 | lint | OK |
| 4 | playwright | **6 passed** — `home`, `cursor-happy-path`, `cursor-reduced-motion`, `cursor-skip`, `cursor-mobile`, new `cursor-api-down` |
| 5 | gitleaks | no leaks, 77 commits scanned |
| 9 | check-forbidden + check-i18n | both OK |

vitest (script 3) and the other scans were not on the must-pass list, no source touched, last green was 268 tests at `2bd28af`.

## Standby

Per inbox: standby for the T018 "all 5 green locally" sweep tick task (it's a one-line tasks.md edit since all 5 specs are in the tree and green), then T019 a11y.

## Bookkeeping commit to follow

- `.logs/046-T018e.log`
- `.opus/outbox/046-reply.md` (this file)
- `.opus/inbox/046-spec001-T018e-api-down.md`
