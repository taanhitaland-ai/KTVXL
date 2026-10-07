(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.KMA_MUSIC_LIBRARY = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  'use strict';
  const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com']);
  function source(value) {
    let url;
    try { url = new URL(String(value).trim()); } catch { throw new Error('Link chưa hợp lệ. Hãy dán đầy đủ https://…'); }
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Chỉ nhận link YouTube hoặc link âm thanh http/https.');
    let videoId;
    if (url.hostname === 'youtu.be' || url.hostname === 'www.youtu.be') videoId = url.pathname.split('/')[1];
    else if (YOUTUBE_HOSTS.has(url.hostname)) {
      if (url.pathname === '/watch') videoId = url.searchParams.get('v');
      else videoId = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1];
    }
    if (videoId !== undefined || YOUTUBE_HOSTS.has(url.hostname) || /^(www\.)?youtu\.be$/.test(url.hostname)) {
      if (!/^[\w-]{11}$/.test(videoId || '')) throw new Error('Hãy dùng link một video YouTube, không phải link kênh hoặc danh sách phát.');
      const canonical = new URL('https://www.youtube.com/watch?v=' + videoId);
      const playlist = url.searchParams.get('list');
      if (/^[A-Za-z0-9_-]{10,150}$/.test(playlist || '')) {
        canonical.searchParams.set('list', playlist);
        const index = Number(url.searchParams.get('index'));
        if (Number.isInteger(index) && index > 0 && index < 10000) canonical.searchParams.set('index', String(index));
      }
      return { kind: 'youtube', videoId, url: canonical.href, key: 'youtube:' + videoId };
    }
    if (!/\.(mp3|m4a|aac|ogg|oga|wav|flac|webm)$/i.test(url.pathname)) throw new Error('Link âm thanh cần trỏ trực tiếp đến tệp MP3, M4A, OGG, WAV, AAC, FLAC hoặc WEBM.');
    url.hash = '';
    return { kind: 'audio', url: url.href, key: 'audio:' + url.href };
  }
  function track(raw, id) {
    if (!raw || typeof raw !== 'object') throw new Error('Dữ liệu bài nhạc không hợp lệ.');
    const parsed = source(raw.url);
    const fallback = parsed.kind === 'youtube' ? 'YouTube · ' + parsed.videoId : decodeSafe(new URL(parsed.url).pathname.split('/').pop());
    const title = String(raw.title || fallback).trim().slice(0, 120) || fallback;
    return { id: id || String(raw.id || '').slice(0, 100) || 'track-' + Math.random().toString(36).slice(2), title, ...parsed };
  }
  function decodeSafe(value) { try { return decodeURIComponent(value); } catch { return value; } }
  function merge(existing, imported) {
    if (!Array.isArray(imported) || imported.length > 500) throw new Error('Danh sách phải chứa tối đa 500 bài.');
    const checked = imported.map(item => track(item));
    const result = existing.slice(), keys = new Set(result.map(item => item.key)), ids = new Set(result.map(item => item.id));
    for (const item of checked) {
      if (keys.has(item.key)) continue;
      while (ids.has(item.id)) item.id = 'track-' + Math.random().toString(36).slice(2);
      result.push(item); keys.add(item.key); ids.add(item.id);
    }
    if (result.length > 500) throw new Error('Danh sách đã đủ 500 bài. Hãy xóa bớt trước khi nhập.');
    return result;
  }
  function restore(value) {
    const empty = { tracks: [], selectedId: null, volume: 35, repeat: 'off', shuffle: false };
    try {
      const data = typeof value === 'string' ? JSON.parse(value) : value;
      if (!data || !Array.isArray(data.tracks)) return empty;
      let tracks = [];
      for (const item of data.tracks.slice(0, 500)) {
        try { tracks = merge(tracks, [item]); } catch { /* Ignore only the damaged entry. */ }
      }
      return { tracks, selectedId: tracks.some(item => item.id === data.selectedId) ? data.selectedId : tracks[0]?.id || null,
        volume: Number.isFinite(data.volume) ? Math.max(0, Math.min(100, data.volume)) : 35,
        repeat: ['off', 'all', 'one'].includes(data.repeat) ? data.repeat : 'off', shuffle: data.shuffle === true };
    } catch { return empty; }
  }
  function next(tracks, id, { direction = 1, automatic = false, repeat = 'off', shuffle = false, random = Math.random } = {}) {
    if (!tracks.length) return null;
    const index = tracks.findIndex(item => item.id === id);
    if (index < 0) return tracks[0].id;
    if (automatic && repeat === 'one') return id;
    if (shuffle && tracks.length > 1) {
      const other = tracks.filter(item => item.id !== id);
      return other[Math.min(other.length - 1, Math.floor(Math.max(0, random()) * other.length))].id;
    }
    const candidate = index + direction;
    if (automatic && repeat === 'off' && (candidate < 0 || candidate >= tracks.length)) return null;
    return tracks[(candidate + tracks.length) % tracks.length].id;
  }
  function fold(value) { return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  function search(tracks, query) {
    const words = fold(query).trim().split(/\s+/).filter(Boolean);
    return tracks.filter(item => words.every(word => fold(item.title + ' ' + item.kind + ' ' + item.url).includes(word)));
  }
  function time(value) {
    const n = Math.floor(Number.isFinite(value) && value > 0 ? value : 0);
    return n >= 3600 ? Math.floor(n / 3600) + ':' + String(Math.floor(n / 60) % 60).padStart(2, '0') + ':' + String(n % 60).padStart(2, '0') : Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');
  }
  return { source, track, merge, restore, next, fold, search, time };
});
