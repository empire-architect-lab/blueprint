# Branch Protection — `main`

Apply this **after** the foundation PR has merged and the `ci` workflow has run at least once (so the status check name is registered with GitHub).

## Option A — `gh` CLI (preferred)

```bash
gh api \
  --method PUT \
  -H "Accept: application/vnd.github+json" \
  /repos/empire-architect-lab/blueprint/branches/main/protection \
  -F required_status_checks.strict=true \
  -F required_status_checks.contexts[]='ci' \
  -F enforce_admins=true \
  -F required_pull_request_reviews.required_approving_review_count=0 \
  -F required_pull_request_reviews.dismiss_stale_reviews=true \
  -F required_linear_history=true \
  -F allow_force_pushes=false \
  -F allow_deletions=false \
  -F restrictions=null
```

Verify:

```bash
gh api /repos/empire-architect-lab/blueprint/branches/main/protection
```

## Option B — GitHub UI (click-by-click)

1. Go to https://github.com/empire-architect-lab/blueprint/settings/branches
2. Click **Add branch protection rule**
3. **Branch name pattern:** `main`
4. Check **Require a pull request before merging**
   - Required approving reviews: `0` (solo dev mode — bump to `1` when team grows)
   - Check **Dismiss stale pull request approvals when new commits are pushed**
5. Check **Require status checks to pass before merging**
   - Check **Require branches to be up to date before merging**
   - Search for and add status check: `ci`
6. Check **Require linear history**
7. Uncheck **Allow force pushes**
8. Uncheck **Allow deletions**
9. Check **Do not allow bypassing the above settings** (enforce on admins)
10. Click **Create** (or **Save changes**)

## Verify

- Open a draft PR with a deliberately broken commit
- Confirm the merge button is disabled until `ci` is green
- Confirm force push to `main` is rejected
