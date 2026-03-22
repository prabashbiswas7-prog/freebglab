import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#030010','#4a00c8','#b040ff']
  const bg=(p.bg as string)||'#030415'
  const count=(p.count as number)||70,minR=(p.minR as number)||15,maxR=(p.maxR as number)||140
  const opacity=(p.opacity as number)||0.8,rings=(p.rings as number)||1
  const glow=(p.glow as number)||50
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let i=0;i<count;i++){
    const x=rng()*w*1.2-w*.1,y=rng()*h*1.2-h*.1
    const r=minR+rng()*(maxR-minR)
    const col=colors[Math.floor(rng()*colors.length)];const[cr,cg,cb]=hex2rgb(col)
    const a=opacity*(0.3+rng()*0.5)
    if(glow>0){ctx.shadowColor=`rgba(${cr},${cg},${cb},0.5)`;ctx.shadowBlur=r*(glow/100)}
    if(rings){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle=`rgba(${cr},${cg},${cb},${a})`;ctx.lineWidth=1+rng()*2;ctx.stroke()}
    else{const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${cr},${cg},${cb},${a})`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
    ctx.shadowBlur=0
  }
}