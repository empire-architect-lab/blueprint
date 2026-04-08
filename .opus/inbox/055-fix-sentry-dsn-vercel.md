# Task 055 — Fix wrong Sentry DSN on Vercel (blocks PR #15)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Priority:** P0 — PR #15 unmergeable until this is green
**Branch:** `fix/055-sentry-dsn-vercel` off `feat/001-the-cursor`

## Problem

Deployed preview at `blueprint-git-feat-001-the-cursor-nacirizak-7822s-projects.vercel.app/en` renders as a blank black page with only the skip button + a blue circle. Hero/CinematicRouter never hydrates.

Root cause: Vercel env vars contain a **wrong Sentry DSN**. Browser network trace shows the app POSTing to `o4506076816474112.ingest.us.sentry.io/4507464518795264` (not ours, US region, getting 429s). Our real DSN is in `.env.local`/`.env.development`/`.env.staging` and points to `o4511051808899072.ingest.de.sentry.io/4511179806736464` (DE region, blueprint project in wmpiew org, verified empty in Sentry UI — proving production traffic isn't reaching it).

Sentry init is crashing client-side with the bad DSN config, which takes down the CinematicRouter with it.

## Fix

In the `blueprint/` directory (already `vercel link`-ed):

1. `vercel env ls` — show current env vars for all three scopes. Save output to `.logs/055.log`.
2. For each of `NEXT_PUBLIC_SENTRY_DSN` and `SENTRY_DSN`, for each scope in `production preview development`:
   - `vercel env rm <name> <scope> --yes`
   - `vercel env add <name> <scope>` piping in the correct value:
     ```
     https://e929fa68eabd4a64f476cb46a4e9a9fc@o4511051808899072.ingest.de.sentry.io/4511179806736464
     ```
3. If `SENTRY_AUTH_TOKEN` exists and does not correspond to our wmpiew org, `vercel env rm` it for all scopes. Do not try to re-add — Opus will issue a new token.
4. Trigger a rebuild by pushing an empty commit on the task branch: `git commit --allow-empty -m "chore(sentry): trigger rebuild after dsn fix [055]"`
5. After Vercel redeploys, `curl -sI` the new preview URL and confirm 200.
6. `curl -s <preview>/en | grep -c "Built by the process it teaches"` — must return `1`. If `0`, Sentry was not the whole story; stop and report.

## Bookkeeping

- Log all command outputs to `.logs/055.log`
- Write reply to `.opus/outbox/055-reply.md` with: new DSN verified in `vercel env ls`, empty-commit SHA, new deployment ID, grep result, whether hero text is now in the HTML
- Commit `.logs/055.log`, `.opus/outbox/055-reply.md`, `.opus/inbox/055-fix-sentry-dsn-vercel.md` on the same branch
- Open PR against `feat/001-the-cursor` (not main) — it stacks under PR #15

## Out of scope

- Post-deploy smoke test script (that's task 056, separate)
- Opening/closing PR #15 (Chainbeard action after 055 + 056 are green)
