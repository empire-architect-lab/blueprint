#!/usr/bin/env node
// Mint a short-lived (1 hour) GitHub App installation token for blueprint-code-agent.
//
// Reads from env (load via `.env.bot.local`, gitignored):
//   BLUEPRINT_BOT_APP_ID
//   BLUEPRINT_BOT_INSTALLATION_ID
//   BLUEPRINT_BOT_PRIVATE_KEY   (full PEM contents, newlines preserved)
//
// Prints the installation token to stdout. Nothing else. Suitable for:
//   BOT_TOKEN="$(npm run -s bot:token)"
//   gh auth login --with-token <<< "$BOT_TOKEN"
//
// No external deps: JWT signed inline with node:crypto.

import { createSign } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";

// Minimal .env.bot.local loader — no dotenv dep.
const envFile = ".env.bot.local";
if (existsSync(envFile)) {
  const content = readFileSync(envFile, "utf8");
  let currentKey = null;
  let currentValue = [];
  const commit = () => {
    if (currentKey && !process.env[currentKey]) {
      process.env[currentKey] = currentValue.join("\n").replace(/^"|"$/g, "");
    }
    currentKey = null;
    currentValue = [];
  };
  for (const line of content.split(/\r?\n/)) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (match) {
      commit();
      currentKey = match[1];
      currentValue = [match[2]];
    } else if (currentKey) {
      currentValue.push(line);
    }
  }
  commit();
}

const appId = process.env.BLUEPRINT_BOT_APP_ID;
const installationId = process.env.BLUEPRINT_BOT_INSTALLATION_ID;
const privateKey = process.env.BLUEPRINT_BOT_PRIVATE_KEY;

if (!appId || !installationId || !privateKey) {
  process.stderr.write(
    "error: missing BLUEPRINT_BOT_APP_ID / BLUEPRINT_BOT_INSTALLATION_ID / BLUEPRINT_BOT_PRIVATE_KEY\n" +
      "hint:  populate .env.bot.local at the repo root (gitignored)\n",
  );
  process.exit(1);
}

const base64url = (input) =>
  Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

const now = Math.floor(Date.now() / 1000);
const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
const payload = base64url(
  JSON.stringify({
    iat: now - 30,
    exp: now + 540, // 9 minutes, under GitHub's 10-minute max
    iss: appId,
  }),
);
const signer = createSign("RSA-SHA256");
signer.update(`${header}.${payload}`);
const signature = signer
  .sign(privateKey)
  .toString("base64")
  .replace(/=/g, "")
  .replace(/\+/g, "-")
  .replace(/\//g, "_");

const jwt = `${header}.${payload}.${signature}`;

const res = await fetch(
  `https://api.github.com/app/installations/${installationId}/access_tokens`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "blueprint-code-agent",
    },
  },
);

if (!res.ok) {
  const body = await res.text();
  process.stderr.write(
    `error: GitHub returned ${res.status} ${res.statusText}\n${body}\n`,
  );
  process.exit(1);
}

const data = await res.json();
process.stdout.write(data.token);
