'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ToolSlug, Params } from '@/lib/core/types'
import { randomPalette } from '@/lib/core/utils'
import Canvas, { renderFull } from './Canvas'
import ToolPicker from './ToolPicker'
import ToolControls from './ToolControls'

type Tab = 'tools' | 'controls' | 'export'
interface Props { initialTool: ToolSlug; initialParams: Params }

const QUALITY_FORMATS = [
  { fmt: 'png',  label: 'PNG',  desc: 'Lossless, best quality' },
  { fmt: 'jpeg', label: 'JPEG', desc: 'Smaller file, great for photos' },
  { fmt: 'webp', label: 'WebP', desc: 'Best compression + quality' },
]

const PRESETS = [
  { l: 'HD 1080p',   w: 1920,  h: 1080 },
  { l: '2K',         w: 2560,  h: 1440 },
  { l: '4K',         w: 3840,  h: 2160 },
  { l: 'Square',     w: 1080,  h: 1080 },
  { l: 'Portrait',   w: 1080,  h: 1920 },
  { l: 'OG Image',   w: 1200,  h: 628  },
  { l: 'Twitter',    w: 1500,  h: 500  },
  { l: 'YouTube',    w: 2048,  h: 1152 },
  { l: 'Instagram',  w: 1080,  h: 1080 },
  { l: 'Story',      w: 1080,  h: 1920 },
]

export default function Studio({ initialTool, initialParams }: Props) {
  const router = useRouter()
  const [tool,     setTool]     = useState<ToolSlug>(initialTool)
  const [params,   setParams]   = useState<Params>(initialParams)
  const [canvasW,  setCanvasW]  = useState(1920)
  const [canvasH,  setCanvasH]  = useState(1080)
  const [isDark,   setIsDark]   = useState(true)
  const [tab,      setTab]      = useState<Tab>('controls')
  const [toast,    setToast]    = useState('')
  const [dlFmt,    setDlFmt]    = useState('png')
  const [dlQuality,setDlQuality]= useState(95)
  const [downloading, setDownloading] = useState(false)
  const [dlProgress,  setDlProgress]  = useState('')
  const uploadImgRef = useRef<HTMLImageElement | null>(null)

  // History
  const hist    = useRef<{tool:ToolSlug;params:Params}[]>([])
  const histIdx = useRef(-1)

  const pushHist = useCallback((t: ToolSlug, p: Params) => {
    hist.current.splice(histIdx.current + 1)
    hist.current.push({ tool: t, params: JSON.parse(JSON.stringify(p)) })
    if (hist.current.length > 60) hist.current.shift()
    histIdx.current = hist.current.length - 1
  }, [])

  useEffect(() => { pushHist(initialTool, initialParams) }, []) // eslint-disable-line

  const switchTool = useCallback(async (slug: ToolSlug) => {
    const mod = await import(`@/lib/tools/${slug}/params`)
    const p = mod.defaultParams()
    setTool(slug); setParams(p)
    pushHist(slug, p)
    router.push(`/tool/${slug}`, { scroll: false })
    setTab('controls')
  }, [pushHist, router])

  const updateParam = useCallback((key: string, value: unknown) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const shuffleAll = useCallback(async () => {
    const mod = await import(`@/lib/tools/${tool}/params`)
    const fresh = mod.defaultParams()
    setParams(prev => {
      const next = { ...prev }
      if ('seed' in next) next.seed = Math.floor(Math.random() * 99999) + 1
      if ('colors' in next && Array.isArray(next.colors)) {
        next.colors = randomPalette((next.colors as string[]).length)
      }
      // Randomise other numeric params from fresh defaults
      Object.keys(fresh).forEach(k => {
        if (k === 'seed' || k === 'colors' || k === 'brightness' || k === 'contrast' || k === 'saturation') return
        if (typeof fresh[k] === 'number' && Math.random() > 0.4) {
          const v = fresh[k] as number
          const jitter = 0.4 + Math.random() * 1.2
          next[k] = typeof v === 'number' ? v * jitter : v
        }
      })
      return next
    })
  }, [tool])

  const undo = useCallback(() => {
    if (histIdx.current <= 0) return
    histIdx.current--
    const e = hist.current[histIdx.current]
    setTool(e.tool); setParams(JSON.parse(JSON.stringify(e.params)))
    router.push(`/tool/${e.tool}`, { scroll: false })
  }, [router])

  const redo = useCallback(() => {
    if (histIdx.current >= hist.current.length - 1) return
    histIdx.current++
    const e = hist.current[histIdx.current]
    setTool(e.tool); setParams(JSON.parse(JSON.stringify(e.params)))
    router.push(`/tool/${e.tool}`, { scroll: false })
  }, [router])

  // Auto push history
  const htmr = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pRef = useRef(params); pRef.current = params
  useEffect(() => {
    if (htmr.current) clearTimeout(htmr.current)
    htmr.current = setTimeout(() => pushHist(tool, pRef.current), 800)
  }, [params, tool]) // eslint-disable-line

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cm = e.ctrlKey || e.metaKey
      const tag = (e.target as Element).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (cm && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (cm && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if (cm && e.key === 's') { e.preventDefault(); download(dlFmt) }
      if (e.key === 'r') { updateParam('seed', Math.floor(Math.random() * 99999) + 1) }
      if (e.key === 'c' && !cm) { copyLink() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo, dlFmt]) // eslint-disable-line

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const copyLink = useCallback(() => {
    try {
      const data = JSON.stringify({ t: tool, p: params })
      const enc = btoa(unescape(encodeURIComponent(data))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
      navigator.clipboard.writeText(`${location.origin}/tool/${tool}?d=${enc}`)
        .then(() => showToast('✓ Link copied to clipboard'))
        .catch(() => showToast('✗ Copy failed'))
    } catch { showToast('✗ Error generating link') }
  }, [tool, params])

  const toggleTheme = useCallback(() => {
    setIsDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark', next)
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }, [])

  const download = useCallback(async (fmt: string) => {
    setDownloading(true); setDlProgress('Rendering at full quality…')
    try {
      // Pass upload image ref through params
      const p = { ...params }
      if (uploadImgRef.current) p._uploadImg = uploadImgRef.current

      setDlProgress(`Rendering ${canvasW}×${canvasH}…`)
      const off = await renderFull(tool, p, canvasW, canvasH)

      setDlProgress('Encoding…')
      const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
      const ext  = fmt === 'jpeg' ? 'jpg' : fmt
      const quality = fmt === 'png' ? undefined : dlQuality / 100

      off.toBlob(blob => {
        if (!blob) { setDownloading(false); setDlProgress(''); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `freebglab-${tool}-${canvasW}x${canvasH}.${ext}`
        document.body.appendChild(a); a.click()
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 1500)
        setDownloading(false); setDlProgress('')
        const kb = Math.round(blob.size / 1024)
        showToast(`✓ Downloaded ${fmt.toUpperCase()} · ${kb > 1024 ? (kb/1024).toFixed(1)+'MB' : kb+'KB'}`)
      }, mime, quality)
    } catch (e) {
      console.error(e)
      setDownloading(false); setDlProgress('')
      showToast('✗ Download failed — try a smaller size')
    }
  }, [tool, params, canvasW, canvasH, dlQuality])

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)', color:'var(--t1)' }}>

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header style={{ height:48, flexShrink:0, background:'var(--s1)', borderBottom:'1px solid var(--b1)', display:'flex', alignItems:'center', padding:'0 12px', gap:8, zIndex:100 }}>

        {/* Logo */}
        <a href="/" style={{ display:'flex', alignItems:'center', marginRight:8, flexShrink:0, textDecoration:'none' }}>
          <img src="/logo.svg" alt="Free Background Lab" height={28} style={{ display:'block' }} />
        </a>

        {/* Canvas size inputs */}
        <div className="hidden sm:flex" style={{ alignItems:'center', gap:5, flexShrink:0 }}>
          <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>W</span>
          <input type="number" value={canvasW}
            onChange={e => setCanvasW(+e.target.value)}
            onBlur={e => setCanvasW(Math.max(100, Math.min(8000, +e.target.value)))}
            style={numInputStyle} />
          <span style={{ fontSize:10, color:'var(--t4)' }}>×</span>
          <input type="number" value={canvasH}
            onChange={e => setCanvasH(+e.target.value)}
            onBlur={e => setCanvasH(Math.max(100, Math.min(8000, +e.target.value)))}
            style={numInputStyle} />
        </div>

        <div style={{ flex:1 }} />

        {/* Action buttons */}
        <div className="hidden sm:flex" style={{ alignItems:'center', gap:4 }}>
          <HBtn onClick={undo} title="Undo Ctrl+Z">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
          </HBtn>
          <HBtn onClick={redo} title="Redo Ctrl+Y">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
          </HBtn>
          <div style={{ width:1, height:18, background:'var(--b2)', margin:'0 2px' }} />
          <HBtn onClick={shuffleAll} title="Shuffle everything">⇄ Shuffle</HBtn>
          <HBtn onClick={copyLink} title="Copy share link (C)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
            Share <Kbd>C</Kbd>
          </HBtn>
          <div style={{ width:1, height:18, background:'var(--b2)', margin:'0 2px' }} />
        </div>

        <HBtn onClick={toggleTheme} title={isDark ? 'Light mode' : 'Dark mode'}>
          {isDark ? '☀' : '☽'}
        </HBtn>

        <button onClick={() => download(dlFmt)} disabled={downloading}
          style={{ height:32, padding:'0 16px', borderRadius:8, border:'none', background:'linear-gradient(135deg, var(--acc), var(--acc2))', color:'#fff', fontSize:12, fontWeight:700, cursor:downloading?'default':'pointer', display:'flex', alignItems:'center', gap:6, fontFamily:'var(--font-sans)', flexShrink:0, opacity:downloading?0.7:1 }}>
          {downloading
            ? <><Spin/>{dlProgress.split('…')[0]}</>
            : <><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg> Save <Kbd>⌘S</Kbd></>
          }
        </button>
      </header>

      {/* ══ DESKTOP ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-1 overflow-hidden">

        {/* Left — tool list */}
        <ToolPicker active={tool} onPick={switchTool} />

        {/* Centre — canvas */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <Canvas toolSlug={tool} params={{ ...params, _uploadImg: uploadImgRef.current }} width={canvasW} height={canvasH} />
        </div>

        {/* Right — controls + export */}
        <div style={{ width:272, borderLeft:'1px solid var(--b1)', background:'var(--s1)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <ToolControls toolSlug={tool} params={params} onChange={updateParam} onShuffle={shuffleAll} uploadImgRef={uploadImgRef} />
          <ExportPanel
            canvasW={canvasW} canvasH={canvasH}
            onCanvasW={setCanvasW} onCanvasH={setCanvasH}
            fmt={dlFmt} onFmt={setDlFmt}
            quality={dlQuality} onQuality={setDlQuality}
            onDownload={download} onCopyLink={copyLink}
            downloading={downloading} dlProgress={dlProgress}
          />
        </div>
      </div>

      {/* ══ MOBILE ═══════════════════════════════════════════ */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        <Canvas toolSlug={tool} params={{ ...params, _uploadImg: uploadImgRef.current }} width={canvasW} height={canvasH} mobile />
        <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' as 'auto' }}>
          {tab === 'tools'    && <ToolPicker active={tool} onPick={switchTool} mobile />}
          {tab === 'controls' && <ToolControls toolSlug={tool} params={params} onChange={updateParam} onShuffle={shuffleAll} uploadImgRef={uploadImgRef} />}
          {tab === 'export'   && (
            <ExportPanel
              canvasW={canvasW} canvasH={canvasH}
              onCanvasW={setCanvasW} onCanvasH={setCanvasH}
              fmt={dlFmt} onFmt={setDlFmt}
              quality={dlQuality} onQuality={setDlQuality}
              onDownload={download} onCopyLink={copyLink}
              downloading={downloading} dlProgress={dlProgress}
            />
          )}
        </div>
        {/* Mobile tab bar */}
        <div style={{ flexShrink:0, display:'flex', height:52, background:'var(--s1)', borderTop:'1px solid var(--b1)' }}>
          {(['tools','controls','export'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, border:'none', background:'transparent', color:tab===t?'var(--acc)':'var(--t3)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4, borderTop:tab===t?'2px solid var(--acc)':'2px solid transparent' }}>
              <span style={{ fontSize:18 }}>{t==='tools'?'⊞':t==='controls'?'◎':'↓'}</span>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ══ TOAST ════════════════════════════════════════════ */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', background:'var(--s4)', border:'1px solid var(--b3)', color:'var(--t1)', padding:'10px 20px', borderRadius:10, fontSize:12, fontFamily:'var(--font-mono)', zIndex:9999, whiteSpace:'nowrap', boxShadow:'0 8px 32px rgba(0,0,0,0.6)', animation:'fadeUp 0.18s ease', transform:'translateX(-50%)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ── Export Panel ─────────────────────────────────────────────
function ExportPanel({ canvasW, canvasH, onCanvasW, onCanvasH, fmt, onFmt, quality, onQuality, onDownload, onCopyLink, downloading, dlProgress }: {
  canvasW: number; canvasH: number; onCanvasW: (v:number)=>void; onCanvasH: (v:number)=>void
  fmt: string; onFmt: (v:string)=>void; quality: number; onQuality: (v:number)=>void
  onDownload: (fmt:string)=>void; onCopyLink: ()=>void
  downloading: boolean; dlProgress: string
}) {
  const PRESETS = [
    { l:'HD',       w:1920, h:1080 },
    { l:'2K',       w:2560, h:1440 },
    { l:'4K',       w:3840, h:2160 },
    { l:'Square',   w:1080, h:1080 },
    { l:'Portrait', w:1080, h:1920 },
    { l:'OG',       w:1200, h:628  },
    { l:'Twitter',  w:1500, h:500  },
    { l:'YouTube',  w:2048, h:1152 },
  ]
  return (
    <div style={{ flexShrink:0, padding:14, borderTop:'1px solid var(--b1)' }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--t3)', marginBottom:12 }}>Export</div>

      {/* Size inputs */}
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>W</span>
        <input type="number" value={canvasW} onChange={e=>onCanvasW(+e.target.value)} onBlur={e=>onCanvasW(Math.max(100,Math.min(8000,+e.target.value)))} style={{ ...numInputStyle, flex:1 }} />
        <span style={{ fontSize:10, color:'var(--t4)' }}>×</span>
        <input type="number" value={canvasH} onChange={e=>onCanvasH(+e.target.value)} onBlur={e=>onCanvasH(Math.max(100,Math.min(8000,+e.target.value)))} style={{ ...numInputStyle, flex:1 }} />
      </div>

      {/* Presets */}
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:12 }}>
        {PRESETS.map(p => (
          <button key={p.l} onClick={() => { onCanvasW(p.w); onCanvasH(p.h) }}
            style={{ fontSize:10, padding:'3px 8px', borderRadius:5, background: canvasW===p.w&&canvasH===p.h?'var(--accs)':'var(--s3)', border:`1px solid ${canvasW===p.w&&canvasH===p.h?'var(--acc)':'var(--b2)'}`, color:canvasW===p.w&&canvasH===p.h?'var(--acc)':'var(--t2)', cursor:'pointer' }}>
            {p.l}
          </button>
        ))}
      </div>

      {/* Format tabs */}
      <div style={{ display:'flex', gap:4, marginBottom:10 }}>
        {['png','jpeg','webp'].map(f => (
          <button key={f} onClick={() => onFmt(f)}
            style={{ flex:1, padding:'6px 0', borderRadius:6, border:`1px solid ${fmt===f?'var(--acc)':'var(--b2)'}`, background:fmt===f?'var(--accs)':'var(--s3)', color:fmt===f?'var(--acc)':'var(--t2)', fontSize:10, fontWeight:600, cursor:'pointer', textTransform:'uppercase' }}>
            {f}
          </button>
        ))}
      </div>

      {/* Quality slider (not for PNG) */}
      {fmt !== 'png' && (
        <div style={{ marginBottom:10 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:11, color:'var(--t2)' }}>Quality</span>
            <span style={{ fontSize:11, color:'var(--acc)', fontFamily:'var(--font-mono)' }}>{quality}%</span>
          </div>
          <input type="range" min={60} max={100} step={1} value={quality} onChange={e=>onQuality(+e.target.value)} />
        </div>
      )}

      {/* Download button */}
      <button onClick={() => onDownload(fmt)} disabled={downloading}
        style={{ width:'100%', padding:'10px 0', background:downloading?'var(--s4)':'linear-gradient(135deg, var(--acc), var(--acc2))', color:downloading?'var(--t3)':'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:downloading?'default':'pointer', marginBottom:6, display:'flex', alignItems:'center', justifyContent:'center', gap:7, fontFamily:'var(--font-sans)' }}>
        {downloading ? <><Spin/>{dlProgress || 'Processing…'}</> : `↓ Download ${fmt.toUpperCase()}`}
      </button>

      {/* Copy link + Variation row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
        <button onClick={onCopyLink}
          style={{ padding:'7px 0', background:'transparent', border:'1px solid var(--b2)', color:'var(--t2)', borderRadius:6, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          Share <Kbd>C</Kbd>
        </button>
        <a href="/" style={{ padding:'7px 0', background:'transparent', border:'1px solid var(--b2)', color:'var(--t2)', borderRadius:6, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:4, textDecoration:'none' }}>
          ← Home
        </a>
      </div>
    </div>
  )
}

// ── Shared UI ─────────────────────────────────────────────────
const numInputStyle: React.CSSProperties = {
  width: 60, background: 'var(--s3)', border: '1px solid var(--b2)',
  color: 'var(--t1)', padding: '4px 6px', borderRadius: 6,
  fontSize: 11, fontFamily: 'var(--font-mono)', textAlign: 'right', outline: 'none',
}

function HBtn({ onClick, title, children }: { onClick:()=>void; title?:string; children:React.ReactNode }) {
  return (
    <button onClick={onClick} title={title}
      style={{ height:30, padding:'0 9px', borderRadius:7, border:'1px solid var(--b2)', background:'transparent', color:'var(--t2)', fontSize:11, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--font-sans)', whiteSpace:'nowrap' }}>
      {children}
    </button>
  )
}
function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd style={{ fontSize:9, background:'rgba(255,255,255,0.07)', border:'1px solid var(--b2)', borderRadius:3, padding:'1px 4px', color:'var(--t3)', fontFamily:'var(--font-mono)', pointerEvents:'none' }}>{children}</kbd>
}
function Spin() {
  return <span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite', flexShrink:0 }} />
}
