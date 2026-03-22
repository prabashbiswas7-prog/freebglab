import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const bg=(p.bg as string)||'#050810',lineCol=(p.lineCol as string)||'#1a2540'
  const glowCol=(p.glowCol as string)||'#4f8ef7'
  const cell=(p.cell as number)||55,lw=(p.lw as number)||1
  const angle=(p.angle as number)||0,glow=(p.glow as boolean)||true
  const fade=(p.fade as boolean)||true,iso=(p.iso as boolean)||false
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  if(glow){ctx.shadowColor=glowCol;ctx.shadowBlur=8}
  ctx.strokeStyle=lineCol;ctx.lineWidth=lw
  const D=Math.hypot(w,h)
  for(let x=-D;x<D*2;x+=cell){ctx.beginPath();ctx.moveTo(x,-D);ctx.lineTo(x,D*2);ctx.stroke()}
  if(!iso){for(let y=-D;y<D*2;y+=cell){ctx.beginPath();ctx.moveTo(-D,y);ctx.lineTo(D*2,y);ctx.stroke()}}
  else{for(let y=-D;y<D*2;y+=cell){ctx.beginPath();ctx.moveTo(-D,y);ctx.lineTo(D*2,y+D*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-D,y+D*2);ctx.lineTo(D*2,y);ctx.stroke()}}
  ctx.shadowBlur=0;ctx.restore()
  if(fade){const g=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.2,w/2,h/2,Math.hypot(w,h)*.6);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,bg+'cc');ctx.fillStyle=g;ctx.fillRect(0,0,w,h)}
}