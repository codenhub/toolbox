import { Controller } from "./models.ts";
import { showAlert } from "../_core/utils/index.ts";

const controller = new Controller();

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container") as HTMLDivElement;
  const colorArea = document.getElementById("color-area") as HTMLDivElement;
  const colorPicker = document.getElementById("color-picker") as HTMLDivElement;
  const slider = document.getElementById("hue-slider") as HTMLDivElement;
  const sliderPicker = document.getElementById("hue-picker") as HTMLDivElement;

  const inputsContainer = document.getElementById(
    "inputs-container",
  ) as HTMLDivElement;

  const updateUI = () => {
    const { hsv } = controller.getAll();
    const { h, s, v } = hsv.object;

    container.style.setProperty("--current-color", controller.getRgbValue());
    const rgbHue = controller.hsvToRgb({ h, s: 100, v: 100 });
    container.style.setProperty(
      "--current-hue-color",
      `rgb(${rgbHue.r}, ${rgbHue.g}, ${rgbHue.b})`,
    );
    container.style.setProperty("--current-hue", `${h}`);

    if (colorArea.getBoundingClientRect().width > 0) {
      colorPicker.style.left = `${s}%`;
      colorPicker.style.top = `${100 - v}%`;
    }

    if (slider.getBoundingClientRect().width > 0) {
      sliderPicker.style.left = `${(h / 360) * 100}%`;
    }

    renderInputs();
  };

  const renderInputs = () => {
    const allModels = controller.getAll();

    Object.entries(allModels).forEach(([key, model]) => {
      let group = document.getElementById(`group-${key}`);
      let input: HTMLInputElement;

      if (!group) {
        group = document.createElement("div");
        group.id = `group-${key}`;
        group.className = "group relative flex gap-2 items-center";

        const label = document.createElement("p");
        label.className = "text-xl";
        label.textContent = `${key.toUpperCase()}:`;

        input = document.createElement("input");
        input.type = "text";
        input.addEventListener("change", (e) => {
          const val = (e.target as HTMLInputElement).value;
          controller.updateFrom(key, val);
          updateUI();
        });

        const copyBtn = document.createElement("button");
        copyBtn.className =
          "absolute size-5 right-5 top-1/2 -translate-1/2 opacity-0 group-hover:opacity-100 transition duration-400";
        copyBtn.innerHTML = `<img src="/assets/icons/copy.svg" alt="Copy icon" class="brightness-0 invert" />`;
        copyBtn.addEventListener("click", () => {
          try {
            navigator.clipboard.writeText(input.value);
            showAlert({
              message: "Copied to clipboard",
              type: "success",
            });
          } catch (error) {
            showAlert({
              message: "Failed to copy to clipboard: " + error,
              type: "error",
            });
          }
        });

        group.appendChild(label);
        group.appendChild(input);
        group.appendChild(copyBtn);
        inputsContainer.appendChild(group);
      } else {
        input = group.querySelector("input") as HTMLInputElement;
      }

      if (document.activeElement !== input) {
        input.value = model.text;
      }
    });
  };

  renderInputs();
  updateUI();

  const handleColorPicker = (e: MouseEvent) => {
    const rect = colorArea.getBoundingClientRect();
    const { clientX, clientY } = e;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

    const s = Math.round((100 / rect.width) * x);
    const v = Math.round((100 / rect.height) * (rect.height - y));

    const currentHsv = controller.getAll().hsv.object;
    controller.update({ ...currentHsv, s, v });

    updateUI();
  };

  const handleHuePicker = (e: MouseEvent) => {
    const rect = slider.getBoundingClientRect();
    const { clientX } = e;
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));

    const h = Math.round((360 / rect.width) * x);

    const currentHsv = controller.getAll().hsv.object;
    controller.update({ ...currentHsv, h });

    updateUI();
  };

  let isDraggingColor = false;
  colorArea.addEventListener("mousedown", (e) => {
    isDraggingColor = true;
    handleColorPicker(e);
  });
  window.addEventListener("mousemove", (e) => {
    if (isDraggingColor) handleColorPicker(e);
  });
  window.addEventListener("mouseup", () => {
    isDraggingColor = false;
  });

  let isDraggingHue = false;
  slider.addEventListener("mousedown", (e) => {
    isDraggingHue = true;
    handleHuePicker(e);
  });
  window.addEventListener("mousemove", (e) => {
    if (isDraggingHue) handleHuePicker(e);
  });
  window.addEventListener("mouseup", () => {
    isDraggingHue = false;
  });
});
