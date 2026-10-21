const HIDE_STYLE_ID = "cat-hide-marked";

// hide with data-cat-hide="<motive>" instead of css, for restoring elements easily.
export function ensureHideStyle() {
  if (document.getElementById(HIDE_STYLE_ID)) return;

  const styleTag = document.createElement("style");
  styleTag.id = HIDE_STYLE_ID;
  styleTag.textContent = "[data-cat-hide] { display: none !important; }";
  (document.head || document.documentElement).appendChild(styleTag);
}

export function hide(el, reason) {
  if (el.dataset.catHide !== reason) el.dataset.catHide = reason;
}

export function reveal(reason) {
  document
    .querySelectorAll(`[data-cat-hide="${reason}"]`)
    .forEach((el) => delete el.dataset.catHide);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^\${}()|[\]\\]/g, "\\$&");
}

export function buildKeywordRegexes(keywords) {
  return (keywords || [])
    .map((kw) => kw.trim())
    .filter(Boolean)
    .map((kw) => ({ keyword: kw, regex: new RegExp(`\\b${escapeRegex(kw)}\\b`, "i") }));
}
