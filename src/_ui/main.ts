document.addEventListener("DOMContentLoaded", () => {
  // MAKE IMAGES AND LINKS NOT DRAGGABLE
  document.querySelectorAll("img, a").forEach((img) => {
    img.setAttribute("draggable", "false");
  });
});
