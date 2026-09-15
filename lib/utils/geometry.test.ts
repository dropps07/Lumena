import { describe, expect, it } from "vitest";

import { buildBlobPath, scalePosition, scaleRadius } from "./geometry";

const CANVAS = { width: 1920, height: 1080 };

function sequence(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function distance(
  a: { x: number; y: number },
  b: { x: number; y: number }
): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

describe("scalePosition", () => {
  it("maps percentages onto canvas pixels", () => {
    expect(scalePosition(0, 0, CANVAS)).toEqual({ x: 0, y: 0 });
    expect(scalePosition(100, 100, CANVAS)).toEqual({ x: 1920, y: 1080 });
    expect(scalePosition(50, 50, CANVAS)).toEqual({ x: 960, y: 540 });
  });

  it("keeps positions outside the canvas rather than clamping them", () => {
    expect(scalePosition(150, -50, CANVAS)).toEqual({ x: 2880, y: -540 });
  });
});

describe("scaleRadius", () => {
  it("scales against the shorter canvas side so blobs stay circular", () => {
    expect(scaleRadius(30, CANVAS)).toBeCloseTo(324);
    expect(scaleRadius(30, { width: 1080, height: 1920 })).toBeCloseTo(324);
  });

  it("is linear in the percentage", () => {
    expect(scaleRadius(60, CANVAS)).toBeCloseTo(2 * scaleRadius(30, CANVAS));
    expect(scaleRadius(0, CANVAS)).toBe(0);
  });
});

describe("buildBlobPath", () => {
  const center = { x: 100, y: 100 };
  const radius = 50;

  it("emits one bezier segment per point and closes the ring", () => {
    const path = buildBlobPath(center, radius, {
      points: 6,
      random: () => 0.5,
    });

    expect(path.segments).toHaveLength(6);
    expect(path.start).toEqual({ x: 150, y: 100 });
    // The final vertex returns to the start of the ring (angle 2*PI).
    const last = path.segments[5].end;
    expect(last.x).toBeCloseTo(150);
    expect(last.y).toBeCloseTo(100);
  });

  it("produces an exact circle when the jitter draw is neutral", () => {
    const path = buildBlobPath(center, radius, {
      points: 8,
      random: () => 0.5,
    });

    for (const segment of path.segments) {
      expect(distance(center, segment.end)).toBeCloseTo(radius);
    }
  });

  it("keeps vertices within the variance envelope", () => {
    const variance = 0.4;
    const extremes = buildBlobPath(center, radius, {
      points: 12,
      variance,
      random: sequence([0, 1]), // alternate minimum and maximum jitter
    });

    for (const segment of extremes.segments) {
      const r = distance(center, segment.end);
      expect(r).toBeGreaterThanOrEqual(radius * (1 - variance / 2) - 1e-9);
      expect(r).toBeLessThanOrEqual(radius * (1 + variance / 2) + 1e-9);
    }
  });

  it("collapses to a circle when variance is zero", () => {
    const path = buildBlobPath(center, radius, {
      points: 10,
      variance: 0,
      random: sequence([0, 0.99, 1, 0.33]),
    });

    for (const segment of path.segments) {
      expect(distance(center, segment.end)).toBeCloseTo(radius);
    }
  });

  it("pushes control points outside the vertex radius so curves bulge", () => {
    const path = buildBlobPath(center, radius, {
      points: 6,
      random: () => 0, // minimum control radius factor (1.2)
    });

    for (const { cp1, cp2 } of path.segments) {
      expect(distance(center, cp1)).toBeCloseTo(radius * 1.2);
      expect(distance(center, cp2)).toBeCloseTo(radius * 1.2);
    }
  });

  it("places control points symmetrically half a segment either side", () => {
    const points = 6;
    const path = buildBlobPath(center, radius, { points, random: () => 0 });
    const half = Math.PI / points;

    path.segments.forEach((segment, i) => {
      const angleOf = (p: { x: number; y: number }) =>
        Math.atan2(p.y - center.y, p.x - center.x);
      const prevAngle = (i * 2 * Math.PI) / points;
      const angle = ((i + 1) * 2 * Math.PI) / points;

      expect(Math.cos(angleOf(segment.cp1))).toBeCloseTo(
        Math.cos(prevAngle + half)
      );
      expect(Math.cos(angleOf(segment.cp2))).toBeCloseTo(
        Math.cos(angle - half)
      );
    });
  });

  it("is deterministic for a given random source", () => {
    const values = [0.2, 0.8, 0.45, 0.1, 0.65, 0.33];
    expect(buildBlobPath(center, radius, { random: sequence(values) })).toEqual(
      buildBlobPath(center, radius, { random: sequence(values) })
    );
  });

  it("translates with the center and scales with the radius", () => {
    const base = buildBlobPath(center, radius, {
      points: 6,
      random: () => 0.5,
    });
    const moved = buildBlobPath({ x: 400, y: 250 }, radius, {
      points: 6,
      random: () => 0.5,
    });
    const scaled = buildBlobPath(center, radius * 2, {
      points: 6,
      random: () => 0.5,
    });

    base.segments.forEach((segment, i) => {
      expect(moved.segments[i].end.x - segment.end.x).toBeCloseTo(300);
      expect(moved.segments[i].end.y - segment.end.y).toBeCloseTo(150);

      expect(distance(center, scaled.segments[i].end)).toBeCloseTo(
        2 * distance(center, segment.end)
      );
    });
  });
});
