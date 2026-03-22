import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,rgba}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const bg=(p.bg as string)||'#080c18',lineCol=(p.lineCol as string)||'#1a2d4a'
  const glowCol=(p.glowCol as string)||'#4a90d9'
  const levels=(p.levels as number)||26,scale=(p.scale as number)||2.6
  const lw=(p.lw as number)||1.1,glow=(p.glow as boolean)||true
  const fill=(p.fill as boolean)||false,fillOp=(p.fillOp as number)||0.04
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let level=0;level<levels;level++){
    const threshold=level/levels
    if(fill){ctx.fillStyle=rgba(lineCol,fillOp);ctx.fillRect(0,0,w,h)}
    ctx.beginPath()
    let inContour=false
    for(let x=0;x<w;x+=2){for(let y=0;y<h;y+=2){
      const v=fbm(x/w*scale,y/h*scale,4)*.5+.5
      const above=v>threshold,right=x+2<w&&fbm((x+2)/w*scale,y/h*scale,4)*.5+.5>threshold
      const below=y+2<h&&fbm(x/w*scale,(y+2)/h*scale,4)*.5+.5>threshold
      if(above!==right||above!==below){if(!inContour){ctx.moveTo(x,y);inContour=true}else ctx.lineTo(x,y)}
      else inContour=false
    }}
    if(glow){ctx.shadowColor=glowCol;ctx.shadowBlur=4}
    ctx.strokeStyle=lineCol;ctx.lineWidth=lw;ctx.stroke()
    ctx.shadowBlur=0
  }
}