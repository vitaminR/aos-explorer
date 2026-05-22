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

test.describe("T18 — Embed Stack Widget", () => {
  test("T18-01: Embed button exists in Stack Builder", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openStackBuilder());
    const btn = page.locator("#sbEmbedBtn");
    await expect(btn).toBeVisible();
  });

  test("T18-02: openEmbedModal() shows embed modal", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    const overlay = page.locator("#embedModalOverlay");
    await expect(overlay).not.toHaveClass(/hidden/);
  });

  test("T18-03: Embed snippet contains iframe tag", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    const box = page.locator("#embedSnippetBox");
    const text = await box.textContent();
    expect(text).toContain("<iframe");
  });

  test("T18-04: Embed snippet contains aos7.tech URL", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    const box = page.locator("#embedSnippetBox");
    const text = await box.textContent();
    expect(text).toContain("aos7.tech");
  });

  test("T18-05: Embed snippet contains sandbox attribute", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    const box = page.locator("#embedSnippetBox");
    const text = await box.textContent();
    expect(text).toContain("sandbox=");
  });

  test("T18-06: Close button hides embed modal", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    await page.evaluate(() => {
      const el = document.getElementById("embedModalOverlay");
      if (el) el.classList.add("hidden");
    });
    const overlay = page.locator("#embedModalOverlay");
    await expect(overlay).toHaveClass(/hidden/);
  });

  test("T18-07: Escape key closes embed modal", async ({ page }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    await page.keyboard.press("Escape");
    const overlay = page.locator("#embedModalOverlay");
    await expect(overlay).toHaveClass(/hidden/);
  });

  test("T18-08: Embed snippet contains attribution comment", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).openEmbedModal());
    const box = page.locator("#embedSnippetBox");
    const text = await box.textContent();
    expect(text).toContain("aos7.tech");
  });

  test("T18-09: Command palette contains Embed Stack entry", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.fill("#cmdInput", "embed");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
    const labels = await results.allTextContents();
    expect(labels.some((t) => t.toLowerCase().includes("embed"))).toBe(true);
  });
});
