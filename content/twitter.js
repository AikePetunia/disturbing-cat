import { createCard, CARD_CLASS } from "./cat-card.js";
import { ensureHideStyle, hide, reveal, buildKeywordRegexes } from "./utils/helpers.js";

const TW_STYLE_BLOCK_ID = "cat-tw-blocked-elements";

const unnecessarySelectors = [
  'a[data-testid="premium-signup-tab"]',
  'a[aria-label="Creator Studio"]',
  'a[data-testid="AppTabBar_Calls_Link"]',
  'a[data-testid="AppTabBar_DirectMessage_Link"]',
  'a[aria-label="Grok"]',
  'a[data-testid="AppTabBar_Explore_Link"]',
  'a[data-testid="SideNav_NewTweet_Button"]',
  'div[data-testid="GrokDrawer"]',
  'div[data-testid="chat-drawer-root"]',
];

const metricSelectors = ['span[data-testid="app-text-transition-container"]'];

let currentSettings = null;
let keywordRegexes = [];
const revealedTweets = new Set();

export function twitter(twSettings) {
  currentSettings = twSettings;
  keywordRegexes = buildKeywordRegexes(twSettings?.keywords);

  applyStaticCssRules();
  ensureHideStyle();
  runAllCleaners();
}

export function runAllCleaners() {
  cleanTrendingKeepSearch(Boolean(currentSettings?.removeUnnecessary));
  handleFollowingTab(Boolean(currentSettings?.onlyFollowing));
  replaceTweetsByKeywords(Boolean(currentSettings?.allowKeywords));
}

// for "non-existing-yet" css 
function applyStaticCssRules() {
  let styleTag = document.getElementById(TW_STYLE_BLOCK_ID);
  const rules = [];

  if (currentSettings?.removeUnnecessary) {
    rules.push(`
      ${unnecessarySelectors.join(",\n")} {
        display: none !important;
      }
      [data-testid="sidebarColumn"] aside,
      [data-testid="sidebarColumn"] section,
      [data-testid="sidebarColumn"] nav[aria-label="Footer"],
      [data-testid="sidebarColumn"] [data-testid="news_sidebar"] {
        display: none !important;
      }
    `);
  }

  if (currentSettings?.removeMetrics) {
    rules.push(`
      ${metricSelectors.join(",\n")} {
        display: none !important;
      }
    `);
  }

  if (rules.length > 0) {
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = TW_STYLE_BLOCK_ID;
      (document.head || document.documentElement).appendChild(styleTag);
    }
    styleTag.textContent = rules.join("\n");
  } else if (styleTag) {
    styleTag.remove();
  }
}

export function cleanTrendingKeepSearch(enabled) {
  if (!enabled) {
    reveal("sidebar");
    return;
  }

  const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
  if (!sidebar) return;

  const search = sidebar.querySelector('form[role="search"]');

  if (!search) {
    Array.from(sidebar.children).forEach((child) => hide(child, "sidebar"));
    return;
  }

  // i hate css from tw, so we just climb between selectors 
  for (let node = search; node !== sidebar; node = node.parentElement) {
    if (node.dataset.catHide === "sidebar") delete node.dataset.catHide;
    for (const sibling of node.parentElement.children) {
      if (sibling !== node) hide(sibling, "sidebar");
    }
  }
}

function handleFollowingTab(enabled) {
  // Solo en el timeline de inicio: en perfiles o búsquedas el tablist es otro
  if (!enabled || location.pathname !== "/home") {
    reveal("tabs");
    return;
  }

  selectFollowingTab()

  // hide tab selection cuz user it's a bad person
  hideTabSelection();
}

function selectFollowingTab() {
 const tabs = document.querySelectorAll('[role="tablist"] [role="tab"]');
  if (tabs.length >= 2) {
    const followingTab = tabs[1];
    if (followingTab.getAttribute("aria-selected") !== "true" && !followingTab.dataset.catSwitched) {
      followingTab.click();
      followingTab.dataset.catSwitched = "true";
    }
  }
}

function hideTabSelection() {
    const targetChild = document.querySelector(
    '[data-testid="ScrollSnap-SwipeableList"], button[aria-label="Manage timelines"]'
  );
  const headerWrapper =
    targetChild?.closest('div[tabindex="0"] > div') || targetChild?.closest("nav");

  if (headerWrapper) hide(headerWrapper, "tabs");
}

// tweets handling.
function getTweetId(tweet, tweetText) {
  return tweet.querySelector('a[href*="/status/"] time')?.closest("a")?.getAttribute("href") || tweetText;
}

function getCard(tweet, tweetId) {
  const prev = tweet.previousElementSibling;
  return prev?.classList.contains(CARD_CLASS) && prev.dataset.tweetId === tweetId ? prev : null;
}

function replaceTweetsByKeywords(enabled) {
  if (!enabled || keywordRegexes.length === 0) {
    reveal("keyword");
    document.querySelectorAll(`.${CARD_CLASS}`).forEach((card) => card.remove());
    return;
  }

  const tweets = document.querySelectorAll('article[data-testid="tweet"]');

  tweets.forEach((tweet) => {
    const textNode = tweet.querySelector('[data-testid="tweetText"]');
    const tweetText = textNode?.innerText || "";
    const tweetId = getTweetId(tweet, tweetText);

    const match = keywordRegexes.find(({ regex }) => regex.test(tweetText));

    if (match && !revealedTweets.has(tweetId)) {
      hide(tweet, "keyword");

      if (!getCard(tweet, tweetId)) {
        const card = createCard({
          message: `This post was hidden because it mentions "${match.keyword}".`,
          showSuggestion: Boolean(currentSettings?.suggestions),
          onReveal: () => {
            revealedTweets.add(tweetId);
            runAllCleaners();
          },
        });
        card.dataset.tweetId = tweetId;
        tweet.before(card);
      }
    } else if (tweet.dataset.catHide === "keyword") {
      delete tweet.dataset.catHide;
    }
  });

  document.querySelectorAll(`.${CARD_CLASS}`).forEach((card) => {
    if (card.nextElementSibling?.dataset.catHide !== "keyword") card.remove();
  });
}
