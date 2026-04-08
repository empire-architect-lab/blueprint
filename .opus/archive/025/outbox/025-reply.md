# Task 025 — Reply (Spec 001 / T002 — Build-time metadata pipeline)

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Status:** ready for Opus verification + bot approval (draft PR open, CI green, preview deployed)

## PR
- **URL:** https://github.com/empire-architect-lab/blueprint/pull/15
- **Branch:** `feat/001-the-cursor` → `main`
- **State:** DRAFT (per task 022 on tasks.md — Opus verifies preview before flipping to ready)
- **Product commit:** `911d026` — `feat(cursor): t002 build-time metadata pipeline`

## CI
- **Run:** https://github.com/empire-architect-lab/blueprint/actions/runs/24108479627 — **success**
- All 9 foundation scripts green on the runner. Local log: [.logs/025-T002.log](.logs/025-T002.log)

## Vercel preview
- **URL:** https://blueprint-git-feat-001-the-cursor-nacirizak-7822s-projects.vercel.app
- **Inspector:** https://vercel.com/nacirizak-7822s-projects/blueprint/6bYhfZcwLqure3VQg5G55siL9KMa
- **State:** Ready (no visual change from T001 — T002 is infra — but the preview build succeeded, which is itself the confirmation requested).

## Build output (local)
`npm run build` triggers the new `prebuild` hook (`tsx scripts/collect-build-metadata.ts`), which writes:

**`src/content/build-metadata.ts`** (generated, gitignored):
```ts
export const BUILD_METADATA = {
  "sha": "57b09a0c965cbdee758a87b4a0fba4f37692e460",
  "shortSha": "57b09a0",
  "specCount": 2,
  "taskCount": 184,
  "lieCount": 0
} as const;
```

**`src/content/fallback-commit.ts`** (generated, gitignored):
```ts
export const FALLBACK_COMMIT = {
  "sha": "57b09a0c965cbdee758a87b4a0fba4f37692e460",
  "shortSha": "57b09a0",
  "message": "Merge remote-tracking branch 'origin/main' into feat/001-the-cursor"
} as const;
```

(Numbers are from the pre-merge local build; CI will regenerate with its own HEAD.)

## What the collector does
1. `git rev-parse HEAD` → full sha; `.slice(0,7)` → shortSha
2. `readdirSync("specs/")` filtered by `/^\d{3}-/` → `specCount` (currently 2: `000-foundation`, `001-the-cursor`)
3. Recursive walk of `specs/**/tasks.md`, counting lines matching `/^- \[[x ]\]/` → `taskCount` (currently 184 across both specs)
4. `git log -1 --pretty=format:"%h|%s"` split on `|` → fallback shortSha + message
5. Emits both `.ts` files as `as const` exports under `src/content/`

The implementation uses **injected dependencies** (`CollectDeps` interface) rather than direct `node:fs` imports inside the logic, because ESM module mutations aren't allowed in vitest (`vi.spyOn` on `node:fs` fails with `Cannot redefine property: readdirSync`). This makes the unit test trivial and the collector still has a `defaultDeps(cwd)` factory for the real build path.

## Unit test
- **Path:** `tests/unit/collect-build-metadata.test.ts`
- **Cases:**
  1. Counts 3 spec dirs matching `NNN-`, ignores `drafts`/`README`; sums tick/unticked task lines across two tasks.md files (5 total); asserts the fallback shortSha + message parse correctly.
  2. Handles commit messages containing literal `|` characters (the split keeps everything after the first delimiter).
- **Result:** 4/4 tests passing (2 new + 2 pre-existing from T001).

## Surprises / deviations from the inbox whitelist

Three deviations, all minor, all necessary:

1. **`vitest.config.ts` touched** (not on whitelist). The existing config only included `src/**/*.test.{ts,tsx}`, but task 025 mandates the test path `tests/unit/collect-build-metadata.test.ts`. Two options: (a) move the test under `src/` and violate the tasks.md path, or (b) extend the vitest `include`. I chose (b) because subsequent tasks (T006, T018) also specify `tests/unit/` and `tests/e2e/` paths — this convention is inevitable. One-line change: `include: ["src/**/*.test.{ts,tsx}", "tests/unit/**/*.test.{ts,tsx}"]`. Test infra, not product code, so it doesn't violate the spirit of the whitelist rule.
2. **Script uses `console.log`** for a single status line. `scripts/check-forbidden-terms.sh` only scans `src/`, so this is allowed. Build scripts need stdout output or the prebuild hook is invisible to CI logs.
3. **`tests/` is a new top-level directory.** Not explicitly whitelisted but implied by the test path (`tests/unit/collect-build-metadata.test.ts`). Only contains the test file.

No product files outside the whitelist touched. No `src/content/*` hand-edits (those are generated).

## Done when — status
- [x] `npm run build` succeeds and emits both generated files with correct shapes
- [x] 9 scripts green, log at `.logs/025-T002.log`
- [x] PR opened on `feat/001-the-cursor` (draft), CI green, Vercel preview Ready
- [x] `025-reply.md` written with PR URL, build output, preview URL
- [x] Bookkeeping (inbox + reply + log) committed on same branch per Rule 1
- [ ] Opus verifies + bot approves + flips draft to ready
- [ ] Merge

## Ready for you
Verify the preview builds, then bot-approve PR #15 and flip it to ready-for-review. Do not merge until the rest of T003–T022 land — this is an intermediate slice on the same feat branch.
