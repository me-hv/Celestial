import { test, expect } from "@playwright/test";

test.describe("Phase 11 — Space Missions & Discoveries Explorer E2E", () => {
  test("should render the missions hub with statistics and filter missions", async ({ page }) => {
    await page.goto("/missions");
    await page.waitForLoadState("networkidle");

    // Check Header & Stats
    await expect(page.locator("h1")).toContainText("Space Missions & Discoveries");
    await expect(page.getByText("Total Missions")).toBeVisible();

    // Check filter interaction
    const searchInput = page.getByPlaceholder("Search missions by name, destination, agency, or target...");
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Voyager");

    await expect(page.getByRole("heading", { name: "Voyager 1" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Voyager 2" })).toBeVisible();
  });

  test("should navigate to a deep mission profile with 3D trajectory and telemetry", async ({ page }) => {
    await page.goto("/missions/voyager-1");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Voyager 1");
    await expect(page.getByText("3D Heliocentric Trajectory & Replay")).toBeVisible();

    // Verify 3D canvas viewport exists
    const viewport = page.getByRole("region", { name: "3D Interactive Mission Trajectory Viewport" });
    await expect(viewport).toBeVisible();

    // Verify Spacecraft and discoveries
    await expect(page.getByText("Spacecraft & Landers")).toBeVisible();
    await expect(page.getByText("Major Scientific Discoveries")).toBeVisible();
  });

  test("should render the Discoveries Archive page and filter breakthroughs", async ({ page }) => {
    await page.goto("/missions/discoveries");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1")).toContainText("Major Space Science Discoveries");
    await expect(page.getByPlaceholder("Search discoveries by target, title, or physical mechanism...")).toBeVisible();

    // Verify discovery cards
    await expect(page.getByText("Discovery of Active Water-Ice Plumes on Enceladus")).toBeVisible();
  });
});
