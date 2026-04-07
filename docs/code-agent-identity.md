# Code Agent GitHub Identity

## Why this exists

Branch protection on `main` requires (a) green CI and (b) ≥1 approving review. GitHub forbids the PR author from approving their own PR. Code Agent and Chainbeard previously shared one identity, so every PR was permanently blocked at the review gate.

The fix is to give Code Agent its own GitHub identity so author ≠ approver. The constitution (Principle 3) now codifies this: Code Agent authors, Chainbeard approves.

## Decision: GitHub App (Option A)

We use a **GitHub App** owned by the `empire-architect-lab` org named `blueprint-code-agent`, installed only on the `blueprint` repo. Commits and PRs created via the App's installation token are attributed to `blueprint-code-agent[bot]`, which GitHub treats as a distinct actor for branch-protection purposes.

### Why App over machine user

| Criterion                      | App (A)                                     | Machine user (B)                          |
| ------------------------------ | ------------------------------------------- | ----------------------------------------- |
| Splits author from approver    | Yes — `[bot]` actor is distinct             | Yes — separate user                       |
| New email address required     | No                                          | Yes                                       |
| Browser clicks for Chainbeard  | ~10                                         | ~20 (signup + verify + invite + accept)   |
| Credential rotation            | Installation tokens auto-expire (1 hour)    | Manual PAT rotation, no expiry by default |
| Owned by org                   | Yes                                         | Indirect (collaborator only)              |
| Counts toward seat licensing   | No                                          | Yes (1 paid seat on private repos)        |
| Branch-protection author check | App is treated as separate author by GitHub | Separate author                           |

GitHub's branch protection treats App-authored commits and pull requests as authored by the App, not by the user who installed it. This is the intended use case for "bot identities" — see GitHub Docs → Authenticating as a GitHub App installation. There is no known blocker.

If a future GitHub change reverses this, fall back to Option B and update this doc.

## Manual setup — Chainbeard's steps

These steps must be done by Chainbeard in the browser, signed in to the `empire-architect-lab` org as an org owner. They take ~5 minutes.

### Step 1 — Create the GitHub App

1. Open https://github.com/organizations/empire-architect-lab/settings/apps in your browser.
2. Click the green **New GitHub App** button (top right).
3. Fill in the form:
   - **GitHub App name:** `blueprint-code-agent`
   - **Homepage URL:** `https://github.com/empire-architect-lab/blueprint`
   - **Webhook → Active:** uncheck the box (we don't need webhooks)
   - **Webhook URL:** leave blank
4. Under **Repository permissions**, set:
   - **Actions:** Read-only
   - **Checks:** Read-only
   - **Contents:** Read and write
   - **Metadata:** Read-only (this is forced on)
   - **Pull requests:** Read and write
   - Leave everything else at "No access"
5. Under **Where can this GitHub App be installed?**, select **Only on this account**.
6. Click the green **Create GitHub App** button at the bottom.
7. On the next page, scroll down to **Private keys** and click **Generate a private key**. A `.pem` file downloads automatically. **Keep this file** — we'll paste its contents into a repo secret in step 3.
8. At the top of the same page, copy the **App ID** (a number like `1234567`). Paste it somewhere temporarily — we need it in step 3.

### Step 2 — Install the App on the blueprint repo

1. In the left sidebar of the App settings page, click **Install App**.
2. Next to `empire-architect-lab`, click the green **Install** button.
3. Choose **Only select repositories** and pick `blueprint` from the dropdown.
4. Click the green **Install** button at the bottom.
5. After install, look at the URL — it ends in `/installations/<NUMBER>`. Copy that **Installation ID** number.

### Step 3 — Store credentials as repo secrets

1. Open https://github.com/empire-architect-lab/blueprint/settings/secrets/actions.
2. Click the green **New repository secret** button.
3. Add three secrets one at a time:
   - **Name:** `BLUEPRINT_BOT_APP_ID` — **Value:** the App ID from step 1.8
   - **Name:** `BLUEPRINT_BOT_INSTALLATION_ID` — **Value:** the Installation ID from step 2.5
   - **Name:** `BLUEPRINT_BOT_PRIVATE_KEY` — **Value:** open the `.pem` file from step 1.7 in a text editor and paste the **entire contents**, including the BEGIN and END RSA private key header/footer lines
4. After saving, you should see all three secrets listed (their values are hidden).
5. **Delete the local `.pem` file from your Downloads folder.** It is now in repo secrets and nowhere else needs to keep it.

### Step 4 — Tell Code Agent the setup is done

Reply in the next inbox message that the App is installed. Code Agent will:

- Generate a short-lived installation token from the App ID + private key + installation ID
- Configure git on this machine to commit and push as `blueprint-code-agent[bot]`
- Push a tiny test commit to a throwaway branch and prove the author shows as the bot
- Submit an approving review on PR #3 as the bot, unblocking it
- Do the same for PR #2 once task 006 is approved

## Token generation (Code Agent's side, once secrets exist)

Installation tokens last 1 hour. Code Agent regenerates one at the start of each task using a tiny script (added in a follow-up commit once the secrets exist):

```bash
# scripts/get-bot-token.sh — added in follow-up
node scripts/generate-installation-token.mjs
# prints a token to stdout; export to env or pipe into `gh auth login --with-token`
```

The script reads `BLUEPRINT_BOT_APP_ID`, `BLUEPRINT_BOT_INSTALLATION_ID`, and `BLUEPRINT_BOT_PRIVATE_KEY` from local env vars (Chainbeard's machine) or from repo secrets when running in CI. Local dev sets them in `.env.local` (gitignored).

## Git config (Code Agent's machine)

After token generation:

```bash
git config user.name  "blueprint-code-agent[bot]"
git config user.email "<APP_ID>+blueprint-code-agent[bot]@users.noreply.github.com"
gh auth login --with-token <<< "$BOT_TOKEN"
```

The numeric `<APP_ID>` prefix on the email is the GitHub-standard format for App bot noreply addresses.

## Token rotation

- **Installation tokens** auto-expire after 1 hour. Code Agent generates a fresh one at the start of each task. No manual rotation.
- **Private key** rotates only if compromised. Procedure: in App settings → **Private keys**, click **Generate a private key** for the new one, paste into `BLUEPRINT_BOT_PRIVATE_KEY` secret (overwriting), then click **Delete** next to the old key.

## Branch protection — current state on `main`

- Required pull request reviews: **1 approving review**
- Required status checks: **`ci`** (must be passing)
- Dismiss stale approvals on new commits: **on**
- Restrict who can push: only via PR
- Allow force pushes: **off**
- Allow deletions: **off**

These rules are unchanged by this task. The bot identity satisfies them; nothing about the protection itself moves.

## Troubleshooting

- **"Resource not accessible by integration"** when the bot tries to push: the App permissions are missing `Contents: write`. Re-check step 1.4.
- **PR shows author as Chainbeard, not the bot**: git config `user.email` is wrong on the local machine. Run the commands in the **Git config** section again.
- **GitHub rejects the JWT** when generating an installation token: clock skew on the local machine, or the private key was copied with extra whitespace. Re-paste the secret.

## Related

- Constitution Principle 3 — `memory/constitution.md`
- Task dispatch — `.opus/inbox/007-code-agent-identity.md`
- Existing branch protection log — `.logs/T012-branch-protection.log` (post PR #3 merge)
