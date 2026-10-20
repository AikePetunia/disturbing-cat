let activeSettings = null;

async function loadAndApply() {
  const cache = await browser.storage.local.get("catSettings");
  if (!cache.catSettings || !cache.catSettings.enabled) {
    return;
  }

  activeSettings = cache.catSettings;

  // if (!activeSettings.enabled) return;
  // la extension sigue andando por mas q este disabled.
  // de igual manera tengo un bug raro
  applyCat();
}
loadAndApply();

async function applyCat() {
  // a diferencia de cat-ui.mjs, ahora no necesito browser, por que este js ya está dentor de la pagina.
  const domain = window.location.hostname;
  let plataform;
  let moduleUrl;
  applyGrayScale(activeSettings.grayscale);

  switch (true) {
    case domain.includes("instagram.com") ||
      domain.includes("instagr.am") ||
      domain.includes("cdninstagram.com"):
      plataform = "instagram";
      moduleUrl = browser.runtime.getURL("content/instagram.js");
      platformModule = await import(moduleUrl);
      break;

    case domain.includes("x.com") || domain.includes("twitter.com"):
      plataform = "twitter";
      console.log("[tw] switch twitter");
      moduleUrl = browser.runtime.getURL("content/twitter.js");
      platformModule = await import(moduleUrl);
      platformModule.twitter();
      break;

    case domain.includes("youtu.be") || domain.includes("youtube.com"):
      plataform = "youtube";
      moduleUrl = browser.runtime.getURL("content/youtube.js");
      platformModule = await import(moduleUrl);
      break;

    default:
      break;
  }

  if (!platformModule) return;
}

function applyGrayScale(enabled) {
  const styleId = "cat-grayscale-filter";
  let styleTag = document.getElementById(styleId);

  if (enabled) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.textContent = "html { filter: grayscale(100%) !important; }";
    document.head.appendChild(styleTag);
  } else if (styleTag) {
    styleTag.remove();
  }
}

function allowSuggestions() {}

// si el dom se update, la extension updatea.
const observer = new MutationObserver(() => {
  applyCat();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
