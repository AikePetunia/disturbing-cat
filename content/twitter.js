export function twitter() {
  console.log("[tw]hello world from twitter");
  removeUnnecessary();
  onlyFollowingTab();
  removeMetrics();
  replaceTweetsByKeywords();
}

function onlyFollowingTab() {
  const followingPart = document.querySelector('div[aria-expanded="false"]');
  if (!followingPart) {
    followingPart.click();
  }

  const targetChild = document.querySelector(
    '[data-testid="ScrollSnap-SwipeableList"], button[aria-label="Manage timelines"]',
  );

  if (!targetChild) return;

  const headerWrapper =
    targetChild.closest('div[tabindex="0"] > div') ||
    targetChild.closest("nav");

  if (headerWrapper) {
    headerWrapper.style.display = "none";
  }
}

// solo debe funcionar si son palabras aisladas
function replaceTweetsByKeywords(keywords = ["hola", "IA", "No", "LA"]) {
  if (!keywords || keywords.length === 0) return;

  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
}

function removeMetrics() {
  const selectors = ['span[data-testid="app-text-transition-container"]'];
  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.remove());
  });
}

// puede ser q los selectores sean por idioma??
function removeUnnecessary() {
  const selectors = [
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

  selectors.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => el.remove());
  });
  cleanTrendingKeepSearch();
}

// we want to delete everything, but not the search
export function cleanTrendingKeepSearch() {
  const trendingContainer = document.querySelector('[aria-label="Trending"]');
  if (!trendingContainer) return;

  const elementsInside =
    trendingContainer.querySelectorAll(":scope > div > div");

  elementsInside.forEach((block) => {
    if (!block.querySelector('form[role="search"]')) {
      block.style.display = "none";
    }
  });

  document
    .querySelector('[data-testid="sidebarColumn"] nav[aria-label="Footer"]')
    ?.remove();
  document
    .querySelectorAll('[data-testid="sidebarColumn"] section')
    .forEach((s) => (s.style.display = "none"));
}

const observer = new MutationObserver(() => {
  removeUnnecessary();
  removeMetrics();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
