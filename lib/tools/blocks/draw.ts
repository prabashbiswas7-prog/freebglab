import type { DrawFn } from '@/lib/core/types'
import { seedRng, rng, fbm, multiLerp } from '@/lib/core/utils'

// Polyfill roundRect for browsers that don't support it
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  if (r === 0) { ctx.rect(x, y, w, h); return }
  r = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export const draw: DrawFn = (ctx, w, h, p) => {
  seedRng((p.seed as number) || 1)
  const colors    = (p.colors     as string[]) || ['#030010', '#0d0040', '#4a00c8']
  const bw        = (p.blockW     as number)   || 40
  const bh        = (p.blockH     as number)   || 40
  const gap       = (p.gap        as number)   || 2
  const round     = (p.roundness  as number)   || 4
  const ns        = (p.noiseScale as number)   || 2.8
  const noiseInt  = (p.noiseInt   as number)   || 55
  const opacity   = (p.opacity    as number)   ?? 1
  const variation = (p.variation  as number)   || 0

  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h)

  for (let y = 0; y <= h; y += bh + gap) {
    for (let x = 0; x <= w; x += bw + gap) {
      const nx = x / w * ns, ny = y / h * ns
      let v = fbm(nx, ny, 4) * 0.5 + 0.5
      v = Math.max(0, Math.min(1, v + (noiseInt / 200 - 0.25)))
      const c = multiLerp(colors, v)
      const jx = variation > 0 ? (rng() - 0.5) * variation * bw / 100 : 0
      const jy = variation > 0 ? (rng() - 0.5) * variation * bh / 100 : 0
      ctx.globalAlpha = opacity
      ctx.fillStyle = c
      ctx.beginPath()
      roundedRect(ctx, x + jx, y + jy, bw, bh, round)
      ctx.fill()
    }
  }
  ctx.globalAlpha = 1
}
