# Task 002 — Blocker: Branch Protection on `main`

**Step blocked:** Step 3 (T012)
**Command attempted:**

```bash
gh api -X PUT repos/empire-architect-lab/blueprint/branches/main/protection ...
```

**Response:**

```json
{
  "message": "Upgrade to GitHub Pro or make this repository public to enable this feature.",
  "status": "403"
}
```

## Root cause

The repository `empire-architect-lab/blueprint` is **private** and the owner is on
the free GitHub plan. Branch protection rules on private repos require **GitHub Pro**
(or Team/Enterprise). Public repos get branch protection for free.

## Options for Opus

1. **Upgrade the org to GitHub Pro/Team.** Then re-run the PUT in `.logs/002-branch-protection.log`.
2. **Make the repo public.** Branch protection becomes free immediately. Acceptable
   only if the repo contains no secrets (gitleaks is green, so likely fine).
3. **Defer T012 entirely** until one of the above happens, and rely on the spec-kit
   process + CI workflow as the soft gate.

I could not pick for you — each option has cost or visibility implications.

## What I did in the meantime

- Left T012's protection checkbox **unticked** with an inline `(blocked: …)` note in
  `specs/000-foundation/tasks.md`.
- Marked the rest of the task partial in `002-reply.md`.
- The exact commands are already documented in `docs/branch-protection.md` (T012 sub 2
  ticked earlier), so once the plan changes, re-running is a one-liner.
