# Blueprint Constitution

These principles bind every spec, every task, every commit. If a spec contradicts the constitution, the constitution wins.

## 1. Spec-Driven Development is the only process. No code without a spec.

Every feature, fix, refactor, or chore begins life in `specs/<NNN>-<slug>/`. The flow is `/speckit-specify → /speckit-plan → /speckit-tasks → /speckit-implement`. Code Agent never invents work; Cowork Opus dispatches via spec files. The single exception is this foundation task (000) — from spec 001 onward, no exceptions.

## 2. Multi-tenant by default. Every table has `tenant_id`. Every query filters by it. Every RLS policy enforces it.

Blueprint is multi-tenant from the first migration. Every Postgres table includes `tenant_id uuid not null`. Every Supabase query passes `.eq('tenant_id', TENANT_ID)`. Every RLS policy references `tenant_id = current_setting('app.tenant_id')::uuid`. The `scan:rls` and `scan:tenant` scripts enforce this in CI — there is no manual review fallback.

## 3. CI is the gate. Nothing merges without green: typecheck, lint, unit, e2e, gitleaks, npm audit, RLS check, tenant check, forbidden terms, i18n.

Branch protection on `main` requires the `ci` status check to pass. The 9 non-negotiable scripts run on every PR. A red check blocks merge — no overrides, no "just this once". If a script is wrong, fix the script in its own PR, do not bypass it.

## 4. Conventional commits. `feat|fix|chore|refactor|docs|test(scope): subject`.

Every commit message is parsed by commitlint via the Husky `commit-msg` hook. Subjects are imperative, lowercase, under 72 characters. Scope identifies the feature or area. This is enforced locally and in CI — non-conforming commits cannot be pushed.

## 5. No file > 500 lines. No `console.log`. No `@ts-ignore`. No `any` without a comment.

Files over 500 lines must be split. `console.log` is replaced with structured logging or removed. `@ts-ignore` is forbidden — fix the type. `any` requires an inline comment justifying why no narrower type is possible. The `scan:forbidden` script catches violations in CI.

## 6. Accessibility is non-negotiable. axe must pass on every page.

Every Playwright e2e test runs `@axe-core/playwright` against the rendered page and fails on any violation. Color contrast, focus states, semantic HTML, ARIA labels, keyboard navigation — all required, all tested. This is not optional polish; it is launch-blocking.

## 7. i18n is non-negotiable. en, fr, ar, nl. RTL works.

Every user-facing string lives in `messages/{en,fr,ar,nl}.json` and is rendered through `t()` from next-intl. The `scan:i18n` script fails if any key in `en.json` is missing in any other locale. Arabic is right-to-left and the layout must adapt — this is verified visually in preview deploys.

## 8. Observability from day one. Sentry on every error, Plausible on every page.

Sentry is wired into client, server, and edge runtimes from the first deploy. Every uncaught error reaches the dashboard. Plausible tracks every page view with no PII, no cookies, no consent banner needed. Observability is not added later — it is in the foundation.

## 9. Secrets never live in the repo. gitleaks is the gate.

`.env` files are gitignored. Only `.env.example` is committed, with placeholder values. The `scan:secrets` script runs gitleaks on every PR. Any committed secret is treated as a security incident, rotated immediately, and the commit history is rewritten. Real secrets live in Vercel env vars and the Supabase dashboard — nowhere else.

## 10. Bookkeeping is part of the work.

A task is not complete until the checkbox in `specs/<NNN>/tasks.md` is ticked in the same commit as the implementation. Code Agent ticks. Opus verifies. PRs that update files but leave `tasks.md` untouched are rejected.
