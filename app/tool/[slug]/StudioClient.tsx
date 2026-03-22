'use client'
import { useEffect, useState } from 'react'
import type { ToolSlug, Params } from '@/lib/core/types'
import Studio from '@/components/studio/Studio'

export default function StudioClient({ slug }: { slug: ToolSlug }) {
  const [params, setParams] = useState<Params | null>(null)

  useEffect(() => {
    const load = async () => {
      // Check for shared URL first
      try {
        const url = new URL(window.location.href)
        const d = url.searchParams.get('d')
        if (d) {
          const b64 = d.replace(/-/g,'+').replace(/_/g,'/')
          const padded = b64 + '=='.slice(0, (4 - b64.length % 4) % 4)
          const json = decodeURIComponent(escape(atob(padded)))
          const data = JSON.parse(json)
          if (data.p) { setParams(data.p); return }
        }
      } catch {}
      // Load defaults
      const mod = await import(`@/lib/tools/${slug}/params`)
      setParams(mod.defaultParams())
    }
    load()
  }, [slug])

  if (!params) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', color:'var(--t3)', fontSize:13 }}>
      Loading…
    </div>
  )

  return <Studio initialTool={slug} initialParams={params} />
}
