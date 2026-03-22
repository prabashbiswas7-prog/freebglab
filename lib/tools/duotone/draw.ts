import type{DrawFn}from '@/lib/core/types'
import{seedRng,fbm,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const[r1,g1,b1]=hex2rgb(p.colorA as string||'#0a0025')
  const[r2,g2,b2]=hex2rgb(p.colorB as string||'#ff6b9d')
  const scale=(p.noiseScale as number)||3,oct=(p.noiseOct as number)||4
  const contrast=(p.duoContrast as number)||1.2
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    let v=fbm(x/w*scale,y/h*scale,oct)*.5+.5
    v=Math.max(0,Math.min(1,(v-.5)*contrast+.5))
    const i=(y*w+x)*4
    d[i]=r1+v*(r2-r1);d[i+1]=g1+v*(g2-g1);d[i+2]=b1+v*(b2-b1);d[i+3]=255
  }
  ctx.putImageData(img,0,0)
}