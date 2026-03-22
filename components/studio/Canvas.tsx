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
  isDark?: boolean
}

// Module cache — avoids re-importing the same draw module every render
const drawCache: Record<string, ((ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) => void)> = {}

async function getDrawFn(toolSlug: string) {
  if (drawCache[toolSlug]) return drawCache[toolSlug]
  const mod = await import(`@/lib/tools/${toolSlug}/draw`)
  drawCache[toolSlug] = mod.draw
  return mod.draw
}

export default function Canvas({ toolSlug, params, width, height, mobile, isDark = true }: Props) {
  const canvasRef  = useRef<HTMLCanvasElement>(null)
  const wrapRef    = useRef<HTMLDivElement>(null)
  const timer      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const renderRef  = useRef(0) // render generation counter — cancels stale renders
  const [rendering, setRendering] = useState(false)

  const render = useCallback(async () => {
    const gen = ++renderRef.current // this render's generation
    const canvas = canvasRef.current; if (!canvas) return
    const wrap   = wrapRef.current;   if (!wrap)   return
    const ctx    = canvas.getContext('2d'); if (!ctx) return

    const rect  = wrap.getBoundingClientRect()
    const dispW = Math.max(1, Math.floor(rect.width  - (mobile ? 16 : 40)))
    const dispH = Math.max(1, Math.floor(rect.height - (mobile ? 16 : 40)))

    const scaleX = dispW / width
    const scaleY = dispH / height
    const scale  = Math.min(scaleX, scaleY, 1)

    const pw = Math.max(1, Math.round(width  * scale))
    const ph = Math.max(1, Math.round(height * scale))

    // Only update size if changed — avoids flicker
    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width  = pw
      canvas.height = ph
    }

    setRendering(true)
    try {
      const drawFn = await getDrawFn(toolSlug)
      if (gen !== renderRef.current) return // stale — newer render started

      // Clear before drawing
      ctx.clearRect(0, 0, pw, ph)
      drawFn(ctx, pw, ph, { ...params })

      if (gen !== renderRef.current) return

      const b = (params.brightness as number) ?? 100
      const c = (params.contrast   as number) ?? 100
      const s = (params.saturation as number) ?? 100
      if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, pw, ph, b, s, c)
    } catch (e) {
      if (gen !== renderRef.current) return
      ctx.fillStyle = isDark ? '#0d0d1a' : '#f0f0f8'
      ctx.fillRect(0, 0, pw, ph)
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
      ctx.font = '13px system-ui'
      ctx.textAlign = 'center'
      ctx.fillText('⚠ Render error', pw / 2, ph / 2)
      console.warn('[Canvas] draw error in', toolSlug, e)
    }
    if (gen === renderRef.current) setRendering(false)
  }, [toolSlug, params, width, height, mobile, isDark])

  // Debounced render on any change
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(render, mobile ? 80 : 30)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [render, mobile])

  // Re-render on container resize
  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(render, 120)
    })
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [render])

  const shadow = isDark
    ? '0 0 0 1px rgba(255,255,255,0.05), 0 16px 48px rgba(0,0,0,0.7)'
    : 'none'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div
        ref={wrapRef}
        style={{
          flex: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--canvas-bg)',
          overflow: 'hidden',
          padding: mobile ? 8 : 20,
          ...(mobile ? { height: '45vw', minHeight: 160, maxHeight: 300, flex: 'none' } : {}),
        }}
      >
        <canvas
          ref={canvasRef}
          onContextMenu={e => e.preventDefault()}
          style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', borderRadius: 6, boxShadow: shadow }}
        />
      </div>

      {/* Info bar */}
      <div style={{ height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--s1)', borderTop: '1px solid var(--b1)' }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'capitalize', flex: 1 }}>
          {toolSlug.replace(/-/g, ' ')}
        </span>
        <span style={{ fontSize: 10, color: 'var(--t4)', fontFamily: 'var(--font-mono)' }}>{width}×{height}</span>
        {rendering && (
          <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--b3)', borderTopColor: 'var(--acc)', animation: 'spin 0.7s linear infinite', flexShrink: 0, display: 'inline-block' }} />
        )}
      </div>
    </div>
  )
}

// Full quality render — also uses cache
export async function renderFull(toolSlug: ToolSlug, params: Params, width: number, height: number): Promise<HTMLCanvasElement> {
  const off = document.createElement('canvas')
  off.width = width; off.height = height
  const ctx = off.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')

  const drawFn = await getDrawFn(toolSlug)
  drawFn(ctx, width, height, { ...params })

  const b = (params.brightness as number) ?? 100
  const c = (params.contrast   as number) ?? 100
  const s = (params.saturation as number) ?? 100
  if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, width, height, b, s, c)

  return off
}
