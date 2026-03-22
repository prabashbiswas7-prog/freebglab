import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#2d3561','#c05c7e','#f3826f','#ffb961']
  const scale=(p.scale as number)||3.2,oct=(p.octaves as number)||5
  const contrast=(p.nContrast as number)||1.3,offX=(p.offX as number)||0,offY=(p.offY as number)||0
  const curveDist=(p.curveDist as number)||0,noiseInt=(p.noiseInt as number)||100
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++){for(let x=0;x<w;x++){
    const nx=(x+offX)/w*scale,ny=(y+offY)/h*scale
    let v=fbm(nx,ny,oct)*0.5+0.5
    if(curveDist>0){const w2=fbm(nx+5.2,ny+1.3,oct);const z=fbm(nx+w2*curveDist/50,ny+curveDist/50,oct);v=z*.5+.5}
    v=Math.max(0,Math.min(1,((v-.5)*contrast+.5)*(noiseInt/100)))
    const c=multiLerp(colors,v)
    const[r,g,b]=hex2rgb(c);const i=(y*w+x)*4
    d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
  }}
  ctx.putImageData(img,0,0)
}