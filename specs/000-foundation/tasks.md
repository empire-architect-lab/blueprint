# Task 000 — Foundation

**Owner:** Code Agent
**Dispatcher:** Cowork Opus
**Goal:** Turn this empty repo into a fully armed Spec-Driven Development workspace. After this task, every future feature follows `/specify → /plan → /tasks → /implement`.

This is the ONLY task where you scaffold infrastructure. From spec 001 onward, every change must be driven by a spec.

---

## Definition of Done

All boxes below checked, all scripts green, PR open with green CI, Vercel preview URL live and reachable. Opus marks done after verifying the green CI badge and clicking the preview URL.

---

## T001 — Initialize Next.js 16 + TypeScript + Tailwind 4

- [ ] `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm`
- [ ] Verify `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/app/` exist
- [ ] `npm run dev` boots without errors on http://localhost:3000

## T002 — Install spec-kit and write the constitution

- [ ] Install spec-kit per https://github.com/github/spec-kit
- [ ] Run spec-kit init so `/specify`, `/plan`, `/tasks`, `/implement` slash commands are available
- [ ] Create `memory/constitution.md` with these principles (verbatim, then expand each):
  1. Spec-Driven Development is the only process. No code without a spec.
  2. Multi-tenant by default. Every table has `tenant_id`. Every query filters by it. Every RLS policy enforces it.
  3. CI is the gate. Nothing merges without green: typecheck, lint, unit, e2e, gitleaks, npm audit, RLS check, tenant check, forbidden terms, i18n.
  4. Conventional commits. `feat|fix|chore|refactor|docs|test(scope): subject`.
  5. No file > 500 lines. No `console.log`. No `@ts-ignore`. No `any` without a comment.
  6. Accessibility is non-negotiable. axe must pass on every page.
  7. i18n is non-negotiable. en, fr, ar, nl. RTL works.
  8. Observability from day one. Sentry on every error, Plausible on every page.
  9. Secrets never live in the repo. gitleaks is the gate.

## T003 — shadcn/ui + cinematic stack

- [ ] `npx shadcn@latest init` (defaults: Slate, CSS variables, src/components/ui)
- [ ] Install: `gsap @gsap/react lenis framer-motion`
- [ ] Install Aceternity UI helpers + Magic UI per their official docs
- [ ] Add `src/lib/animations/` with one example ScrollTrigger demo and one Lenis smooth-scroll provider in the root layout

## T004 — Supabase (3 environments)

- [ ] Create three Supabase projects via Supabase MCP if available, else document the manual steps in `docs/supabase-setup.md`: `blueprint-dev`, `blueprint-staging`, `blueprint-prod`
- [ ] Install `@supabase/supabase-js @supabase/ssr`
- [ ] Create `src/lib/supabase/client.ts`, `server.ts`, `middleware.ts` per Supabase Next.js App Router guide
- [ ] Add `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TENANT_ID`
- [ ] Create initial migration `supabase/migrations/0001_init.sql` that creates a `tenants` table and an example `roadmap_items` table, both with `tenant_id uuid not null` and RLS enabled with `tenant_id = current_setting('app.tenant_id')::uuid` policies

## T005 — Sentry + Plausible

- [ ] `npx @sentry/wizard@latest -i nextjs` (Sentry org/project: ask Opus, default to creating `blueprint` project under empire-architect-lab)
- [ ] Add Plausible script in root layout via `next/script` with placeholder domain `blueprint.empire-architect-lab.dev`
- [ ] Verify Sentry test error reaches the dashboard (use Sentry MCP if available)

## T006 — next-intl (en/fr/ar/nl)

- [ ] `npm i next-intl`
- [ ] Configure per next-intl App Router docs
- [ ] Create `messages/en.json`, `fr.json`, `ar.json`, `nl.json` with one key `home.title`
- [ ] Verify `/en`, `/fr`, `/ar`, `/nl` all render and `ar` is RTL

## T007 — The 9 non-negotiable scripts

Add to `package.json` scripts and create the shell scripts in `scripts/`:

- [ ] `typecheck`: `tsc --noEmit`
- [ ] `lint`: `next lint && prettier --check .`
- [ ] `test`: `vitest run`
- [ ] `test:e2e`: `playwright test`
- [ ] `scan:secrets`: `gitleaks detect --no-banner`
- [ ] `scan:deps`: `npm audit --audit-level=high`
- [ ] `scan:rls`: `bash scripts/check-rls.sh` — greps every `.sql` file in `supabase/migrations/` and fails if any `create table` is missing `enable row level security` and a policy referencing `tenant_id`
- [ ] `scan:tenant`: `bash scripts/check-tenant-id.sh` — greps `src/` for `.from(` calls that don't have `.eq('tenant_id'` within 10 lines
- [ ] `scan:forbidden`: `bash scripts/check-forbidden-terms.sh` — fails on `console.log`, `@ts-ignore`, `TODO:`, `FIXME:` outside test files
- [ ] `scan:i18n`: `bash scripts/check-i18n.sh` — fails if any key in `en.json` is missing in `fr.json`, `ar.json`, `nl.json`

## T008 — Husky + lint-staged

- [ ] `npm i -D husky lint-staged && npx husky init`
- [ ] Pre-commit: `lint-staged` running `prettier --write` and `eslint --fix` on staged files
- [ ] Pre-push: `npm run typecheck && npm run lint && npm run test && npm run scan:secrets && npm run scan:rls && npm run scan:tenant && npm run scan:forbidden && npm run scan:i18n`

## T009 — Vitest + Playwright + axe

- [ ] `npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom`
- [ ] `npm i -D @playwright/test && npx playwright install --with-deps`
- [ ] `npm i -D @axe-core/playwright`
- [ ] Add one passing unit test (`src/app/page.test.tsx`) and one passing e2e test (`e2e/home.spec.ts`) that runs axe against `/`

## T010 — GitHub Actions CI

- [ ] Create `.github/workflows/ci.yml` that on every PR runs, in this order, all 9 scripts above. Cache npm. Use Node 20.
- [ ] Workflow must fail loud on any non-zero exit
- [ ] Add status check name `ci` so we can require it in branch protection

## T011 — Vercel

- [ ] Use Vercel MCP if available to create project `blueprint` linked to `empire-architect-lab/blueprint`
- [ ] Configure: production branch = `main`, preview deployments = on for all PRs
- [ ] Add env vars for all 3 Supabase environments (dev → preview, prod → production)
- [ ] Trigger first preview deployment from this PR and capture the URL in the PR description

## T012 — Branch protection on `main`

- [ ] Use GitHub MCP or CLI: require PR before merge, require `ci` status check to pass, require linear history, no force pushes, no deletions
- [ ] Document the exact commands in `docs/branch-protection.md`

## T013 — Conventional commits config

- [ ] `npm i -D @commitlint/cli @commitlint/config-conventional`
- [ ] Husky `commit-msg` hook runs commitlint
- [ ] `commitlint.config.js` extends `@commitlint/config-conventional`

## T014 — Open the PR

- [ ] Branch name: `chore/000-foundation`
- [ ] Conventional commit: `chore(foundation): scaffold next.js, spec-kit, supabase, ci, vercel, hooks`
- [ ] PR title same as commit
- [ ] PR body must include: checklist of all T001–T013, the Vercel preview URL, and the green CI badge link
- [ ] Save full output of every script in `.logs/000-foundation.log` and link it in the PR
- [ ] **Do not merge.** Wait for Opus to verify and merge.

---

## Whitelist

Code Agent may touch any file in this repo for this task only. From spec 001 onward, every task must declare a file whitelist.

## Forbidden

- Skipping any of the 9 scripts
- Marking T001–T014 done without script evidence in `.logs/000-foundation.log`
- Inventing process files outside spec-kit conventions
- Committing secrets (gitleaks will catch you anyway)
- Merging the PR yourself
