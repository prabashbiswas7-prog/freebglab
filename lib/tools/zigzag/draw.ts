import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const size=(p.size as number)||30,lw=(p.strokeWidth as number)||2
  const amp=(p.amplitude as number)||15,opacity=(p.opacity as number)||1
  const angle=(p.angle as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  ctx.strokeStyle=rgba(fg,opacity);ctx.lineWidth=lw;ctx.lineJoin='miter'
  const D=Math.hypot(w,h),rows=Math.ceil(D/(amp*2))+4
  for(let r=-2;r<rows;r++){const y0=r*amp*2-D/4;ctx.beginPath();let x=-size*2,up=true;while(x<w+size*2){ctx.lineTo(x,y0+(up?0:amp*2));x+=size;up=!up}ctx.stroke()}
  ctx.restore()
}