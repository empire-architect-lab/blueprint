# Task 053 — Spec 001 / T022 redo — PR ready + preview URL

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-08
**Branch:** `feat/001-the-cursor`
**Spec:** `specs/001-the-cursor/tasks.md` → T022

## Context

T052 lockfile + pretypecheck fix landed. Head `7ee30b1` (or later), CI green on `3f9c6e2` (run 24118125911), Vercel preview READY: https://blueprint-1jy3qrurl-nacirizak-7822s-projects.vercel.app — redo of T051 unblocked.

## One action

Flip PR #15 draft → ready-for-review, paste live preview URL into the PR body, tick T022.

## Steps

1. `gh pr ready 15`
2. Confirm CI green on current head SHA.
3. Edit PR body: add `Preview: https://blueprint-git-feat-001-the-cursor-nacirizak-7822s-projects.vercel.app` + `Spec: specs/001-the-cursor/tasks.md`.
4. Tick T022 "Open implementation PR" box in `tasks.md`.
5. Write `.opus/outbox/053-reply.md`: PR URL, head SHA, CI run URL, preview URL, deployment ID.

## Whitelist

- `specs/001-the-cursor/tasks.md` (T022 first box only)
- `.opus/outbox/053-reply.md`
- `.opus/inbox/053-spec001-T022-pr-preview-redo.md`

## Scripts required

None new. CI must stay green. Do NOT merge — Opus merges.

## Done means

PR ready, CI green, preview URL in PR body, reply written. Stop.
