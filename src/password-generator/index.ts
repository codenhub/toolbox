import { showAlert } from "../_core/utils/index.ts";

const chars = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%&*+=()[]{}^~;:?/_-,.",
};
type CharKey = keyof typeof chars;

const getRandom = (arr: string, len: number): string =>
  arr[Math.floor(Math.random() * len)];

const getChars = (arr: string, amount: number): string => {
  let str: string = "";
  let arrLen = arr.length;
  for (let i = 0; i < amount; i++) {
    str += getRandom(arr, arrLen);
  }
  return str;
};

const scramble = (input: string): string => {
  const chars = input.split("");

  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join("");
};

const copyToClipboard = (text: string): void => {
  try {
    navigator.clipboard.writeText(text);
    showAlert({
      message: "Copied to clipboard",
      type: "success",
    });
  } catch (err) {
    showAlert({
      message: "Failed to copy to clipboard: " + err,
      type: "error",
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const pw = document.getElementById("pw");
  const regenBtn = document.getElementById("regen");
  const copyBtn = document.getElementById("copy");
  const lengthInput = document.getElementById("pw-len");
  const lengthText = document.getElementById("pw-len-text");
  const checkboxes = document.querySelectorAll("input[type=checkbox]");

  const generatePassword = (): void => {
    let password: string = "";
    const len: number =
      parseInt((lengthInput as HTMLInputElement)?.value) || 12;

    let variants: string[] = [];
    checkboxes.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked)
        variants.push(chars[checkbox.id as CharKey]);
    });
    if (variants.length === 0) return;

    const minEach = Math.floor(len / variants.length);
    variants.forEach((variant) => {
      password += getChars(variant, minEach);
    });

    const allChars = variants.join("");

    while (password.length < len) {
      password += getRandom(allChars, allChars.length);
    }

    if (pw) pw.textContent = scramble(password);
  };

  if (lengthText) {
    lengthInput?.addEventListener("input", (e) => {
      const len = (e.target as HTMLInputElement)?.value || "8";
      lengthText.textContent = len;
      generatePassword();
    });
  } else {
    throw new Error("Length text element not found.");
  }

  regenBtn?.addEventListener("click", generatePassword);
  copyBtn?.addEventListener("click", () => {
    if (pw) copyToClipboard(pw.textContent);
  });
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", generatePassword);
  });
  generatePassword();
});
