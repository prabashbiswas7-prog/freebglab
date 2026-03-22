import type { DrawFn } from '@/lib/core/types'
import { seedRng, rng, hex2rgb } from '@/lib/core/utils'
export const draw: DrawFn = (ctx, w, h, p) => {
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#0f0c29','#302b63','#7b2ff7']
  const points=(p.points as number)||7, soft=(p.softness as number)||78
  const spread=(p.spread as number)||50, grain=(p.grain as number)||8
  ctx.fillStyle=colors[0]; ctx.fillRect(0,0,w,h)
  for(let i=0;i<points;i++){
    const x=rng()*w,y=rng()*h,r=(soft/100)*Math.max(w,h)*(0.3+rng()*(spread/50))
    const [cr,cg,cb]=hex2rgb(colors[i%colors.length])
    const a=0.6+rng()*0.35,g=ctx.createRadialGradient(x,y,0,x,y,r)
    g.addColorStop(0,`rgba(${cr},${cg},${cb},${a})`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h)
  }
  if(grain>0){const img=ctx.getImageData(0,0,w,h),d=img.data;for(let k=0;k<d.length;k+=4){const n=(rng()-.5)*grain*2;d[k]=Math.max(0,Math.min(255,d[k]+n));d[k+1]=Math.max(0,Math.min(255,d[k+1]+n));d[k+2]=Math.max(0,Math.min(255,d[k+2]+n))}ctx.putImageData(img,0,0)}
}