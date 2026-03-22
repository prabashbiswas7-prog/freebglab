'use client'
import{Section,Slider,AngleSlider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Marble" open><Slider label="Noise Scale" value={n(p,'scale',2.8)*10} min={5} max={100} step={1} onChange={v=>u('scale',v/10)}/><Slider label="Turbulence" value={n(p,'turb',5.5)*10} min={0} max={220} step={1} onChange={v=>u('turb',v/10)}/><AngleSlider label="Angle" value={n(p,'angle',45)} onChange={v=>u('angle',v)}/><Slider label="Swirl" value={n(p,'swirl',30)} min={0} max={100} step={1} onChange={v=>u('swirl',v)}/></Section>
<Section title="Grain"><Slider label="Amount" value={n(p,'grain',5)} min={0} max={100} step={1} onChange={v=>u('grain',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}