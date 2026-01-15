/* =========================
   SHARED UI HELPERS
   (NO DESIGN CHANGE)
========================= */

/* Toast message (inline, non-blocking) */
export function showToast(msg, type = "info") {
  let el = document.getElementById("admin-toast");

  if (!el) {
    el = document.createElement("div");
    el.id = "admin-toast";
    el.style.position = "fixed";
    el.style.bottom = "20px";
    el.style.right = "20px";
    el.style.padding = "10px 14px";
    el.style.fontSize = "13px";
    el.style.borderRadius = "8px";
    el.style.boxShadow = "0 6px 18px rgba(0,0,0,.12)";
    el.style.zIndex = "9999";
    document.body.appendChild(el);
  }

  el.textContent = msg;

  // warna ringan, tidak nabrak desain
  const colors = {
    success: "#16a34a",
    error: "#dc2626",
    info: "#334155"
  };

  el.style.background = colors[type] || colors.info;
  el.style.color = "#fff";
  el.style.opacity = "1";

  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.style.opacity = "0";
  }, 2500);
}

/* Disable / enable button safely */
export function setButtonState(btn, state, text) {
  if (!btn) return;

  btn.disabled = state === "loading";
  btn.textContent = text;

  btn.style.opacity = state === "loading" ? "0.6" : "1";
  btn.style.cursor = state === "loading" ? "not-allowed" : "pointer";
}

/* Simple status badge (text only) */
export function renderStatusBadge(status) {
  const span = document.createElement("span");
  span.textContent = status.toUpperCase();
  span.style.fontSize = "11px";
  span.style.padding = "2px 8px";
  span.style.borderRadius = "999px";
  span.style.marginLeft = "6px";

  const map = {
    active: "#16a34a",
    published: "#16a34a",
    draft: "#64748b",
    inactive: "#64748b"
  };

  span.style.background = map[status] || "#94a3b8";
  span.style.color = "#fff";

  return span;
}
