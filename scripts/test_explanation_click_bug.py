import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = "/home/kali/.gemini/antigravity-cli/brain/162b2260-8bee-42d1-b676-e61ed8c0da0e"
HTML_PATH = os.path.abspath("web/index.html")

async def test_explanation_behavior():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1400, "height": 900})
        page = await context.new_page()

        print(f"Loading {HTML_PATH}...")
        await page.goto(f"file://{HTML_PATH}")
        await page.wait_for_load_state("networkidle")

        # 1. Verify initial placeholder
        panel_content = page.locator("#panel-content")
        initial_text = await panel_content.inner_text()
        print("Initial panel text includes placeholder:", "Xem lời giải & mẹo Casio" in initial_text)
        assert "Xem lời giải & mẹo Casio" in initial_text

        # 2. Click on the question card body (not button/input)
        first_card = page.locator(".question-card").first
        q_text = first_card.locator(".q-title")
        print("Clicking question card body (q-title)...")
        await q_text.click()
        await page.wait_for_timeout(300)

        # Verify card is highlighted
        card_class = await first_card.get_attribute("class")
        assert "active-selected" in card_class, "Card should be highlighted when clicked"

        # Verify explanation is NOT shown (still placeholder)
        panel_text_after_card_click = await panel_content.inner_text()
        print("After clicking card, explanation opened?:", "Lời Giải Chi Tiết" in panel_text_after_card_click)
        assert "Lời Giải Chi Tiết" not in panel_text_after_card_click, "Clicking card must NOT open explanation!"
        assert "Xem lời giải & mẹo Casio" in panel_text_after_card_click

        # Capture screenshot 1
        shot1 = os.path.join(ARTIFACT_DIR, "screenshot_click_card_no_explanation.png")
        await page.screenshot(path=shot1)
        print(f"Saved {shot1}")

        # 3. Select an option (Option A)
        first_option = first_card.locator(".option-btn").first
        print("Clicking Option A...")
        await first_option.click()
        await page.wait_for_timeout(300)

        # Verify option selected
        option_class = await first_option.get_attribute("class")
        assert "selected-correct" in option_class or "selected-wrong" in option_class

        # Verify explanation still NOT auto-opened
        panel_text_after_option_click = await panel_content.inner_text()
        print("After selecting option, explanation opened?:", "Lời Giải Chi Tiết" in panel_text_after_option_click)
        assert "Lời Giải Chi Tiết" not in panel_text_after_option_click, "Selecting option must NOT auto-open explanation!"

        # Capture screenshot 2
        shot2 = os.path.join(ARTIFACT_DIR, "screenshot_select_option_no_explanation.png")
        await page.screenshot(path=shot2)
        print(f"Saved {shot2}")

        # 4. Click the 'Xem Lời Giải & Mẹo Casio' button
        exp_btn = first_card.locator(".q-action-row button").first
        btn_text = await exp_btn.inner_text()
        print(f"Clicking button: '{btn_text}'...")
        await exp_btn.click()
        await page.wait_for_timeout(400)

        # Verify explanation IS NOW shown!
        panel_text_after_btn = await panel_content.inner_text()
        has_exp = "LỜI GIẢI CHI TIẾT" in panel_text_after_btn.upper()
        print("After clicking button, explanation opened?:", has_exp)
        assert has_exp, "Clicking 'Xem Lời Giải' button MUST open explanation!"

        title_el = await page.locator("#panel-q-title").inner_text()
        print("Panel title:", title_el)
        assert "LỜI GIẢI • CÂU 1" in title_el.upper()

        # Capture screenshot 3
        shot3 = os.path.join(ARTIFACT_DIR, "screenshot_click_btn_explanation_shown.png")
        await page.screenshot(path=shot3)
        print(f"Saved {shot3}")

        print("All test assertions PASSED successfully!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_explanation_behavior())
