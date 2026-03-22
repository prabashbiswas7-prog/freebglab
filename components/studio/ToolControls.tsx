'use client'
import { useRef, useEffect } from 'react'
import type { ToolSlug, Params } from '@/lib/core/types'
import { getControls, getDefaultParams } from '@/lib/tools/loader'

interface Props {
  toolSlug: ToolSlug
  params: Params
  onChange: (key: string, value: unknown) => void
  onShuffle: () => void
  uploadImgRef: React.MutableRefObject<HTMLImageElement | null>
}

export default function ToolControls({ toolSlug, params, onChange, onShuffle, uploadImgRef }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevSlug  = useRef<string>('')

  // Scroll to top only when tool changes, not on param update
  useEffect(() => {
    if (prevSlug.current !== toolSlug) {
      scrollRef.current?.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      prevSlug.current = toolSlug
    }
  }, [toolSlug])

  const Controls = getControls(toolSlug)

  return (
    <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>

      {/* Action buttons */}
      <div style={{ padding: '12px 14px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {params.seed !== undefined && (
          <button
            onClick={() => onChange('seed', Math.floor(Math.random() * 99999) + 1)}
            style={btn('linear-gradient(135deg,#5b4cf6,#3d2fd4)', '#fff')}>
            ⟳ New Variation <Kbd>R</Kbd>
          </button>
        )}
        <button onClick={onShuffle} style={btn('var(--s3)', 'var(--t2)', '1px solid var(--b2)')}>
          ⇄ Shuffle Everything
        </button>
        {params.seed !== undefined && (
          <button
            onClick={() => {
              try {
                const fresh = getDefaultParams(toolSlug)
                Object.keys(fresh).forEach(k => onChange(k, fresh[k]))
              } catch (e) { console.warn('Reset failed', e) }
            }}
            style={btn('transparent', 'var(--t3)', '1px solid var(--b1)')}>
            ↺ Reset <Kbd>⌫</Kbd>
          </button>
        )}
      </div>

      {/* Upload for custom tile */}
      {toolSlug === 'upload' && (
        <div style={{ padding: '0 14px 8px' }}>
          <div
            onClick={() => {
              const inp = document.createElement('input')
              inp.type = 'file'; inp.accept = 'image/*'
              inp.onchange = e => {
                const f = (e.target as HTMLInputElement).files?.[0]
                if (!f) return
                const rd = new FileReader()
                rd.onload = ev => {
                  const img = new Image()
                  img.onload = () => { uploadImgRef.current = img; onChange('_uploadImg', img) }
                  img.src = ev.target?.result as string
                }
                rd.readAsDataURL(f)
              }
              inp.click()
            }}
            style={{ border: '1.5px dashed var(--b2)', borderRadius: 8, padding: 12, textAlign: 'center', cursor: 'pointer', color: 'var(--t3)', fontSize: 12 }}>
            {uploadImgRef.current ? '✓ Loaded — click to replace' : '+ Upload image'}
          </div>
        </div>
      )}

      {/* Tool controls */}
      {Controls
        ? <Controls params={params} onChange={onChange} />
        : <div style={{ padding: '20px 14px', color: 'var(--t4)', fontSize: 12 }}>No controls for this tool.</div>
      }
    </div>
  )
}

function btn(bg: string, color: string, border?: string): React.CSSProperties {
  return { width: '100%', padding: '8px 12px', borderRadius: 8, border: border || 'none', background: bg, color, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }
}
function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd style={{ fontSize: 9, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 3, padding: '1px 5px', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>{children}</kbd>
}
