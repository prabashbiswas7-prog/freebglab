import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#030010','#0d0040','#4a00c8','#b040ff']
  const bw=(p.blockW as number)||40,bh=(p.blockH as number)||40
  const gap=(p.gap as number)||2,round=(p.roundness as number)||4
  const ns=(p.noiseScale as number)||2.8,noiseInt=(p.noiseInt as number)||55
  const opacity=(p.opacity as number)||1,variation=(p.variation as number)||0
  for(let y=0;y<=h;y+=bh+gap){for(let x=0;x<=w;x+=bw+gap){
    const nx=x/w*ns,ny=y/h*ns
    let v=fbm(nx,ny,4)*.5+.5
    v=Math.max(0,Math.min(1,v+(noiseInt/200-.25)))
    const c=multiLerp(colors,v)
    const varX=variation>0?(rng()-.5)*variation*bw/100:0
    const varY=variation>0?(rng()-.5)*variation*bh/100:0
    ctx.fillStyle=c;ctx.globalAlpha=opacity
    ctx.beginPath();ctx.roundRect(x+varX,y+varY,bw,bh,round);ctx.fill()
  }}
  ctx.globalAlpha=1
}