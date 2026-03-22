import type { DrawFn } from '@/lib/core/types'
import { rgba } from '@/lib/core/utils'

export const draw: DrawFn = (ctx, w, h, p) => {
  const fg     = (p.fg          as string)  || '#5b7cf6'
  const bg     = (p.bg          as string)  || '#0e0f11'
  const size   = (p.size        as number)  || 40
  const lw     = (p.strokeWidth as number)  || 1.5
  const opacity= (p.opacity     as number)  ?? 1
  const angle  = (p.angle       as number)  || 0
  const filled = (p.filled      as number)  || 0

  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  ctx.save()
  if (angle) {
    ctx.translate(w / 2, h / 2)
    ctx.rotate(angle * Math.PI / 180)
    ctx.translate(-w / 2, -h / 2)
  }

  ctx.strokeStyle = rgba(fg, opacity)
  ctx.lineWidth   = lw
  ctx.lineJoin    = 'miter'

  // Diamond grid: each diamond is size×size, arranged in offset rows
  // Row spacing = size/2 so diamonds interlock perfectly
  const halfW = size / 2
  const halfH = size / 2
  const colStep = size
  const rowStep = size / 2

  const D    = Math.hypot(w, h)
  const cols = Math.ceil(D / colStep) + 6
  const rows = Math.ceil(D / rowStep) + 6

  for (let row = -4; row < rows; row++) {
    for (let col = -4; col < cols; col++) {
      // Offset every other row by half a column width
      const offsetX = (row % 2 !== 0) ? halfW : 0
      const cx = col * colStep + offsetX - D / 4
      const cy = row * rowStep - D / 4

      ctx.beginPath()
      ctx.moveTo(cx,          cy - halfH) // top
      ctx.lineTo(cx + halfW,  cy)          // right
      ctx.lineTo(cx,          cy + halfH)  // bottom
      ctx.lineTo(cx - halfW,  cy)          // left
      ctx.closePath()

      if (filled) {
        ctx.fillStyle = rgba(fg, opacity * 0.12)
        ctx.fill()
      }
      ctx.stroke()
    }
  }

  ctx.restore()
}
