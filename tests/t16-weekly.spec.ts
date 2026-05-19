import { test, expect } from "@playwright/test";
import * as path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../prototype.html")
  .replace(/\\/g, "/")}`;

async function load(page: any) {
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
  const coachmark = page.locator("#coachmark");
  if (await coachmark.isVisible()) {
    await page.evaluate(() => (window as any).dismissCoach?.());
    await page.waitForTimeout(300);
  }
}

test.describe("T16 — Weekly Digest", () => {
  test("T16-01: What's New nav button exists in header", async ({ page }) => {
    await load(page);
    const btn = page.locator("#weeklyNavBtn");
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("What's New");
  });

  test("T16-02: openWeekly() shows weekly overlay", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const overlay = page.locator("#weeklyOverlay");
    await expect(overlay).not.toHaveClass(/hidden/);
  });

  test("T16-03: Weekly overlay has a close button", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const closeBtn = page.locator("#weeklyOverlay .compare-close");
    await expect(closeBtn).toBeVisible();
  });

  test("T16-04: closeWeekly() hides the overlay", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    await page.evaluate(() => (window as any).closeWeekly());
    const overlay = page.locator("#weeklyOverlay");
    await expect(overlay).toHaveClass(/hidden/);
  });

  test("T16-05: Weekly body renders at least 2 issue cards", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const cards = page.locator(".weekly-issue-card");
    await expect(cards).toHaveCount(3);
  });

  test("T16-06: Issue cards contain product chip names", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const chips = page.locator(".weekly-chip");
    const count = await chips.count();
    expect(count).toBeGreaterThan(3);
  });

  test("T16-07: Issue card contains a weekly date label", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const dates = page.locator(".weekly-date");
    await expect(dates.first()).toContainText("2026-");
  });

  test("T16-08: Escape key closes weekly overlay", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    await page.keyboard.press("Escape");
    const overlay = page.locator("#weeklyOverlay");
    await expect(overlay).toHaveClass(/hidden/);
  });

  test("T16-09: Command palette contains 'What's New' entry", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.fill("#cmdInput", "weekly");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
    const labels = await results.allTextContents();
    expect(labels.some((t) => t.toLowerCase().includes("what"))).toBe(true);
  });

  test("T16-10: Weekly overlay has header title", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openWeekly());
    const header = page.locator("#weeklyOverlay .weekly-header h2");
    await expect(header).toBeVisible();
    await expect(header).toContainText("What's New");
  });
});
