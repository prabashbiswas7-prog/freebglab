'use client'
import { Section, Slider, Toggle, Select, ColorPicker, PaletteSection, Divider, n, b, s } from '@/components/ui/Controls'
import { PALETTES } from '@/lib/core/utils'
import type { ControlsProps } from '@/lib/core/types'

export function Controls({ params: p, onChange: u }: ControlsProps) {
  return (<>
    <PaletteSection colors={p.colors as string[]} onChange={c=>u('colors',c)} />
    <Section title="Shapes" open>
      <Select label="Shape" value={s(p,'shape','mixed')} options={[
        {v:'mixed',l:'Mixed'},{v:'sphere',l:'Sphere'},{v:'cube',l:'Cube'},
        {v:'hex',l:'Hexagon'},{v:'tri',l:'Triangle'},{v:'ring',l:'Ring'}
      ]} onChange={v=>u('shape',v)} />
      <Divider />
      <Slider label="Count"    value={n(p,'count',20)}      min={1}   max={120} step={1}   onChange={v=>u('count',v)} />
      <Divider />
      <Slider label="Min Size" value={n(p,'minSz',28)}      min={5}   max={400} step={5}   onChange={v=>u('minSz',v)} />
      <Slider label="Max Size" value={n(p,'maxSz',185)}     min={10}  max={800} step={5}   onChange={v=>u('maxSz',v)} />
      <Divider />
      <Slider label="Opacity"  value={n(p,'opacity',0.88)*100} min={5} max={100} step={1}  onChange={v=>u('opacity',v/100)} />
      <Toggle label="Glow"     value={b(p,'glow',true)}     onChange={v=>u('glow',v)} />
    </Section>
    <Section title="Background">
      <ColorPicker label="Background" value={p.bg as string||'#040414'} onChange={v=>u('bg',v)} />
    </Section>
    <Section title="Adjustments">
      <Slider label="Brightness" value={n(p,'brightness',100)} min={0}  max={200} step={1} onChange={v=>u('brightness',v)} />
      <Slider label="Contrast"   value={n(p,'contrast',100)}   min={50} max={200} step={1} onChange={v=>u('contrast',v)} />
      <Slider label="Saturation" value={n(p,'saturation',100)} min={0}  max={200} step={1} onChange={v=>u('saturation',v)} />
    </Section>
  </>)
}
