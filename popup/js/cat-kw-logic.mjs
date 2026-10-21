// keywords logic
import { cache, saveCache } from "./cat-cache.mjs";

const create = document.getElementById("create");
const inp1 = document.getElementById("inp1");
const kwAddedContainer = document.getElementById("kw__added-container");
const input = document.querySelector(".post-limit-input-ig");

// draws a chip per saved keyword; clicking a chip deletes it
export function renderKeywords() {
  kwAddedContainer.replaceChildren();

  cache.keywords.forEach((kw) => {
    let newELement = document.createElement("span");
    newELement.classList.add("kw__blacklist");
    newELement.textContent = kw;
    kwAddedContainer.append(newELement);

    newELement.addEventListener("click", async () => {
      cache.keywords = cache.keywords.filter((k) => k !== kw);
      renderKeywords();
      await saveCache();
    });
  });
}

export function kwLogic() {
  create.addEventListener("click", async () => {
    let inp = inp1.value.trim();
    inp1.value = "";

    if (inp === "") return;

    // the filter ignores case, so "IA" and "ia" are the same keyword
    const exists = cache.keywords.some(
      (kw) => kw.toLowerCase() === inp.toLowerCase()
    );
    if (exists) return;

    cache.keywords.push(inp);
    renderKeywords();
    await saveCache();
  });

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
}
