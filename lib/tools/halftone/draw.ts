import type { DrawFn } from '@/lib/core/types'
import { hex2rgb } from '@/lib/core/utils'

export const draw: DrawFn = (ctx, w, h, p) => {
  const bg     = (p.bg     as string) || '#050810'
  const dotCol = (p.dotCol as string) || '#e0e4f0'
  const size   = Math.max(2, (p.size  as number) || 16)
  const angle  = (p.angle  as number) || 45
  const gamma  = (p.gamma  as number) || 1.3

  // Fill background
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)

  // Sample bg brightness cheaply using a small downscaled image
  const sampleW = Math.min(w, 256)
  const sampleH = Math.min(h, 256)
  const scaleX  = w / sampleW
  const scaleY  = h / sampleH

  // Create offscreen for sampling
  const off = document.createElement('canvas')
  off.width = sampleW; off.height = sampleH
  const octx = off.getContext('2d')!
  // Fill with bg so we can measure brightness
  octx.fillStyle = bg; octx.fillRect(0, 0, sampleW, sampleH)
  const imgData = octx.getImageData(0, 0, sampleW, sampleH)

  const [dr, dg, db] = hex2rgb(dotCol)
  const rad = angle * Math.PI / 180
  const cos = Math.cos(rad), sin = Math.sin(rad)
  const D = Math.hypot(w, h) * 1.5

  ctx.fillStyle = `rgb(${dr},${dg},${db})`

  for (let row = -D / 2; row < D / 2; row += size) {
    for (let col = -D / 2; col < D / 2; col += size) {
      const x = col * cos - row * sin + w / 2
      const y = col * sin + row * cos + h / 2
      if (x < 0 || x >= w || y < 0 || y >= h) continue

      // Sample from the bg at this point
      const sx = Math.max(0, Math.min(sampleW - 1, Math.round(x / scaleX)))
      const sy = Math.max(0, Math.min(sampleH - 1, Math.round(y / scaleY)))
      const ii = (sy * sampleW + sx) * 4
      const bri = (imgData.data[ii] * 0.299 + imgData.data[ii+1] * 0.587 + imgData.data[ii+2] * 0.114) / 255

      // Invert for dark bg: bright dot on dark bg
      const dotBri = 1 - bri
      const r = Math.pow(dotBri, 1 / gamma) * size * 0.5
      if (r < 0.5) continue

      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
