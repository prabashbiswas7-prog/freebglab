'use client'
import{Section,Slider,AngleSlider,ColorPicker,n}from '@/components/ui/Controls'
import type{ControlsProps}from '@/lib/core/types'
export function Controls({params:p,onChange:u}:ControlsProps){return(<>
<Section title="Image" open><Slider label="Scale" value={n(p,'scale',1)*100} min={5} max={1000} step={5} onChange={v=>u('scale',v/100)}/><AngleSlider label="Rotation" value={n(p,'rotation',0)} onChange={v=>u('rotation',v)}/><Slider label="Opacity" value={n(p,'opacity',1)*100} min={0} max={100} step={1} onChange={v=>u('opacity',v/100)}/><Slider label="Offset X" value={n(p,'offX',0)+500} min={0} max={1000} step={1} onChange={v=>u('offX',v-500)}/><Slider label="Offset Y" value={n(p,'offY',0)+500} min={0} max={1000} step={1} onChange={v=>u('offY',v-500)}/></Section>
<Section title="Background"><ColorPicker label="Background" value={p.bg as string||'#050810'} onChange={v=>u('bg',v)}/></Section>
<Section title="Adjustments"><Slider label="Brightness" value={n(p,'brightness',100)} min={0} max={200} step={1} onChange={v=>u('brightness',v)}/><Slider label="Contrast" value={n(p,'contrast',100)} min={50} max={200} step={1} onChange={v=>u('contrast',v)}/><Slider label="Saturation" value={n(p,'saturation',100)} min={0} max={200} step={1} onChange={v=>u('saturation',v)}/></Section>
</>)}