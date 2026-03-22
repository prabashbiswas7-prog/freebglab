'use client'
import{Section,Slider,AngleSlider,ColorPicker,n}from '@/components/ui/Controls'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<Section title="Zigzag" open><Slider label="Size" value={n(p,'size',30)} min={5} max={200} step={1} onChange={v=>u('size',v)}/><Slider label="Amplitude" value={n(p,'amplitude',15)} min={2} max={100} step={1} onChange={v=>u('amplitude',v)}/><Slider label="Stroke Width" value={n(p,'strokeWidth',2)*10} min={1} max={80} step={1} onChange={v=>u('strokeWidth',v/10)}/><Slider label="Opacity" value={n(p,'opacity',1)*100} min={5} max={100} step={1} onChange={v=>u('opacity',v/100)}/><AngleSlider label="Rotation" value={n(p,'angle',0)} onChange={v=>u('angle',v)}/></Section>
<Section title="Colours"><ColorPicker label="Foreground" value={p.fg as string||'#5b7cf6'} onChange={v=>u('fg',v)}/><ColorPicker label="Background" value={p.bg as string||'#0e0f11'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}