import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#050718','#0c3060','#1569c7']
  const bg=(p.bg as string)||'#030414'
  const count=(p.count as number)||6,size=(p.size as number)||60
  const soft=(p.softness as number)||70,blur=(p.blur as number)||8
  const opacity=(p.opacity as number)||0.9,wobble=(p.wobble as number)||50
  const complexity=(p.complexity as number)||6
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  for(let i=0;i<count;i++){
    const cx=rng()*w,cy=rng()*h
    const r=(size/100)*Math.min(w,h)*(.25+rng()*.6)
    const col=colors[i%colors.length];const[cr,cg,cb]=hex2rgb(col)
    const pts=Math.max(3,Math.round(complexity)),xs:number[]=[],ys:number[]=[]
    for(let j=0;j<pts;j++){const a=(j/pts)*Math.PI*2;const jit=.5+rng()*(wobble/100);xs.push(cx+Math.cos(a)*r*jit);ys.push(cy+Math.sin(a)*r*jit)}
    ctx.save()
    if(blur>0)ctx.filter=`blur(${Math.round(blur*w/1920)}px)`
    ctx.beginPath();ctx.moveTo((xs[0]+xs[pts-1])/2,(ys[0]+ys[pts-1])/2)
    for(let j=0;j<pts;j++){const nx=(j+1)%pts;ctx.quadraticCurveTo(xs[j],ys[j],(xs[j]+xs[nx])/2,(ys[j]+ys[nx])/2)}
    ctx.closePath()
    const g=ctx.createRadialGradient(cx,cy,0,cx,cy,r*1.5)
    g.addColorStop(0,`rgba(${cr},${cg},${cb},${opacity})`);g.addColorStop(soft/100,`rgba(${cr},${cg},${cb},${opacity*.3})`);g.addColorStop(1,`rgba(${cr},${cg},${cb},0)`)
    ctx.fillStyle=g;ctx.fill();ctx.restore()
  }
}