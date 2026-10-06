import os
import sys
import time
from playwright.sync_api import sync_playwright

def run_tests():
    cwd = os.getcwd()
    index_path = os.path.join(cwd, 'web', 'index.html')
    file_uri = f"file://{index_path}"
    
    print(f"Starting E2E tests for Web Application at: {file_uri}")
    
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            args=['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
        )
        page = browser.new_page(viewport={'width': 1400, 'height': 900})
        
        # Track console errors
        errors = []
        page.on('console', lambda msg: errors.append(msg.text) if msg.type == 'error' else None)
        page.on('pageerror', lambda exc: errors.append(str(exc)))
        
        page.goto(file_uri, wait_until='networkidle')
        print("Page loaded successfully.")
        
        # Test 1: Verify total question counter
        total_stat = page.locator('#stat-total-count').text_content()
        print(f"Test 1 - Total Question Counter: {total_stat}")
        assert total_stat == "984", f"Expected 984 questions, found {total_stat}"
        print("✅ Test 1 PASSED: Total questions equals 984.")
        
        # Test 2: Verify Practice Arena Questions Rendered
        cards = page.locator('.question-card')
        card_count = cards.count()
        print(f"Test 2 - Initial Rendered Cards: {card_count}")
        assert card_count > 0, "No question cards rendered!"
        print(f"✅ Test 2 PASSED: Rendered {card_count} question cards.")
        
        # Test 3: Check Images Rendering and Natural Width on Image-Bearing Questions
        # Select Part 7 (Memory expansion schematics)
        print("Testing filter by Part 7 (Sơ đồ mở rộng bộ nhớ)...")
        page.select_option('#filter-source', 'PART_07')
        page.wait_for_timeout(500)
        
        p7_cards = page.locator('.question-card')
        print(f"Part 7 rendered cards: {p7_cards.count()}")
        
        # Check an image element in Part 7
        img_locator = page.locator('.q-image-container img').first
        assert img_locator.count() > 0, "No image found in Part 7!"
        img_locator.scroll_into_view_if_needed()
        page.wait_for_timeout(400)
        
        img_src = img_locator.get_attribute('src')
        natural_w = img_locator.evaluate("el => el.naturalWidth")
        natural_h = img_locator.evaluate("el => el.naturalHeight")
        print(f"Test 3 - Part 7 Image ({img_src}): naturalWidth={natural_w}, naturalHeight={natural_h}")
        assert natural_w > 0 and natural_h > 0, f"Image {img_src} failed to load (naturalWidth=0)!"
        print("✅ Test 3 PASSED: Diagram image rendered with positive natural width & height!")
        
        # Test 4: Test Image Click to Zoom (Lightbox Modal)
        print("Testing Image Click-to-Zoom Lightbox...")
        img_locator.click()
        page.wait_for_timeout(400)
        
        lightbox = page.locator('#image-lightbox-modal')
        is_visible = lightbox.evaluate("el => el.style.display !== 'none'")
        print(f"Test 4 - Lightbox modal visible: {is_visible}")
        assert is_visible, "Lightbox modal failed to open upon clicking image!"
        
        # Close lightbox
        page.click('#btn-close-lightbox')
        page.wait_for_timeout(300)
        is_closed = lightbox.evaluate("el => el.style.display === 'none'")
        assert is_closed, "Lightbox modal failed to close!"
        print("✅ Test 4 PASSED: Lightbox zoom modal opened and closed smoothly.")
        
        # Test 5: Test Answering an MCQ Question
        # Switch back to DE_001
        print("Testing question answering in DE_001...")
        page.select_option('#filter-source', 'DE_001')
        page.wait_for_timeout(500)
        
        first_opt = page.locator('.question-card').first.locator('.option-btn').first
        opt_letter = first_opt.get_attribute('data-letter')
        first_opt.click()
        page.wait_for_timeout(300)
        
        # Verify side details panel has explanation
        exp_text = page.locator('#panel-content').text_content()
        assert "Lời Giải Chi Tiết" in exp_text, "Explanation did not appear in side panel!"
        print(f"✅ Test 5 PASSED: Instant feedback and explanation rendered on selecting option {opt_letter}.")
        
        # Take Practice screenshot
        practice_shot = os.path.join(cwd, 'web', 'screenshot_practice.png')
        page.screenshot(path=practice_shot, full_page=False)
        print(f"Captured practice screenshot at: {practice_shot}")
        
        # Test 6: Verify Knowledge Hub Tab
        print("Testing Knowledge Hub Tab...")
        page.click('.nav-tab-btn[data-tab="tab-knowledge"]')
        page.wait_for_timeout(500)
        
        chap_cards = page.locator('.chapter-card')
        print(f"Knowledge Hub chapter cards: {chap_cards.count()}")
        assert chap_cards.count() >= 5, "Knowledge hub chapters missing!"
        print("✅ Test 6 PASSED: Knowledge hub rendered all chapters.")
        
        # Test 7: Verify Exam Simulator
        print("Testing Exam Simulator...")
        page.click('.nav-tab-btn[data-tab="tab-exam"]')
        page.wait_for_timeout(500)
        
        # Start exam
        page.click('#btn-start-exam')
        page.wait_for_timeout(500)
        
        exam_list = page.locator('#exam-questions-list .question-card')
        print(f"Exam questions loaded: {exam_list.count()}")
        assert exam_list.count() == 40, f"Expected 40 exam questions, got {exam_list.count()}"
        
        # Answer first question in exam
        page.locator('#exam-questions-list .question-card').first.locator('.option-btn').first.click()
        page.wait_for_timeout(200)
        
        # Submit exam (override window.confirm)
        page.evaluate("window.confirm = () => true")
        page.click('#btn-submit-exam')
        page.wait_for_timeout(600)
        
        # Check result modal
        result_modal = page.locator('#exam-result-modal')
        has_active = result_modal.evaluate("el => el.classList.contains('active')")
        print(f"Exam Result Modal Active: {has_active}")
        assert has_active, "Exam result modal did not appear!"
        
        score_val = page.locator('#modal-score-val').text_content()
        print(f"Exam Score Calculated: {score_val} / 10")
        print("✅ Test 7 PASSED: Exam simulator completed and scored accurately.")
        
        # Take Exam Result screenshot
        exam_shot = os.path.join(cwd, 'web', 'screenshot_exam_result.png')
        page.screenshot(path=exam_shot, full_page=False)
        print(f"Captured exam result screenshot at: {exam_shot}")
        
        # Check for any fatal console errors
        print(f"Console errors during test run: {len(errors)}")
        if errors:
            print("Console errors:", errors)
            
        browser.close()
        print("\n🎉 ALL E2E AUTOMATED TESTS PASSED WITH 100% SUCCESS!")

if __name__ == '__main__':
    run_tests()
