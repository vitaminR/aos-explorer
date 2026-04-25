import { test, expect } from "@playwright/test";
import path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../prototype.html")
  .replace(/\\/g, "/")}`;
const MOBILE_USE = {
  browserName: "chromium" as const,
  viewport: { width: 390, height: 844 },
  screen: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
  ...(process.platform === "win32" ? { channel: "msedge" } : {}),
};

test.use(MOBILE_USE);

async function loadMobile(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem("aos-toured", "1");
    localStorage.setItem("aosTourDone", "1");
    localStorage.setItem("aosVisitCount", "5");
    localStorage.setItem("aosVisits", "5");
  });
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
}

test.describe("Mobile layout", () => {
  test("stacks the mobile header into usable rows without horizontal overflow", async ({
    page,
  }) => {
    await loadMobile(page);

    const metrics = await page.evaluate(() => {
      const header = document.querySelector(".header")?.getBoundingClientRect();
      const modePills = document
        .querySelector(".mode-pills")
        ?.getBoundingClientRect();

      return {
        viewportWidth: window.innerWidth,
        docScrollWidth: document.documentElement.scrollWidth,
        headerHeight: Math.round(header?.height || 0),
        modePillsTop: Math.round(modePills?.top || 0),
        modePillsBottom: Math.round(modePills?.bottom || 0),
        headerBottom: Math.round(header?.bottom || 0),
      };
    });

    expect(metrics.docScrollWidth).toBe(metrics.viewportWidth);
    expect(metrics.headerHeight).toBeGreaterThan(100);
    expect(metrics.modePillsTop).toBeGreaterThanOrEqual(0);
    expect(metrics.modePillsBottom).toBeLessThanOrEqual(
      metrics.headerBottom + 1,
    );
  });

  test("browse toggle reveals the hidden left-rail controls on mobile", async ({
    page,
  }) => {
    await loadMobile(page);

    const toggle = page.locator("#mobileControlsToggle");
    const leftRail = page.locator(".left-rail");

    await expect(toggle).toBeVisible();
    await expect(leftRail).toBeHidden();

    await toggle.click();

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toContainText("Close");
    await expect(leftRail).toBeVisible();
    await expect(page.locator("#filterRailSection")).toBeVisible();
  });

  test("filter hint opens mobile browse controls and scrolls the filter rail into view", async ({
    page,
  }) => {
    await loadMobile(page);

    await page.locator('.hint-chip[data-hint="filter"]').click();

    const toggle = page.locator("#mobileControlsToggle");
    const filterRail = page.locator("#filterRailSection");

    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(filterRail).toBeVisible();

    const filterBox = await filterRail.boundingBox();
    expect(filterBox).not.toBeNull();
    expect(filterBox!.y).toBeLessThan(420);
  });
});
