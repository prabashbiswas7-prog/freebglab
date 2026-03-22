'use client'
import{Section,Slider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Smoke" open><Slider label="Noise Scale" value={n(p,'scale',2.2)*10} min={5} max={80} step={1} onChange={v=>u('scale',v/10)}/><Slider label="Octaves" value={n(p,'octaves',6)} min={1} max={8} step={1} onChange={v=>u('octaves',v)}/><Slider label="Brightness" value={n(p,'bright',1.15)*100} min={50} max={300} step={1} onChange={v=>u('bright',v/100)}/><Slider label="Density" value={n(p,'density',60)} min={10} max={100} step={1} onChange={v=>u('density',v)}/><Slider label="Turbulence" value={n(p,'turbulence',40)} min={0} max={100} step={1} onChange={v=>u('turbulence',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}