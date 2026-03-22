// ── STATIC IMPORT MAP ─────────────────────────────────────────
// Dynamic template literal imports break in Next.js static export.
// This explicit map guarantees all modules are included in the bundle.

import type { Params } from '@/lib/core/types'

type DrawFn = (ctx: CanvasRenderingContext2D, w: number, h: number, p: Params) => void
type DefaultParamsFn = () => Params
type ControlsComponent = React.ComponentType<{ params: Params; onChange: (k: string, v: unknown) => void }>

// ── Draw functions ────────────────────────────────────────────
import { draw as drawMesh }       from './mesh/draw'
import { draw as drawLinear }     from './linear/draw'
import { draw as drawConic }      from './conic/draw'
import { draw as drawAura }       from './aura/draw'
import { draw as drawDuotone }    from './duotone/draw'
import { draw as drawBlobs }      from './blobs/draw'
import { draw as drawWaves }      from './waves/draw'
import { draw as drawFluid }      from './fluid/draw'
import { draw as drawBokeh }      from './bokeh/draw'
import { draw as drawStarburst }  from './starburst/draw'
import { draw as drawPerlin }     from './perlin/draw'
import { draw as drawMarble }     from './marble/draw'
import { draw as drawSmoke }      from './smoke/draw'
import { draw as drawDither }     from './dither/draw'
import { draw as drawGrid }       from './grid/draw'
import { draw as drawHex }        from './hex/draw'
import { draw as drawCrosshatch } from './crosshatch/draw'
import { draw as drawPlotter }    from './plotter/draw'
import { draw as drawShapes }     from './shapes/draw'
import { draw as drawDots }       from './dots/draw'
import { draw as drawHalftone }   from './halftone/draw'
import { draw as drawBlocks }     from './blocks/draw'
import { draw as drawTopo }       from './topo/draw'
import { draw as drawVoronoi }    from './voronoi/draw'
import { draw as drawUpload }     from './upload/draw'
import { draw as drawChevron }    from './chevron/draw'
import { draw as drawDiamonds }   from './diamonds/draw'
import { draw as drawTriangles }  from './triangles/draw'
import { draw as drawZigzag }     from './zigzag/draw'
import { draw as drawCircles }    from './circles/draw'
import { draw as drawTextpat }    from './textpat/draw'
import { draw as drawSymbolpat }  from './symbolpat/draw'

// ── Default params ────────────────────────────────────────────
import { defaultParams as paramsMesh }       from './mesh/params'
import { defaultParams as paramsLinear }     from './linear/params'
import { defaultParams as paramsConic }      from './conic/params'
import { defaultParams as paramsAura }       from './aura/params'
import { defaultParams as paramsDuotone }    from './duotone/params'
import { defaultParams as paramsBlobs }      from './blobs/params'
import { defaultParams as paramsWaves }      from './waves/params'
import { defaultParams as paramsFluid }      from './fluid/params'
import { defaultParams as paramsBokeh }      from './bokeh/params'
import { defaultParams as paramsStarburst }  from './starburst/params'
import { defaultParams as paramsPerlin }     from './perlin/params'
import { defaultParams as paramsMarble }     from './marble/params'
import { defaultParams as paramsSmoke }      from './smoke/params'
import { defaultParams as paramsDither }     from './dither/params'
import { defaultParams as paramsGrid }       from './grid/params'
import { defaultParams as paramsHex }        from './hex/params'
import { defaultParams as paramsCrosshatch } from './crosshatch/params'
import { defaultParams as paramsPlotter }    from './plotter/params'
import { defaultParams as paramsShapes }     from './shapes/params'
import { defaultParams as paramsDots }       from './dots/params'
import { defaultParams as paramsHalftone }   from './halftone/params'
import { defaultParams as paramsBlocks }     from './blocks/params'
import { defaultParams as paramsTopo }       from './topo/params'
import { defaultParams as paramsVoronoi }    from './voronoi/params'
import { defaultParams as paramsUpload }     from './upload/params'
import { defaultParams as paramsChevron }    from './chevron/params'
import { defaultParams as paramsDiamonds }   from './diamonds/params'
import { defaultParams as paramsTriangles }  from './triangles/params'
import { defaultParams as paramsZigzag }     from './zigzag/params'
import { defaultParams as paramsCircles }    from './circles/params'
import { defaultParams as paramsTextpat }    from './textpat/params'
import { defaultParams as paramsSymbolpat }  from './symbolpat/params'

// ── Controls ──────────────────────────────────────────────────
import { Controls as ControlsMesh }       from './mesh/controls'
import { Controls as ControlsLinear }     from './linear/controls'
import { Controls as ControlsConic }      from './conic/controls'
import { Controls as ControlsAura }       from './aura/controls'
import { Controls as ControlsDuotone }    from './duotone/controls'
import { Controls as ControlsBlobs }      from './blobs/controls'
import { Controls as ControlsWaves }      from './waves/controls'
import { Controls as ControlsFluid }      from './fluid/controls'
import { Controls as ControlsBokeh }      from './bokeh/controls'
import { Controls as ControlsStarburst }  from './starburst/controls'
import { Controls as ControlsPerlin }     from './perlin/controls'
import { Controls as ControlsMarble }     from './marble/controls'
import { Controls as ControlsSmoke }      from './smoke/controls'
import { Controls as ControlsDither }     from './dither/controls'
import { Controls as ControlsGrid }       from './grid/controls'
import { Controls as ControlsHex }        from './hex/controls'
import { Controls as ControlsCrosshatch } from './crosshatch/controls'
import { Controls as ControlsPlotter }    from './plotter/controls'
import { Controls as ControlsShapes }     from './shapes/controls'
import { Controls as ControlsDots }       from './dots/controls'
import { Controls as ControlsHalftone }   from './halftone/controls'
import { Controls as ControlsBlocks }     from './blocks/controls'
import { Controls as ControlsTopo }       from './topo/controls'
import { Controls as ControlsVoronoi }    from './voronoi/controls'
import { Controls as ControlsUpload }     from './upload/controls'
import { Controls as ControlsChevron }    from './chevron/controls'
import { Controls as ControlsDiamonds }   from './diamonds/controls'
import { Controls as ControlsTriangles }  from './triangles/controls'
import { Controls as ControlsZigzag }     from './zigzag/controls'
import { Controls as ControlsCircles }    from './circles/controls'
import { Controls as ControlsTextpat }    from './textpat/controls'
import { Controls as ControlsSymbolpat }  from './symbolpat/controls'

// ── Lookup maps ───────────────────────────────────────────────
export const DRAW_MAP: Record<string, DrawFn> = {
  mesh: drawMesh, linear: drawLinear, conic: drawConic,
  aura: drawAura, duotone: drawDuotone, blobs: drawBlobs,
  waves: drawWaves, fluid: drawFluid, bokeh: drawBokeh,
  starburst: drawStarburst, perlin: drawPerlin, marble: drawMarble,
  smoke: drawSmoke, dither: drawDither, grid: drawGrid,
  hex: drawHex, crosshatch: drawCrosshatch, plotter: drawPlotter,
  shapes: drawShapes, dots: drawDots, halftone: drawHalftone,
  blocks: drawBlocks, topo: drawTopo, voronoi: drawVoronoi,
  upload: drawUpload, chevron: drawChevron, diamonds: drawDiamonds,
  triangles: drawTriangles, zigzag: drawZigzag, circles: drawCircles,
  textpat: drawTextpat, symbolpat: drawSymbolpat,
}

export const PARAMS_MAP: Record<string, DefaultParamsFn> = {
  mesh: paramsMesh, linear: paramsLinear, conic: paramsConic,
  aura: paramsAura, duotone: paramsDuotone, blobs: paramsBlobs,
  waves: paramsWaves, fluid: paramsFluid, bokeh: paramsBokeh,
  starburst: paramsStarburst, perlin: paramsPerlin, marble: paramsMarble,
  smoke: paramsSmoke, dither: paramsDither, grid: paramsGrid,
  hex: paramsHex, crosshatch: paramsCrosshatch, plotter: paramsPlotter,
  shapes: paramsShapes, dots: paramsDots, halftone: paramsHalftone,
  blocks: paramsBlocks, topo: paramsTopo, voronoi: paramsVoronoi,
  upload: paramsUpload, chevron: paramsChevron, diamonds: paramsDiamonds,
  triangles: paramsTriangles, zigzag: paramsZigzag, circles: paramsCircles,
  textpat: paramsTextpat, symbolpat: paramsSymbolpat,
}

export const CONTROLS_MAP: Record<string, ControlsComponent> = {
  mesh: ControlsMesh, linear: ControlsLinear, conic: ControlsConic,
  aura: ControlsAura, duotone: ControlsDuotone, blobs: ControlsBlobs,
  waves: ControlsWaves, fluid: ControlsFluid, bokeh: ControlsBokeh,
  starburst: ControlsStarburst, perlin: ControlsPerlin, marble: ControlsMarble,
  smoke: ControlsSmoke, dither: ControlsDither, grid: ControlsGrid,
  hex: ControlsHex, crosshatch: ControlsCrosshatch, plotter: ControlsPlotter,
  shapes: ControlsShapes, dots: ControlsDots, halftone: ControlsHalftone,
  blocks: ControlsBlocks, topo: ControlsTopo, voronoi: ControlsVoronoi,
  upload: ControlsUpload, chevron: ControlsChevron, diamonds: ControlsDiamonds,
  triangles: ControlsTriangles, zigzag: ControlsZigzag, circles: ControlsCircles,
  textpat: ControlsTextpat, symbolpat: ControlsSymbolpat,
}

export function getDrawFn(slug: string): DrawFn {
  const fn = DRAW_MAP[slug]
  if (!fn) throw new Error(`No draw function for tool: ${slug}`)
  return fn
}

export function getDefaultParams(slug: string): Params {
  const fn = PARAMS_MAP[slug]
  if (!fn) throw new Error(`No params for tool: ${slug}`)
  return fn()
}

export function getControls(slug: string): ControlsComponent | null {
  return CONTROLS_MAP[slug] || null
}
