const { chromium } = require('playwright');
const fs = require('fs');

async function createScreenshot() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Read the HTML file
  const html = fs.readFileSync('elements-preview.html', 'utf8');
  
  // Set content and take screenshot
  await page.setContent(html);
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.screenshot({ 
    path: 'elements-preview.png', 
    fullPage: true,
    type: 'png'
  });
  
  console.log('✅ Screenshot saved as elements-preview.png');
  await browser.close();
}

createScreenshot().catch(console.error);