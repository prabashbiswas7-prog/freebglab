import type { ToolMeta, ToolModule, ToolSlug, DrawFn, ControlsProps } from '@/lib/core/types'

// ── Tool metadata ──────────────────────────────────────────────
export const TOOLS: ToolMeta[] = [
  { slug: 'mesh',      name: 'Mesh Gradient',    description: 'Organic multi-point radial gradients',   category: 'Gradient' },
  { slug: 'linear',    name: 'Linear Gradient',  description: 'Classic directional colour fade',         category: 'Gradient' },
  { slug: 'conic',     name: 'Conic Sweep',      description: 'Rotating colour wheel gradient',          category: 'Gradient' },
  { slug: 'aura',      name: 'Light Aura',       description: 'Glowing ambient light blobs',             category: 'Gradient' },
  { slug: 'duotone',   name: 'Duotone',          description: 'Two-colour noise mapping',                category: 'Gradient' },
  { slug: 'blobs',     name: 'Blobs',            description: 'Organic fluid blob shapes',               category: 'Organic' },
  { slug: 'waves',     name: 'Waves',            description: 'Layered sinusoidal wave bands',           category: 'Organic' },
  { slug: 'fluid',     name: 'Fluid',            description: 'Warped domain noise flow',                category: 'Organic' },
  { slug: 'bokeh',     name: 'Bokeh',            description: 'Out-of-focus light circles',              category: 'Organic' },
  { slug: 'starburst', name: 'Starburst',        description: 'Radiating ray light burst',               category: 'Organic' },
  { slug: 'perlin',    name: 'Perlin Noise',     description: 'Classic layered noise texture',           category: 'Noise & Texture' },
  { slug: 'marble',    name: 'Marble',           description: 'Turbulent marble vein patterns',          category: 'Noise & Texture' },
  { slug: 'smoke',     name: 'Smoke',            description: 'Atmospheric smoke and fog',               category: 'Noise & Texture' },
  { slug: 'dither',    name: 'Dither',           description: 'Ordered Bayer dithering effect',          category: 'Noise & Texture' },
  { slug: 'grid',      name: 'Grid',             description: 'Clean perspective grid lines',            category: 'Lines & Geometry' },
  { slug: 'hex',       name: 'Hex Grid',         description: 'Hexagonal cell grid pattern',             category: 'Lines & Geometry' },
  { slug: 'crosshatch',name: 'Crosshatch',       description: 'Multi-angle crosshatching',               category: 'Lines & Geometry' },
  { slug: 'plotter',   name: 'Lines',            description: 'Generative plotter-style line art',       category: 'Lines & Geometry' },
  { slug: 'shapes',    name: '3D Shapes',        description: 'Glowing geometric 3D forms',              category: 'Blocks & Pattern' },
  { slug: 'dots',      name: 'Dot Matrix',       description: 'Dot grid with noise modulation',          category: 'Blocks & Pattern' },
  { slug: 'halftone',  name: 'Halftone',         description: 'Print halftone dot screen',               category: 'Blocks & Pattern' },
  { slug: 'blocks',    name: 'Blocks',           description: 'Noise-coloured rectangular tiles',        category: 'Blocks & Pattern' },
  { slug: 'topo',      name: 'Topography',       description: 'Contour map elevation lines',             category: 'Blocks & Pattern' },
  { slug: 'voronoi',   name: 'Voronoi',          description: 'Voronoi cell diagram',                    category: 'Blocks & Pattern' },
  { slug: 'chevron',   name: 'Chevron',          description: 'Repeating chevron V-pattern',             category: 'SVG Patterns' },
  { slug: 'diamonds',  name: 'Diamonds',         description: 'Diamond grid pattern',                    category: 'SVG Patterns' },
  { slug: 'triangles', name: 'Triangles',        description: 'Triangular tessellation',                 category: 'SVG Patterns' },
  { slug: 'zigzag',    name: 'Zigzag',           description: 'Repeating zigzag lines',                  category: 'SVG Patterns' },
  { slug: 'circles',   name: 'Circles',          description: 'Circle grid pattern',                     category: 'SVG Patterns' },
  { slug: 'textpat',   name: 'Text Pattern',     description: 'Repeating text tile pattern',             category: 'Typography' },
  { slug: 'symbolpat', name: 'Symbol Pattern',   description: 'Repeating symbol or emoji tile',          category: 'Typography' },
  { slug: 'upload',    name: 'Custom Tile',      description: 'Upload and tile your own image',          category: 'Custom' },
]

export function getToolMeta(slug: ToolSlug): ToolMeta | undefined {
  return TOOLS.find(t => t.slug === slug)
}

export function getAllSlugs(): ToolSlug[] {
  return TOOLS.map(t => t.slug)
}

export function getToolsByCategory(): Record<string, ToolMeta[]> {
  return TOOLS.reduce((acc, t) => {
    acc[t.category] = acc[t.category] || []
    acc[t.category].push(t)
    return acc
  }, {} as Record<string, ToolMeta[]>)
}
