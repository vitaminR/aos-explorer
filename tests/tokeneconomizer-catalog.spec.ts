/**
 * Catalog entry: TokenEconomizer (Microsoft Research cost-control plugin for coding agents).
 *
 * US-1  The right rail shows a TokenEconomizer card in the Tools group with seven strata
 *        dots, four of them active (S6 primary, S4, S3, S2), and a spans label that says so.
 * US-2  Selecting the card renders the "Why it lives here" strata stack with S6
 *        Governance & Trust as the primary row and three secondary rows.
 * US-3  The in-page data objects agree with the card: PRODUCT_DETAILS carries the entry,
 *        PRODUCT_STRATA_MAP lists ["l6", "l4", "l3", "l2"], and the rationale carries no
 *        em dash or en dash (house style).
 */

import { test, expect } from "@playwright/test";
import path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../explorer.html")
  .replace(/\\/g, "/")}`;

const KEY = "tokeneconomizer";

async function loadAndDismissTour(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem("aosTourDone", "1");
    localStorage.setItem("aosVisitCount", "4");
  });
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
}

test.describe("TokenEconomizer catalog entry", () => {
  test("US-1 right-rail card exists with 7 dots, 4 active, and a matching spans label", async ({
    page,
  }) => {
    await loadAndDismissTour(page);
    const card = page.locator(`.product-card[data-product-id="${KEY}"]`);
    await expect(card).toHaveCount(1);
    await expect(card).toHaveAttribute("data-type", "tool");
    await expect(card.locator(".name")).toHaveText("TokenEconomizer");
    await expect(card.locator(".strata-dot")).toHaveCount(7);
    await expect(card.locator(".strata-dot.active")).toHaveCount(4);
    await expect(card.locator(".spans-label")).toContainText("Spans 4 strata");
    await expect(card.locator(".spans-label")).toContainText("Primary: S6");
    await expect(card.locator(".confidence")).toHaveText("0.82");
    await expect(card.locator(".confidence")).toHaveClass(/medium/);
  });

  test("US-2 selecting the card shows S6 Governance & Trust as the primary stratum", async ({
    page,
  }) => {
    await loadAndDismissTour(page);
    const card = page.locator(`.product-card[data-product-id="${KEY}"]`);
    await card.scrollIntoViewIfNeeded();
    await card.click();
    await expect(page.locator("#heroContextDetail")).toContainText(/\w+/, {
      timeout: 5000,
    });
    const primaryRow = page.locator("#heroContextDetail .hero-strata-stack-row.primary");
    await expect(primaryRow).toHaveCount(1);
    await expect(primaryRow.locator(".hero-strata-label")).toContainText("S6");
    await expect(primaryRow.locator(".hero-strata-label")).toContainText("Governance");
    const rows = page.locator("#heroContextDetail .hero-strata-stack-row");
    await expect(rows).toHaveCount(4);
  });

  test("US-3 PRODUCT_DETAILS and PRODUCT_STRATA_MAP agree with the card and keep house style", async ({
    page,
  }) => {
    await loadAndDismissTour(page);
    const data = await page.evaluate((key) => {
      // Top-level consts in the page script are reachable from the global lexical scope.
      // @ts-ignore
      const d = PRODUCT_DETAILS[key];
      // @ts-ignore
      const s = PRODUCT_STRATA_MAP[key];
      return d ? { ...d, strata: s } : null;
    }, KEY);
    expect(data).not.toBeNull();
    expect(data!.name).toBe("TokenEconomizer");
    expect(data!.type).toBe("tool");
    expect(data!.primary).toBe("S6 Governance & Trust");
    expect(data!.secondary).toBe("S4, S3, S2");
    expect(data!.strata).toEqual(["l6", "l4", "l3", "l2"]);
    expect(data!.lastVerified).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // House style: no em dash or en dash anywhere in the product copy.
    expect(data!.rationale).not.toMatch(/[–—]/);
  });
});
