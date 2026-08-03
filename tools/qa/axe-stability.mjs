import pw from '/root/Codepro/7.aOS-Explorer/node_modules/playwright-core/index.js'; const { chromium } = pw;
import { readFileSync } from 'node:fs';
const axeSrc = readFileSync('/root/Codepro/AutoBudget/apps/frontend/node_modules/axe-core/axe.min.js','utf8');
const browser = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
async function count(base) {
  const ctx = await browser.newContext({ viewport:{width:1280,height:900} });
  const page = await ctx.newPage();
  await page.goto(base + '/index.html', { waitUntil:'domcontentloaded', timeout:20000 });
  await page.waitForTimeout(3000);
  await page.addScriptTag({ content: axeSrc });
  const v = await page.evaluate(async () => await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','section508']}}));
  const cc = v.violations.find(x=>x.id==='color-contrast');
  await ctx.close();
  return cc ? cc.nodes.length : 0;
}
const tip=[], base=[];
for (let i=0;i<3;i++){ tip.push(await count('http://127.0.0.1:8899')); base.push(await count('http://127.0.0.1:8898')); }
console.log('index.html color-contrast node counts across 3 runs');
console.log('  TIP  3cec81a : ' + tip.join(', '));
console.log('  BASE main    : ' + base.join(', '));
const uniq = a => [...new Set(a)];
console.log('  tip stable? ' + (uniq(tip).length===1) + '   base stable? ' + (uniq(base).length===1));
await browser.close(); process.exit(0);
