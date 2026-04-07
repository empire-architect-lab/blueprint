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
