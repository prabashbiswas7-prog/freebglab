import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const size=(p.size as number)||40,lw=(p.strokeWidth as number)||2
  const opacity=(p.opacity as number)||1,angle=(p.angle as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  ctx.strokeStyle=rgba(fg,opacity);ctx.lineWidth=lw;ctx.lineJoin='miter'
  const half=size/2,D=Math.hypot(w,h),cols=Math.ceil(D/size)+4,rows=Math.ceil(D/size)+4;for(let r=-2;r<rows;r++)for(let c=-2;c<cols;c++){const cx2=c*size+(r%2===0?0:half)-D/4,cy2=r*half-D/4;ctx.beginPath();ctx.moveTo(cx2,cy2-half);ctx.lineTo(cx2+half,cy2);ctx.lineTo(cx2,cy2+half);ctx.lineTo(cx2-half,cy2);ctx.closePath();ctx.stroke()}
  ctx.restore()
}