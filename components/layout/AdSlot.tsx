'use client'
import { useEffect, useRef } from 'react'

interface Props {
  slot: string          // AdSense slot ID — replace with real IDs
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  style?: React.CSSProperties
  className?: string
}

// ── Replace these with your real AdSense publisher ID and slot IDs ──
const PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXXX'  // ← your AdSense pub ID

export default function AdSlot({ slot, format = 'auto', style, className }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch {}
  }, [])

  // In development / before AdSense approval — show placeholder
  if (process.env.NODE_ENV === 'development' || !PUBLISHER_ID.includes('pub-') || PUBLISHER_ID.includes('XXXX')) {
    return (
      <div style={{ background: 'var(--s3)', border: '1px dashed var(--b2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--t4)', fontSize: 10, fontFamily: 'var(--font-mono)', ...style }} className={className}>
        AD SLOT · {slot}
      </div>
    )
  }

  return (
    <div ref={ref} style={style} className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
