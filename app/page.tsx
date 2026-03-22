'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { ToolMeta } from '@/lib/core/types'
import { getDrawFn, getDefaultParams } from '@/lib/tools/loader'
import { TOOLS, getToolsByCategory } from '@/lib/tools/registry'

export default function HomePage() {
  const byCategory = getToolsByCategory()
  const categories = Object.keys(byCategory)

  return (
    <div className="homepage" style={{ background: 'var(--bg)', color: 'var(--t1)' }}>

      {/* ── Sticky Header ─── */}
      <header style={{ borderBottom: '1px solid var(--b1)', background: 'rgba(13,13,26,0.92)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <img src="/logo.svg" alt="Free Background Lab" height={32} style={{ display: 'block' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--t3)', fontFamily: 'var(--font-mono)' }}>32 tools · free forever</span>
            <Link href="/tool/mesh" style={{ textDecoration: 'none', background: 'var(--acc)', color: '#fff', padding: '8px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}>
              Open Studio →
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accs)', border: '1px solid var(--acch)', borderRadius: 20, padding: '5px 16px', marginBottom: 28 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--acc)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 11, color: 'var(--acc)', fontWeight: 600, letterSpacing: '0.08em' }}>FREE · NO SIGNUP · INSTANT DOWNLOAD</span>
        </div>
        <h1 style={{ fontSize: 'clamp(36px,6vw,68px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 22 }}>
          Generate stunning<br />
          <span style={{ background: 'linear-gradient(135deg, #5b4cf6 0%, #a78bfa 50%, #60a5fa 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            backgrounds free
          </span>
        </h1>
        <p style={{ fontSize: 17, color: 'var(--t2)', maxWidth: 540, margin: '0 auto 40px', lineHeight: 1.65 }}>
          32 generative art tools. Mesh gradients, Perlin noise, Voronoi, geometric patterns and more. Download at full 4K resolution instantly.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/tool/mesh" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #5b4cf6, #3d2fd4)', color: '#fff', padding: '13px 32px', borderRadius: 10, fontSize: 15, fontWeight: 700, boxShadow: '0 8px 32px rgba(91,76,246,0.4)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Start Creating →
          </Link>
          <Link href="#tools" style={{ textDecoration: 'none', background: 'var(--s3)', color: 'var(--t1)', padding: '13px 32px', borderRadius: 10, fontSize: 15, fontWeight: 600, border: '1px solid var(--b2)' }}>
            Browse Tools
          </Link>
        </div>
      </div>

      {/* ── Stats ─── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 1, background: 'var(--b1)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--b1)' }}>
          {[
            { n: '32', l: 'Unique Tools' },
            { n: '4K', l: 'Max Resolution' },
            { n: 'Free', l: 'Forever' },
            { n: '0', l: 'Signup Needed' },
            { n: 'PNG+', l: 'JPEG · WebP' },
          ].map(stat => (
            <div key={stat.n} style={{ background: 'var(--s2)', padding: '22px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--acc)', fontFamily: 'var(--font-mono)', marginBottom: 5 }}>{stat.n}</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{stat.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tool Grid ─── */}
      <div id="tools" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
        {categories.map(cat => (
          <div key={cat} style={{ marginBottom: 64 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 4, height: 24, background: 'linear-gradient(to bottom, #5b4cf6, #3d2fd4)', borderRadius: 2 }} />
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--t1)' }}>{cat}</h2>
              <span style={{ fontSize: 11, color: 'var(--t3)', background: 'var(--s3)', padding: '3px 10px', borderRadius: 10, border: '1px solid var(--b2)', fontFamily: 'var(--font-mono)' }}>
                {byCategory[cat].length}
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16 }}>
              {byCategory[cat].map(tool => <ToolCard key={tool.slug} tool={tool} />)}
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA Banner ─── */}
      <div style={{ background: 'linear-gradient(135deg, #0d0d1a, #1a1040)', borderTop: '1px solid var(--b1)', borderBottom: '1px solid var(--b1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '64px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, letterSpacing: '-0.02em' }}>Ready to create?</h2>
          <p style={{ color: 'var(--t3)', marginBottom: 28, fontSize: 15 }}>No account needed. No watermarks. No limits.</p>
          <Link href="/tool/mesh" style={{ textDecoration: 'none', background: 'var(--acc)', color: '#fff', padding: '14px 36px', borderRadius: 10, fontSize: 15, fontWeight: 700, boxShadow: '0 8px 32px rgba(91,76,246,0.5)' }}>
            Open Studio Free →
          </Link>
        </div>
      </div>

      {/* ── Footer ─── */}
      <footer style={{ background: 'var(--s1)', borderTop: '1px solid var(--b1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <img src="/logo.svg" alt="Free Background Lab" height={26} style={{ display: 'block' }} />
          <div style={{ fontSize: 12, color: 'var(--t4)' }}>Free Background Lab · Free forever · No attribution required</div>
          <div style={{ display: 'flex', gap: 20 }}>
            {['mesh','perlin','plotter','voronoi'].map(s => (
              <Link key={s} href={`/tool/${s}`} style={{ textDecoration: 'none', fontSize: 12, color: 'var(--t3)', textTransform: 'capitalize' }}>{s}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ── Tool Card with live rendered thumbnail ──────────────────
function ToolCard({ tool }: { tool: ToolMeta }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [loaded,  setLoaded]  = useState(false)
  const [hover,   setHover]   = useState(false)

  useEffect(() => {
    let dead = false
    const go = () => {
      try {
        const p   = getDefaultParams(tool.slug)
        const c   = canvasRef.current; if (!c) return
        const ctx = c.getContext('2d'); if (!ctx) return
        c.width = 400; c.height = 260
        getDrawFn(tool.slug)(ctx, 400, 260, p)
        if (!dead) setLoaded(true)
      } catch (e) { if (!dead) setLoaded(true) }
    }
    const id = setTimeout(go, Math.random() * 800)
    return () => { dead = true; clearTimeout(id) }
  }, [tool.slug])

  return (
    <Link href={`/tool/${tool.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          borderRadius: 14, overflow: 'hidden',
          border: `1px solid ${hover ? 'var(--acc)' : 'var(--b1)'}`,
          background: 'var(--s2)', cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
          transform: hover ? 'translateY(-4px) scale(1.01)' : 'none',
          boxShadow: hover ? '0 16px 48px rgba(91,76,246,0.25)' : '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        {/* Thumbnail area */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '65%', background: 'var(--s3)', overflow: 'hidden' }}>
          {!loaded && <div className="thumb-loading" style={{ position: 'absolute', inset: 0 }} />}
          <canvas
            ref={canvasRef}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              opacity: loaded ? 1 : 0, transition: 'opacity 0.4s',
            }}
          />
          {/* Hover overlay */}
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(91,76,246,0.18)',
            opacity: hover ? 1 : 0, transition: 'opacity 0.2s',
          }}>
            <div style={{ background: 'var(--acc)', color: '#fff', borderRadius: 20, padding: '7px 18px', fontSize: 12, fontWeight: 700, boxShadow: '0 4px 16px rgba(0,0,0,0.4)' }}>
              Use this tool →
            </div>
          </div>
        </div>

        {/* Card info */}
        <div style={{ padding: '13px 15px 15px' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--t1)', marginBottom: 5 }}>{tool.name}</div>
          <div style={{ fontSize: 11, color: 'var(--t3)', lineHeight: 1.45 }}>{tool.description}</div>
        </div>
      </div>
    </Link>
  )
}
