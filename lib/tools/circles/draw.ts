import type{DrawFn}from '@/lib/core/types'
import{seedRng}from '@/lib/core/utils'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const size=(p.size as number)||40,lw=(p.strokeWidth as number)||2
  const opacity=(p.opacity as number)||1,angle=(p.angle as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  ctx.strokeStyle=rgba(fg,opacity);ctx.lineWidth=lw;ctx.lineJoin='miter'
  const D=Math.hypot(w,h),cols=Math.ceil(D/size)+4,rows=Math.ceil(D/size)+4,r2=size/2-lw;for(let ro=-2;ro<rows;ro++)for(let co=-2;co<cols;co++){const cx2=co*size+size/2-D/4,cy2=ro*size+size/2-D/4;ctx.beginPath();ctx.arc(cx2,cy2,Math.max(1,r2),0,Math.PI*2);ctx.stroke()}
  ctx.restore()
}