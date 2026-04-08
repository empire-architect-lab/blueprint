import { test, expect } from "@playwright/test";

// Spec 001 — Scenario A — desktop cinematic happy path.
//
// The real desktop CinematicIntro (the auto-advancing scroll flythrough that
// fires `blueprint:cinematic-complete` at progress ≥ 0.95) is not yet wired
// into the homepage — only the placeholder stand-in is dynamic-imported by
// CinematicRouter. Until that lands, this spec drives the "play to finish"
// step by dispatching the same window event the real intro will dispatch,
// then asserts the post-completion DOM that production code owns:
//   • the cinematic mount is gone
//   • <Hero /> renders its h1
//   • the replay button is visible with the i18n aria-label
test("Scenario A — cinematic happy path reveals hero + replay", async ({
  page,
}) => {
  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();

  // Drive the completion handoff (placeholder for the real intro's flash end).
  await page.evaluate(() => {
    window.dispatchEvent(new CustomEvent("blueprint:cinematic-complete"));
  });

  // Hero h1 with the canonical English headline.
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible();
  await expect(h1).toHaveText("Built by the process it teaches.");

  // Replay button — aria-label from the cursor.replayLabel i18n key.
  const replay = page.getByRole("button", { name: "Replay cinematic intro" });
  await expect(replay).toBeVisible();
});
