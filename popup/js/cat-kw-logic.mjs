// keywords logic
const create = document.getElementById("create");
const inp1 = document.getElementById("inp1");
const kwAddedContainer = document.getElementById("kw__added-container");
const input = document.querySelector(".post-limit-input-ig");

export function kwLogic() {
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
