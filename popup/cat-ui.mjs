const whereAmI = window.location.hostname;
const mainIcon = document.getElementById("g__sm-icon");
const twIconPath = "../icons/social-media/tw.avif";
const igIconPath = "../icons/social-media/ig.avif";
const ytIconPath = "../icons/social-media/yt.avif";

changeUiOnDomain("x.com");

function changeUiOnDomain(socialMedia) {
  switch (true) {
    case socialMedia.includes("instagram.com") ||
      socialMedia.includes("instagr.am") ||
      socialMedia.includes("cdninstagram.com"):
      executeInstagramUI();
      break;

    case socialMedia.includes("x.com") || socialMedia.includes("twitter.com"):
      executeTwitterUI();
      //github.com/AikePetunia/Famaf
      https: break;

    case socialMedia.includes("youtu.be") ||
      socialMedia.includes("youtube.com"):
      executeYoutubeUI();
      break;

    default:
      executeDefault();
  }
}

function executeYoutubeUI() {
  const configDefault = document.querySelector(".sm__configs.youtube");
  configDefault.classList.remove("hidden");
  mainIcon.src = ytIconPath;
}

function executeInstagramUI() {
  const configDefault = document.querySelector(".sm__configs.instagram");
  configDefault.classList.remove("hidden");
  mainIcon.src = igIconPath;

  /*
- Close Friends / see post from account
  Lo que se saca, se pone el gato o lo q fuera
- Solo seguidos (en twitter)


-Remover cosas innecesarias:
  Sugeridos
  Reels
  el + de crear
  Panel
  Los cubos de abajo esos raros


Daily limit (post/shorts/historias/tweets) o limite por hora

*/
}
function executeTwitterUI() {
  const configDefault = document.querySelector(".sm__configs.twitter");
  configDefault.classList.remove("hidden");
  mainIcon.src = twIconPath;
  console.log("on tw");
  /*
- Close Friends / see post from account
  Lo que se saca, se pone el gato o lo q fuera
- Solo seguidos (en twitter)


-Remover cosas innecesarias:
  TODA LA BARRA DERECHA
  Barra izquierda:
  Explore
  Calls
  Grok
  Creator Studio
  Premium


Daily limit (post/shorts/historias/tweets) o limite por hora
*/
}

function executeDefault() {
  const configDefault = document.querySelector(".sm__configs.default");
  const globalSettings = document.querySelector(".global-settings");
  const kwContainerCuzImLazy = document.querySelector(".kw__container");
  configDefault.classList.remove("hidden");
  globalSettings.classList.add("hidden");
  kwContainerCuzImLazy.classList.add("hidden");
}

// keywords logic
const create = document.getElementById("create");
const inp1 = document.getElementById("inp1");
const kwAddedContainer = document.getElementById("kw__added-container");
create.addEventListener("click", () => {
  let inp = inp1.value;

  if (inp === "") return;

  let newELement = document.createElement("span");
  newELement.classList.add("kw__blacklist");
  newELement.innerHTML = inp;
  kwAddedContainer.append(newELement);

  newELement.addEventListener("click", () => {
    newELement.remove();
  });
  inp1.value = "";
});

const input = document.querySelector(".post-limit-general");

input.addEventListener("input", (e) => {
  const min = Number(e.target.dataset.min);
  const max = Number(e.target.dataset.max);

  let val = e.target.value.replace(/\D/g, "");

  if (val === "") {
    e.target.value = "";
    return;
  }

  let num = Number(val);

  if (num > max) num = max;
  if (num < min) num = min;

  e.target.value = num;
});