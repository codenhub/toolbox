const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lower = "abcdefghijklmnopqrstuvwxyz";
const numbers = "0123456789";
const special = "!@#$%&*+=()[]{}^~;:?/_-,.";

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

document.addEventListener("DOMContentLoaded", () => {
  const lenghtInput = document.getElementById("pw-len");
  const upperCheckbox = document.getElementById("upper");
  const lowerCheckbox = document.getElementById("lower");
  const numbersCheckbox = document.getElementById("numbers");
  const symbolsCheckbox = document.getElementById("symbols");

  const lengthText = document.getElementById("pw-len-text");

  if (lengthText) {
    lenghtInput?.addEventListener("input", (e) => {
      const len = (e.target as HTMLInputElement)?.value || "8";
      lengthText.textContent = len;
    });
  } else {
    throw new Error("Length text element not found.");
  }
});
