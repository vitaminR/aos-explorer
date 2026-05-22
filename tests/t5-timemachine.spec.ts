import { test, expect } from "@playwright/test";
import * as path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../explorer.html")
  .replace(/\\/g, "/")}`;

async function load(page: any) {
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
  const coachmark = page.locator("#coachmark");
  if (await coachmark.isVisible()) {
    await page.evaluate(() => (window as any).dismissCoach?.());
    await page.waitForTimeout(300);
  }
}

test.describe("T5 — Time Machine", () => {
  test("T5-01: History nav button exists in header", async ({ page }) => {
    await load(page);
    const btn = page.locator("#timeMachineNavBtn");
    await expect(btn).toBeVisible();
    await expect(btn).toContainText("History");
  });

  test("T5-02: openTimeMachine() reveals the slider bar", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const bar = page.locator("#timeMachineBar");
    await expect(bar).not.toHaveClass(/hidden/);
  });

  test("T5-03: closeTimeMachine() hides the bar", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    await page.evaluate(() => (window as any).closeTimeMachine());
    const bar = page.locator("#timeMachineBar");
    await expect(bar).toHaveClass(/hidden/);
  });

  test("T5-04: Slider defaults to value 4 (Live)", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const val = await page.locator("#tmSlider").inputValue();
    expect(val).toBe("4");
  });

  test("T5-05: Label shows 'Live' at slider position 4", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const label = page.locator("#tmSnapshotLabel");
    await expect(label).toContainText("Live");
  });

  test("T5-06: Live badge visible at slider position 4", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const badge = page.locator("#tmLiveBadge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("LIVE");
  });

  test("T5-07: Moving slider to 0 shows Jan 2024 label", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    await page.evaluate(() => (window as any).onTimeMachineChange(0));
    const label = page.locator("#tmSnapshotLabel");
    await expect(label).toContainText("Jan 2024");
  });

  test("T5-08: Snapshot 0 hides some product cards", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const allBefore = await page.evaluate(
      () => document.querySelectorAll(".product-card").length,
    );
    await page.evaluate(() => (window as any).onTimeMachineChange(0));
    const visible = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".product-card")).filter(
          (c: any) => c.style.display !== "none",
        ).length,
    );
    expect(visible).toBeLessThan(allBefore);
    expect(visible).toBeGreaterThan(0);
  });

  test("T5-09: Returning to Live (4) restores all cards", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    const allBefore = await page.evaluate(
      () => document.querySelectorAll(".product-card").length,
    );
    await page.evaluate(() => (window as any).onTimeMachineChange(0));
    await page.evaluate(() => (window as any).onTimeMachineChange(4));
    const visibleAfter = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".product-card")).filter(
          (c: any) => c.style.display !== "none",
        ).length,
    );
    expect(visibleAfter).toBe(allBefore);
  });

  test("T5-10: getTimeMachineSnapshot returns object with id", async ({
    page,
  }) => {
    await load(page);
    // TM_SNAPSHOTS is const (not on window), so test via exposed function
    const snap = await page.evaluate(() =>
      (window as any).getTimeMachineSnapshot(),
    );
    expect(snap).toBeTruthy();
    expect(snap.id).toBeTruthy();
  });

  test("T5-11: getTimeMachineSnapshot() returns current snapshot", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    await page.evaluate(() => (window as any).onTimeMachineChange(2));
    const snap = await page.evaluate(() =>
      (window as any).getTimeMachineSnapshot(),
    );
    expect(snap.id).toBe("2025-Q1");
  });

  test("T5-12: Command palette contains Time Machine entry", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.fill("#cmdInput", "time machine");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });

  test("T5-13: Escape closes time machine bar", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    await page.keyboard.press("Escape");
    const bar = page.locator("#timeMachineBar");
    await expect(bar).toHaveClass(/hidden/);
  });

  test("T5-14: Snapshot 1 (Jul 2024) has more products than snapshot 0", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).openTimeMachine());
    await page.evaluate(() => (window as any).onTimeMachineChange(0));
    const count0 = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".product-card")).filter(
          (c: any) => c.style.display !== "none",
        ).length,
    );
    await page.evaluate(() => (window as any).onTimeMachineChange(1));
    const count1 = await page.evaluate(
      () =>
        Array.from(document.querySelectorAll(".product-card")).filter(
          (c: any) => c.style.display !== "none",
        ).length,
    );
    expect(count1).toBeGreaterThan(count0);
  });
});
