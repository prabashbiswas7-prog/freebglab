import type { DrawFn } from '@/lib/core/types'
import { seedRng, rng, fbm, hex2rgb, rgba } from '@/lib/core/utils'

export const draw: DrawFn = (ctx, w, h, p) => {
  seedRng((p.seed as number) || 1)

  const colors   = (p.colors    as string[]) || ['#0a0520', '#1a0550', '#3b0fd4', '#7c3aed', '#a855f7']
  const bg       = (p.bg        as string)   || '#060310'
  const count    = Math.max(2, (p.count as number) || 6)
  const amp      = (p.amp       as number)   || 38
  const freq     = (p.freq      as number)   || 2.2
  const opacity  = (p.opacity   as number)   ?? 1
  const warp     = (p.waveWarp  as number)   || 0
  const smooth   = (p.smooth    as number)   || 60  // smoothness of curves
  const overlap  = (p.overlap   as number)   || 40  // how much waves overlap

  // Fill background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  const step = Math.max(1, Math.round(w / 300)) // adaptive step for speed

  for (let i = count - 1; i >= 0; i--) {
    const t      = i / (count - 1) // 0 = bottom, 1 = top
    const col    = colors[i % colors.length]
    const [cr, cg, cb] = hex2rgb(col)

    // Each wave gets unique phase from seed
    const phase  = rng() * Math.PI * 2
    const freqI  = (freq * Math.PI * 2) / w
    const ampI   = (amp / 100) * h * (0.06 + (i / count) * 0.10)

    // Vertical position — waves spread across the canvas with overlap
    const yBase  = h * (0.15 + (i / (count - 1)) * (overlap / 100) * 0.85)

    // Build wave path
    const pts: [number, number][] = []

    for (let x = 0; x <= w; x += step) {
      let y = yBase

      // Primary wave
      y += Math.sin(x * freqI + phase) * ampI

      // Secondary harmonic for organic feel
      y += Math.sin(x * freqI * 1.618 + phase * 1.3) * ampI * 0.35

      // Warp using fbm noise
      if (warp > 0) {
        const nx = x / w * 3
        const ny = i * 0.5
        y += fbm(nx, ny, 3) * (warp / 100) * h * 0.12
      }

      pts.push([x, y])
    }

    // Draw as smooth bezier curves
    ctx.beginPath()
    ctx.moveTo(0, h + 10)     // bottom-left corner
    ctx.lineTo(pts[0][0], pts[0][1])

    // Smooth bezier through points
    for (let j = 0; j < pts.length - 1; j++) {
      const [x0, y0] = pts[j]
      const [x1, y1] = pts[j + 1]
      const cpx = (x0 + x1) / 2
      ctx.quadraticCurveTo(x0, y0, cpx, (y0 + y1) / 2)
    }
    // Last point
    const last = pts[pts.length - 1]
    ctx.lineTo(last[0], last[1])
    ctx.lineTo(w, h + 10)     // bottom-right corner
    ctx.closePath()

    // Gradient fill: bright at wave crest, transparent at bottom
    const g = ctx.createLinearGradient(0, yBase - ampI * 2, 0, h)
    g.addColorStop(0,    `rgba(${cr},${cg},${cb},${opacity * 0.9})`)
    g.addColorStop(0.4,  `rgba(${cr},${cg},${cb},${opacity * 0.5})`)
    g.addColorStop(1,    `rgba(${cr},${cg},${cb},0)`)

    ctx.fillStyle = g
    ctx.fill()

    // Subtle bright edge line along top of wave
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let j = 0; j < pts.length - 1; j++) {
      const [x0, y0] = pts[j]
      const [x1, y1] = pts[j + 1]
      const cpx = (x0 + x1) / 2
      ctx.quadraticCurveTo(x0, y0, cpx, (y0 + y1) / 2)
    }
    ctx.lineTo(last[0], last[1])
    ctx.strokeStyle = `rgba(${cr},${cg},${cb},${Math.min(1, opacity * 0.6)})`
    ctx.lineWidth   = 1
    ctx.stroke()
  }
}
