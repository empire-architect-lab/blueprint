# Task 025 — Spec 001 / T002 — Build-time metadata pipeline

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Run order:** AFTER task 024 (PR #9) is merged. Do not start this until main contains the task 016 housekeeping commits.

## Context
Spec 001 / T002 from `specs/001-the-cursor/tasks.md`. Implementation branch is `feat/001-the-cursor` (already exists from T001). This is the next product slice on the cursor feature. Plan reference: `specs/001-the-cursor/plan.md` section "Build-time metadata".

## Scope (T002 checkbox list, verbatim from tasks.md)
1. Create `scripts/collect-build-metadata.ts` that:
   - Runs `git rev-parse HEAD` → full sha; `.slice(0,7)` → shortSha
   - `fs.readdirSync("specs/")` filtered by `/^\d{3}-/` → specCount
   - Walks `specs/**/tasks.md`, counts lines matching `/^- \[[x ]\]/` → taskCount
   - Writes `src/content/build-metadata.ts` exporting `BUILD_METADATA = { sha, shortSha, specCount, taskCount, lieCount: 0 } as const`
   - Writes `src/content/fallback-commit.ts` exporting `FALLBACK_COMMIT = { sha, shortSha, message } as const` using `git log -1 --pretty=format:"%h|%s"` (split on `|`)
2. Add `"prebuild": "tsx scripts/collect-build-metadata.ts"` to `package.json`
3. Add `src/content/` to `.gitignore`
4. Run `npm run build` locally — verify both files generated, shapes correct
5. Vitest unit test for the collector: mock `fs` + child_process, assert specCount and taskCount math
6. Check the T002 boxes in `specs/001-the-cursor/tasks.md` in the SAME commits per Principle 10

## Whitelist
- `scripts/collect-build-metadata.ts` (new)
- `package.json` (prebuild script only)
- `.gitignore` (one line: `src/content/`)
- `tests/unit/collect-build-metadata.test.ts` (new)
- `specs/001-the-cursor/tasks.md` (T002 checkboxes only)
- `.opus/inbox/025-*.md`, `.opus/outbox/025-reply.md`, `.logs/025-T002.log`, `.opus/archive/025/**`

No other files. No touching `src/content/*` directly (those are generated).

## Done when
- `npm run build` succeeds and emits both generated files
- 9 scripts green, log at `.logs/025-T002.log`
- PR opened on `feat/001-the-cursor`, CI green, awaiting Opus + bot approval
- `025-reply.md` written with PR URL, build output, Vercel preview URL (yes, even though T002 has no visual change — confirms preview pipeline still works)
- Bookkeeping (this inbox file + reply + log) committed in the same PR per Rule 1
