'use client'
import{Section,Slider,ColorPicker,PaletteSection,Toggle,n,b}from '@/components/ui/Controls'
import{PALETTES}from '@/lib/core/utils'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)}/>
<Section title="Waves" open><Slider label="Layers" value={n(p,'count',6)} min={2} max={20} step={1} onChange={v=>u('count',v)}/><Slider label="Amplitude" value={n(p,'amp',38)} min={1} max={100} step={1} onChange={v=>u('amp',v)}/><Slider label="Frequency" value={n(p,'freq',2.2)*10} min={1} max={100} step={1} dec={1} onChange={v=>u('freq',v/10)}/><Slider label="Phase°" value={n(p,'phase',0)} min={0} max={360} step={1} onChange={v=>u('phase',v)}/><Slider label="Curve Mix" value={n(p,'curve',1)*50} min={0} max={100} step={1} onChange={v=>u('curve',v/50)}/><Slider label="Warp" value={n(p,'waveWarp',0)} min={0} max={100} step={1} onChange={v=>u('waveWarp',v)}/><Slider label="Opacity" value={n(p,'opacity',1)*100} min={10} max={100} step={1} onChange={v=>u('opacity',v/100)}/><Slider label="Line Width" value={n(p,'lineWidth',0)} min={0} max={10} step={0.5} onChange={v=>u('lineWidth',v)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#080616'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}