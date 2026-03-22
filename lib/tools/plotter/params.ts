import { randInt } from '@/lib/core/utils'
import type { Params } from '@/lib/core/types'

export function defaultParams(): Params {
  return {
    seed: randInt(),
    // Shape
    shape:      'horizontal',
    freq:       0.026,
    amplitude:  68,
    lineCount:  40,
    spacing:    1.0,
    padding:    50,
    thickness:  1.5,
    // Background
    bg:               '#141414',
    bgGradient:       false,
    bgGradientColor:  '#000000',
    // Line color
    lineColor:        '#ffffff',
    lineGradient:     false,
    // Organic effects
    weightVar:   0,
    wobble:      0,
    taper:       0,
    lineBreaks:  false,
    morse:       false,
    // Advanced variations
    spacingVar:  0,
    rotJitter:   0,
    opacityVar:  0,
    colorDrift:  0,
    // Flow
    perlinFlow:  0,
    freqVar:     0,
    flowOctaves: 1,
    // Texture
    noise: 0,
    // Adjustments
    brightness:  100,
    contrast:    100,
    saturation:  100,
  }
}
