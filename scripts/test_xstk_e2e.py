import sys
import os
import time
from pathlib import Path
from playwright.sync_api import sync_playwright

def run_tests():
    file_url = Path('web/index.html').resolve().as_uri()
    Path('output/playwright').mkdir(parents=True, exist_ok=True)
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

        print("\n--- 1. Switching to Subject: XSTK ---")
        btn_xstk = page.locator("#btn-subj-xstk")
        assert btn_xstk.is_visible(), "XSTK subject button not found!"
        btn_xstk.click()
        page.wait_for_timeout(600)

        brand_badge = page.inner_text("#app-brand-badge")
        print(f"Brand Badge: {brand_badge}")
        assert "XSTK" in brand_badge, f"Unexpected brand badge: {brand_badge}"

        total_count = page.inner_text("#stat-total-count")
        print(f"XSTK Total Questions: {total_count}")
        assert int(total_count) == 139, f"Expected 139 questions, got {total_count}"

        print("\n--- 2. Testing Practice Arena & Instant Feedback ---")
        q_cards = page.locator(".question-card")
        q_count = q_cards.count()
        print(f"Rendered question cards: {q_count}")
        assert q_count > 0, "No questions rendered in practice arena"

        # Click first option on Question 1
        first_card = q_cards.first
        first_opt = first_card.locator(".option-btn").first
        first_opt.click()
        page.wait_for_timeout(400)

        # Check side panel
        panel_title = page.inner_text("#panel-q-title")
        print(f"Side panel title: {panel_title}")
        assert "CÂU" in panel_title

        panel_content = page.inner_html("#panel-content")
        assert "Lời Giải Chi Tiết" in panel_content or "Phương Pháp Giải" in panel_content
        print("Side panel successfully loaded detailed step-by-step solution!")

        # Compare the chapter filter with the current database.
        btn_chap4 = page.locator('.filter-btn-group button[data-clo="4"]')
        if btn_chap4.is_visible():
            btn_chap4.click()
            page.wait_for_timeout(400)
            chap4_count = page.locator(".question-card").count()
            print(f"Chapter 4 filtered questions: {chap4_count}")
            expected_count = page.evaluate('window.XSTK_QUESTIONS_DATA.filter(q => q.chapter_id === 4).length')
            assert chap4_count == expected_count, f"Expected {expected_count} questions for Chapter 4, got {chap4_count}"
            # Reset to ALL
            page.locator('.filter-btn-group button[data-clo="ALL"]').click()
            page.wait_for_timeout(300)

        # Screenshot practice arena
        page.screenshot(path="output/playwright/screenshot_xstk_practice.png")
        print("Captured: output/playwright/screenshot_xstk_practice.png")

        print("\n--- 3. Testing Knowledge Hub (XSTK 8 Chapters & Casio Handbook) ---")
        page.locator("#btn-tab-knowledge").click()
        page.wait_for_timeout(500)

        chap_cards = page.locator(".chapter-card")
        print(f"Knowledge cards count: {chap_cards.count()}")
        assert chap_cards.count() >= 8, f"Expected at least 8 chapters, got {chap_cards.count()}"

        knowledge_html = page.inner_html("#knowledge-chapters-container")
        assert "Chương 1:" in knowledge_html
        assert "Chương 8:" in knowledge_html
        assert "SỔ TAY CASIO" in knowledge_html
        print("Knowledge Hub successfully rendered 8 chapters + Sổ tay Casio fx-580VNX!")

        page.screenshot(path="output/playwright/screenshot_xstk_knowledge.png")
        print("Captured: output/playwright/screenshot_xstk_knowledge.png")

        print("\n--- 4. Testing Interactive Probability & Statistics Lab ---")
        page.locator("#btn-tab-visualize").click()
        page.wait_for_timeout(800)

        # Verify XSTK lab container is visible and VLDC lab is hidden
        assert page.locator("#lab-container-xstk").is_visible(), "XSTK lab container should be visible"
        assert not page.locator("#lab-container-vldc").is_visible(), "VLDC lab container should be hidden"

        # Module 1: LLN (Law of Large Numbers)
        print("Testing Module 1: LLN...")
        active_pane = page.locator(".xstk-sim-view-pane.active")
        assert active_pane.get_attribute("id") == "xstk-pane-lln"
        page.locator("#btn-lln-step100").click()
        page.wait_for_timeout(300)
        n_val = page.inner_text("#val-lln-trials")
        print(f"LLN trials after +100: {n_val}")
        assert int(n_val.replace(',', '')) >= 100

        page.screenshot(path="output/playwright/screenshot_xstk_sim_lln.png")
        print("Captured: output/playwright/screenshot_xstk_sim_lln.png")

        # Module 2: Galton Board
        print("Testing Module 2: Galton Board & CLT...")
        page.locator('button[data-sim="galton"]').click()
        page.wait_for_timeout(500)
        galton_pane = page.locator("#xstk-pane-galton")
        assert galton_pane.is_visible()
        page.locator("#btn-galton-drop1000").click()
        page.wait_for_timeout(400)
        total_balls = page.inner_text("#val-galton-total")
        print(f"Galton total balls after drop: {total_balls}")
        assert int(total_balls.replace(',', '')) >= 1000

        page.screenshot(path="output/playwright/screenshot_xstk_sim_galton.png")
        print("Captured: output/playwright/screenshot_xstk_sim_galton.png")

        # Module 3: Normal Bell Curve
        print("Testing Module 3: Normal Distribution Bell Curve...")
        page.locator('button[data-sim="normal"]').click()
        page.wait_for_timeout(500)
        normal_pane = page.locator("#xstk-pane-normal")
        assert normal_pane.is_visible()

        # Click preset 3sigma
        page.locator('button[data-preset="3sigma"]').click()
        page.wait_for_timeout(300)
        pct_val = page.inner_text("#val-norm-pct")
        print(f"3-Sigma coverage percent: {pct_val}")
        assert "99.7" in pct_val

        page.screenshot(path="output/playwright/screenshot_xstk_sim_normal.png")
        print("Captured: output/playwright/screenshot_xstk_sim_normal.png")

        # Module 4: Confidence Interval 95%
        print("Testing Module 4: Confidence Interval 95%...")
        page.locator('button[data-sim="ci"]').click()
        page.wait_for_timeout(500)
        ci_pane = page.locator("#xstk-pane-ci")
        assert ci_pane.is_visible()

        page.locator("#btn-ci-sample100").click()
        page.wait_for_timeout(400)
        ci_total = page.inner_text("#val-ci-total")
        ci_pct = page.inner_text("#val-ci-pct")
        print(f"CI total samples: {ci_total}, Coverage rate: {ci_pct}")
        assert int(ci_total.replace(',', '')) >= 100

        page.screenshot(path="output/playwright/screenshot_xstk_sim_ci.png")
        print("Captured: output/playwright/screenshot_xstk_sim_ci.png")

        print("\n--- 5. Testing Exam Simulator (XSTK 40 Questions) ---")
        page.locator("#btn-tab-exam").click()
        page.wait_for_timeout(500)

        # Check Exam Choices
        exam_cards = page.locator(".exam-card-choice")
        assert exam_cards.count() >= 5
        print(f"Available exam presets: {exam_cards.count()}")

        # Start Exam
        btn_start = page.locator("#btn-start-exam")
        btn_start.click()
        page.wait_for_timeout(600)

        assert page.locator("#exam-active-view").is_visible(), "Exam active view not visible"
        palette_btns = page.locator(".palette-btn")
        print(f"Exam question palette count: {palette_btns.count()}")
        assert palette_btns.count() == 40, f"Expected 40 exam questions, got {palette_btns.count()}"

        # Answer 5 questions
        exam_q_cards = page.locator("#exam-questions-list .question-card")
        for i in range(5):
            exam_q_cards.nth(i).locator(".option-btn").first.click()
            page.wait_for_timeout(100)

        # Submit Exam
        btn_submit = page.locator("#btn-submit-exam")
        page.on("dialog", lambda dialog: dialog.accept()) # Accept confirmation alert
        btn_submit.click()
        page.wait_for_timeout(600)

        # Result Modal
        modal = page.locator("#exam-result-modal")
        assert modal.is_visible(), "Exam result modal not displayed"
        score_val = page.inner_text("#modal-score-val")
        print(f"Exam Score: {score_val} / 10")

        clo1_text = page.evaluate('document.getElementById("clo1-result-stat").previousElementSibling.textContent')
        print(f"Breakdown 1: {clo1_text}")
        assert "Chương 1-3" in clo1_text

        page.screenshot(path="output/playwright/screenshot_xstk_exam_result.png")
        print("Captured: output/playwright/screenshot_xstk_exam_result.png")

        # Close Modal
        page.locator("#btn-close-modal").click()
        page.wait_for_timeout(400)

        print("\n--- 6. Testing Download Hub (XSTK PDFs) ---")
        page.locator("#btn-tab-download").click()
        page.wait_for_timeout(500)

        download_cards = page.locator(".download-card")
        print(f"Total download cards: {download_cards.count()}")
        assert download_cards.count() >= 10, f"Expected at least 10 cards, got {download_cards.count()}"

        page.screenshot(path="output/playwright/screenshot_xstk_download.png")
        print("Captured: output/playwright/screenshot_xstk_download.png")

        print("\n=== ALL XSTK E2E TESTS PASSED SUCCESSFULLY! ===")
        browser.close()

if __name__ == '__main__':
    run_tests()
