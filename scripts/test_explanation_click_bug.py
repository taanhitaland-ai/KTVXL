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

        panel_content = page.locator("#panel-content")
        has_sec_exp_initial = await page.locator("#panel-content .panel-section.sec-exp").count() > 0
        print("Initial has sec-exp (explanation section)?:", has_sec_exp_initial)
        assert not has_sec_exp_initial, "Initially, explanation sections should not exist (placeholder only)"

        # 1. Click on the question card body (q-title)
        first_card = page.locator(".question-card").first
        q_text = first_card.locator(".q-title")
        print("Clicking question card body (q-title)...")
        await q_text.click()
        await page.wait_for_timeout(300)

        # Verify card is highlighted
        card_class = await first_card.get_attribute("class")
        assert "active-selected" in card_class, "Card should be highlighted when clicked"

        # Verify explanation is NOT shown on card click (still no .sec-exp)
        has_sec_exp_on_card = await page.locator("#panel-content .panel-section.sec-exp").count() > 0
        print("After clicking card, explanation opened?:", has_sec_exp_on_card)
        assert not has_sec_exp_on_card, "Clicking card body must NOT open explanation!"

        # 2. Select an option (Option A) - SHOULD NOW OPEN EXPLANATION (User requested)
        first_option = first_card.locator(".option-btn").first
        print("Clicking Option A on Question 1...")
        await first_option.click()
        await page.wait_for_timeout(400)

        # Verify option selected
        option_class = await first_option.get_attribute("class")
        assert "selected-correct" in option_class or "selected-wrong" in option_class

        # Verify explanation IS NOW shown after selecting an option!
        has_sec_exp_after_opt = await page.locator("#panel-content .panel-section.sec-exp").count() > 0
        print("After selecting option, explanation opened?:", has_sec_exp_after_opt)
        assert has_sec_exp_after_opt, "Selecting option MUST now open explanation!"

        title_el = await page.locator("#panel-q-title").inner_text()
        print("Panel title:", title_el)
        assert "LỜI GIẢI • CÂU 1" in title_el.upper()

        # Capture screenshot
        shot1 = os.path.join(ARTIFACT_DIR, "screenshot_select_option_explanation_shown.png")
        await page.screenshot(path=shot1)
        print(f"Saved {shot1}")

        # 3. Test on another card (Question 2) - Click WRONG option to test "kể cả chọn đúng hay sai"
        second_card = page.locator(".question-card").nth(1)
        opt_b = second_card.locator(".option-btn").nth(1)
        print("Clicking Option B on Question 2 (wrong answer test)...")
        await opt_b.click()
        await page.wait_for_timeout(400)

        has_sec_exp_q2 = await page.locator("#panel-content .panel-section.sec-exp").count() > 0
        print("After selecting option on Q2, explanation opened?:", has_sec_exp_q2)
        assert has_sec_exp_q2, "Selecting option on Q2 MUST open explanation!"

        title_q2 = await page.locator("#panel-q-title").inner_text()
        print("Q2 Panel title:", title_q2)
        assert "LỜI GIẢI • CÂU 2" in title_q2.upper()

        shot_q2 = os.path.join(ARTIFACT_DIR, "screenshot_q2_option_explanation_shown.png")
        await page.screenshot(path=shot_q2)
        print(f"Saved {shot_q2}")

        print("All explanation behavior assertions PASSED successfully!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_explanation_behavior())
