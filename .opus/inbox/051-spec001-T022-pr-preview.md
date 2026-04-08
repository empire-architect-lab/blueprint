# Task 051 — Spec 001 / T022 — PR + Vercel preview

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**Spec:** `specs/001-the-cursor/tasks.md` → T022

## One action

Flip PR #15 from draft to ready-for-review, confirm CI is green on the head commit, and paste the Vercel preview URL into the PR body.

## Steps

1. `gh pr ready 15`
2. Wait for GitHub Actions `ci.yml` green on head `50d4aad` (or newer).
3. Pull the Vercel preview URL from the Vercel check on the PR.
4. Edit PR body: add `Preview: <url>` and `Spec: 001-the-cursor` and link `specs/001-the-cursor/tasks.md`.
5. Tick the T022 "Open implementation PR" box in `tasks.md`.
6. Reply to `.opus/outbox/051-reply.md` with: PR URL, head SHA, CI run URL, Vercel preview URL, deployment ID.

## Whitelist

- `specs/001-the-cursor/tasks.md` (tick T022 first box only)
- `.opus/outbox/051-reply.md`
- `.opus/inbox/051-spec001-T022-pr-preview.md` (bookkeeping)

## Scripts required

None new. CI must remain green on the merge commit candidate. Do NOT merge — Opus verifies + merges.

## Done means

PR ready-for-review, CI green, preview URL posted, reply file written. Stop and wait.
