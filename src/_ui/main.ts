window.onload = () => {
  const loaders = document.querySelectorAll(".loader");
  const loaderIndicator = document.getElementById("loader-indicator");

  loaderIndicator?.remove();
  loaders?.forEach((el) => {
    el.classList.add("loaded");
    setTimeout(() => {
      el.remove();
    }, 800);
  });

  document.querySelectorAll("img, a").forEach((el) => {
    el.setAttribute("draggable", "false");
  });
};
