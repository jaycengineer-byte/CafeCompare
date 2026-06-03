const puppeteer = require('C:/Projects/TradeIQ/node_modules/puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 20000 });

  // Round 1: default state (full page)
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_r1_default.png', fullPage: true });
  console.log('R1 done');

  // Click the search input and type to trigger dropdown
  await page.focus('input');
  await page.keyboard.type('Brew');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_r2_dropdown.png', fullPage: false });
  console.log('R2 done');

  // Click the first result in the dropdown
  const dropdownButtons = await page.$$('div[class*="absolute"] button, ul button, [role="option"]');
  if (dropdownButtons.length > 0) {
    await dropdownButtons[0].click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_r3_added.png', fullPage: false });
    console.log('R3 done');
  } else {
    console.log('No dropdown items found');
  }

  // Click Save Comparison
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const txt = await page.evaluate(el => el.textContent.trim(), btn);
    if (txt === 'Save Comparison') { await btn.click(); break; }
  }
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'C:/Projects/CafeCompare/ss_r4_saved.png', fullPage: false });
  console.log('R4 done');

  await browser.close();
})();
