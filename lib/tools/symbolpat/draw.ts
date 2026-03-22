import type{DrawFn}from '@/lib/core/types'
import{seedRng}from '@/lib/core/utils'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const symbol=(p.symbol as string)||'✦'
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const fontSize=(p.fontSize as number)||28,opacity=(p.opacity as number)||0.2
  const spacing=(p.spacing as number)||40,angle=(p.angle as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.translate(w/2,h/2);ctx.rotate(angle*Math.PI/180);ctx.translate(-w/2,-h/2)
  ctx.font=`${fontSize}px sans-serif`;ctx.fillStyle=rgba(fg,opacity);ctx.textAlign='center';ctx.textBaseline='middle'
  const D=Math.hypot(w,h)
  for(let y=-D/2;y<D;y+=spacing){for(let x=-D/2;x<D;x+=spacing){ctx.fillText(symbol,x,y)}}
  ctx.restore()
}