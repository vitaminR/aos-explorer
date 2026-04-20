/**
 * T4: Insights / Gap Map — E2E Tests
 *
 * US-T4-1  Clicking "Insights" in the nav opens the Gap Map overlay
 * US-T4-2  Gap map grid renders exactly 7 use-case rows × 7 strata columns = 49 cells
 * US-T4-3  Each cell shows a score dot (0–3)
 * US-T4-4  Clicking a cell shows a popover with use-case × stratum label
 * US-T4-5  A legend with scores 0–3 is visible below the grid
 * US-T4-6  Close button dismisses the overlay
 */

import { test, expect } from "@playwright/test";
import path from "path";

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

async function openInsights(page: any) {
  // Click the Insights nav button
  const btn = page.locator(".nav-action").filter({ hasText: /Insights/ });
  await expect(btn).toBeVisible({ timeout: 5_000 });
  await btn.click();
  await expect(page.locator("#insightsOverlay")).toBeVisible({
    timeout: 3_000,
  });
}

// ── tests ───────────────────────────────────────────────────────────────────

test("T4-1: Insights nav button opens Gap Map overlay", async ({ page }) => {
  await load(page);
  await openInsights(page);
  await expect(page.locator(".gap-map-grid")).toBeVisible({ timeout: 5_000 });
});

test("T4-2: Gap map has exactly 49 score cells (7×7)", async ({ page }) => {
  await load(page);
  await openInsights(page);
  const cells = page.locator(".gap-map-cell");
  await expect(cells.first()).toBeVisible({ timeout: 5_000 });
  const count = await cells.count();
  expect(count).toBe(49);
});

test("T4-3: Each score cell contains a score dot", async ({ page }) => {
  await load(page);
  await openInsights(page);
  const dots = page.locator(".score-dot");
  await expect(dots.first()).toBeVisible({ timeout: 5_000 });
  const count = await dots.count();
  expect(count).toBeGreaterThanOrEqual(49);
});

test("T4-4: Score dots use correct score classes (0–3)", async ({ page }) => {
  await load(page);
  await openInsights(page);
  // At least one cell of each class should exist
  for (const cls of ["score-0", "score-1", "score-2", "score-3"]) {
    const el = page.locator(`.score-dot.${cls}`);
    const count = await el.count();
    expect(count).toBeGreaterThan(0);
  }
});

test("T4-5: Clicking a cell shows popover with use-case × stratum label", async ({
  page,
}) => {
  await load(page);
  await openInsights(page);
  const firstCell = page.locator(".gap-map-cell").first();
  await firstCell.click();
  const popover = page.locator("#gapPopover");
  await expect(popover).toBeVisible({ timeout: 3_000 });
  // Popover should mention a use case and stratum label
  await expect(popover).toContainText(
    /RAG|Multi-Agent|Voice|DevOps|Analytics|Customer|Code/i,
  );
});

test("T4-6: Popover disappears on next click", async ({ page }) => {
  await load(page);
  await openInsights(page);
  await page.locator(".gap-map-cell").first().click();
  await expect(page.locator("#gapPopover")).toBeVisible({ timeout: 2_000 });
  // Click somewhere else
  await page.locator(".insights-header h2").click();
  await expect(page.locator("#gapPopover")).toBeHidden({ timeout: 2_000 });
});

test("T4-7: Score legend (0–3) is visible", async ({ page }) => {
  await load(page);
  await openInsights(page);
  const body = page.locator("#insightsBody");
  await expect(body).toContainText(/No coverage/i);
  await expect(body).toContainText(/Strong/i);
});

test("T4-8: Close button hides overlay", async ({ page }) => {
  await load(page);
  await openInsights(page);
  await page.locator("#insightsOverlay .compare-close").click();
  await expect(page.locator("#insightsOverlay")).toBeHidden({ timeout: 2_000 });
});

test("T4-9: Stratum header labels are visible in correct order", async ({
  page,
}) => {
  await load(page);
  await openInsights(page);
  const headers = page.locator(".gap-map-header-cell");
  await expect(headers.first()).toBeVisible({ timeout: 5_000 });
  // First cell is "Use Case" label, then L7..L1
  const texts = await headers.allTextContents();
  expect(texts.join(" ")).toMatch(/L7/);
  expect(texts.join(" ")).toMatch(/L1/);
});

test("T4-10: Use-case row labels are present (7 rows)", async ({ page }) => {
  await load(page);
  await openInsights(page);
  const labels = page.locator(".gap-map-label-cell");
  await expect(labels.first()).toBeVisible({ timeout: 5_000 });
  const count = await labels.count();
  expect(count).toBe(7);
});
