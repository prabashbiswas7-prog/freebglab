import type{DrawFn}from '@/lib/core/types'
import{rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  const bg=(p.bg as string)||'#050810',lineCol=(p.lineCol as string)||'#1a2540'
  const glowCol=(p.glowCol as string)||'#4f8ef7'
  const size=(p.size as number)||38,gap=(p.gap as number)||2
  const fill=(p.fill as boolean)||false,fillOp=(p.fillOp as number)||0.14
  const glow=(p.glow as boolean)||true
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const hexW=size*2,hexH=Math.sqrt(3)*size
  const cols=Math.ceil(w/hexW)+2,rows=Math.ceil(h/hexH)+2
  if(glow){ctx.shadowColor=glowCol;ctx.shadowBlur=6}
  ctx.strokeStyle=lineCol;ctx.lineWidth=1
  for(let row=-1;row<rows;row++)for(let col=-1;col<cols;col++){
    const cx=col*hexW*0.75,cy=row*hexH+(col%2===0?0:hexH/2)
    ctx.beginPath()
    for(let i=0;i<6;i++){const a=i*Math.PI/3;ctx.lineTo(cx+Math.cos(a)*(size-gap),cy+Math.sin(a)*(size-gap))}
    ctx.closePath()
    if(fill){ctx.fillStyle=rgba(lineCol,fillOp);ctx.fill()}
    ctx.stroke()
  }
  ctx.shadowBlur=0
}