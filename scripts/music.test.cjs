const { test } = require('node:test');
const assert = require('node:assert/strict');
const music = require('../web/music_library.js');
const video = 'M7lc1UVf-VE';
const tracks = ['a', 'b', 'c'].map(id => music.track({ id, title: 'Bài ' + id, url: 'https://example.org/' + id + '.mp3' }));
test('YouTube share, watch, mobile, music, shorts, live and embed URLs identify the same video', () => {
  for (const url of ['https://youtu.be/' + video + '?si=share', 'https://www.youtube.com/watch?v=' + video + '&list=anything', 'https://m.youtube.com/watch?v=' + video, 'https://music.youtube.com/watch?v=' + video, 'https://youtube.com/shorts/' + video, 'https://youtube.com/live/' + video, 'https://www.youtube-nocookie.com/embed/' + video]) {
    assert.equal(music.source(url).key, 'youtube:' + video);
    assert.equal(music.source(url).url, 'https://www.youtube.com/watch?v=' + video);
  }
});
test('reject unsupported pages, playlist-only links, unsafe protocols and embedded credentials', () => {
  for (const url of ['javascript:alert(1)', 'data:audio/wav;base64,a', 'https://user:pass@example.org/a.mp3', 'https://youtube.com/playlist?list=abc', 'https://youtube.com/watch?v=short', 'https://youtube.com.evil.test/watch?v=' + video, 'https://spotify.com/track/a', 'https://pixabay.com/music/something/', 'not a link']) assert.throws(() => music.source(url));
});
test('direct audio URL keeps signed query parameters and safely decodes a filename', () => {
  const value = music.track({ url: 'https://example.org/Nh%E1%BA%A1c%20%C4%91%C3%AAm.MP3?token=abc#offset', title: '' });
  assert.equal(value.title, 'Nhạc đêm.MP3'); assert.equal(value.url, 'https://example.org/Nh%E1%BA%A1c%20%C4%91%C3%AAm.MP3?token=abc');
  assert.equal(music.track({ url: 'https://example.org/%ZZ.ogg' }).title, '%ZZ.ogg');
});
test('video links keep playlist context for opening the original source', () => {
  const parsed = music.source('https://www.youtube.com/watch?v=V5GS5ANG96M&list=PLpk-GWLWHFtb8bfhdHMI_8OS5zCzvWgXV&index=5');
  assert.equal(new URL(parsed.url).searchParams.get('list'), 'PLpk-GWLWHFtb8bfhdHMI_8OS5zCzvWgXV');
  assert.equal(new URL(parsed.url).searchParams.get('index'), '5');
  assert.equal(parsed.key, 'youtube:V5GS5ANG96M');
});
test('import deduplicates sources and repairs duplicate IDs without changing the current library', () => {
  const before = structuredClone(tracks);
  const result = music.merge(tracks, [{ id: 'a', title: 'New', url: 'https://example.org/d.wav' }, { title: 'Duplicate', url: tracks[0].url }]);
  assert.equal(result.length, 4); assert.equal(new Set(result.map(t => t.id)).size, 4); assert.deepEqual(tracks, before);
});
test('invalid import is atomic and does not partially modify existing tracks', () => {
  const before = structuredClone(tracks);
  assert.throws(() => music.merge(tracks, [{ url: 'https://example.org/new.mp3' }, { url: 'https://example.org/page' }]));
  assert.deepEqual(tracks, before); assert.throws(() => music.merge(tracks, new Array(501).fill({ url: tracks[0].url })));
});
test('corrupted persisted entries cannot prevent restoring the rest of the library', () => {
  const restored = music.restore(JSON.stringify({ tracks: [tracks[0], { url: 'bad' }, tracks[1]], selectedId: 'deleted', volume: 150, repeat: 'bad', shuffle: 'yes' }));
  assert.equal(restored.tracks.length, 2); assert.equal(restored.selectedId, 'a'); assert.equal(restored.volume, 100); assert.equal(restored.repeat, 'off'); assert.equal(restored.shuffle, false);
  assert.equal(music.restore('{oops').tracks.length, 0); assert.equal(music.restore(null).volume, 35);
});
test('search matches Vietnamese with or without accents and multiple words', () => {
  const list = [music.track({ title: 'Đêm mưa chill', url: 'https://example.org/rain.mp3' }), music.track({ title: 'Piano', url: 'https://youtu.be/' + video })];
  assert.equal(music.search(list, 'dem mua').length, 1); assert.equal(music.search(list, 'CHILL đêm').length, 1); assert.equal(music.search(list, 'youtube')[0].title, 'Piano'); assert.equal(music.search(list, 'unknown').length, 0);
});
test('automatic advance stops at the end unless repeat is enabled', () => {
  assert.equal(music.next(tracks, 'c', { automatic: true }), null);
  assert.equal(music.next(tracks, 'c', { automatic: true, repeat: 'all' }), 'a');
  assert.equal(music.next(tracks, 'b', { automatic: true, repeat: 'one' }), 'b');
  assert.equal(music.next(tracks, 'b', { repeat: 'one' }), 'c');
});
test('manual previous/next wrap and shuffle avoids repeating the current track', () => {
  assert.equal(music.next(tracks, 'a', { direction: -1 }), 'c'); assert.equal(music.next(tracks, 'c'), 'a');
  assert.equal(music.next(tracks, 'b', { shuffle: true, random: () => 0 }), 'a'); assert.equal(music.next(tracks, 'b', { shuffle: true, random: () => 1 }), 'c');
  assert.equal(music.next([], 'a'), null); assert.equal(music.next([tracks[0]], 'a', { automatic: true }), null);
});
test('duration formatting handles live/unknown values and tracks longer than an hour', () => {
  assert.equal(music.time(Infinity), '0:00'); assert.equal(music.time(-10), '0:00'); assert.equal(music.time(65), '1:05'); assert.equal(music.time(3724), '1:02:04');
});
