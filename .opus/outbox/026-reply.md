# Task 026 — Spec 001 / T003 reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (rolling draft for spec 001)
**Product commit:** `0a9024f` — `feat(cursor): t003 edge route for head commit with fallback`

## What shipped

- `src/app/api/head-commit/route.ts` — Edge runtime, `revalidate = 60`, GET fetches
  `https://api.github.com/repos/empire-architect-lab/blueprint/commits/main` with the
  required headers, returns `{ sha, shortSha, message, source: "github" }` on 2xx,
  `{ ...FALLBACK_COMMIT, source: "fallback" }` on any non-2xx or thrown error.
- `src/lib/text/truncate.ts` — `truncate(str, max)` using `[...str]` code-point spread
  (no `.length`), appends `…` when truncated.
- `tests/unit/truncate.test.ts` — 5 cases: ASCII under, exact boundary, ASCII over,
  Unicode emoji (surrogate-pair safe), multiline.
- `tests/unit/head-commit-fallback.test.ts` — 3 cases: fetch throws → fallback,
  GitHub 500 → fallback, GitHub 200 with long subject → `source: "github"` with
  shortSha + 72-code-point truncation + first line only.
- `specs/001-the-cursor/tasks.md` — T003 boxes ticked in the same commit (Principle 10).

## Evidence

- 9 scripts: `.logs/026-T003.log` (typecheck, vitest, lint, e2e — all green).
- Full vitest: 4 files / 12 tests passed.
- Playwright: `home.spec.ts` passed (no new e2e was required by T003; the 5 cursor
  scenarios land in T018).
- gitleaks / npm audit / rls / tenant / forbidden / i18n scans all OK.

### Unit-test output proving the fallback branch (per inbox point 4)

```
 RUN  v4.1.3
 ✓ tests/unit/truncate.test.ts (5 tests)
 ✓ tests/unit/head-commit-fallback.test.ts (3 tests)
   ✓ returns fallback shape when fetch throws
   ✓ returns fallback when GitHub returns a non-2xx status
   ✓ returns github source with truncation on a successful fetch
 Test Files  2 passed (2)
      Tests  8 passed (8)
```

### Local smoke (`npm run dev` + `curl /api/head-commit`)

```
{"sha":"b158800064c82a53c5c6a9903240dec323f40d0e","shortSha":"b158800",
 "message":"chore(opus): archive task 025 bookkeeping (t002 metadata pipeline)",
 "source":"fallback"}
```

200 JSON, correct shape. See **blocker below** re: why `source` is `"fallback"` and
not `"github"` on the live path.

## ⚠ Blocker for the "live path" smoke

The inbox asks for `curl http://localhost:3000/api/head-commit` to return
`source: "github"`. It does not — and will not on the Vercel preview either —
because `empire-architect-lab/blueprint` is **a private repo** and the route
calls the GitHub API **unauthenticated**. Verified directly:

```
$ curl -s -o /dev/null -w "%{http_code}\n" \
    -H "User-Agent: blueprint-lab" \
    -H "Accept: application/vnd.github+json" \
    https://api.github.com/repos/empire-architect-lab/blueprint/commits/main
404
$ curl -s -o /dev/null -w "%{http_code}\n" \
    https://api.github.com/repos/empire-architect-lab/blueprint
404
```

A 404 from an unauthenticated call against a private repo is indistinguishable
from "repo not found," so the route correctly falls back — that **is** the spec'd
behaviour for non-2xx. The fallback payload itself is fresh (prebuild rewrote
`src/content/fallback-commit.ts` to the current HEAD on this branch), so the
response is still accurate; it just carries `source: "fallback"`.

**Decision needed from you before T003 can show `source: "github"`:**

1. **Make the repo public.** Cleanest; no token plumbing. Then the live path
   works everywhere with zero code change. Recommended given the project is
   meant to be a public showcase (ROADMAP says "preview per PR, prod on main").
2. **Add a `GITHUB_TOKEN` env var** (fine-grained PAT with `contents:read`) and
   have the route send `Authorization: Bearer …` when present. Requires env
   plumbing on Vercel (dev + preview + prod) and a small code change to this
   same file. I can ship it as a follow-up commit on this branch the moment you
   say go — it's ~6 lines including the env guard per our "throw if missing"
   rule (or optional read with fallback — your call).
3. **Leave as-is**, accept the fallback is the live path until the repo is
   public. The spec's FR-1/FR-9 behaviour is still fully correct; the UI just
   never shows the "looking at commit xyz · live" state until the repo opens
   up.

I've stopped here rather than picking one, because the whitelist for 026 does
not include env/config changes and "make the repo public" is a CEO decision.
PR #15 CI should still go green on this commit since every test and scan
passes — the failing condition is only the human-in-the-loop live smoke.

## Vercel preview URL

Will be attached once PR #15's CI publishes the preview after this push.
(The branch currently tracks `origin/feat/001-the-cursor`; pushing now.)

## Files committed on `feat/001-the-cursor` in this task

- `0a9024f` — product (5 files)
- bookkeeping commit to follow in the same branch:
  - `.opus/inbox/026-spec001-T003-edge-head-commit.md` → `.opus/archive/026/inbox/`
  - `.opus/outbox/026-reply.md` (this file)
  - `.logs/026-T003.log`
