let activeSettings = null;
let platformModule = null;
let debounceTimeout = null;

async function init() {
  const domain = window.location.hostname;
  let modulePath = null;

  switch (true) {
    case domain.includes("x.com") || domain.includes("twitter.com"):
      modulePath = "content/twitter.js";
      break;

    case domain.includes("instagram.com") || domain.includes("instagr.am"):
      modulePath = "content/instagram.js";
      break;

    case domain.includes("youtube.com") || domain.includes("youtu.be"):
      modulePath = "content/youtube.js";
      break;
  }

  if (modulePath) {
    const moduleUrl = browser.runtime.getURL(modulePath);
    platformModule = await import(moduleUrl);
  }

  const cache = await browser.storage.local.get("catSettings");
  applySettings(cache?.catSettings);

  browser.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.catSettings) {
      applySettings(changes.catSettings.newValue);
    }
  });

  startObserver();
}

function applySettings(settings) {
  activeSettings = settings;
  const enabled = Boolean(settings?.enabled);

  applyGrayScale(enabled && settings.grayscale);

  if (platformModule?.twitter) {
    platformModule.twitter(
      enabled
        ? {
            ...settings.twitter,
            keywords: settings.keywords,
            suggestions: settings.suggestions,
          }
        : null
    );
  }
}

// for changes on the dom
function startObserver() {
  const target = document.body || document.documentElement;
  if (!target) return;

  const observer = new MutationObserver(() => {
    if (!activeSettings?.enabled) return;

    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      if (platformModule?.runAllCleaners) {
        platformModule.runAllCleaners();
      }
    }, 150);
  });

  observer.observe(target, {
    childList: true,
    subtree: true,
  });
}

function applyGrayScale(enabled) {
  const styleId = "cat-grayscale-filter";
  let styleTag = document.getElementById(styleId);

  if (enabled) {
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      styleTag.textContent = "html { filter: grayscale(100%) !important; }";
      (document.head || document.documentElement).appendChild(styleTag);
    }
  } else if (styleTag) {
    styleTag.remove();
  }
}

init();
