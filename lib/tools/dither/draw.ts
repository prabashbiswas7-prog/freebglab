import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#0a0a0a','#3c3c3c','#b0b8c8']
  const scale=(p.scale as number)||3,oct=(p.octaves as number)||4
  const contrast=(p.ditherContrast as number)||1.4,dSize=(p.ditherSize as number)||2
  const threshold=(p.threshold as number)||50
  const BAYER=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const nx=x/w*scale,ny=y/h*scale
    let v=fbm(nx,ny,oct)*.5+.5
    v=Math.max(0,Math.min(1,(v-.5)*contrast+.5))
    const bx=Math.floor(x/dSize)%4,by=Math.floor(y/dSize)%4
    const thresh=(BAYER[by][bx]/16+threshold/100)*0.5
    const idx=v>thresh?colors.length-1:0
    const c=v>thresh?colors[colors.length-1]:colors[0]
    const ci=Math.floor(v*(colors.length-1));const mid=multiLerp(colors,v)
    const[r,g,b]=hex2rgb(v>thresh?colors[Math.min(ci+1,colors.length-1)]:colors[Math.max(ci-1,0)])
    const i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
  }
  ctx.putImageData(img,0,0)
}