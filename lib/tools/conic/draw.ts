import type{DrawFn}from '@/lib/core/types'
import{multiLerp}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const colors=(p.colors as string[])||['#0f0c29','#e040fb']
  const cx=(p.cx as number||50)/100*w,cy=(p.cy as number||50)/100*h
  const startAngle=(p.angle as number||0)*Math.PI/180
  const img=ctx.createImageData(w,h),d=img.data
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const a=((Math.atan2(y-cy,x-cx)-startAngle)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)
    const t=a/(Math.PI*2)
    const c=colors[Math.floor(t*(colors.length-1))]
    const c2=colors[Math.min(Math.floor(t*(colors.length-1))+1,colors.length-1)]
    const lt=t*(colors.length-1)-Math.floor(t*(colors.length-1))
    const r1=parseInt(c.slice(1,3),16),g1=parseInt(c.slice(3,5),16),b1=parseInt(c.slice(5,7),16)
    const r2=parseInt(c2.slice(1,3),16),g2=parseInt(c2.slice(3,5),16),b2=parseInt(c2.slice(5,7),16)
    const i=(y*w+x)*4
    d[i]=r1+lt*(r2-r1);d[i+1]=g1+lt*(g2-g1);d[i+2]=b1+lt*(b2-b1);d[i+3]=255
  }
  ctx.putImageData(img,0,0)
}