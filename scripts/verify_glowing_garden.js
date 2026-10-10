const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

function createServer(rootDir) {
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
  };

  return http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '/KTVXL' || reqPath === '/KTVXL/') {
      reqPath = '/index.html';
    }
    if (reqPath.startsWith('/KTVXL/')) {
      reqPath = reqPath.slice('/KTVXL'.length);
    }
    const filePath = path.join(rootDir, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });
}

async function run() {
  const rootDir = path.resolve(__dirname, '../web');
  const server = createServer(rootDir);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}/index.html`;
  console.log(`Test server running at ${baseUrl}`);

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const artifactDir = '/home/kali/.gemini/antigravity-cli/brain/162b2260-8bee-42d1-b676-e61ed8c0da0e';

  const testState = {
    v: 1,
    totalSeconds: 3600,
    continuous: { seconds: 1800, endMs: Date.now(), rare: true, epic: false },
    seeds: { oak: 3, maple: 2, cherry: 1, bamboo: 1, galaxy: 1 },
    plots: [
      { seed: 'oak', seconds: 3600, createdAt: Date.now() - 3600000, glowing: true },
      { seed: 'cherry', seconds: 1800, createdAt: Date.now() - 1800000, glowing: true },
      { seed: 'maple', seconds: 2400, createdAt: Date.now() - 2400000, glowing: false },
      null, null, null
    ],
    items: {
      coal: 8, stone: 4, copper: 5, tin: 3, azure: 2, rose: 2, sun: 1, moss: 1, frost: 1, cosmos: 0,
      coal_glowing: 1, copper_glowing: 1, azure_glowing: 2, sun_glowing: 1, frost_glowing: 1
    },
    layout: [
      'frost_glowing', 'sun_glowing', 'azure_glowing', 'copper', 'coal',
      'azure', 'stone', null, 'tin', 'rose',
      null, null, 'moss', 'copper_glowing', 'coal_glowing'
    ],
    misses: 2,
    harvests: 5,
    rareAwards: 2,
    unlocked: false,
    daily: { '2026-10-10': 3 },
    cursors: {},
    lastReward: {
      item: 'frost_glowing',
      seed: 'oak',
      guaranteed: false,
      harvest: 6,
      isNew: true,
      glowing: true,
      treeGlowing: true
    }
  };

  try {
    // 1. DESKTOP TEST
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await context.newPage();

    // Intercept cloud_config.js to provide preview configuration
    await context.route('**/cloud_config.js*', route => {
      route.fulfill({
        contentType: 'application/javascript',
        body: 'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only",gardenEnabled:true,storageNamespace:"kma_test_garden:"};window.KMA_GARDEN_PREVIEW=true;'
      });
    });

    // Setup preview configuration before navigation
    await page.addInitScript((state) => {
      window.KMA_GARDEN_PREVIEW = true;
      window.KMA_CLOUD_CONFIG = {
        url: 'https://fixture.invalid',
        gardenEnabled: true,
        storageNamespace: 'kma_test_garden:'
      };
      localStorage.setItem('kma_test_garden:garden:guest', JSON.stringify(state));
      localStorage.setItem('kma_test_garden:garden:test_user', JSON.stringify(state));
      localStorage.setItem('kma_account_v1', JSON.stringify({
        user: { id: 'test_user', email: 'test@example.com' },
        profile: { nickname: 'Học viên KMA' }
      }));
    }, testState);

    console.log('Navigating to app...');
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    // Provide mocked account identity and dispatch update
    await page.evaluate((testState) => {
      window.KMA_ACCOUNT = {
        getLearningIdentity: () => ({ user: 'guest', access: 'ready' }),
        gardenRequest: async (action, args) => {
          if (action === 'snapshot') return { revision: 1, state: testState };
          if (action === 'harvest') {
            return {
              revision: 2,
              state: { ...testState, plots: [null, testState.plots[1], testState.plots[2], null, null, null] },
              reward: testState.lastReward
            };
          }
          if (action === 'layout') {
            return { revision: 3, state: { ...testState, layout: args.p_layout } };
          }
          return { revision: 1, state: testState };
        },
        refreshRanking: () => {}
      };
      window.dispatchEvent(new CustomEvent('kma:cloud-updated'));
    }, testState);

    // Open side planner drawer and switch to garden tab
    console.log('Opening Study Garden drawer...');
    await page.evaluate(() => {
      const drawer = document.getElementById('side-planner-drawer');
      if (drawer) drawer.classList.add('open');
      const tabs = document.querySelectorAll('.side-tab-btn');
      tabs.forEach(t => t.classList.remove('active'));
      const contents = document.querySelectorAll('.side-tab-content');
      contents.forEach(c => c.classList.remove('active'));
      const pomoBtn = document.getElementById('side-tab-pomo-btn') || document.querySelector('[data-tab="side-tab-pomo"]');
      if (pomoBtn) pomoBtn.classList.add('active');
      const pomoContent = document.getElementById('side-tab-pomo');
      if (pomoContent) pomoContent.classList.add('active');
    });

    await page.waitForSelector('.study-garden', { timeout: 5000 });
    await page.waitForSelector('.garden-plot-glowing', { timeout: 5000 });
    console.log('✅ Study Garden rendered with glowing plot!');

    // Screenshot 1: Garden with glowing tree and ripe glowing tree
    const gardenEl = page.locator('#study-garden');
    await gardenEl.screenshot({ path: path.join(artifactDir, 'glowing_garden_plots.png') });
    console.log('📸 Captured glowing_garden_plots.png');

    // Screenshot 2: Harvest Modal for glowing item
    console.log('Triggering harvest on glowing tree...');
    const harvestBtn = page.locator('[data-garden-harvest="0"]');
    await harvestBtn.click();
    await page.waitForSelector('#garden-harvest-dialog[open]', { timeout: 5000 });
    await page.waitForTimeout(400);

    const harvestDialog = page.locator('#garden-harvest-dialog');
    await harvestDialog.screenshot({ path: path.join(artifactDir, 'glowing_harvest_modal.png') });
    console.log('📸 Captured glowing_harvest_modal.png');

    // Click "Đặt vào trưng bày" to open collection dialog
    console.log('Opening Collection & Showcase dialog...');
    const placeBtn = harvestDialog.getByRole('button', { name: 'Đặt vào trưng bày' });
    await placeBtn.click();
    await page.waitForSelector('#garden-collection-dialog[open]', { timeout: 5000 });
    await page.waitForTimeout(400);

    // Screenshot 3: Collection Dialog
    const collectionDialog = page.locator('#garden-collection-dialog');
    await collectionDialog.screenshot({ path: path.join(artifactDir, 'glowing_collection_dialog.png') });
    console.log('📸 Captured glowing_collection_dialog.png');

    // Screenshot 4: Filter tab "✨ Phát sáng"
    console.log('Clicking filter tab: ✨ Phát sáng...');
    const glowFilter = collectionDialog.locator('[data-garden-filter="glowing"]');
    await glowFilter.click();
    await page.waitForTimeout(300);
    await collectionDialog.screenshot({ path: path.join(artifactDir, 'glowing_filter_active.png') });
    console.log('📸 Captured glowing_filter_active.png');

    // Close collection dialog
    await collectionDialog.locator('.garden-close').click();
    await page.waitForTimeout(300);

    // Screenshot 5: Dark Mode
    console.log('Testing Dark Mode...');
    await page.evaluate(() => document.body.classList.add('dark-mode'));
    await page.waitForTimeout(300);
    await gardenEl.screenshot({ path: path.join(artifactDir, 'glowing_dark_mode.png') });
    console.log('📸 Captured glowing_dark_mode.png');

    // Screenshot 6: Mobile View
    console.log('Testing Mobile View...');
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true
    });
    await mobileContext.route('**/cloud_config.js*', route => {
      route.fulfill({
        contentType: 'application/javascript',
        body: 'window.KMA_CLOUD_CONFIG={url:"https://fixture.invalid",publishableKey:"fixture-only",gardenEnabled:true,storageNamespace:"kma_test_garden:"};window.KMA_GARDEN_PREVIEW=true;'
      });
    });
    const mobilePage = await mobileContext.newPage();

    await mobilePage.addInitScript((state) => {
      window.KMA_GARDEN_PREVIEW = true;
      window.KMA_CLOUD_CONFIG = {
        url: 'https://fixture.invalid',
        gardenEnabled: true,
        storageNamespace: 'kma_test_garden:'
      };
      localStorage.setItem('kma_test_garden:garden:guest', JSON.stringify(state));
      localStorage.setItem('kma_test_garden:garden:test_user', JSON.stringify(state));
      localStorage.setItem('kma_account_v1', JSON.stringify({
        user: { id: 'test_user', email: 'test@example.com' },
        profile: { nickname: 'Học viên KMA' }
      }));
    }, testState);

    await mobilePage.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await mobilePage.waitForTimeout(600);

    await mobilePage.evaluate((state) => {
      window.KMA_ACCOUNT = {
        getLearningIdentity: () => ({ user: 'guest', access: 'ready' }),
        gardenRequest: async () => ({ revision: 1, state }),
        refreshRanking: () => {}
      };
      window.dispatchEvent(new CustomEvent('kma:cloud-updated'));
    }, testState);

    await mobilePage.evaluate(() => {
      const drawer = document.getElementById('side-planner-drawer');
      if (drawer) drawer.classList.add('open');
      const tabs = document.querySelectorAll('.side-tab-btn');
      tabs.forEach(t => t.classList.remove('active'));
      const contents = document.querySelectorAll('.side-tab-content');
      contents.forEach(c => c.classList.remove('active'));
      const pomoBtn = document.getElementById('side-tab-pomo-btn') || document.querySelector('[data-tab="side-tab-pomo"]');
      if (pomoBtn) pomoBtn.classList.add('active');
      const pomoContent = document.getElementById('side-tab-pomo');
      if (pomoContent) pomoContent.classList.add('active');
    });

    await mobilePage.waitForSelector('.study-garden', { timeout: 5000 });
    const mobileGarden = mobilePage.locator('#study-garden');
    await mobileGarden.screenshot({ path: path.join(artifactDir, 'glowing_mobile.png') });
    console.log('📸 Captured glowing_mobile.png');

    console.log('🎉 All Playwright verification screenshots completed successfully!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
