import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page renders and is accessible", async ({ page }) => {
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
