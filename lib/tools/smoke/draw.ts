import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#050718','#0c3060','#56ccf2']
  const scale=(p.scale as number)||2.2,oct=(p.octaves as number)||6
  const bright=(p.bright as number)||1.15,density=(p.density as number)||60
  const turb=(p.turbulence as number)||40,curl=(p.curl as number)||50
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++){for(let x=0;x<w;x++){
    const nx=x/w*scale,ny=y/h*scale
    let v=fbm(nx,ny,oct)*.5+.5
    if(turb>0){const t=fbm(nx+3.1,ny+5.7,Math.min(oct,4))*.5+.5;v=v*(1-turb/200)+t*(turb/200)}
    v=Math.max(0,Math.min(1,v*bright*(density/100)*1.2))
    const c=multiLerp(colors,v);const[r,g,b]=hex2rgb(c)
    const i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
  }}
  ctx.putImageData(img,0,0)
}