browser.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local" && changes.catSettings) {
    const nuevoCache = changes.catSettings.newValue;
    console.log("Las settings cambiaron en vivo:", nuevoCache);

    if (nuevoCache.grayscale) {
      document.body.style.filter = "grayscale(100%)";
    } else {
      document.body.style.filter = "none";
    }
  }
});
