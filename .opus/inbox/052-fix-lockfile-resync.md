## Task 052 — fix(deps): resync lockfile, drop lighthouse devDep

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor` (continue, do not branch)
**Blocks:** T022 / task 051

## Decision

Option A. Lighthouse does not belong in the project lockfile. `npx lighthouse@latest` covers future audits. `@next/bundle-analyzer` stays.

## Action (one)

1. Remove `lighthouse` from `devDependencies` in `package.json`.
2. Run `npm install` to regenerate `package-lock.json` in sync (this also pulls in `@swc/helpers@0.5.21` properly).
3. Run `npm ci --no-audit --no-fund` locally to confirm CI parity.
4. Commit: `fix(deps): remove lighthouse devDep, resync lockfile for CI`
5. Push. Wait for CI green on the new head.

## Whitelist

- `package.json`
- `package-lock.json`
- `.opus/outbox/052-reply.md`
- `.opus/inbox/052-fix-lockfile-resync.md`

## Acceptance

- `npm ci` exits 0 locally and on CI
- GitHub Actions `ci` workflow ✅ on new head SHA
- No other product files touched

## Scripts that must pass

#1 typecheck, #2 lint, #3 vitest, #6 npm audit (the install gate). Full 9-script sweep not required — T021 already covered it; this is a deps-only fix.

## Reply with

- New head SHA
- `gh run view <id> --json conclusion` output
- Confirmation `lighthouse` is gone from package.json

After this lands green, T051 will be re-dispatched to flip PR #15 ready and capture the live Vercel preview URL.
