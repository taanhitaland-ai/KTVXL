(function (root, factory) {
  const policy = factory();
  if (typeof module === "object" && module.exports) module.exports = policy;
  else root.KMA_ACCOUNT_POLICY = policy;
})(typeof window === "object" ? window : globalThis, function () {
  "use strict";
  function normalizeNickname(value) {
    return typeof value === "string" ? value.normalize("NFC").trim().replace(/ +/g, " ") : "";
  }
  function nicknameError(value) {
    const name = normalizeNickname(value);
    if (Array.from(name).length < 2 || Array.from(name).length > 32)
      return "Tên cần có từ 2 đến 32 ký tự.";
    if (!/^[\p{L}\p{M}\p{N} ._-]+$/u.test(name) || !/[\p{L}\p{N}]/u.test(name))
      return "Chỉ dùng chữ, số, dấu cách, dấu chấm, gạch ngang hoặc gạch dưới.";
    const comparison = name.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().replace(/[ ._-]+/g, "");
    if (["nguoihoc", "anonymous", "anon", "anonym", "guest"].includes(comparison))
      return "Hãy chọn biệt danh riêng thay cho tên mặc định.";
    return "";
  }
  function accessState(state) {
    if (!state?.authResolved) return "checking";
    if (!state.authenticated || !state.user || state.anonymous) return "guest";
    if (!state.profileReady) return "checking";
    return nicknameError(state.nickname) ? "username" : "ready";
  }
  return { normalizeNickname, nicknameError, accessState };
});
