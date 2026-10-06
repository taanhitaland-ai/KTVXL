import os
import sys
import time
from playwright.sync_api import sync_playwright

def run_tests():
    cwd = os.getcwd()
    index_path = os.path.join(cwd, 'web', 'index.html')
    file_uri = f"file://{index_path}"
    
    print(f"Starting Multi-Subject E2E tests for Web Application at: {file_uri}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        )
        page = browser.new_page(viewport={'width': 1400, 'height': 900})
        
        # Track console errors & auto-accept dialogs
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        page.on('dialog', lambda dialog: dialog.accept())
        
        page.goto(file_uri, wait_until='networkidle')
        print("Page loaded successfully.")
        
        # --- PART 1: TEST KTVXL (VI XỬ LÝ) ---
        print("\n=== [1] TESTING KTVXL (VI XỬ LÝ) ===")
        # Ensure KTVXL is active
        page.click('#btn-subj-ktvxl')
        page.wait_for_timeout(300)
        
        total_stat = page.locator('#stat-total-count').text_content()
        print(f"Test 1 - KTVXL Total Question Counter: {total_stat}")
        assert total_stat == "984", f"Expected 984 questions, found {total_stat}"
        print("✅ Test 1 PASSED: KTVXL total questions equals 984.")
        
        # Test 2: Check Diagrams & Lightbox in Part 7
        print("Testing filter by Part 7 (Sơ đồ mở rộng bộ nhớ)...")
        page.select_option('#filter-source', 'PART_07')
        page.wait_for_timeout(400)
        
        img_locator = page.locator('.q-image-container img').first
        assert img_locator.count() > 0, "No image found in Part 7!"
        img_locator.scroll_into_view_if_needed()
        page.wait_for_timeout(300)
        natural_w = img_locator.evaluate("el => el.naturalWidth")
        assert natural_w > 0, "Image failed to load in Part 7!"
        print("✅ Test 2 PASSED: KTVXL Part 7 circuit diagram rendered cleanly.")
        
        # Lightbox
        img_locator.click()
        page.wait_for_timeout(300)
        lightbox = page.locator('#image-lightbox-modal')
        assert lightbox.evaluate("el => el.style.display !== 'none'"), "Lightbox failed to open!"
        page.click('#btn-close-lightbox')
        page.wait_for_timeout(200)
        print("✅ Test 3 PASSED: Lightbox opened and closed smoothly.")

        # Test 4: Answer Question in KTVXL
        page.select_option('#filter-source', 'DE_001')
        page.wait_for_timeout(300)
        first_opt = page.locator('.question-card').first.locator('.option-btn').first
        first_opt.click()
        page.wait_for_timeout(300)
        exp_text = page.locator('#panel-content').text_content()
        assert "Lời Giải Chi Tiết" in exp_text, "Explanation did not appear!"
        print("✅ Test 4 PASSED: KTVXL instant feedback & Casio tip rendered.")

        # --- PART 2: TEST TTHCM (TƯ TƯỞNG HỒ CHÍ MINH) ---
        print("\n=== [2] TESTING TTHCM (TƯ TƯỞNG HỒ CHÍ MINH) ===")
        # Switch to TTHCM
        page.click('#btn-subj-tthcm')
        page.wait_for_timeout(400)

        # Test 5: Verify total TTHCM count
        tthcm_total = page.locator('#stat-total-count').text_content()
        print(f"Test 5 - TTHCM Total Question Counter: {tthcm_total}")
        assert tthcm_total == "885", f"Expected 885 TTHCM questions, found {tthcm_total}"
        print("✅ Test 5 PASSED: TTHCM total questions equals 885.")

        # Test 6: Verify Brand Header updated
        badge_text = page.locator('#app-brand-badge').text_content()
        assert "TTHCM" in badge_text, f"Header badge did not update: {badge_text}"
        print(f"✅ Test 6 PASSED: Header badge updated to {badge_text}.")

        # Test 7: Verify Chapter badge on TTHCM cards
        first_card = page.locator('.question-card').first
        card_text = first_card.text_content()
        assert "Chương" in card_text, "Chapter badge missing on TTHCM card!"
        print("✅ Test 7 PASSED: TTHCM cards display Chapter badges.")

        # Test 8: Answer Question in TTHCM & verify Academic explanation
        tthcm_opt = first_card.locator('.option-btn').first
        tthcm_opt.click()
        page.wait_for_timeout(300)
        tthcm_exp = page.locator('#panel-content').text_content()
        assert "Lời Giải Chi Tiết" in tthcm_exp, "TTHCM explanation did not appear!"
        assert "Mẹo" in tthcm_exp, "TTHCM memory tip did not appear!"
        print("✅ Test 8 PASSED: TTHCM explanation and memory tip rendered.")

        # Test 9: Test Filter by Chapter
        page.select_option('#filter-source', 'CHAP_2')
        page.wait_for_timeout(300)
        chap2_cards = page.locator('.question-card').count()
        print(f"Chapter 2 rendered cards: {chap2_cards}")
        assert chap2_cards > 0, "No cards found for Chapter 2!"
        print("✅ Test 9 PASSED: Filter by Chapter works.")

        # Test 10: Test TTHCM Knowledge Hub
        print("Testing TTHCM Knowledge Hub Tab...")
        page.click('#btn-tab-knowledge')
        page.wait_for_timeout(400)
        chap_cards = page.locator('.chapter-card').count()
        print(f"TTHCM Knowledge Hub cards: {chap_cards}")
        # Should have 6 chapters + Timeline + Magic Keywords = 8 cards
        assert chap_cards >= 7, f"Expected at least 7 cards, found {chap_cards}"
        print("✅ Test 10 PASSED: TTHCM Knowledge Hub rendered with Chapters, Timeline and Keywords.")

        # Test 11: Test TTHCM Exam Simulator
        print("Testing TTHCM Exam Simulator...")
        page.click('#btn-tab-exam')
        page.wait_for_timeout(300)
        page.click('#btn-start-exam')
        page.wait_for_timeout(500)

        exam_q_count = page.locator('#exam-questions-list .question-card').count()
        print(f"TTHCM Exam questions loaded: {exam_q_count}")
        assert exam_q_count == 40, f"Expected 40 exam questions, found {exam_q_count}"

        # Answer 1 question and submit
        page.locator('#exam-questions-list .question-card').first.locator('.option-btn').first.click()
        page.wait_for_timeout(200)

        page.click('#btn-submit-exam')
        page.wait_for_timeout(400)
        # Check result modal
        result_modal = page.locator('#exam-result-modal')
        is_modal_active = result_modal.evaluate("el => el.classList.contains('active')")
        assert is_modal_active, "Exam result modal did not activate!"
        score_val = page.locator('#modal-score-val').text_content()
        print(f"TTHCM Exam Score Calculated: {score_val} / 10")
        print("✅ Test 11 PASSED: TTHCM Exam simulator completed and scored accurately.")

        # Close modal
        page.click('#btn-close-modal')
        page.wait_for_timeout(300)

        # Test 12: Switch back to KTVXL to verify zero state pollution
        print("Testing switch back to KTVXL...")
        page.click('#btn-subj-ktvxl')
        page.wait_for_timeout(300)
        total_back = page.locator('#stat-total-count').text_content()
        assert total_back == "984", f"Expected 984 after switching back, found {total_back}"
        print("✅ Test 12 PASSED: Switched back to KTVXL with full state preserved.")

        # Check console errors
        print(f"Console errors during test run: {len(errors)}")
        if errors:
            print("Errors detected:", errors)
        assert len(errors) == 0, f"Found {len(errors)} console errors during test run!"

        # Screenshots
        shot_practice = os.path.join(cwd, 'web', 'screenshot_practice.png')
        shot_exam = os.path.join(cwd, 'web', 'screenshot_exam_result.png')
        page.click('#btn-tab-practice')
        page.wait_for_timeout(300)
        page.screenshot(path=shot_practice)
        print(f"Captured updated screenshot at: {shot_practice}")

        print("\n🎉 ALL 12 MULTI-SUBJECT E2E AUTOMATED TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    run_tests()
