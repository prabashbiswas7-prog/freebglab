import type{DrawFn}from '@/lib/core/types'
import{seedRng}from '@/lib/core/utils'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const bg=(p.bg as string)||'#050810',lineCol=(p.lineCol as string)||'#1a2540'
  const spacing=(p.spacing as number)||12,lw=(p.lw as number)||0.8
  const a1=(p.a1 as number)||45,a2=(p.a2 as number)||135
  const opacity=(p.opacity as number)||0.85,layers=(p.layers as number)||2
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const angles=[a1,a2]
  if(layers>=3)angles.push(90)
  const D=Math.hypot(w,h)
  for(const ang of angles){
    ctx.save();ctx.translate(w/2,h/2);ctx.rotate(ang*Math.PI/180)
    ctx.strokeStyle=rgba(lineCol,opacity);ctx.lineWidth=lw
    for(let x=-D;x<D;x+=spacing){ctx.beginPath();ctx.moveTo(x,-D);ctx.lineTo(x,D);ctx.stroke()}
    ctx.restore()
  }
}