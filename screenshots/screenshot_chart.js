const puppeteer = require('C:/Projects/TradeIQ/node_modules/puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 25000 });

  // Round 1: chart baseline check (no hover)
  await page.screenshot({ path: 'C:/Projects/CafeCompare/chart_r1_baseline.png', fullPage: false });
  console.log('R1 baseline done');

  // Hover over the first bar — move mouse to approximate bar position
  // Chart bars are in the chart section, roughly at x=450, y=500 for first bar
  await page.mouse.move(450, 500);
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/chart_r2_hover.png', fullPage: false });
  console.log('R2 hover done');

  // Hover second bar
  await page.mouse.move(820, 500);
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/chart_r3_hover2.png', fullPage: false });
  console.log('R3 hover2 done');

  await browser.close();
})();
