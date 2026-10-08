// Public browser configuration. Never put service_role, secret keys, or OAuth secrets here.
(function () {
  const production =
    location.protocol === "https:" &&
    location.hostname === "taanhitaland-ai.github.io" &&
    (location.pathname === "/KTVXL" || location.pathname.startsWith("/KTVXL/"));
  // Local previews never create a client for the production database.
  window.KMA_CLOUD_CONFIG = production
    ? Object.freeze({
        url: "https://htcnflcncbihhlqoeqsy.supabase.co",
        publishableKey: "sb_publishable_3RKXr_GVH5rEWsxSPPcbzg_ve4C8TVb",
      })
    : null;
})();
