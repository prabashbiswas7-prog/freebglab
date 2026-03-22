'use client'
import{Section,Slider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Dither" open><Slider label="Noise Scale" value={n(p,'scale',3)*10} min={5} max={80} step={1} onChange={v=>u('scale',v/10)}/><Slider label="Octaves" value={n(p,'octaves',4)} min={1} max={8} step={1} onChange={v=>u('octaves',v)}/><Slider label="Contrast" value={n(p,'ditherContrast',1.4)*50} min={15} max={200} step={1} onChange={v=>u('ditherContrast',v/50)}/><Slider label="Dither Size" value={n(p,'ditherSize',2)} min={1} max={12} step={1} onChange={v=>u('ditherSize',v)}/><Slider label="Threshold" value={n(p,'threshold',50)} min={0} max={100} step={1} onChange={v=>u('threshold',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}