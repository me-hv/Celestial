import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/explore",
  "/sky",
  "/stars",
  "/systems",
  "/deep-sky",
  "/galaxies",
  "/milky-way",
  "/local-group",
  "/cosmic-web",
  "/cosmic-time",
  "/observable-universe",
  "/missions",
];

test.describe("Runtime Error Console Crash Diagnostics", () => {
  for (const route of routes) {
    test(`loads ${route} without console TypeError or Webpack crash`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          consoleErrors.push(msg.text());
        }
      });

      page.on("pageerror", (err) => {
        pageErrors.push(err.message + "\n" + (err.stack || ""));
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1000);

      const fatalErrors = pageErrors.filter(
        (err) => !err.includes("WebGL") && !err.includes("getContext")
      );
      const fatalConsole = consoleErrors.filter(
        (err) =>
          err.includes("reading 'call'") ||
          err.includes("TypeError") ||
          err.includes("Cannot read properties")
      );

      if (fatalErrors.length > 0 || fatalConsole.length > 0) {
        console.error(`Route ${route} failed with errors:`, { fatalErrors, fatalConsole });
      }

      expect(fatalErrors).toHaveLength(0);
      expect(fatalConsole).toHaveLength(0);
    });
  }

  test("tests sidebar toggling and global search interaction", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(500);

    // Trigger universal search using keyboard shortcut or header button
    await page.keyboard.press("Control+k");
    await page.waitForTimeout(400);

    const searchInput = page.locator("input[placeholder*='Search']").first();
    if (await searchInput.isVisible()) {
      await searchInput.fill("Mars");
      await page.waitForTimeout(300);
      await page.keyboard.press("Escape");
    } else {
      const searchButton = page.locator("button:has-text('Search')").first();
      if (await searchButton.isVisible()) {
        await searchButton.click();
        await page.waitForTimeout(400);
        if (await searchInput.isVisible()) {
          await searchInput.fill("Mars");
          await page.waitForTimeout(300);
          await page.keyboard.press("Escape");
        }
      }
    }

    expect(pageErrors).toHaveLength(0);
  });
});
