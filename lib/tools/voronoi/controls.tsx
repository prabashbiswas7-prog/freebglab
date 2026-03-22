'use client'
import{Section,Slider,Toggle,ColorPicker,PaletteSection,n,b}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Cells" open><Slider label="Cell Count" value={n(p,'count',20)} min={3} max={120} step={1} onChange={v=>u('count',v)}/><Slider label="Border Opacity" value={n(p,'borderOp',0.2)*100} min={0} max={100} step={1} onChange={v=>u('borderOp',v/100)}/><Slider label="Border Width" value={n(p,'borderW',1)*10} min={1} max={40} step={1} onChange={v=>u('borderW',v/10)}/><Toggle label="Fill Cells" value={!!n(p,'fill',1)} onChange={v=>u('fill',v?1:0)}/><Toggle label="Show Dots" value={!!n(p,'dots',1)} onChange={v=>u('dots',v?1:0)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#060f0c'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}