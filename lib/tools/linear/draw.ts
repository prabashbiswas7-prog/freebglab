import type{DrawFn}from '@/lib/core/types'
import{multiLerp}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const colors=(p.colors as string[])||['#0f0c29','#e040fb']
  const angle=((p.angle as number)||135)*Math.PI/180
  const cos=Math.cos(angle),sin=Math.sin(angle)
  const len=Math.abs(w*cos)+Math.abs(h*sin)
  const cx=w/2,cy=h/2
  const x0=cx-cos*len/2,y0=cy-sin*len/2,x1=cx+cos*len/2,y1=cy+sin*len/2
  const g=ctx.createLinearGradient(x0,y0,x1,y1)
  colors.forEach((c,i)=>g.addColorStop(i/(colors.length-1),c))
  ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
}