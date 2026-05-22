import { test, expect } from "@playwright/test";
import path from "path";

const PROD = "https://aos-explorer.web.app";

test.describe("Image loading — production", () => {
  test.skip("prod docs.html — terminology primer image loads", async ({
    page,
  }) => {
    // SKIPPED: docs.html is now text-only (no embedded images)
    await page.goto(`${PROD}/docs.html`, { waitUntil: "networkidle" });
    const images = page.locator("img");
    const count = await images.count();
    expect(count, "No images found on prod docs.html").toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const natural = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(natural, `Broken image on prod: ${src}`).toBeGreaterThan(0);
    }
  });

  test("prod docs/assets/aos-terminology-primer.png — 200 OK", async ({
    request,
  }) => {
    const res = await request.get(
      `${PROD}/docs/assets/aos-terminology-primer.png`,
    );
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toMatch(/image/);
  });

  test("prod infographic-output — first batch images accessible", async ({
    request,
  }) => {
    const samples = [
      "intent-object.png",
      "session-context.png",
      "satisfaction-signal.png",
      "feedback-loop.png",
      "execution-plan.png",
      // batch 4
      "chunk-collection.png",
      "policy-evaluation.png",
      "relevance-score.png",
      "rerank-pipeline.png",
      "search-index.png",
      // newly added governance / compliance infographics
      "audit-entry.png",
      "compliance-check.png",
      "content-filter.png",
      "evidence-chain.png",
      "retention-policy.png",
    ];
    for (const file of samples) {
      const res = await request.get(`${PROD}/docs/infographic-output/${file}`);
      expect(res.status(), `Missing on prod: ${file}`).toBe(200);
    }
  });
});

test.describe("Image loading", () => {
  test("docs.html — any present images load successfully", async ({ page }) => {
    const filePath = `file:///${path.resolve(__dirname, "../docs.html").replace(/\\/g, "/")}`;
    await page.goto(filePath, { waitUntil: "networkidle" });

    const images = page.locator("img");
    const count = await images.count();

    // docs.html is currently text-first; zero images is acceptable.
    if (count === 0) {
      expect(count).toBe(0);
      return;
    }

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const natural = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(natural, `Image broken: ${src}`).toBeGreaterThan(0);
    }
  });

  test("explorer.html — no broken images", async ({ page }) => {
    const filePath = `file:///${path.resolve(__dirname, "../explorer.html").replace(/\\/g, "/")}`;
    await page.goto(filePath, { waitUntil: "networkidle" });

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const src = await img.getAttribute("src");
      const natural = await img.evaluate(
        (el: HTMLImageElement) => el.naturalWidth,
      );
      expect(natural, `Image broken: ${src}`).toBeGreaterThan(0);
    }
  });

  test("docs.html — production image paths resolve", async ({ page }) => {
    // Verify images reference paths that would exist in a deployed build
    const filePath = `file:///${path.resolve(__dirname, "../docs.html").replace(/\\/g, "/")}`;
    await page.goto(filePath, { waitUntil: "networkidle" });

    const images = page.locator("img");
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const src = await images.nth(i).getAttribute("src");
      expect(src).not.toBeNull();
      // No absolute filesystem paths that would break in production
      expect(src).not.toMatch(/^[A-Z]:\\/i);
      expect(src).not.toMatch(/^file:\/\//i);
      // Should be a relative path
      expect(src).toMatch(/^[a-z]/i);
    }
  });
});
