import { Controller, CMYK, HSL, HSV, RGB } from "./models.ts";

const controller = new Controller();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container") as HTMLDivElement;
  const colorArea = document.getElementById("color-area") as HTMLDivElement;
  const colorPicker = document.getElementById("color-picker") as HTMLDivElement;
  const slider = document.getElementById("hue-slider") as HTMLDivElement;
  const sliderPicker = document.getElementById("hue-picker") as HTMLDivElement;
  const hsv: HSV = {
    h: 0,
    s: 0,
    v: 100,
  };

  const updateColor = () => {
    controller.update(hsv);
    container.style.setProperty("--current-color", controller.getRgbCssValue());
    const { r, g, b } = controller.hsvToRgb({ h: hsv.h, s: 100, v: 100 });
    container.style.setProperty("--current-hue-color", `rgb(${r}, ${g}, ${b})`);
    container.style.setProperty("--current-hue", `${hsv.h}`);
  };

  const handleColorPicker = (e: MouseEvent) => {
    const rect = colorArea.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
    hsv.s = Math.round((100 / rect.width) * x);
    hsv.v = Math.round((100 / rect.height) * (rect.height - y));

    updateColor();
    colorPicker.style.left = `${x}px`;
    colorPicker.style.top = `${y}px`;
  };

  colorArea.addEventListener("click", handleColorPicker);
  colorArea.addEventListener("mousedown", () => {
    colorArea.addEventListener("mousemove", handleColorPicker);
  });
  colorArea.addEventListener("mouseup", () => {
    colorArea.removeEventListener("mousemove", handleColorPicker);
  });

  const handleHuePicker = (e: MouseEvent) => {
    const rect = slider.getBoundingClientRect();
    const { clientX } = e;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    hsv.h = Math.round((360 / rect.width) * x);

    updateColor();
    sliderPicker.style.left = `${x}px`;
  };

  slider.addEventListener("click", handleHuePicker);
  slider.addEventListener("mousedown", () => {
    slider.addEventListener("mousemove", handleHuePicker);
  });
  slider.addEventListener("mouseup", () => {
    slider.removeEventListener("mousemove", handleHuePicker);
  });
});
