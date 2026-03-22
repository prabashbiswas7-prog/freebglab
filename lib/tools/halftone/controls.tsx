'use client'
import{Section,Slider,AngleSlider,ColorPicker,n}from '@/components/ui/Controls'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<Section title="Pattern" open><Slider label="Size" value={n(p,'size',16)} min={2} max={80} step={1} onChange={v=>u('size',v)}/><AngleSlider label="Screen Angle" value={n(p,'angle',45)} onChange={v=>u('angle',v)}/><Slider label="Gamma" value={n(p,'gamma',1.3)*50} min={15} max={200} step={1} onChange={v=>u('gamma',v/50)}/></Section>
<Section title="Colours"><ColorPicker label="Background" value={p.bg as string||'#050810'} onChange={v=>u('bg',v)}/><ColorPicker label="Dot Color" value={p.dotCol as string||'#e0e4f0'} onChange={v=>u('dotCol',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}