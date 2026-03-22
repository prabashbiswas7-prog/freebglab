import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const text=(p.text as string)||'STUDIO'
  const fg=(p.fg as string)||'#5b7cf6',bg=(p.bg as string)||'#0e0f11'
  const fontSize=(p.fontSize as number)||32,opacity=(p.opacity as number)||0.15
  const angle=(p.angle as number)||-30,spacing=(p.spacing as number)||20
  const weight=(p.fontWeight as string)||'700'
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  ctx.save();ctx.rotate(angle*Math.PI/180)
  ctx.font=`${weight} ${fontSize}px sans-serif`
  ctx.fillStyle=rgba(fg,opacity)
  const tw=ctx.measureText(text).width+spacing
  const D=Math.hypot(w,h)*1.5
  for(let y=-D;y<D;y+=fontSize+spacing){for(let x=-D;x<D;x+=tw){ctx.fillText(text,x,y)}}
  ctx.restore()
}