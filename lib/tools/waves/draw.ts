import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb,rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#080616','#1569c7','#56ccf2']
  const bg=(p.bg as string)||'#080616'
  const count=(p.count as number)||6,amp=(p.amp as number)||38
  const freq=(p.freq as number)||2.2,phase=(p.phase as number)||0
  const opacity=(p.opacity as number)||1,lw=(p.lineWidth as number)||0
  const warp=(p.waveWarp as number)||0,curve=(p.curve as number)||1
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let i=count-1;i>=0;i--){
    const col=colors[i%colors.length];const[cr,cg,cb]=hex2rgb(col)
    const ampI=amp/100*h*(.05+(i/count)*.08)
    const freqI=freq*Math.PI*2/w,phI=phase*Math.PI/180+rng()*Math.PI*2
    const yBase=h*(.18+i/count*.66)
    ctx.beginPath();ctx.moveTo(0,h);ctx.lineTo(0,yBase)
    for(let x=0;x<=w;x+=2){
      const warpOff=warp>0?(Math.sin(x*freqI*0.3+phI*1.7)*warp/100*h*0.05):0
      const y=yBase+Math.sin(x*freqI+phI)*ampI*curve+Math.sin(x*freqI*1.73+phI*1.3)*ampI*.38+warpOff
      ctx.lineTo(x,y)
    }
    ctx.lineTo(w,h);ctx.closePath()
    if(lw>0){ctx.strokeStyle=`rgba(${cr},${cg},${cb},${opacity})`;ctx.lineWidth=lw;ctx.stroke()}
    else{const g=ctx.createLinearGradient(0,yBase-ampI,0,yBase+ampI*2);g.addColorStop(0,`rgba(${cr},${cg},${cb},${opacity*.85})`);g.addColorStop(1,`rgba(${cr},${cg},${cb},${opacity*.2})`);ctx.fillStyle=g;ctx.fill()}
  }
}