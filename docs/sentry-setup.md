# Sentry Setup

The foundation PR ships Sentry config files (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`) wired to read `NEXT_PUBLIC_SENTRY_DSN` from env. The wizard step that creates the project and uploads source maps must be run manually after merge.

## Run the wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

When prompted:

- **Sentry org:** `empire-architect-lab`
- **Sentry project:** `blueprint` (create if missing)
- Allow the wizard to overwrite the existing config files — it will add source-map upload tokens and the Next.js plugin to `next.config.ts`
- Save the generated `SENTRY_AUTH_TOKEN` to Vercel env vars (Production + Preview)
- Save the `NEXT_PUBLIC_SENTRY_DSN` to Vercel env vars (Production + Preview)

## Verify

1. Add a temporary `throw new Error("sentry test")` in a route handler
2. Hit the route in the Vercel preview
3. Confirm the error appears in the Sentry dashboard within 60 seconds
4. Remove the test error
