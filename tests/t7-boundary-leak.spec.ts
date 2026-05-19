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

test.describe("T7 — Daily Boundary Leak", () => {
  test("T7-01: Boundary leak card exists in DOM", async ({ page }) => {
    await load(page);
    const card = page.locator("#boundaryLeakCard");
    await expect(card).toBeAttached();
  });

  test("T7-02: Card renders a title", async ({ page }) => {
    await load(page);
    const title = page.locator("#blTitle");
    const text = await title.textContent();
    expect(text && text.length).toBeGreaterThan(3);
  });

  test("T7-03: Card renders body text", async ({ page }) => {
    await load(page);
    const body = page.locator("#blText");
    const text = await body.textContent();
    expect(text && text.length).toBeGreaterThan(20);
  });

  test("T7-04: Card renders meta with slug and tags", async ({ page }) => {
    await load(page);
    const meta = page.locator("#blMeta");
    const text = await meta.textContent();
    expect(text).toContain("#");
  });

  test("T7-05: Dismiss button hides the card", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).dismissBoundaryLeak());
    const card = page.locator("#boundaryLeakCard");
    await expect(card).toHaveClass(/hidden/);
  });

  test("T7-06: getTodayLeak() returns a story object", async ({ page }) => {
    await load(page);
    const story = await page.evaluate(() => (window as any).getTodayLeak());
    expect(story.slug).toBeTruthy();
    expect(story.title).toBeTruthy();
    expect(story.body).toBeTruthy();
    expect(story.tags.length).toBeGreaterThan(0);
  });

  test("T7-07: getTodayLeak returns a valid story from the pool", async ({
    page,
  }) => {
    await load(page);
    // BOUNDARY_LEAK_STORIES is const (not on window), test via function
    const story = await page.evaluate(() => (window as any).getTodayLeak());
    expect(story).toBeTruthy();
    expect(story.slug).toBeTruthy();
    expect(story.tags.length).toBeGreaterThan(0);
  });

  test("T7-08: getDailyLeakIndex returns stable value for same day", async ({
    page,
  }) => {
    await load(page);
    const result = await page.evaluate(() => {
      const a = (window as any).getDailyLeakIndex();
      const b = (window as any).getDailyLeakIndex();
      return { a, b };
    });
    expect(result.a).toBe(result.b);
  });

  test("T7-09: getDailyLeakIndex returns value between 0 and 29", async ({
    page,
  }) => {
    await load(page);
    const idx = await page.evaluate(() => (window as any).getDailyLeakIndex());
    expect(idx).toBeGreaterThanOrEqual(0);
    expect(idx).toBeLessThan(30);
  });

  test("T7-10: Dismiss card sets localStorage for today", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).dismissBoundaryLeak());
    const val = await page.evaluate(() => localStorage.getItem("bl_dismissed"));
    const today = new Date().toISOString().slice(0, 10);
    expect(val).toBe(today);
  });
});
