import { randInt } from '@/lib/core/utils'
import type { Params } from '@/lib/core/types'
export function defaultParams(): Params {
  return {
    seed: randInt(),
    colors: ['#060310','#1a0550','#3b0fd4','#7c3aed','#a855f7'],
    bg: '#060310',
    count: 7,
    amp: 42,
    freq: 1.8,
    opacity: 1,
    waveWarp: 20,
    smooth: 60,
    overlap: 50,
    lineWidth: 0,
    phase: 0,
    curve: 1,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  }
}
