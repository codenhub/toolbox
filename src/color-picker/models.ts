export type HSV = {
  h: number;
  s: number;
  v: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type CMYK = {
  c: number;
  m: number;
  y: number;
  k: number;
};

export type HEX = string;

export class Controller {
  private hsv: HSV;

  constructor(defaultHsv: HSV = { h: 0, s: 0, v: 100 }) {
    this.hsv = defaultHsv;
  }

  getAll() {
    const rgb = this.hsvToRgb(this.hsv);
    return {
      hex: { object: this.rgbToHex(rgb), text: this.getHexValue() },
      rgb: { object: rgb, text: this.getRgbValue() },
      hsl: { object: this.hsvToHsl(this.hsv), text: this.getHslValue() },
      hsv: { object: this.hsv, text: this.getHsvValue() },
      cmyk: { object: this.rgbToCmyk(rgb), text: this.getCmykValue() },
    };
  }

  update(hsv: HSV) {
    this.hsv = hsv;
  }

  updateFrom(model: string, value: string) {
    let hsv: HSV | null = null;
    switch (model) {
      case "hex":
        const rgbFromHex = this.hexToRgb(value);
        if (rgbFromHex) hsv = this.rgbToHsv(rgbFromHex);
        break;
      case "rgb":
        const rgb = this.textToRgb(value);
        if (rgb) hsv = this.rgbToHsv(rgb);
        break;
      case "hsl":
        const hsl = this.textToHsl(value);
        if (hsl) hsv = this.hslToHsv(hsl);
        break;
      case "hsv":
        const parsedHsv = this.textToHsv(value);
        if (parsedHsv) hsv = parsedHsv;
        break;
      case "cmyk":
        const cmyk = this.textToCmyk(value);
        if (cmyk) hsv = this.rgbToHsv(this.cmykToRgb(cmyk));
        break;
    }

    if (hsv) {
      this.hsv = hsv;
    }
  }

  // Text getters

  getHexValue(): string {
    return this.rgbToHex(this.hsvToRgb(this.hsv));
  }

  getRgbValue(): string {
    const { r, g, b } = this.hsvToRgb(this.hsv);
    return `rgb(${r}, ${g}, ${b})`;
  }

  getHslValue(): string {
    const { h, s, l } = this.hsvToHsl(this.hsv);
    return `hsl(${Math.round(h)}deg, ${Math.round(s)}%, ${Math.round(l)}%)`;
  }

  getHsvValue(): string {
    const { h, s, v } = this.hsv;
    return `hsv(${Math.round(h)}deg, ${Math.round(s)}%, ${Math.round(v)}%)`;
  }

  getCmykValue(): string {
    const { c, m, y, k } = this.rgbToCmyk(this.hsvToRgb(this.hsv));
    return `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k)}%)`;
  }

  // Parsers (text to object)

  textToRgb(text: string): RGB | null {
    const match = text.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (!match) return null;
    return {
      r: Math.max(0, Math.min(255, parseInt(match[1]))),
      g: Math.max(0, Math.min(255, parseInt(match[2]))),
      b: Math.max(0, Math.min(255, parseInt(match[3]))),
    };
  }

  textToHsl(text: string): HSL | null {
    const match = text.match(/hsl\((\d+)deg,\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return null;
    return {
      h: Math.max(0, Math.min(360, parseInt(match[1]))),
      s: Math.max(0, Math.min(100, parseInt(match[2]))),
      l: Math.max(0, Math.min(100, parseInt(match[3]))),
    };
  }

  textToHsv(text: string): HSV | null {
    const match = text.match(/hsv\((\d+)deg,\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return null;
    return {
      h: Math.max(0, Math.min(360, parseInt(match[1]))),
      s: Math.max(0, Math.min(100, parseInt(match[2]))),
      v: Math.max(0, Math.min(100, parseInt(match[3]))),
    };
  }

  textToCmyk(text: string): CMYK | null {
    const match = text.match(/cmyk\((\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%\)/);
    if (!match) return null;
    return {
      c: Math.max(0, Math.min(100, parseInt(match[1]))),
      m: Math.max(0, Math.min(100, parseInt(match[2]))),
      y: Math.max(0, Math.min(100, parseInt(match[3]))),
      k: Math.max(0, Math.min(100, parseInt(match[4]))),
    };
  }

  // Logic

  hsvToHsl(hsv: HSV): HSL {
    const { h, s, v } = hsv;
    const sv = s / 100;
    const vv = v / 100;
    const l = vv * (1 - sv / 2);

    let sl = 0;
    if (l !== 0 && l !== 1) {
      sl = (vv - l) / Math.min(l, 1 - l);
    }
    return { h, s: sl * 100, l: l * 100 };
  }

  hslToHsv(hsl: HSL): HSV {
    const { h, s, l } = hsl;
    const s_l = s / 100;
    const l_val = l / 100;

    const v = l_val + s_l * Math.min(l_val, 1 - l_val);
    const s_v = v === 0 ? 0 : 2 * (1 - l_val / v);

    return { h, s: s_v * 100, v: v * 100 };
  }

  hsvToRgb(hsv: HSV): RGB {
    let { h, s, v } = hsv;
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  rgbToHsv(rgb: RGB): HSV {
    let { r, g, b } = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (max !== min) {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
    };
  }

  rgbToCmyk(rgb: RGB): CMYK {
    const { r, g, b } = rgb;
    const rP = r / 255,
      gP = g / 255,
      bP = b / 255;
    const k = 1 - Math.max(rP, gP, bP);

    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    return {
      c: ((1 - rP - k) / (1 - k)) * 100,
      m: ((1 - gP - k) / (1 - k)) * 100,
      y: ((1 - bP - k) / (1 - k)) * 100,
      k: k * 100,
    };
  }

  cmykToRgb(cmyk: CMYK): RGB {
    const { c, m, y, k } = cmyk;
    const kP = k / 100;

    const r = 255 * (1 - c / 100) * (1 - kP);
    const g = 255 * (1 - m / 100) * (1 - kP);
    const b = 255 * (1 - y / 100) * (1 - kP);

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  }

  rgbToHex(rgb: RGB): string {
    const toHex = (n: number) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  hexToRgb(hex: string): RGB | null {
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((x) => x + x)
        .join("");
    }
    if (hex.length !== 6) return null;
    const int = parseInt(hex, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255,
    };
  }
}
