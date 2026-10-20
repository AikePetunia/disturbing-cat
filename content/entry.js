let activeSettings = null;
console.log("asdasdasdasd");

async function loadAndApply() {
  const cache = await browser.storage.local.get("catSettings");
  console.log("cache", cache);
  if (!cache.catSettings || !cache.catSettings.enabled) {
    resetPage();
    return;
  }

  activeSettings = cache.catSettings;

  applyCat();
}
loadAndApply();

function applyCat() {
  // a diferencia de cat-ui.mjs, ahora no necesito browser, por que este js ya está dentor de la pagina.
  const domain = window.location.hostname;

  applyGrayScale(activeSettings.grayscale);

  /*
    if (domain.includes("x.com") || domain.includes("twitter.com")) {
        //blockTwitter(activeSettings.twitter, activeSettings.keywords);
        const moduleUrl = browser.runtime.getURL("content/twitter.js");
        platformModule = await import(moduleUrl);

    } else if (domain.includes("instagram.com")) {
        //blockInstagram(activeSettings.instagram, activeSettings.keywords);
        
    } else if (domain.includes("youtube.com")) {
        //blockYoutube(activeSettings.youtube);
        
    }
    */
}

function applyGrayScale(enabled) {
  const styleId = "cat-grayscale-filter";
  let styleTag = document.getElementById(styleId);

  console.log("enabled", enabled);
  if (enabled) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    styleTag.textContent = "html { filter: grayscale(100%) !important; }";
    document.head.appendChild(styleTag);
  } else if (styleTag) {
    styleTag.remove();
  }
}
// si el dom se update, la extension updatea.
const observer = new MutationObserver(() => {
  applyCat();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
