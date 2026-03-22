'use client'
import { useState, useCallback, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { ToolSlug, Params } from '@/lib/core/types'
import { randomPalette } from '@/lib/core/utils'
import Canvas, { renderFull } from './Canvas'
import ToolPicker from './ToolPicker'
import ToolControls from './ToolControls'
import AdSlot from '../layout/AdSlot'

type Tab = 'tools' | 'controls' | 'export'
interface Props { initialTool: ToolSlug; initialParams: Params }

const PRESETS = [
  { l:'HD',      w:1920, h:1080 }, { l:'2K',      w:2560, h:1440 },
  { l:'4K',      w:3840, h:2160 }, { l:'Square',  w:1080, h:1080 },
  { l:'Portrait',w:1080, h:1920 }, { l:'OG',      w:1200, h:628  },
  { l:'Twitter', w:1500, h:500  }, { l:'YouTube', w:2048, h:1152 },
]

export default function Studio({ initialTool, initialParams }: Props) {
  const router = useRouter()
  const [tool,       setTool]       = useState<ToolSlug>(initialTool)
  const [params,     setParams]     = useState<Params>(initialParams)
  const [canvasW,    setCanvasW]    = useState(1920)
  const [canvasH,    setCanvasH]    = useState(1080)
  const [isDark,     setIsDark]     = useState(true)
  const [tab,        setTab]        = useState<Tab>('controls')
  const [toast,      setToast]      = useState('')
  const [dlFmt,      setDlFmt]      = useState('png')
  const [dlQuality,  setDlQuality]  = useState(95)
  const [downloading,setDownloading]= useState(false)
  const [dlProgress, setDlProgress] = useState('')
  const [showDlModal,setShowDlModal]= useState(false)
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
    try {
      const mod = await import(`@/lib/tools/${slug}/params`)
      const p = mod.defaultParams()
      setTool(slug); setParams(p)
      pushHist(slug, p)
      router.push(`/tool/${slug}`, { scroll: false })
      setTab('controls')
    } catch (e) {
      console.error('Failed to load tool:', slug, e)
    }
  }, [pushHist, router])

  const updateParam = useCallback((key: string, value: unknown) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }, [])

  const shuffleAll = useCallback(async () => {
    try {
      const mod = await import(`@/lib/tools/${tool}/params`)
      const fresh = mod.defaultParams()
      setParams(prev => {
        const next = { ...prev }
        if ('seed' in next) next.seed = Math.floor(Math.random() * 99999) + 1
        if ('colors' in next && Array.isArray(next.colors)) {
          next.colors = randomPalette((next.colors as string[]).length)
        }
        Object.keys(fresh).forEach(k => {
          if (['seed','colors','brightness','contrast','saturation','bg','lineCol','glowCol','dotCol','fg','colorA','colorB'].includes(k)) return
          if (typeof fresh[k] === 'number' && Math.random() > 0.5) {
            const v = fresh[k] as number
            const lo = v * 0.4, hi = v * 2.2
            next[k] = Math.max(lo, Math.min(hi, v * (0.5 + Math.random() * 1.5)))
          }
        })
        return next
      })
    } catch (e) { console.error(e) }
  }, [tool])

  const undo = useCallback(() => {
    if (histIdx.current <= 0) return
    histIdx.current--
    const e = hist.current[histIdx.current]
    if (!e) return
    setTool(e.tool); setParams(JSON.parse(JSON.stringify(e.params)))
    router.push(`/tool/${e.tool}`, { scroll: false })
  }, [router])

  const redo = useCallback(() => {
    if (histIdx.current >= hist.current.length - 1) return
    histIdx.current++
    const e = hist.current[histIdx.current]
    if (!e) return
    setTool(e.tool); setParams(JSON.parse(JSON.stringify(e.params)))
    router.push(`/tool/${e.tool}`, { scroll: false })
  }, [router])

  // Auto push history (debounced)
  const htmr = useRef<ReturnType<typeof setTimeout> | null>(null)
  const pRef = useRef(params); pRef.current = params
  const tRef = useRef(tool);   tRef.current = tool
  useEffect(() => {
    if (htmr.current) clearTimeout(htmr.current)
    htmr.current = setTimeout(() => pushHist(tRef.current, pRef.current), 1000)
    return () => { if (htmr.current) clearTimeout(htmr.current) }
  }, [params]) // eslint-disable-line

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const cm  = e.ctrlKey || e.metaKey
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return
      if (cm && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (cm && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }
      if (cm && e.key === 's') { e.preventDefault(); setShowDlModal(true) }
      if (e.key === 'r' && !cm) updateParam('seed', Math.floor(Math.random() * 99999) + 1)
      if (e.key === 'c' && !cm) copyLink()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo]) // eslint-disable-line

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const copyLink = useCallback(() => {
    try {
      const data = JSON.stringify({ t: tool, p: params })
      const enc  = btoa(unescape(encodeURIComponent(data))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'')
      const url  = `${location.origin}/tool/${tool}?d=${enc}`
      navigator.clipboard.writeText(url)
        .then(() => showToast('✓ Link copied to clipboard'))
        .catch(() => showToast('✗ Copy failed — try again'))
    } catch { showToast('✗ Error generating link') }
  }, [tool, params, showToast])

  const toggleTheme = useCallback(() => {
    setIsDark(d => {
      const next = !d
      document.documentElement.classList.toggle('dark',  next)
      document.documentElement.classList.toggle('light', !next)
      return next
    })
  }, [])

  const download = useCallback(async (fmt: string) => {
    setDownloading(true); setDlProgress(`Rendering ${canvasW}×${canvasH}…`)
    try {
      const p = { ...params }
      if (uploadImgRef.current) p._uploadImg = uploadImgRef.current
      const off  = await renderFull(tool, p, canvasW, canvasH)
      setDlProgress('Encoding…')
      const mime = fmt === 'jpeg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png'
      const ext  = fmt === 'jpeg' ? 'jpg' : fmt
      const q    = fmt === 'png' ? undefined : dlQuality / 100
      off.toBlob(blob => {
        if (!blob) { setDownloading(false); return }
        const url = URL.createObjectURL(blob)
        const a   = document.createElement('a')
        a.href = url; a.download = `freebglab-${tool}-${canvasW}x${canvasH}.${ext}`
        document.body.appendChild(a); a.click()
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 1500)
        setDownloading(false); setDlProgress(''); setShowDlModal(false)
        const kb = Math.round(blob.size / 1024)
        showToast(`✓ Downloaded · ${kb > 1024 ? (kb/1024).toFixed(1)+'MB' : kb+'KB'}`)
      }, mime, q)
    } catch (e) {
      console.error(e)
      setDownloading(false); setDlProgress('')
      showToast('✗ Download failed — try a smaller canvas size')
    }
  }, [tool, params, canvasW, canvasH, dlQuality, showToast])

  const safeW = (v: number) => setCanvasW(Math.max(100, Math.min(8000, v || 1920)))
  const safeH = (v: number) => setCanvasH(Math.max(100, Math.min(8000, v || 1080)))

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', background:'var(--bg)', color:'var(--t1)' }}>

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header style={{ height:48, flexShrink:0, background:'var(--s1)', borderBottom:'1px solid var(--b1)', display:'flex', alignItems:'center', padding:'0 10px', gap:6, zIndex:100 }}>
        <a href="/" style={{ display:'flex', alignItems:'center', marginRight:6, textDecoration:'none', flexShrink:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Free Background Lab" height={28} style={{ display:'block' }} />
        </a>
        <div className="hidden sm:flex" style={{ alignItems:'center', gap:4, flexShrink:0 }}>
          <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>W</span>
          <input type="number" value={canvasW} onChange={e=>setCanvasW(+e.target.value)} onBlur={e=>safeW(+e.target.value)} style={numInput} />
          <span style={{ fontSize:10, color:'var(--t4)' }}>×</span>
          <input type="number" value={canvasH} onChange={e=>setCanvasH(+e.target.value)} onBlur={e=>safeH(+e.target.value)} style={numInput} />
        </div>
        <div style={{ flex:1 }} />
        <div className="hidden sm:flex" style={{ alignItems:'center', gap:3 }}>
          <HBtn onClick={undo} title="Undo (Ctrl+Z)"><UndoIcon /></HBtn>
          <HBtn onClick={redo} title="Redo (Ctrl+Y)"><RedoIcon /></HBtn>
          <Divider />
          <HBtn onClick={shuffleAll}>⇄ Shuffle</HBtn>
          <HBtn onClick={copyLink}>⬡ Share <Kbd>C</Kbd></HBtn>
          <Divider />
        </div>
        <HBtn onClick={toggleTheme}>{isDark ? '☀' : '☽'}</HBtn>
        <button onClick={() => setShowDlModal(true)}
          style={{ height:32, padding:'0 14px', borderRadius:8, border:'none', background:'linear-gradient(135deg,#5b4cf6,#3d2fd4)', color:'#fff', fontSize:12, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontFamily:'var(--font-sans)', flexShrink:0 }}>
          <DownloadIcon /> Save <Kbd>⌘S</Kbd>
        </button>
      </header>

      {/* ══ DESKTOP ══════════════════════════════════════════ */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <ToolPicker active={tool} onPick={switchTool} />

        {/* Centre — canvas + bottom ad */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
          <Canvas toolSlug={tool} params={{ ...params, _uploadImg:uploadImgRef.current }} width={canvasW} height={canvasH} isDark={isDark} />
          {/* Banner ad below canvas */}
          <AdSlot slot="1234567890" format="horizontal"
            style={{ height:60, flexShrink:0, borderTop:'1px solid var(--b1)' }} />
        </div>

        {/* Right panel */}
        <div style={{ width:272, borderLeft:'1px solid var(--b1)', background:'var(--s1)', display:'flex', flexDirection:'column', overflow:'hidden' }}>
          {/* In-feed ad at top of controls */}
          <AdSlot slot="0987654321" format="rectangle"
            style={{ height:90, flexShrink:0, borderBottom:'1px solid var(--b1)' }} />
          <ToolControls toolSlug={tool} params={params} onChange={updateParam} onShuffle={shuffleAll} uploadImgRef={uploadImgRef} />
          <ExportPanel
            canvasW={canvasW} canvasH={canvasH} onCanvasW={safeW} onCanvasH={safeH}
            fmt={dlFmt} onFmt={setDlFmt} quality={dlQuality} onQuality={setDlQuality}
            onDownload={() => setShowDlModal(true)} onCopyLink={copyLink}
          />
        </div>
      </div>

      {/* ══ MOBILE ═══════════════════════════════════════════ */}
      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        <Canvas toolSlug={tool} params={{ ...params, _uploadImg:uploadImgRef.current }} width={canvasW} height={canvasH} isDark={isDark} mobile />
        <AdSlot slot="1122334455" format="horizontal" style={{ height:50, flexShrink:0, borderBottom:'1px solid var(--b1)' }} />
        <div style={{ flex:1, overflowY:'auto' }}>
          {tab==='tools'    && <ToolPicker active={tool} onPick={switchTool} mobile />}
          {tab==='controls' && <ToolControls toolSlug={tool} params={params} onChange={updateParam} onShuffle={shuffleAll} uploadImgRef={uploadImgRef} />}
          {tab==='export'   && <ExportPanel canvasW={canvasW} canvasH={canvasH} onCanvasW={safeW} onCanvasH={safeH} fmt={dlFmt} onFmt={setDlFmt} quality={dlQuality} onQuality={setDlQuality} onDownload={() => setShowDlModal(true)} onCopyLink={copyLink} />}
        </div>
        <div style={{ flexShrink:0, display:'flex', height:52, background:'var(--s1)', borderTop:'1px solid var(--b1)' }}>
          {(['tools','controls','export'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ flex:1, border:'none', background:'transparent', color:tab===t?'var(--acc)':'var(--t3)', fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:3, borderTop:tab===t?'2px solid var(--acc)':'2px solid transparent' }}>
              <span style={{ fontSize:17 }}>{t==='tools'?'⊞':t==='controls'?'◎':'↓'}</span>{t}
            </button>
          ))}
        </div>
      </div>

      {/* ══ DOWNLOAD MODAL ═══════════════════════════════════ */}
      {showDlModal && (
        <div onClick={e => { if (e.target===e.currentTarget) setShowDlModal(false) }}
          style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
          <div style={{ background:'var(--s1)', borderRadius:16, width:'100%', maxWidth:420, border:'1px solid var(--b2)', overflow:'hidden', boxShadow:'0 32px 80px rgba(0,0,0,0.6)', animation:'popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px', borderBottom:'1px solid var(--b1)' }}>
              <div>
                <div style={{ fontSize:14, fontWeight:700 }}>Download</div>
                <div style={{ fontSize:11, color:'var(--t3)', fontFamily:'var(--font-mono)', marginTop:2 }}>{canvasW}×{canvasH}px · Full quality</div>
              </div>
              <button onClick={() => setShowDlModal(false)} style={{ width:28, height:28, borderRadius:'50%', border:'none', background:'var(--s3)', color:'var(--t2)', cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
            </div>
            {/* Ad in download modal */}
            <AdSlot slot="5566778899" format="rectangle" style={{ margin:'12px 16px', height:90, borderRadius:8 }} />
            <div style={{ padding:'0 16px 12px', display:'flex', gap:6 }}>
              {['png','jpeg','webp'].map(f => (
                <button key={f} onClick={() => setDlFmt(f)}
                  style={{ flex:1, padding:'8px 0', borderRadius:7, border:`1px solid ${dlFmt===f?'var(--acc)':'var(--b2)'}`, background:dlFmt===f?'var(--accs)':'var(--s3)', color:dlFmt===f?'var(--acc)':'var(--t2)', fontSize:11, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>
                  {f}
                </button>
              ))}
            </div>
            {dlFmt !== 'png' && (
              <div style={{ padding:'0 16px 12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                  <span style={{ fontSize:11, color:'var(--t2)' }}>Quality</span>
                  <span style={{ fontSize:11, color:'var(--acc)', fontFamily:'var(--font-mono)' }}>{dlQuality}%</span>
                </div>
                <input type="range" min={60} max={100} value={dlQuality} onChange={e => setDlQuality(+e.target.value)} />
              </div>
            )}
            <div style={{ padding:'0 16px 16px' }}>
              <button onClick={() => download(dlFmt)} disabled={downloading}
                style={{ width:'100%', padding:12, borderRadius:8, border:'none', background:downloading?'var(--s4)':'linear-gradient(135deg,#5b4cf6,#3d2fd4)', color:downloading?'var(--t3)':'#fff', fontSize:13, fontWeight:700, cursor:downloading?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'var(--font-sans)' }}>
                {downloading ? <><Spin />{dlProgress}</> : `↓ Download ${dlFmt.toUpperCase()}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST ════════════════════════════════════════════ */}
      {toast && (
        <div style={{ position:'fixed', bottom:24, left:'50%', background:'var(--s4)', border:'1px solid var(--b3)', color:'var(--t1)', padding:'10px 20px', borderRadius:10, fontSize:12, fontFamily:'var(--font-mono)', zIndex:9999, whiteSpace:'nowrap', boxShadow:'0 8px 32px rgba(0,0,0,0.5)', animation:'fadeUp 0.18s ease', transform:'translateX(-50%)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ── Export Panel ──────────────────────────────────────────────
function ExportPanel({ canvasW, canvasH, onCanvasW, onCanvasH, fmt, onFmt, quality, onQuality, onDownload, onCopyLink }: {
  canvasW:number; canvasH:number; onCanvasW:(v:number)=>void; onCanvasH:(v:number)=>void
  fmt:string; onFmt:(v:string)=>void; quality:number; onQuality:(v:number)=>void
  onDownload:()=>void; onCopyLink:()=>void
}) {
  const PRESETS = [
    {l:'HD',w:1920,h:1080},{l:'2K',w:2560,h:1440},{l:'4K',w:3840,h:2160},
    {l:'Square',w:1080,h:1080},{l:'Portrait',w:1080,h:1920},{l:'OG',w:1200,h:628},
    {l:'Twitter',w:1500,h:500},{l:'YouTube',w:2048,h:1152},
  ]
  const active = (p: typeof PRESETS[0]) => canvasW===p.w && canvasH===p.h
  return (
    <div style={{ flexShrink:0, padding:14, borderTop:'1px solid var(--b1)' }}>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--t3)', marginBottom:10 }}>Canvas Size</div>
      <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
        <span style={{ fontSize:10, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>W</span>
        <input type="number" value={canvasW} onChange={e=>onCanvasW(+e.target.value)} onBlur={e=>onCanvasW(+e.target.value)} style={{ ...numInput, flex:1 }} />
        <span style={{ fontSize:10, color:'var(--t4)' }}>×</span>
        <input type="number" value={canvasH} onChange={e=>onCanvasH(+e.target.value)} onBlur={e=>onCanvasH(+e.target.value)} style={{ ...numInput, flex:1 }} />
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:4, marginBottom:14 }}>
        {PRESETS.map(p => (
          <button key={p.l} onClick={() => { onCanvasW(p.w); onCanvasH(p.h) }}
            style={{ fontSize:10, padding:'3px 8px', borderRadius:5, background:active(p)?'var(--accs)':'var(--s3)', border:`1px solid ${active(p)?'var(--acc)':'var(--b2)'}`, color:active(p)?'var(--acc)':'var(--t2)', cursor:'pointer' }}>
            {p.l}
          </button>
        ))}
      </div>
      <div style={{ fontSize:9, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--t3)', marginBottom:8 }}>Format</div>
      <div style={{ display:'flex', gap:4, marginBottom:fmt!=='png'?10:14 }}>
        {['png','jpeg','webp'].map(f => (
          <button key={f} onClick={() => onFmt(f)}
            style={{ flex:1, padding:'6px 0', borderRadius:6, border:`1px solid ${fmt===f?'var(--acc)':'var(--b2)'}`, background:fmt===f?'var(--accs)':'var(--s3)', color:fmt===f?'var(--acc)':'var(--t2)', fontSize:10, fontWeight:700, cursor:'pointer', textTransform:'uppercase' }}>
            {f}
          </button>
        ))}
      </div>
      {fmt !== 'png' && (
        <div style={{ marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
            <span style={{ fontSize:11, color:'var(--t2)' }}>Quality</span>
            <span style={{ fontSize:11, color:'var(--acc)', fontFamily:'var(--font-mono)' }}>{quality}%</span>
          </div>
          <input type="range" min={60} max={100} step={1} value={quality} onChange={e=>onQuality(+e.target.value)} />
        </div>
      )}
      <button onClick={onDownload}
        style={{ width:'100%', padding:'10px 0', background:'linear-gradient(135deg,#5b4cf6,#3d2fd4)', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:700, cursor:'pointer', marginBottom:6, fontFamily:'var(--font-sans)' }}>
        ↓ Download {fmt.toUpperCase()}
      </button>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:5 }}>
        <button onClick={onCopyLink} style={{ padding:'7px 0', background:'transparent', border:'1px solid var(--b2)', color:'var(--t2)', borderRadius:6, fontSize:10, cursor:'pointer' }}>
          ⬡ Share <Kbd>C</Kbd>
        </button>
        <a href="/" style={{ padding:'7px 0', background:'transparent', border:'1px solid var(--b2)', color:'var(--t2)', borderRadius:6, fontSize:10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none' }}>
          ← Home
        </a>
      </div>
    </div>
  )
}

// ── UI helpers ────────────────────────────────────────────────
const numInput: React.CSSProperties = { width:60, background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t1)', padding:'4px 6px', borderRadius:6, fontSize:11, fontFamily:'var(--font-mono)', textAlign:'right', outline:'none' }

function HBtn({ onClick, title, children }: { onClick:()=>void; title?:string; children:React.ReactNode }) {
  return <button onClick={onClick} title={title} style={{ height:30, padding:'0 9px', borderRadius:7, border:'1px solid var(--b2)', background:'transparent', color:'var(--t2)', fontSize:11, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:4, fontFamily:'var(--font-sans)', whiteSpace:'nowrap' }}>{children}</button>
}
function Kbd({ children }: { children:React.ReactNode }) {
  return <kbd style={{ fontSize:9, background:'rgba(255,255,255,0.07)', border:'1px solid var(--b2)', borderRadius:3, padding:'1px 4px', color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{children}</kbd>
}
function Divider() {
  return <div style={{ width:1, height:18, background:'var(--b2)', margin:'0 2px' }} />
}
function Spin() {
  return <span style={{ display:'inline-block', width:12, height:12, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
}
function UndoIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13"/></svg>
}
function RedoIcon() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3L21 13"/></svg>
}
function DownloadIcon() {
  return <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
}
