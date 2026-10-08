(function (root, factory) {
  const clock = factory();
  if (typeof module === "object" && module.exports) module.exports = clock;
  else root.KMA_POMODORO_CLOCK = clock;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  function elapsed(state, now = Date.now()) {
    const base = Number.isFinite(state.elapsedSecondsInSession)
      ? state.elapsedSecondsInSession
      : 0;
    const running =
      state.isRunning && Number.isFinite(state.runningSince)
        ? Math.max(0, (now - state.runningSince) / 1000)
        : 0;
    return Math.min(state.totalSeconds, Math.max(0, base + running));
  }
  function sample(state, now = Date.now()) {
    const seconds = elapsed(state, now);
    return {
      elapsed: seconds,
      remaining: Math.max(0, Math.ceil(state.totalSeconds - seconds)),
      minutes: Math.floor(seconds / 60),
    };
  }
  function restore(value) {
    if (
      !value ||
      !["focus", "shortBreak", "longBreak"].includes(value.mode) ||
      !["ktvxl", "tthcm", "vldc", "xstk", "gdtc", "other"].includes(
        value.selectedSubject,
      ) ||
      !Number.isInteger(value.totalSeconds) ||
      value.totalSeconds < 60 ||
      value.totalSeconds > 18000 ||
      !Number.isFinite(value.elapsedSecondsInSession) ||
      value.elapsedSecondsInSession < 0 ||
      value.elapsedSecondsInSession > value.totalSeconds ||
      !Number.isInteger(value.loggedMinutes) ||
      value.loggedMinutes < 0 ||
      value.loggedMinutes > value.totalSeconds / 60 ||
      (value.isRunning &&
        (!Number.isFinite(value.runningSince) ||
          value.runningSince > Date.now()))
    )
      return null;
    return {
      mode: value.mode,
      selectedSubject: value.selectedSubject,
      totalSeconds: value.totalSeconds,
      durationMinutes: value.totalSeconds / 60,
      elapsedSecondsInSession: value.elapsedSecondsInSession,
      loggedMinutes: value.loggedMinutes,
      isRunning: value.isRunning === true,
      runningSince: value.runningSince || null,
    };
  }
  return Object.freeze({ sample, elapsed, restore });
});
