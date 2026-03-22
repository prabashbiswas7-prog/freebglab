'use client'
import{Section,Slider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Mesh" open><Slider label="Points" value={n(p,'points',7)} min={1} max={20} step={1} onChange={v=>u('points',v)}/><Slider label="Softness" value={n(p,'softness',78)} min={10} max={100} step={1} onChange={v=>u('softness',v)}/><Slider label="Spread" value={n(p,'spread',50)} min={10} max={100} step={1} onChange={v=>u('spread',v)}/></Section>
<Section title="Grain"><Slider label="Amount" value={n(p,'grain',8)} min={0} max={100} step={1} onChange={v=>u('grain',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}