import { test, expect } from "@playwright/test";

test.describe("Phase 9.5 & 10 3D Interaction and Navigation Regression", () => {
  test("verifies /explore 3D scene, planet selection, and telemetry updates", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    await page.goto("/explore", { waitUntil: "networkidle" });

    // Initial load displays default selected planet (Mercury)
    const telemetryHeading = page.locator("aside[aria-label='Celestial Telemetry Details'] h2");
    await expect(telemetryHeading).toHaveText(/MERCURY/i, { timeout: 15000 });

    // Select Earth from bottom controls
    const earthBtn = page.getByRole("button", { name: "Earth", exact: true });
    await earthBtn.click();
    await expect(telemetryHeading).toHaveText(/EARTH/i, { timeout: 10000 });

    // Select Mars from bottom controls
    const marsBtn = page.getByRole("button", { name: "Mars", exact: true });
    await marsBtn.click();
    await expect(telemetryHeading).toHaveText(/MARS/i, { timeout: 10000 });

    // Select Jupiter from bottom controls
    const jupiterBtn = page.getByRole("button", { name: "Jupiter", exact: true });
    await jupiterBtn.click();
    await expect(telemetryHeading).toHaveText(/JUPITER/i, { timeout: 10000 });

    const fatalErrors = consoleErrors.filter(
      (err) => err.includes("TypeError") || err.includes("reading 'call'")
    );
    expect(fatalErrors).toHaveLength(0);
  });

  test("verifies browser history back and forward navigation", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    await page.goto("/explore", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    await page.goBack({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    await page.goForward({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(300);

    expect(pageErrors).toHaveLength(0);
  });
});
