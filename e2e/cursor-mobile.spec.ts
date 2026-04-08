import { test, expect, devices } from "@playwright/test";

// iPhone 12's default browser is webkit; the playwright project here only
// installs chromium, so override to chromium with the iPhone 12 viewport +
// user agent + touch flags. Same effective viewport, no extra binaries.
const iPhone12 = devices["iPhone 12"];
test.use({
  ...iPhone12,
  defaultBrowserType: "chromium",
});

// Spec 001 — Scenario D — mobile cinematic on iPhone 12 viewport.
test("Scenario D — mobile cinematic plays without three.js and reveals hero", async ({
  page,
}) => {
  const requestUrls: string[] = [];
  page.on("request", (req) => {
    requestUrls.push(req.url());
  });

  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();

  // Mobile world-map SVG should be visible during the map beat.
  const earth = page.locator('svg[data-role="earth-mobile"]');
  await expect(earth).toBeVisible({ timeout: 5000 });

  // Wait through the auto-advancing beats: typer (~1.5s) → map (1.8s) →
  // pipeline (8 × 350ms + 400ms ≈ 3.2s) → hero. 12s budget for safety.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible({ timeout: 12_000 });
  await expect(h1).toHaveText("Built by the process it teaches.");

  // The mobile chunk must not pull in three.js (case-insensitive match).
  const threeRequests = requestUrls.filter((u) => /three/i.test(u));
  expect(threeRequests).toEqual([]);
});
