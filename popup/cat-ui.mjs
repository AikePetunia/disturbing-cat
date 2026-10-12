const whereAmI = window.location.hostname;
const mainIcon = document.getElementById("g__sm-icon")
const twIconPath = "../icons/social-media/tw.avif"
const igIconPath = "../icons/social-media/ig.avif"
const ytIconPath = "../icons/social-media/yt.avif"

function changeUiOnDomain(socialMedia) {
  switch (true) {
    case socialMedia.includes("instagram.com") || socialMedia.includes("instagr.am") || socialMedia.includes("cdninstagram.com"):
      executeInstagramUI();
      break;

    case socialMedia.includes("x.com") || socialMedia.includes("twitter.com"):
      executeTwitterUI();
      break;

    case socialMedia.includes("youtu.be") || socialMedia.includes("youtube.com"):
      executeYoutubeUI();
      break;

    default:
      executeDefault();
  }
}

changeUiOnDomain("youtube.com")


function executeYoutubeUI() {
  const configDefault = document.querySelector(".sm__configs.youtube");
  configDefault.classList.remove("hidden");
    mainIcon.src = ytIconPath
}

function executeInstagramUI() {
  const configDefault = document.querySelector(".sm__configs.instagram");
  configDefault.classList.remove("hidden");
  mainIcon.src = igIconPath

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
    mainIcon.src = twIconPath
  console.log("on tw")
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
  // configDefault.classList.remove("hidden");
}


/*
function changeUiOnDomain() {
  switch (whereAmI) {
    case whereAmI.includes(
      "instagram.com" || "instagr.am" || "cdninstagram.com",
    ):
      executeInstagramUI();
      break;

    case whereAmI.includes("x.com" || "twitter.com"):
      executeTwitterUI();
      break;

    case whereAmI.includes("youtu.be" || "youtube.com"):
      executeYoutubeUI();
      break;

    default:
      executeDefault();
  }
}

*/