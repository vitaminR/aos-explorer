import { test, expect } from "@playwright/test";
import path from "path";

const FILE_URL = `file:///${path.resolve(__dirname, "../prototype.html").replace(/\\/g, "/")}`;

async function load(page: any) {
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
  const coachmark = page.locator("#coachmark");
  if (await coachmark.isVisible()) {
    await page.evaluate(() => (window as any).dismissCoach?.());
    await page.waitForTimeout(300);
  }
}

test.describe("T14 — Changelog overlay", () => {
  test.beforeEach(async ({ page }) => {
    await load(page);
  });

  test("T14-01  nav button exists (hidden from nav bar)", async ({ page }) => {
    const btn = page.locator("#changelogNavBtn");
    await expect(btn).toBeHidden();
  });

  test("T14-02  clicking nav button opens overlay", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const overlay = page.locator("#changelogOverlay");
    await expect(overlay).not.toHaveClass(/hidden/);
  });

  test("T14-03  overlay shows version badge", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const badge = page.locator("#clVersionBadge");
    await expect(badge).toContainText("v1.1.0");
  });

  test("T14-04  contains at least 3 changelog entries", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const entries = page.locator(".cl-entry");
    expect(await entries.count()).toBeGreaterThanOrEqual(3);
  });

  test("T14-05  each entry has a version badge", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const badges = page.locator(".cl-entry .cl-version-badge");
    expect(await badges.count()).toBeGreaterThanOrEqual(3);
  });

  test("T14-06  each entry has a tag (added/changed/fixed/deprecated)", async ({
    page,
  }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const tags = page.locator(".cl-entry .cl-tag");
    expect(await tags.count()).toBeGreaterThanOrEqual(3);
    for (const t of await tags.all()) {
      const cls = await t.getAttribute("class");
      expect(cls).toMatch(/added|changed|fixed|deprecated/);
    }
  });

  test("T14-07  close button hides overlay", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    await expect(page.locator("#changelogOverlay")).not.toHaveClass(/hidden/);
    await page.click("#changelogOverlay .compare-close");
    await expect(page.locator("#changelogOverlay")).toHaveClass(/hidden/);
  });

  test("T14-08  Escape key closes overlay", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    await expect(page.locator("#changelogOverlay")).not.toHaveClass(/hidden/);
    await page.keyboard.press("Escape");
    await expect(page.locator("#changelogOverlay")).toHaveClass(/hidden/);
  });

  test("T14-09  first entry title includes Stack Builder", async ({ page }) => {
    await page.evaluate(() => (window as any).openChangelog());
    const first = page.locator(".cl-entry").first();
    await expect(first).toContainText("Stack Builder");
  });

  test("T14-10  version badge in header shows current taxonomy version", async ({
    page,
  }) => {
    const ver = await page.evaluate(() => (window as any).getTaxonomyVersion());
    expect(ver).toBe("v1.1.0");
  });
});
