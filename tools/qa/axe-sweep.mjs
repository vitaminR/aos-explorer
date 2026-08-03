import pw from '/root/Codepro/7.aOS-Explorer/node_modules/playwright-core/index.js'; const { chromium } = pw;
import { readFileSync } from 'node:fs';
const AXE = '/root/Codepro/AutoBudget/apps/frontend/node_modules/axe-core/axe.min.js';
const axeSrc = readFileSync(AXE, 'utf8');
const BASE = process.env.BASE || 'http://127.0.0.1:8899';
const PAGES = ['index.html','explorer.html','build.html','docs.html','embed.html','health.html'];
const browser = await chromium.launch({ executablePath: '/usr/bin/google-chrome', args: ['--no-sandbox','--disable-dev-shm-usage'] });
const results = [];
for (const p of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('pageerror', e => consoleErrors.push(String(e.message).slice(0,140)));
  let status = 'ok';
  try {
    const r = await page.goto(BASE + '/' + p, { waitUntil: 'domcontentloaded', timeout: 20000 });
    status = r ? r.status() : 'no-response';
    await page.waitForTimeout(2500);
  } catch (e) { status = 'NAV-FAIL: ' + String(e.message).slice(0,80); }
  let v = null;
  try {
    await page.addScriptTag({ content: axeSrc });
    v = await page.evaluate(async () => await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','section508'] } }));
  } catch (e) { v = { error: String(e.message).slice(0,120) }; }
  const byImpact = {};
  if (v && v.violations) for (const x of v.violations) { (byImpact[x.impact] ||= []).push({ id: x.id, n: x.nodes.length }); }
  results.push({ page: p, status, pageErrors: consoleErrors.length, byImpact, raw: v && v.violations ? v.violations.length : v });
  await ctx.close();
}
await browser.close();
for (const r of results) {
  console.log('--- ' + r.page + '  http=' + r.status + '  pageErrors=' + r.pageErrors);
  if (r.byImpact && Object.keys(r.byImpact).length) {
    for (const imp of ['critical','serious','moderate','minor']) {
      if (r.byImpact[imp]) console.log('    ' + imp.toUpperCase().padEnd(9) + r.byImpact[imp].map(x => x.id + '(' + x.n + ')').join(', '));
    }
  } else console.log('    violations: ' + JSON.stringify(r.raw));
}
process.exit(0);
