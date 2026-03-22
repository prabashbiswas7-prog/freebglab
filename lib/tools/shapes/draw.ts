import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#050a20','#0d0040','#4a00c8']
  const bg=(p.bg as string)||'#040414'
  const count=(p.count as number)||20,minSz=(p.minSz as number)||28,maxSz=(p.maxSz as number)||185
  const opacity=(p.opacity as number)||0.88,glow=(p.glow as boolean)||true
  const shape=(p.shape as string)||'mixed'
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  const shapeTypes=['sphere','cube','hex','tri','ring']
  for(let i=0;i<count;i++){
    const x=rng()*w,y=rng()*h,s=minSz+rng()*(maxSz-minSz)
    const col=colors[Math.floor(rng()*colors.length)];const[cr,cg,cb]=hex2rgb(col)
    const a=opacity*(0.4+rng()*0.6)
    const type=shape==='mixed'?shapeTypes[Math.floor(rng()*shapeTypes.length)]:shape
    if(glow){ctx.shadowColor=`rgba(${cr},${cg},${cb},0.6)`;ctx.shadowBlur=s*0.3}
    ctx.fillStyle=`rgba(${cr},${cg},${cb},${a})`
    ctx.strokeStyle=`rgba(${cr},${cg},${cb},${Math.min(1,a+0.2)})`
    ctx.lineWidth=1
    ctx.beginPath()
    if(type==='sphere'){ctx.arc(x,y,s/2,0,Math.PI*2);ctx.fill()}
    else if(type==='cube'){ctx.rect(x-s/2,y-s/2,s,s);ctx.fill();ctx.stroke()}
    else if(type==='hex'){for(let k=0;k<6;k++){const a2=k*Math.PI/3;ctx.lineTo(x+Math.cos(a2)*s/2,y+Math.sin(a2)*s/2)}ctx.closePath();ctx.fill()}
    else if(type==='tri'){ctx.moveTo(x,y-s/2);ctx.lineTo(x+s/2,y+s/2);ctx.lineTo(x-s/2,y+s/2);ctx.closePath();ctx.fill()}
    else if(type==='ring'){ctx.arc(x,y,s/2,0,Math.PI*2);ctx.lineWidth=s*0.12;ctx.stroke()}
    ctx.shadowBlur=0
  }
}