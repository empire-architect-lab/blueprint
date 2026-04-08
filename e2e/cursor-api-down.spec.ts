import { test, expect } from "@playwright/test";

// Spec 001 — Scenario E — head-commit API returns 500.
//
// Hero's useEffect fetch falls back silently to FALLBACK_COMMIT (the build-time
// snapshot) so the page must still render and the user must not see an
// uncaught error in the console. We force the reduced-motion branch so the
// router shows Hero immediately — Scenario E is about the API failure mode,
// not the cinematic happy path (which Scenario A already covers).
test("Scenario E — head-commit API down still reveals hero", async ({
  page,
}) => {
  await page.route("**/api/head-commit", (route) =>
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: '{"error":"down"}',
    }),
  );

  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  await expect(page.locator("main")).toBeVisible();

  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toBeVisible({ timeout: 12_000 });
  await expect(h1).toHaveText("Built by the process it teaches.");

  const replay = page.getByRole("button", { name: "Replay cinematic intro" });
  await expect(replay).toBeVisible();

  const uncaught = consoleErrors.filter((m) => /uncaught|unhandled/i.test(m));
  expect(uncaught).toEqual([]);
});
