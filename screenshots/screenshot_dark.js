const puppeteer = require('C:/Projects/TradeIQ/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 25000 });

  // Comparison tab full page
  await page.screenshot({ path: 'C:/Projects/CafeCompare/dark_r1_comparison.png', fullPage: true });
  console.log('R1 comparison done');

  // Viewport-only top of page for detail check
  await page.screenshot({ path: 'C:/Projects/CafeCompare/dark_r1_top.png', fullPage: false });
  console.log('R1 top done');

  // Switch to Reviews tab
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent.trim(), btn);
    if (txt === 'Reviews') { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/dark_r1_reviews.png', fullPage: true });
  console.log('R1 reviews done');

  await browser.close();
})();
