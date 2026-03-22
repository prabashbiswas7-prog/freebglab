'use client'
import{Section,Slider,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Flow" open><Slider label="Noise Scale" value={n(p,'scale',3.2)*10} min={5} max={120} step={1} dec={1} onChange={v=>u('scale',v/10)}/><Slider label="Noise Intensity" value={n(p,'noiseInt',100)} min={0} max={100} step={1} onChange={v=>u('noiseInt',v)}/><Slider label="Octaves" value={n(p,'octaves',5)} min={1} max={8} step={1} onChange={v=>u('octaves',v)}/><Slider label="Contrast" value={n(p,'nContrast',1.3)*50} min={15} max={200} step={1} onChange={v=>u('nContrast',v/50)}/><Slider label="Curve Distortion" value={n(p,'curveDist',0)} min={0} max={100} step={1} onChange={v=>u('curveDist',v)}/><Slider label="Offset X" value={n(p,'offX',0)+200} min={0} max={400} step={1} onChange={v=>u('offX',v-200)}/><Slider label="Offset Y" value={n(p,'offY',0)+200} min={0} max={400} step={1} onChange={v=>u('offY',v-200)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}