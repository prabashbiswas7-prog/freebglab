import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#2d3561','#c05c7e','#f3826f']
  const scale=(p.scale as number)||2.2,warp=(p.warp as number)||3.5
  const oct=(p.octaves as number)||5,bright=(p.brightness as number)||1.1
  const curveDist=(p.curveDist as number)||50
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const nx=x/w*scale,ny=y/h*scale
    const wx=fbm(nx+0.0,ny+0.0,oct)*warp
    const wy=fbm(nx+5.2,ny+1.3,oct)*warp
    let v=fbm(nx+wx,ny+wy,oct)
    if(curveDist>0){const ww=fbm(nx+wx+1.7,ny+wy+9.2,3)*(curveDist/50);v=fbm(nx+wx+ww,ny+wy+ww,oct)}
    v=Math.max(0,Math.min(1,v*bright*.5+.5))
    const c=multiLerp(colors,v);const[r,g,b]=hex2rgb(c)
    const i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
  }
  ctx.putImageData(img,0,0)
}