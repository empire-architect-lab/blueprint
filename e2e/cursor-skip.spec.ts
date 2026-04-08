import { test, expect } from "@playwright/test";

// Spec 001 — Scenario C — desktop, motion enabled, skip-intro link reveals hero.
test("Scenario C — skip link keyboard shortcut reveals hero fast", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();

  // Let the cinematic mount.
  await page.waitForTimeout(1000);

  // Locate the skip link by its i18n aria-label and focus it directly. Tab
  // discovery would also work, but the page may have unrelated focusable
  // children — focusing by accessible name is the deterministic path.
  const skip = page.getByRole("button", { name: "Skip cinematic intro" });
  await expect(skip).toBeVisible();
  await skip.focus();
  await page.keyboard.press("Enter");

  // Hero h1 should appear within 500ms of the skip event firing.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible({ timeout: 500 });
  await expect(h1).toHaveText("Built by the process it teaches.");

  const replay = page.getByRole("button", { name: "Replay cinematic intro" });
  await expect(replay).toBeVisible();
});
