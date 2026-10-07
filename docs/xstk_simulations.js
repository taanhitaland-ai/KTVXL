/**
 * xstk_simulations.js
 * Bộ 4 Mô Phỏng Xác Suất Thống Kê Trực Quan (Interactive Probability & Statistics Lab)
 * Phong cách Neobrutalism, 60 FPS Canvas Animation, Real-time Controls & Exact Math
 */

(function () {
  'use strict';

  // Helper: erf (error function) for exact standard normal CDF Φ(z)
  function erf(x) {
    // Abramowitz and Stegun formula 7.1.26 approximation (max error < 1.5e-7)
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x);
    const t = 1.0 / (1.0 + p * absX);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
    return sign * y;
  }

  // Standard Normal CDF: Φ(z) = 0.5 * (1 + erf(z / sqrt(2)))
  function normalCDF(z) {
    return 0.5 * (1.0 + erf(z / Math.SQRT2));
  }

  // Box-Muller transform for generating standard normal random numbers N(0, 1)
  function randomNormal(mean = 0, std = 1) {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return mean + z0 * std;
  }

  // Simulation State
  const XSTK_SIM_STATE = {
    activeModule: 'lln', // 'lln', 'galton', 'normal', 'ci'
    animId: null,

    // Module 1: Law of Large Numbers
    lln: {
      mode: 'coin', // 'coin', 'dice', 'custom'
      p: 0.5,
      trials: 0,
      successes: 0,
      history: [], // [{ n, fn }]
      running: false,
      speed: 1, // trials per frame
      coinAngle: 0,
      lastOutcome: null
    },

    // Module 2: Galton Board
    galton: {
      rows: 8,
      bins: [], // count in each bin
      balls: [], // active falling balls
      totalBalls: 0,
      running: false,
      dropRate: 2, // balls per sec or per tick
      pegSpacingX: 36,
      pegSpacingY: 26,
      startX: 340,
      startY: 40
    },

    // Module 3: Normal Distribution Bell Curve
    normal: {
      mu: 0,
      sigma: 1.0,
      a: -1.0,
      b: 1.0
    },

    // Module 4: Confidence Interval 95%
    ci: {
      trueMu: 50,
      trueSigma: 10,
      n: 30,
      confidenceLevel: 0.95, // 0.90, 0.95, 0.99
      intervals: [], // [{ xbar, lower, upper, covered }]
      running: false,
      maxDisplay: 45
    }
  };

  // =========================================================================
  // INITIALIZATION
  // =========================================================================
  function initXstkLab() {
    const container = document.getElementById('lab-container-xstk');
    if (!container) return;

    setupNavTabs();
    setupLLNControls();
    setupGaltonControls();
    setupNormalControls();
    setupCIControls();

    // Start Animation Loop
    if (!XSTK_SIM_STATE.animId) {
      runAnimationLoop();
    }
  }

  // Switch Module Tabs
  function setupNavTabs() {
    const btns = document.querySelectorAll('.xstk-sim-nav-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetSim = btn.getAttribute('data-sim');
        XSTK_SIM_STATE.activeModule = targetSim;

        document.querySelectorAll('.xstk-sim-view-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(`xstk-pane-${targetSim}`);
        if (pane) pane.classList.add('active');
      });
    });
  }

  // Main 60 FPS Animation Loop
  function runAnimationLoop() {
    const active = XSTK_SIM_STATE.activeModule;

    if (active === 'lln') {
      updateAndDrawLLN();
    } else if (active === 'galton') {
      updateAndDrawGalton();
    } else if (active === 'normal') {
      drawNormal();
    } else if (active === 'ci') {
      updateAndDrawCI();
    }

    XSTK_SIM_STATE.animId = requestAnimationFrame(runAnimationLoop);
  }

  // =========================================================================
  // MODULE 1: LAW OF LARGE NUMBERS (LLN)
  // =========================================================================
  function setupLLNControls() {
    const cv = document.getElementById('cv-xstk-lln');
    if (!cv) return;

    const btnPlay = document.getElementById('btn-lln-play');
    const btnStep1 = document.getElementById('btn-lln-step1');
    const btnStep100 = document.getElementById('btn-lln-step100');
    const btnStep1000 = document.getElementById('btn-lln-step1000');
    const btnReset = document.getElementById('btn-lln-reset');
    const selMode = document.getElementById('sel-lln-mode');
    const slP = document.getElementById('sl-lln-p');
    const slSpeed = document.getElementById('sl-lln-speed');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        XSTK_SIM_STATE.lln.running = !XSTK_SIM_STATE.lln.running;
        btnPlay.textContent = XSTK_SIM_STATE.lln.running ? '⏸️ Tạm Dừng' : '▶️ Bắt Đầu';
      });
    }

    if (btnStep1) {
      btnStep1.addEventListener('click', () => runLLNTrials(1));
    }
    if (btnStep100) {
      btnStep100.addEventListener('click', () => runLLNTrials(100));
    }
    if (btnStep1000) {
      btnStep1000.addEventListener('click', () => runLLNTrials(1000));
    }

    if (btnReset) {
      btnReset.addEventListener('click', resetLLN);
    }

    if (selMode) {
      selMode.addEventListener('change', (e) => {
        const val = e.target.value;
        XSTK_SIM_STATE.lln.mode = val;
        const pRow = document.getElementById('row-lln-p');
        if (val === 'coin') {
          XSTK_SIM_STATE.lln.p = 0.5;
          if (pRow) pRow.style.display = 'none';
        } else if (val === 'dice') {
          XSTK_SIM_STATE.lln.p = 1 / 6;
          if (pRow) pRow.style.display = 'none';
        } else {
          XSTK_SIM_STATE.lln.p = parseFloat(slP ? slP.value : 0.5);
          if (pRow) pRow.style.display = 'block';
        }
        resetLLN();
      });
    }

    if (slP) {
      slP.addEventListener('input', (e) => {
        const p = parseFloat(e.target.value);
        XSTK_SIM_STATE.lln.p = p;
        const valBadge = document.getElementById('val-lln-p');
        if (valBadge) valBadge.textContent = p.toFixed(2);
        resetLLN();
      });
    }

    if (slSpeed) {
      slSpeed.addEventListener('input', (e) => {
        XSTK_SIM_STATE.lln.speed = parseInt(e.target.value, 10);
        const valBadge = document.getElementById('val-lln-speed');
        if (valBadge) valBadge.textContent = `${XSTK_SIM_STATE.lln.speed}x`;
      });
    }
  }

  function resetLLN() {
    XSTK_SIM_STATE.lln.trials = 0;
    XSTK_SIM_STATE.lln.successes = 0;
    XSTK_SIM_STATE.lln.history = [];
    XSTK_SIM_STATE.lln.lastOutcome = null;
    updateLLNReadouts();
  }

  function runLLNTrials(count) {
    const lln = XSTK_SIM_STATE.lln;
    for (let i = 0; i < count; i++) {
      lln.trials++;
      const success = Math.random() < lln.p;
      if (success) lln.successes++;
      lln.lastOutcome = success;

      // Keep sampled history points (dense at start, downsampled when large)
      if (lln.trials <= 200 || lln.trials % Math.max(1, Math.floor(lln.trials / 300)) === 0) {
        lln.history.push({
          n: lln.trials,
          fn: lln.successes / lln.trials
        });
      }
    }
    updateLLNReadouts();
  }

  function updateLLNReadouts() {
    const lln = XSTK_SIM_STATE.lln;
    const elN = document.getElementById('val-lln-trials');
    const elM = document.getElementById('val-lln-successes');
    const elFn = document.getElementById('val-lln-fn');
    const elErr = document.getElementById('val-lln-error');

    if (elN) elN.textContent = lln.trials.toLocaleString();
    if (elM) elM.textContent = lln.successes.toLocaleString();
    const fn = lln.trials > 0 ? (lln.successes / lln.trials) : 0;
    if (elFn) elFn.textContent = lln.trials > 0 ? fn.toFixed(4) : '0.0000';
    if (elErr) elErr.textContent = lln.trials > 0 ? Math.abs(fn - lln.p).toFixed(4) : '0.0000';
  }

  function updateAndDrawLLN() {
    const cv = document.getElementById('cv-xstk-lln');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const lln = XSTK_SIM_STATE.lln;

    if (lln.running) {
      runLLNTrials(lln.speed);
      lln.coinAngle += 0.2;
    }

    // Canvas Dimensions
    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);

    // Background Neo-box styling
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Left Area: Coin/Dice Visual Representation (W_left = 180)
    const W_left = 180;
    ctx.fillStyle = '#F8FAFC';
    ctx.fillRect(0, 0, W_left, H);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W_left, 0);
    ctx.lineTo(W_left, H);
    ctx.stroke();

    // Draw Coin / Dice Animation
    const midX = W_left / 2;
    const midY = 110;

    if (lln.mode === 'dice') {
      // Draw 3D-ish Dice
      ctx.save();
      ctx.translate(midX, midY);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(-35, -35, 70, 70);
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.strokeRect(-35, -35, 70, 70);

      // Dice Dots (show 6 if success, or random number)
      ctx.fillStyle = '#FFF';
      const isSix = lln.lastOutcome === true;
      const numToShow = isSix ? 6 : (lln.lastOutcome === false ? 2 : 6);
      if (numToShow === 6) {
        // 6 dots
        [[-20,-20], [-20,0], [-20,20], [20,-20], [20,0], [20,20]].forEach(([dx, dy]) => {
          ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
        });
      } else {
        // 2 dots
        [[-15,-15], [15,15]].forEach(([dx, dy]) => {
          ctx.beginPath(); ctx.arc(dx, dy, 5, 0, Math.PI * 2); ctx.fill();
        });
      }
      ctx.restore();

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GIEO XÚC XẮC (MẶT 6)', midX, midY + 60);
      ctx.fillStyle = '#64748B';
      ctx.fillText('P(Mặt 6) = 1/6 ≈ 0.1667', midX, midY + 80);
    } else {
      // Draw Flipping Coin
      ctx.save();
      ctx.translate(midX, midY);
      const scaleX = lln.running ? Math.abs(Math.cos(lln.coinAngle)) : 1.0;
      ctx.scale(Math.max(0.1, scaleX), 1.0);

      const isHeads = lln.lastOutcome === null ? true : lln.lastOutcome;
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.fillStyle = isHeads ? '#F59E0B' : '#E2E8F0';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Coin text
      ctx.fillStyle = isHeads ? '#78350F' : '#334155';
      ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isHeads ? 'NGỬA' : 'SẤP', 0, 0);
      ctx.restore();

      ctx.fillStyle = '#000';
      ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TUNG ĐỒNG XU', midX, midY + 62);
      ctx.fillStyle = '#64748B';
      ctx.fillText(`P(Ngửa) = ${lln.p.toFixed(2)}`, midX, midY + 82);
    }

    // Mini status badge
    ctx.fillStyle = lln.running ? '#10B981' : '#64748B';
    ctx.fillRect(midX - 50, H - 45, 100, 26);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(midX - 50, H - 45, 100, 26);
    ctx.fillStyle = '#FFF';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(lln.running ? '● ĐANG CHẠY' : '❚❚ TẠM DỪNG', midX, H - 28);

    // Right Area: Convergence Chart (W_right from W_left to W)
    const chartLeft = W_left + 45;
    const chartRight = W - 25;
    const chartTop = 30;
    const chartBottom = H - 40;
    const chartWidth = chartRight - chartLeft;
    const chartHeight = chartBottom - chartTop;

    // Grid lines (y = 0.0, 0.25, 0.5, 0.75, 1.0)
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    for (let yVal = 0; yVal <= 1.0; yVal += 0.25) {
      const yPos = chartBottom - yVal * chartHeight;
      ctx.beginPath();
      ctx.moveTo(chartLeft, yPos);
      ctx.lineTo(chartRight, yPos);
      ctx.stroke();

      // Y-axis label
      ctx.fillStyle = '#64748B';
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toFixed(2), chartLeft - 6, yPos + 3);
    }

    // Theoretical probability line (p)
    const pY = chartBottom - lln.p * chartHeight;
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(chartLeft, pY);
    ctx.lineTo(chartRight, pY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#EF4444';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Xác suất lý thuyết p = ${lln.p.toFixed(3)}`, chartLeft + 10, pY - 6);

    // Draw History Curve
    const maxN = Math.max(100, lln.trials);
    if (lln.history.length > 1) {
      // 95% Confidence Band: p ± 1.96 * sqrt(p*(1-p)/n)
      ctx.fillStyle = 'rgba(59, 130, 246, 0.08)';
      ctx.beginPath();
      for (let i = 0; i < lln.history.length; i++) {
        const item = lln.history[i];
        const x = chartLeft + (item.n / maxN) * chartWidth;
        const se = Math.sqrt((lln.p * (1 - lln.p)) / item.n);
        const upper = Math.min(1.0, lln.p + 1.96 * se);
        const yUpper = chartBottom - upper * chartHeight;
        if (i === 0) ctx.moveTo(x, yUpper);
        else ctx.lineTo(x, yUpper);
      }
      for (let i = lln.history.length - 1; i >= 0; i--) {
        const item = lln.history[i];
        const x = chartLeft + (item.n / maxN) * chartWidth;
        const se = Math.sqrt((lln.p * (1 - lln.p)) / item.n);
        const lower = Math.max(0.0, lln.p - 1.96 * se);
        const yLower = chartBottom - lower * chartHeight;
        ctx.lineTo(x, yLower);
      }
      ctx.closePath();
      ctx.fill();

      // Plot actual relative frequency f_n
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < lln.history.length; i++) {
        const item = lln.history[i];
        const x = chartLeft + (item.n / maxN) * chartWidth;
        const y = chartBottom - item.fn * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Current point dot
      const last = lln.history[lln.history.length - 1];
      const curX = chartLeft + (last.n / maxN) * chartWidth;
      const curY = chartBottom - last.fn * chartHeight;
      ctx.beginPath();
      ctx.arc(curX, curY, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE600';
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Chart Axes
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(chartLeft, chartTop);
    ctx.lineTo(chartLeft, chartBottom);
    ctx.lineTo(chartRight, chartBottom);
    ctx.stroke();

    // X-axis label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`Số lần thử n (Tối đa: ${maxN.toLocaleString()}) →`, chartRight, chartBottom + 26);
  }

  // =========================================================================
  // MODULE 2: GALTON BOARD (BEAN MACHINE & CLT)
  // =========================================================================
  function setupGaltonControls() {
    const cv = document.getElementById('cv-xstk-galton');
    if (!cv) return;

    resetGalton();

    const btnPlay = document.getElementById('btn-galton-play');
    const btnDrop1 = document.getElementById('btn-galton-drop1');
    const btnDrop100 = document.getElementById('btn-galton-drop100');
    const btnDrop1000 = document.getElementById('btn-galton-drop1000');
    const btnReset = document.getElementById('btn-galton-reset');
    const slRows = document.getElementById('sl-galton-rows');
    const slRate = document.getElementById('sl-galton-rate');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        XSTK_SIM_STATE.galton.running = !XSTK_SIM_STATE.galton.running;
        btnPlay.textContent = XSTK_SIM_STATE.galton.running ? '⏸️ Tạm Dừng' : '▶️ Thả Hạt';
      });
    }

    if (btnDrop1) {
      btnDrop1.addEventListener('click', () => spawnGaltonBalls(1));
    }
    if (btnDrop100) {
      btnDrop100.addEventListener('click', () => spawnGaltonBalls(100));
    }
    if (btnDrop1000) {
      btnDrop1000.addEventListener('click', () => fastDropGalton(1000));
    }

    if (btnReset) {
      btnReset.addEventListener('click', resetGalton);
    }

    if (slRows) {
      slRows.addEventListener('input', (e) => {
        XSTK_SIM_STATE.galton.rows = parseInt(e.target.value, 10);
        const valBadge = document.getElementById('val-galton-rows');
        if (valBadge) valBadge.textContent = `${XSTK_SIM_STATE.galton.rows} hàng`;
        resetGalton();
      });
    }

    if (slRate) {
      slRate.addEventListener('input', (e) => {
        XSTK_SIM_STATE.galton.dropRate = parseInt(e.target.value, 10);
        const valBadge = document.getElementById('val-galton-rate');
        if (valBadge) valBadge.textContent = `${XSTK_SIM_STATE.galton.dropRate} hạt/nhịp`;
      });
    }
  }

  function resetGalton() {
    const g = XSTK_SIM_STATE.galton;
    const numBins = g.rows + 1;
    g.bins = new Array(numBins).fill(0);
    g.balls = [];
    g.totalBalls = 0;
    updateGaltonReadouts();
  }

  function spawnGaltonBalls(count) {
    const g = XSTK_SIM_STATE.galton;
    for (let i = 0; i < count; i++) {
      g.balls.push({
        x: g.startX + (Math.random() - 0.5) * 4,
        y: g.startY - i * 14,
        vx: 0,
        vy: 2.0 + Math.random(),
        currentRow: 0,
        binIndex: 0,
        path: [] // decision history (0: left, 1: right)
      });
    }
    g.totalBalls += count;
    updateGaltonReadouts();
  }

  // Fast mathematical accumulation of balls using Binomial random generator
  function fastDropGalton(count) {
    const g = XSTK_SIM_STATE.galton;
    const n = g.rows;
    for (let c = 0; c < count; c++) {
      let bin = 0;
      for (let r = 0; r < n; r++) {
        if (Math.random() < 0.5) bin++;
      }
      g.bins[bin]++;
    }
    g.totalBalls += count;
    updateGaltonReadouts();
  }

  function updateGaltonReadouts() {
    const g = XSTK_SIM_STATE.galton;
    const elTotal = document.getElementById('val-galton-total');
    const elMean = document.getElementById('val-galton-mean');
    const elStd = document.getElementById('val-galton-std');

    if (elTotal) elTotal.textContent = g.totalBalls.toLocaleString();
    const mu = g.rows * 0.5;
    const sigma = Math.sqrt(g.rows * 0.25);
    if (elMean) elMean.textContent = `E(X) = ${mu.toFixed(1)}`;
    if (elStd) elStd.textContent = `σ(X) = ${sigma.toFixed(3)}`;
  }

  function updateAndDrawGalton() {
    const cv = document.getElementById('cv-xstk-galton');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const g = XSTK_SIM_STATE.galton;

    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    // Continuous ball drops if running
    if (g.running && Math.random() < 0.4) {
      spawnGaltonBalls(g.dropRate);
    }

    g.startX = W / 2;
    g.startY = 35;
    g.pegSpacingY = 22;
    g.pegSpacingX = 32;

    const pegBaseY = g.startY + 25;
    const binTopY = pegBaseY + g.rows * g.pegSpacingY + 15;
    const binBottomY = H - 25;
    const binHeight = binBottomY - binTopY;

    // Draw Funnel
    ctx.fillStyle = '#E2E8F0';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g.startX - 40, 10);
    ctx.lineTo(g.startX - 10, g.startY);
    ctx.lineTo(g.startX - 10, g.startY + 15);
    ctx.lineTo(g.startX + 10, g.startY + 15);
    ctx.lineTo(g.startX + 10, g.startY);
    ctx.lineTo(g.startX + 40, 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw Pegs (Hàng đinh)
    for (let r = 0; r < g.rows; r++) {
      const rowY = pegBaseY + r * g.pegSpacingY;
      const numPegs = r + 1;
      const rowStartX = g.startX - (r * g.pegSpacingX) / 2;

      for (let p = 0; p < numPegs; p++) {
        const px = rowStartX + p * g.pegSpacingX;
        ctx.beginPath();
        ctx.arc(px, rowY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#1E293B';
        ctx.fill();
      }
    }

    // Update and draw active falling balls
    const remainingBalls = [];
    ctx.fillStyle = '#EF4444';
    ctx.strokeStyle = '#991B1B';

    for (let i = 0; i < g.balls.length; i++) {
      const b = g.balls[i];
      b.y += b.vy;
      b.vy += 0.25; // gravity

      // Check collision with pegs
      const rowFloat = (b.y - pegBaseY) / g.pegSpacingY;
      const curRow = Math.floor(rowFloat);

      if (curRow >= 0 && curRow < g.rows && curRow === b.currentRow) {
        // Decide left or right bounce
        const goRight = Math.random() < 0.5;
        b.path.push(goRight ? 1 : 0);
        b.binIndex += (goRight ? 1 : 0);
        b.vx = goRight ? 1.4 : -1.4;
        b.vy = 1.2; // dampen
        b.currentRow++;
      }

      b.x += b.vx;
      b.vx *= 0.92; // friction

      // Check if settled in bin
      if (b.y >= binTopY) {
        const finalBin = Math.max(0, Math.min(g.rows, b.binIndex));
        g.bins[finalBin]++;
      } else {
        remainingBalls.push(b);
        // Draw falling ball
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    g.balls = remainingBalls;

    // Draw Bins and Histogram bars at bottom
    const numBins = g.rows + 1;
    const totalBinWidth = g.rows * g.pegSpacingX;
    const binStartX = g.startX - totalBinWidth / 2 - g.pegSpacingX / 2;
    const singleBinW = g.pegSpacingX;

    // Find max bin count for scaling
    const maxCount = Math.max(1, ...g.bins);
    const maxBarHeight = binHeight - 20;

    for (let k = 0; k < numBins; k++) {
      const bx = binStartX + k * singleBinW;
      const count = g.bins[k];
      const barH = (count / maxCount) * maxBarHeight;

      // Draw vertical bin divider line
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx, binTopY);
      ctx.lineTo(bx, binBottomY);
      ctx.stroke();

      // Draw histogram fill bar
      if (barH > 0) {
        ctx.fillStyle = '#3B82F6';
        ctx.fillRect(bx + 2, binBottomY - barH, singleBinW - 4, barH);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 2, binBottomY - barH, singleBinW - 4, barH);
      }

      // Bin label (k)
      ctx.fillStyle = '#000';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(k, bx + singleBinW / 2, binBottomY + 14);
    }
    // Final right divider
    ctx.beginPath();
    ctx.moveTo(binStartX + numBins * singleBinW, binTopY);
    ctx.lineTo(binStartX + numBins * singleBinW, binBottomY);
    ctx.stroke();

    // Draw theoretical Gaussian Curve overlay on the histogram
    if (g.totalBalls > 20) {
      const n = g.rows;
      const mu = n * 0.5;
      const sigma = Math.sqrt(n * 0.25);

      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      for (let xPix = binStartX; xPix <= binStartX + numBins * singleBinW; xPix += 2) {
        const kVal = (xPix - binStartX) / singleBinW;
        // Binomial / Normal density
        const z = (kVal - mu) / sigma;
        const normDens = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
        // Scale normDens to match histogram scale: peak of normal vs peak of bin
        const expectedPeakCount = g.totalBalls * (1 / (sigma * Math.sqrt(2 * Math.PI)));
        const curveH = (normDens * g.totalBalls / maxCount) * maxBarHeight;
        const yPix = binBottomY - curveH;

        if (xPix === binStartX) ctx.moveTo(xPix, yPix);
        else ctx.lineTo(xPix, yPix);
      }
      ctx.stroke();

      // Legend
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`— Đường cong chuẩn lý thuyết Gauss N(μ=${mu.toFixed(1)}, σ²=${(n*0.25).toFixed(2)})`, 20, 30);
    }
  }

  // =========================================================================
  // MODULE 3: NORMAL DISTRIBUTION BELL CURVE & PROBABILITY INTEGRAL
  // =========================================================================
  function setupNormalControls() {
    const cv = document.getElementById('cv-xstk-normal');
    if (!cv) return;

    const slMu = document.getElementById('sl-norm-mu');
    const slSigma = document.getElementById('sl-norm-sigma');
    const slA = document.getElementById('sl-norm-a');
    const slB = document.getElementById('sl-norm-b');

    if (slMu) {
      slMu.addEventListener('input', (e) => {
        XSTK_SIM_STATE.normal.mu = parseFloat(e.target.value);
        const el = document.getElementById('val-norm-mu');
        if (el) el.textContent = XSTK_SIM_STATE.normal.mu.toFixed(1);
        updateNormalReadouts();
      });
    }

    if (slSigma) {
      slSigma.addEventListener('input', (e) => {
        XSTK_SIM_STATE.normal.sigma = parseFloat(e.target.value);
        const el = document.getElementById('val-norm-sigma');
        if (el) el.textContent = XSTK_SIM_STATE.normal.sigma.toFixed(1);
        updateNormalReadouts();
      });
    }

    if (slA) {
      slA.addEventListener('input', (e) => {
        XSTK_SIM_STATE.normal.a = parseFloat(e.target.value);
        const el = document.getElementById('val-norm-a');
        if (el) el.textContent = XSTK_SIM_STATE.normal.a.toFixed(1);
        updateNormalReadouts();
      });
    }

    if (slB) {
      slB.addEventListener('input', (e) => {
        XSTK_SIM_STATE.normal.b = parseFloat(e.target.value);
        const el = document.getElementById('val-norm-b');
        if (el) el.textContent = XSTK_SIM_STATE.normal.b.toFixed(1);
        updateNormalReadouts();
      });
    }

    // Presets
    document.querySelectorAll('.btn-norm-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        const preset = btn.getAttribute('data-preset');
        const norm = XSTK_SIM_STATE.normal;
        if (preset === '1sigma') {
          norm.a = norm.mu - norm.sigma;
          norm.b = norm.mu + norm.sigma;
        } else if (preset === '2sigma') {
          norm.a = norm.mu - 2 * norm.sigma;
          norm.b = norm.mu + 2 * norm.sigma;
        } else if (preset === '3sigma') {
          norm.a = norm.mu - 3 * norm.sigma;
          norm.b = norm.mu + 3 * norm.sigma;
        } else if (preset === 'left50') {
          norm.a = norm.mu - 4 * norm.sigma;
          norm.b = norm.mu;
        } else if (preset === 'right25') {
          norm.a = norm.mu + 1.96 * norm.sigma;
          norm.b = norm.mu + 4 * norm.sigma;
        }

        if (slA) slA.value = norm.a;
        if (slB) slB.value = norm.b;
        const elA = document.getElementById('val-norm-a');
        const elB = document.getElementById('val-norm-b');
        if (elA) elA.textContent = norm.a.toFixed(1);
        if (elB) elB.textContent = norm.b.toFixed(1);

        updateNormalReadouts();
      });
    });

    updateNormalReadouts();
  }

  function updateNormalReadouts() {
    const norm = XSTK_SIM_STATE.normal;
    const za = (norm.a - norm.mu) / norm.sigma;
    const zb = (norm.b - norm.mu) / norm.sigma;
    const prob = Math.max(0, normalCDF(zb) - normalCDF(za));

    const elZa = document.getElementById('val-norm-za');
    const elZb = document.getElementById('val-norm-zb');
    const elProb = document.getElementById('val-norm-prob');
    const elPct = document.getElementById('val-norm-pct');

    if (elZa) elZa.textContent = za.toFixed(2);
    if (elZb) elZb.textContent = zb.toFixed(2);
    if (elProb) elProb.textContent = prob.toFixed(4);
    if (elPct) elPct.textContent = `${(prob * 100).toFixed(2)}%`;
  }

  function drawNormal() {
    const cv = document.getElementById('cv-xstk-normal');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const norm = XSTK_SIM_STATE.normal;

    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    const marginX = 50;
    const marginY = 40;
    const plotW = W - 2 * marginX;
    const plotH = H - 2 * marginY;
    const axisY = H - marginY;

    // Range for X axis: [mu - 4*sigma, mu + 4*sigma]
    const xMin = norm.mu - 4 * norm.sigma;
    const xMax = norm.mu + 4 * norm.sigma;
    const xRange = xMax - xMin;

    function toCanvasX(xVal) {
      return marginX + ((xVal - xMin) / xRange) * plotW;
    }

    // Peak height f(mu) = 1 / (sigma * sqrt(2*PI))
    const maxDensity = 1.0 / (norm.sigma * Math.sqrt(2 * Math.PI));
    function toCanvasY(density) {
      return axisY - (density / maxDensity) * (plotH * 0.85);
    }

    function gaussian(x) {
      const z = (x - norm.mu) / norm.sigma;
      return maxDensity * Math.exp(-0.5 * z * z);
    }

    // Draw Shaded Probability Area [a, b]
    const lowerA = Math.min(norm.a, norm.b);
    const upperB = Math.max(norm.a, norm.b);

    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)'; // Neo yellow highlight
    ctx.beginPath();
    const startXPix = toCanvasX(Math.max(xMin, lowerA));
    const endXPix = toCanvasX(Math.min(xMax, upperB));

    ctx.moveTo(startXPix, axisY);
    for (let px = startXPix; px <= endXPix; px += 2) {
      const xVal = xMin + ((px - marginX) / plotW) * xRange;
      const yVal = toCanvasY(gaussian(xVal));
      ctx.lineTo(px, yVal);
    }
    ctx.lineTo(endXPix, axisY);
    ctx.closePath();
    ctx.fill();

    // Diagonal hatching lines across shaded area for Neobrutalist flair
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.lineWidth = 1.5;
    for (let lineX = -H; lineX < W + H; lineX += 12) {
      ctx.beginPath();
      ctx.moveTo(lineX, 0);
      ctx.lineTo(lineX + H, H);
      ctx.stroke();
    }
    ctx.restore();

    // Draw the Gaussian Curve
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let px = marginX; px <= marginX + plotW; px += 2) {
      const xVal = xMin + ((px - marginX) / plotW) * xRange;
      const py = toCanvasY(gaussian(xVal));
      if (px === marginX) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw Center Line at x = mu
    const muPixX = toCanvasX(norm.mu);
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(muPixX, axisY);
    ctx.lineTo(muPixX, toCanvasY(maxDensity));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Cutoff lines at a and b
    [lowerA, upperB].forEach((boundVal, idx) => {
      const bx = toCanvasX(boundVal);
      if (bx >= marginX && bx <= marginX + plotW) {
        ctx.strokeStyle = idx === 0 ? '#DC2626' : '#9333EA';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(bx, axisY);
        ctx.lineTo(bx, toCanvasY(gaussian(boundVal)));
        ctx.stroke();

        // Label flag
        ctx.fillStyle = idx === 0 ? '#DC2626' : '#9333EA';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(idx === 0 ? `a=${boundVal.toFixed(1)}` : `b=${boundVal.toFixed(1)}`, bx, axisY - 8);
      }
    });

    // Draw X-axis
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(marginX - 10, axisY);
    ctx.lineTo(marginX + plotW + 15, axisY);
    ctx.stroke();

    // Standard deviation ticks (mu - 3s, mu - 2s, ..., mu + 3s)
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 10px monospace';
    ctx.textAlign = 'center';

    for (let k = -3; k <= 3; k++) {
      const tickVal = norm.mu + k * norm.sigma;
      const tx = toCanvasX(tickVal);
      ctx.beginPath();
      ctx.moveTo(tx, axisY);
      ctx.lineTo(tx, axisY + 6);
      ctx.stroke();

      const label = k === 0 ? `μ (${tickVal.toFixed(1)})` : (k > 0 ? `+${k}σ` : `${k}σ`);
      ctx.fillText(label, tx, axisY + 18);
    }

    // Top information label
    ctx.fillStyle = '#000';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Hàm mật độ Gauss: f(x) ~ N(μ = ${norm.mu.toFixed(1)}, σ = ${norm.sigma.toFixed(1)})`, marginX, 24);
  }

  // =========================================================================
  // MODULE 4: CONFIDENCE INTERVAL (CI) SIMULATION
  // =========================================================================
  function setupCIControls() {
    const cv = document.getElementById('cv-xstk-ci');
    if (!cv) return;

    resetCI();

    const btnPlay = document.getElementById('btn-ci-play');
    const btnSample20 = document.getElementById('btn-ci-sample20');
    const btnSample100 = document.getElementById('btn-ci-sample100');
    const btnReset = document.getElementById('btn-ci-reset');
    const slN = document.getElementById('sl-ci-n');
    const selConf = document.getElementById('sel-ci-conf');

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        XSTK_SIM_STATE.ci.running = !XSTK_SIM_STATE.ci.running;
        btnPlay.textContent = XSTK_SIM_STATE.ci.running ? '⏸️ Tạm Dừng' : '▶️ Chạy Liên Tục';
      });
    }

    if (btnSample20) {
      btnSample20.addEventListener('click', () => addCISamples(20));
    }
    if (btnSample100) {
      btnSample100.addEventListener('click', () => addCISamples(100));
    }

    if (btnReset) {
      btnReset.addEventListener('click', resetCI);
    }

    if (slN) {
      slN.addEventListener('input', (e) => {
        XSTK_SIM_STATE.ci.n = parseInt(e.target.value, 10);
        const el = document.getElementById('val-ci-n');
        if (el) el.textContent = `n = ${XSTK_SIM_STATE.ci.n}`;
        resetCI();
      });
    }

    if (selConf) {
      selConf.addEventListener('change', (e) => {
        XSTK_SIM_STATE.ci.confidenceLevel = parseFloat(e.target.value);
        resetCI();
      });
    }
  }

  function resetCI() {
    XSTK_SIM_STATE.ci.intervals = [];
    updateCIReadouts();
  }

  function addCISamples(count) {
    const ci = XSTK_SIM_STATE.ci;
    const mu0 = ci.trueMu;
    const sigma = ci.trueSigma;
    const n = ci.n;

    // Critical value u_(alpha/2)
    let uCrit = 1.96; // 95%
    if (Math.abs(ci.confidenceLevel - 0.90) < 0.01) uCrit = 1.645;
    else if (Math.abs(ci.confidenceLevel - 0.99) < 0.01) uCrit = 2.576;

    for (let c = 0; c < count; c++) {
      // Draw a random sample of size n from N(mu0, sigma^2)
      let sum = 0;
      for (let i = 0; i < n; i++) {
        sum += randomNormal(mu0, sigma);
      }
      const xbar = sum / n;
      const marginError = uCrit * (sigma / Math.sqrt(n));
      const lower = xbar - marginError;
      const upper = xbar + marginError;
      const covered = (lower <= mu0 && mu0 <= upper);

      ci.intervals.push({
        xbar,
        lower,
        upper,
        covered
      });
    }

    updateCIReadouts();
  }

  function updateCIReadouts() {
    const ci = XSTK_SIM_STATE.ci;
    const total = ci.intervals.length;
    const coveredCount = ci.intervals.filter(it => it.covered).length;
    const missedCount = total - coveredCount;
    const actualCoverage = total > 0 ? (coveredCount / total) * 100 : 0;

    const elTotal = document.getElementById('val-ci-total');
    const elCovered = document.getElementById('val-ci-covered');
    const elMissed = document.getElementById('val-ci-missed');
    const elPct = document.getElementById('val-ci-pct');

    if (elTotal) elTotal.textContent = total.toLocaleString();
    if (elCovered) elCovered.textContent = coveredCount.toLocaleString();
    if (elMissed) elMissed.textContent = missedCount.toLocaleString();
    if (elPct) elPct.textContent = total > 0 ? `${actualCoverage.toFixed(1)}%` : '0.0%';
  }

  function updateAndDrawCI() {
    const cv = document.getElementById('cv-xstk-ci');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const ci = XSTK_SIM_STATE.ci;

    if (ci.running) {
      addCISamples(1);
    }

    const W = cv.width;
    const H = cv.height;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, W, H);

    const marginX = 60;
    const marginY = 40;
    const plotW = W - 2 * marginX;
    const plotH = H - 2 * marginY;

    // Population mean reference position
    const minXVal = ci.trueMu - 12;
    const maxXVal = ci.trueMu + 12;

    function toPixX(val) {
      return marginX + ((val - minXVal) / (maxXVal - minXVal)) * plotW;
    }

    // Draw central True Mean line (μ0 = 50)
    const trueMuPix = toPixX(ci.trueMu);
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(trueMuPix, marginY - 10);
    ctx.lineTo(trueMuPix, marginY + plotH + 10);
    ctx.stroke();

    ctx.fillStyle = '#2563EB';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Kỳ vọng thực μ₀ = ${ci.trueMu}`, trueMuPix, marginY - 15);

    // Show latest maxDisplay intervals
    const maxShow = ci.maxDisplay;
    const displayList = ci.intervals.slice(-maxShow);
    const rowStep = plotH / (maxShow + 1);

    for (let idx = 0; idx < displayList.length; idx++) {
      const item = displayList[idx];
      const yPix = marginY + (idx + 1) * rowStep;
      const x1 = toPixX(item.lower);
      const x2 = toPixX(item.upper);
      const xMid = toPixX(item.xbar);

      // Color: Green if covered, Red if missed
      ctx.strokeStyle = item.covered ? '#10B981' : '#EF4444';
      ctx.lineWidth = item.covered ? 2 : 3;

      // Interval segment
      ctx.beginPath();
      ctx.moveTo(x1, yPix);
      ctx.lineTo(x2, yPix);
      ctx.stroke();

      // Caps at ends
      ctx.beginPath();
      ctx.moveTo(x1, yPix - 3); ctx.lineTo(x1, yPix + 3);
      ctx.moveTo(x2, yPix - 3); ctx.lineTo(x2, yPix + 3);
      ctx.stroke();

      // Center point (xbar)
      ctx.fillStyle = item.covered ? '#065F46' : '#B91C1C';
      ctx.beginPath();
      ctx.arc(xMid, yPix, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Bottom Axis
    const axisY = marginY + plotH + 10;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(marginX, axisY);
    ctx.lineTo(marginX + plotW, axisY);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.textAlign = 'center';
    for (let tickVal = Math.ceil(minXVal); tickVal <= Math.floor(maxXVal); tickVal += 4) {
      const tx = toPixX(tickVal);
      ctx.beginPath();
      ctx.moveTo(tx, axisY);
      ctx.lineTo(tx, axisY + 5);
      ctx.stroke();
      ctx.fillText(tickVal, tx, axisY + 16);
    }
  }

  // Expose global init
  window.initXstkLab = initXstkLab;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initXstkLab);
  } else {
    initXstkLab();
  }
})();
