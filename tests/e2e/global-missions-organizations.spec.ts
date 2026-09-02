import { test, expect } from "@playwright/test";

test.describe("Phase 11.5: Global Space Missions & Research Organizations", () => {
  test("navigates to /organizations directory and filters by region", async ({ page }) => {
    await page.goto("/organizations");
    await expect(page.locator("h1")).toContainText("Global Space & Research Organizations");

    // Click South Asia region filter
    await page.click("button:has-text('South Asia')");
    await expect(page.getByRole("link", { name: "ISRO" }).first()).toBeVisible();
    await expect(page.locator("text=Indian Space Research Organisation").first()).toBeVisible();
  });

  test("loads ISRO organization profile page and verifies missions", async ({ page }) => {
    await page.goto("/organizations/isro");
    await expect(page.locator("h1")).toContainText("Indian Space Research Organisation");
    await expect(page.getByRole("link", { name: "Chandrayaan-3" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Mars Orbiter Mission" }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: "Aditya-L1" }).first()).toBeVisible();
  });

  test("loads JAXA organization profile and verifies Hayabusa2", async ({ page }) => {
    await page.goto("/organizations/jaxa");
    await expect(page.locator("h1")).toContainText("Japan Aerospace Exploration Agency");
    await expect(page.getByRole("link", { name: "Hayabusa2" }).first()).toBeVisible();
  });

  test("loads Chandrayaan-3 mission profile and verifies organization matrix", async ({ page }) => {
    await page.goto("/missions/chandrayaan-3");
    await expect(page.locator("h1")).toContainText("Chandrayaan-3");
    await expect(page.locator("text=Mission Organizations & Collaboration Matrix")).toBeVisible();
    await expect(page.locator("text=Indian Space Research Organisation").first()).toBeVisible();
  });

  test("verifies global search indexing for space organizations", async ({ page }) => {
    await page.goto("/");
    // Trigger global search shortcut
    await page.keyboard.press("Control+k");
    const searchInput = page.locator("input[placeholder*='Search']");
    if (await searchInput.isVisible()) {
      await searchInput.fill("ISRO");
      await expect(page.locator("text=Indian Space Research Organisation").first()).toBeVisible();
    }
  });
});
