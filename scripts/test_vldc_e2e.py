import sys
import os
import time
from playwright.sync_api import sync_playwright

def run_tests():
    html_path = os.path.abspath("web/index.html")
    file_url = f"file://{html_path}"
    print(f"Testing URL: {file_url}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1400, 'height': 900})
        page = context.new_page()

        # Capture console errors
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: print(f"[{msg.type}] {msg.text}") if msg.type in ['error', 'warn'] else None)

        page.goto(file_url, wait_until='domcontentloaded')
        page.wait_for_timeout(1000)

        print("\n--- 1. Testing Default Subject (KTVXL) ---")
        brand_title = page.inner_text("#app-brand-title")
        print(f"Brand Title: {brand_title}")
        assert "VI XỬ LÝ" in brand_title or "TƯ TƯỞNG" in brand_title or "VẬT LÝ" in brand_title

        print("\n--- 2. Switching to Subject: VLDC ---")
        btn_vldc = page.locator("#btn-subj-vldc")
        btn_vldc.click()
        page.wait_for_timeout(500)

        brand_title = page.inner_text("#app-brand-title")
        print(f"New Brand Title: {brand_title}")
        assert "VẬT LÝ ĐẠI CƯƠNG" in brand_title

        total_count = page.inner_text("#stat-total-count")
        print(f"VLDC Total Questions: {total_count}")
        assert int(total_count) >= 140

        print("\n--- 3. Testing Practice Arena & Instant Answer Check ---")
        q_cards = page.locator(".question-card")
        q_count = q_cards.count()
        print(f"Rendered question cards: {q_count}")
        assert q_count > 0

        # Click first option on Question 1
        first_opt = q_cards.first.locator(".option-btn").first
        first_opt.click()
        page.wait_for_timeout(400)

        # Check side panel
        panel_title = page.inner_text("#panel-q-title")
        print(f"Side panel title: {panel_title}")
        assert "CÂU" in panel_title

        panel_content = page.inner_html("#panel-content")
        assert "Lời Giải Chi Tiết" in panel_content
        print("Side panel successfully loaded detailed step-by-step solution!")

        # Screenshot practice arena
        page.screenshot(path="web/screenshot_vldc_practice.png")
        print("Captured: web/screenshot_vldc_practice.png")

        print("\n--- 4. Testing Knowledge Hub (VLDC) ---")
        page.locator("#btn-tab-knowledge").click()
        page.wait_for_timeout(500)

        chap_cards = page.locator(".chapter-card")
        print(f"Knowledge cards count: {chap_cards.count()}")
        assert chap_cards.count() >= 6

        # Check magic keywords & casio tables
        knowledge_html = page.inner_html("#knowledge-chapters-container")
        assert "Từ Khóa Vàng" in knowledge_html
        assert "SỔ TAY CASIO" in knowledge_html
        print("Knowledge Hub successfully rendered 6 chapters + Từ khóa vàng + Sổ tay Casio!")

        print("\n--- 5. Testing Interactive Physics Lab (Mô Phỏng Trực Quan) ---")
        page.locator("#btn-tab-visualize").click()
        page.wait_for_timeout(800)

        # Module 1: Young
        active_pane = page.locator(".sim-view-pane.active")
        assert active_pane.get_attribute("id") == "sim-pane-young"
        readout_i = page.inner_text("#out-young-i")
        print(f"Young initial fringe width: {readout_i}")
        assert "mm" in readout_i

        # Test Slider Interaction
        slider_lambda = page.locator("#sl-young-lambda")
        slider_lambda.fill("650")
        slider_lambda.dispatch_event("input")
        page.wait_for_timeout(200)

        new_val = page.inner_text("#val-young-lambda")
        print(f"Updated lambda value: {new_val}")
        assert "650 nm" in new_val

        # Test Thin Plate toggle
        chk_plate = page.locator("#chk-young-plate")
        chk_plate.check()
        page.wait_for_timeout(200)
        plate_shift = page.inner_text("#out-young-shift")
        print(f"Plate fringe shift: {plate_shift}")
        assert "khoảng vân" in plate_shift

        page.screenshot(path="web/screenshot_vldc_sim_young.png")
        print("Captured: web/screenshot_vldc_sim_young.png")

        # Test Switch to Photoelectric
        page.locator('button[data-sim="photoelectric"]').click()
        page.wait_for_timeout(500)
        photo_pane = page.locator("#sim-pane-photoelectric")
        assert photo_pane.is_visible()
        photo_uh = page.inner_text("#out-photo-uh")
        print(f"Photoelectric stopping potential: {photo_uh}")
        assert "V" in photo_uh

        page.screenshot(path="web/screenshot_vldc_sim_photo.png")
        print("Captured: web/screenshot_vldc_sim_photo.png")

        # Test Switch to Compton
        page.locator('button[data-sim="compton"]').click()
        page.wait_for_timeout(500)
        compton_shift = page.inner_text("#out-compton-deltal")
        print(f"Compton shift: {compton_shift}")
        assert "Å" in compton_shift

        # Test Switch to Quantum Box
        page.locator('button[data-sim="quantum"]').click()
        page.wait_for_timeout(500)
        quantum_en = page.inner_text("#out-quantum-en")
        print(f"Quantum Box energy E_n: {quantum_en}")
        assert "eV" in quantum_en

        page.screenshot(path="web/screenshot_vldc_sim_quantum.png")
        print("Captured: web/screenshot_vldc_sim_quantum.png")

        # Test Switch to Polarization
        page.locator('button[data-sim="polarization"]').click()
        page.wait_for_timeout(500)
        polar_ratio = page.inner_text("#out-polar-ratio")
        print(f"Polarization Malus ratio: {polar_ratio}")
        assert "%" in polar_ratio

        print("\n--- 6. Testing Exam Simulator (VLDC) ---")
        page.locator("#btn-tab-exam").click()
        page.wait_for_timeout(500)

        # Start Exam
        page.locator("#btn-start-exam").click()
        page.wait_for_timeout(500)

        exam_active_view = page.locator("#exam-active-view")
        assert exam_active_view.is_visible()

        exam_qs = page.locator("#exam-questions-list .question-card")
        print(f"Exam questions count: {exam_qs.count()}")
        assert exam_qs.count() == 40

        timer_text = page.inner_text("#exam-timer-display")
        print(f"Exam timer running: {timer_text}")
        assert ":" in timer_text

        # Answer 5 questions
        for i in range(5):
            opt = exam_qs.nth(i).locator(".option-btn").first
            if opt.count() > 0:
                opt.click()
                page.wait_for_timeout(100)

        # Submit Exam
        page.on("dialog", lambda d: d.accept())
        page.locator("#btn-submit-exam").click()
        page.wait_for_timeout(500)

        # Confirm dialog if any
        # Finish exam modal
        modal = page.locator("#exam-result-modal")
        assert modal.is_visible()
        score = page.inner_text("#modal-score-val")
        print(f"Exam score: {score}/10")
        assert float(score) >= 0.0

        page.screenshot(path="web/screenshot_vldc_exam_result.png")
        print("Captured: web/screenshot_vldc_exam_result.png")

        print("\n--- 7. Checking PDF Download Cards ---")
        page.locator("#btn-close-modal").click()
        page.locator("#btn-tab-download").click()
        page.wait_for_timeout(500)

        dl_cards = page.locator(".download-card")
        print(f"Total download cards: {dl_cards.count()}")
        assert dl_cards.count() == 6

        print("\nAll 7 test suites passed with 0 errors!")
        if errors:
            print(f"Encountered JS errors: {errors}")
            assert False, f"Errors: {errors}"
        else:
            print("Zero JavaScript console errors observed.")

        browser.close()

if __name__ == "__main__":
    run_tests()
