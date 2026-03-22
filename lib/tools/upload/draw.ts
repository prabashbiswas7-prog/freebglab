import type{DrawFn}from '@/lib/core/types'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const bg=(p.bg as string)||'#050810'
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const img=p._uploadImg as HTMLImageElement|null
  if(!img)return
  const scale=(p.scale as number)||1,rotation=(p.rotation as number)||0
  const offX=(p.offX as number)||0,offY=(p.offY as number)||0
  const opacity=(p.opacity as number)||1
  ctx.save();ctx.globalAlpha=opacity
  ctx.translate(w/2+offX,h/2+offY);ctx.rotate(rotation*Math.PI/180);ctx.scale(scale,scale)
  ctx.drawImage(img,-img.width/2,-img.height/2)
  ctx.restore()
}