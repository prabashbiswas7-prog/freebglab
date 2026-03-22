import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb,rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#4f8ef7','#fffbe6']
  const bg=(p.bg as string)||'#04050d'
  const rays=(p.rays as number)||14,len=(p.length as number)||82
  const cx=(p.cx as number||50)/100*w,cy=(p.cy as number||50)/100*h
  const lw=(p.width as number)||1.4,glow=(p.glow as boolean)||true
  const rot=(p.rotation as number)||0
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const maxLen=Math.hypot(w,h)*(len/100)
  for(let i=0;i<rays;i++){
    const angle=(i/rays)*Math.PI*2+rot*Math.PI/180
    const col=colors[i%colors.length];const[cr,cg,cb]=hex2rgb(col)
    if(glow){ctx.shadowColor=`rgba(${cr},${cg},${cb},0.8)`;ctx.shadowBlur=20}
    const g=ctx.createLinearGradient(cx,cy,cx+Math.cos(angle)*maxLen,cy+Math.sin(angle)*maxLen)
    g.addColorStop(0,`rgba(${cr},${cg},${cb},0.9)`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(angle)*maxLen,cy+Math.sin(angle)*maxLen)
    ctx.strokeStyle=g;ctx.lineWidth=lw;ctx.stroke();ctx.shadowBlur=0
  }
}