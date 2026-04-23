import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FILE_URL = `file:///${path
  .resolve(__dirname, "../prototype.html")
  .replace(/\\/g, "/")}`;

async function loadWithoutTour(page: any) {
  await page.addInitScript(() => {
    localStorage.setItem("aosTourDone", "1");
    localStorage.setItem("aosVisitCount", "4");
  });
  await page.goto(FILE_URL, { waitUntil: "networkidle" });
}

// Constructs we have infographics for — key maps to slug
const WIRED = [
  { label: "Intent Object", slug: "intent-object", stratum: "l7s1" },
  { label: "Session Context", slug: "session-context", stratum: "l7s1" },
  {
    label: "Satisfaction Signal",
    slug: "satisfaction-signal",
    stratum: "l7s1",
  },
  { label: "Feedback Loop", slug: "feedback-loop", stratum: "l7s1" },
  { label: "Execution Plan", slug: "execution-plan", stratum: "l4s1" },
  { label: "State Checkpoint", slug: "state-checkpoint", stratum: "l4s1" },
  { label: "Dependency Graph", slug: "dependency-graph", stratum: "l4s1" },
  { label: "Timeout Policy", slug: "timeout-policy", stratum: "l4s1" },
  { label: "Agent Roster", slug: "agent-roster", stratum: "l4s2" },
  { label: "Task Assignment", slug: "task-assignment", stratum: "l4s2" },
  { label: "Message Channel", slug: "message-channel", stratum: "l3s1" },
  { label: "Capability Schema", slug: "capability-schema", stratum: "l3s1" },
  { label: "Delegation Policy", slug: "delegation-policy", stratum: "l6s1" },
  { label: "Tool Manifest", slug: "tool-manifest", stratum: "l3s1" },
  { label: "API Binding", slug: "api-binding", stratum: "l3s1" },
  { label: "Chunk Collection", slug: "chunk-collection", stratum: "l2s1" },
  { label: "Policy Evaluation", slug: "policy-evaluation", stratum: "l6s1" },
  { label: "Relevance Score", slug: "relevance-score", stratum: "l5s1" },
  { label: "Rerank Pipeline", slug: "rerank-pipeline", stratum: "l5s1" },
  { label: "Search Index", slug: "search-index", stratum: "l2s1" },
  { label: "Audit Entry", slug: "audit-entry", stratum: "l6s3" },
  { label: "Compliance Check", slug: "compliance-check", stratum: "l6s3" },
  { label: "Retention Policy", slug: "retention-policy", stratum: "l6s3" },
  { label: "Evidence Chain", slug: "evidence-chain", stratum: "l6s3" },
  { label: "Content Filter", slug: "content-filter", stratum: "l6s4" },
];

test.describe("Infographics wired into construct detail panel", () => {
  test("infographic images exist on disk for all wired constructs", () => {
    for (const { slug } of WIRED) {
      const imgPath = path.resolve(
        __dirname,
        `../docs/infographic-output/${slug}.png`,
      );
      expect(
        fs.existsSync(imgPath),
        `Missing disk image: ${slug}.png`,
      ).toBeTruthy();
    }
  });

  test("clicking Intent Object construct chip shows infographic in detail panel", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await loadWithoutTour(page);

    // Expand L7 stratum
    await page.locator("#l7").click();
    await page.waitForTimeout(500);

    // Click the L7 substrate to reveal construct chips
    await page
      .locator(".substrate-item")
      .filter({ hasText: "Intent Parsers" })
      .click();
    await page.waitForTimeout(400);

    // Click the intent_object construct chip (text includes emoji prefix)
    const chip = page
      .locator(".construct-chip")
      .filter({ hasText: "intent_object" });
    await expect(chip).toBeVisible({ timeout: 5000 });
    await chip.click();
    await page.waitForTimeout(400);

    // Detail panel should now contain an infographic image
    const detailPanel = page.locator("#detailPanel");
    const img = detailPanel.locator('img[src*="intent-object"]');
    await expect(
      img,
      "No infographic image found in detail panel for Intent Object",
    ).toBeVisible({ timeout: 3000 });

    // Image should have loaded (naturalWidth > 0)
    await page.waitForFunction(
      () => {
        const panel = document.getElementById("detailPanel");
        const img = panel?.querySelector(
          'img[src*="intent-object"]',
        ) as HTMLImageElement | null;
        return img && img.complete && img.naturalWidth > 0;
      },
      { timeout: 10000 },
    );
  });

  test("construct breakdown stays attached to the clicked construct and labels decomposition", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await loadWithoutTour(page);

    await page.locator("#l7").click();
    await page.waitForTimeout(500);

    await page
      .locator(".substrate-item")
      .filter({ hasText: "Intent Parsers" })
      .click();
    await page.waitForTimeout(400);

    const chip = page
      .locator("#l7s1-constructs .construct-chip")
      .filter({ hasText: "intent_object" });
    await expect(chip).toBeVisible({ timeout: 5000 });
    await chip.click();
    await page.waitForTimeout(300);

    const breakdownPanel = page.locator(
      "#l7s1-constructs .primitive-panel.construct-breakdown-anchor",
    );
    await expect(breakdownPanel).toBeVisible();
    await expect(breakdownPanel).toContainText("Construct breakdown");
    await expect(breakdownPanel).toContainText("intent_object");
    await expect(breakdownPanel).toContainText("decomposes into");

    const placement = await page.evaluate(() => {
      const panel = document.getElementById("l7s1-constructs");
      if (!panel) return { isLastChild: false, activeConstructId: "" };
      const anchor = panel.querySelector(
        ".primitive-panel.construct-breakdown-anchor",
      ) as HTMLElement | null;
      return {
        isLastChild: panel.lastElementChild === anchor,
        activeConstructId: anchor?.dataset.activeConstructId ?? "",
      };
    });

    expect(placement.isLastChild).toBeTruthy();
    expect(placement.activeConstructId).toBe("l7s1-c1");
  });

  test("hover explanation card is available for all construct chips", async ({
    page,
  }) => {
    test.setTimeout(60000);
    await loadWithoutTour(page);

    const hoverCoverage = await page.evaluate(() => {
      const chips = Array.from(
        document.querySelectorAll(".construct-chip"),
      ) as HTMLElement[];
      const missing: string[] = [];

      chips.forEach((chip) => {
        (window as any).showConstructHoverCard?.(chip);
        const card = document.getElementById("constructHoverCard");
        const text = (card?.textContent || "").trim();
        if (!text) {
          missing.push((chip.textContent || "").trim());
        }
      });

      (window as any).hideConstructHoverCard?.();
      return { total: chips.length, missing };
    });

    expect(hoverCoverage.total).toBeGreaterThan(0);
    expect(hoverCoverage.missing).toEqual([]);
  });
});
