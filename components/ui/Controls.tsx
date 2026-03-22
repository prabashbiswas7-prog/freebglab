'use client'
import { useState } from 'react'
import { randomPalette, PALETTES } from '@/lib/core/utils'

// ─── Section ───────────────────────────────────────────────────
export function Section({ title, children, open: defaultOpen = false, badge }: {
  title: string; children: React.ReactNode; open?: boolean; badge?: string
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ borderBottom: '1px solid var(--b1)' }}>
      <div onClick={() => setOpen(o => !o)}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 14px', cursor:'pointer', userSelect:'none' }}>
        <div style={{ display:'flex', alignItems:'center', gap:7 }}>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--t3)' }}>{title}</span>
          {badge && <span style={{ fontSize:9, background:'var(--acc)', color:'#fff', borderRadius:3, padding:'1px 5px', fontWeight:600 }}>{badge}</span>}
        </div>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none"
          style={{ color:'var(--t4)', transition:'transform 0.2s', transform:open?'rotate(180deg)':'rotate(0deg)', flexShrink:0 }}>
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      {open && <div style={{ padding:'2px 14px 12px' }}>{children}</div>}
    </div>
  )
}

// ─── Slider ────────────────────────────────────────────────────
export function Slider({ label, value, min, max, step = 1, dec, kbd, onChange }: {
  label: string; value: number; min: number; max: number
  step?: number; dec?: number; kbd?: string; onChange: (v: number) => void
}) {
  const d = dec !== undefined ? dec : step < 1 ? 1 : 0
  const display = Number(value).toFixed(d)
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:5 }}>
        <span style={{ fontSize:12, color:'var(--t2)', display:'flex', alignItems:'center', gap:5 }}>
          {label}{kbd && <Kbd>{kbd}</Kbd>}
        </span>
        <span style={{ fontSize:11, color:'var(--t1)', fontFamily:'var(--font-mono)', minWidth:36, textAlign:'right' }}>{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)} style={{ width:'100%' }} />
    </div>
  )
}

// ─── Toggle ────────────────────────────────────────────────────
export function Toggle({ label, value, kbd, onChange }: {
  label: string; value: boolean; kbd?: string; onChange: (v: boolean) => void
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
      <span style={{ fontSize:12, color:'var(--t2)', display:'flex', alignItems:'center', gap:5 }}>
        {label}{kbd && <Kbd>{kbd}</Kbd>}
      </span>
      <div onClick={() => onChange(!value)}
        style={{ width:32, height:18, borderRadius:9, background:value?'var(--acc)':'var(--s4)', border:'1px solid var(--b2)', position:'relative', cursor:'pointer', transition:'background 0.15s', flexShrink:0 }}>
        <div style={{ position:'absolute', width:12, height:12, borderRadius:'50%', background:'#fff', top:2, left:value?16:2, transition:'left 0.15s', boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  )
}

// ─── ColorPicker ───────────────────────────────────────────────
export function ColorPicker({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
      <span style={{ fontSize:12, color:'var(--t2)' }}>{label}</span>
      <input type="color" value={value||'#000000'} onChange={e => onChange(e.target.value)}
        style={{ width:28, height:28, cursor:'pointer', border:'1px solid var(--b2)', borderRadius:6, padding:2, background:'none' }} />
    </div>
  )
}

// ─── Select ────────────────────────────────────────────────────
export function Select({ label, value, options, onChange }: {
  label: string; value: string; options:{v:string;l:string}[]; onChange:(v:string)=>void
}) {
  return (
    <div style={{ marginBottom:10 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span style={{ fontSize:12, color:'var(--t2)' }}>{label}</span>
        <select value={value} onChange={e => onChange(e.target.value)}
          style={{ background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t1)', padding:'4px 8px', borderRadius:6, fontSize:11, fontFamily:'var(--font-sans)', cursor:'pointer', outline:'none', appearance:'none' as const, maxWidth:150 }}>
          {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      </div>
    </div>
  )
}

// ─── AngleSlider ───────────────────────────────────────────────
export function AngleSlider({ label, value, onChange }: {
  label: string; value: number; onChange: (v: number) => void
}) {
  return (
    <div style={{ marginBottom:12 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
        <span style={{ fontSize:12, color:'var(--t2)' }}>{label}</span>
        <span style={{ fontSize:11, color:'var(--t1)', fontFamily:'var(--font-mono)' }}>{Math.round(value)}°</span>
      </div>
      <input type="range" min={0} max={360} step={1} value={value}
        onChange={e => onChange(+e.target.value)} style={{ width:'100%' }} />
    </div>
  )
}

// ─── PaletteSection ────────────────────────────────────────────
export function PaletteSection({ colors, onChange }: {
  colors: string[]
  onChange: (c: string[]) => void
}) {
  return (
    <div style={{ padding:'12px 14px', borderBottom:'1px solid var(--b1)' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{ fontSize:10, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase' as const, color:'var(--t3)' }}>Colours</span>
        <button onClick={() => onChange(randomPalette(colors.length))}
          style={{ fontSize:10, padding:'3px 8px', borderRadius:5, background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t2)', cursor:'pointer' }}>
          Random
        </button>
      </div>
      {/* Palette presets */}
      <div style={{ display:'flex', flexWrap:'wrap' as const, gap:4, marginBottom:10 }}>
        {Object.entries(PALETTES).map(([name, pal]) => (
          <div key={name} title={name}
            onClick={() => onChange([...pal].slice(0, Math.max(2, colors.length)))}
            style={{ display:'flex', height:20, borderRadius:4, overflow:'hidden', cursor:'pointer', border:'2px solid transparent' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor='var(--acc)'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor='transparent'}>
            {pal.map((c,i) => <div key={i} style={{ width:12, background:c }} />)}
          </div>
        ))}
      </div>
      {/* Swatches */}
      <div style={{ display:'flex', flexWrap:'wrap' as const, gap:6, alignItems:'flex-end' }}>
        {colors.map((c,i) => (
          <div key={i} style={{ display:'flex', flexDirection:'column' as const, alignItems:'center', gap:2 }}>
            <span style={{ fontSize:9, color:'var(--t3)', fontFamily:'var(--font-mono)' }}>{i+1}</span>
            <input type="color" value={c}
              onChange={e => { const nc=[...colors]; nc[i]=e.target.value; onChange(nc) }}
              style={{ width:28, height:28, cursor:'pointer', border:'1px solid var(--b2)', borderRadius:5, padding:2, background:'none' }} />
          </div>
        ))}
        {colors.length < 8 && (
          <button onClick={() => onChange([...colors,'#ffffff'])}
            style={{ width:28, height:28, borderRadius:5, background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t2)', cursor:'pointer', fontSize:16 }}>+</button>
        )}
        {colors.length > 2 && (
          <button onClick={() => onChange(colors.slice(0,-1))}
            style={{ width:28, height:28, borderRadius:5, background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t2)', cursor:'pointer', fontSize:16 }}>−</button>
        )}
      </div>
    </div>
  )
}

// ─── TextInput ─────────────────────────────────────────────────
export function TextInput({ label, value, onChange }: {
  label: string; value: string; onChange: (v: string) => void
}) {
  return (
    <div style={{ marginBottom:10 }}>
      <span style={{ fontSize:12, color:'var(--t2)', display:'block', marginBottom:5 }}>{label}</span>
      <input type="text" value={value} onChange={e => onChange(e.target.value)}
        style={{ width:'100%', background:'var(--s3)', border:'1px solid var(--b2)', color:'var(--t1)', padding:'7px 10px', borderRadius:7, fontSize:12, fontFamily:'var(--font-sans)', outline:'none' }} />
    </div>
  )
}

// ─── Kbd ───────────────────────────────────────────────────────
export function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd style={{ fontSize:9, background:'var(--s3)', border:'1px solid var(--b2)', borderRadius:3, padding:'1px 4px', color:'var(--t3)', fontFamily:'var(--font-mono)', pointerEvents:'none' as const }}>
      {children}
    </kbd>
  )
}

// ─── Helpers ───────────────────────────────────────────────────
export function n(p: Record<string, unknown>, key: string, def: number): number {
  const v = p[key]; return typeof v === 'number' && !isNaN(v) ? v : def
}
export function b(p: Record<string, unknown>, key: string, def = false): boolean {
  const v = p[key]
  return typeof v === 'boolean' ? v : typeof v === 'number' ? v !== 0 : def
}
export function s(p: Record<string, unknown>, key: string, def: string): string {
  return typeof p[key] === 'string' ? p[key] as string : def
}
