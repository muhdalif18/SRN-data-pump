// Quick test to verify browser configuration
const { chromium, firefox } = require('@playwright/test');

async function testBrowsers() {
  console.log('Testing browser configurations...\n');

  // Test Edge
  try {
    console.log('1. Testing Edge...');
    const edgeBrowser = await chromium.launch({
      channel: 'msedge',
      headless: false
    });
    const edgePage = await edgeBrowser.newPage();
    await edgePage.goto('https://www.example.com');
    console.log('   ✅ Edge opened successfully!');
    await edgeBrowser.close();
  } catch (err) {
    console.log('   ❌ Edge failed:', err.message);
  }

  // Test Firefox
  try {
    console.log('\n2. Testing Firefox...');
    const firefoxBrowser = await firefox.launch({ headless: false });
    const firefoxPage = await firefoxBrowser.newPage();
    await firefoxPage.goto('https://www.example.com');
    console.log('   ✅ Firefox opened successfully!');
    await firefoxBrowser.close();
  } catch (err) {
    console.log('   ❌ Firefox failed:', err.message);
  }

  // Test Chrome
  try {
    console.log('\n3. Testing Chrome...');
    const chromeBrowser = await chromium.launch({
      channel: 'chrome',
      headless: false
    });
    const chromePage = await chromeBrowser.newPage();
    await chromePage.goto('https://www.example.com');
    console.log('   ✅ Chrome opened successfully!');
    await chromeBrowser.close();
  } catch (err) {
    console.log('   ❌ Chrome failed:', err.message);
  }

  console.log('\nTest complete!');
}

testBrowsers().catch(console.error);
