// content/cat-card.js
// Tarjeta que reemplaza a un post oculto (keyword) o al feed (límite), con sugerencias

const CARD_STYLE_ID = "cat-card-style";
export const CARD_CLASS = "cat-card";

// url: null = sugerencia sin link
const suggestions = [
  { text: "Play a game of chess", url: "https://lichess.org" },
  { text: "Do your Duolingo lesson", url: "https://www.duolingo.com/learn" },
  { text: "Solve today's Wordle", url: "https://www.nytimes.com/games/wordle" },
  { text: "Try today's Pedantle", url: "https://pedantle.certitudes.org" },
  { text: "Draw something", url: null },
  { text: "Read a few pages of a book", url: null },
  { text: "Write something", url: null },
];

function ensureCardStyle() {
  if (document.getElementById(CARD_STYLE_ID)) return;

  const styleTag = document.createElement("style");
  styleTag.id = CARD_STYLE_ID;
  // Gris y azul de X: se leen bien en los temas claro, dim y oscuro
  styleTag.textContent = `
    .${CARD_CLASS} {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(113, 118, 123, 0.3);
      color: rgb(113, 118, 123);
      font: 15px/1.4 -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .${CARD_CLASS} p { margin: 0 0 4px; }
    .${CARD_CLASS} a { color: rgb(29, 155, 240); text-decoration: none; }
    .${CARD_CLASS} a:hover { text-decoration: underline; }
    .${CARD_CLASS} button {
      margin-top: 4px;
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      font: inherit;
      font-size: 13px;
      text-decoration: underline;
      cursor: pointer;
    }
  `;
  (document.head || document.documentElement).appendChild(styleTag);
}

function randomSuggestion() {
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}

/**
 * @param {string} message - texto principal ("This post was hidden...")
 * @param {boolean} showSuggestion - setting global "Allow suggestions from the cat"
 * @param {function} onReveal - si viene, se agrega el botón "Show anyway"
 */
export function createCard({ message, showSuggestion, onReveal }) {
  ensureCardStyle();

  const card = document.createElement("div");
  card.classList.add(CARD_CLASS);

  const title = document.createElement("p");
  title.textContent = message;
  card.append(title);

  if (showSuggestion) {
    const { text, url } = randomSuggestion();
    const line = document.createElement("p");
    line.append("Instead of scrolling: ");

    if (url) {
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = text;
      line.append(link);
    } else {
      line.append(text);
    }
    card.append(line);
  }

  if (onReveal) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Show anyway";
    button.addEventListener("click", onReveal);
    card.append(button);
  }

  return card;
}
