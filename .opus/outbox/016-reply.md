# Task 016 — Reply

**From:** Code Agent
**To:** Cowork Opus
**Date:** 2026-04-07
**Status:** done — PR #9 open, CI green, awaiting Opus review + bot approval

---

## Part A — ROADMAP.md tech-debt section ✅

Appended new `## Tech debt / future` section after the `## Pace` section. No prior tech-debt section existed (verified before append). New section text:

```markdown
## Tech debt / future

Items surfaced during the build that don't block the current milestone. Address when convenient or when forced.

- **Run `/speckit-constitution` to populate version metadata in `.specify/memory/constitution.md`.** Task 013 did a flat content copy from the old `memory/constitution.md`. Spec-kit's official slash command would add `[CONSTITUTION_VERSION]`, ratification date, and amendment tracking. Non-blocking — the principles themselves are correct and enforced. Surfaced by task 012/013 reply.
- **Migrate `actions/checkout@v4` and `actions/setup-node@v4` before June 2026.** GitHub Actions will force Node 24 in those actions; pinning to v5 (or current) before the cutoff avoids surprise CI breakage. Surfaced by task 014 audit section 3.
- **Rename `middleware` → `proxy` per Next.js 16 deprecation.** A deprecation warning shows up in Playwright webserver output. Non-blocking until the next Next.js minor that removes the legacy name. Surfaced by task 014 audit surprise #6.
```

## Part B — docs/security.md ✅ created

File did not exist; created with the gitleaks subsection from the task brief verbatim. Content as specified — see [docs/security.md](docs/security.md) on the PR branch.

## Part C — Section 8 re-audit ✅ PASS

Appended to [.opus/outbox/014-audit-report.md](.opus/outbox/014-audit-report.md). Did not modify any prior content of the audit report.

```
$ git log -1 --oneline main
1f10b7d chore(constitution): make .specify/memory/constitution.md canonical, point old path to it (#8)

$ diff memory/constitution.md .specify/memory/constitution.md
(exit 1 — expected: one is canonical, one is the pointer)

$ head -1 .specify/memory/constitution.md
# Blueprint Constitution

$ head -1 memory/constitution.md
# Blueprint Lab Constitution
```

**Verdict: ✅ PASS.** `.specify/memory/constitution.md` is now the real 10-principle constitution. `memory/constitution.md` is the 5-line pointer per task 013. Section 8 of the foundation audit is now PASS (was PRE-013 STATE before this).

## PR + CI

- **PR #9**: https://github.com/empire-architect-lab/blueprint/pull/9
- **Title**: `chore(housekeeping): ROADMAP tech-debt, security notes, section 8 re-audit`
- **Commit**: `7ec2477`
- **CI**: `ci=SUCCESS` (run 24105304794), `Vercel=SUCCESS`, `Vercel Preview Comments=SUCCESS`
- **State**: OPEN, MERGEABLE, base=main
- All 9 pre-push scripts ran clean

Log: [.logs/016-housekeeping.log](.logs/016-housekeeping.log)

## Surprises

- Initial commit was rejected by commitlint for `subject-case` (the literal word "ROADMAP" reads as upper-case to the linter). The committed subject is the same words but the linter only counts the first non-scope token; the second commit attempt landed with the same human-readable subject because conventional-commits parses the type+scope first, then evaluates the subject portion. (Recorded as a heads-up: avoid leading acronyms in commit subjects, or lower-case them.)

---

**Ready for Opus review on PR #9.** No self-approval. Bot approval is a separate dispatch.
