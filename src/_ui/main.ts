// LOADER
const loaders = document.querySelectorAll(".loader");
const loaderIndicator = document.getElementById("loader-indicator");

document.addEventListener("DOMContentLoaded", () => {
  // REMOVE LOADER
  loaderIndicator?.remove();
  loaders.forEach((el) => {
    el.classList.add("loaded");
    setTimeout(() => {
      el.remove();
    }, 800);
  });

  // MAKE IMAGES AND LINKS NOT DRAGGABLE
  document.querySelectorAll("img, a").forEach((img) => {
    img.setAttribute("draggable", "false");
  });
});
