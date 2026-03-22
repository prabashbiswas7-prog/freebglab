import Link from 'next/link'
export default function NotFound() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)', color:'var(--t1)', gap:16 }}>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:48, fontWeight:700, color:'var(--t4)' }}>404</div>
      <p style={{ color:'var(--t3)' }}>Tool not found</p>
      <Link href="/" style={{ color:'var(--acc)', textDecoration:'none', fontSize:13 }}>← Back to home</Link>
    </div>
  )
}
