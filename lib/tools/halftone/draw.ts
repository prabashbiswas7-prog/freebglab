import type{DrawFn}from '@/lib/core/types'
import{hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const bg=(p.bg as string)||'#050810',dotCol=(p.dotCol as string)||'#e0e4f0'
  const size=(p.size as number)||16,angle=(p.angle as number)||45
  const gamma=(p.gamma as number)||1.3
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad)
  const[dr,dg,db]=hex2rgb(dotCol)
  const D=Math.hypot(w,h)*1.5
  for(let row=-D/2;row<D/2;row+=size){for(let col=-D/2;col<D/2;col+=size){
    const x=col*cos-row*sin+w/2,y=col*sin+row*cos+h/2
    if(x<0||x>=w||y<0||y>=h)continue
    const px=Math.max(0,Math.min(w-1,Math.round(x))),py=Math.max(0,Math.min(h-1,Math.round(y)))
    const imgD=ctx.getImageData(px,py,1,1).data
    const bri=(imgD[0]*0.299+imgD[1]*0.587+imgD[2]*0.114)/255
    const r=Math.pow(bri,1/gamma)*size*0.5
    if(r<0.5)continue
    ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2)
    ctx.fillStyle=`rgb(${dr},${dg},${db})`;ctx.fill()
  }}
}