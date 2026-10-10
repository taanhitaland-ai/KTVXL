const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

function createServer(rootDir) {
  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
  };

  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath === "/" || reqPath === "/KTVXL" || reqPath === "/KTVXL/") {
      reqPath = "/index.html";
    }
    if (reqPath.startsWith("/KTVXL/")) {
      reqPath = reqPath.slice("/KTVXL".length);
    }
    const filePath = path.join(rootDir, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function run() {
  const rootDir = path.resolve(__dirname, "../web");
  const server = createServer(rootDir);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/`;
  console.log(`Test server running at ${baseUrl}`);

  const browser = await chromium.launch({ headless: true });
  const artifactDir = "/home/kali/.gemini/antigravity-cli/brain/162b2260-8bee-42d1-b676-e61ed8c0da0e";

  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });

    // Handle confirms automatically
    page.on("dialog", async (dialog) => {
      console.log(`Dialog message: "${dialog.message()}" -> accepting`);
      await dialog.accept();
    });

    await page.goto(baseUrl, { waitUntil: "networkidle" });
    console.log("Page loaded successfully.");

    // Step 1: Switch to Exam Tab
    await page.click("#btn-tab-exam");
    await page.waitForSelector("#exam-setup-view", { state: "visible" });
    console.log("Switched to Exam Tab.");

    // Check empty state in Exam History
    const initialBadge = await page.textContent("#exam-history-count-badge");
    console.log(`Initial history count badge: ${initialBadge.trim()}`);
    if (!initialBadge.includes("0 bài")) {
      throw new Error(`Expected 0 bài, got: ${initialBadge}`);
    }

    // Step 2: Start Mock Exam
    await page.click("#btn-start-exam");
    await page.waitForSelector("#exam-active-view", { state: "visible" });
    console.log("Started mock exam.");

    // Step 3: Answer questions (first 4 questions)
    // Find options in Question 1, 2, 3, 4
    const cards = await page.$$("#exam-questions-list .question-card");
    console.log(`Total exam question cards rendered: ${cards.length}`);

    // Let's answer Q1: choose first option
    const q1Opts = await cards[0].$$(".option-btn");
    if (q1Opts.length > 0) {
      await q1Opts[0].click();
      console.log("Answered Q1.");
    }

    // Q2: choose option B
    const q2Opts = await cards[1].$$(".option-btn");
    if (q2Opts.length > 1) {
      await q2Opts[1].click();
      console.log("Answered Q2.");
    }

    // Q3: choose option C
    const q3Opts = await cards[2].$$(".option-btn");
    if (q3Opts.length > 2) {
      await q3Opts[2].click();
      console.log("Answered Q3.");
    }

    // Q4: choose option D
    const q4Opts = await cards[3].$$(".option-btn");
    if (q4Opts.length > 3) {
      await q4Opts[3].click();
      console.log("Answered Q4.");
    }

    // Step 4: Submit Exam
    await page.click("#btn-submit-exam");
    await page.waitForSelector("#exam-result-modal.active", { state: "visible" });
    console.log("Exam submitted, result modal is visible.");

    // Verify Result Modal
    const modalScore = await page.textContent("#modal-score-val");
    const saveNotice = await page.textContent("#modal-save-notice");
    const wrongCountText = await page.textContent("#modal-wrong-count");
    console.log(`Modal Score: ${modalScore}, Wrong Count: ${wrongCountText}, Notice: ${saveNotice.trim()}`);

    if (!saveNotice.includes("Lịch sử thi thử")) {
      throw new Error("Save notice does not mention Lịch sử thi thử");
    }

    // Capture screenshot of result modal
    await page.screenshot({
      path: path.join(artifactDir, "exam_result_modal.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_result_modal.png");

    // Step 5: Click "❌ XEM CÂU LÀM SAI"
    await page.click("#btn-review-wrong-exam");
    await page.waitForSelector("#exam-result-modal.active", { state: "detached" });
    console.log("Clicked review wrong exam button, modal closed.");

    // Verify Review Mode and Wrong Question Marking
    const wrongCards = await page.$$("#exam-questions-list .question-card.exam-card-wrong");
    console.log(`Number of wrong question cards: ${wrongCards.length}`);

    const wrongPaletteBtns = await page.$$(".palette-btn.status-wrong");
    console.log(`Number of palette buttons marked status-wrong (red): ${wrongPaletteBtns.length}`);

    if (wrongCards.length === 0 || wrongPaletteBtns.length === 0) {
      throw new Error("Expected at least 1 wrong card and wrong palette button!");
    }

    // Check that wrong cards have the badge "❌ CÂU SAI"
    const firstWrongBadge = await wrongCards[0].$(".exam-review-status-badge.badge-wrong");
    if (!firstWrongBadge) {
      throw new Error("Wrong card missing badge-wrong!");
    }
    const badgeText = await firstWrongBadge.textContent();
    console.log(`Wrong badge text: ${badgeText.trim()}`);

    // Check that review explanation row is present
    const revRow = await wrongCards[0].$(".exam-review-row");
    if (!revRow) {
      throw new Error("Missing exam-review-row in wrong card!");
    }
    console.log("Exam review row verified with solution & details.");

    // Take screenshot of review mode filtered to wrong questions
    await page.screenshot({
      path: path.join(artifactDir, "exam_review_wrong_filtered.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_review_wrong_filtered.png");

    // Step 6: Test Review Filter: Switch to "Tất cả"
    await page.click('.exam-review-filter-btn[data-filter="all"]');
    await page.waitForTimeout(300);

    const visibleCards = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("#exam-questions-list .question-card"))
        .filter(c => c.style.display !== "none").length;
    });
    console.log(`Visible question cards under "Tất cả" filter: ${visibleCards}`);
    if (visibleCards !== 40) {
      throw new Error(`Expected all 40 cards visible, got ${visibleCards}`);
    }

    await page.screenshot({
      path: path.join(artifactDir, "exam_review_all.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_review_all.png");

    // Step 7: Return to Setup View & Verify Exam History
    await page.click("#btn-back-exam");
    await page.waitForSelector("#exam-setup-view", { state: "visible" });
    console.log("Returned to exam setup view.");

    const historyItems = await page.$$(".exam-history-item");
    console.log(`Number of exam history items: ${historyItems.length}`);
    if (historyItems.length !== 1) {
      throw new Error(`Expected exactly 1 history item, found: ${historyItems.length}`);
    }

    const histScore = await historyItems[0].$(".exam-history-score");
    const histScoreText = await histScore.textContent();
    console.log(`History item score: ${histScoreText.trim()}`);

    // Screenshot of exam history on desktop
    await page.locator("#exam-history-container").scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({
      path: path.join(artifactDir, "exam_history_desktop.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_history_desktop.png");

    // Step 8: Click "🔍 Xem lại bài làm" from History List
    await historyItems[0].$(".btn-history-review").then(btn => btn.click());
    await page.waitForSelector("#exam-active-view", { state: "visible" });
    console.log("Reopened exam review directly from history item!");

    const reloadedWrongCards = await page.$$("#exam-questions-list .question-card.exam-card-wrong");
    console.log(`Reloaded wrong cards in review: ${reloadedWrongCards.length}`);
    if (reloadedWrongCards.length === 0) {
      throw new Error("Failed to reload wrong cards from history attempt!");
    }

    // Step 9: Test Dark Mode
    await page.evaluate(() => {
      document.body.classList.add("dark-mode");
    });
    await page.waitForTimeout(200);

    await page.screenshot({
      path: path.join(artifactDir, "exam_review_dark_mode.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_review_dark_mode.png");

    // Step 10: Test Mobile Viewport
    await page.click("#btn-back-exam");
    await page.waitForSelector("#exam-setup-view", { state: "visible" });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator("#exam-history-container").scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: path.join(artifactDir, "exam_history_mobile.png"),
      fullPage: false,
    });
    console.log("Saved artifact: exam_history_mobile.png");

    console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY! 100%");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
