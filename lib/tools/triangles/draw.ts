import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const size=(p.size as number)||40,lw=(p.strokeWidth as number)||2
  const opacity=(p.opacity as number)||1,angle=(p.angle as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  ctx.strokeStyle=rgba(fg,opacity);ctx.lineWidth=lw;ctx.lineJoin='miter'
  const h3=size*Math.sqrt(3)/2,D=Math.hypot(w,h),cols=Math.ceil(D/(size/2))+4,rows=Math.ceil(D/h3)+4;for(let r=-2;r<rows;r++)for(let c=-2;c<cols;c++){const x=c*(size/2)-D/4,y=r*h3-D/4,up=(c+r)%2===0;ctx.beginPath();if(up){ctx.moveTo(x,y+h3);ctx.lineTo(x+size/2,y);ctx.lineTo(x+size,y+h3)}else{ctx.moveTo(x,y);ctx.lineTo(x+size/2,y+h3);ctx.lineTo(x+size,y)}ctx.closePath();ctx.stroke()}
  ctx.restore()
}