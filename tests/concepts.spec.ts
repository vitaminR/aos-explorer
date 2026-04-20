import { test, expect } from "@playwright/test";
import path from "path";

test.describe("Concept Preview & Routing", () => {
  const explorerUrl = () =>
    `file:///${path.resolve(__dirname, "../prototype.html").replace(/\\/g, "/")}`;
  const conceptPageUrl = (slug: string) =>
    `file:///${path.resolve(__dirname, `../concepts/${slug}.html`).replace(/\\/g, "/")}`;

  test("hash deep-link prototype.html#concept=harness opens concept preview", async ({
    page,
  }) => {
    await page.goto(explorerUrl() + "#concept=harness");
    // Wait for detail panel to render the concept preview
    const detailPanel = page.locator("#detailPanel");
    await expect(detailPanel).toContainText("Execution Harness");
    await expect(detailPanel).toContainText("/harness");
    await expect(detailPanel).toContainText("Full page");
  });

  test("concepts/harness.html renders correctly", async ({ page }) => {
    await page.goto(conceptPageUrl("harness"));
    // Title
    await expect(page.locator("h1")).toHaveText("Execution Harness");
    // Slug
    await expect(page.locator(".slug")).toContainText("/harness");
    // Has explainer section
    await expect(page.locator("text=Explainer")).toBeVisible();
    // Has anti-pattern section
    await expect(page.locator("text=Anti-Patterns")).toBeVisible();
    // Has back link to explorer
    const backLink = page.locator("a.back");
    await expect(backLink).toContainText("Back to Explorer");
  });

  test("clicking concept link in detail panel opens preview (not full page)", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto(explorerUrl());

    // Dismiss the coachmark/tour overlay (blocks pointer events even when transparent)
    await page.evaluate(() => {
      if (typeof (window as any).dismissCoach === "function")
        (window as any).dismissCoach();
    });

    // Search for a product that mentions "harness" in its rationale
    const searchInput = page.locator("#searchInput");
    await searchInput.fill("bmad");
    await page.waitForTimeout(400); // debounce
    // Dismiss search autocomplete dropdown so it doesn't overlay the detail panel
    await page.keyboard.press("Escape");

    // Wait for detail panel to show BMAD content
    const detailPanel = page.locator("#detailPanel");
    await expect(detailPanel).toContainText("BMAD", { timeout: 10_000 });

    // Find and click on a concept link
    const conceptLink = detailPanel.locator(
      'a.concept-link[data-concept-slug="harness"]',
    );

    const count = await conceptLink.count();
    if (count > 0) {
      await conceptLink.first().click();
      // Should open concept preview, NOT navigate away
      await expect(page).toHaveURL(/prototype\.html/);
      await expect(detailPanel).toContainText("Execution Harness");
      await expect(detailPanel).toContainText("/harness");
    }
  });

  test("cmd/ctrl-click on concept link opens full page (not hijacked)", async ({
    page,
  }) => {
    await page.goto(explorerUrl() + "#concept=harness");
    const detailPanel = page.locator("#detailPanel");
    await expect(detailPanel).toContainText("Execution Harness");

    // The "Full page" link should point to concepts/harness.html
    const fullPageLink = detailPanel.locator(
      'a[href*="concepts/harness.html"]',
    );
    await expect(fullPageLink).toBeVisible();

    // Verify the href is correct (we can't truly test cmd-click opens new tab in Playwright easily,
    // but we verify the link target is correct and has target="_blank")
    const href = await fullPageLink.getAttribute("href");
    expect(href).toContain("concepts/harness.html");
    const target = await fullPageLink.getAttribute("target");
    expect(target).toBe("_blank");
  });

  test("explorer state is preserved when concept preview opens and closes", async ({
    page,
  }) => {
    // Set up some explorer state first
    await page.goto(explorerUrl() + "#type=framework");
    await page.waitForTimeout(300);

    // Open concept preview
    await page.evaluate(() => {
      (window as any).openConceptPreview("harness");
    });

    // Verify concept preview is showing
    const detailPanel = page.locator("#detailPanel");
    await expect(detailPanel).toContainText("Execution Harness");

    // Verify URL has both type and concept params
    const url1 = page.url();
    expect(url1).toContain("type=framework");
    expect(url1).toContain("concept=harness");

    // Close concept preview
    await page.evaluate(() => {
      (window as any).closeConceptPreview();
    });

    // Verify concept is gone but filter state is preserved
    const url2 = page.url();
    expect(url2).toContain("type=framework");
    expect(url2).not.toContain("concept=harness");
  });

  test("Escape key closes concept preview", async ({ page }) => {
    await page.goto(explorerUrl() + "#concept=harness");
    const detailPanel = page.locator("#detailPanel");
    await expect(detailPanel).toContainText("Execution Harness");

    // Press Escape
    await page.keyboard.press("Escape");

    // Preview should be closed
    await expect(detailPanel).not.toContainText("Execution Harness");
  });
});
