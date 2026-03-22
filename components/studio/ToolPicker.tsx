'use client'
import type { ToolSlug, ToolMeta } from '@/lib/core/types'
import { TOOLS, getToolsByCategory } from '@/lib/tools/registry'

interface Props {
  active: ToolSlug
  onPick: (slug: ToolSlug) => void
  mobile?: boolean
}

export default function ToolPicker({ active, onPick, mobile }: Props) {
  const byCategory = getToolsByCategory()
  const categories = Object.keys(byCategory)

  if (mobile) {
    return (
      <div style={{ padding: '8px 0' }}>
        {categories.map(cat => (
          <div key={cat}>
            <div style={{ padding: '8px 14px 4px', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--t4)' }}>{cat}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 14px 8px' }}>
              {byCategory[cat].map(t => (
                <ToolChip key={t.slug} tool={t} active={active === t.slug} onPick={onPick} />
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div style={{ width: 180, borderRight: '1px solid var(--b1)', background: 'var(--s1)', overflowY: 'auto', flexShrink: 0 }}>
      <div style={{ padding: '10px 10px 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--t4)' }}>Studio</div>
      {categories.map(cat => (
        <div key={cat}>
          <div style={{ padding: '10px 10px 4px', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--t4)' }}>{cat}</div>
          {byCategory[cat].map(t => (
            <ToolRow key={t.slug} tool={t} active={active === t.slug} onPick={onPick} />
          ))}
        </div>
      ))}
    </div>
  )
}

function ToolRow({ tool, active, onPick }: { tool: ToolMeta; active: boolean; onPick: (s: ToolSlug) => void }) {
  return (
    <div onClick={() => onPick(tool.slug)}
      style={{ padding: '7px 12px', cursor: 'pointer', background: active ? 'var(--accs)' : 'transparent', borderLeft: active ? '2px solid var(--acc)' : '2px solid transparent', display: 'flex', flexDirection: 'column', transition: 'background 0.1s' }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'var(--s3)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
      <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? 'var(--acc)' : 'var(--t1)' }}>{tool.name}</span>
    </div>
  )
}

function ToolChip({ tool, active, onPick }: { tool: ToolMeta; active: boolean; onPick: (s: ToolSlug) => void }) {
  return (
    <div onClick={() => onPick(tool.slug)}
      style={{ padding: '5px 10px', borderRadius: 20, cursor: 'pointer', background: active ? 'var(--acc)' : 'var(--s3)', color: active ? '#fff' : 'var(--t2)', fontSize: 11, fontWeight: active ? 600 : 400, border: '1px solid', borderColor: active ? 'var(--acc)' : 'var(--b2)', whiteSpace: 'nowrap' }}>
      {tool.name}
    </div>
  )
}
