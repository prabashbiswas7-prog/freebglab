'use client'
import{Section,Slider,AngleSlider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Shape" open><AngleSlider label="Start Angle" value={n(p,'angle',0)} onChange={v=>u('angle',v)}/><Slider label="Center X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>u('cx',v)}/><Slider label="Center Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>u('cy',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}