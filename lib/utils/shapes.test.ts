import { describe, it, expect } from 'vitest'
import { generateBlobGeometry } from './shapes'

describe('generateBlobGeometry', () => {
  it('places every point exactly on the given radius when variance is 0', () => {
    // rand=0.5 zeroes out (rand-0.5)*variance for the point radius
    const geo = generateBlobGeometry(0, 0, 50, 6, 0, () => 0.5)
    geo.forEach(({ point }) => {
      const dist = Math.sqrt(point.x ** 2 + point.y ** 2)
      expect(dist).toBeCloseTo(50, 5)
    })
  })

  it('returns exactly `points` entries', () => {
    expect(generateBlobGeometry(0, 0, 50, 8).length).toBe(8)
  })

  it('is centered correctly when cx/cy are offset', () => {
    const geo = generateBlobGeometry(100, 200, 10, 4, 0, () => 0.5)
    const avgX = geo.reduce((s, g) => s + g.point.x, 0) / geo.length
    const avgY = geo.reduce((s, g) => s + g.point.y, 0) / geo.length
    expect(avgX).toBeCloseTo(100, 0)
    expect(avgY).toBeCloseTo(200, 0)
  })
})