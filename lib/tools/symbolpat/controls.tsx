'use client'
import{Section,Slider,ColorPicker,AngleSlider,TextInput,n}from '@/components/ui/Controls'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<Section title="Symbol" open><TextInput label="Symbol / Emoji" value={p.symbol as string||'✦'} onChange={v=>u('symbol',v)}/><Slider label="Size" value={n(p,'fontSize',28)} min={8} max={200} step={1} onChange={v=>u('fontSize',v)}/><Slider label="Opacity" value={n(p,'opacity',0.2)*100} min={1} max={100} step={1} onChange={v=>u('opacity',v/100)}/><Slider label="Spacing" value={n(p,'spacing',40)} min={10} max={200} step={1} onChange={v=>u('spacing',v)}/><AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>u('angle',v)}/></Section>
<Section title="Colours"><ColorPicker label="Color" value={p.fg as string||'#5b7cf6'} onChange={v=>u('fg',v)}/><ColorPicker label="Background" value={p.bg as string||'#0e0f11'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}