// ─── Seeded RNG ────────────────────────────────────────────────
let _S = 1
export function seedRng(s: number) { _S = (s | 0) || 1 }
export function rng(): number {
  _S = Math.imul(_S ^ (_S >>> 17), 0x45d9f3b)
  _S ^= _S >>> 15
  return (_S >>> 0) / 0xffffffff
}
export function randInt(a = 1, b = 99999) {
  return Math.floor(Math.random() * (b - a + 1)) + a
}

// ─── Perlin Noise ──────────────────────────────────────────────
const _pp = Array.from({ length: 256 }, (_, i) => i).sort(() => Math.random() - 0.5)
const PP = [..._pp, ..._pp]
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
const grad = (h: number, x: number, y: number) => {
  h &= 3
  return ((h & 1) ? -(h < 2 ? x : y) : (h < 2 ? x : y)) +
         ((h & 2) ? -(h < 2 ? y : x) : (h < 2 ? y : x))
}
export function perlin(x: number, y: number): number {
  const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255
  const xf = x - Math.floor(x), yf = y - Math.floor(y)
  const u = fade(xf), v = fade(yf)
  return (
    (1-u)*((1-v)*grad(PP[PP[xi]+yi],xf,yf)+v*grad(PP[PP[xi]+yi+1],xf,yf-1)) +
    u*((1-v)*grad(PP[PP[xi+1]+yi],xf-1,yf)+v*grad(PP[PP[xi+1]+yi+1],xf-1,yf-1))
  )
}
export function fbm(x: number, y: number, oct = 4): number {
  let v = 0, a = 1, f = 1, t = 0
  for (let i = 0; i < oct; i++) { v += perlin(x*f,y*f)*a; t+=a; a*=.5; f*=2 }
  return v / t
}

// ─── Colour ────────────────────────────────────────────────────
export function hex2rgb(h: string): [number, number, number] {
  h = h || '#000'
  return [parseInt(h.slice(1,3),16)||0, parseInt(h.slice(3,5),16)||0, parseInt(h.slice(5,7),16)||0]
}
export function rgb2hex(r: number, g: number, b: number): string {
  return '#' + [r,g,b].map(v => Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,'0')).join('')
}
export function rgba(hex: string, a: number): string {
  const [r,g,b] = hex2rgb(hex)
  return `rgba(${r},${g},${b},${a})`
}
export function lerp(a: number, b: number, t: number) { return a + (b-a)*t }
export function lerpColor(c1: string, c2: string, t: number): string {
  const [r1,g1,b1] = hex2rgb(c1), [r2,g2,b2] = hex2rgb(c2)
  return rgb2hex(r1+t*(r2-r1), g1+t*(g2-g1), b1+t*(b2-b1))
}
export function multiLerp(cols: string[], t: number): string {
  if (!cols?.length) return '#000'
  if (cols.length===1) return cols[0]
  t = Math.max(0, Math.min(1, t))
  const s = (cols.length-1)*t, i = Math.min(Math.floor(s), cols.length-2)
  return lerpColor(cols[i], cols[i+1], s-i)
}
export function hsl2hex(h: number, s: number, l: number): string {
  s/=100; l/=100
  const a = s*Math.min(l,1-l)
  const f = (n: number) => { const k=(n+h/30)%12; return l-a*Math.max(-1,Math.min(k-3,9-k,1)) }
  return rgb2hex(f(0)*255, f(8)*255, f(4)*255)
}
export function randomPalette(n = 4): string[] {
  const h = Math.random()*360
  const modes = ['analogous','split','triadic','complementary','monochrome']
  const mode = modes[Math.floor(Math.random()*modes.length)]
  const s = 50+Math.random()*40, lBase = 20+Math.random()*20
  return Array.from({length:n},(_,i)=>{
    let hh=h, ll=lBase+i*(55/n)
    if (mode==='analogous') hh=h+i*25
    else if (mode==='split') hh=h+(i%2===0?0:150+Math.random()*60)
    else if (mode==='triadic') hh=h+i*120
    else if (mode==='complementary') hh=h+(i<n/2?0:180)
    else ll=lBase+i*(60/n)
    return hsl2hex(((hh%360)+360)%360, s, Math.min(75,ll))
  })
}

// ─── Canvas post-processing ─────────────────────────────────────
export function applyGrain(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number, seed: number) {
  const img = ctx.getImageData(0,0,w,h), d = img.data
  seedRng(seed)
  for (let i=0;i<d.length;i+=4) {
    const n=(rng()-.5)*intensity*255
    d[i]=Math.max(0,Math.min(255,d[i]+n))
    d[i+1]=Math.max(0,Math.min(255,d[i+1]+n))
    d[i+2]=Math.max(0,Math.min(255,d[i+2]+n))
  }
  ctx.putImageData(img,0,0)
}
export function applyVignette(ctx: CanvasRenderingContext2D, w: number, h: number, strength: number) {
  const g = ctx.createRadialGradient(w/2,h/2,0,w/2,h/2,Math.hypot(w,h)/2)
  g.addColorStop(0,'rgba(0,0,0,0)')
  g.addColorStop(1,`rgba(0,0,0,${strength/100})`)
  ctx.fillStyle=g; ctx.fillRect(0,0,w,h)
}
export function applyBCS(ctx: CanvasRenderingContext2D, w: number, h: number, brightness: number, saturation: number, contrast: number) {
  if (brightness===100 && saturation===100 && contrast===100) return
  const img=ctx.getImageData(0,0,w,h), d=img.data
  const b=brightness/100, s=saturation/100, c=contrast/100
  for (let i=0;i<d.length;i+=4) {
    let r=d[i]*b, g=d[i+1]*b, bl=d[i+2]*b
    const gray=0.299*r+0.587*g+0.114*bl
    r=gray+s*(r-gray); g=gray+s*(g-gray); bl=gray+s*(bl-gray)
    r=(r-128)*c+128; g=(g-128)*c+128; bl=(bl-128)*c+128
    d[i]=Math.max(0,Math.min(255,r))
    d[i+1]=Math.max(0,Math.min(255,g))
    d[i+2]=Math.max(0,Math.min(255,bl))
  }
  ctx.putImageData(img,0,0)
}

// ─── Palettes ──────────────────────────────────────────────────
export const PALETTES: Record<string, string[]> = {
  aurora:   ['#0f0c29','#302b63','#7b2ff7','#e040fb'],
  nordic:   ['#2d3561','#c05c7e','#f3826f','#ffb961'],
  forest:   ['#0d1f10','#1a3a24','#2d7d46','#6ec97f'],
  ocean:    ['#050718','#0c3060','#1569c7','#56ccf2'],
  sunset:   ['#1a0020','#c2185b','#ff6b35','#ffd166'],
  ember:    ['#0f0000','#8b1a1a','#d44000','#ff9f1c'],
  candy:    ['#1a0030','#6c3483','#e91e8c','#ff9eb5'],
  chrome:   ['#0a0a0a','#1c1c1c','#3c3c3c','#b0b8c8'],
  cosmic:   ['#030010','#0d0040','#4a00c8','#b040ff'],
  rose:     ['#1a0010','#7b0038','#d4006a','#ff80c0'],
  mint:     ['#001a10','#00522a','#00a86b','#7fffd4'],
  gold:     ['#1a1000','#5c3a00','#c07800','#ffd700'],
  neon:     ['#000000','#001a33','#003399','#00ccff'],
  fire:     ['#0d0000','#3d0000','#800000','#cc2200','#ff5500','#ff8800','#ffcc00','#ffff80'],
  earth:    ['#1a0a00','#3d1a00','#7a3b00','#b05c00','#d4882b','#e8b870','#f5d9a8','#fff8f0'],
}
