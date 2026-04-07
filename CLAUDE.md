# CLAUDE.md — Blueprint Lab

## What This Is

The Blueprint — a practice dashboard built with the full professional Spec-Driven Development process (GitHub spec-kit). The dashboard's content _is_ the process itself. This project is the rehearsal before NissMatch web rebuild.

## Who Works Here

- **Code Agent (VS Code)**: Executes spec-kit tasks. Runs `/specify`, `/plan`, `/tasks`, `/implement`. Commits, opens PRs, never marks anything done without green CI.
- **Cowork Opus**: CEO. Writes specs, decides priorities, verifies output, marks done after evidence, coordinates everything. Never writes product code.

## The Process — Spec-Driven Development (the only process)

```
Vision → Roadmap → /specify → /plan → /tasks → /implement → PR → CI → Vercel preview → Merge → Deploy
```

Use spec-kit. Do not invent workflow. Do not write SESSION\_\*.md files. Tasks live in `specs/<NNN>-<feature>/tasks.md`.

## Stack (locked)

- Next.js 16, TypeScript, Tailwind 4, shadcn/ui
- Supabase (Postgres + Auth + RLS, multi-tenant) — dev/staging/prod
- Vercel (preview per PR, prod on main)
- spec-kit (`/specify`, `/plan`, `/tasks`, `/implement`)
- Husky + lint-staged
- Vitest + Playwright + axe
- Sentry + Plausible
- GSAP + ScrollTrigger + Lenis + Framer Motion + Aceternity + Magic UI
- next-intl (en/fr/ar/nl)
- gitleaks + npm audit + semgrep

## Code Agent Rules

- On startup: read `specs/` for any task file with unchecked items, pick the smallest one
- For every task: write a plan first (files, changes, risks), then implement, then run scripts
- Touch only files in the task whitelist
- After implementation: run `npm run typecheck`, `npm run lint`, `npm run test`, `npm run test:e2e`, save logs to `.logs/<task-id>.log`
- Open a PR. Wait for CI. Do not mark done. Opus marks done.
- Conventional commits (feat/fix/chore/refactor/docs/test)
- No `console.log`, no `@ts-ignore`, no files over 500 lines
- **Bookkeeping commits per task.** At the end of every task, in addition to the product PR, commit your `.logs/<task-id>.log`, your `.opus/outbox/<task-id>-reply.md`, and any `.opus/inbox/<task-id>-*.md` you consumed. These belong on the same task branch as the product code (or, if the task produced no product code, on a `chore(opus)/<task-id>` branch). The whitelist rule is about not touching unrelated _product_ code — it is not a license to leave evidence-of-work uncommitted. Caught by task 018 after 9 consecutive tasks of drift; never again.

## Cowork Opus Rules

- Read `SEED.md` first, every conversation
- Read `ROADMAP.md` and `.specify/memory/constitution.md` before any decision
- Use spec-kit slash commands or write spec.md/plan.md/tasks.md directly
- Verify Code Agent output by reading the green CI status + the Vercel preview URL (via Vercel MCP if available)
- Never write product code yourself
- Never mark a task done without script evidence
- Lead with "here's what I'm doing next, I need X from you"
- One action at a time. Define every technical term inline. Treat Chainbeard like he's 5 on technical concepts.

## The 9 Non-Negotiable Scripts

1. `tsc --noEmit`
2. `eslint` + `prettier`
3. `vitest` (unit)
4. `playwright` (e2e)
5. `gitleaks` (secret scan)
6. `npm audit` (deps)
7. `scripts/check-rls.sh`
8. `scripts/check-tenant-id.sh`
9. `scripts/check-forbidden-terms.sh` + `scripts/check-i18n.sh`

All wired into Husky pre-commit/pre-push and `.github/workflows/ci.yml`. Branch protection requires green to merge.

## Source of Truth

1. `ROADMAP.md` — what we're building
2. `.specify/memory/constitution.md` — the rules every spec must follow
3. `SEED.md` — context for new Opus conversations

If anything contradicts these, the documents win.

## Multi-tenant

Every Supabase table has `tenant_id`. Every query has `.eq('tenant_id', TENANT_ID)`. Every RLS policy checks `tenant_id`. The `check-rls.sh` and `check-tenant-id.sh` scripts enforce this in CI.

## Forbidden

- Inventing process or workflow files (use spec-kit only)
- Writing product code from Cowork (dispatch via spec-kit tasks)
- Marking tasks done without script evidence
- Importing anything from old NissMatch repos
- Using the word "session" for build work (say "task")
- Asking Chainbeard to choose between options (decide and act)
- Typing the literal byte sequences for PEM private-key headers or footers (the dashes-BEGIN-RSA-PRIVATE-KEY-dashes wrapper, or its END counterpart, for any key type) in any committed markdown file, even when describing a placeholder or quoting a previous fix. Gitleaks scans full git history and will block the push, forcing a reset-soft + recommit. Always paraphrase ("the BEGIN/END dashes-RSA-dashes wrapper", "PEM header markers", etc.). Tripped twice in tasks 019 and 020 by the same reply file describing the same fix.

## Conventional Commit Examples

- `feat(home): add hero section per spec 001 T002`
- `fix(rls): add tenant_id policy on roadmap_items table`
- `chore(ci): add check-forbidden-terms script`
