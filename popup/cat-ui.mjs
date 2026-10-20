import { kwLogic } from "./js/cat-kw-logic.mjs";

async function getActiveTab() {
  if (typeof browser === "undefined") {
    return [{ url: "https://www.instagram.com" }];
  }

  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab;
}

let extensionOn = false;

const socialMediaIcon = {
  twIconPath: "../icons/social-media/tw.avif",
  igIconPath: "../icons/social-media/ig.avif",
  ytIconPath: "../icons/social-media/yt.avif",
  defaultBlack: "../icons/disturbing-cat-32-black.avif",
  defaultWhite: "../icons/disturbing-cat-32-white.avif",
};

const element = {
  mainIcon: document.getElementById("g__sm-icon"),
  extensionToggler: document.querySelector(".g__toggl-checkbox"),
  extensionTogglerText: document.querySelector(".g__extension-toggle-text"),
  nothingToHide: document.querySelector(".nothing-to-hide"),
  globalSettings: document.querySelector(".global-settings"),
  kwContainerCuzImLazy: document.querySelector(".kw__container"),
  anySettings: document.querySelectorAll("div.sm__configs"),
  igSettings: document.querySelector(".sm__configs.instagram"),
  twSettings: document.querySelector(".sm__configs.twitter"),
  ytSettings: document.querySelector(".sm__configs.youtube"),
};

element.extensionToggler.addEventListener("click", () => {
  handleToggler();
});

handleToggler();

async function handleToggler() {
  extensionOn = !extensionOn;
  if (extensionOn) {
    element.extensionTogglerText.innerHTML = "Cat will disturb.";

    getActiveTab().then((tab) => {
      let socialMedia = tab.url;
      element.nothingToHide.classList.add("hidden");
      element.globalSettings.classList.remove("hidden");
      element.kwContainerCuzImLazy.classList.remove("hidden");

      switch (true) {
        case socialMedia.includes("instagram.com") ||
          socialMedia.includes("instagr.am") ||
          socialMedia.includes("cdninstagram.com"):
          executeInstagramUI();
          break;

        case socialMedia.includes("x.com") ||
          socialMedia.includes("twitter.com"):
          executeTwitterUI();
          break;

        case socialMedia.includes("youtu.be") ||
          socialMedia.includes("youtube.com"):
          executeYoutubeUI();
          break;

        default:
          executeDefault();
      }
    });
  } else if (!extensionOn) {
    element.extensionTogglerText.innerHTML = "Cat won't disturb :).";
    executeDefault();
  }
}

function executeYoutubeUI() {
  element.ytSettings.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.ytIconPath;
}

function executeInstagramUI() {
  element.igSettings.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.igIconPath;
}

function executeTwitterUI() {
  element.twSettings.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.twIconPath;
}

function executeDefault() {
  element.nothingToHide.classList.remove("hidden");
  element.globalSettings.classList.add("hidden");
  element.kwContainerCuzImLazy.classList.add("hidden");
  element.mainIcon.src = socialMediaIcon.defaultWhite;
  element.anySettings.forEach((el) => el.classList.add("hidden"));
}

kwLogic();

const defaultSettings = {
  enabled: true, //  #global-extension-enable
  grayscale: false,
  suggestions: true,
  focus: false,
  blacklistEnabled: false,
  keywords: [],

  twitter: {
    allowedListEnabled: false, // #allowed-posts-tw
    allowedList: [], // Datos que cargarás aparte
    allowKeywords: true, // #keywords-tw
    onlyFollowing: true, // #only-following-tw
    removeUnnecessary: true, // #remove-stuff-tw
    tweetsLimitEnabled: true, // #tweets-limit-tw
    tweetsLimitPeriod: "hourly", // #limit-period-tw ("daily" | "hourly")
    tweetsLimit: 25, // input numérico
  },

  instagram: {
    allowedListEnabled: false, // #allowed-posts-ig
    allowedList: [],
    removeUnnecessary: true, // #remove-stuff-ig
    hideComments: true, // #hide-comments-ig
    hideMetrics: true, // #hide-metrics-ig
    postsLimitEnabled: true, // #posts-limit-ig
    postsLimitPeriod: "hourly", // #limit-period-posts-ig
    postsLimit: 25,
    storyLimitEnabled: true, // #story-limit-ig
    storyLimitPeriod: "hourly", // #limit-period-stories-ig
    storyLimit: 25,
  },

  youtube: {
    removeAutoscroll: true, // #no-autoscroll-yt
    removeUnnecessary: true, // #remove-stuff-yt
    hideComments: true, // #hide-comments-yt
    hideMetrics: true, // #hide-metrics-yt
    shortsLimitEnabled: true, // #shorts-limit-yt
    shortsLimitPeriod: "hourly", // #limit-period-shorts-yt
    shortsLimit: 25,
  },
};
let cache = structuredClone(defaultSettings);

async function initCache() {
  let result = await browser.storage.local.get("catSettings");
  console.log("result", result);
  console.log("result example grayscale", result.catSettings.grayscale);
  if (result.catSettings) {
    cache = result.catSettings;
  } else {
    await browser.storage.local.set({ catSettings: defaultSettings });
  }

  extensionOn = cache.enabled;

  renderUI();
}

initCache();
/**
 * reads name="socialmedia.value" on the html for accesing values
 */
function getVal(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

/**
 * @param {cache} obj - the cache itself
 * @param {*} path - value to change (the name="" property on the html)
 * @param {*} value - new value for updating the caché object
 *
 * example: setVal(cache, "twitter.tweetsLimit", 50);
 */
function setVal(obj, path, value) {
  const keys = path.split("."); // ["twitter", "tweetsLimit"].
  const lastKey = keys.pop(); // ["twitter"]
  const target = keys.reduce((acc, key) => acc[key], obj); // { tweetsLimit: 25, allowKeywords: true }.
  target[lastKey] = value; // target["tweetsLimit"] = 50;
}

function renderUI() {
  const inputs = document.querySelectorAll("input[name], select[name]");

  inputs.forEach((input) => {
    const path = input.name;
    const valor = getVal(cache, path);

    if (input.type === "checkbox") {
      input.checked = Boolean(valor);
    } else {
      input.value = valor ?? "";
    }
  });
}

document.addEventListener("change", async (e) => {
  const input = e.target;
  const path = input.name;

  if (!path) {
    console.log("input name not found");
    return;
  }

  let newValue;
  if (input.type === "checkbox") {
    newValue = input.checked;
  } else if (input.dataset.min !== undefined) {
    newValue = Number(input.value) || 0;
  } else {
    newValue = input.value;
  }

  // set the value on the catSettings cache
  setVal(cache, path, newValue);

  await browser.storage.local.set({ catSettings: cache });
});
