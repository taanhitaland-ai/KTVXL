(function (root, factory) {
  const model = factory();
  if (typeof module === 'object' && module.exports) module.exports = model;
  else root.KMA_ACTIVITY_MODEL = model;
})(typeof window === 'object' ? window : globalThis, () => {
  'use strict';
  const idleMs = 15 * 60 * 1000;
  function sample(state, now) {
    const end = Math.min(now, state.lastActivity + idleMs);
    return {
      active: state.started && state.owned && now < state.lastActivity + idleMs,
      seconds: Math.max(0, state.seconds + (state.started && state.owned ? Math.max(0, end - state.anchor) / 1000 : 0)),
      idleSeconds: Math.min(900, Math.max(0, Math.floor((now - state.lastActivity) / 1000)))
    };
  }
  const format = seconds => {
    const n = Math.floor(Math.max(0, seconds));
    const h = Math.floor(n / 3600), m = Math.floor(n / 60) % 60, s = n % 60;
    return (h ? h + ':' : '') + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
  };
  return Object.freeze({ idleMs, sample, format });
});
