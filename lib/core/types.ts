// ─── Every tool has a slug used in URLs ────────────────────────
export type ToolSlug =
  | 'mesh' | 'linear' | 'conic' | 'aura' | 'duotone'
  | 'blobs' | 'waves' | 'fluid' | 'bokeh' | 'starburst'
  | 'perlin' | 'marble' | 'smoke' | 'dither'
  | 'grid' | 'hex' | 'crosshatch' | 'plotter' | 'shapes'
  | 'dots' | 'halftone' | 'blocks' | 'topo' | 'voronoi'
  | 'upload'
  | 'chevron' | 'diamonds' | 'triangles' | 'zigzag' | 'circles'
  | 'textpat' | 'symbolpat'

export type ToolCategory =
  | 'Gradient' | 'Organic' | 'Noise & Texture'
  | 'Lines & Geometry' | 'Blocks & Pattern'
  | 'SVG Patterns' | 'Typography' | 'Custom'

// ─── Tool metadata (name, category, etc.) ──────────────────────
export interface ToolMeta {
  slug: ToolSlug
  name: string
  description: string
  category: ToolCategory
  isNew?: boolean
}

// ─── Params: key-value store for all tool settings ─────────────
// Using Record<string, unknown> so every tool can have its own params
// without needing a different type per tool
export type Params = Record<string, unknown>

// ─── A single draw function signature ──────────────────────────
export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  p: Params
) => void

// ─── A complete tool module ─────────────────────────────────────
export interface ToolModule {
  meta: ToolMeta
  defaultParams: () => Params   // function so seed is fresh each time
  draw: DrawFn
  Controls: React.ComponentType<ControlsProps>
}

// ─── Props passed to every tool's Controls component ───────────
export interface ControlsProps {
  params: Params
  onChange: (key: string, value: unknown) => void
}

// ─── Post-processing effects ────────────────────────────────────
export interface Effects {
  blendMode:          string
  blendOpacity:       number
  watercolor:         boolean
  watercolorStrength: number
  crt:                boolean
  crtScanlines:       number
  crtCurvature:       number
  vhs:                boolean
  vhsGlitch:          number
  chromaticAb:        boolean
  chromaticStrength:  number
  pixelate:           boolean
  pixelateSize:       number
  halftoneOverlay:    boolean
  halftoneSize:       number
  halftoneAngle:      number
}

// ─── History entry for undo/redo ────────────────────────────────
export interface HistEntry {
  tool:   ToolSlug
  params: Params
}
