import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = "/home/kali/.gemini/antigravity-cli/brain/162b2260-8bee-42d1-b676-e61ed8c0da0e"
HTML_PATH = os.path.abspath("web/index.html")

async def test_stress_dice():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1400, "height": 960})
        page = await context.new_page()

        print(f"Loading {HTML_PATH}...")
        await page.goto(f"file://{HTML_PATH}")
        await page.wait_for_load_state("networkidle")

        stress_box = page.locator("#stress-relief-box")
        assert await stress_box.count() == 1, "Stress relief box must exist in DOM"
        assert await stress_box.is_visible(), "Stress relief box must be visible"

        # Initial screenshot
        init_shot = os.path.join(ARTIFACT_DIR, "screenshot_dice_initial.png")
        await page.screenshot(path=init_shot)
        print(f"Saved {init_shot}")

        # Click Roll button
        btn_roll = page.locator("#btn-roll-dice")
        print("Clicking Roll button...")
        await btn_roll.click()

        # Capture while rolling (after 400ms)
        await page.wait_for_timeout(400)
        rolling_shot = os.path.join(ARTIFACT_DIR, "screenshot_dice_rolling.png")
        await page.screenshot(path=rolling_shot)
        print(f"Saved {rolling_shot}")

        # Wait for roll to settle (1.2s total)
        await page.wait_for_timeout(900)

        # Check score text
        score_badge = page.locator("#stress-score")
        score_text = await score_badge.inner_text()
        quote_text = await page.locator("#stress-quote").inner_text()
        print(f"Result score: {score_text}")
        print(f"Result quote: {quote_text}")
        assert "điểm" in score_text, "Score badge should show points"
        assert len(quote_text) > 5, "Quote should contain a motivational blessing"

        # Settle screenshot
        result_shot = os.path.join(ARTIFACT_DIR, "screenshot_dice_result.png")
        await page.screenshot(path=result_shot)
        print(f"Saved {result_shot}")

        # Toggle to 1 dice
        btn_count = page.locator("#btn-toggle-dice-dicecount")
        await btn_count.click()
        await page.wait_for_timeout(200)

        # Roll single dice
        await btn_roll.click()
        await page.wait_for_timeout(1300)
        score_1_text = await score_badge.inner_text()
        print(f"Single dice result: {score_1_text}")
        shot_1_dice = os.path.join(ARTIFACT_DIR, "screenshot_dice_1_cube.png")
        await page.screenshot(path=shot_1_dice)
        print(f"Saved {shot_1_dice}")

        # Toggle Dark Mode
        btn_theme = page.locator("#btn-toggle-dark-mode")
        if await btn_theme.is_visible():
            await btn_theme.click()
            await page.wait_for_timeout(400)
            shot_dark = os.path.join(ARTIFACT_DIR, "screenshot_dice_dark_mode.png")
            await page.screenshot(path=shot_dark)
            print(f"Saved {shot_dark}")

        print("All stress dice tests PASSED!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_stress_dice())
