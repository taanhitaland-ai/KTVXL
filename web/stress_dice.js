/**
 * ═══════════════════════════════════════════════════════════════
 * GÓC XẢ STRESS: TUNG XÚC XẮC 3D (STRESS RELIEF 3D DICE)
 * Hiệu ứng vật lý 3D chân thực, âm thanh Web Audio sống động &
 * quẻ may mắn xả stress cho sinh viên KMA.
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // Face rotations for target face 1..6
  const FACE_ROTATIONS = {
    1: { x: 0, y: 0 },
    2: { x: -90, y: 0 },
    3: { x: 0, y: 90 },
    4: { x: 0, y: -90 },
    5: { x: 90, y: 0 },
    6: { x: -180, y: 0 }
  };

  // Quotes and blessings for stress relief
  const BLESSINGS_DOUBLE_6 = [
    '✨ Đôi 6 cực phẩm! Vũ trụ báo hiệu bạn sẽ ẵm trọn 10 điểm A+ thi cuối kỳ!',
    '🔥 Song Lục hoàng kim! Đề thi sẽ trúng tủ 100% phần bạn vừa ôn luyện!',
    '🌟 Đỉnh cao may mắn! Tự tin vào phòng thi, qua môn rực rỡ không cần bàn cãi!'
  ];

  const BLESSINGS_DOUBLE = [
    '🎯 Tung được số kép! Điểm số kỳ này chắc chắn nhân đôi so với kỳ vọng!',
    '🍀 Số đôi phát lộc! Trực giác hôm nay cực chuẩn, gặp câu phân vân cứ tin vào linh cảm!',
    '⚡ Cặp bài trùng! Sự kiên trì và chăm chỉ của bạn sắp hái quả ngọt rồi!'
  ];

  const BLESSINGS_LUCKY_7 = [
    '🌈 Con số 7 diệu kỳ! May mắn ngập tràn, bình tĩnh làm bài là điểm cao chót vót!',
    '✨ Số 7 thượng cát! Mọi áp lực tan biến, đầu óc minh mẫn thông thái phi thường!',
    '🌟 Lucky 7! Thần may mắn đang đồng hành cùng bạn trên từng con số và trang sách!'
  ];

  const BLESSINGS_HIGH = [
    '💎 Điểm số rất cao! Kiến thức đã ngấm sâu vào trí nhớ, tự tin lên bạn nhé!',
    '🚀 Phong độ chạm đỉnh! Nghỉ giải lao một ngụm nước rồi chinh phục tiếp nào!',
    '🎉 Quẻ đại cát: Giữ vững nhịp độ này, bạn sinh ra là để đạt điểm giỏi môn này!'
  ];

  const BLESSINGS_GENERAL = [
    '☕ Xả stress thành công! Hít một hơi thật sâu, thở ra nhẹ nhõm và mỉm cười nào!',
    '🌱 Vạn sự khởi đầu nan, gian nan đừng nản! Mỗi câu bạn làm là một bước tới A+!',
    '💪 Căng thẳng là tạm thời, bảng điểm A mới là mãi mãi! Cố lên nhé!',
    '💧 Nhớ uống một ngụm nước và chớp mắt thư giãn 10 giây nhé bạn ơi!',
    '🌸 Tâm bất biến giữa dòng đời vạn biến, đề thi có khó cũng không làm khó được bạn!',
    '☀️ Hôm nay học một chút, ngày mai học một chút, kiến thức sẽ đong đầy!',
    '🧠 Bộ não của bạn đã nạp thêm năng lượng! Sẵn sàng cho câu hỏi tiếp theo chưa?',
    '🎈 Thả lỏng hai vai, thư giãn cổ một chút nào! Bạn đang làm rất tốt đấy!'
  ];

  // Sound Engine using native Web Audio API
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playDiceRollSound() {
    if (localStorage.getItem('kma_dice_sound') === 'false') return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      // Sequence of realistic clacks
      const clackTimes = [0, 0.08, 0.18, 0.32, 0.50, 0.72, 0.95];

      clackTimes.forEach((delay, index) => {
        const time = now + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        // Realistic pitch variation
        const baseFreq = index === clackTimes.length - 1 ? 420 : 600 + Math.random() * 400;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, time);
        osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, time + 0.04);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200 + Math.random() * 600, time);
        filter.Q.setValueAtTime(3, time);

        // Quick attack and snappy decay
        const vol = (0.28 - (index * 0.025)) * (index === clackTimes.length - 1 ? 1.3 : 1);
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(vol, time + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + 0.05);
      });
    } catch {
      // Audio not supported or blocked by browser policy
    }
  }

  // State
  let isRolling = false;
  let diceCount = parseInt(localStorage.getItem('kma_dice_count') || '2', 10);
  if (diceCount !== 1 && diceCount !== 2) diceCount = 2;

  // Cumulative rotation tracking to allow endless smooth rolling
  const currentRotations = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: 0 }
  };

  function initDice() {
    const card = document.getElementById('stress-relief-box');
    if (!card) return;

    const btnRoll = document.getElementById('btn-roll-dice');
    const stage = document.getElementById('dice-stage');
    const btnSound = document.getElementById('btn-dice-sound');
    const btnCount = document.getElementById('btn-toggle-dice-dicecount');
    const btnCollapse = document.getElementById('btn-toggle-stress-collapse');
    const wrap2 = document.getElementById('dice-wrap-2');

    // Restore Sound setting
    const soundEnabled = localStorage.getItem('kma_dice_sound') !== 'false';
    if (btnSound) {
      btnSound.textContent = soundEnabled ? '🔊' : '🔇';
      btnSound.title = soundEnabled ? 'Âm thanh: BẬT (Bấm để tắt)' : 'Âm thanh: TẮT (Bấm để bật)';
      btnSound.addEventListener('click', (e) => {
        e.stopPropagation();
        const cur = localStorage.getItem('kma_dice_sound') !== 'false';
        const next = !cur;
        localStorage.setItem('kma_dice_sound', String(next));
        btnSound.textContent = next ? '🔊' : '🔇';
        btnSound.title = next ? 'Âm thanh: BẬT (Bấm để tắt)' : 'Âm thanh: TẮT (Bấm để bật)';
      });
    }

    // Restore Dice Count
    updateDiceCountUI(wrap2, btnCount);
    if (btnCount) {
      btnCount.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isRolling) return;
        diceCount = diceCount === 2 ? 1 : 2;
        localStorage.setItem('kma_dice_count', String(diceCount));
        updateDiceCountUI(wrap2, btnCount);
      });
    }

    // Restore Collapse
    const isCollapsed = localStorage.getItem('kma_dice_collapsed') === 'true';
    if (isCollapsed) {
      card.classList.add('collapsed');
      if (btnCollapse) btnCollapse.textContent = '▲';
    }
    if (btnCollapse) {
      btnCollapse.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowCollapsed = card.classList.toggle('collapsed');
        localStorage.setItem('kma_dice_collapsed', String(nowCollapsed));
        btnCollapse.textContent = nowCollapsed ? '▲' : '▼';
        btnCollapse.title = nowCollapsed ? 'Mở rộng góc xả stress' : 'Thu gọn góc xả stress';
      });
    }

    // Roll Triggers
    if (btnRoll) btnRoll.addEventListener('click', rollDice);
    if (stage) stage.addEventListener('click', rollDice);

    // Initial resting positions (both showing 6)
    setRestingDice(1, 6);
    if (diceCount === 2) setRestingDice(2, 6);
  }

  function updateDiceCountUI(wrap2, btnCount) {
    if (wrap2) wrap2.style.display = diceCount === 1 ? 'none' : 'block';
    if (btnCount) {
      btnCount.textContent = diceCount === 1 ? '1 🎲' : '2 🎲';
      btnCount.title = diceCount === 1 ? 'Đang dùng 1 xúc xắc (Bấm để đổi sang 2)' : 'Đang dùng 2 xúc xắc (Bấm để đổi sang 1)';
    }
  }

  function setRestingDice(diceNum, val) {
    const cube = document.getElementById(`dice-cube-${diceNum}`);
    if (!cube) return;
    const base = FACE_ROTATIONS[val] || { x: 0, y: 0 };
    currentRotations[diceNum] = { x: base.x, y: base.y };
    cube.style.transform = `rotateX(${base.x}deg) rotateY(${base.y}deg)`;
    cube.setAttribute('data-val', String(val));
  }

  function rollDice() {
    if (isRolling) return;
    isRolling = true;

    const btnRoll = document.getElementById('btn-roll-dice');
    const stage = document.getElementById('dice-stage');
    const scoreBadge = document.getElementById('stress-score');
    const quoteEl = document.getElementById('stress-quote');

    if (btnRoll) {
      btnRoll.disabled = true;
      btnRoll.textContent = '🎲 ĐANG NÉM...';
    }
    if (scoreBadge) {
      scoreBadge.classList.remove('pop');
      scoreBadge.textContent = '🎲 Đang tung...';
    }
    if (stage) stage.classList.remove('celebrate');

    // Play realistic sound
    playDiceRollSound();

    // Generate random values 1..6
    const val1 = Math.floor(Math.random() * 6) + 1;
    const val2 = Math.floor(Math.random() * 6) + 1;

    // Roll Dice 1
    animateCube(1, val1);

    // Roll Dice 2 (if enabled)
    if (diceCount === 2) {
      animateCube(2, val2);
    }

    // Animation ends after 1.1s
    setTimeout(() => {
      isRolling = false;
      if (btnRoll) {
        btnRoll.disabled = false;
        btnRoll.textContent = '🎲 NÉM XÚC XẮC';
      }

      // Calculate result and show blessing
      const total = diceCount === 2 ? (val1 + val2) : val1;
      let quote = '';
      let isSpecial = false;

      if (diceCount === 2) {
        if (val1 === 6 && val2 === 6) {
          quote = pickRandom(BLESSINGS_DOUBLE_6);
          isSpecial = true;
        } else if (val1 === val2) {
          quote = pickRandom(BLESSINGS_DOUBLE);
          isSpecial = true;
        } else if (total === 7) {
          quote = pickRandom(BLESSINGS_LUCKY_7);
          isSpecial = true;
        } else if (total >= 10) {
          quote = pickRandom(BLESSINGS_HIGH);
          isSpecial = true;
        } else {
          quote = pickRandom(BLESSINGS_GENERAL);
        }
      } else {
        if (val1 === 6) {
          quote = pickRandom(BLESSINGS_DOUBLE_6);
          isSpecial = true;
        } else if (val1 >= 4) {
          quote = pickRandom(BLESSINGS_HIGH);
        } else {
          quote = pickRandom(BLESSINGS_GENERAL);
        }
      }

      if (scoreBadge) {
        scoreBadge.textContent = diceCount === 2 ? `🎲 ${val1} + ${val2} = ${total} điểm!` : `🎲 ${val1} điểm!`;
        scoreBadge.classList.add('pop');
      }

      if (quoteEl) {
        quoteEl.textContent = quote;
      }

      if (isSpecial && stage) {
        stage.classList.add('celebrate');
      }
    }, 1120);
  }

  function animateCube(diceNum, targetVal) {
    const wrap = document.getElementById(`dice-wrap-${diceNum}`);
    const cube = document.getElementById(`dice-cube-${diceNum}`);
    if (!wrap || !cube) return;

    // Restart bounce animation
    wrap.classList.remove('rolling');
    void wrap.offsetWidth; // Force reflow
    wrap.classList.add('rolling');

    // Calculate rotation with physical momentum
    const target = FACE_ROTATIONS[targetVal];
    const prev = currentRotations[diceNum];

    // Add 3-4 full 360-degree spins plus target face delta
    const extraSpinsX = (3 + Math.floor(Math.random() * 2)) * 360;
    const extraSpinsY = (3 + Math.floor(Math.random() * 2)) * 360;

    // Normalize to keep spins progressing forward
    const nextX = prev.x + extraSpinsX + (target.x - (prev.x % 360));
    const nextY = prev.y + extraSpinsY + (target.y - (prev.y % 360));

    currentRotations[diceNum] = { x: nextX, y: nextY };
    cube.style.transform = `rotateX(${nextX}deg) rotateY(${nextY}deg)`;
    cube.setAttribute('data-val', String(targetVal));
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDice);
  } else {
    initDice();
  }

  // Expose API for testing / external control
  window.KMA_STRESS_DICE = {
    roll: rollDice,
    setDiceCount: (n) => {
      diceCount = n === 1 ? 1 : 2;
      localStorage.setItem('kma_dice_count', String(diceCount));
      const wrap2 = document.getElementById('dice-wrap-2');
      const btnCount = document.getElementById('btn-toggle-dice-dicecount');
      updateDiceCountUI(wrap2, btnCount);
    }
  };
})();
