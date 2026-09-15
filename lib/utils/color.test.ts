 import { describe, it, expect } from 'vitest'
   import { hslToHex } from './color'

   describe('hslToHex', () => {
     it('converts pure red', () => {
       expect(hslToHex(0, 100, 50)).toBe('#ff0000')
     })
     it('converts pure black regardless of hue/sat', () => {
       expect(hslToHex(200, 80, 0)).toBe('#000000')
     })
     it('converts pure white regardless of hue/sat', () => {
       expect(hslToHex(90, 50, 100)).toBe('#ffffff')
     })
     it('produces achromatic gray when saturation is 0', () => {
       expect(hslToHex(180, 0, 50)).toBe('#808080')
     })
   })