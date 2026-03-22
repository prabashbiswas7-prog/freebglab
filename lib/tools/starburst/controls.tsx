'use client'
import{Section,Slider,Toggle,AngleSlider,ColorPicker,PaletteSection,n,b}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Rays" open><Slider label="Ray Count" value={n(p,'rays',14)} min={2} max={128} step={1} onChange={v=>u('rays',v)}/><Slider label="Length %" value={n(p,'length',82)} min={10} max={100} step={1} onChange={v=>u('length',v)}/><Slider label="Width" value={n(p,'width',1.4)*10} min={1} max={80} step={1} onChange={v=>u('width',v/10)}/><AngleSlider label="Rotation" value={n(p,'rotation',0)} onChange={v=>u('rotation',v)}/><Toggle label="Glow" value={b(p,'glow',true)} onChange={v=>u('glow',v)}/></Section>
<Section title="Position"><Slider label="Origin X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>u('cx',v)}/><Slider label="Origin Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>u('cy',v)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#04050d'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}