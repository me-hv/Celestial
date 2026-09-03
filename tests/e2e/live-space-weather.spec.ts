import { test, expect } from "@playwright/test";

test.describe("Phase 14: Live Scientific Data & Space Weather Intelligence E2E", () => {
  test("loads space weather center and inspects NOAA feeds", async ({ page }) => {
    await page.goto("/space-weather");
    await expect(page.locator("h1")).toContainText("Space Weather & Heliophysics Intelligence");
    await expect(page.getByText("NOAA SWPC Real-Time Center")).toBeVisible();
    await expect(page.getByText("Solar Wind Plasma")).toBeVisible();
    await expect(page.getByText("Geomagnetic Kp Index")).toBeVisible();
  });

  test("loads live command center and verifies widgets", async ({ page }) => {
    await page.goto("/live");
    await expect(page.locator("h1")).toContainText("CELESTIAL Live Intelligence Dashboard");
    await expect(page.getByText("Sky Observer State")).toBeVisible();
    await expect(page.getByText("Deep Space Fleet")).toBeVisible();
    await expect(page.getByText("Scientific Data Provider Stream Health")).toBeVisible();
  });
});
