import pw from '/root/Codepro/7.aOS-Explorer/node_modules/playwright-core/index.js'; const { chromium } = pw;
const BASE = process.env.BASE || 'http://127.0.0.1:8899';
const b = await chromium.launch({ executablePath:'/usr/bin/google-chrome', args:['--no-sandbox','--disable-dev-shm-usage'] });
const ctx = await b.newContext({ viewport:{width:1280,height:900} });
const page = await ctx.newPage();
const errs=[]; page.on('pageerror',e=>errs.push(String(e.message).slice(0,120)));
await page.goto(BASE + '/explorer.html', { waitUntil:'domcontentloaded', timeout:20000 });
await page.evaluate(() => { localStorage.clear(); });
await page.reload({ waitUntil:'domcontentloaded' });
await page.waitForTimeout(4000);
const out = await page.evaluate(() => {
  const txt = el => (el.textContent||'').trim().replace(/\s+/g,' ');
  // 1. watch buttons
  const watch = ['l1','l2','l3','l4','l5','l6','l7'].map(id => {
    const el = document.getElementById('watchBtn_'+id); return el ? id+'='+txt(el) : id+'=<absent>'; });
  // 2. trending banner
  const tb = document.getElementById('trendingBanner') || document.querySelector('.trending-banner,[class*=trending]');
  // 3. every visible element whose ENTIRE text is a bare zero
  const bareZero = [];
  for (const el of document.querySelectorAll('body *')) {
    if (el.children.length) continue;
    const t = txt(el);
    if (t !== '0' && t !== '0 ' ) continue;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (r.width === 0 || r.height === 0 || cs.visibility === 'hidden' || cs.display === 'none') continue;
    const lbl = el.getAttribute('aria-label') || el.id || el.className || el.tagName;
    bareZero.push(String(lbl).slice(0,60) + '  <- rendered "0"');
  }
  return { watch, trending: tb ? { present:true, text: txt(tb).slice(0,160), visible: tb.getBoundingClientRect().height>0 } : { present:false },
           bareZeroCount: bareZero.length, bareZero: bareZero.slice(0,12) };
});
console.log('SIGNED-OUT / CLEARED-STORAGE STATE, explorer.html');
console.log(' watch buttons: ' + out.watch.join('  '));
console.log(' trending banner: ' + JSON.stringify(out.trending));
console.log(' visible elements rendering a BARE "0": ' + out.bareZeroCount);
for (const z of out.bareZero) console.log('    ' + z);
console.log(' uncaught page errors: ' + errs.length + (errs.length?'  '+errs.join(' | '):''));
await b.close(); process.exit(0);
