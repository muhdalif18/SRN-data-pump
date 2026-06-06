const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, 'playwright-automation-syllabus.html');
  await page.goto(`file://${htmlPath}`);

  await page.pdf({
    path: 'Playwright-Automation-Syllabus.pdf',
    format: 'A4',
    margin: {
      top: '18mm',
      right: '18mm',
      bottom: '18mm',
      left: '18mm'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div style="font-size: 9pt; width: 100%; text-align: center; color: #666;"></div>',
    footerTemplate: '<div style="font-size: 9pt; width: 100%; text-align: center; color: #666; padding: 5px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>'
  });

  await browser.close();
  console.log('PDF generated successfully: Playwright-Automation-Syllabus.pdf');
})();
