const { chromium } = require('playwright');

async function testCoachNote() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navigate to the elements page
    await page.goto('http://localhost:3000/elements');
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the current state
    await page.screenshot({ path: 'elements-current.png', fullPage: true });
    
    // Click on coach note tab
    await page.click('button:has-text("Coach Note")');
    await page.waitForTimeout(500);
    
    // Fill in the form
    await page.fill('input[name="title"]', 'Weekly Team Check-in');
    await page.fill('textarea[name="content"]', 'Review team performance and provide coaching feedback on collaboration and goal achievement.');
    
    // Take a screenshot with form filled
    await page.screenshot({ path: 'coach-note-form.png', fullPage: true });
    
    // Submit the form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(1000);
    
    // Take final screenshot
    await page.screenshot({ path: 'coach-note-created.png', fullPage: true });
    
    console.log('✅ Coach note test completed successfully');
    console.log('📸 Screenshots saved:');
    console.log('   - elements-current.png');
    console.log('   - coach-note-form.png');
    console.log('   - coach-note-created.png');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    await page.screenshot({ path: 'error-state.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

testCoachNote();