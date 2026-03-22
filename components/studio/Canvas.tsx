'use client'
import { useRef, useEffect, useCallback, useState } from 'react'
import type { ToolSlug, Params } from '@/lib/core/types'
import { applyBCS } from '@/lib/core/utils'
import { getDrawFn } from '@/lib/tools/loader'

interface Props {
  toolSlug: ToolSlug
  params: Params
  width: number
  height: number
  mobile?: boolean
  isDark?: boolean
}

export default function Canvas({ toolSlug, params, width, height, mobile, isDark = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const timer     = useRef<ReturnType<typeof setTimeout> | null>(null)
  const genRef    = useRef(0)
  const [rendering, setRendering] = useState(false)

  const render = useCallback(() => {
    const gen    = ++genRef.current
    const canvas = canvasRef.current; if (!canvas) return
    const wrap   = wrapRef.current;   if (!wrap)   return
    const ctx    = canvas.getContext('2d'); if (!ctx) return

    const rect  = wrap.getBoundingClientRect()
    const dispW = Math.max(1, Math.floor(rect.width  - (mobile ? 16 : 40)))
    const dispH = Math.max(1, Math.floor(rect.height - (mobile ? 16 : 40)))
    const scale = Math.min(dispW / width, dispH / height, 1)
    const pw    = Math.max(1, Math.round(width  * scale))
    const ph    = Math.max(1, Math.round(height * scale))

    if (canvas.width !== pw || canvas.height !== ph) {
      canvas.width = pw; canvas.height = ph
    }

    setRendering(true)
    try {
      const drawFn = getDrawFn(toolSlug)  // synchronous — no promise, no crash
      if (gen !== genRef.current) return
      ctx.clearRect(0, 0, pw, ph)
      drawFn(ctx, pw, ph, { ...params })
      if (gen !== genRef.current) return
      const b = (params.brightness as number) ?? 100
      const c = (params.contrast   as number) ?? 100
      const s = (params.saturation as number) ?? 100
      if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, pw, ph, b, s, c)
    } catch (e) {
      ctx.fillStyle = isDark ? '#0d0d1a' : '#f0f0f8'
      ctx.fillRect(0, 0, pw, ph)
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'
      ctx.font = '13px system-ui'; ctx.textAlign = 'center'
      ctx.fillText('⚠ Render error', pw / 2, ph / 2)
      console.warn('[Canvas] draw error in', toolSlug, e)
    }
    if (gen === genRef.current) setRendering(false)
  }, [toolSlug, params, width, height, mobile, isDark])

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(render, mobile ? 60 : 20)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [render, mobile])

  useEffect(() => {
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(render, 100)
    })
    if (wrapRef.current) ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [render])

  const shadow = isDark
    ? '0 0 0 1px rgba(255,255,255,0.05), 0 16px 48px rgba(0,0,0,0.7)'
    : 'none'

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <div ref={wrapRef} style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--canvas-bg)', overflow: 'hidden',
        padding: mobile ? 8 : 20,
        ...(mobile ? { height: '45vw', minHeight: 160, maxHeight: 300, flex: 'none' } : {}),
      }}>
        <canvas ref={canvasRef} onContextMenu={e => e.preventDefault()}
          style={{ display: 'block', maxWidth: '100%', maxHeight: '100%', borderRadius: 6, boxShadow: shadow }} />
      </div>
      <div style={{ height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--s1)', borderTop: '1px solid var(--b1)' }}>
        <span style={{ fontSize: 10, color: 'var(--t3)', textTransform: 'capitalize', flex: 1 }}>{toolSlug.replace(/-/g, ' ')}</span>
        <span style={{ fontSize: 10, color: 'var(--t4)', fontFamily: 'var(--font-mono)' }}>{width}×{height}</span>
        {rendering && <span style={{ width: 8, height: 8, borderRadius: '50%', border: '1.5px solid var(--b3)', borderTopColor: 'var(--acc)', animation: 'spin 0.7s linear infinite', flexShrink: 0, display: 'inline-block' }} />}
      </div>
    </div>
  )
}

export async function renderFull(toolSlug: ToolSlug, params: Params, width: number, height: number): Promise<HTMLCanvasElement> {
  const off = document.createElement('canvas')
  off.width = width; off.height = height
  const ctx = off.getContext('2d')
  if (!ctx) throw new Error('Could not get canvas context')
  const drawFn = getDrawFn(toolSlug)
  drawFn(ctx, width, height, { ...params })
  const b = (params.brightness as number) ?? 100
  const c = (params.contrast   as number) ?? 100
  const s = (params.saturation as number) ?? 100
  if (b !== 100 || c !== 100 || s !== 100) applyBCS(ctx, width, height, b, s, c)
  return off
}
