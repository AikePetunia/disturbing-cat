import { kwLogic } from "./cat-kw-logic.mjs";

const whereAmI = window.location.hostname;
let extensionOn = false;

const socialMediaIcon = {
  twIconPath: "../icons/social-media/tw.avif",
  igIconPath: "../icons/social-media/ig.avif",
  ytIconPath: "../icons/social-media/yt.avif",
};

const element = {
  mainIcon: document.getElementById("g__sm-icon"),
  extensionToggler: document.querySelector(".g__toggl-checkbox"),
  extensionTogglerText: document.querySelector(".g__extension-toggle-text"),
  nothingToHide: document.querySelector(".nothing-to-hide"),
  globalSettings: document.querySelector(".global-settings"),
  kwContainerCuzImLazy: document.querySelector(".kw__container"),
};

const defaultGlobalSettings = {
  grayscale: false,
  suggestions: true,
  focus: false,
  blacklistEnabled: false, // no está en dom
  keywords: [],
  twitter: {
    friendList: true,
    friendList: [], // no está en dom
    allowKeywords: true,
    seeTweetsFromFollowers: true,
    removeUnnecesary: true,
    limitEnabled: true,
    limitType: {
      diary: false,
      hourly: true,
    },
    postLimit: 25,
  },
  instagram: {
    friendList: true,
    friendList: [], // no está en dom
    allowKeywords: true,
    removeUnnecesary: true,
    hideMetrics: true,
    storyLimitEnabled: true,
    storyLimitType: {
      diary: false,
      hourly: true,
    },
    storyLimit: 25,
    postsLimitEnabled: true,
    postsLimitType: {
      diary: false,
      hourly: true,
    },
    postsLimit: 25,
  },
  youtube: {
    removeAutoscroll: true,
    removeUnnecesary: true,
    hideComments: true,
    hideMetrics: true,
    limitEnabled: true,
    shortsLimitEnabled: true,
    shortsLimitType: {
      diary: false,
      hourly: true,
    },
    shortsLimit: 25,
  },
};

element.extensionToggler.addEventListener("click", () => {
  handleToggler();
});

function handleToggler() {
  extensionOn = !extensionOn;
  if (extensionOn) {
    element.extensionTogglerText.innerHTML = "Cat will disturb.";
    changeUiOnDomain("youtube.com");
  } else if (!extensionOn) {
    element.extensionTogglerText.innerHTML = "Cat won't disturb :).";
    executeDefault();
  }
}
handleToggler();

function changeUiOnDomain(socialMedia) {
  element.nothingToHide.classList.add("hidden");
  element.globalSettings.classList.remove("hidden");
  element.kwContainerCuzImLazy.classList.remove("hidden");

  switch (true) {
    case socialMedia.includes("instagram.com") ||
      socialMedia.includes("instagr.am") ||
      socialMedia.includes("cdninstagram.com"):
      executeInstagramUI();
      break;

    case socialMedia.includes("x.com") || socialMedia.includes("twitter.com"):
      executeTwitterUI();
      break;

    case socialMedia.includes("youtu.be") ||
      socialMedia.includes("youtube.com"):
      executeYoutubeUI();
      break;

    default:
      executeDefault();
  }
}

function executeYoutubeUI() {
  const nothingToHide = document.querySelector(".sm__configs.youtube");
  nothingToHide.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.ytIconPath;
}

function executeInstagramUI() {
  const nothingToHide = document.querySelector(".sm__configs.instagram");
  nothingToHide.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.igIconPath;
}
function executeTwitterUI() {
  const nothingToHide = document.querySelector(".sm__configs.twitter");
  nothingToHide.classList.remove("hidden");
  element.mainIcon.src = socialMediaIcon.twIconPath;
  console.log("on tw");
}

function executeDefault() {
  const anySettings = document.querySelectorAll("div.sm__configs");
  element.nothingToHide.classList.remove("hidden");
  element.globalSettings.classList.add("hidden");
  element.kwContainerCuzImLazy.classList.add("hidden");
  anySettings.forEach((el) => el.classList.add("hidden"));
}

kwLogic();
