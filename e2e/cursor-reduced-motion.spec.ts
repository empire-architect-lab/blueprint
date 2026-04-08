import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Spec 001 — Scenario B — reduced-motion path.
//
// With prefers-reduced-motion: reduce, CinematicRouter takes the early-return
// branch and renders <Hero /> immediately along with the cinematic-disabled
// notice. No cinematic chunk is mounted, no events flow.
test("Scenario B — reduced-motion reveals hero immediately", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");

  await expect(page.locator("main")).toBeVisible();

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText("Built by the process it teaches.");

  const replay = page.getByRole("button", { name: "Replay cinematic intro" });
  await expect(replay).toBeVisible();

  // The reduced-motion notice — role=status, English canonical copy.
  await expect(page.getByRole("status")).toHaveText(
    "Cinematic intro disabled per your motion preferences.",
  );

  const axe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});
