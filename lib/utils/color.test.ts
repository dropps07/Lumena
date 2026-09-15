import { describe, expect, it } from "vitest";

import {
  LIGHTNESS_RANGES,
  PALETTE_SCHEMES,
  SATURATION_RANGES,
  clamp,
  generateHarmoniousPalette,
  gradientStops,
  hexToRgb,
  hslToHex,
  hslToRgb,
  lerp,
  mixHex,
  normalizeHue,
  rgbToHex,
} from "./color";

/**
 * Deterministic stand-in for Math.random: replays `values`, then repeats
 * `rest` (defaults to cycling the sequence).
 */
function sequence(values: number[], rest?: number): () => number {
  let i = 0;
  return () => {
    const value = i < values.length ? values[i] : rest ?? values[i % values.length];
    i++;
    return value;
  };
}

describe("normalizeHue", () => {
  it("wraps negative and over-rotated hues onto [0, 360)", () => {
    expect(normalizeHue(-30)).toBe(330);
    expect(normalizeHue(-390)).toBe(330);
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(400)).toBe(40);
    expect(normalizeHue(0)).toBe(0);
  });
});

describe("hslToRgb", () => {
  it("converts the six primary/secondary hue anchors", () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRgb({ h: 60, s: 100, l: 50 })).toEqual({ r: 255, g: 255, b: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
    expect(hslToRgb({ h: 180, s: 100, l: 50 })).toEqual({
      r: 0,
      g: 255,
      b: 255,
    });
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    expect(hslToRgb({ h: 300, s: 100, l: 50 })).toEqual({
      r: 255,
      g: 0,
      b: 255,
    });
  });

  it("collapses to grayscale when saturation is zero", () => {
    for (const hue of [0, 90, 210, 359]) {
      expect(hslToRgb({ h: hue, s: 0, l: 50 })).toEqual({
        r: 128,
        g: 128,
        b: 128,
      });
    }
  });

  it("returns black and white at the lightness extremes regardless of hue", () => {
    expect(hslToRgb({ h: 200, s: 100, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
    expect(hslToRgb({ h: 200, s: 100, l: 100 })).toEqual({
      r: 255,
      g: 255,
      b: 255,
    });
  });

  it("treats hue 360 as hue 0 instead of falling through to magenta", () => {
    expect(hslToRgb({ h: 360, s: 100, l: 50 })).toEqual(
      hslToRgb({ h: 0, s: 100, l: 50 })
    );
  });

  it("wraps negative hues rather than producing an out-of-wheel colour", () => {
    expect(hslToRgb({ h: -120, s: 100, l: 50 })).toEqual(
      hslToRgb({ h: 240, s: 100, l: 50 })
    );
  });

  it("clamps out-of-range saturation and lightness", () => {
    expect(hslToRgb({ h: 0, s: 150, l: 50 })).toEqual(
      hslToRgb({ h: 0, s: 100, l: 50 })
    );
    expect(hslToRgb({ h: 0, s: 100, l: -20 })).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("rgbToHex / hexToRgb", () => {
  it("zero-pads single digit channels", () => {
    expect(rgbToHex({ r: 1, g: 2, b: 3 })).toBe("#010203");
  });

  it("clamps and rounds fractional channels", () => {
    expect(rgbToHex({ r: 127.5, g: -10, b: 300 })).toBe("#8000ff");
  });

  it("parses 6 and 3 digit hex, with or without a leading hash", () => {
    expect(hexToRgb("#ff8800")).toEqual({ r: 255, g: 136, b: 0 });
    expect(hexToRgb("f80")).toEqual({ r: 255, g: 136, b: 0 });
  });

  it("round-trips through hex without drift", () => {
    const colors = ["#000000", "#ffffff", "#123456", "#abcdef"];
    for (const color of colors) {
      expect(rgbToHex(hexToRgb(color))).toBe(color);
    }
  });

  it("rejects malformed hex input", () => {
    expect(() => hexToRgb("#12345")).toThrow(/Invalid hex colour/);
    expect(() => hexToRgb("#gggggg")).toThrow(/Invalid hex colour/);
  });
});

describe("hslToHex", () => {
  it("matches known HSL to hex conversions", () => {
    expect(hslToHex(0, 100, 50)).toBe("#ff0000");
    expect(hslToHex(210, 50, 40)).toBe("#336699");
    expect(hslToHex(0, 0, 100)).toBe("#ffffff");
    expect(hslToHex(0, 0, 0)).toBe("#000000");
  });

  it("is a pure function of its inputs", () => {
    expect(hslToHex(137, 63, 42)).toBe(hslToHex(137, 63, 42));
  });
});

describe("lerp / clamp", () => {
  it("interpolates endpoints and midpoint", () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 0, 0.25)).toBe(7.5);
  });

  it("clamps to bounds", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(50, 0, 10)).toBe(10);
  });
});

describe("mixHex", () => {
  it("returns the endpoints at t=0 and t=1", () => {
    expect(mixHex("#000000", "#ffffff", 0)).toBe("#000000");
    expect(mixHex("#000000", "#ffffff", 1)).toBe("#ffffff");
  });

  it("blends per channel at the midpoint", () => {
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHex("#ff0000", "#0000ff", 0.5)).toBe("#800080");
  });

  it("is symmetric under swapping the endpoints", () => {
    expect(mixHex("#112233", "#aabbcc", 0.25)).toBe(
      mixHex("#aabbcc", "#112233", 0.75)
    );
  });

  it("is monotonic along the ramp", () => {
    const reds = [0, 0.2, 0.4, 0.6, 0.8, 1].map(
      (t) => hexToRgb(mixHex("#000000", "#ff0000", t)).r
    );
    for (let i = 1; i < reds.length; i++) {
      expect(reds[i]).toBeGreaterThan(reds[i - 1]);
    }
  });

  it("clamps t outside [0, 1]", () => {
    expect(mixHex("#000000", "#ffffff", -2)).toBe("#000000");
    expect(mixHex("#000000", "#ffffff", 5)).toBe("#ffffff");
  });
});

describe("gradientStops", () => {
  it("includes both endpoints and spaces stops evenly", () => {
    expect(gradientStops("#000000", "#ffffff", 5)).toEqual([
      "#000000",
      "#404040",
      "#808080",
      "#bfbfbf",
      "#ffffff",
    ]);
  });

  it("handles degenerate step counts", () => {
    expect(gradientStops("#000000", "#ffffff", 0)).toEqual([]);
    expect(gradientStops("#000000", "#ffffff", -3)).toEqual([]);
    expect(gradientStops("#010203", "#ffffff", 1)).toEqual(["#010203"]);
  });

  it("returns exactly `steps` stops", () => {
    for (const steps of [2, 3, 7, 16]) {
      expect(gradientStops("#ff0000", "#00ff00", steps)).toHaveLength(steps);
    }
  });
});

describe("generateHarmoniousPalette", () => {
  it("is deterministic for a given random source", () => {
    const values = [0.1, 0.42, 0.73, 0.2, 0.9, 0.05, 0.6, 0.35, 0.8, 0.15];
    expect(generateHarmoniousPalette(sequence(values))).toEqual(
      generateHarmoniousPalette(sequence(values))
    );
  });

  it("emits only valid 6 digit hex colours", () => {
    const hex = /^#[0-9a-f]{6}$/;
    // 0, 0.5 and 0.999 exercise the low/high branches of every random draw.
    for (const value of [0, 0.5, 0.999]) {
      const palette = generateHarmoniousPalette(() => value);
      for (const color of [
        ...palette.colors,
        palette.backgroundColor,
        palette.textColor,
        palette.glowColor,
      ]) {
        expect(color).toMatch(hex);
      }
    }
  });

  it("honours each scheme's colour count bounds", () => {
    // First draw selects the scheme, second its count; the trailing zeros
    // suppress the optional per-colour variations (they need a draw > 0.3).
    PALETTE_SCHEMES.forEach((scheme, index) => {
      const schemeDraw = index / PALETTE_SCHEMES.length;

      const smallest = generateHarmoniousPalette(sequence([schemeDraw, 0], 0));
      const largest = generateHarmoniousPalette(
        sequence([schemeDraw, 0.999], 0)
      );

      expect(smallest.colors).toHaveLength(scheme.min);
      expect(largest.colors).toHaveLength(scheme.max);
    });
  });

  it("adds one variation per base colour when the variation draw passes", () => {
    // All draws above the 0.3 variation threshold, analogous scheme, 8 colours.
    const palette = generateHarmoniousPalette(sequence([0, 0.999], 0.999));
    expect(palette.colors).toHaveLength(PALETTE_SCHEMES[0].max * 2);
  });

  it("pairs dark backgrounds with near-white text and vice versa", () => {
    // The background branch draw must exceed 0.5 for a dark background.
    const dark = generateHarmoniousPalette(sequence([0.8]));
    const light = generateHarmoniousPalette(sequence([0.2]));

    const luminance = (hex: string) => {
      const { r, g, b } = hexToRgb(hex);
      return (r + g + b) / 3;
    };

    expect(luminance(dark.backgroundColor)).toBeLessThan(
      luminance(dark.textColor)
    );
    expect(luminance(light.backgroundColor)).toBeGreaterThan(
      luminance(light.textColor)
    );
  });

  it("produces grayscale text and glow colours", () => {
    const palette = generateHarmoniousPalette(sequence([0.3, 0.7, 0.4, 0.9]));

    for (const color of [palette.textColor, palette.glowColor]) {
      const { r, g, b } = hexToRgb(color);
      expect(r).toBe(g);
      expect(g).toBe(b);
    }
  });

  it("derives base hues by stepping the scheme angle around the wheel", () => {
    // Force the analogous scheme (30 degree step), 8 colours, base hue 0 and
    // no extra variations (the variation draw must be <= 0.3).
    const scheme = PALETTE_SCHEMES[0];
    const palette = generateHarmoniousPalette(
      sequence([0 /* analogous */, 0.999 /* max count */, 0 /* base hue */], 0)
    );
    const hues = palette.colors.map((hex) => {
      const { r, g, b } = hexToRgb(hex);
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      if (max === min) return 0;
      const d = max - min;
      const h =
        max === r
          ? ((g - b) / d) % 6
          : max === g
          ? (b - r) / d + 2
          : (r - g) / d + 4;
      return normalizeHue(h * 60);
    });

    expect(palette.colors).toHaveLength(scheme.max);
    hues.forEach((hue, i) => {
      expect(hue).toBeCloseTo(normalizeHue(i * scheme.hueStep), 0);
    });
  });

  it("respects the configured saturation and lightness ranges", () => {
    for (const [index, range] of SATURATION_RANGES.entries()) {
      expect(range.min).toBeLessThan(range.max);
      expect(SATURATION_RANGES[index].max).toBeLessThanOrEqual(100);
    }
    for (const range of LIGHTNESS_RANGES) {
      expect(range.min).toBeGreaterThanOrEqual(0);
      expect(range.max).toBeLessThanOrEqual(100);
    }
  });

  it("defaults to Math.random when no source is given", () => {
    const palette = generateHarmoniousPalette();
    expect(palette.colors.length).toBeGreaterThan(0);
  });
});
