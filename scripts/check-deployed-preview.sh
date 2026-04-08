#!/usr/bin/env bash
# check-deployed-preview.sh — 10th non-negotiable script.
#
# Hits a deployed preview URL with headless chromium and asserts that the hero
# headline appears in the post-hydration DOM (not just in the i18n payload).
# This is the guardrail for silent CinematicRouter failures.
#
# Usage: PREVIEW_URL=https://...vercel.app scripts/check-deployed-preview.sh
set -euo pipefail

URL="${PREVIEW_URL:-}"
if [ -z "$URL" ]; then
  echo "check-deployed-preview: PREVIEW_URL env var is required" >&2
  exit 2
fi

# Strip trailing slash, append /en
URL="${URL%/}/en"
echo "check-deployed-preview: target=$URL"

node <<NODE
const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  page.on("pageerror", (err) => console.error("[pageerror]", err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") console.error("[console.error]", msg.text());
  });
  const resp = await page.goto("$URL", { waitUntil: "networkidle", timeout: 60000 });
  if (!resp || !resp.ok()) {
    console.error("check-deployed-preview: HTTP", resp && resp.status());
    process.exit(1);
  }
  // Wait up to 15s for the hero headline to appear in the live DOM.
  try {
    await page.waitForFunction(
      () => document.body && document.body.innerText.includes("Built by the process it teaches"),
      null,
      { timeout: 15000 },
    );
  } catch (err) {
    const html = await page.content();
    console.error("check-deployed-preview: hero headline NOT found in live DOM after 15s");
    console.error("---- snippet ----");
    console.error(html.slice(0, 2000));
    process.exit(1);
  }
  console.log("check-deployed-preview: OK — hero headline rendered in live DOM");
  await browser.close();
})().catch((err) => {
  console.error("check-deployed-preview: fatal", err);
  process.exit(1);
});
NODE
