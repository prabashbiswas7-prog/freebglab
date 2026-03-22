import type { DrawFn } from '@/lib/core/types'
import { seedRng, fbm, rgba } from '@/lib/core/utils'

export const draw: DrawFn = (ctx, w, h, p) => {
  seedRng((p.seed as number) || 1)
  const bg      = (p.bg      as string)  || '#080c18'
  const lineCol = (p.lineCol as string)  || '#1a2d4a'
  const glowCol = (p.glowCol as string)  || '#4a90d9'
  const levels  = Math.min(40, (p.levels as number) || 26)
  const scale   = (p.scale   as number)  || 2.6
  const lw      = (p.lw      as number)  || 1.1
  const glow    = (p.glow    as boolean) ?? true
  const fill    = (p.fill    as boolean) || false
  const fillOp  = (p.fillOp  as number)  || 0.04

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Step size for marching squares — larger = faster
  const step = Math.max(2, Math.round(Math.min(w, h) / 200))

  for (let level = 0; level < levels; level++) {
    const threshold = level / levels

    ctx.beginPath()
    for (let y = 0; y < h - step; y += step) {
      for (let x = 0; x < w - step; x += step) {
        const v00 = fbm(x / w * scale, y / h * scale, 4) * 0.5 + 0.5
        const v10 = fbm((x + step) / w * scale, y / h * scale, 4) * 0.5 + 0.5
        const v01 = fbm(x / w * scale, (y + step) / h * scale, 4) * 0.5 + 0.5

        const a = v00 > threshold
        const b2 = v10 > threshold
        const c = v01 > threshold

        if (a !== b2) {
          const t = (threshold - v00) / (v10 - v00 + 0.0001)
          ctx.moveTo(x + t * step, y)
          ctx.lineTo(x + t * step, y + 1)
        }
        if (a !== c) {
          const t = (threshold - v00) / (v01 - v00 + 0.0001)
          ctx.moveTo(x, y + t * step)
          ctx.lineTo(x + 1, y + t * step)
        }
      }
    }

    if (glow) { ctx.shadowColor = glowCol; ctx.shadowBlur = 4 }
    ctx.strokeStyle = lineCol
    ctx.lineWidth   = lw
    ctx.stroke()
    ctx.shadowBlur  = 0

    if (fill) {
      ctx.fillStyle = rgba(lineCol, fillOp)
      ctx.fill()
    }
  }
}
