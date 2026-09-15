import type { Random } from "./color";

export interface Point {
  x: number;
  y: number;
}

export interface BlobSegment {
  cp1: Point;
  cp2: Point;
  end: Point;
}

export interface BlobPath {
  start: Point;
  segments: BlobSegment[];
}

export interface CanvasSize {
  width: number;
  height: number;
}

/** Maps a circle's percentage position onto pixel coordinates of the canvas. */
export function scalePosition(
  cx: number,
  cy: number,
  { width, height }: CanvasSize
): Point {
  return { x: (cx / 100) * width, y: (cy / 100) * height };
}

/** Blob radius as a fraction of the canvas' shorter side, so shapes stay round. */
export function scaleRadius(
  percent: number,
  { width, height }: CanvasSize
): number {
  return (percent / 100) * Math.min(width, height);
}

export interface BlobOptions {
  points?: number;
  variance?: number;
  random?: Random;
}

/**
 * Bezier control net of a closed blob around `center`. Each vertex sits on a
 * radius jittered by up to ±variance/2, with control points pushed outward and
 * rotated half a segment so the curve stays smooth across the seam.
 */
export function buildBlobPath(
  center: Point,
  radius: number,
  { points = 6, variance = 0.4, random = Math.random }: BlobOptions = {}
): BlobPath {
  const segments: BlobSegment[] = [];

  for (let i = 1; i <= points; i++) {
    const angle = (i * 2 * Math.PI) / points;
    const r = radius * (1 + (random() - 0.5) * variance);
    const prevAngle = ((i - 1) * 2 * Math.PI) / points;
    const cpRadius = radius * (1.2 + random() * 0.4);

    segments.push({
      cp1: {
        x: center.x + cpRadius * Math.cos(prevAngle + Math.PI / points),
        y: center.y + cpRadius * Math.sin(prevAngle + Math.PI / points),
      },
      cp2: {
        x: center.x + cpRadius * Math.cos(angle - Math.PI / points),
        y: center.y + cpRadius * Math.sin(angle - Math.PI / points),
      },
      end: {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle),
      },
    });
  }

  return { start: { x: center.x + radius, y: center.y }, segments };
}
