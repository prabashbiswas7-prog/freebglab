'use client'
import { useEffect, useState } from 'react'
import type { ToolSlug, Params } from '@/lib/core/types'
import { getDefaultParams } from '@/lib/tools/loader'
import Studio from '@/components/studio/Studio'

export default function StudioClient({ slug }: { slug: ToolSlug }) {
  const [params, setParams] = useState<Params | null>(null)

  useEffect(() => {
    try {
      // Check for shared URL params first
      const url = new URL(window.location.href)
      const d = url.searchParams.get('d')
      if (d) {
        const b64    = d.replace(/-/g, '+').replace(/_/g, '/')
        const padded = b64 + '=='.slice(0, (4 - b64.length % 4) % 4)
        const json   = decodeURIComponent(escape(atob(padded)))
        const data   = JSON.parse(json)
        if (data.p && typeof data.p === 'object') {
          setParams(data.p)
          return
        }
      }
    } catch {}
    // Load defaults synchronously from static map
    try {
      setParams(getDefaultParams(slug))
    } catch (e) {
      console.error('Failed to load params for', slug, e)
      setParams({}) // fallback to empty params
    }
  }, [slug])

  if (!params) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--t3)', fontSize: 13, gap: 10 }}>
      <span style={{ display: 'inline-block', width: 16, height: 16, border: '2px solid var(--b3)', borderTopColor: 'var(--acc)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading…
    </div>
  )

  return <Studio initialTool={slug} initialParams={params} />
}
