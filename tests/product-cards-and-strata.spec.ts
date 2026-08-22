/**
 * User Stories: Product Cards — Strata Stack & Copy Buttons
 *
 * US-1  When I select a product, the "Why it lives here" card shows a vertical
 *        strata stack with colored swatches, stratum labels, and primary/secondary
 *        role tags so I can understand which {a}OS strata the product touches.
 *
 * US-2  When I hover over a product card, a subtle copy button appears so I can
 *        share the card's details without disrupting the browsing flow.
 *
 * US-3  When a product is selected the middle detail panel's cards each have a
 *        copy button so I can share any individual section of the detail view.
 *
 * US-4  When a product is selected the quick-reference facts stay on one visual
 *        row so the panel stays compact and scannable.
 */

import { test, expect } from "@playwright/test";
import path from "path";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../explorer.html")
  .replace(/\\/g, "/")}`;

// ── helpers ────────────────────────────────────────────────────────────────

async function loadAndDismissTour(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem("aosTourDone", "1");
    localStorage.setItem("aosVisitCount", "4");
  });
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
}

/** Stub navigator.clipboard so file:// copy tests work without permission errors. */
async function stubClipboard(page: any) {
  await page.evaluate(() => {
    (window as any).__clipboardStub = "";
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async (text: string) => {
          (window as any).__clipboardStub = text;
        },
      },
      writable: true,
      configurable: true,
    });
  });
}

/** Click a product card and wait for the heroContextDetail panel to render. */
async function selectProduct(page: any, productId: string) {
  const card = page.locator(`.product-card[data-product-id="${productId}"]`);
  await expect(card).toBeVisible({ timeout: 10_000 });
  await card.click();
  // Wait for the detail panel to contain the product title
  await expect(page.locator("#heroContextDetail")).toContainText(/\w+/, {
    timeout: 5_000,
  });
  await page.waitForTimeout(300); // copy-button attachment is synchronous but give DOM a tick
}

// ── US-1: Strata stack in "Why it lives here" card ─────────────────────────

test.describe("US-1 — Strata stack in selection detail panel", () => {
  test("selecting CrewAI renders a strata stack with at least one row", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const stack = page.locator("#heroContextDetail .hero-strata-stack");
    await expect(stack).toBeVisible({ timeout: 5_000 });

    const rows = stack.locator(".hero-strata-stack-row");
    await expect(rows).toHaveCount(2); // primary S4 + secondary S3
  });

  test("primary strata row has the .primary class and 'Primary' role label", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const primaryRow = page.locator(
      "#heroContextDetail .hero-strata-stack-row.primary",
    );
    await expect(primaryRow).toBeVisible();
    await expect(primaryRow.locator(".hero-strata-role.primary")).toContainText(
      "Primary",
    );
  });

  test("secondary strata row does NOT have .primary class and shows 'Secondary'", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const rows = page.locator("#heroContextDetail .hero-strata-stack-row");
    const nonPrimaryRows = rows.filter({ hasNot: page.locator(".primary") });
    await expect(nonPrimaryRows.first()).toBeVisible();
    await expect(
      nonPrimaryRows.first().locator(".hero-strata-role"),
    ).toContainText("Secondary");
  });

  test("each strata row has a color swatch element", async ({ page }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const rows = page.locator("#heroContextDetail .hero-strata-stack-row");
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(rows.nth(i).locator(".hero-strata-swatch")).toBeVisible();
    }
  });

  test("strata row labels include the stratum number and name", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const primaryRow = page.locator(
      "#heroContextDetail .hero-strata-stack-row.primary",
    );
    await expect(primaryRow.locator(".hero-strata-label")).toContainText("S4");
    await expect(primaryRow.locator(".hero-strata-label")).toContainText(
      "Orchestration",
    );
  });

  test("selecting a different product (Paperclip, S7 primary) shows S7 as primary strata", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "paperclip");

    const primaryRow = page.locator(
      "#heroContextDetail .hero-strata-stack-row.primary",
    );
    await expect(primaryRow.locator(".hero-strata-label")).toContainText("S7");
    await expect(primaryRow.locator(".hero-strata-label")).toContainText(
      "Experience",
    );
  });

  test("product with no strata data shows fallback message", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    // Inject a product with empty primary/secondary into PRODUCT_DETAILS in-page
    await page.evaluate(() => {
      (window as any).PRODUCT_DETAILS = (window as any).PRODUCT_DETAILS ?? {};
      (window as any).PRODUCT_DETAILS["__test_empty__"] = {
        name: "Test Empty",
        type: "tool",
        vendor: "Test",
        deployment: "Cloud",
        license: "MIT",
        primary: "",
        secondary: "",
        axisRoles: "",
        confidence: 0.5,
        rationale: "test",
      };
    });
    // Directly call showProductAbout with the injected entry
    await page.evaluate(() => {
      const d = (window as any).PRODUCT_DETAILS["__test_empty__"];
      (window as any).showProductAbout?.("__test_empty__", d);
    });
    await page.waitForTimeout(300);

    const heroDetail = page.locator("#heroContextDetail");
    await expect(heroDetail).toContainText(/No strata mapping available/i);
  });
});

// ── US-2: Copy buttons on product cards ────────────────────────────────────

test.describe("US-2 — Copy buttons on product cards", () => {
  test("every visible product card has exactly one copy button", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);

    const cards = page.locator(".product-card");
    const count = await cards.count();
    expect(count, "Expected at least one product card").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const btns = cards.nth(i).locator(".card-copy-btn");
      await expect(btns).toHaveCount(1);
    }
  });

  test("product card copy button has correct aria-label and title", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);

    const btn = page.locator(".product-card .card-copy-btn").first();
    await expect(btn).toHaveAttribute("aria-label", "Copy card details");
    await expect(btn).toHaveAttribute("title", "Copy card details");
  });

  test("product card copy button is initially invisible (opacity 0)", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);

    const btn = page.locator(".product-card .card-copy-btn").first();
    // CSS sets opacity: 0 on .product-card .card-copy-btn by default
    const opacity = await btn.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    expect(opacity).toBe(0);
  });

  test("product card copy button becomes visible on hover", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);

    const card = page.locator(".product-card").first();
    await card.hover();
    await page.waitForTimeout(250); // CSS transition

    const btn = card.locator(".card-copy-btn");
    const opacity = await btn.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity),
    );
    expect(opacity).toBeGreaterThan(0);
  });

  test("clicking copy button adds .copied class and removes it after ~1s", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);

    const card = page.locator(".product-card").first();
    await card.hover();
    await page.waitForTimeout(200);

    const btn = card.locator(".card-copy-btn");
    await btn.click({ force: true });

    // .copied class should appear quickly
    await expect(btn).toHaveClass(/copied/, { timeout: 2_000 });
    // and disappear within ~1.5 s
    await expect(btn).not.toHaveClass(/copied/, { timeout: 2_500 });
  });

  test("clicking copy button does NOT navigate away from the page", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);

    const urlBefore = page.url();
    const card = page.locator(".product-card").first();
    await card.hover();
    await page.waitForTimeout(200);

    const btn = card.locator(".card-copy-btn");
    await btn.click({ force: true });
    await page.waitForTimeout(300);

    expect(page.url()).toBe(urlBefore);
  });

  test("copy button click does NOT trigger product selection (no heroContextDetail change)", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);

    // Grab heroContextDetail content before clicking copy
    const heroBefore = await page
      .locator("#heroContextDetail")
      .innerHTML({ timeout: 2_000 })
      .catch(() => "");

    const card = page.locator(".product-card").first();
    await card.hover();
    await page.waitForTimeout(200);

    const btn = card.locator(".card-copy-btn");
    await btn.click({ force: true });
    await page.waitForTimeout(300);

    const heroAfter = await page
      .locator("#heroContextDetail")
      .innerHTML({ timeout: 2_000 })
      .catch(() => "");
    expect(heroAfter).toBe(heroBefore);
  });
});

// ── US-3: Copy buttons on hero context detail cards ────────────────────────

test.describe("US-3 — Copy buttons on hero context detail cards", () => {
  test("selecting a product adds a copy button to each hero-context-card", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const cards = page.locator("#heroContextDetail .hero-context-card");
    const count = await cards.count();
    expect(count, "Expected at least one hero-context-card").toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(cards.nth(i).locator(".card-copy-btn")).toHaveCount(1);
    }
  });

  test("hero context copy buttons have aria-label 'Copy section'", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "crewai");

    const btn = page
      .locator("#heroContextDetail .hero-context-card .card-copy-btn")
      .first();
    await expect(btn).toHaveAttribute("aria-label", "Copy section");
    await expect(btn).toHaveAttribute("title", "Copy section");
  });

  test("clicking a hero context copy button adds .copied class and removes it", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);
    await selectProduct(page, "crewai");

    const btn = page
      .locator("#heroContextDetail .hero-context-card .card-copy-btn")
      .first();
    await btn.click({ force: true });

    await expect(btn).toHaveClass(/copied/, { timeout: 2_000 });
    await expect(btn).not.toHaveClass(/copied/, { timeout: 2_500 });
  });

  test("switching products replaces copy buttons (no duplicate buttons)", async ({
    page,
  }) => {
    test.setTimeout(40_000);
    await loadAndDismissTour(page);

    await selectProduct(page, "crewai");
    await selectProduct(page, "paperclip");

    const cards = page.locator("#heroContextDetail .hero-context-card");
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      // innerHTML is replaced on each selectProduct call, so no duplicates
      await expect(cards.nth(i).locator(".card-copy-btn")).toHaveCount(1);
    }
  });

  test("clipboard stub receives text containing the product name when copying", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);
    await selectProduct(page, "crewai");

    const btn = page
      .locator("#heroContextDetail .hero-context-card .card-copy-btn")
      .first();
    await btn.click({ force: true });
    await page.waitForTimeout(400);

    const copied = await page.evaluate(
      () => (window as any).__clipboardStub as string,
    );
    expect(copied.toLowerCase()).toContain("crewai");
  });

  test("product card clipboard stub contains product name, vendor and strata", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await stubClipboard(page);

    const card = page.locator('.product-card[data-product-id="crewai"]');
    await card.hover();
    await page.waitForTimeout(200);
    await card.locator(".card-copy-btn").click({ force: true });
    await page.waitForTimeout(400);

    const copied = await page.evaluate(
      () => (window as any).__clipboardStub as string,
    );
    expect(copied).toContain("CrewAI");
    expect(copied).toContain("CrewAI Inc");
    expect(copied).toContain("S4");
    expect(copied).toContain("S3");
  });
});

// ── US-4: Quick reference compact row ─────────────────────────────────────

test.describe("US-4 — Quick reference stays on one row", () => {
  test("quick reference renders exactly three compact items", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "af");

    const items = page.locator(
      "#heroContextDetail .hero-product-quickref-item",
    );
    await expect(items).toHaveCount(3);
  });

  test("all quick reference items share the same top position", async ({
    page,
  }) => {
    test.setTimeout(30_000);
    await loadAndDismissTour(page);
    await selectProduct(page, "af");

    const tops = await page
      .locator("#heroContextDetail .hero-product-quickref-item")
      .evaluateAll((nodes) =>
        nodes.map((node) => Math.round(node.getBoundingClientRect().top)),
      );

    expect(tops.length).toBe(3);
    expect(new Set(tops).size).toBe(1);
  });
});
