// Run with: playwright-cli run-code --filename scripts/browser_checks.js
async (page) => {
  const base = page.url().split('/').slice(0,3).join('/');
  const checks = [];
  try {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  let acceptDialogs = true;
  page.on('dialog', dialog => acceptDialogs ? dialog.accept() : dialog.dismiss());
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  await page.goto(base + '/web/index.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  const cases = {
    ktvxl: ['1','2','3','4','5','RANDOM'],
    tthcm: ['TTHCM_FULL_A','TTHCM_DE_132','TTHCM_DE_651','TTHCM_DE_CUONG','RANDOM'],
    vldc: ['NOTION_DE_CUOI','NOTION_TEST_100','NOTION_GIAK_2025','NOTION_DE_CUONG','VLDC_STANDARD','VLDC_OPTICS','VLDC_QUANTUM','RANDOM']
  };
  let passed = 0;
  for (const [subject, codes] of Object.entries(cases)) {
    await page.locator('#btn-subj-' + subject).click();
    await page.locator('#btn-tab-exam').click();
    assert(await page.locator('.exam-card-choice').count() === codes.length, subject + ': incomplete exam catalog');
    for (const code of codes) {
      await page.locator('.exam-card-choice[data-exam-code="' + code + '"]').click();
      assert(await page.locator('.exam-card-choice.selected').getAttribute('data-exam-code') === code, 'Choice did not change: ' + code);
      await page.locator('#btn-start-exam').click();
      const actual = await page.locator('#exam-questions-list .question-card').evaluateAll(cards => cards.map(card => card.dataset.questionId));
      const data = await page.evaluate(subject => subject === 'ktvxl' ? window.KTVXL_QUESTIONS : subject === 'tthcm' ? window.TTHCM_QUESTIONS_DATA : window.VLDC_QUESTIONS_DATA, subject);
      const unique = new Set(actual);
      assert(unique.size === actual.length, 'Duplicate questions in exam ' + code);
      if (!['RANDOM','VLDC_OPTICS','VLDC_QUANTUM'].includes(code)) {
        const source = subject === 'ktvxl' ? 'DE_' + code.padStart(3,'0') : code;
        const matched = data.filter(q => subject === 'ktvxl' ? q.exam_id === source : q.source === source).sort((a,b) => a.num-b.num);
        const limit = subject === 'tthcm' && code !== 'TTHCM_DE_651' || code === 'VLDC_STANDARD' ? 40 : matched.length;
        assert(JSON.stringify(actual) === JSON.stringify(matched.slice(0,limit).map(q => q.id)), 'Wrong source/order: ' + subject + '/' + code);
      } else {
        assert(actual.length === (code === 'RANDOM' ? 40 : 30), 'Wrong random/specialty count');
      }
      const minutes = {ktvxl:60,tthcm:40,vldc:45}[subject];
      const timer = await page.locator('#exam-timer-display').textContent();
      assert(timer.startsWith(minutes + ':') || timer.startsWith((minutes-1)+':'), 'Wrong duration for ' + subject);
      const duplicateDOM = await page.evaluate(() => {
        const ids = [...document.querySelectorAll('[id]')].map(el => el.id);
        return ids.length - new Set(ids).size;
      });
      assert(duplicateDOM === 0, 'Duplicate DOM IDs between practice and exam');
      const first = data.find(q => q.id === actual[0]);
      const card = page.locator('#exam-q-card-' + first.id);
      if (first.type === 'fib') await card.locator('input').fill(String(first.acceptable_answers?.[0] ?? first.answer));
      else await card.locator('.option-btn[data-letter="'+ first.answer +'"]').click();
      assert(await page.locator('#exam-progress-text').textContent() === '1/' + actual.length, 'Progress did not update');
      await page.locator('#btn-submit-exam').click();
      await page.locator('#exam-result-modal.active').waitFor();
      const expected = (Math.round(10 / actual.length * 10) / 10).toFixed(1);
      assert(await page.locator('#modal-score-val').textContent() === expected, 'Wrong score in ' + code);
      assert(await card.locator('button:enabled,input:enabled').count() === 0, 'Submitted exam remains editable');
      await page.locator('#btn-review-exam').click();
      assert(await page.locator('.exam-review-row').count() === actual.length, 'Review explanations missing');
      assert(await page.locator('.katex-error').count() === 0, 'Formula render error in review');
      await page.locator('#btn-back-exam').click();
      assert(await page.locator('#exam-setup-view').isVisible(), 'No way back from review');
      passed++;
      checks.push(subject + '/' + code);
      console.log('PASS ' + subject + '/' + code + ': source, count, timer, progress, score, frozen review');
    }
  }
  // Editing and clearing a fill-in answer must update its progress automatically.
  await page.locator('#btn-subj-ktvxl').click();
  await page.locator('.exam-card-choice[data-exam-code="1"]').click();
  await page.locator('#btn-start-exam').click();
  const fib = page.locator('#exam-questions-list .fib-input').first();
  await fib.fill('wrong');
  assert(await page.locator('#exam-progress-text').textContent() === '1/40', 'Typing did not save fill-in answer');
  await fib.fill('');
  assert(await page.locator('#exam-progress-text').textContent() === '0/40', 'Clearing did not clear progress');
  acceptDialogs = false;
  await page.locator('#btn-subj-tthcm').click();
  assert(await page.locator('#app-brand-badge').textContent() === '⚡ KTVXL', 'Canceling a subject change discarded exam');
  acceptDialogs = true;
  await page.locator('#btn-subj-tthcm').click();
  assert(await page.locator('#exam-setup-view').isVisible(), 'Confirmed subject change kept old exam');
  assert(await page.locator('#exam-questions-list .question-card').count() === 0, 'Old exam cards remain after subject change');
  assert(errors.length === 0, 'Browser errors: ' + errors.join('; '));
  console.log('PASS ' + passed + ' exam choices + auto-saving/clearing fill-in answers + subject-change confirmation. Browser errors: 0.');
  const report = { passed, checks, fillIn: true, subjectConfirmation: true, browserErrors: errors, complete: true };
  await page.evaluate(report => window.__KMA_BROWSER_REPORT = report, report);
  return report;
  } catch (error) {
    await page.evaluate(report => window.__KMA_BROWSER_REPORT = report, { complete: false, checks, error: error.message });
    throw error;
  }
}
