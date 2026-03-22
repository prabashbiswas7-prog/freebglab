'use client'
import { useRef, useEffect, useCallback, useState } from 'react'
import type { ToolSlug, Params } from '@/lib/core/types'
import { applyBCS } from '@/lib/core/utils'

interface Props {
  toolSlug: ToolSlug
  params: Params
  width: number
  height: number
  mobile?: boolean
}

export default function Canvas({ toolSlug, params, width, height, mobile }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [rendering, setRendering] = useState(false)

  const render = useCallback(async () => {
    const canvas = canvasRef.current; if (!canvas) return
    const wrap   = wrapRef.current;   if (!wrap)   return
    const ctx    = canvas.getContext('2d'); if (!ctx) return

    // Fit canvas to its display container — no scale factor, just fit
    const rect  = wrap.getBoundingClientRect()
    const dispW = Math.max(1, Math.floor(rect.width))
    const dispH = Math.max(1, Math.floor(rect.height))

    // Calculate scale to fit width × height into display area
    const scaleX = dispW / width
    const scaleY = dispH / height
    const scale  = Math.min(scaleX, scaleY, 1) // never upscale beyond 100%

    // Render at scaled size — looks sharp, renders fast
    const pw = Math.max(1, Math.round(width  * scale))
    const ph = Math.max(1, Math.round(height * scale))

    canvas.width  = pw
    canvas.height = ph

    setRendering(true)
    try {
      const mod = await import(`@/lib/tools/${toolSlug}/draw`)
      mod.draw(ctx, pw, ph, params)

      const b = (params.brightness as number) ?? 100
      const c = (params.contrast   as number) ?? 100
      const s = (params.saturation as number) ?? 100
      if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, pw, ph, b, s, c)
    } catch (e) {
      ctx.fillStyle = '#0d0d1a'
      ctx.fillRect(0, 0, pw, ph)
      ctx.fillStyle = 'rgba(255,255,255,0.2)'
      ctx.font = '14px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('Render error — check console', pw/2, ph/2)
      console.warn('[Canvas] draw error:', e)
    }
    setRendering(false)
  }, [toolSlug, params, width, height])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(render, mobile ? 80 : 30)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [render, mobile])

  // Re-render on window resize
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(render, 100)
    })
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [render])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
      {/* Canvas wrapper — fills all available space */}
      <div
        ref={wrapRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--canvas-bg)',
          overflow: 'hidden',
          padding: mobile ? 8 : 20,
          ...(mobile ? { height: '45vw', minHeight: 160, maxHeight: 300, flex: 'none' } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          onContextMenu={e => e.preventDefault()}
          style={{
            display: 'block',
            maxWidth: '100%',
            maxHeight: '100%',
            borderRadius: 6,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.05), 0 20px 60px rgba(0,0,0,0.8)',
          }}
        />
      </div>

      {/* Info bar */}
      <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--s1)', borderTop: '1px solid var(--b1)' }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'capitalize', flex: 1 }}>
          {toolSlug.replace(/-/g,' ')}
        </span>
        <span style={{ fontSize: 10, color: 'var(--t4)', fontFamily: 'var(--font-mono)' }}>{width}×{height}</span>
        {rendering && <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--b3)', borderTopColor: 'var(--acc)', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />}
      </div>
    </div>
  )
}

// ── Full quality render for download ─────────────────────────
export async function renderFull(
  toolSlug: ToolSlug,
  params: Params,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const off = document.createElement('canvas')
  off.width = width; off.height = height
  const ctx = off.getContext('2d')!

  const mod = await import(`@/lib/tools/${toolSlug}/draw`)
  mod.draw(ctx, width, height, params)

  const b = (params.brightness as number) ?? 100
  const c = (params.contrast   as number) ?? 100
  const s = (params.saturation as number) ?? 100
  if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, width, height, b, s, c)

  return off
}
