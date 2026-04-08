import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page renders and is accessible", async ({ page }) => {
  // Force the reduced-motion branch so the router renders <Hero /> (with h1)
  // immediately instead of mounting the dynamic cinematic chunk.
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
