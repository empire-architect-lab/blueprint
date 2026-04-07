# Task 016 — Housekeeping: ROADMAP tech-debt section, gitleaks note, section 8 re-audit

**From:** Cowork Opus
**To:** Code Agent
**Date:** 2026-04-07
**Priority:** P3 — bundle of small deferred items, one PR

---

## Why

PR #8 merged. Audit task 014 surfaced three deferred items I promised Chainbeard I'd handle. Bundling them into one PR to avoid PR sprawl.

## Three things, one PR

### Part A — Add "Tech debt / future" section to ROADMAP.md

Append a new section at the bottom of `ROADMAP.md`:

```markdown
## Tech debt / future

Items surfaced during the build that don't block the current milestone. Address when convenient or when forced.

- **Run `/speckit-constitution` to populate version metadata in `.specify/memory/constitution.md`.** Task 013 did a flat content copy from the old `memory/constitution.md`. Spec-kit's official slash command would add `[CONSTITUTION_VERSION]`, ratification date, and amendment tracking. Non-blocking — the principles themselves are correct and enforced. Surfaced by task 012/013 reply.
- **Migrate `actions/checkout@v4` and `actions/setup-node@v4` before June 2026.** GitHub Actions will force Node 24 in those actions; pinning to v5 (or current) before the cutoff avoids surprise CI breakage. Surfaced by task 014 audit section 3.
- **Rename `middleware` → `proxy` per Next.js 16 deprecation.** A deprecation warning shows up in Playwright webserver output. Non-blocking until the next Next.js minor that removes the legacy name. Surfaced by task 014 audit surprise #6.
```

If `ROADMAP.md` already has a "Tech debt" section (it didn't as of task 013), append the three items to it instead of duplicating the heading.

### Part B — Add gitleaks working-tree noise note

Append a short subsection to `docs/security.md`. If `docs/security.md` does not exist, create it with this content:

```markdown
# Security notes

## Gitleaks working-tree scans vs git-history scans

CI runs `npm run scan:secrets` which is `gitleaks detect` (git-history aware). This is the authoritative scan and must always be 0 leaks.

If you ever run `gitleaks detect --no-git` (working-tree scan) you will see ~46 "findings". They are all in **gitignored** files:

- `.env.local`, `.env.development`, `.env.staging` — Supabase publishable keys (`sb_publishable_*`). Safe by design — these keys are intended for client-side use. RLS is the security boundary, not key secrecy.
- `.env.bot.local` — RSA private key for the GitHub bot identity. Correctly gitignored.
- `.next/` build cache — Next.js auto-generated preview-mode signing keys.
- `node_modules/@dotenvx/dotenvx/...` — example PEM blocks in third-party README files.
- `.opus/outbox/008-reply.md` — placeholder string `-----BEGIN RSA PRIVATE KEY-----` in narrative text, not a real key.

**None of the above are in git history.** The git-aware CI scan is what matters and is always clean.

If `service_role` keys (NOT publishable) ever appear anywhere, that IS a real incident — rotate immediately via Supabase dashboard.
```

If the file already exists, append the subsection without duplicating the title.

### Part C — Re-audit section 8 of the foundation audit (post PR #8)

PR #8 (constitution unification) is now merged to main. Re-run the section 8 check from task 014 against current main:

```bash
git fetch origin
git log -1 --oneline main
diff memory/constitution.md .specify/memory/constitution.md
head -10 .specify/memory/constitution.md
head -10 memory/constitution.md
```

Expected result:
- `.specify/memory/constitution.md` contains the real 10 numbered principles (not template placeholders)
- `memory/constitution.md` contains the 5-line pointer text from task 013
- The two files differ (because one is the real constitution, the other is the pointer) — this is **correct**, not a regression

Append a `## Section 8 — Re-audit (post PR #8)` block to the end of `.opus/outbox/014-audit-report.md` with the command outputs and a one-line PASS/FAIL verdict. Do NOT modify the rest of the audit report.

## Commit + PR

- Branch: `chore/016-housekeeping`
- Commit: `chore(housekeeping): ROADMAP tech-debt, security notes, section 8 re-audit`
- PR title: same
- PR body: link to this task file (016) and to the three sources (014 audit, 013 reply, 012 reply)
- Wait for CI green
- Do NOT self-approve. Stop. Opus reviews + bot-approves in a follow-up dispatch.

## Reply

Write `.opus/outbox/016-reply.md` with:
- Part A: confirmation ROADMAP updated, paste the new section
- Part B: confirmation `docs/security.md` updated/created, paste the new subsection
- Part C: paste the re-audit output and the PASS/FAIL verdict
- PR number + CI status
- Path to log: `.logs/016-housekeeping.log`

## Do NOT

- Do not touch the constitution files themselves.
- Do not touch any source code under `src/`.
- Do not modify the existing 014 audit content — only append section 8 re-audit.
- Do not self-approve the PR.
