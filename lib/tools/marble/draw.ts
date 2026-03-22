import type{DrawFn}from '@/lib/core/types'
import{seedRng,rng,fbm,multiLerp,hex2rgb}from '@/lib/core/utils'
export const draw:DrawFn=(ctx,w,h,p)=>{
  seedRng((p.seed as number)||1)
  const colors=(p.colors as string[])||['#1a1a2e','#e8e8d0','#c8b89a']
  const scale=(p.scale as number)||2.8,turb=(p.turb as number)||5.5
  const angle=(p.angle as number)||45,swirl=(p.swirl as number)||30
  const grain=(p.grain as number)||5
  const rad=angle*Math.PI/180,cos=Math.cos(rad),sin=Math.sin(rad)
  const img=ctx.createImageData(w,h);const d=img.data
  for(let y=0;y<h;y++){for(let x=0;x<w;x++){
    const nx=x/w*scale,ny=y/h*scale
    const warp=fbm(nx+1.7,ny+9.2,4)*turb/5
    const swirlV=swirl>0?fbm(nx+warp,ny+warp,3)*swirl/100:0
    const vein=Math.sin((nx*cos+ny*sin)*Math.PI*3+warp+swirlV)*.5+.5
    const t=Math.pow(Math.abs(Math.sin(vein*Math.PI)),0.3)
    const c=multiLerp(colors,t);const[r,g,b]=hex2rgb(c)
    const i=(y*w+x)*4;d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
  }}
  ctx.putImageData(img,0,0)
  if(grain>0){const img2=ctx.getImageData(0,0,w,h),d2=img2.data;for(let k=0;k<d2.length;k+=4){const n=(rng()-.5)*grain*2;d2[k]=Math.max(0,Math.min(255,d2[k]+n));d2[k+1]=Math.max(0,Math.min(255,d2[k+1]+n));d2[k+2]=Math.max(0,Math.min(255,d2[k+2]+n))}ctx.putImageData(img2,0,0)}
}