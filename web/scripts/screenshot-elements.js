const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  const url = process.argv[2] || 'http://localhost:3001/elements';
  await page.goto(url, { waitUntil: 'networkidle' });
  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');
  await page.screenshot({ path: 'screenshots/elements.png', fullPage: false });
  await browser.close();
  console.log('screenshot saved at screenshots/elements.png');
})();
