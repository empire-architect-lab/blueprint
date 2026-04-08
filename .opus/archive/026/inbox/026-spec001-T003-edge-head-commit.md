# Task 026 — Spec 001 / T003 — Edge route handler for HEAD commit

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Branch:** `feat/001-the-cursor` (continue — add commits to the existing draft PR #15)
**Depends on:** T002 (task 025) — DONE, bookkeeping committed at `b158800`, draft PR #15 is the rolling PR for all of spec 001. Do not open a new PR; push 026's commits onto `feat/001-the-cursor` so they show up in PR #15.

## Context
Spec 001 / T003 from `specs/001-the-cursor/tasks.md`. An Edge runtime API route that returns the current HEAD commit from GitHub, with a baked-in fallback when GitHub is unreachable. This is what the hero will later call to display "looking at commit abc1234 · <message>" live.

## Scope (T003 checkbox list, verbatim from tasks.md)
1. Create `src/app/api/head-commit/route.ts`:
   - `export const runtime = "edge"`
   - `export const revalidate = 60`
   - `GET` handler fetches `https://api.github.com/repos/empire-architect-lab/blueprint/commits/main` with `headers: { Accept: "application/vnd.github+json", "User-Agent": "blueprint-lab" }`
   - On 2xx: return `{ sha, shortSha: sha.slice(0,7), message: truncate(commit.message.split("\n")[0], 72), source: "github" }`
   - On non-2xx or thrown: import `FALLBACK_COMMIT` from `@/content/fallback-commit`, return `{ ...FALLBACK_COMMIT, source: "fallback" }`
2. Create `src/lib/text/truncate.ts` with `truncate(str, max)` using `[...str]` spread (NOT `.length`) so surrogate pairs don't break mid-emoji. Append `…` when truncated.
3. Unit test `tests/unit/head-commit-fallback.test.ts`:
   - Mock global `fetch` to throw → assert handler returns `source: "fallback"` with fallback shape
   - Mock fetch to return 500 → same assertion
   - Mock fetch to return 200 + valid payload → assert `source: "github"` and truncation applied
4. Unit test `tests/unit/truncate.test.ts`: ASCII, exact boundary, Unicode (emoji), multiline input
5. Manual smoke: `npm run dev` then `curl http://localhost:3000/api/head-commit` → 200 with `source: "github"`
6. Tick T003 boxes in `specs/001-the-cursor/tasks.md` in the same commit (Principle 10)

## Whitelist
- `src/app/api/head-commit/route.ts` (new)
- `src/lib/text/truncate.ts` (new)
- `tests/unit/head-commit-fallback.test.ts` (new)
- `tests/unit/truncate.test.ts` (new)
- `specs/001-the-cursor/tasks.md` (T003 checkboxes only)
- `.opus/inbox/026-*.md`, `.opus/outbox/026-reply.md`, `.logs/026-T003.log`, `.opus/archive/026/**`

## Done when
- `curl` smoke passes live path; disconnect network and curl again → fallback path
- 9 scripts green, log at `.logs/026-T003.log`
- Commits pushed to `feat/001-the-cursor`, PR #15 CI green, Vercel preview URL in the reply (hit `/api/head-commit` on the preview, confirm 200 JSON with `source: "github"`)
- Also hit the preview with `fetch` mocked-offline path impossible from outside — instead include in the reply the unit test output proving the fallback branch returns `source: "fallback"`
- `026-reply.md` written with PR #15 link, commit OID for 026, preview URL, and a pasted copy of the JSON response from the preview endpoint
- Bookkeeping (this inbox file → `.opus/archive/026/inbox/`, reply, log) committed on `feat/001-the-cursor` per Rule 1
