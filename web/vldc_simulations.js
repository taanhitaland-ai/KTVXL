/**
 * vldc_simulations.js
 * Bộ 6 Mô Phỏng Vật Lý Lượng Tử & Quang Học Trực Quan (Interactive Physics Lab)
 * Phong cách Neobrutalism, 60 FPS Canvas Animation, Real-time Controls
 */

(function () {
  'use strict';

  // Helper: Wavelength to RGB color
  function wavelengthToRGB(wavelength) {
    let r = 0, g = 0, b = 0;
    if (wavelength >= 380 && wavelength < 440) {
      r = -(wavelength - 440) / (440 - 380);
      b = 1.0;
    } else if (wavelength >= 440 && wavelength < 490) {
      g = (wavelength - 440) / (490 - 440);
      b = 1.0;
    } else if (wavelength >= 490 && wavelength < 510) {
      g = 1.0;
      b = -(wavelength - 510) / (510 - 490);
    } else if (wavelength >= 510 && wavelength < 580) {
      r = (wavelength - 510) / (580 - 510);
      g = 1.0;
    } else if (wavelength >= 580 && wavelength < 645) {
      r = 1.0;
      g = -(wavelength - 645) / (645 - 580);
    } else if (wavelength >= 645 && wavelength <= 780) {
      r = 1.0;
    } else if (wavelength < 380) {
      r = 0.5; b = 0.8; // UV
    } else {
      r = 0.8; // IR
    }
    // Intensity factor near vision limits
    let factor = 1.0;
    if (wavelength > 700) factor = 0.3 + 0.7 * (780 - wavelength) / 80;
    else if (wavelength < 420) factor = 0.3 + 0.7 * (wavelength - 380) / 40;
    
    return {
      r: Math.round(255 * Math.pow(r * factor, 0.8)),
      g: Math.round(255 * Math.pow(g * factor, 0.8)),
      b: Math.round(255 * Math.pow(b * factor, 0.8))
    };
  }

  function rgbStr(c, a = 1.0) {
    return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
  }

  // State object
  const SIM_STATE = {
    activeModule: 'young',
    animId: null,
    time: 0,
    
    // Module 1: Young
    young: {
      lambda: 550, // nm
      a: 0.8, // mm
      D: 2.0, // m
      plate: false,
      e: 4.0, // um
      n: 1.5
    },

    // Module 2: Diffraction
    diffraction: {
      mode: 'single', // 'single' or 'grating'
      lambda: 500, // nm
      b: 0.08, // mm
      d: 2.5, // um
      D: 1.5 // m
    },

    // Module 3: Photoelectric
    photo: {
      lambda: 280, // nm
      intensity: 80, // %
      Uak: 0.5, // V
      material: 'Na',
      electrons: [],
      photons: []
    },

    // Module 4: Compton
    compton: {
      lambda: 0.02, // A
      theta: 90, // deg
      progress: 0,
      collided: false
    },

    // Module 5: Quantum Box
    quantum: {
      n: 2,
      a: 1.0, // nm
      mass: 'electron'
    },

    // Module 6: Polarization
    polar: {
      alpha: 45, // deg
      hasMiddle: false,
      middleAlpha: 45
    }
  };

  // Cathode materials data
  const MATERIALS = {
    Cs: { name: 'Xesi (Cs)', A: 1.90, lambda0: 0.653 },
    Na: { name: 'Natri (Na)', A: 2.48, lambda0: 0.500 },
    Zn: { name: 'Kẽm (Zn)', A: 4.30, lambda0: 0.289 },
    Cu: { name: 'Đồng (Cu)', A: 4.70, lambda0: 0.264 }
  };

  // -------------------------------------------------------------------
  // INITIALIZATION & TAB SWITCHER
  // -------------------------------------------------------------------
  let labInitialized = false;
  function initLab() {
    if (labInitialized) return;
    labInitialized = true;
    setupModuleSwitchers();
    setupControls();
    startAnimationLoop();
  }

  function setupModuleSwitchers() {
    const container = document.getElementById('lab-container-vldc');
    const btns = container.querySelectorAll('.sim-nav-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const mod = btn.getAttribute('data-sim');
        SIM_STATE.activeModule = mod;
        container.querySelectorAll('.sim-view-pane').forEach(p => p.classList.remove('active'));
        const pane = document.getElementById(`sim-pane-${mod}`);
        if (pane) pane.classList.add('active');
      });
    });
  }

  function setupControls() {
    // 1. Young Controls
    const yLambda = document.getElementById('sl-young-lambda');
    if (yLambda) {
      yLambda.addEventListener('input', (e) => {
        SIM_STATE.young.lambda = parseFloat(e.target.value);
        document.getElementById('val-young-lambda').textContent = e.target.value + ' nm';
        updateYoungReadouts();
      });
    }
    const yA = document.getElementById('sl-young-a');
    if (yA) {
      yA.addEventListener('input', (e) => {
        SIM_STATE.young.a = parseFloat(e.target.value);
        document.getElementById('val-young-a').textContent = e.target.value + ' mm';
        updateYoungReadouts();
      });
    }
    const yD = document.getElementById('sl-young-d');
    if (yD) {
      yD.addEventListener('input', (e) => {
        SIM_STATE.young.D = parseFloat(e.target.value);
        document.getElementById('val-young-d').textContent = e.target.value + ' m';
        updateYoungReadouts();
      });
    }
    const yPlate = document.getElementById('chk-young-plate');
    if (yPlate) {
      yPlate.addEventListener('change', (e) => {
        SIM_STATE.young.plate = e.target.checked;
        const box = document.getElementById('young-plate-controls');
        if (box) box.style.display = e.target.checked ? 'block' : 'none';
        updateYoungReadouts();
      });
    }
    const yE = document.getElementById('sl-young-e');
    if (yE) {
      yE.addEventListener('input', (e) => {
        SIM_STATE.young.e = parseFloat(e.target.value);
        document.getElementById('val-young-e').textContent = e.target.value + ' µm';
        updateYoungReadouts();
      });
    }
    const yN = document.getElementById('sl-young-n');
    if (yN) {
      yN.addEventListener('input', (e) => {
        SIM_STATE.young.n = parseFloat(e.target.value);
        document.getElementById('val-young-n').textContent = e.target.value;
        updateYoungReadouts();
      });
    }

    // 2. Diffraction Controls
    const dMode = document.querySelectorAll('input[name="diff-mode"]');
    dMode.forEach(r => {
      r.addEventListener('change', (e) => {
        SIM_STATE.diffraction.mode = e.target.value;
        const boxSingle = document.getElementById('diff-single-ctrl');
        const boxGrating = document.getElementById('diff-grating-ctrl');
        if (boxSingle && boxGrating) {
          boxSingle.style.display = e.target.value === 'single' ? 'block' : 'none';
          boxGrating.style.display = e.target.value === 'grating' ? 'block' : 'none';
        }
        updateDiffractionReadouts();
      });
    });
    const dLambda = document.getElementById('sl-diff-lambda');
    if (dLambda) {
      dLambda.addEventListener('input', (e) => {
        SIM_STATE.diffraction.lambda = parseFloat(e.target.value);
        document.getElementById('val-diff-lambda').textContent = e.target.value + ' nm';
        updateDiffractionReadouts();
      });
    }
    const dB = document.getElementById('sl-diff-b');
    if (dB) {
      dB.addEventListener('input', (e) => {
        SIM_STATE.diffraction.b = parseFloat(e.target.value);
        document.getElementById('val-diff-b').textContent = e.target.value + ' mm';
        updateDiffractionReadouts();
      });
    }
    const dD = document.getElementById('sl-diff-d');
    if (dD) {
      dD.addEventListener('input', (e) => {
        SIM_STATE.diffraction.d = parseFloat(e.target.value);
        document.getElementById('val-diff-d').textContent = e.target.value + ' µm';
        updateDiffractionReadouts();
      });
    }

    // 3. Photoelectric Controls
    const pMat = document.getElementById('sel-photo-mat');
    if (pMat) {
      pMat.addEventListener('change', (e) => {
        SIM_STATE.photo.material = e.target.value;
        updatePhotoReadouts();
      });
    }
    const pLambda = document.getElementById('sl-photo-lambda');
    if (pLambda) {
      pLambda.addEventListener('input', (e) => {
        SIM_STATE.photo.lambda = parseFloat(e.target.value);
        document.getElementById('val-photo-lambda').textContent = e.target.value + ' nm';
        updatePhotoReadouts();
      });
    }
    const pInt = document.getElementById('sl-photo-int');
    if (pInt) {
      pInt.addEventListener('input', (e) => {
        SIM_STATE.photo.intensity = parseFloat(e.target.value);
        document.getElementById('val-photo-int').textContent = e.target.value + '%';
      });
    }
    const pU = document.getElementById('sl-photo-u');
    if (pU) {
      pU.addEventListener('input', (e) => {
        SIM_STATE.photo.Uak = parseFloat(e.target.value);
        document.getElementById('val-photo-u').textContent = (e.target.value > 0 ? '+' : '') + e.target.value + ' V';
        updatePhotoReadouts();
      });
    }

    // 4. Compton Controls
    const cTheta = document.getElementById('sl-compton-theta');
    if (cTheta) {
      cTheta.addEventListener('input', (e) => {
        SIM_STATE.compton.theta = parseFloat(e.target.value);
        document.getElementById('val-compton-theta').textContent = e.target.value + '°';
        updateComptonReadouts();
      });
    }
    const btnFire = document.getElementById('btn-compton-fire');
    if (btnFire) {
      btnFire.addEventListener('click', () => {
        SIM_STATE.compton.progress = 0;
        SIM_STATE.compton.collided = false;
      });
    }

    // 5. Quantum Box Controls
    const qN = document.getElementById('sl-quantum-n');
    if (qN) {
      qN.addEventListener('input', (e) => {
        SIM_STATE.quantum.n = parseInt(e.target.value, 10);
        document.getElementById('val-quantum-n').textContent = 'n = ' + e.target.value;
        updateQuantumReadouts();
      });
    }
    const qA = document.getElementById('sl-quantum-a');
    if (qA) {
      qA.addEventListener('input', (e) => {
        SIM_STATE.quantum.a = parseFloat(e.target.value);
        document.getElementById('val-quantum-a').textContent = e.target.value + ' nm';
        updateQuantumReadouts();
      });
    }

    // 6. Polarizer Controls
    const polAlpha = document.getElementById('sl-polar-alpha');
    if (polAlpha) {
      polAlpha.addEventListener('input', (e) => {
        SIM_STATE.polar.alpha = parseFloat(e.target.value);
        document.getElementById('val-polar-alpha').textContent = e.target.value + '°';
        updatePolarReadouts();
      });
    }
    const polMid = document.getElementById('chk-polar-mid');
    if (polMid) {
      polMid.addEventListener('change', (e) => {
        SIM_STATE.polar.hasMiddle = e.target.checked;
        const box = document.getElementById('polar-mid-box');
        if (box) box.style.display = e.target.checked ? 'block' : 'none';
        updatePolarReadouts();
      });
    }

    // Run initial readouts
    updateYoungReadouts();
    updateDiffractionReadouts();
    updatePhotoReadouts();
    updateComptonReadouts();
    updateQuantumReadouts();
    updatePolarReadouts();
  }

  // -------------------------------------------------------------------
  // READOUT UPDATES
  // -------------------------------------------------------------------
  function updateYoungReadouts() {
    const { lambda, a, D, plate, e, n } = SIM_STATE.young;
    const i = (lambda * 1e-9 * D) / (a * 1e-3) * 1e3; // mm
    const deltaX = plate ? ((D / (a * 1e-3)) * (n - 1.0) * (e * 1e-6) * 1e3) : 0; // mm
    const kShift = plate ? (deltaX / i) : 0;

    const elI = document.getElementById('out-young-i');
    if (elI) elI.textContent = i.toFixed(3) + ' mm';

    const elShift = document.getElementById('out-young-shift');
    if (elShift) {
      elShift.textContent = plate ? `${deltaX.toFixed(3)} mm (${kShift.toFixed(2)} khoảng vân)` : '0.000 mm';
    }
  }

  function updateDiffractionReadouts() {
    const { mode, lambda, b, d, D } = SIM_STATE.diffraction;
    if (mode === 'single') {
      const deltaX0 = (2.0 * lambda * 1e-9 * D) / (b * 1e-3) * 1e3; // mm
      const phi1 = Math.asin(Math.min(1.0, (lambda * 1e-6) / b)) * (180 / Math.PI);
      const elW = document.getElementById('out-diff-w0');
      if (elW) elW.textContent = deltaX0.toFixed(2) + ' mm';
      const elP = document.getElementById('out-diff-phi');
      if (elP) elP.textContent = phi1.toFixed(3) + '°';
    } else {
      const kmax = Math.floor(d * 1000 / lambda + 1e-10);
      const total = 2 * kmax + 1;
      const elK = document.getElementById('out-diff-phi');
      if (elK) elK.textContent = `k_max = ${kmax} (Tổng ${total} cực đại)`;
      const elW = document.getElementById('out-diff-w0');
      if (elW) elW.textContent = '— (chế độ cách tử)';
    }
  }

  function updatePhotoReadouts() {
    const { lambda, material, Uak } = SIM_STATE.photo;
    const mat = MATERIALS[material];
    const photonEnergy = 1242 / lambda; // eV
    const Uh = Math.max(0, photonEnergy - mat.A);
    const hasPhoto = photonEnergy >= mat.A;
    const isStopped = Uak <= -Uh && hasPhoto;

    const elE = document.getElementById('out-photo-e');
    if (elE) elE.textContent = photonEnergy.toFixed(2) + ' eV';
    const elL0 = document.getElementById('out-photo-l0');
    if (elL0) elL0.textContent = (mat.lambda0 * 1000).toFixed(0) + ' nm (' + mat.A.toFixed(2) + ' eV)';
    const elUh = document.getElementById('out-photo-uh');
    if (elUh) elUh.textContent = Uh.toFixed(2) + ' V';
    
    const elStatus = document.getElementById('out-photo-status');
    if (elStatus) {
      if (!hasPhoto) {
        elStatus.innerHTML = '<span style="color: #DC2626;">❌ KHÔNG XẢY RA QUANG ĐIỆN (λ > λ₀, photon thiếu năng lượng)</span>';
      } else if (isStopped) {
        elStatus.innerHTML = '<span style="color: #EA580C;">⚠️ DÒNG QUANG ĐIỆN BỊ TRIỆT TIÊU (Điện thế hãm U ≤ -Uh)</span>';
      } else {
        elStatus.innerHTML = '<span style="color: #16A34A;">✅ ĐANG CÓ DÒNG QUANG ĐIỆN (Electron bứt sang Anode)</span>';
      }
    }
  }

  function updateComptonReadouts() {
    const { lambda, theta } = SIM_STATE.compton;
    const lambda_c = 0.02426; // Angstrom
    const rad = (theta * Math.PI) / 180;
    const deltaL = lambda_c * (1.0 - Math.cos(rad));
    const lambdaPrime = lambda + deltaL;
    
    const E0 = 12.42 / lambda; // keV
    const EPrime = 12.42 / lambdaPrime; // keV
    const Ke = E0 - EPrime;

    const elDelta = document.getElementById('out-compton-deltal');
    if (elDelta) elDelta.textContent = deltaL.toFixed(5) + ' Å';
    const elPrime = document.getElementById('out-compton-prime');
    if (elPrime) elPrime.textContent = lambdaPrime.toFixed(5) + ' Å';
    const elKe = document.getElementById('out-compton-ke');
    if (elKe) elKe.textContent = Ke.toFixed(2) + ' keV';
  }

  function updateQuantumReadouts() {
    const { n, a } = SIM_STATE.quantum;
    // En = (n^2 * h^2) / (8 * m * a^2)
    // For electron in nm: E1 ≈ 0.376 / a^2 (eV)
    const E1 = 0.3760 / (a * a);
    const En = n * n * E1;
    const lambdaDB = (2.0 * a) / n;

    const elEn = document.getElementById('out-quantum-en');
    if (elEn) elEn.textContent = En.toFixed(3) + ' eV';
    const elDB = document.getElementById('out-quantum-db');
    if (elDB) elDB.textContent = lambdaDB.toFixed(3) + ' nm';
    const elNodes = document.getElementById('out-quantum-nodes');
    if (elNodes) elNodes.textContent = `${n - 1} nút xác suất = 0 bên trong`;
  }

  function updatePolarReadouts() {
    const { alpha, hasMiddle, middleAlpha } = SIM_STATE.polar;
    const rad = (alpha * Math.PI) / 180;
    let ratio = 0;
    if (!hasMiddle) {
      ratio = 0.5 * Math.pow(Math.cos(rad), 2);
    } else {
      const rad1 = (middleAlpha * Math.PI) / 180;
      const rad2 = ((alpha - middleAlpha) * Math.PI) / 180;
      ratio = 0.5 * Math.pow(Math.cos(rad1), 2) * Math.pow(Math.cos(rad2), 2);
    }

    const elRatio = document.getElementById('out-polar-ratio');
    if (elRatio) elRatio.textContent = (ratio * 100).toFixed(1) + '% I₀';
  }

  // -------------------------------------------------------------------
  // ANIMATION LOOP & CANVAS RENDERERS
  // -------------------------------------------------------------------
  function startAnimationLoop() {
    function loop() {
      if (!document.hidden && document.getElementById('tab-visualize').classList.contains('active') && document.getElementById('lab-container-vldc').style.display !== 'none') {
        SIM_STATE.time += 0.03;
        renderActiveModule();
      }
      SIM_STATE.animId = requestAnimationFrame(loop);
    }
    loop();
  }

  function renderActiveModule() {
    switch (SIM_STATE.activeModule) {
      case 'young':
        drawYoungCanvas();
        break;
      case 'diffraction':
        drawDiffractionCanvas();
        break;
      case 'photoelectric':
        drawPhotoelectricCanvas();
        break;
      case 'compton':
        drawComptonCanvas();
        break;
      case 'quantum':
        drawQuantumCanvas();
        break;
      case 'polarization':
        drawPolarizationCanvas();
        break;
    }
  }

  // 1. YOUNG INTERFERENCE CANVAS
  function drawYoungCanvas() {
    const canvas = document.getElementById('cv-young');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { lambda, a, D, plate, e, n } = SIM_STATE.young;
    const color = wavelengthToRGB(lambda);

    // Geometry layout
    const slitX = 140;
    const screenX = W - 110;
    const midY = H / 2;
    const slitDistPx = a * 50; // visual scale
    const s1Y = midY - slitDistPx / 2;
    const s2Y = midY + slitDistPx / 2;

    // Draw Source S
    ctx.fillStyle = '#FFE600';
    ctx.beginPath();
    ctx.arc(35, midY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Nguồn S', 18, midY - 12);

    // Draw Barrier with 2 slits
    ctx.fillStyle = '#1F2937';
    ctx.fillRect(slitX - 4, 20, 8, s1Y - 26);
    ctx.fillRect(slitX - 4, s1Y + 6, 8, s2Y - s1Y - 12);
    ctx.fillRect(slitX - 4, s2Y + 6, 8, H - s2Y - 26);

    ctx.fillText('S₁', slitX - 22, s1Y + 4);
    ctx.fillText('S₂', slitX - 22, s2Y + 4);

    // Draw Thin Plate if active
    if (plate) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.7)';
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.fillRect(slitX + 6, s1Y - 10, 14, 20);
      ctx.strokeRect(slitX + 6, s1Y - 10, 14, 20);
      ctx.fillStyle = '#1D4ED8';
      ctx.font = 'bold 10px sans-serif';
      ctx.fillText('Bản mỏng (n, e)', slitX + 24, s1Y - 2);
    }

    // Circular wave ripples from S1 and S2
    ctx.save();
    ctx.beginPath();
    ctx.rect(slitX, 0, screenX - slitX, H);
    ctx.clip();

    const waveSpeed = 2.0;
    const waveSpacing = 16;
    const maxR = screenX - slitX + 50;
    for (let r = (SIM_STATE.time * waveSpeed * 10) % waveSpacing; r < maxR; r += waveSpacing) {
      ctx.strokeStyle = rgbStr(color, 0.22);
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(slitX, s1Y, r, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(slitX, s2Y, r, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    }
    ctx.restore();

    // Screen and Interference bands
    const iMm = (lambda * 1e-9 * D) / (a * 1e-3) * 1e3;
    const pxPerMm = 28;
    const iPx = iMm * pxPerMm;
    const shiftMm = plate ? ((D / (a * 1e-3)) * (n - 1.0) * (e * 1e-6) * 1e3) : 0;
    const shiftPx = shiftMm * pxPerMm;

    // Draw Screen
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(screenX, 20, 36, H - 40);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, 20, 36, H - 40);

    // Render bands on screen
    for (let y = 20; y < H - 20; y++) {
      const yRel = y - (midY - shiftPx);
      const phase = (2 * Math.PI * yRel) / iPx;
      const intensity = Math.pow(Math.cos(phase / 2), 2);
      ctx.fillStyle = rgbStr(color, intensity);
      ctx.fillRect(screenX + 2, y, 32, 1);
    }

    // Central white line
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(screenX - 8, midY - shiftPx);
    ctx.lineTo(screenX + 44, midY - shiftPx);
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Vân trung tâm k = 0', screenX - 110, midY - shiftPx - 6);
  }

  // 2. DIFFRACTION CANVAS
  function drawDiffractionCanvas() {
    const canvas = document.getElementById('cv-diffraction');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { mode, lambda, b, d } = SIM_STATE.diffraction;
    const color = wavelengthToRGB(lambda);

    const slitX = 150;
    const screenX = W - 120;
    const midY = H / 2;

    // Incident plane waves from left
    const waveSpacing = 16;
    for (let x = (SIM_STATE.time * 20) % waveSpacing; x < slitX; x += waveSpacing) {
      ctx.strokeStyle = rgbStr(color, 0.4);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, H - 40);
      ctx.stroke();
    }

    // Barrier
    ctx.fillStyle = '#1E293B';
    const bPx = b * 400; // visual scale
    ctx.fillRect(slitX - 5, 20, 10, midY - bPx / 2 - 20);
    ctx.fillRect(slitX - 5, midY + bPx / 2, 10, H - (midY + bPx / 2) - 20);

    // Screen on the right
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(screenX, 20, 36, H - 40);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(screenX, 20, 36, H - 40);

    // Diffraction bands & Intensity curve
    const scale = mode === 'single' ? (b * 60) : (d * 8);
    ctx.beginPath();
    ctx.strokeStyle = '#FF5C5C';
    ctx.lineWidth = 2;

    for (let y = 20; y < H - 20; y++) {
      const theta = ((y - midY) / 120) * 0.15;
      let I = 0;
      if (mode === 'single') {
        const beta = (Math.PI * b * 1e-3 * Math.sin(theta)) / (lambda * 1e-9);
        I = beta === 0 ? 1.0 : Math.pow(Math.sin(beta) / beta, 2);
      } else {
        const beta = (Math.PI * d * 1e-6 * Math.sin(theta)) / (lambda * 1e-9);
        const N = 5;
        const alpha = beta / N;
        const val = alpha === 0 ? 1.0 : Math.sin(N * alpha) / (N * Math.sin(alpha));
        I = Math.pow(val, 2);
      }

      ctx.fillStyle = rgbStr(color, I);
      ctx.fillRect(screenX + 2, y, 32, 1);

      // Graph curve beside screen
      const graphX = screenX - 10 - I * 80;
      if (y === 20) ctx.moveTo(graphX, y);
      else ctx.lineTo(graphX, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Đồ thị cường độ I(θ)', screenX - 100, 35);
  }

  // 3. PHOTOELECTRIC EFFECT CANVAS
  function drawPhotoelectricCanvas() {
    const canvas = document.getElementById('cv-photoelectric');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { lambda, intensity, Uak, material } = SIM_STATE.photo;
    const mat = MATERIALS[material];
    const photonEnergy = 1242 / lambda; // eV
    const hasPhoto = photonEnergy >= mat.A;
    const color = wavelengthToRGB(lambda);

    // Phototube glass bulb
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(W / 2, H / 2, 170, 110, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Cathode (C) on left
    const cX = W / 2 - 120;
    const aX = W / 2 + 120;
    ctx.fillStyle = '#475569';
    ctx.fillRect(cX - 8, H / 2 - 60, 16, 120);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.strokeRect(cX - 8, H / 2 - 60, 16, 120);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('Cathode K', cX - 60, H / 2 - 68);
    ctx.fillText(`(${mat.name})`, cX - 60, H / 2 - 52);

    // Anode (A) on right
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(aX - 4, H / 2 - 50, 8, 100);
    ctx.strokeRect(aX - 4, H / 2 - 50, 8, 100);
    ctx.fillText('Anode A', aX + 12, H / 2 - 52);

    // Incoming photons from top-left
    if (Math.random() < (intensity / 100) * 0.4) {
      SIM_STATE.photo.photons.push({
        x: cX - 70,
        y: H / 2 - 100 + Math.random() * 80,
        vx: 4.5,
        vy: 2.2
      });
    }

    // Update and draw photons
    for (let i = SIM_STATE.photo.photons.length - 1; i >= 0; i--) {
      const p = SIM_STATE.photo.photons[i];
      p.x += p.vx;
      p.y += p.vy;

      // Draw photon packet
      ctx.strokeStyle = rgbStr(color, 0.9);
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.stroke();

      // Check hit cathode
      if (p.x >= cX - 6 && p.y >= H / 2 - 60 && p.y <= H / 2 + 60) {
        SIM_STATE.photo.photons.splice(i, 1);
        if (hasPhoto) {
          // Eject electron
          const v0 = Math.sqrt(Math.max(0.1, photonEnergy - mat.A)) * 1.5;
          SIM_STATE.photo.electrons.push({
            x: cX + 8,
            y: p.y,
            vx: v0 * (0.8 + Math.random() * 0.4),
            vy: (Math.random() - 0.5) * 1.2
          });
        }
      } else if (p.x > W || p.y > H) {
        SIM_STATE.photo.photons.splice(i, 1);
      }
    }

    // Update and draw electrons
    const ax = (Uak / 5.0) * 0.08; // electric field acceleration
    for (let i = SIM_STATE.photo.electrons.length - 1; i >= 0; i--) {
      const e = SIM_STATE.photo.electrons[i];
      e.vx += ax;
      e.x += e.vx;
      e.y += e.vy;

      // Draw electron (blue circle with - symbol)
      ctx.fillStyle = '#2563EB';
      ctx.beginPath();
      ctx.arc(e.x, e.y, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('-', e.x - 2, e.y + 3);

      // Hit anode or pushed back past cathode
      if (e.x >= aX || e.x <= cX || e.y < 30 || e.y > H - 30) {
        SIM_STATE.photo.electrons.splice(i, 1);
      }
    }
  }

  // 4. COMPTON SCATTERING CANVAS
  function drawComptonCanvas() {
    const canvas = document.getElementById('cv-compton');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { theta } = SIM_STATE.compton;
    const cX = W / 2 - 30;
    const cY = H / 2;
    const rad = (theta * Math.PI) / 180;

    // Electron at origin
    ctx.fillStyle = '#2563EB';
    ctx.beginPath();
    ctx.arc(cX, cY, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Electron (e⁻) đứng yên', cX - 60, cY + 26);

    // Incident photon line
    ctx.strokeStyle = '#8B5CF6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(40, cY);
    ctx.lineTo(cX, cY);
    ctx.stroke();
    ctx.fillText('Photon tới: E = hν, p = h/λ', 50, cY - 14);

    // Scattered photon path
    const pLen = 160;
    const scX = cX + pLen * Math.cos(rad);
    const scY = cY - pLen * Math.sin(rad);

    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(scX, scY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillText(`Photon tán xạ: λ' = λ + Δλ (Góc θ = ${theta}°)`, scX - 20, scY - 10);

    // Recoil electron path
    // tan(phi) = sin(theta) / ( (1 + E/mc2)*(1 - cos theta) )
    const phiRad = Math.atan2(Math.sin(rad), (1 + 0.1) * (1 - Math.cos(rad)) + 0.5);
    const recLen = 130;
    const recX = cX + recLen * Math.cos(phiRad);
    const recY = cY + recLen * Math.sin(phiRad);

    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cX, cY);
    ctx.lineTo(recX, recY);
    ctx.stroke();
    ctx.fillText('Electron giật lùi (Động năng Ke)', recX + 8, recY + 4);

    // Angle arc
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cX, cY, 35, -rad, 0);
    ctx.stroke();
  }

  // 5. QUANTUM PARTICLE IN A BOX CANVAS
  function drawQuantumCanvas() {
    const canvas = document.getElementById('cv-quantum');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { n, a } = SIM_STATE.quantum;
    const boxX1 = 100;
    const boxX2 = W - 100;
    const boxW = boxX2 - boxX1;
    const midY = H / 2;

    // Potential well barriers
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(20, 20, boxX1 - 20, H - 40);
    ctx.fillRect(boxX2, 20, W - boxX2 - 20, H - 40);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('U = ∞', 45, midY);
    ctx.fillText('U = ∞', boxX2 + 25, midY);
    ctx.fillText('x = 0', boxX1 - 15, H - 25);
    ctx.fillText(`x = a (${a} nm)`, boxX2 - 25, H - 25);

    // Animated Standing Wave: psi_n(x, t) = sin(n*pi*x/a) * cos(omega*t)
    const omega = n * n * 0.8;
    const phase = Math.cos(SIM_STATE.time * omega);

    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let px = 0; px <= boxW; px++) {
      const xNorm = px / boxW; // 0 to 1
      const psi = Math.sin(n * Math.PI * xNorm);
      const y = midY - psi * 65 * phase;
      if (px === 0) ctx.moveTo(boxX1 + px, y);
      else ctx.lineTo(boxX1 + px, y);
    }
    ctx.stroke();

    // Probability Density |psi|^2
    ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(boxX1, midY);

    for (let px = 0; px <= boxW; px++) {
      const xNorm = px / boxW;
      const psiSq = Math.pow(Math.sin(n * Math.PI * xNorm), 2);
      const y = midY - psiSq * 75;
      ctx.lineTo(boxX1 + px, y);
    }
    ctx.lineTo(boxX2, midY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Node dots where probability = 0
    for (let k = 1; k < n; k++) {
      const nodeX = boxX1 + (k / n) * boxW;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.arc(nodeX, midY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText(`Hàm sóng ψ(x, t) [Xanh] và Mật độ xác suất |ψ|² [Đỏ] (Mức n = ${n})`, boxX1, 35);
  }

  // 6. POLARIZATION & MALUS LAW CANVAS
  function drawPolarizationCanvas() {
    const canvas = document.getElementById('cv-polarization');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const { alpha, hasMiddle, middleAlpha } = SIM_STATE.polar;
    const rad = (alpha * Math.PI) / 180;
    const midY = H / 2;

    const p1X = 140;
    const p2X = W - 180;
    const middleX = (p1X + p2X) / 2;

    // 1. Unpolarized light entering from left
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 1.5;
    for (let x = 40; x < p1X - 20; x += 30) {
      ctx.beginPath();
      ctx.arc(x, midY, 14, 0, Math.PI * 2);
      ctx.moveTo(x - 14, midY); ctx.lineTo(x + 14, midY);
      const angle = hasMiddle && x > middleX ? middleAlpha * Math.PI / 180 : 0;
      ctx.moveTo(x - 14 * Math.sin(angle), midY - 14 * Math.cos(angle));
      ctx.lineTo(x + 14 * Math.sin(angle), midY + 14 * Math.cos(angle));
      ctx.stroke();
    }
    ctx.fillStyle = '#000';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('Ánh sáng tự nhiên (I₀)', 35, midY - 26);

    // 2. Polarizer P1 (Vertical transmission axis)
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(p1X - 8, midY - 60, 16, 120);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(p1X - 8, midY - 60, 16, 120);
    // Vertical line
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p1X, midY - 50); ctx.lineTo(p1X, midY + 50);
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.fillText('Kính phân cực P₁', p1X - 45, midY - 70);

    // Light between P1 and P2 (Linear polarized, vertical)
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    for (let x = p1X + 25; x < p2X - 25; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, midY - 14); ctx.lineTo(x, midY + 14);
      ctx.stroke();
    }
    ctx.fillText('Phân cực thẳng (I₁ = I₀/2)', p1X + 30, midY - 24);

    if (hasMiddle) {
      ctx.save();
      ctx.translate(middleX, midY);
      ctx.fillStyle = '#DCFCE7';
      ctx.fillRect(-8, -60, 16, 120);
      ctx.strokeStyle = '#000';
      ctx.strokeRect(-8, -60, 16, 120);
      ctx.rotate(-middleAlpha * Math.PI / 180);
      ctx.strokeStyle = '#16A34A';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -50); ctx.lineTo(0, 50);
      ctx.stroke();
      ctx.restore();
      ctx.fillStyle = '#000';
      ctx.fillText('Kính giữa 45°', middleX - 40, midY + 80);
    }

    // 3. Analyzer P2 (Rotatable by angle alpha)
    ctx.save();
    ctx.translate(p2X, midY);
    ctx.fillStyle = '#FEF3C7';
    ctx.fillRect(-10, -60, 20, 120);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-10, -60, 20, 120);

    // Rotated axis line
    ctx.rotate(-rad);
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -50); ctx.lineTo(0, 50);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#000';
    ctx.fillText(`Kính phân tích P₂ (Góc α = ${alpha}°)`, p2X - 60, midY - 70);

    // 4. Output beam
    const middleRad = middleAlpha * Math.PI / 180;
    const intensityRatio = hasMiddle
      ? 0.5 * Math.pow(Math.cos(middleRad), 2) * Math.pow(Math.cos(rad - middleRad), 2)
      : 0.5 * Math.pow(Math.cos(rad), 2);
    ctx.fillStyle = `rgba(245, 158, 11, ${intensityRatio * 2})`;
    ctx.fillRect(p2X + 20, midY - 16, 80, 32);
    ctx.strokeStyle = '#000';
    ctx.strokeRect(p2X + 20, midY - 16, 80, 32);

    ctx.fillStyle = '#000';
    ctx.fillText(`I = ${(intensityRatio * 100).toFixed(1)}% I₀`, p2X + 30, midY + 36);
  }

  // Global expose
  window.initPhysicsLab = initLab;

  // Auto-init on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLab);
  } else {
    initLab();
  }
})();
