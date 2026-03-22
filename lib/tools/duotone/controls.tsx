'use client'
import{Section,Slider,ColorPicker,n}from '@/components/ui/Controls'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<Section title="Colours" open><ColorPicker label="Shadow" value={p.colorA as string||'#0a0025'} onChange={v=>u('colorA',v)}/><ColorPicker label="Highlight" value={p.colorB as string||'#ff6b9d'} onChange={v=>u('colorB',v)}/></Section>
<Section title="Flow" open><Slider label="Noise Scale" value={n(p,'noiseScale',3)} min={0.5} max={15} step={0.1} onChange={v=>u('noiseScale',v)}/><Slider label="Octaves" value={n(p,'noiseOct',4)} min={1} max={8} step={1} onChange={v=>u('noiseOct',v)}/><Slider label="Contrast" value={n(p,'duoContrast',1.2)*50} min={15} max={200} step={1} onChange={v=>u('duoContrast',v/50)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}