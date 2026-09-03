import { test, expect } from "@playwright/test";

test.describe("Phase 15: Universal Scientific Timeline E2E", () => {
  test("loads timeline explorer and filters events", async ({ page }) => {
    await page.goto("/timeline");
    await expect(page.locator("h1")).toContainText("CELESTIAL Scientific Timeline & Historical State");
    await expect(page.getByText("Chronological Synchronized Stream")).toBeVisible();
    await expect(page.getByPlaceholder("Search events")).toBeVisible();
  });

  test("loads event detail page and inspects provenance", async ({ page }) => {
    await page.goto("/timeline/voyager-1-launch");
    await expect(page.locator("h1")).toContainText("Voyager 1 Launch");
    await expect(page.getByText("Authoritative Provenance & Calibration Record")).toBeVisible();
  });
});
