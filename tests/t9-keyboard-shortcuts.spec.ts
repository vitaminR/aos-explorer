/**
 * T9: Keyboard Shortcuts + Command Palette — E2E Tests
 *
 * US-T9-1  Pressing "?" shows the shortcut reference modal
 * US-T9-2  Pressing Escape closes the shortcut modal
 * US-T9-3  Pressing Ctrl+K (or Meta+K) opens the command palette
 * US-T9-4  Palette input filters results
 * US-T9-5  Arrow keys navigate cmd-result items
 * US-T9-6  Pressing Escape closes the command palette
 * US-T9-7  Pressing "1"–"7" triggers scrollToStratum (no typing context)
 * US-T9-8  "/" focuses the search input
 * US-T9-9  "G then S" opens the Stack Builder
 * US-T9-10 "G then I" opens the Insights panel
 */

import { test, expect } from "@playwright/test";
import path from "path";

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
  // Make sure no input is focused so keyboard shortcuts fire
  await page.locator("body").click();
  await page.waitForTimeout(200);
}

// ── tests ───────────────────────────────────────────────────────────────────

test("T9-1: ? opens shortcut modal", async ({ page }) => {
  await load(page);
  await page.keyboard.press("?");
  const modal = page.locator("#shortcutModalOverlay");
  await expect(modal).toBeVisible({ timeout: 3_000 });
  await expect(modal).toContainText(/Keyboard Shortcuts/i);
});

test("T9-2: Escape closes shortcut modal", async ({ page }) => {
  await load(page);
  await page.keyboard.press("?");
  await expect(page.locator("#shortcutModalOverlay")).toBeVisible({
    timeout: 3_000,
  });
  await page.keyboard.press("Escape");
  await expect(page.locator("#shortcutModalOverlay")).toBeHidden({
    timeout: 2_000,
  });
});

test("T9-3: Ctrl+K opens command palette", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  const palette = page.locator("#cmdPaletteOverlay");
  await expect(palette).toBeVisible({ timeout: 3_000 });
  await expect(page.locator(".cmd-input")).toBeFocused({ timeout: 2_000 });
});

test("T9-4: Command palette shows results", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#cmdPaletteOverlay")).toBeVisible({
    timeout: 3_000,
  });
  const results = page.locator(".cmd-result-item");
  await expect(results.first()).toBeVisible({ timeout: 3_000 });
  expect(await results.count()).toBeGreaterThan(0);
});

test("T9-5: Typing in palette filters results", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#cmdPaletteOverlay")).toBeVisible({
    timeout: 3_000,
  });
  await page.locator(".cmd-input").fill("stack");
  await page.waitForTimeout(200);
  const results = page.locator(".cmd-result-item");
  const count = await results.count();
  expect(count).toBeGreaterThan(0);
  // Should contain Build Stack action
  const texts = await results.allTextContents();
  expect(texts.join(" ")).toMatch(/Stack/i);
});

test("T9-6: Arrow keys navigate palette items", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#cmdPaletteOverlay")).toBeVisible({
    timeout: 3_000,
  });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(100);
  // At least one item should have .active class
  const active = page.locator(".cmd-result-item.active");
  const count = await active.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test("T9-7: Escape closes command palette", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#cmdPaletteOverlay")).toBeVisible({
    timeout: 3_000,
  });
  await page.keyboard.press("Escape");
  await expect(page.locator("#cmdPaletteOverlay")).toBeHidden({
    timeout: 2_000,
  });
});

test("T9-8: G then S opens Stack Builder", async ({ page }) => {
  await load(page);
  await page.keyboard.press("g");
  await page.keyboard.press("s");
  await expect(page.locator("#stackBuilderOverlay")).toBeVisible({
    timeout: 3_000,
  });
});

test("T9-9: G then I opens Insights", async ({ page }) => {
  await load(page);
  await page.keyboard.press("g");
  await page.keyboard.press("i");
  await expect(page.locator("#insightsOverlay")).toBeVisible({
    timeout: 3_000,
  });
});

test("T9-10: / focuses search input", async ({ page }) => {
  await load(page);
  await page.keyboard.press("/");
  await page.waitForTimeout(200);
  // Check that the currently focused element is an input
  const tag = await page.evaluate(() =>
    document.activeElement?.tagName?.toLowerCase(),
  );
  expect(tag).toBe("input");
});

test("T9-11: Shortcut modal lists ? and Cmd+K shortcuts", async ({ page }) => {
  await load(page);
  await page.keyboard.press("?");
  await expect(page.locator("#shortcutModalOverlay")).toBeVisible({
    timeout: 3_000,
  });
  const modal = page.locator(".shortcut-modal");
  await expect(modal).toContainText(/command palette/i);
  await expect(modal).toContainText(/Esc/i);
  await expect(modal).toContainText(/stack builder/i, { ignoreCase: true });
});

test("T9-12: Clicking backdrop closes command palette", async ({ page }) => {
  await load(page);
  await page.keyboard.press("Control+k");
  await expect(page.locator("#cmdPaletteOverlay")).toBeVisible({
    timeout: 3_000,
  });
  // Click the overlay backdrop (outside the palette box)
  await page
    .locator("#cmdPaletteOverlay")
    .click({ position: { x: 10, y: 10 } });
  await expect(page.locator("#cmdPaletteOverlay")).toBeHidden({
    timeout: 2_000,
  });
});
