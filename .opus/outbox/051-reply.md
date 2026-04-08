## Task 051 — Spec 001 / T022 reply — **BLOCKED, CI red on head**

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**PR:** #15 (still draft, **not** flipped to ready-for-review)
**Head:** `20d7698` (last bookkeeping commit from T050)
**Status:** STOPPED — CI failing on this head, whitelist forbids the fix.

## What I found

`gh pr view 15 --json statusCheckRollup` against the branch head `20d7698`:

- **Vercel check:** ✅ SUCCESS — preview deployed (targetUrl `https://vercel.com/nacirizak-7822s-projects/blueprint/HmEGRXRiQESivnpuS9sEyzChE9it`)
- **GitHub Actions `ci` workflow:** ❌ **FAILURE** — run id `24117342449`
- **Vercel Preview Comments check:** ✅ SUCCESS (unrelated)

Pulled `gh run view 24117342449 --log-failed`. The failure is in the **Install dependencies** step, `npm ci --no-audit --no-fund`:

```
npm error `npm ci` can only install packages when your package.json and
  package-lock.json or npm-shrinkwrap.json are in sync. Please update your
  lock file with `npm install` before continuing.
npm error Missing: @swc/helpers@0.5.21 from lock file
```

Engine warnings (non-fatal on their own, but concerning):

```
npm warn EBADENGINE Unsupported engine {
  package: 'camera-controls@3.1.2',
  required: { node: '>=22.0.0', npm: '>=10.5.1' },
  current: { node: 'v20.20.2', npm: '10.8.2' }
}
npm warn EBADENGINE Unsupported engine {
  package: 'lighthouse@13.1.0',
  required: { node: '>=22.19' },
  current: { node: 'v20.20.2', npm: '10.8.2' }
}
```

## Why this is on my plate

Both issues are fallout from **task 049 / T020**, where I ran `npm install --save-dev @next/bundle-analyzer lighthouse` to enable the performance audit. Two things went wrong that did not surface locally:

1. **Lockfile drift.** The `npm install --save-dev` seems to have left `@swc/helpers@0.5.21` (a transitive dep of `@next/bundle-analyzer`) out of `package-lock.json` even though the module resolved fine in my local `node_modules`. `npm ci` on CI is stricter than `npm install` and refused the drift. Local runs of all 9 scripts in T050 passed because `npm ci` is **not** on the sweep — the local node_modules was already hot from the dev install.
2. **Node 22 engine requirement.** `lighthouse@13.1.0` requires Node ≥22, but the CI workflow runs Node 20.20.2. The engine is a warning (not a hard stop by default) but it's sketchy infra health and will bite the moment an npm major flips `engine-strict`.

## Why I cannot fix this under T051's whitelist

T051's whitelist is:

- `specs/001-the-cursor/tasks.md` (tick T022 first box only)
- `.opus/outbox/051-reply.md`
- `.opus/inbox/051-spec001-T022-pr-preview.md`

Fixing the two issues requires edits to files that are **not** on that list:

- `package.json` — to move or remove `lighthouse` so CI Node 20 stops tripping the engine warning (or alternatively leave it in place but that's a time-bomb)
- `package-lock.json` — to re-sync and include `@swc/helpers@0.5.21`
- Possibly `.github/workflows/ci.yml` — to bump Node to 22 if we want to keep `lighthouse` as a devDep

Per the established STOP-and-report pattern (T042, T044, T047), I have **not** modified any source, **not** flipped PR #15 to ready-for-review, and **not** ticked the T022 box.

## Recommended fix (lowest blast radius)

**Option A — preferred.** A tiny side task whose whitelist is `package.json` + `package-lock.json` that:

1. Removes `lighthouse` from devDependencies entirely. Rationale: T020's Lighthouse runs were one-shot audits; the JSON reports shipped at `.logs/001-lighthouse-{mobile,desktop}.json` are evidence, and the tool itself does not need to live in CI. Future audits can be run with `npx lighthouse@latest ...` without locking it into the project.
2. Runs `npm install` locally to regenerate `package-lock.json` in sync with `package.json`.
3. Commits both files with message `fix(deps): remove lighthouse devDep, resync lockfile for CI`.

This fixes both the `@swc/helpers` lockfile drift (regeneration cleans it up) and the Node 22 engine warning (removing lighthouse removes the ≥22 constraint). CI should immediately go green on the next push.

**Option B.** Keep lighthouse, bump CI Node to 22 in `.github/workflows/ci.yml`, resync lockfile. Bigger surface area and commits a Node version floor for all future work.

**Option C.** Add `@swc/helpers` explicitly to `package.json` just to unblock the lockfile check, leave the engine warning. Shortest diff but leaves the Node 22 time-bomb in place. Not recommended.

I'd lean **A**. Lighthouse doesn't need to live in the project; `@next/bundle-analyzer` is the tool we want sticky, and it has no engine constraint.

After Option A lands, re-dispatch T051 and I'll flip PR #15 to ready, confirm CI green, paste the preview URL into the PR body, and write the proper reply.

## Vercel preview URL (already available)

Even though CI is red, Vercel deployed. The URL visible on the PR status is:

```
https://vercel.com/nacirizak-7822s-projects/blueprint/HmEGRXRiQESivnpuS9sEyzChE9it
```

That's the Vercel dashboard for the deployment, not the live URL. I can pull the live URL with `vercel ls --scope ...` when dispatched to actually edit the PR body.

## Bookkeeping commit to follow

Even with no product commit, the standard task-018 rule applies:

- `.opus/outbox/051-reply.md` (this file)
- `.opus/inbox/051-spec001-T022-pr-preview.md`

(No `.logs/051-*.log` — nothing to capture beyond the CI URL already linked above.)

## Standby

Awaiting your call on options **A** / **B** / **C**. Recommend A.
