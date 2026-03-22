'use client'
import { Section, Slider, Toggle, ColorPicker, Select, AngleSlider, Divider, n, b, s } from '@/components/ui/Controls'
import type { ControlsProps } from '@/lib/core/types'

const SHAPES = [
  { v: 'horizontal', l: 'Horizontal Lines' },
  { v: 'vertical',   l: 'Vertical Lines' },
  { v: 'diagonal',   l: 'Diagonal' },
  { v: 'radial',     l: 'Radial' },
  { v: 'concentric', l: 'Concentric' },
]

export function Controls({ params: p, onChange: u }: ControlsProps) {
  return (<>
    <Section title="Canvas" open>
      <Select label="Shape" value={s(p,'shape','horizontal')} options={SHAPES} onChange={v=>u('shape',v)} />
    </Section>

    <Section title="Shape" open>
      <Slider label="Frequency"  value={n(p,'freq',0.026)}    min={0.001} max={0.15}  step={0.001} dec={3} onChange={v=>u('freq',v)} />
      <Slider label="Amplitude"  value={n(p,'amplitude',68)}  min={0}     max={200}   step={1}     onChange={v=>u('amplitude',v)} />
      <Divider />
      <Slider label="Line Count" value={n(p,'lineCount',40)}  min={1}     max={200}   step={1}     onChange={v=>u('lineCount',v)} />
      <Slider label="Spacing"    value={n(p,'spacing',1.0)}   min={0.5}   max={10}    step={0.1}   onChange={v=>u('spacing',v)} />
      <Slider label="Padding"    value={n(p,'padding',50)}    min={0}     max={150}   step={1}     onChange={v=>u('padding',v)} />
      <Divider />
      <Slider label="Thickness"  value={n(p,'thickness',1.5)} min={0.2}   max={10}    step={0.1}   onChange={v=>u('thickness',v)} />
    </Section>

    <Section title="Background">
      <Toggle    label="Gradient"     value={b(p,'bgGradient',false)}      onChange={v=>u('bgGradient',v)} />
      <ColorPicker label="Background" value={s(p,'bg','#141414')}          onChange={v=>u('bg',v)} />
      {b(p,'bgGradient',false) && <ColorPicker label="Gradient End" value={s(p,'bgGradientColor','#000000')} onChange={v=>u('bgGradientColor',v)} />}
    </Section>

    <Section title="Line Color">
      <ColorPicker label="Color"    value={s(p,'lineColor','#ffffff')}  onChange={v=>u('lineColor',v)} />
      <Toggle      label="Gradient" value={b(p,'lineGradient',false)}   onChange={v=>u('lineGradient',v)} />
    </Section>

    <Section title="Organic Effects">
      <Slider label="Weight Var"  value={n(p,'weightVar',0)}    min={0} max={100} step={1} onChange={v=>u('weightVar',v)} />
      <Slider label="Wobble"      value={n(p,'wobble',0)}       min={0} max={50}  step={1} onChange={v=>u('wobble',v)} />
      <Slider label="Taper"       value={n(p,'taper',0)}        min={0} max={100} step={1} onChange={v=>u('taper',v)} />
      <Divider />
      <Toggle label="Line Breaks"   value={b(p,'lineBreaks',false)} onChange={v=>u('lineBreaks',v)} />
      <Toggle label="Morse Pattern" value={b(p,'morse',false)}     onChange={v=>u('morse',v)} />
    </Section>

    <Section title="Advanced Variations">
      <Slider label="Spacing Var"     value={n(p,'spacingVar',0)}  min={0} max={50}  step={1}   onChange={v=>u('spacingVar',v)} />
      <Slider label="Rotation Jitter" value={n(p,'rotJitter',0)}  min={0} max={10}  step={0.1} onChange={v=>u('rotJitter',v)} />
      <Divider />
      <Slider label="Opacity Var"     value={n(p,'opacityVar',0)}  min={0} max={50}  step={1}   onChange={v=>u('opacityVar',v)} />
      <Slider label="Color Drift"     value={n(p,'colorDrift',0)}  min={0} max={50}  step={1}   onChange={v=>u('colorDrift',v)} />
    </Section>

    <Section title="Flow">
      <Slider label="Perlin Flow" value={n(p,'perlinFlow',0)}   min={0} max={100} step={1} onChange={v=>u('perlinFlow',v)} />
      <Slider label="Freq Var"    value={n(p,'freqVar',0)}      min={0} max={100} step={1} onChange={v=>u('freqVar',v)} />
      <Slider label="Octaves"     value={n(p,'flowOctaves',1)}  min={1} max={5}   step={1} onChange={v=>u('flowOctaves',v)} />
    </Section>

    <Section title="Texture">
      <Slider label="Noise" value={n(p,'noise',0)} min={0} max={100} step={1} onChange={v=>u('noise',v)} />
    </Section>

    <Section title="Adjustments">
      <Slider label="Brightness" value={n(p,'brightness',100)} min={0}  max={200} step={1} onChange={v=>u('brightness',v)} />
      <Slider label="Contrast"   value={n(p,'contrast',100)}   min={50} max={200} step={1} onChange={v=>u('contrast',v)} />
      <Slider label="Saturation" value={n(p,'saturation',100)} min={0}  max={200} step={1} onChange={v=>u('saturation',v)} />
    </Section>
  </>)
}
