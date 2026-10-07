import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = "/home/kali/.gemini/antigravity-cli/brain/162b2260-8bee-42d1-b676-e61ed8c0da0e"
HTML_PATH = os.path.abspath("web/index.html")

async def test_music():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1400, "height": 900})
        page = await context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)

        print(f"Loading {HTML_PATH}...")
        await page.goto(f"file://{HTML_PATH}")
        await page.wait_for_load_state("networkidle")

        # Check initial state of music video dock
        dock = page.locator("#music-video-dock")
        count = await dock.count()
        assert count == 1, "music-video-dock must exist in DOM"

        # Evaluate visibility and position
        is_in_viewport = await page.evaluate("""() => {
            const el = document.getElementById('music-video-dock');
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            // Check if rect intersects viewport
            return (
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.left < window.innerWidth &&
                rect.right > 0
            );
        }""")
        print(f"Initial dock in viewport: {is_in_viewport}")
        assert not is_in_viewport, "Dock must NOT be in viewport initially!"

        # Open the side drawer via JS API and click '🎧 Nhạc chill'
        await page.evaluate("() => window.KMA_SCHEDULE_POMODORO?.toggleSideDrawer(true)")
        await page.wait_for_timeout(500)

        music_tab_btn = page.locator('[data-drawer-tab="side-tab-music"]')
        await music_tab_btn.click()
        await page.wait_for_timeout(300)

        # Click demo button to add tracks
        demo_btn = page.locator("#music-add-3107")
        if await demo_btn.is_visible():
            await demo_btn.click()
            await page.wait_for_timeout(400)
            print("Added demo tracks.")

        # Check track list
        tracks = await page.locator(".music-track").count()
        print(f"Track count: {tracks}")
        assert tracks > 0, "Tracks should be present"

        # Capture screenshot of music panel
        panel_shot = os.path.join(ARTIFACT_DIR, "screenshot_music_panel.png")
        await page.screenshot(path=panel_shot)
        print(f"Saved {panel_shot}")

        # Click play button on first track
        first_play_btn = page.locator('.music-track .music-track-play').first
        await first_play_btn.click()
        await page.wait_for_timeout(1000)

        # Check again if music-video-dock is in viewport or visible
        is_in_viewport_after_play = await page.evaluate("""() => {
            const el = document.getElementById('music-video-dock');
            if (!el) return false;
            const style = window.getComputedStyle(el);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return false;
            }
            const rect = el.getBoundingClientRect();
            return (
                rect.top < window.innerHeight &&
                rect.bottom > 0 &&
                rect.left < window.innerWidth &&
                rect.right > 0
            );
        }""")
        print(f"After play, dock in viewport: {is_in_viewport_after_play}")
        assert not is_in_viewport_after_play, "Dock must NOT be in viewport even after playing!"

        # Check body class
        has_open_class = await page.evaluate("() => document.body.classList.contains('music-video-open')")
        print(f"Body has music-video-open class: {has_open_class}")
        assert not has_open_class, "Body should NOT have music-video-open class"

        # Check status text
        status_text = await page.locator("#music-status").inner_text()
        print(f"Music status: {status_text}")

        # Capture screenshot while playing to prove no video/dock on screen
        playing_shot = os.path.join(ARTIFACT_DIR, "screenshot_music_playing_nobox.png")
        await page.screenshot(path=playing_shot)
        print(f"Saved {playing_shot}")

        # Close side drawer to view main content while music is active
        close_btn = page.locator("#side-drawer-close")
        if await close_btn.is_visible():
            await close_btn.click()
            await page.wait_for_timeout(300)

        main_shot = os.path.join(ARTIFACT_DIR, "screenshot_main_screen_music_background.png")
        await page.screenshot(path=main_shot)
        print(f"Saved {main_shot}")

        print("All music tests PASSED!")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_music())
