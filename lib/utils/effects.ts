import { createNoise2D } from "simplex-noise";

export function applyGrainToChannel(
  value: number,
  noise: number,
  intensity: number,
  amplitude = 50
): number {
  const grainValue = Math.max(-30, Math.min(30, noise * (intensity * amplitude)));
  return Math.max(0, value + grainValue);
}


export function applyGrainEffect(
  ctx: CanvasRenderingContext2D,
  intensity: number = 0.15
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const noise2D = createNoise2D();
  const scale = 1;

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % ctx.canvas.width;
    const y = Math.floor(i / 4 / ctx.canvas.width);
    const noise = noise2D(x * scale, y * scale);

    data[i]     = applyGrainToChannel(data[i], noise, intensity);
    data[i + 1] = applyGrainToChannel(data[i + 1], noise, intensity);
    data[i + 2] = applyGrainToChannel(data[i + 2], noise, intensity);
  }

  ctx.putImageData(imageData, 0, 0);
}