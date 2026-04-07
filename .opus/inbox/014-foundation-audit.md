# Task 014 — Foundation audit (read-only, no code changes)

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Priority:** P1 — gate before first product-code PR
**Type:** Read-only audit. Make NO code changes. Open NO PRs.

---

## Why

Before T001 of spec 001 lands the first real product code, we need evidence the foundation actually does what we think it does. Chainbeard explicitly asked for a check. Per the verification doctrine: trust scripts, not claims. This task runs scripts and produces evidence.

## Deliverable

A single audit report at `.opus/outbox/014-audit-report.md` with PASS/FAIL/WARN for each section, plus the raw command output that proves it. If anything is FAIL or WARN, include a one-line "fix dispatch suggestion" but do NOT act on it in this task.

## Scope — 8 sections

### Section 1 — The 9 non-negotiable scripts exist and run

For each of the 9 scripts, verify (a) it exists at the expected path or as an npm script, (b) it runs to completion, (c) exit code is 0 against current main. Report exit code + last 5 lines of output for each.

1. `npm run typecheck` (or `tsc --noEmit`)
2. `npm run lint` (eslint + prettier)
3. `npm run test` (vitest)
4. `npm run test:e2e` (playwright)
5. `gitleaks detect` (or via npm script)
6. `npm audit --audit-level=high`
7. `scripts/check-rls.sh`
8. `scripts/check-tenant-id.sh`
9. `scripts/check-forbidden-terms.sh` AND `scripts/check-i18n.sh`

For any script that doesn't exist yet, mark FAIL and note "missing — needs creation dispatch."

### Section 2 — Husky hooks

Verify `.husky/pre-commit` and `.husky/pre-push` exist and that they invoke a meaningful subset of the 9 scripts. Cat both files into the report. Confirm `husky install` ran (look for `.husky/_/`).

### Section 3 — GitHub Actions CI workflow

Read `.github/workflows/ci.yml`. Confirm:
- It runs on `pull_request` to `main`
- It runs all 9 scripts (or a documented subset)
- It uses Node version matching `package.json` engines
- It caches `node_modules` or pnpm/npm store

Paste the jobs/steps section into the report.

### Section 4 — Branch protection on main

Run `gh api repos/empire-architect-lab/blueprint/branches/main/protection` and report:
- Required status checks (which check names + strict mode)
- Required approving review count
- "Dismiss stale reviews" enabled?
- "Require review from Code Owners" enabled?
- "Restrict who can push" / admin enforcement enabled?

If `enforce_admins` is false, mark WARN — that's the loophole that let PR #3 merge via bypass earlier today.

### Section 5 — Environment variables wiring (3 envs)

Confirm `.env.example`, `.env.development`, `.env.staging`, `.env.local`, `.env.bot.local` all exist. List the keys present in `.env.example` (NOT the values). Confirm each of these required keys exists in `.env.example`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (placeholder only — the value should never be in any committed file)
- `NEXT_PUBLIC_SENTRY_DSN`
- `SENTRY_AUTH_TOKEN` (placeholder)
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- `NEXT_PUBLIC_BLUEPRINT_SFX` (per spec 001 FR-8)

For each present, note ✅. For each missing, note ❌.

Then run `gitleaks detect --no-git` against the working tree to confirm no real secrets are committed. Paste exit code.

### Section 6 — Supabase wiring + RLS

Run `scripts/check-rls.sh` and `scripts/check-tenant-id.sh` (also covered in section 1, but here we want the per-table breakdown). Confirm the Supabase project IDs in `.env.example` placeholders match what's in `reference_accounts.md` (if accessible) or at least look like valid Supabase project ref format.

If there are no migrations yet (likely — no product code), mark "N/A — no tables yet" and note that this section becomes meaningful starting at T001.

### Section 7 — Sentry + Plausible wiring

Confirm:
- `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts` exist
- `instrumentation.ts` exists and references Sentry
- Plausible script tag is in the root layout (grep for `plausible.io` in `app/` or `src/app/`)

Cat the Sentry config files (just the `dsn:` line, redact the actual DSN value to first 8 chars + `…`).

### Section 8 — Constitution + spec-kit alignment

After task 013 lands (constitution unification), run:
```bash
diff memory/constitution.md .specify/memory/constitution.md
```

If they diverge, mark FAIL. If they match (because 013 made them match) or `memory/constitution.md` is now the pointer file, mark PASS and note the structure.

Also confirm `.specify/` directory contains the expected spec-kit scaffold: `templates/`, `scripts/`, `memory/`. List the files.

**IMPORTANT TIMING:** If task 013 has not yet landed when 014 runs, do section 8 against the current state and clearly mark "pre-013 state" so I know to re-audit section 8 after 013 merges.

## Output format for the report

Use this exact template at `.opus/outbox/014-audit-report.md`:

```
# Foundation Audit — 2026-04-07

**Auditor:** Code Agent
**Commit audited:** <main HEAD sha>
**Overall verdict:** PASS / WARN / FAIL

## Summary table

| Section | Status | Notes |
|---|---|---|
| 1. 9 scripts | ... | ... |
| 2. Husky hooks | ... | ... |
| 3. CI workflow | ... | ... |
| 4. Branch protection | ... | ... |
| 5. Env vars | ... | ... |
| 6. Supabase + RLS | ... | ... |
| 7. Sentry + Plausible | ... | ... |
| 8. Constitution | ... | ... |

## Section 1 — 9 scripts
[evidence + exit codes]

## Section 2 — Husky
...

(continue for all 8)

## Failures and warnings — fix suggestions
- [section X]: <one-line dispatch suggestion>
- ...

## Surprises
- ...
```

## Do NOT

- Do not modify any file in the repo.
- Do not open a PR.
- Do not run anything that would mutate Supabase, Sentry, Vercel, or GitHub state.
- Do not run product code generation.
- Do not "fix" anything you find — just report.
