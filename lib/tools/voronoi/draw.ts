import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#0d1f10','#2d7d46','#6ec97f']
  const bg=(p.bg as string)||'#060f0c'
  const count=(p.count as number)||20,fill=(p.fill as number)||1
  const borders=(p.borders as number)||1,borderOp=(p.borderOp as number)||0.2
  const borderW=(p.borderW as number)||1,dots=(p.dots as number)||1
  const pts:number[][]=[];for(let i=0;i<count;i++)pts.push([rng()*w,rng()*h])
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h)
  if(fill){
    const img=ctx.createImageData(w,h);const d=img.data
    for(let y=0;y<h;y+=2){for(let x=0;x<w;x+=2){
      let minD=Infinity,minI=0
      for(let k=0;k<pts.length;k++){const dx=x-pts[k][0],dy=y-pts[k][1],dist=dx*dx+dy*dy;if(dist<minD){minD=dist;minI=k}}
      const t=minI/pts.length
      const col=colors[minI%colors.length];const[r,g,b]=hex2rgb(col)
      for(let py=0;py<2&&y+py<h;py++)for(let px=0;px<2&&x+px<w;px++){const i=((y+py)*w+(x+px))*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255}
    }}
    ctx.putImageData(img,0,0)
  }
  if(dots){ctx.fillStyle='rgba(255,255,255,0.8)';for(const pt of pts){ctx.beginPath();ctx.arc(pt[0],pt[1],2,0,Math.PI*2);ctx.fill()}}
}