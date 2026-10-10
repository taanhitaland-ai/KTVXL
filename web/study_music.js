/* Personal music library. External players load only after an explicit play. */
(function() {
  'use strict';
  const L = window.KMA_MUSIC_LIBRARY, KEY = 'kma_study_music_v1';
  const DEMO_3107 = [
    { title: 'W/n · Text 07 (ft. 267)', url: 'https://www.youtube.com/watch?v=OA8s2Gr3KEE&list=PLpk-GWLWHFtb8bfhdHMI_8OS5zCzvWgXV' },
    { title: 'W/n · a b c d x y z n m a s a d (song 24)', url: 'https://www.youtube.com/watch?v=rDpJfmBI9xQ&list=PLpk-GWLWHFtb8bfhdHMI_8OS5zCzvWgXV&index=2' },
    { title: 'W/n · 3107 (ft. Nâu, Duongg)', url: 'https://www.youtube.com/watch?v=V5GS5ANG96M&list=PLpk-GWLWHFtb8bfhdHMI_8OS5zCzvWgXV&index=5' }
  ];
  const $ = id => document.getElementById(id);
  if (!L || !$('side-tab-music')) return;
  let state;
  try { state = L.restore(localStorage.getItem(KEY)); } catch { state = L.restore(null); }
  const audio = $('study-music-audio');
  let playing = false, pending = false, loadedId = null, editingId = null, removed = null;
  let revision = 0, youtube = null, youtubeReady = null, apiLoading = null, history = [], storageFailed = false;
  const current = () => state.tracks.find(item => item.id === state.selectedId);
  function status(message, error = false) {
    $('music-status').textContent = message + (storageFailed ? ' Danh sách chưa lưu được trên máy; hiện chỉ dùng trong lần mở này.' : '');
    $('music-status').dataset.error = String(error || storageFailed);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ version: 1, ...state })); storageFailed = false; }
    catch { storageFailed = true; status('Chưa lưu được danh sách.', true); }
  }
  function renderList() {
    const active = document.activeElement;
    const focused = active?.closest('.music-track')?.dataset.trackId;
    const action = active?.dataset.action;
    const list = $('music-list'), result = L.search(state.tracks, $('music-search').value);
    list.replaceChildren();
    $('music-count').textContent = result.length === state.tracks.length ? state.tracks.length + ' bài' : result.length + '/' + state.tracks.length + ' bài';
    if (!result.length) {
      const empty = document.createElement('li'); empty.className = 'music-empty';
      empty.textContent = state.tracks.length ? 'Không tìm thấy bài phù hợp. Thử từ khóa khác nhé.' : '🎧 Góc nhạc còn trống. Dán link đầu tiên để tạo danh sách của bạn.';
      list.appendChild(empty);
    }
    for (const item of result) {
      const row = document.createElement('li'); row.className = 'music-track' + (item.id === state.selectedId ? ' current' : ''); row.dataset.trackId = item.id;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'music-track-play'; button.dataset.action = 'play';
      button.setAttribute('aria-label', 'Phát ' + item.title); button.setAttribute('aria-current', String(item.id === state.selectedId));
      const icon = document.createElement('span'); icon.className = 'music-track-icon'; icon.textContent = item.id === state.selectedId && playing ? '♫' : item.kind === 'youtube' ? '▶' : '♪'; icon.setAttribute('aria-hidden', 'true');
      const label = document.createElement('span'), title = document.createElement('strong'), source = document.createElement('small');
      title.textContent = item.title; source.textContent = item.kind === 'youtube' ? 'YouTube' : 'Tệp âm thanh';
      label.append(title, source); button.append(icon, label); row.appendChild(button);
      for (const [actionName, text, name] of [['edit', '✎', 'Sửa'], ['delete', '×', 'Xóa']]) {
        const actionButton = document.createElement('button'); actionButton.type = 'button'; actionButton.className = 'music-row-action'; actionButton.dataset.action = actionName;
        actionButton.textContent = text; actionButton.setAttribute('aria-label', name + ' ' + item.title); actionButton.title = name + ' bài'; row.appendChild(actionButton);
      }
      list.appendChild(row);
    }
    if (focused && action) {
      const row = [...list.children].find(item => item.dataset.trackId === focused);
      if (document.activeElement === document.body) row?.querySelector('[data-action="' + action + '"]')?.focus({ preventScroll: true });
    }
  }
  function render() {
    const item = current();
    $('music-now').textContent = item?.title || 'Chọn một bài để bắt đầu';
    if ($('music-video-dock')) $('music-video-dock').hidden = true;
    $('music-source').hidden = !item;
    if (item) { $('music-source').href = item.url; $('music-source').textContent = (item.kind === 'youtube' ? 'Mở trên YouTube' : 'Mở tệp âm thanh') + ' ↗'; }
    $('music-play').disabled = !item;
    $('music-prev').disabled = !item; $('music-next').disabled = !item;
    $('music-play').textContent = pending ? '■ Hủy tải' : playing ? 'Ⅱ Tạm dừng' : '▶ Phát';
    $('music-play').setAttribute('aria-label', pending ? 'Hủy tải nhạc' : playing ? 'Tạm dừng nhạc' : 'Phát nhạc');
    $('music-volume').value = state.volume; $('music-volume-value').textContent = state.volume + '%';
    $('music-shuffle').setAttribute('aria-pressed', String(state.shuffle));
    $('music-repeat').setAttribute('aria-pressed', String(state.repeat !== 'off'));
    $('music-repeat').textContent = { off: '↻ Không lặp', all: '↻ Lặp danh sách', one: '↻ Lặp bài này' }[state.repeat];
    $('music-export').disabled = !state.tracks.length;
    renderList(); updateProgress();
  }
  function showVideo(show) {
    if ($('music-video-dock')) $('music-video-dock').hidden = true;
    document.body.classList.remove('music-video-open');
  }
  function pause(message) {
    revision++; pending = false; playing = false;
    audio.pause();
    try { youtube?.pauseVideo(); } catch { /* Player may still be initializing. */ }
    if (message) status(message);
    render();
  }
  function fail(message) { pause(); status(message, true); }
  function loadAPI() {
    if (window.YT?.Player) return Promise.resolve();
    if (apiLoading) return apiLoading;
    apiLoading = new Promise((resolve, reject) => {
      const old = window.onYouTubeIframeAPIReady;
      const script = document.createElement('script'); script.src = 'https://www.youtube.com/iframe_api'; script.async = true;
      const finish = error => {
        clearTimeout(timeout); script.onerror = null;
        if (error) { apiLoading = null; script.remove(); reject(error); } else resolve();
      };
      const timeout = setTimeout(() => finish(new Error('Không tải được YouTube. Kiểm tra mạng rồi nhấn Phát để thử lại.')), 15000);
      window.onYouTubeIframeAPIReady = () => { try { old?.(); } finally { finish(); } };
      script.onerror = () => finish(new Error('Không kết nối được YouTube. Kiểm tra mạng hoặc dùng link âm thanh trực tiếp.'));
      document.head.appendChild(script);
    });
    return apiLoading;
  }
  async function getYouTube() {
    await loadAPI();
    if (youtubeReady) return youtubeReady;
    youtubeReady = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        try { youtube?.destroy(); } catch {}
        youtube = null; youtubeReady = null;
        $('music-youtube-host').replaceChildren(Object.assign(document.createElement('div'), { id: 'music-youtube-player' }));
        reject(new Error('Trình phát YouTube chưa sẵn sàng. Nhấn Phát để thử lại.'));
      }, 15000);
      youtube = new YT.Player('music-youtube-player', {
        width: '200', height: '200', host: 'https://www.youtube-nocookie.com',
        playerVars: { playsinline: 1, controls: 0, origin: location.origin },
        events: {
          onReady: event => { clearTimeout(timer); event.target.setVolume(state.volume); resolve(event.target); },
          onStateChange: event => {
            if (current()?.kind !== 'youtube' || loadedId !== state.selectedId || event.target.getVideoData()?.video_id !== current().videoId) return;
            if (event.data === YT.PlayerState.PLAYING) { playing = true; pending = false; status('Đang phát nền · ' + current().title); render(); }
            else if (event.data === YT.PlayerState.PAUSED) { playing = false; pending = false; render(); }
            else if (event.data === YT.PlayerState.ENDED) { playing = false; advance(true); }
          },
          onError: event => {
            if (current()?.kind !== 'youtube') return;
            const messages = { 2: 'Link video chưa hợp lệ.', 5: 'Trình duyệt chưa phát được video này.', 100: 'Video đã bị xóa hoặc chuyển sang riêng tư.', 101: 'YouTube không cho phép phát nhúng bài này.', 150: 'YouTube không cho phép phát nhúng bài này.', 153: 'YouTube chưa nhận diện được trang phát. Hãy mở trang trực tiếp hoặc dùng link âm thanh.' };
            fail((messages[event.data] || 'Không phát được bài này.') + ' Bạn có thể chọn bài khác hoặc mở nguồn nhạc.');
          },
          onAutoplayBlocked: () => { pending = false; playing = false; status('Nhấn nút ▶ Phát để bắt đầu.'); render(); }
        }
      });
    });
    return youtubeReady;
  }
  async function play() {
    const item = current(); if (!item) return;
    const token = ++revision; pending = true; status('Đang tải · ' + item.title); render();
    try {
      if (item.kind === 'audio') {
        showVideo(false); youtube?.pauseVideo();
        if (loadedId !== item.id) { audio.src = item.url; audio.load(); loadedId = item.id; }
        audio.volume = state.volume / 100;
        await audio.play();
        if (token !== revision) return;
        playing = true; pending = false; status('Đang phát nền · ' + item.title); render();
      } else {
        audio.pause(); showVideo(false);
        const player = await getYouTube();
        if (token !== revision || current()?.id !== item.id) return;
        loadedId = item.id; player.setVolume(state.volume); player.unMute();
        if (player.getVideoData()?.video_id === item.videoId) player.playVideo();
        else player.loadVideoById(item.videoId);
        pending = false; status('Đang phát nền · ' + item.title); render();
      }
    } catch (error) {
      if (token !== revision) return;
      fail(error.name === 'NotAllowedError' ? 'Trình duyệt chưa cho phép phát. Nhấn Phát thêm một lần để bắt đầu.' : error.message || 'Không tải được âm thanh. Kiểm tra link rồi thử lại.');
    }
  }
  function choose(id, autoplay = true, addHistory = true) {
    if (!state.tracks.some(item => item.id === id)) return;
    const before = state.selectedId;
    pause();
    if (before && before !== id && addHistory) history.push(before);
    state.selectedId = id;
    if (before !== id) loadedId = null;
    save(); render();
    if (autoplay) play(); else status('Sẵn sàng · ' + current().title);
  }
  function advance(automatic = false, direction = 1) {
    if (direction === -1 && position().elapsed > 3) { seek(0); return; }
    let id;
    if (direction === -1 && state.shuffle && history.length) {
      while (history.length && !id) { const candidate = history.pop(); if (state.tracks.some(item => item.id === candidate)) id = candidate; }
    }
    id ||= L.next(state.tracks, state.selectedId, { automatic, direction, repeat: state.repeat, shuffle: state.shuffle });
    if (!id) { pause('Đã nghe hết danh sách. Nhấn Phát để nghe lại bài này.'); return; }
    if (id === state.selectedId && loadedId === id) seek(0);
    choose(id, true, direction !== -1);
  }
  function position() {
    if (!current() || loadedId !== state.selectedId) return { elapsed: 0, duration: 0 };
    if (current().kind === 'audio') return { elapsed: audio.currentTime || 0, duration: Number.isFinite(audio.duration) ? audio.duration : 0 };
    try { return { elapsed: youtube?.getCurrentTime() || 0, duration: youtube?.getDuration() || 0 }; } catch { return { elapsed: 0, duration: 0 }; }
  }
  function updateProgress() {
    if (document.visibilityState !== 'visible') return;
    const { elapsed, duration } = position();
    const elapsedText = L.time(elapsed), durationText = duration ? L.time(duration) : current()?.kind === 'youtube' && loadedId ? 'Trực tiếp' : '0:00';
    if ($('music-elapsed').textContent !== elapsedText) $('music-elapsed').textContent = elapsedText;
    if ($('music-duration').textContent !== durationText) $('music-duration').textContent = durationText;
    $('music-seek').disabled = duration <= 0;
    if (document.activeElement !== $('music-seek')) $('music-seek').value = duration ? Math.round(elapsed / duration * 1000) : 0;
    const label = elapsedText + ' / ' + L.time(duration);
    if ($('music-seek').getAttribute('aria-valuetext') !== label) $('music-seek').setAttribute('aria-valuetext', label);
  }
  function seek(seconds) {
    const { duration } = position();
    if (!Number.isFinite(seconds) || !duration) return;
    const value = Math.max(0, Math.min(duration, seconds));
    if (current()?.kind === 'audio') audio.currentTime = value; else youtube?.seekTo(value, true);
    updateProgress();
  }
  function cancelEdit() {
    editingId = null; $('music-add-form').reset(); $('music-add').textContent = '＋ Thêm bài'; $('music-cancel-edit').hidden = true;
  }
  $('music-add-form').addEventListener('submit', event => {
    event.preventDefault();
    try {
      const item = L.track({ url: $('music-url').value, title: $('music-title').value }, editingId || crypto.randomUUID?.() || 'track-' + Date.now());
      const duplicate = state.tracks.find(t => t.key === item.key && t.id !== editingId);
      if (duplicate) { status('Bài này đã có trong danh sách: ' + duplicate.title, true); return; }
      if (editingId) {
        const previous = state.tracks.find(t => t.id === editingId);
        if (!previous) { cancelEdit(); return; }
        const changedSource = previous.key !== item.key;
        if (item.id === state.selectedId && changedSource) { pause(); loadedId = null; showVideo(false); }
        state.tracks = state.tracks.map(t => t.id === item.id ? item : t);
      } else {
        if (state.tracks.length >= 500) throw new Error('Danh sách đã đủ 500 bài. Hãy xóa bớt trước khi thêm.');
        state.tracks.push(item); state.selectedId ||= item.id;
      }
      const edited = !!editingId; cancelEdit(); save(); render(); status((edited ? 'Đã lưu · ' : 'Đã thêm · ') + item.title);
    } catch (error) { status(error.message, true); }
  });
  $('music-cancel-edit').addEventListener('click', cancelEdit);
  $('music-list').addEventListener('click', event => {
    const button = event.target.closest('[data-action]'), row = button?.closest('[data-track-id]');
    const item = state.tracks.find(t => t.id === row?.dataset.trackId); if (!item) return;
    if (button.dataset.action === 'play') choose(item.id);
    if (button.dataset.action === 'edit') {
      editingId = item.id; $('music-url').value = item.url; $('music-title').value = item.title;
      $('music-add').textContent = 'Lưu thay đổi'; $('music-cancel-edit').hidden = false; $('music-title').focus();
      $('music-add-form').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    if (button.dataset.action === 'delete') {
      const index = state.tracks.indexOf(item), wasPlaying = playing || pending;
      removed = { item, index }; state.tracks.splice(index, 1); $('music-undo').hidden = false;
      if (editingId === item.id) cancelEdit();
      if (state.selectedId === item.id) {
        pause(); loadedId = null; showVideo(false);
        state.selectedId = state.tracks[Math.min(index, state.tracks.length - 1)]?.id || null;
        if (wasPlaying && state.selectedId) play();
      }
      save(); render(); status('Đã xóa · ' + item.title);
    }
  });
  $('music-undo').addEventListener('click', () => {
    if (!removed) return;
    if (state.tracks.length >= 500) { status('Danh sách đã đầy; xóa bớt trước khi hoàn tác.', true); return; }
    if (state.tracks.some(item => item.key === removed.item.key)) { removed = null; $('music-undo').hidden = true; status('Bài này đã có lại trong danh sách.'); return; }
    state.tracks.splice(Math.min(removed.index, state.tracks.length), 0, removed.item); state.selectedId ||= removed.item.id;
    removed = null; $('music-undo').hidden = true; save(); render(); status('Đã khôi phục bài vừa xóa.');
  });
  $('music-search').addEventListener('input', renderList);
  $('music-play').addEventListener('click', () => playing || pending ? pause('Đã tạm dừng.') : play());
  $('music-prev').addEventListener('click', () => advance(false, -1)); $('music-next').addEventListener('click', () => advance());
  $('music-seek').addEventListener('change', () => seek(Number($('music-seek').value) / 1000 * position().duration));
  $('music-volume').addEventListener('input', () => {
    state.volume = Number($('music-volume').value); audio.volume = state.volume / 100; youtube?.setVolume(state.volume);
    $('music-volume-value').textContent = state.volume + '%'; save();
  });
  $('music-shuffle').addEventListener('click', () => { state.shuffle = !state.shuffle; save(); render(); });
  $('music-repeat').addEventListener('click', () => { state.repeat = { off: 'all', all: 'one', one: 'off' }[state.repeat]; save(); render(); });
  $('music-export').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, tracks: state.tracks.map(({ title, url }) => ({ title, url })) }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'danh-sach-nhac-chill.json'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); status('Đã xuất danh sách. Bạn có thể gửi tệp này cho bạn bè để nhập vào.');
  });
  $('music-import').addEventListener('click', () => $('music-import-file').click());
  $('music-import-file').addEventListener('change', async () => {
    const file = $('music-import-file').files[0]; if (!file) return;
    try {
      if (file.size > 1024 * 1024) throw new Error('Tệp danh sách quá lớn. Chỉ nhận tệp JSON dưới 1 MB.');
      const data = JSON.parse(await file.text()), before = state.tracks.length;
      state.tracks = L.merge(state.tracks, Array.isArray(data) ? data : data.tracks);
      state.selectedId ||= state.tracks[0]?.id || null; save(); render(); status('Đã nhập ' + (state.tracks.length - before) + ' bài mới; bỏ qua bài trùng.');
    } catch (error) { status('Chưa nhập được danh sách: ' + error.message, true); }
    finally { $('music-import-file').value = ''; }
  });
  $('music-video-close').addEventListener('click', () => { pause('Đã tạm dừng video YouTube.'); showVideo(false); });
  audio.addEventListener('ended', () => { if (current()?.kind === 'audio') { playing = false; advance(true); } });
  audio.addEventListener('error', () => {
    if (current()?.kind === 'audio' && loadedId === state.selectedId) fail('Không phát được tệp âm thanh. Link có thể đã hết hạn, sai định dạng hoặc máy chủ không cho phát. Hãy chọn bài khác.');
  });
  audio.addEventListener('pause', () => { if (current()?.kind === 'audio' && !pending) { playing = false; render(); } });
  audio.addEventListener('playing', () => { if (current()?.kind === 'audio') { playing = true; pending = false; render(); } });
  audio.addEventListener('timeupdate', updateProgress); audio.addEventListener('loadedmetadata', updateProgress);
  audio.volume = state.volume / 100; render();
  const demoButton = document.createElement('button'); demoButton.type = 'button'; demoButton.id = 'music-add-3107';
  demoButton.className = 'neo-btn neo-btn-white neo-btn-sm music-pomo-shortcut'; demoButton.textContent = '＋ Thêm 3 bài W/n · 3107';
  function addDemo() {
    const before = state.tracks.length;
    try {
      state.tracks = L.merge(state.tracks, DEMO_3107); state.selectedId ||= state.tracks[0]?.id || null;
      save(); render(); status('Đã thêm ' + (state.tracks.length - before) + ' bài W/n vào danh sách của bạn.');
    } catch(error) { status(error.message, true); }
  }
  demoButton.addEventListener('click', addDemo); $('side-tab-music').appendChild(demoButton);
  function openDemo() {
    if (new URLSearchParams(location.search).get('musicdemo') !== '3107') return;
    try {
      if (localStorage.getItem('kma_music_demo3107_v1') !== 'added') {
        const wasEmpty = state.tracks.length === 0;
        addDemo();
        if (wasEmpty) { state.selectedId = state.tracks.find(item => item.videoId === 'V5GS5ANG96M')?.id || state.selectedId; save(); render(); }
        localStorage.setItem('kma_music_demo3107_v1', 'added');
      }
    } catch { addDemo(); }
    window.KMA_SCHEDULE_POMODORO?.toggleSideDrawer(true);
    document.querySelector('[data-drawer-tab="side-tab-music"]').click();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', openDemo); else openDemo();
  // Read-only state is useful for diagnostics without exposing mutable internals.
  window.KMA_STUDY_MUSIC = { snapshot: () => ({ ...state, tracks: state.tracks.map(item => ({ ...item })), playing, pending, ...position() }) };
  setInterval(updateProgress, 500);
})();
