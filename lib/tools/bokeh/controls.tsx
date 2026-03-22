'use client'
import{Section,Slider,Toggle,ColorPicker,PaletteSection,n,b}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Bokeh" open><Slider label="Count" value={n(p,'count',70)} min={5} max={300} step={5} onChange={v=>u('count',v)}/><Slider label="Min Radius" value={n(p,'minR',15)} min={2} max={200} step={1} onChange={v=>u('minR',v)}/><Slider label="Max Radius" value={n(p,'maxR',140)} min={10} max={600} step={5} onChange={v=>u('maxR',v)}/><Slider label="Opacity" value={n(p,'opacity',0.8)*100} min={5} max={100} step={1} onChange={v=>u('opacity',v/100)}/><Slider label="Glow" value={n(p,'glow',50)} min={0} max={100} step={1} onChange={v=>u('glow',v)}/><Toggle label="Rings" value={!!n(p,'rings',1)} onChange={v=>u('rings',v?1:0)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#030415'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}