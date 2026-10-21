import { kwLogic, renderKeywords } from "./js/cat-kw-logic.mjs";
import { cache, loadCache, saveCache, getVal, setVal } from "./js/cat-cache.mjs";

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

async function initCache() {
  await loadCache();

  extensionOn = cache.enabled;

  renderUI();
  renderKeywords();
}

initCache();

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

  // set the new value on the catSettings cache
  setVal(cache, path, newValue);

  await saveCache();
});
