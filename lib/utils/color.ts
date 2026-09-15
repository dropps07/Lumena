export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface PaletteScheme {
  hueStep: number;
  count: number;
}

export interface Range {
  min: number;
  max: number;
}

export type Random = () => number;

export const PALETTE_SCHEMES: { hueStep: number; min: number; max: number }[] =
  [
    { hueStep: 30, min: 3, max: 8 }, // Analogous
    { hueStep: 120, min: 3, max: 6 }, // Triadic
    { hueStep: 180, min: 2, max: 5 }, // Split complementary
    { hueStep: 60, min: 3, max: 8 }, // Hexadic
    { hueStep: 90, min: 3, max: 6 }, // Square
    { hueStep: 45, min: 3, max: 7 }, // Custom angle
  ];

export const SATURATION_RANGES: Range[] = [
  { min: 70, max: 90 }, // Vibrant
  { min: 40, max: 60 }, // Muted
  { min: 85, max: 100 }, // Super saturated
  { min: 55, max: 75 }, // Balanced
];

export const LIGHTNESS_RANGES: Range[] = [
  { min: 40, max: 60 }, // Medium
  { min: 60, max: 80 }, // Light
  { min: 20, max: 40 }, // Dark
  { min: 30, max: 70 }, // Wide range
];

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Wraps a hue onto [0, 360), so negative shifts stay on the colour wheel. */
export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

export function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = normalizeHue(h) / 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  const c = (1 - Math.abs(2 * light - 1)) * sat;
  const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
  const m = light - c / 2;

  let r, g, b;
  if (hue < 1 / 6) [r, g, b] = [c, x, 0];
  else if (hue < 2 / 6) [r, g, b] = [x, c, 0];
  else if (hue < 3 / 6) [r, g, b] = [0, c, x];
  else if (hue < 4 / 6) [r, g, b] = [0, x, c];
  else if (hue < 5 / 6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const channel = (n: number) =>
    clamp(Math.round(n), 0, 255)
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

export function hexToRgb(hex: string): RGB {
  const value = hex.replace("#", "");
  const full =
    value.length === 3
      ? value
          .split("")
          .map((c) => c + c)
          .join("")
      : value;

  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid hex colour: ${hex}`);
  }

  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

export function hslToHex(h: number, s: number, l: number): string {
  return rgbToHex(hslToRgb({ h, s, l }));
}

/** Interpolates two hex colours in sRGB space; t is clamped to [0, 1]. */
export function mixHex(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const ratio = clamp(t, 0, 1);

  return rgbToHex({
    r: lerp(a.r, b.r, ratio),
    g: lerp(a.g, b.g, ratio),
    b: lerp(a.b, b.b, ratio),
  });
}

/**
 * Evenly spaced colour stops across a gradient ramp, inclusive of both ends.
 * `steps` is the number of returned stops.
 */
export function gradientStops(
  from: string,
  to: string,
  steps: number
): string[] {
  if (steps < 1) return [];
  if (steps === 1) return [mixHex(from, to, 0)];

  return Array.from({ length: steps }, (_, i) =>
    mixHex(from, to, i / (steps - 1))
  );
}

function randomInRange(range: Range, random: Random): number {
  return range.min + random() * (range.max - range.min);
}

function pick<T>(items: T[], random: Random): T {
  return items[Math.floor(random() * items.length)];
}

export interface Palette {
  colors: string[];
  backgroundColor: string;
  textColor: string;
  glowColor: string;
}

/**
 * Builds a harmonious palette plus matching background, text and glow colours.
 * `random` is injectable so callers (and tests) can control the sequence.
 */
export function generateHarmoniousPalette(
  random: Random = Math.random
): Palette {
  const schemeSpec = pick(PALETTE_SCHEMES, random);
  const count =
    Math.floor(random() * (schemeSpec.max - schemeSpec.min + 1)) +
    schemeSpec.min;
  const baseHue = random() * 360;

  const bgHue = normalizeHue(baseHue + 180);
  const bgSat = 20 + random() * 40;
  const bgLight =
    random() > 0.5
      ? 10 + random() * 20 // Dark background
      : 80 + random() * 15; // Light background

  const backgroundColor = hslToHex(bgHue, bgSat, bgLight);

  const textLight =
    bgLight < 50
      ? 95 + random() * 5 // Almost white on dark backgrounds
      : random() * 5; // Almost black on light backgrounds
  const textColor = hslToHex(0, 0, textLight);

  const glowLight =
    bgLight < 50
      ? textLight - (10 + random() * 15)
      : textLight + (10 + random() * 15);
  const glowColor = hslToHex(0, 0, clamp(glowLight, 0, 100));

  const satRange = pick(SATURATION_RANGES, random);
  const lightRange = pick(LIGHTNESS_RANGES, random);

  const baseColors: HSL[] = Array.from({ length: count }, (_, i) => ({
    h: normalizeHue(baseHue + i * schemeSpec.hueStep),
    s: randomInRange(satRange, random),
    l: randomInRange(lightRange, random),
  }));

  const colors = baseColors.flatMap((base) => {
    const variations = [base];

    if (random() > 0.3) {
      variations.push({
        h: normalizeHue(base.h + 15 - random() * 30),
        s: clamp(base.s + (random() * 30 - 15), 20, 100),
        l: clamp(base.l + (random() * 40 - 20), 10, 90),
      });
    }

    return variations;
  });

  return {
    colors: colors.map(({ h, s, l }) => hslToHex(h, s, l)),
    backgroundColor,
    textColor,
    glowColor,
  };
}
