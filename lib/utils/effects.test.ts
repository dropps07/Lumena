
import { describe, it, expect } from 'vitest'
import { applyGrainToChannel } from './effects'

describe('applyGrainToChannel', () => {
  it('clamps grain contribution to +30 max even with huge positive noise', () => {
    const result = applyGrainToChannel(100, 999, 1)
    expect(result).toBeLessThanOrEqual(130) // 100 + 30 max
  })

  it('clamps grain contribution to -30 min even with huge negative noise', () => {
    const result = applyGrainToChannel(100, -999, 1)
    expect(result).toBeGreaterThanOrEqual(70) // 100 - 30 max
  })

  it('never produces a negative channel value', () => {
    const result = applyGrainToChannel(5, -999, 1)
    expect(result).toBeGreaterThanOrEqual(0)
  })

  it('returns roughly unchanged value when noise is 0', () => {
    expect(applyGrainToChannel(100, 0, 1)).toBe(100)
  })
})