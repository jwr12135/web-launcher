/* eslint-disable no-bitwise */

// Conversion algorithms: https://github.com/Qix-/color-convert/blob/master/conversions.js

export function rgbaToHex(rgba: [number, number, number, number?]): string {
  let alpha = '';
  if (rgba[3] !== undefined) {
    const alphaNum = rgba[3] & 0xff;
    if (alphaNum < 0xff) {
      alpha = alphaNum.toString(16).toUpperCase();
      alpha = `00`.slice(alpha.length) + alpha;
    }
  }

  const hex = (
    ((Math.round(rgba[0]) & 0xff) << 16) +
    ((Math.round(rgba[1]) & 0xff) << 8) +
    (Math.round(rgba[2]) & 0xff)
  )
    .toString(16)
    .toUpperCase();

  return `000000`.slice(hex.length) + hex + alpha;
}

export function hexToRgba(
  hex: string,
): [number, number, number, number] | undefined {
  const match = /[\da-f]{8}|[\da-f]{6}|[\da-f]{4}|[\da-f]{3}/i.exec(hex);

  if (!match) return undefined;

  let hexMatch = match[0];

  if (hexMatch.length < 6)
    hexMatch = hexMatch
      .split('')
      .map((c) => c + c)
      .join('');
  if (hexMatch.length < 8) hexMatch += 'ff';

  const num = Number.parseInt(hexMatch, 16);

  return [
    (num >> 24) & 0xff,
    (num >> 16) & 0xff,
    (num >> 8) & 0xff,
    num & 0xff,
  ];
}

export function rgbToHsv(
  rgb: [number, number, number],
): [number, number, number] {
  let rDif: number;
  let gDif: number;
  let bDif: number;
  let h = 0;
  let s = 0;

  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;
  const v = Math.max(r, g, b);
  const diff = v - Math.min(r, g, b);
  const diffC = (c: number): number => (v - c) / 6 / diff + 1 / 2;

  if (diff !== 0) {
    s = diff / v;
    rDif = diffC(r);
    gDif = diffC(g);
    bDif = diffC(b);

    switch (v) {
      case r: {
        h = bDif - gDif;
        break;
      }
      case g: {
        h = 1 / 3 + rDif - bDif;
        break;
      }
      case b: {
        h = 2 / 3 + gDif - rDif;
        break;
      }
      default: {
        break;
      }
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  return [h * 360, s * 100, v * 100];
}

export function hsvToRgb(
  hsv: [number, number, number],
  // @ts-expect-error
): [number, number, number] {
  const h = hsv[0] / 60;
  const s = hsv[1] / 100;
  let v = hsv[2] / 100;

  const f = h - Math.floor(h);
  const p = 255 * v * (1 - s);
  const q = 255 * v * (1 - s * f);
  const t = 255 * v * (1 - s * (1 - f));
  v *= 255;

  switch (Math.floor(h) % 6) {
    case 0: {
      return [v, t, p];
    }
    case 1: {
      return [q, v, p];
    }
    case 2: {
      return [p, v, t];
    }
    case 3: {
      return [p, q, v];
    }
    case 4: {
      return [t, p, v];
    }
    case 5: {
      return [v, p, q];
    }
    default: {
      break;
    }
  }
}
