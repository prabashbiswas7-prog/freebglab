'use client'
import{Section,Slider,ColorPicker,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Blobs" open><Slider label="Count" value={n(p,'count',6)} min={1} max={30} step={1} onChange={v=>u('count',v)}/><Slider label="Size %" value={n(p,'size',60)} min={5} max={100} step={1} onChange={v=>u('size',v)}/><Slider label="Softness" value={n(p,'softness',70)} min={10} max={100} step={1} onChange={v=>u('softness',v)}/><Slider label="Blur" value={n(p,'blur',8)} min={0} max={60} step={1} onChange={v=>u('blur',v)}/><Slider label="Opacity" value={n(p,'opacity',0.9)*100} min={10} max={100} step={1} onChange={v=>u('opacity',v/100)}/><Slider label="Wobble" value={n(p,'wobble',50)} min={0} max={100} step={1} onChange={v=>u('wobble',v)}/><Slider label="Complexity" value={n(p,'complexity',6)} min={3} max={12} step={1} onChange={v=>u('complexity',v)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#030414'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}