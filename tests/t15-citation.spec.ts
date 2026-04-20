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

test.describe("T15 — Citation widget", () => {
  test.beforeEach(async ({ page }) => {
    await load(page);
  });

  test("T15-01  cite modal overlay exists in DOM (hidden by default)", async ({
    page,
  }) => {
    const overlay = page.locator("#citeModalOverlay");
    await expect(overlay).toHaveClass(/hidden/);
  });

  test("T15-02  openCiteModal shows the modal", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    const overlay = page.locator("#citeModalOverlay");
    await expect(overlay).not.toHaveClass(/hidden/);
  });

  test("T15-03  6 format tabs present", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    const tabs = page.locator(".cite-format-tab");
    expect(await tabs.count()).toBe(6);
  });

  test("T15-04  BibTeX is the default tab", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    const active = page.locator(".cite-format-tab.active");
    await expect(active).toContainText("BibTeX");
  });

  test("T15-05  BibTeX output contains @misc", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    const output = page.locator("#citeOutput");
    await expect(output).toContainText("@misc{");
  });

  test("T15-06  switching to APA shows APA-style output", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    await page.click(".cite-format-tab:has-text('APA 7')");
    const output = page.locator("#citeOutput");
    await expect(output).toContainText("LangChain");
    await expect(output).toContainText("[Entry]");
  });

  test("T15-07  switching to Markdown shows link syntax", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    await page.click(".cite-format-tab:has-text('Markdown')");
    const output = page.locator("#citeOutput");
    const text = await output.textContent();
    expect(text).toMatch(/\[.+\]\(.+\)/);
  });

  test("T15-08  Plain URL shows https://aos7.tech URL", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    await page.click(".cite-format-tab:has-text('Plain URL')");
    const output = page.locator("#citeOutput");
    await expect(output).toContainText("https://aos7.tech/product/langchain");
  });

  test("T15-09  close button hides modal", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    await expect(page.locator("#citeModalOverlay")).not.toHaveClass(/hidden/);
    await page.click(".cite-modal .sb-btn");
    await expect(page.locator("#citeModalOverlay")).toHaveClass(/hidden/);
  });

  test("T15-10  backdrop click closes modal", async ({ page }) => {
    await page.evaluate(() =>
      (window as any).openCiteModal("product", "langchain", "LangChain"),
    );
    await expect(page.locator("#citeModalOverlay")).not.toHaveClass(/hidden/);
    await page.locator("#citeModalOverlay").click({ position: { x: 5, y: 5 } });
    await expect(page.locator("#citeModalOverlay")).toHaveClass(/hidden/);
  });

  test("T15-11  cite button appears in product detail panel", async ({
    page,
  }) => {
    // Select a product by clicking the first product card's selectProduct
    await page.evaluate(() => {
      const firstCard = document.querySelector(".product-card[onclick]");
      if (!firstCard) return;
      const onclick = firstCard.getAttribute("onclick") || "";
      const m = onclick.match(/selectProduct\('(\w+)'\)/);
      if (m) (window as any).selectProduct(m[1]);
    });
    // Wait for the cite trigger button
    const citeBtn = page.locator(".cite-trigger-btn");
    await expect(citeBtn).toBeVisible({ timeout: 5000 });
  });

  test("T15-12  cite button in product panel opens cite modal", async ({
    page,
  }) => {
    await page.evaluate(() => {
      const firstCard = document.querySelector(".product-card[onclick]");
      if (!firstCard) return;
      const onclick = firstCard.getAttribute("onclick") || "";
      const m = onclick.match(/selectProduct\('(\w+)'\)/);
      if (m) (window as any).selectProduct(m[1]);
    });
    await page.click(".cite-trigger-btn");
    await expect(page.locator("#citeModalOverlay")).not.toHaveClass(/hidden/);
  });
});
