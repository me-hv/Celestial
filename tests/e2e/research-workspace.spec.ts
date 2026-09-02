import { test, expect } from "@playwright/test";

test.describe("Phase 12: Unified Scientific Research Workspace & Observatories", () => {
  test("loads Research Workspace and switches targets", async ({ page }) => {
    await page.goto("/research");
    await expect(page).toHaveTitle(/CELESTIAL/);
    await expect(page.getByRole("heading", { name: "Scientific Research Workspace" })).toBeVisible();

    // Select Mars from target list
    const marsButton = page.getByRole("button", { name: /Mars/i }).first();
    await marsButton.click();

    // Verify Mars profile loads in intelligence panel
    await expect(page.getByRole("heading", { name: "Mars" })).toBeVisible();
    await expect(page.getByText(/Observation Conditions & Windows/i)).toBeVisible();
  });

  test("loads direct target research profile page via /research/[slug]", async ({ page }) => {
    await page.goto("/research/m31-andromeda-galaxy");
    await expect(page.getByRole("heading", { name: /Andromeda Galaxy/i })).toBeVisible();
    await expect(page.getByText(/Direct Intelligence Profile/i)).toBeVisible();
  });

  test("renders Observatories Directory and inspects Keck Observatory", async ({ page }) => {
    await page.goto("/observatories");
    await expect(page.getByRole("heading", { name: "Astronomical Observatories Directory" })).toBeVisible();
    await expect(page.getByRole("heading", { name: /W. M. Keck Observatory/i })).toBeVisible();

    // Navigate to Keck profile
    await page.getByRole("link", { name: /Inspect Facility/i }).first().click();
    await expect(page.getByRole("heading", { name: "W. M. Keck Observatory" })).toBeVisible();
    await expect(page.getByText(/Primary Telescopes/i)).toBeVisible();
    await expect(page.getByText(/What Can This Observatory Observe Tonight\?/i)).toBeVisible();
  });

  test("loads Observation Planner and verifies target ranking", async ({ page }) => {
    await page.goto("/sky/planner");
    await expect(page.getByRole("heading", { name: /Night Sky Observation Planner/i })).toBeVisible();
    await expect(page.getByText(/Observation Parameters/i).or(page.getByText(/Faintest Magnitude/i))).toBeVisible();
  });
});
