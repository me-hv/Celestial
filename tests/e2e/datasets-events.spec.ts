import { test, expect } from "@playwright/test";

test.describe("Phase 13: Datasets & Real-Time Astronomy Intelligence E2E", () => {
  test("loads datasets hub page and checks header and filters", async ({ page }) => {
    await page.goto("/datasets");
    await expect(page.locator("h1")).toContainText("Scientific Datasets");
    await expect(page.getByText("Strict Epistemic Provenance")).toBeVisible();
  });

  test("loads dataset profile page directly and inspects dossier", async ({ page }) => {
    await page.goto("/datasets/chandrayaan3-chaste-thermophysics");
    await expect(page.locator("h1")).toContainText("Chandrayaan-3 ChaSTE", { timeout: 15000 });
    await expect(page.getByText("Physical Parameters Measured")).toBeVisible();
    await expect(page.getByText("Data Pipeline & Transformation History")).toBeVisible();
  });

  test("loads sky events page with landmark celestial events and planning bridges", async ({ page }) => {
    await page.goto("/sky/events");
    await expect(page.locator("h1")).toContainText("Astronomical Events");
    await expect(page.getByText("Landmark Celestial Events Calendar")).toBeVisible();
  });
});
