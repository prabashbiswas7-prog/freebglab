import type{DrawFn}from '@/lib/core/types'
import{fbm,rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const bg=(p.bg as string)||'#050810',dotCol=(p.dotCol as string)||'#1a2540'
  const glowCol=(p.glowCol as string)||'#4f8ef7'
  const spacing=(p.spacing as number)||26,minR=(p.minR as number)||1,maxR=(p.maxR as number)||5.5
  const fade=(p.fade as boolean)||true,noise=(p.noise as number)||0
  const shape=(p.dotShape as string)||'circle'
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let y=0;y<h;y+=spacing)for(let x=0;x<w;x+=spacing){
    let r=minR+(maxR-minR)*0.5
    if(noise>0){const nv=fbm(x/w*3,y/h*3,3)*.5+.5;r=minR+nv*(maxR-minR)}
    if(fade){const dx=x/w-.5,dy=y/h-.5;const dist=Math.hypot(dx,dy)*2;r*=Math.max(0,1-dist)}
    if(r<0.3)continue
    ctx.fillStyle=dotCol
    ctx.beginPath()
    if(shape==='square')ctx.rect(x-r,y-r,r*2,r*2)
    else ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fill()
  }
}