import type { DrawFn } from '@/lib/core/types'
import { seedRng, rng, fbm, rgba, hex2rgb } from '@/lib/core/utils'

export const draw: DrawFn = (ctx, w, h, p) => {
  seedRng(p.seed as number || 1)

  // ── Params ──────────────────────────────────────────────────
  const bg        = p.bg        as string  || '#141414'
  const lineColor = p.lineColor as string  || '#ffffff'
  const lineCount = p.lineCount as number  || 40
  const freq      = p.freq      as number  || 0.026
  const amplitude = p.amplitude as number  || 68
  const spacing   = p.spacing   as number  || 1.0
  const padding   = p.padding   as number  || 50
  const thickness = p.thickness as number  || 1.5
  const shape     = p.shape     as string  || 'horizontal'

  // Organic effects
  const weightVar = p.weightVar as number  || 0
  const wobble    = p.wobble    as number  || 0
  const taper     = p.taper     as number  || 0
  const lineBreaks= p.lineBreaks as boolean || false
  const morse     = p.morse     as boolean || false

  // Advanced variations
  const spacingVar   = p.spacingVar   as number || 0
  const rotJitter    = p.rotJitter    as number || 0
  const opacityVar   = p.opacityVar   as number || 0
  const colorDrift   = p.colorDrift   as number || 0

  // Flow
  const perlinFlow   = p.perlinFlow   as number || 0
  const freqVar      = p.freqVar      as number || 0
  const flowOctaves  = p.flowOctaves  as number || 1

  // Texture
  const noise        = p.noise        as number || 0

  // BG gradient
  const bgGradient   = p.bgGradient   as boolean || false
  const bgGradientColor = p.bgGradientColor as string || '#000000'

  // Line gradient
  const lineGradient = p.lineGradient as boolean || false

  // ── Background ────────────────────────────────────────────────
  if (bgGradient) {
    const g = ctx.createLinearGradient(0, 0, 0, h)
    g.addColorStop(0, bg)
    g.addColorStop(1, bgGradientColor)
    ctx.fillStyle = g
  } else {
    ctx.fillStyle = bg
  }
  ctx.fillRect(0, 0, w, h)

  // ── Line rendering ────────────────────────────────────────────
  const padX = w * (padding / 200)
  const padY = h * (padding / 200)
  const drawW = w - padX * 2
  const drawH = h - padY * 2

  const [lr, lg, lb] = hex2rgb(lineColor)

  for (let i = 0; i < lineCount; i++) {
    const t = lineCount <= 1 ? 0.5 : i / (lineCount - 1)
    const yBase = padY + t * drawH

    // Spacing variation
    const spVar = spacingVar > 0 ? (rng() - 0.5) * spacingVar * 4 : 0
    const y0 = yBase + spVar * h / 100

    // Per-line frequency variation
    const lineFreq = freq * (1 + (rng() - 0.5) * freqVar * 0.5)

    // Opacity variation
    const lineAlpha = Math.max(0.05, 1 - opacityVar / 100 * rng())

    // Color drift
    const drift = colorDrift > 0 ? colorDrift / 100 * rng() : 0
    const dr = Math.round(lr + drift * (255 - lr))
    const dg = Math.round(lg + drift * (255 - lg))
    const db = Math.round(lb + drift * (255 - lb))

    ctx.beginPath()

    const steps = Math.ceil(drawW / spacing) + 1
    let firstPoint = true
    let broken = false

    for (let j = 0; j <= steps; j++) {
      const x = padX + j * spacing
      if (x > w - padX) break

      // ── Shape calculation ──────────────────────────────────
      let y = y0
      const xn = j / steps
      const yn = t

      if (shape === 'horizontal') {
        const sinWave = Math.sin(xn * Math.PI * 2 * lineFreq * drawW + i * 0.3) * amplitude / 100 * drawH * 0.5
        let flowOffset = 0
        if (perlinFlow > 0) {
          flowOffset = fbm(xn * lineFreq * 3, yn + i * 0.1, Math.round(flowOctaves)) * perlinFlow / 100 * drawH * 0.3
        }
        y = y0 + sinWave + flowOffset
      } else if (shape === 'vertical') {
        const sinWave = Math.sin(yn * Math.PI * 2 * lineFreq * drawH) * amplitude / 100 * drawW * 0.5
        y = y0 + sinWave
      } else if (shape === 'diagonal') {
        const sinWave = Math.sin((xn + yn) * Math.PI * 2 * lineFreq * drawW) * amplitude / 100 * drawH * 0.4
        y = y0 + sinWave
      } else if (shape === 'radial') {
        const cx2 = w / 2, cy2 = h / 2
        const dist = Math.hypot(x - cx2, y0 - cy2) / Math.hypot(w, h) * 2
        const sinWave = Math.sin(dist * Math.PI * 2 * lineFreq * 10) * amplitude / 100 * drawH * 0.5
        y = y0 + sinWave
      } else if (shape === 'concentric') {
        const cx2 = w / 2, cy2 = h / 2
        const angle = Math.atan2(y0 - cy2, x - cx2)
        const sinWave = Math.sin(angle * lineFreq * 10 + i * 0.5) * amplitude / 100 * drawH * 0.3
        y = y0 + sinWave
      }

      // ── Wobble ──────────────────────────────────────────────
      if (wobble > 0) {
        y += (rng() - 0.5) * wobble * h / 200
      }

      // ── Taper (fade thickness at ends) ──────────────────────
      let lineW = thickness
      if (weightVar > 0) lineW = thickness * (1 + (rng() - 0.5) * weightVar / 50)
      if (taper > 0) {
        const tapFactor = Math.sin(xn * Math.PI) * (taper / 100)
        lineW = thickness * (0.1 + tapFactor * 0.9)
      }

      // ── Line breaks ─────────────────────────────────────────
      if (lineBreaks && rng() < 0.008) {
        broken = true
        ctx.stroke()
        ctx.beginPath()
        firstPoint = true
        broken = false
        continue
      }

      // ── Morse pattern ────────────────────────────────────────
      if (morse) {
        const dashLen = Math.floor(rng() * 3 + 1)
        if (j % (dashLen + 1) === 0) {
          ctx.stroke(); ctx.beginPath(); firstPoint = true; continue
        }
      }

      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false }
      else ctx.lineTo(x, y)

      // Variable stroke width requires re-stroking segments
      if (weightVar > 0 || taper > 0) {
        ctx.lineWidth = lineW
      }
    }

    // ── Stroke style ──────────────────────────────────────────
    if (lineGradient) {
      const g = ctx.createLinearGradient(padX, 0, w - padX, 0)
      g.addColorStop(0, `rgba(${dr},${dg},${db},0)`)
      g.addColorStop(0.2, `rgba(${dr},${dg},${db},${lineAlpha})`)
      g.addColorStop(0.8, `rgba(${dr},${dg},${db},${lineAlpha})`)
      g.addColorStop(1, `rgba(${dr},${dg},${db},0)`)
      ctx.strokeStyle = g
    } else {
      ctx.strokeStyle = `rgba(${dr},${dg},${db},${lineAlpha})`
    }

    if (weightVar === 0 && taper === 0) ctx.lineWidth = thickness
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    // Rotation jitter
    if (rotJitter > 0) {
      ctx.save()
      const cx2 = w / 2, cy2 = y0
      ctx.translate(cx2, cy2)
      ctx.rotate((rng() - 0.5) * rotJitter * Math.PI / 180)
      ctx.translate(-cx2, -cy2)
    }

    ctx.stroke()

    if (rotJitter > 0) ctx.restore()
  }

  // ── Noise texture ─────────────────────────────────────────────
  if (noise > 0) {
    const img = ctx.getImageData(0, 0, w, h)
    const d = img.data
    for (let k = 0; k < d.length; k += 4) {
      const n2 = (rng() - 0.5) * noise * 2
      d[k]   = Math.max(0, Math.min(255, d[k]   + n2))
      d[k+1] = Math.max(0, Math.min(255, d[k+1] + n2))
      d[k+2] = Math.max(0, Math.min(255, d[k+2] + n2))
    }
    ctx.putImageData(img, 0, 0)
  }
}
