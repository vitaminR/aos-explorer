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

test.describe("T13 — Agent-readable cards (llms.txt / card.json)", () => {
  test.beforeEach(async ({ page }) => {
    await load(page);
  });

  test("T13-01  generateLlmsTxt returns text starting with header", async ({
    page,
  }) => {
    const txt = await page.evaluate(() => (window as any).generateLlmsTxt());
    expect(txt).toContain("# {a}OS Explorer");
    expect(txt).toContain("llms.txt");
  });

  test("T13-02  llms.txt lists strata URLs", async ({ page }) => {
    const txt = await page.evaluate(() => (window as any).generateLlmsTxt());
    expect(txt).toContain("https://aos7.tech/stratum/l1");
    expect(txt).toContain("https://aos7.tech/stratum/l7");
  });

  test("T13-03  llms.txt lists product URLs", async ({ page }) => {
    const txt = await page.evaluate(() => (window as any).generateLlmsTxt());
    expect(txt).toContain("https://aos7.tech/product/");
    expect(txt).toContain("/card.json");
  });

  test("T13-04  llms.txt lists API endpoints", async ({ page }) => {
    const txt = await page.evaluate(() => (window as any).generateLlmsTxt());
    expect(txt).toContain("/api/v1/strata");
    expect(txt).toContain("/api/v1/products");
    expect(txt).toContain("/api/v1/taxonomy/version");
  });

  test("T13-05  generateProductCard returns valid card object", async ({
    page,
  }) => {
    // Use a known product ID from the DOM (first product card's onclick)
    const card = await page.evaluate(() => {
      const firstCard = document.querySelector(".product-card[onclick]");
      if (!firstCard) return null;
      const onclick = firstCard.getAttribute("onclick") || "";
      const m = onclick.match(/selectProduct\('(\w+)'\)/);
      if (!m) return null;
      return (window as any).generateProductCard(m[1]);
    });
    expect(card).not.toBeNull();
    expect(card).toHaveProperty("$schema");
    expect(card).toHaveProperty("id");
    expect(card).toHaveProperty("name");
    expect(card).toHaveProperty("vendor");
    expect(card).toHaveProperty("strata");
    expect(card).toHaveProperty("taxonomyVersion");
    expect(card.taxonomyVersion).toBe("v1.1.0");
  });

  test("T13-06  card schema is aos7-card-v1", async ({ page }) => {
    const card = await page.evaluate(() => {
      const firstCard = document.querySelector(".product-card[onclick]");
      if (!firstCard) return null;
      const onclick = firstCard.getAttribute("onclick") || "";
      const m = onclick.match(/selectProduct\('(\w+)'\)/);
      if (!m) return null;
      return (window as any).generateProductCard(m[1]);
    });
    expect(card.$schema).toBe("https://aos7.tech/schema/aos7-card-v1.json");
  });

  test("T13-07  card strata has primary (string) and secondary (array)", async ({
    page,
  }) => {
    const card = await page.evaluate(() => {
      const firstCard = document.querySelector(".product-card[onclick]");
      if (!firstCard) return null;
      const onclick = firstCard.getAttribute("onclick") || "";
      const m = onclick.match(/selectProduct\('(\w+)'\)/);
      if (!m) return null;
      return (window as any).generateProductCard(m[1]);
    });
    expect(card.strata).toHaveProperty("primary");
    expect(card.strata).toHaveProperty("secondary");
    expect(Array.isArray(card.strata.secondary)).toBe(true);
  });

  test("T13-08  generateProductCard returns null for unknown product", async ({
    page,
  }) => {
    const card = await page.evaluate(() =>
      (window as any).generateProductCard("nonexistent_xyz"),
    );
    expect(card).toBeNull();
  });
});

test.describe("T11 — Static Taxonomy API JSON export", () => {
  test.beforeEach(async ({ page }) => {
    await load(page);
  });

  test("T11-01  strata JSON has version and 7 strata", async ({ page }) => {
    const data = await page.evaluate(() =>
      (window as any).generateTaxonomyStrataJSON(),
    );
    expect(data.version).toBe("v1.1.0");
    expect(data.strata).toHaveLength(7);
  });

  test("T11-02  each stratum has id, label, and color", async ({ page }) => {
    const data = await page.evaluate(() =>
      (window as any).generateTaxonomyStrataJSON(),
    );
    for (const s of data.strata) {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("label");
      expect(s).toHaveProperty("color");
      expect(s.id).toMatch(/^l[1-7]$/);
    }
  });

  test("T11-03  products JSON has version and a products array", async ({
    page,
  }) => {
    const data = await page.evaluate(() =>
      (window as any).generateTaxonomyProductsJSON(),
    );
    expect(data.version).toBe("v1.1.0");
    expect(Array.isArray(data.products)).toBe(true);
    expect(data.products.length).toBeGreaterThan(0);
  });

  test("T11-04  each product in products JSON has required fields", async ({
    page,
  }) => {
    const data = await page.evaluate(() =>
      (window as any).generateTaxonomyProductsJSON(),
    );
    const first = data.products[0];
    expect(first).toHaveProperty("id");
    expect(first).toHaveProperty("name");
    expect(first).toHaveProperty("vendor");
    expect(first).toHaveProperty("strata");
    expect(first).toHaveProperty("taxonomyVersion");
  });

  test("T11-05  version JSON returns current version", async ({ page }) => {
    const data = await page.evaluate(() =>
      (window as any).generateTaxonomyVersionJSON(),
    );
    expect(data.version).toBe("v1.1.0");
    expect(data).toHaveProperty("date");
  });

  test("T11-06  command palette includes Export Taxonomy entries", async ({
    page,
  }) => {
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.waitForSelector("#cmdPaletteOverlay:not(.hidden)", {
      timeout: 3000,
    });
    // Type "taxonomy" in the search
    await page.fill("#cmdInput", "taxonomy");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    expect(await results.count()).toBeGreaterThanOrEqual(1);
  });

  test("T11-07  command palette includes llms.txt entry", async ({ page }) => {
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.waitForSelector("#cmdPaletteOverlay:not(.hidden)", {
      timeout: 3000,
    });
    await page.fill("#cmdInput", "llms");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    expect(await results.count()).toBeGreaterThanOrEqual(1);
  });
});
