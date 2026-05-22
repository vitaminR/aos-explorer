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

test.describe("T12 — MCP Manifest", () => {
  test("T12-01: generateMcpManifest function is defined", async ({ page }) => {
    await load(page);
    const defined = await page.evaluate(
      () => typeof (window as any).generateMcpManifest === "function",
    );
    expect(defined).toBe(true);
  });

  test("T12-02: manifest has server block with name and url", async ({
    page,
  }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    expect(manifest.server).toBeDefined();
    expect(manifest.server.name).toContain("{a}OS7");
    expect(manifest.server.url).toContain("aos7.tech");
  });

  test("T12-03: manifest includes 4 required tools", async ({ page }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    const toolNames = manifest.tools.map((t: any) => t.name);
    expect(toolNames).toContain("search_products");
    expect(toolNames).toContain("get_stratum");
    expect(toolNames).toContain("get_primitive");
    expect(toolNames).toContain("compare_products");
  });

  test("T12-04: each tool has name, description, and inputSchema", async ({
    page,
  }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    for (const tool of manifest.tools) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
    }
  });

  test("T12-05: manifest taxonomyVersion matches getTaxonomyVersion()", async ({
    page,
  }) => {
    await load(page);
    const result = await page.evaluate(() => {
      const manifest = (window as any).generateMcpManifest();
      const ver = (window as any).getTaxonomyVersion();
      return { manifestVer: manifest.taxonomyVersion, ver };
    });
    expect(result.manifestVer).toBe(result.ver);
  });

  test("T12-06: manifest has rateLimit block", async ({ page }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    expect(manifest.rateLimit).toBeDefined();
    expect(manifest.rateLimit.requestsPerMinute).toBeGreaterThan(0);
  });

  test("T12-07: downloadMcpManifest function is defined", async ({ page }) => {
    await load(page);
    const defined = await page.evaluate(
      () => typeof (window as any).downloadMcpManifest === "function",
    );
    expect(defined).toBe(true);
  });

  test("T12-08: command palette contains MCP manifest entry", async ({
    page,
  }) => {
    await load(page);
    await page.evaluate(() => (window as any).toggleCmdPalette());
    await page.fill("#cmdInput", "mcp");
    await page.waitForTimeout(300);
    const results = page.locator(".cmd-result-item");
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
    const labels = await results.allTextContents();
    expect(labels.some((t) => t.toLowerCase().includes("mcp"))).toBe(true);
  });

  test("T12-09: search_products tool has required query input", async ({
    page,
  }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    const tool = manifest.tools.find((t: any) => t.name === "search_products");
    expect(tool.inputSchema.required).toContain("query");
  });

  test("T12-10: compare_products tool has minItems 2", async ({ page }) => {
    await load(page);
    const manifest = await page.evaluate(() =>
      (window as any).generateMcpManifest(),
    );
    const tool = manifest.tools.find((t: any) => t.name === "compare_products");
    expect(tool.inputSchema.properties.ids.minItems).toBe(2);
  });
});
