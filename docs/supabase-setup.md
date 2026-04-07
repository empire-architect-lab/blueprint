# Supabase Setup

Blueprint runs against three Supabase projects: `blueprint-dev`, `blueprint-staging`, `blueprint-prod`. Code Agent did **not** create these — the projects must be created manually by Cowork Opus after the foundation PR merges.

## Create the projects

For each environment (dev, staging, prod):

1. Go to https://supabase.com/dashboard
2. Click **New project**
3. Organization: `empire-architect-lab`
4. Name: `blueprint-dev` (or `blueprint-staging` / `blueprint-prod`)
5. Database password: generate a strong one and store it in 1Password
6. Region: `eu-central-1` (Frankfurt) — required for GDPR
7. Plan: Free for dev/staging, Pro for prod
8. Click **Create new project** and wait for provisioning

## Apply the initial migration

Once each project exists:

1. Open the project → SQL Editor
2. Paste the contents of `supabase/migrations/0001_init.sql`
3. Run

This creates `tenants` and `roadmap_items` with `tenant_id`, RLS enabled, and per-tenant policies.

## Capture the env vars

For each project, in **Project Settings → API**, copy:

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` `secret` key → `SUPABASE_SERVICE_ROLE_KEY`

Generate a `TENANT_ID` (any UUID) per environment.

## Wire to Vercel

In Vercel → Project → Settings → Environment Variables, add the four vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `TENANT_ID`):

- `blueprint-dev` values → **Preview** environment
- `blueprint-prod` values → **Production** environment
- `blueprint-staging` values → **Preview** with a `staging` git branch filter (optional, configure when staging branch exists)

## Verify

- `npm run dev` boots without throwing on missing env vars (locally, copy `.env.example` to `.env.local` with the dev values)
- A query like `supabase.from('roadmap_items').select('id').eq('tenant_id', TENANT_ID)` returns an empty array, not an RLS error
