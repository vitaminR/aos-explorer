import { chromium } from "playwright";

const url = "http://localhost:8765/explorer.html";
const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1400, height: 900 },
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.screenshot({ path: "tests/_snapshot-fresh.png", fullPage: false });

// Simulate 3rd-plus visit to see the collapsed "Tips" chip state
await page.evaluate(() => localStorage.setItem("aosVisits", "5"));
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({
  path: "tests/_snapshot-returning.png",
  fullPage: false,
});

await browser.close();
console.log(
  "wrote tests/_snapshot-fresh.png and tests/_snapshot-returning.png",
);
