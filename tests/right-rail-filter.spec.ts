import { test, expect } from "@playwright/test";
import path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../explorer.html")
  .replace(/\\/g, "/")}`;

async function load(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem("aos-toured", "1");
    localStorage.setItem("aosTourDone", "1");
    localStorage.setItem("aosVisitCount", "5");
    localStorage.setItem("aosVisits", "5");
  });

  await page.goto(FILE_URL, { waitUntil: "networkidle" });
}

test.describe("Right rail stratum filtering", () => {
  test("clicking a stratum filters the featured products rail", async ({
    page,
  }) => {
    await load(page);

    await page.locator("#l7").click();

    await expect(page.locator("#rightRailHeader")).toContainText(
      /L7 Experience/i,
    );

    const counts = await page.evaluate(() => ({
      visible: document.querySelectorAll(
        ".right-rail .product-card:not(.stratum-filtered-out)",
      ).length,
      hidden: document.querySelectorAll(
        ".right-rail .product-card.stratum-filtered-out",
      ).length,
    }));

    expect(counts.visible).toBeGreaterThan(0);
    expect(counts.hidden).toBeGreaterThan(0);
  });

  test("collapseAll clears the right-rail stratum filter state", async ({
    page,
  }) => {
    await load(page);

    await page.locator("#l7").click();
    await expect(page.locator("#rightRailHeader")).toContainText(
      /L7 Experience/i,
    );

    await page.evaluate(() => (window as any).collapseAll());

    await expect(page.locator("#rightRailHeader")).toHaveText(
      /Featured Products/i,
    );

    const hidden = await page.evaluate(
      () =>
        document.querySelectorAll(
          ".right-rail .product-card.stratum-filtered-out",
        ).length,
    );
    expect(hidden).toBe(0);
  });

  test("shows an empty state when the active stratum has no featured matches", async ({
    page,
  }) => {
    await load(page);

    await page.evaluate(() => {
      document.querySelectorAll(".right-rail .product-card").forEach((card) => {
        card.querySelectorAll(".strata-dots .strata-dot").forEach((dot) => {
          const bg =
            (dot.getAttribute("style") || "") +
            (dot as HTMLElement).style.cssText;
          if (bg.includes("--l7") || bg.includes("var(--l7)")) {
            dot.classList.remove("active");
          }
        });
      });

      (window as any).filterRailByStratum("l7");
    });

    const emptyState = page.locator("#rightRailEmptyState");
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toContainText(/L7 Experience/i);
    await expect(emptyState).toContainText(/Show all featured products/i);

    const visible = await page.evaluate(
      () =>
        document.querySelectorAll(
          ".right-rail .product-card:not(.stratum-filtered-out)",
        ).length,
    );
    expect(visible).toBe(0);
  });
});
