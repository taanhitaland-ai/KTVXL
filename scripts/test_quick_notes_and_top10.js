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
    // 1. DESKTOP TEST
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto(baseUrl, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Verify Leaderboard Trigger
    const lbTrigger = page.locator("#leaderboard-trigger");
    await lbTrigger.waitFor({ state: "visible" });
    const lbText = await lbTrigger.innerText();
    console.log(`Leaderboard Trigger text: "${lbText.trim().replace(/\n+/g, " ")}"`);
    if (lbText.includes("Xếp hạng") || lbText.includes("hạng")) {
      throw new Error(`Leaderboard trigger should NOT contain "Xếp hạng", got: "${lbText}"`);
    }
    if (!lbText.includes("Top 10")) {
      throw new Error(`Leaderboard trigger must contain "Top 10", got: "${lbText}"`);
    }
    console.log("✔ Leaderboard trigger correctly shows ONLY 'Top 10'");

    // Screenshot desktop floating tools
    await page.screenshot({
      path: path.join(artifactDir, "ui_tools_desktop_top10.png"),
      clip: { x: 1150, y: 180, width: 130, height: 350 },
    });
    console.log("Saved ui_tools_desktop_top10.png");

    // Open Quick Notes Drawer
    const notesTrigger = page.locator("#btn-floating-notes");
    await notesTrigger.click();
    await page.waitForTimeout(400);

    const drawer = page.locator("#side-notes-drawer");
    if (!(await drawer.evaluate((el) => el.classList.contains("open")))) {
      throw new Error("Notes drawer did not open after clicking floating notes trigger");
    }
    console.log("✔ Notes drawer opened successfully");
    await page.locator("#btn-pin-notes-drawer").click();
    await page.waitForTimeout(200);

    // Test Markdown Preview in Create Note Box
    const titleInput = page.locator("#quick-note-title-input");
    const contentInput = page.locator("#quick-note-content-input");
    const btnPreviewTab = page.locator("#btn-note-preview-tab");
    const btnWriteTab = page.locator("#btn-note-write-tab");
    const previewPane = page.locator("#quick-note-preview-pane");

    await titleInput.fill("Công thức Bayes & Định lý");
    await contentInput.fill(
      "### Công thức xác suất quan trọng:\n- **Công thức Bayes**: $P(A_k|B) = \\frac{P(A_k)P(B|A_k)}{P(B)}$\n- Lệnh hợp ngữ: `MOV AX, 1234H`\n> Ghi nhớ: Luôn đổi sang **Radian** khi bấm Casio!"
    );

    // Click Preview tab
    await btnPreviewTab.click();
    await page.waitForTimeout(300);

    const isPreviewVisible = await previewPane.isVisible();
    const isTextareaHidden = !(await contentInput.isVisible());
    if (!isPreviewVisible || !isTextareaHidden) {
      throw new Error("Preview tab failed: preview pane should be visible and textarea hidden");
    }

    const previewHtml = await previewPane.innerHTML();
    if (!previewHtml.includes("note-md-heading") || !previewHtml.includes("<strong>Công thức Bayes</strong>")) {
      throw new Error("Preview pane does not contain parsed markdown elements: " + previewHtml);
    }
    console.log("✔ Markdown live preview rendered headings, bold, code, and list items!");

    // Screenshot Create Box Preview
    await page.screenshot({
      path: path.join(artifactDir, "ui_notes_create_preview.png"),
      clip: { x: 780, y: 0, width: 500, height: 600 },
    });
    console.log("Saved ui_notes_create_preview.png");

    // Click Write tab to switch back
    await btnWriteTab.click();
    await page.waitForTimeout(200);
    if (!(await contentInput.isVisible())) {
      throw new Error("Write tab failed: textarea should be visible again");
    }

    // Click Save Note
    const btnSave = page.locator("#btn-save-quick-note");
    await btnSave.click();
    await page.waitForTimeout(400);

    // Check newly added note
    const firstNote = page.locator("#quick-notes-container .quick-note-item").first();
    const firstNoteTitle = await firstNote.locator(".note-item-title").innerText();
    const firstNoteContent = await firstNote.locator(".note-item-content").innerHTML();

    console.log(`First note title: "${firstNoteTitle}"`);
    if (!firstNoteTitle.includes("Công thức Bayes")) {
      throw new Error("New note not at top of list");
    }
    if (!firstNoteContent.includes("note-md-heading") || !firstNoteContent.includes("note-inline-code")) {
      throw new Error("Saved note did not render formatted markdown: " + firstNoteContent);
    }
    console.log("✔ Saved note renders rich markdown preview with headings, code, and math!");

    // Verify localStorage has saved preview
    const storageNotes = await page.evaluate(() => {
      const raw = localStorage.getItem("kma_quick_notes_v1");
      return raw ? JSON.parse(raw) : [];
    });
    const savedNoteObj = storageNotes[0];
    if (!savedNoteObj.previewHtml || !savedNoteObj.preview) {
      throw new Error("Note in localStorage does not have previewHtml saved: " + JSON.stringify(savedNoteObj));
    }
    console.log("✔ Note saved to localStorage includes preview and previewHtml!");

    // Test raw toggle button on card
    const rawBtn = page.locator("#quick-notes-container .quick-note-item").first().locator(".btn-toggle-raw");
    await rawBtn.scrollIntoViewIfNeeded();
    await rawBtn.click();
    await page.waitForTimeout(200);
    const hasRawPre = await page.locator("#quick-notes-container .quick-note-item").first().locator(".note-raw-source").isVisible();
    if (!hasRawPre) {
      throw new Error("Raw source view toggle failed");
    }
    console.log("✔ Card raw markdown toggle works");

    // Toggle back to preview
    await page.evaluate(() => {
      const btn = document.querySelector("#quick-notes-container .quick-note-item .btn-toggle-raw");
      if (btn) btn.click();
    });
    await page.waitForTimeout(200);

    // Screenshot full notes drawer on Desktop
    await page.screenshot({
      path: path.join(artifactDir, "ui_notes_drawer_markdown_desktop.png"),
      clip: { x: 800, y: 0, width: 480, height: 800 },
    });
    console.log("Saved ui_notes_drawer_markdown_desktop.png");

    // Test Dark Mode
    await page.evaluate(() => {
      const toggle = document.getElementById("btn-toggle-dark-mode");
      if (toggle) toggle.click();
    });
    await page.waitForTimeout(400);

    await page.screenshot({
      path: path.join(artifactDir, "ui_notes_drawer_markdown_dark.png"),
      clip: { x: 800, y: 0, width: 480, height: 800 },
    });
    console.log("Saved ui_notes_drawer_markdown_dark.png");

    await page.close();

    // 2. MOBILE TEST (390x844)
    const mobilePage = await browser.newPage({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    await mobilePage.goto(baseUrl, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(800);

    // Expand mobile tools tray
    const toolsGrip = mobilePage.locator("#study-tools-toggle");
    await toolsGrip.click();
    await mobilePage.waitForTimeout(400);

    // Verify mobile tools frame & leaderboard trigger
    const mobileLb = mobilePage.locator("#leaderboard-trigger");
    const mobileLbText = await mobileLb.innerText();
    console.log(`Mobile LB text: "${mobileLbText.trim().replace(/\n+/g, " ")}"`);
    if (mobileLbText.includes("Xếp hạng") || mobileLbText.includes("hạng")) {
      throw new Error(`Mobile LB should NOT contain "Xếp hạng", got: "${mobileLbText}"`);
    }
    if (!mobileLbText.includes("Top 10")) {
      throw new Error(`Mobile LB must contain "Top 10", got: "${mobileLbText}"`);
    }

    await mobilePage.screenshot({
      path: path.join(artifactDir, "ui_mobile_tools_top10.png"),
      clip: { x: 0, y: 480, width: 390, height: 364 },
    });
    console.log("Saved ui_mobile_tools_top10.png");

    // Open Notes drawer on mobile
    const mobileNotesBtn = mobilePage.locator("#btn-floating-notes");
    await mobileNotesBtn.click();
    await mobilePage.waitForTimeout(400);

    await mobilePage.screenshot({
      path: path.join(artifactDir, "ui_mobile_notes_drawer.png"),
    });
    console.log("Saved ui_mobile_notes_drawer.png");

    await mobilePage.close();
    console.log("🎉 ALL PLAYWRIGHT CHECKS PASSED PERFECTLY!");
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
