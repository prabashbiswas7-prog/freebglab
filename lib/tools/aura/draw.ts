import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#0d0040','#4a00c8','#b040ff']
  const bg=(p.bg as string)||'#04050d'
  const count=(p.count as number)||4,size=(p.size as number)||68
  const soft=(p.softness as number)||80,bright=(p.brightness as number)||75
  const scatter=(p.scatter as number)||85
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let i=0;i<count;i++){
    const cx=(p.cx as number||50)/100*w+(rng()-.5)*scatter/100*w
    const cy=(p.cy as number||50)/100*h+(rng()-.5)*scatter/100*h
    const r=(size/100)*Math.max(w,h)*(0.25+rng()*0.5)
    const col=colors[i%colors.length];const[cr,cg,cb]=hex2rgb(col)
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*(soft/80))
    const a=Math.min(1,(bright/100)*0.9)
    g.addColorStop(0,`rgba(${cr},${cg},${cb},${a})`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
    ctx.globalCompositeOperation='screen';ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
  }
  ctx.globalCompositeOperation='source-over'
}