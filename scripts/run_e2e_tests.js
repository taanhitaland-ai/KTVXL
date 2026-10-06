const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runE2ETests() {
  console.log('🧪 Starting Playwright E2E Verification Suite for KTVXL App...');

  // 1. Verify PDFs exist
  const pdf1 = path.join(process.cwd(), 'KTVXL_Kien_Thuc_Trong_Tam.pdf');
  const pdf2 = path.join(process.cwd(), 'KTVXL_Ngan_Hang_Cau_Hoi_Loi_Giai_Meo_Casio.pdf');

  if (!fs.existsSync(pdf1) || fs.statSync(pdf1).size < 100000) {
    throw new Error(`Deliverable 1 PDF missing or too small: ${pdf1}`);
  }
  console.log(`✅ Deliverable 1 verified: ${(fs.statSync(pdf1).size / 1024).toFixed(1)} KB`);

  if (!fs.existsSync(pdf2) || fs.statSync(pdf2).size < 1000000) {
    throw new Error(`Deliverable 2 PDF missing or too small: ${pdf2}`);
  }
  console.log(`✅ Deliverable 2 verified: ${(fs.statSync(pdf2).size / 1024 / 1024).toFixed(2)} MB`);

  // 2. Launch browser to test Web App
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const indexUrl = 'file://' + path.join(process.cwd(), 'web', 'index.html');
  console.log(`Navigating to Web App: ${indexUrl}`);
  await page.goto(indexUrl, { waitUntil: 'networkidle' });

  // Test 1: Check Page Title & Header
  const title = await page.title();
  console.log(`Page title: "${title}"`);
  if (!title.includes('KTVXL')) throw new Error('Invalid page title');
  console.log('✅ Test 1 Passed: App loaded with correct title.');

  // Test 2: Check Question Stream populated
  await page.waitForSelector('.question-card');
  const cardCount = await page.locator('.question-card').count();
  console.log(`Rendered question cards: ${cardCount}`);
  if (cardCount < 10) throw new Error('Not enough question cards rendered');
  console.log('✅ Test 2 Passed: Question stream loaded successfully.');

  // Test 3: Test Interactive MCQ selection & Instant Evaluation
  const firstCard = page.locator('.question-card').first();
  const firstOptBtn = firstCard.locator('.option-btn').first();
  console.log('Clicking first option button on Question 1...');
  await firstOptBtn.click();
  await page.waitForTimeout(300);

  // Check if button got evaluated (either selected-correct or selected-wrong)
  const isSelected = await firstOptBtn.evaluate(el => el.classList.contains('selected-correct') || el.classList.contains('selected-wrong'));
  if (!isSelected) throw new Error('Option button was not evaluated on click');
  console.log('✅ Test 3 Passed: Instant MCQ evaluation verified.');

  // Test 4: Check Side Drawer opened with Explanation & Casio tips
  const drawerTitle = await page.locator('#panel-q-title').textContent();
  console.log(`Side Drawer Title: "${drawerTitle}"`);
  const drawerHasExp = await page.locator('.sec-exp').count();
  const drawerHasCasio = await page.locator('.sec-casio').count();
  if (drawerHasExp === 0) throw new Error('Explanation section missing in drawer');
  console.log(`✅ Test 4 Passed: Side drawer popped up with explanation (${drawerHasExp}) and Casio tips (${drawerHasCasio}).`);

  // Take screenshot of Practice screen
  const shot1 = path.join(process.cwd(), 'web', 'screenshot_practice.png');
  await page.screenshot({ path: shot1, fullPage: false });
  console.log(`📸 Practice mode screenshot saved: ${shot1}`);

  // Test 5: Test Tab Switching
  console.log('Testing Tab Navigation to Knowledge Hub...');
  await page.locator('#btn-tab-knowledge').click();
  await page.waitForSelector('#tab-knowledge.active');
  const chapterCardsCount = await page.locator('.chapter-card').count();
  console.log(`Knowledge Hub chapter cards count: ${chapterCardsCount}`);
  if (chapterCardsCount < 5) throw new Error('Knowledge chapters not rendered');
  console.log('✅ Test 5 Passed: Knowledge Hub tab navigation verified.');

  // Test 6: Test Download Hub Tab
  console.log('Testing Download Hub Tab...');
  await page.locator('#btn-tab-download').click();
  await page.waitForSelector('#tab-download.active');
  const dlCardsCount = await page.locator('.download-card').count();
  if (dlCardsCount !== 2) throw new Error('Expected 2 download cards');
  console.log('✅ Test 6 Passed: Download Hub tab verified.');

  // Test 7: Test Exam Simulator Tab & 60m Timer
  console.log('Testing Exam Simulator Tab...');
  await page.locator('#btn-tab-exam').click();
  await page.waitForSelector('#tab-exam.active');

  // Click start exam
  console.log('Starting 60-minute Exam Simulator...');
  await page.locator('#btn-start-exam').click();
  await page.waitForSelector('#exam-active-view', { state: 'visible' });

  const timerText = await page.locator('#exam-timer-display').textContent();
  console.log(`Exam timer active: ${timerText}`);
  if (!timerText.includes('59:') && !timerText.includes('60:')) {
    throw new Error(`Timer text abnormal: ${timerText}`);
  }

  // Answer first question in exam
  const examFirstOpt = page.locator('#exam-questions-list .question-card').first().locator('.option-btn').first();
  await examFirstOpt.click();
  await page.waitForTimeout(200);

  // Submit exam
  console.log('Submitting exam to check Result Modal...');
  page.on('dialog', async dialog => {
    await dialog.accept(); // accept confirmation dialog
  });
  await page.locator('#btn-submit-exam').click();
  await page.waitForSelector('#exam-result-modal.active', { state: 'visible' });

  const scoreVal = await page.locator('#modal-score-val').textContent();
  console.log(`Exam result score: ${scoreVal} / 10`);

  // Take screenshot of Exam Result
  const shot2 = path.join(process.cwd(), 'web', 'screenshot_exam_result.png');
  await page.screenshot({ path: shot2, fullPage: false });
  console.log(`📸 Exam result screenshot saved: ${shot2}`);

  console.log('✅ Test 7 Passed: Exam simulator, countdown timer, submission, and score modal verified.');

  await browser.close();
  console.log('\n🎉 ALL E2E PLAYWRIGHT TESTS PASSED 100%! APPLICATION IS READY.');
}

runE2ETests().catch(err => {
  console.error('❌ E2E Test Suite Failed:', err);
  process.exit(1);
});
