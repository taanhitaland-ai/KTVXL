"""
End-to-End Test for Exam Schedule, Live Countdown, Pomodoro Timer & Study Time Tracker
Using Playwright Headless Browser
"""
import os
import time
from playwright.sync_api import sync_playwright

def run_tests():
    html_path = os.path.abspath("web/index.html")
    url = f"file://{html_path}"
    print(f"Testing URL: {url}")

    errors = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1400, "height": 950})
        page = context.new_page()

        def handle_console(msg):
            if msg.type == "error":
                errors.append(msg.text)
                print(f"[BROWSER ERROR] {msg.text}")

        page.on("console", handle_console)
        page.on("pageerror", lambda exc: errors.append(str(exc)))

        # 1. Load Page
        print("\n--- 1. Testing Page Load & Global Exam Alert Ticker ---")
        page.goto(url)
        page.wait_for_timeout(1000)

        ticker = page.locator("#global-exam-ticker")
        assert ticker.is_visible(), "Global Exam Alert Ticker is not visible"
        ticker_text = ticker.inner_text()
        print(f"Global Ticker Text: {ticker_text.replace(chr(10), ' | ')}")
        assert "Kỹ thuật vi xử lý" in ticker_text
        assert "13/10/2026" in ticker_text

        # 2. Click Nav Tab Schedule & Pomodoro
        print("\n--- 2. Switching to Tab: Lịch Thi & Pomodoro ---")
        btn_tab = page.locator("#btn-tab-schedule")
        assert btn_tab.is_visible(), "Nav button for Schedule tab is missing"
        btn_tab.click()
        page.wait_for_timeout(600)

        schedule_pane = page.locator("#tab-schedule")
        assert schedule_pane.is_visible(), "Tab schedule pane is not active"

        # 3. Check All 5 Exam Cards
        print("\n--- 3. Verifying 5 Exam Schedule Cards & Live Countdowns ---")
        cards = [
            ("ktvxl", "Kỹ Thuật Vi Xử Lý", "13/10/2026", "13h00, 14h00"),
            ("tthcm", "Tư Tưởng Hồ Chí Minh", "19/10/2026", "13h00, 15h00"),
            ("vldc", "Vật Lý Đại Cương 2", "21/10/2026", "7h00, 8h00, 9h00"),
            ("gdtc", "Giáo Dục Thể Chất 3", "22/10/2026", "7h00 sáng"),
            ("xstk", "Toán Xác Suất Thống Kê", "23/10/2026", "13h00, 15h00")
        ]

        for card_id, title, date_str, time_str in cards:
            card_el = page.locator(f"#exam-card-{card_id}")
            assert card_el.is_visible(), f"Card {card_id} not visible"
            card_text = card_el.inner_text()
            assert title in card_text, f"{title} not found in card"
            assert date_str in card_text, f"{date_str} not found in card"
            assert time_str in card_text, f"{time_str} not found in card"

            # Check countdown digits
            cd_el = page.locator(f"#exam-cd-{card_id}")
            cd_text = cd_el.inner_text().replace('\n', ' ')
            print(f"  [{card_id.upper()}] {title}: Countdown -> {cd_text}")
            assert "NGÀY" in cd_text
            assert "GIỜ" in cd_text
            assert "PHÚT" in cd_text
            assert "GIÂY" in cd_text

        # Capture Screenshot of Schedule Grid
        page.screenshot(path="web/screenshot_exam_schedule_tab.png")
        print("Captured: web/screenshot_exam_schedule_tab.png")

        # 4. Test Pomodoro Timer
        print("\n--- 4. Testing Pomodoro Focus Timer ---")
        time_display = page.locator("#pomodoro-time-display")
        assert time_display.inner_text() == "25:00", f"Expected 25:00, got {time_display.inner_text()}"

        # Test Preset Switch to 45 mins
        btn_45 = page.locator('.pomo-preset-btn[data-minutes="45"]')
        btn_45.click()
        page.wait_for_timeout(200)
        assert time_display.inner_text() == "45:00", f"Expected 45:00, got {time_display.inner_text()}"
        print("Preset 45 min test: PASS")

        # Test Custom Time Input: 35 mins
        input_custom = page.locator("#input-custom-pomodoro")
        input_custom.fill("35")
        page.locator("#btn-apply-custom-pomodoro").click()
        page.wait_for_timeout(200)
        assert time_display.inner_text() == "35:00", f"Expected 35:00, got {time_display.inner_text()}"
        print("Custom 35 min test: PASS")

        # Test Subject Selector Chip: Select XSTK
        chip_xstk = page.locator('.pomo-subj-btn[data-subj="xstk"]')
        chip_xstk.click()
        page.wait_for_timeout(200)
        label_text = page.locator("#pomodoro-current-subject-label").inner_text()
        print(f"Current Subject Label: {label_text}")
        assert "xác suất thống kê" in label_text.lower()

        # Test Start / Pause / Reset
        btn_start = page.locator("#btn-pomodoro-start")
        btn_start.click()
        page.wait_for_timeout(2100) # wait 2 seconds
        cur_time = time_display.inner_text()
        print(f"Timer ticking down: {cur_time}")
        assert cur_time != "35:00", "Timer did not tick down"

        btn_start.click() # Pause
        page.wait_for_timeout(300)
        paused_time = time_display.inner_text()
        page.wait_for_timeout(1000)
        assert time_display.inner_text() == paused_time, "Timer did not pause"
        print("Start and Pause test: PASS")

        # Reset
        page.locator("#btn-pomodoro-reset").click()
        page.wait_for_timeout(200)
        assert time_display.inner_text() == "35:00", "Reset did not restore 35:00"
        print("Reset test: PASS")

        # 5. Test Study Tracker & Quick Add
        print("\n--- 5. Testing Study Tracker & Daily Logs ---")
        # Add 15 mins to KTVXL
        btn_add_ktvxl = page.locator('.stat-add-btn[data-subj="ktvxl"][data-add="15"]')
        btn_add_ktvxl.click()
        page.wait_for_timeout(300)

        # Add 30 mins to XSTK
        btn_add_xstk = page.locator('.stat-add-btn[data-subj="xstk"][data-add="30"]')
        btn_add_xstk.click()
        page.wait_for_timeout(300)

        total_stat = page.locator("#stat-today-total-time").inner_text()
        print(f"Total Study Time Today: {total_stat}")
        assert "45 phút" in total_stat or "45" in total_stat

        # Verify Table Entry
        tbody_text = page.locator("#study-history-tbody").inner_text()
        print(f"History Table Row: {tbody_text.replace(chr(10), ' | ')}")
        assert "Hôm nay" in tbody_text
        assert "45 phút" in tbody_text or "Vi xử lý" in tbody_text

        # Capture Screenshot of Pomodoro & Tracker
        page.evaluate("window.scrollTo(0, document.querySelector('.planner-two-col').offsetTop - 60)")
        page.wait_for_timeout(400)
        page.screenshot(path="web/screenshot_pomodoro_tracker.png")
        page.locator("#pomodoro-main-box").screenshot(path="web/screenshot_pomodoro_timer_box.png")
        page.locator("#study-tracker-box").screenshot(path="web/screenshot_study_tracker_box.png")
        print("Captured: web/screenshot_pomodoro_tracker.png & element screenshots")

        # 6. Test Quick Jump to Subject Practice
        print("\n--- 6. Testing Quick Jump from Exam Card to Practice ---")
        # Click Jump to VLDC Practice
        jump_vldc = page.locator('.btn-jump-subject-practice[data-subject="vldc"]')
        jump_vldc.click()
        page.wait_for_timeout(800)

        # Check that active tab is practice and subject is VLDC
        active_tab = page.locator(".tab-pane.active")
        assert active_tab.get_attribute("id") == "tab-practice", "Did not switch to tab-practice"
        brand_title = page.locator("#app-brand-title").inner_text()
        print(f"Active Brand Title after jump: {brand_title}")
        assert "VẬT LÝ ĐẠI CƯƠNG" in brand_title, "Did not switch to VLDC subject"

        print("\n=== ALL SCHEDULE, POMODORO & STUDY TRACKER TESTS PASSED 100%! ===")
        if errors:
            print(f"Encountered JS errors: {errors}")
            assert False, f"Errors: {errors}"
        else:
            print("Zero JavaScript console errors observed.")

        browser.close()

if __name__ == "__main__":
    run_tests()
