'use client'
import { useEffect, useState } from 'react'
import type { ToolSlug, Params, ControlsProps } from '@/lib/core/types'

interface Props {
  toolSlug: ToolSlug
  params: Params
  onChange: (key: string, value: unknown) => void
  onShuffle: () => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}

export default function ToolControls({ toolSlug, params, onChange, onShuffle, uploadImgRef }: Props) {
  const [Controls, setControls] = useState<React.ComponentType<ControlsProps> | null>(null)

  useEffect(() => {
    import(`@/lib/tools/${toolSlug}/controls`).then(mod => {
      setControls(() => mod.Controls)
    }).catch(console.error)
  }, [toolSlug])

  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Variation + Shuffle always at top */}
      <div style={{ padding: '12px 14px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {params.seed !== undefined && (
          <button onClick={() => onChange('seed', Math.floor(Math.random() * 99999) + 1)}
            style={btnStyle('#5b7cf6', '#fff')}>
            ⟳ &nbsp; New Variation
            <Kbd>R</Kbd>
          </button>
        )}
        <button onClick={onShuffle} style={btnStyle('var(--s3)', 'var(--t2)', '1px solid var(--b2)')}>
          ⇄ &nbsp; Shuffle Everything
        </button>
        {params.seed !== undefined && (
          <button onClick={() => onChange('seed', (params.seed as number ?? 1) === 1 ? 2 : 1)}
            style={btnStyle('transparent', 'var(--t3)', '1px solid var(--b1)')}>
            ↺ &nbsp; Reset
            <Kbd>⌫</Kbd>
          </button>
        )}
      </div>

      {/* Upload trigger for custom tile */}
      {toolSlug === 'upload' && (
        <div style={{ padding: '10px 14px 0' }}>
          <div onClick={() => {
            const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'
            inp.onchange = e => {
              const f = (e.target as HTMLInputElement).files?.[0]; if (!f) return
              const rd = new FileReader()
              rd.onload = ev => { const img = new Image(); img.onload = () => { uploadImgRef.current = img; onChange('_uploadImg', img) }; img.src = ev.target?.result as string }
              rd.readAsDataURL(f)
            }; inp.click()
          }} style={{ border: '1.5px dashed var(--b2)', borderRadius: 8, padding: 12, textAlign: 'center', cursor: 'pointer', color: 'var(--t3)', fontSize: 12 }}>
            {uploadImgRef.current ? '✓ Image loaded — click to replace' : '+ Upload image'}
          </div>
        </div>
      )}

      {/* Tool-specific controls */}
      {Controls ? (
        <Controls params={params} onChange={onChange} />
      ) : (
        <div style={{ padding: 20, color: 'var(--t4)', fontSize: 12 }}>Loading controls…</div>
      )}
    </div>
  )
}

function btnStyle(bg: string, color: string, border?: string): React.CSSProperties {
  return { width: '100%', padding: '8px 12px', borderRadius: 8, border: border || 'none', background: bg, color, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-sans)' }
}
function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd style={{ fontSize: 9, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 3, padding: '1px 5px', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{children}</kbd>
}
