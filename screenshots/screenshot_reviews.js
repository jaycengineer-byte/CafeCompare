const puppeteer = require('C:/Projects/TradeIQ/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 20000 });

  // Comparison tab (default)
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_tab_comparison.png', fullPage: false });
  console.log('Comparison tab done');

  // Click Reviews tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent.trim(), btn);
    if (txt === 'Reviews') { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_tab_reviews_p1.png', fullPage: true });
  console.log('Reviews tab page 1 done');

  // Click page 2 on first shop column
  const allBtns = await page.$$('button');
  for (const btn of allBtns) {
    const txt = await page.evaluate(el => el.textContent.trim(), btn);
    if (txt === 'Next →') { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_tab_reviews_p2.png', fullPage: true });
  console.log('Reviews tab page 2 done');

  await browser.close();
})();
