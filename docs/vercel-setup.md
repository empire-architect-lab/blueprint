# Vercel Setup

The foundation PR does **not** link the repo to Vercel. Cowork Opus performs these steps after the PR merges (or just before, to capture the preview URL in the PR body).

## Link the repo

1. Go to https://vercel.com/new
2. **Import Git Repository** → select `empire-architect-lab/blueprint`
3. Click **Import**
4. **Project Name:** `blueprint`
5. **Framework Preset:** Next.js (auto-detected)
6. **Root Directory:** `./`
7. **Build Command:** leave default (`next build`)
8. **Install Command:** leave default (`npm install`)
9. Do **not** click Deploy yet — add env vars first

## Environment variables

In **Settings → Environment Variables**, add the following:

| Variable                        | Production                           | Preview                              |
| ------------------------------- | ------------------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`      | `blueprint-prod` URL                 | `blueprint-dev` URL                  |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | prod anon key                        | dev anon key                         |
| `SUPABASE_SERVICE_ROLE_KEY`     | prod service role                    | dev service role                     |
| `TENANT_ID`                     | prod uuid                            | dev uuid                             |
| `NEXT_PUBLIC_SENTRY_DSN`        | prod DSN                             | dev DSN (or same)                    |
| `SENTRY_AUTH_TOKEN`             | from Sentry wizard                   | same                                 |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`  | `blueprint.empire-architect-lab.dev` | `blueprint.empire-architect-lab.dev` |

## Deployment settings

- **Production Branch:** `main`
- **Preview Deployments:** enabled for all PRs (default)
- **Comments on PRs:** enabled

## Trigger and verify

1. Click **Deploy** (or push a new commit to the PR branch)
2. Wait for the preview URL
3. Click it: confirm the home page loads at `/en`, `/fr`, `/ar`, `/nl`
4. Confirm the `ar` page renders right-to-left
5. Paste the preview URL into the foundation PR description
