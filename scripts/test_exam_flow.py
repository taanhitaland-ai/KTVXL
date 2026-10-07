import asyncio
from playwright.async_api import async_playwright
import os
from pathlib import Path

async def test_exam_selection():
    Path('output/playwright').mkdir(parents=True, exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        # Auto accept confirm dialogs
        page.on('dialog', lambda dialog: asyncio.create_task(dialog.accept()))

        await page.goto(Path('web/index.html').resolve().as_uri())
        await page.wait_for_timeout(1000)

        print('=== TEST 1: KTVXL EXAM SELECTION ===')
        # Switch to tab-exam
        await page.click('button[data-tab="tab-exam"]')
        await page.wait_for_timeout(500)

        # Verify cards
        cards = await page.query_selector_all('.exam-card-choice')
        print(f'KTVXL cards count: {len(cards)}')
        assert len(cards) == 6, f'Expected 6 cards, got {len(cards)}'

        # Default selected should be 1
        sel_card = await page.query_selector('.exam-card-choice.selected')
        sel_code = await sel_card.get_attribute('data-exam-code')
        print(f'Default selected card code: {sel_code}')
        assert sel_code == '1', f'Expected 1, got {sel_code}'

        # Click card for De 002
        card_de2 = await page.query_selector('.exam-card-choice[data-exam-code="2"]')
        await card_de2.click()
        await page.wait_for_timeout(300)

        # Verify selected changed to 2
        sel_card = await page.query_selector('.exam-card-choice.selected')
        sel_code = await sel_card.get_attribute('data-exam-code')
        print(f'After click, selected card code: {sel_code}')
        assert sel_code == '2', f'Expected 2, got {sel_code}'

        # Check start button label
        btn_text = await page.inner_text('#btn-start-exam')
        print(f'Start button text: {btn_text}')
        assert '002' in btn_text, f'Button should mention 002, got: {btn_text}'

        # Start exam
        await page.click('#btn-start-exam')
        await page.wait_for_timeout(500)

        # Verify active exam view
        active_display = await page.evaluate("() => document.getElementById('exam-active-view').style.display")
        assert active_display == 'block', 'Active exam view should be visible'

        exam_title = await page.inner_text('#exam-current-name')
        print(f'Active exam title: {exam_title}')
        assert '002' in exam_title, f'Exam title should reflect De 002: {exam_title}'

        # Verify first question prompt is from DE_002
        first_q_prompt = await page.inner_text('.question-card:first-child .q-title')
        print(f'First Q prompt: {first_q_prompt[:60]}...')
        assert 'Để đọc dữ liệu từ vào ra' in first_q_prompt, 'Should be question from DE_002!'

        # Answer question 1
        await page.click('.question-card:first-child .option-btn:first-child')
        await page.wait_for_timeout(200)

        # Progress should be 1/40
        prog_text = await page.inner_text('#exam-progress-text')
        print(f'Progress text after 1 answer: {prog_text}')
        assert '1/40' in prog_text, f'Expected 1/40, got {prog_text}'

        # Exit exam
        await page.click('#btn-exit-exam')
        await page.wait_for_timeout(500)

        # Verify back to setup view
        setup_display = await page.evaluate("() => document.getElementById('exam-setup-view').style.display")
        assert setup_display == 'block', 'Setup view should be visible after exiting'

        print('=== TEST 2: TTHCM EXAM SELECTION ===')
        await page.click('#btn-subj-tthcm')
        await page.wait_for_timeout(500)
        await page.click('button[data-tab="tab-exam"]')
        await page.wait_for_timeout(300)

        cards_tthcm = await page.query_selector_all('.exam-card-choice')
        print(f'TTHCM cards count: {len(cards_tthcm)}')
        assert len(cards_tthcm) == 5, f'Expected 5 cards, got {len(cards_tthcm)}'

        # Click card TTHCM_DE_651
        card_651 = await page.query_selector('.exam-card-choice[data-exam-code="TTHCM_DE_651"]')
        await card_651.click()
        await page.wait_for_timeout(300)

        sel_code = await (await page.query_selector('.exam-card-choice.selected')).get_attribute('data-exam-code')
        print(f'TTHCM selected code: {sel_code}')
        assert sel_code == 'TTHCM_DE_651', f'Expected TTHCM_DE_651, got {sel_code}'

        await page.click('#btn-start-exam')
        await page.wait_for_timeout(500)

        exam_title = await page.inner_text('#exam-current-name')
        print(f'Active TTHCM exam title: {exam_title}')
        assert '651' in exam_title, f'Expected 651 in title, got {exam_title}'

        # Exit exam
        await page.click('#btn-exit-exam')
        await page.wait_for_timeout(500)

        print('=== TEST 3: VLDC EXAM SELECTION ===')
        await page.click('#btn-subj-vldc')
        await page.wait_for_timeout(500)
        await page.click('button[data-tab="tab-exam"]')
        await page.wait_for_timeout(300)

        cards_vldc = await page.query_selector_all('.exam-card-choice')
        print(f'VLDC cards count: {len(cards_vldc)}')
        assert len(cards_vldc) == 8, f'Expected 8 cards, got {len(cards_vldc)}'

        # Click NOTION_DE_CUOI
        card_de_cuoi = await page.query_selector('.exam-card-choice[data-exam-code="NOTION_DE_CUOI"]')
        await card_de_cuoi.click()
        await page.wait_for_timeout(300)

        sel_code = await (await page.query_selector('.exam-card-choice.selected')).get_attribute('data-exam-code')
        print(f'VLDC selected code: {sel_code}')
        assert sel_code == 'NOTION_DE_CUOI', f'Expected NOTION_DE_CUOI, got {sel_code}'

        await page.click('#btn-start-exam')
        await page.wait_for_timeout(500)

        prog_text = await page.inner_text('#exam-progress-text')
        print(f'VLDC progress text: {prog_text}')
        assert '0/38' in prog_text, f'Expected 0/38, got {prog_text}'

        # Exit exam
        await page.click('#btn-exit-exam')
        await page.wait_for_timeout(500)

        print('=== TEST 4: XSTK EXAM SELECTION ===')
        await page.click('#btn-subj-xstk')
        await page.wait_for_timeout(500)
        await page.click('button[data-tab="tab-exam"]')
        await page.wait_for_timeout(300)

        cards_xstk = await page.query_selector_all('.exam-card-choice')
        print(f'XSTK cards count: {len(cards_xstk)}')
        assert len(cards_xstk) == 8, f'Expected 8 cards, got {len(cards_xstk)}'

        # Click KMA_EXAM_01
        card_xstk1 = await page.query_selector('.exam-card-choice[data-exam-code="KMA_EXAM_01"]')
        await card_xstk1.click()
        await page.wait_for_timeout(300)

        sel_code = await (await page.query_selector('.exam-card-choice.selected')).get_attribute('data-exam-code')
        print(f'XSTK selected code: {sel_code}')
        assert sel_code == 'KMA_EXAM_01', f'Expected KMA_EXAM_01, got {sel_code}'

        # Screenshot of selected cards in XSTK
        await page.screenshot(path='output/playwright/screenshot_exam_selection.png')

        await page.click('#btn-start-exam')
        await page.wait_for_timeout(500)

        exam_title = await page.inner_text('#exam-current-name')
        print(f'Active XSTK exam title: {exam_title}')
        assert '01' in exam_title, f'Expected 01 in title: {exam_title}'

        # Screenshot of active exam view
        await page.screenshot(path='output/playwright/screenshot_exam_active.png')

        await browser.close()
        print('=== ALL EXAM SELECTION TESTS PASSED PERFECTLY! ===')

if __name__ == '__main__':
    asyncio.run(test_exam_selection())
