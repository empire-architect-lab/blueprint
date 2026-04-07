# Foundation Audit — 2026-04-07

**Auditor:** Code Agent
**Commit audited:** `5537776801f19030d22487b3c47434d28fbd82531` (origin/main HEAD, post PR #2 merge, **pre-PR #8 merge**)
**Overall verdict:** **PASS with 1 WARN** (working-tree gitleaks noise on gitignored files; no actual committed secrets)

## Summary table

| Section | Status | Notes |
|---|---|---|
| 1. 9 scripts | ✅ PASS | All 9 exit 0 against current main |
| 2. Husky hooks | ✅ PASS | `pre-commit` (lint-staged), `pre-push` (8 of 9 scripts), `commit-msg` exists, `_/` shim installed |
| 3. CI workflow | ✅ PASS | All 9 scripts wired, runs on PR + push to main, Node 20, npm cache |
| 4. Branch protection | ✅ PASS | `enforce_admins=true` (loophole closed), 1 review required, `ci` required, dismiss stale = true, linear history |
| 5. Env vars | ⚠️ WARN | `.env.example` missing 2 of 7 required keys; `gitleaks --no-git` noisy on gitignored files |
| 6. Supabase + RLS | ✅ PASS (N/A subsections) | Scripts pass; no migrations / no tables yet — meaningful from T001 |
| 7. Sentry + Plausible | ✅ PASS | All 3 Sentry configs + `instrumentation.ts` present; Plausible script in `[locale]/layout.tsx` |
| 8. Constitution | 🟡 PRE-013 STATE | Files diverge as expected. Re-audit after PR #8 merges. |

---

## Section 1 — 9 scripts

| # | Script | Exit | Last lines |
|---|---|---|---|
| 1 | `npm run typecheck` (`tsc --noEmit`) | **0** | (no output) |
| 2 | `npm run lint` (`eslint . && prettier --check .`) | **0** | `Checking formatting... All matched files use Prettier code style!` |
| 3 | `npm run test` (vitest) | **0** | `Test Files 1 passed (1) / Tests 2 passed (2) / Duration 560ms` |
| 4 | `npm run test:e2e` (playwright) | **0** | `ok 1 [chromium] › e2e\home.spec.ts:4:5 › home page renders and is accessible (376ms) / 1 passed (11.1s)` (deprecation warning re middleware→proxy, non-blocking) |
| 5 | `npm run scan:secrets` (gitleaks, git-aware) | **0** | `19 commits scanned. / scan completed in 90.5ms / no leaks found` |
| 6 | `npm audit --audit-level=high` | **0** | `found 0 vulnerabilities` |
| 7 | `bash scripts/check-rls.sh` | **0** | `check-rls: OK` |
| 8 | `bash scripts/check-tenant-id.sh` | **0** | `check-tenant-id: OK` |
| 9a | `bash scripts/check-forbidden-terms.sh` | **0** | `check-forbidden-terms: OK` |
| 9b | `bash scripts/check-i18n.sh` | **0** | `check-i18n: OK` |

**Section 1 verdict: PASS.** All 9 scripts exist as documented and pass against current main.

---

## Section 2 — Husky hooks

```
.husky/
├── _/         (husky shim, install confirmed)
├── commit-msg
├── pre-commit
└── pre-push
```

**`.husky/pre-commit`:**
```sh
npx lint-staged
```

**`.husky/pre-push`:**
```sh
npm run typecheck && npm run lint && npm run test && npm run scan:secrets && npm run scan:rls && npm run scan:tenant && npm run scan:forbidden && npm run scan:i18n
```

**`.husky/_/` present:** ✅ (`husky install` ran)

**Coverage of the 9 scripts on `pre-push`:** 8 of 9 (typecheck, lint, vitest, scan:secrets, scan:rls, scan:tenant, scan:forbidden, scan:i18n). **Not on pre-push:** `test:e2e` (Playwright, slow) and `npm audit` (network). Both run in CI. This is a reasonable split — local pre-push stays fast, full coverage on CI.

**Section 2 verdict: PASS.**

---

## Section 3 — GitHub Actions CI workflow

`.github/workflows/ci.yml`:

- Triggers: `pull_request` → `main`, and `push` → `main` ✅
- Runner: `ubuntu-latest`
- Node: `20` (matches `package.json` engines if pinned; not verified separately)
- Cache: `cache: "npm"` on `actions/setup-node@v4` ✅
- Playwright: `npx playwright install --with-deps chromium`
- Gitleaks: pinned `v8.21.2` curl install
- Steps: typecheck, lint, unit tests, e2e tests, scan:secrets, scan:deps, scan:rls, scan:tenant, scan:forbidden, scan:i18n — **all 9 wired** ✅

**Section 3 verdict: PASS.** Side-note: actions/checkout@v4 + actions/setup-node@v4 will hit Node 20 deprecation in June 2026. Non-urgent.

---

## Section 4 — Branch protection on main

`gh api repos/empire-architect-lab/blueprint/branches/main/protection`:

| Setting | Value |
|---|---|
| Required status checks | `["ci"]`, `strict=true` |
| Required approving review count | `1` |
| Dismiss stale reviews | `true` ✅ |
| Require code-owner reviews | `false` |
| Require last push approval | `false` |
| `enforce_admins` | **`true`** ✅ — loophole closed since the PR #3 incident |
| Required linear history | `true` ✅ |
| Allow force pushes | `false` ✅ |
| Allow deletions | `false` ✅ |
| Required signatures | `false` |
| Required conversation resolution | `false` |

**Section 4 verdict: PASS.** `enforce_admins=true` means the bot-review flow is now the only path to merge, even for admins. This is the post-incident fix from earlier today (PR #3 was merged via admin bypass before this was enabled).

---

## Section 5 — Environment variables wiring

**Files present:**
```
.env.example       (committed, 17 lines)
.env.development   (gitignored)
.env.local         (gitignored)
.env.staging       (gitignored)
.env.bot.local     (gitignored)
```
All 5 ✅.

**Keys in `.env.example` (names only):**
- `NEXT_PUBLIC_SUPABASE_URL` ✅
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` ✅
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (extra, fine)
- `SUPABASE_SERVICE_ROLE_KEY` ✅ (placeholder, empty)
- `TENANT_ID`
- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN` ✅
- `SENTRY_AUTH_TOKEN` ✅ (placeholder, empty)
- `SENTRY_ORG`
- `SENTRY_PROJECT`
- `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` ✅

**Required-key checklist:**
| Required key | Present |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ (placeholder only) |
| `NEXT_PUBLIC_SENTRY_DSN` | ✅ |
| `SENTRY_AUTH_TOKEN` | ✅ (placeholder only) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | ✅ |
| `NEXT_PUBLIC_BLUEPRINT_SFX` (per spec 001 FR-8) | **❌ MISSING** |

Spec 001 FR-8 requires `NEXT_PUBLIC_BLUEPRINT_SFX` to be readable in the client bundle (default false). It's not in `.env.example`. This needs to be added before T001 lands. **Fix dispatch suggestion:** add `NEXT_PUBLIC_BLUEPRINT_SFX=false` to `.env.example` as part of spec 001 T001 (foundation env wiring), or as a tiny standalone chore PR.

**`gitleaks detect --no-git` (working-tree scan):** exit 0 (it always exits 0 when `-v` not used), but reports **46 findings**. Breakdown:
- `.env.local`, `.env.development`, `.env.staging` (3 hits, all gitignored): real Supabase publishable keys (`sb_publishable_*`). These are **safe** by design — Supabase publishable keys are intended for client-side use. They are NOT in git history.
- `.env.bot.local` (1 hit, gitignored): RSA private key for the GitHub bot. Correctly gitignored, never committed.
- `.next/` build cache (5 hits, gitignored): Next.js preview-mode signing/encryption keys auto-generated at build time.
- `node_modules/@dotenvx/dotenvx/...` (multiple hits, gitignored): documentation example PEM blocks in third-party README files.
- `.opus/outbox/008-reply.md` (1 hit): a literal `-----BEGIN RSA PRIVATE KEY-----` placeholder string used in the reply text describing the bot setup. Not a real key.

**The git-aware `npm run scan:secrets` (= `gitleaks detect`) returns 0 leaks against actual history, which is what CI runs and what matters.** The working-tree scan is noise from gitignored files. ⚠️ **WARN** only because someone reading this should know the noise is expected and not panic.

**Section 5 verdict: WARN.** Missing `NEXT_PUBLIC_BLUEPRINT_SFX` from `.env.example`. Working-tree gitleaks noise is expected and acceptable; git-aware scan is clean.

---

## Section 6 — Supabase + RLS

- `scripts/check-rls.sh` → `check-rls: OK` (exit 0)
- `scripts/check-tenant-id.sh` → `check-tenant-id: OK` (exit 0)
- No migrations directory yet, no tables created — **N/A for per-table breakdown**. This section becomes meaningful starting at T001 of the first feature that touches Supabase. Current scripts are guards-without-targets: they pass because there's nothing to check.
- Supabase project ref placeholder in `.env.example`: `https://your-project.supabase.co` — placeholder format, not a real ref. Reference accounts not checked from this audit.

**Section 6 verdict: PASS (N/A subsections).** Re-audit at the first migration.

---

## Section 7 — Sentry + Plausible

**Sentry:**
- `sentry.client.config.ts` ✅ — `dsn: process.env.NEXT_PUBLIC_SENTRY_DSN`
- `sentry.server.config.ts` ✅ — `dsn: process.env.NEXT_PUBLIC_SENTRY_DSN`
- `sentry.edge.config.ts` ✅ — `dsn: process.env.NEXT_PUBLIC_SENTRY_DSN`
- `instrumentation.ts` ✅ — registers server + edge configs based on `NEXT_RUNTIME`, also re-exports `captureRequestError as onRequestError` from `@sentry/nextjs`

DSN values come from env, not committed. (No DSN value to redact — they're all `process.env.*`.)

**Plausible:**
- `src/app/[locale]/layout.tsx:59` — `<script src="https://plausible.io/js/script.js" ... />` ✅

**Section 7 verdict: PASS.**

---

## Section 8 — Constitution + spec-kit alignment (PRE-013 STATE)

**Audit ran on `main` HEAD `5537776`, which is BEFORE PR #8 (task 013 unification) merges. Re-audit this section after PR #8 lands.**

```
diff memory/constitution.md .specify/memory/constitution.md → exit 1 (differ)
120-line diff (full content swap, the two files share zero lines)
```

Pre-013 state confirmed:
- `memory/constitution.md` (45 lines) = real 10-principle constitution
- `.specify/memory/constitution.md` (73 lines) = unfilled spec-kit template (`[PROJECT_NAME]`, `[PRINCIPLE_1_NAME]`, etc.)

**`.specify/` directory contents:**
```
.specify/
├── init-options.json
├── integration.json
├── integrations/         (claude.manifest.json + scripts)
├── memory/
│   └── constitution.md   (template, will be overwritten by PR #8)
├── scripts/
│   └── bash/             (check-prerequisites.sh, common.sh, create-new-feature.sh, setup-plan.sh, update-agent-context.sh)
└── templates/
    ├── agent-file-template.md
    ├── checklist-template.md
    ├── constitution-template.md
    ├── plan-template.md
    ├── spec-template.md
    └── tasks-template.md
```

Spec-kit scaffold is fully present (templates/, scripts/, memory/) ✅

**Section 8 verdict: PRE-013 STATE.** Files diverge as expected. PR #8 (task 013) is open and CI-green; once merged, re-running `diff memory/constitution.md .specify/memory/constitution.md` should still show a diff (because `memory/constitution.md` becomes a 5-line pointer file, not a copy), but `.specify/memory/constitution.md` will contain the real principles. The "PASS" condition for this section after PR #8 is: `.specify/memory/constitution.md` contains the 10 numbered principles AND `memory/constitution.md` is the pointer text from task 013.

---

## Failures and warnings — fix suggestions

- **Section 5 — env example missing `NEXT_PUBLIC_BLUEPRINT_SFX`:** add to `.env.example` with default `false`. Either as part of spec 001 T001 (foundation env wiring step) or as a tiny standalone chore PR. Single-line change, no risk.
- **Section 5 — gitleaks working-tree noise:** not a real failure, but worth a one-line note in `CLAUDE.md` or a `docs/security.md` so future auditors don't panic. Optional.
- **Section 8 — re-audit after PR #8 merges:** quick recheck, can be a one-line append to this report or a follow-up dispatch.

## Surprises

1. **Pre-push hook covers 8 of 9 scripts but skips `test:e2e` and `npm audit`.** This is sane (Playwright is slow, audit needs network), and CI catches both, but it's worth knowing: a developer who only ever runs `git push` without going through CI could ship a broken e2e or a vulnerable dep locally. The CI gate catches it before merge, which is the intended design.
2. **Supabase publishable keys are in `.env.local` / `.env.development` / `.env.staging`** (gitignored, not in git history). This is correct by Supabase's design — `sb_publishable_*` keys are explicitly meant for client-side use. Just naming it because it might look alarming when the working-tree gitleaks scan flags them.
3. **Branch protection has `enforce_admins=true`.** Confirmed the post-PR-#3 fix landed. The bot-approval flow on PR #2 (task 011) was the first real test, and the fact that PR #2 still hasn't been merged via the bot review tells me Chainbeard hasn't clicked the merge button yet. Worth flagging to him separately.
4. **Spec 001 FR-8 introduces a new env var (`NEXT_PUBLIC_BLUEPRINT_SFX`) that isn't yet in `.env.example`.** Caught here, fixable in T001. This is exactly what this audit is for.
5. **`actions/checkout@v4` and `actions/setup-node@v4`** will be forced to Node 24 starting June 2026. Non-urgent but worth a calendar nudge.
6. **`middleware` → `proxy` deprecation warning** from Playwright's webserver output. Next.js 16 is renaming middleware. Non-blocking but will need a migration before upgrading further.

---

## Section 8 — Re-audit (post PR #8)

**Date:** 2026-04-07
**main HEAD:** `1f10b7d chore(constitution): make .specify/memory/constitution.md canonical, point old path to it (#8)`

```
$ diff memory/constitution.md .specify/memory/constitution.md
(diff exit=1 — files differ as expected: pointer vs canonical)

$ head -10 .specify/memory/constitution.md
# Blueprint Constitution

These principles bind every spec, every task, every commit. If a spec contradicts the constitution, the constitution wins.

## 1. Spec-Driven Development is the only process. No code without a spec.

Every feature, fix, refactor, or chore begins life in `specs/<NNN>-<slug>/`. The flow is `/speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement`. Code Agent never invents work; Cowork Opus dispatches via spec files. The single exception is this foundation task (000) — from spec 001 onward, no exceptions.

## 2. Multi-tenant by default. Every table has `tenant_id`. Every query filters by it. Every RLS policy enforces it.

$ head -10 memory/constitution.md
# Blueprint Lab Constitution

The canonical constitution lives at `.specify/memory/constitution.md` (the path spec-kit slash commands read from).

Do not edit this file. Edit `.specify/memory/constitution.md` instead. This file exists only as a pointer for readers who land here first.
```

**Verdict: ✅ PASS.** `.specify/memory/constitution.md` now contains the real 10 numbered principles. `memory/constitution.md` is the 5-line pointer per task 013. The diff is expected (one is canonical, one is the pointer) and is not a regression.
