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
  const half=size/2,rows=Math.ceil(Math.hypot(w,h)/size)+4,cols=Math.ceil(Math.hypot(w,h)/size)+4;for(let r=-2;r<rows;r++)for(let c=-2;c<cols;c++){const x=c*size-Math.hypot(w,h)/4,y=r*size-Math.hypot(w,h)/4;ctx.beginPath();ctx.moveTo(x,y+half);ctx.lineTo(x+half,y);ctx.lineTo(x+size,y+half);ctx.stroke()}
  ctx.restore()
}