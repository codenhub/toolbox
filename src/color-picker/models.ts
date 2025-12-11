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

export class Controller {
  private models = {
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
    hsl: { h: 0, s: 0, l: 100 },
    hsv: { h: 0, s: 0, v: 100 },
    rgb: { r: 255, g: 255, b: 255 },
  };

  constructor(defaultHsv: HSV = { h: 0, s: 0, v: 100 }) {
    this.models.hsv = defaultHsv;
  }

  getCmyk(): CMYK {
    return this.models.cmyk;
  }

  getCmykValue(): string {
    let { c, m, y, k } = this.models.cmyk;
    return `${c}%, ${m}%, ${y}%, ${k}%,`;
  }

  getHsl(): HSL {
    return this.models.hsl;
  }

  getHslValue(): string {
    let { h, s, l } = this.models.hsl;
    return `${h}°, ${s}%, ${l}%`;
  }

  getHsv(): HSV {
    return this.models.hsv;
  }

  getHsvValue(): string {
    let { h, s, v } = this.models.hsv;
    return `${h}°, ${s}%, ${v}%`;
  }

  getRgb(): RGB {
    return this.models.rgb;
  }

  getRgbCssValue(): string {
    let { r, g, b } = this.models.rgb;
    return `rgb(${r}, ${g}, ${b})`;
  }

  getRgbValue(): string {
    let { r, g, b } = this.models.rgb;
    return `${r}, ${g}, ${b}`;
  }

  getAll() {
    return this.models;
  }

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

  hsvToRgb(hsv: HSV = this.models.hsv): RGB {
    let { h, s, v } = hsv;
    s /= 100;
    v /= 100;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r = 0;
    let g = 0;
    let b = 0;

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

  rgbToCmyk(rgb: RGB): CMYK {
    const { r, g, b } = rgb;

    const rP = r / 255;
    const gP = g / 255;
    const bP = b / 255;

    const k = 1 - Math.max(rP, gP, bP);

    if (k === 1) {
      return { c: 0, m: 0, y: 0, k: 100 };
    }

    const c = (1 - rP - k) / (1 - k);
    const m = (1 - gP - k) / (1 - k);
    const y = (1 - bP - k) / (1 - k);

    return {
      c: c * 100,
      m: m * 100,
      y: y * 100,
      k: k * 100,
    };
  }

  update(hsv: HSV) {
    this.models = {
      cmyk: { c: 0, m: 0, y: 0, k: 0 },
      hsl: this.hsvToHsl(hsv),
      hsv,
      rgb: this.hsvToRgb(hsv),
    };
  }
}
