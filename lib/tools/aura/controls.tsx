'use client'
import{Section,Slider,ColorPicker,PaletteSection,n}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Aura" open><Slider label="Count" value={n(p,'count',4)} min={1} max={16} step={1} onChange={v=>u('count',v)}/><Slider label="Size %" value={n(p,'size',68)} min={10} max={100} step={1} onChange={v=>u('size',v)}/><Slider label="Softness" value={n(p,'softness',80)} min={10} max={100} step={1} onChange={v=>u('softness',v)}/><Slider label="Brightness" value={n(p,'brightness',75)} min={5} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Scatter" value={n(p,'scatter',85)} min={0} max={200} step={1} onChange={v=>u('scatter',v)}/></Section>
<Section title="Position"><Slider label="Center X" value={n(p,'cx',50)} min={0} max={100} step={0.5} onChange={v=>u('cx',v)}/><Slider label="Center Y" value={n(p,'cy',50)} min={0} max={100} step={0.5} onChange={v=>u('cy',v)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#04050d'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}