// Shared toolkit for the industry scenes.
//
// A scene is built ONCE as a list of "items" (geometry + two render closures). `renderScene(mode, def)`
// then draws the same items either as an opaque studio illustration ('clean') or as the dark AI-scan
// plate ('ai'). Nothing is re-positioned or re-randomised between modes, so the two images align to the
// pixel by construction.
import * as E from '../engine.mjs'

export { E }
export const { clamp, lerp, smooth, hex, toHex, mix, pchip, rng } = E
export const W = 1200
export const H = 900
export const LUMEN = E.PALETTE.lumen
export const PAL = E.PALETTE

export const r1 = (v) => Math.round(v * 10) / 10
export const luma = (c) => (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255
export const range = (a, b, n) => Array.from({ length: n + 1 }, (_, k) => a + ((b - a) * k) / n)
const sub = E.sub3
const dot = E.dot3
const cross = E.cross3
const norm = E.norm3
const addv = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mulv = (a, k) => [a[0] * k, a[1] * k, a[2] * k]

// ---------------------------------------------------------------------------------------------
// render context (unique ids + shared <defs>)
// ---------------------------------------------------------------------------------------------
export function makeCtx(mode) {
  const defs = []
  let n = 0
  const blurs = new Map()
  const ctx = {
    mode,
    clean: mode === 'clean',
    ai: mode !== 'clean',
    uid: (p = 'i') => `${p}${++n}`,
    def: (x) => defs.push(x),
    blur(std) {
      const key = String(std)
      if (!blurs.has(key)) {
        const id = 'bl' + key.replace('.', '_')
        blurs.set(key, id)
        defs.push(
          `<filter id="${id}" filterUnits="userSpaceOnUse" x="-200" y="-200" width="${W + 400}" height="${H + 400}" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${std}"/></filter>`,
        )
      }
      return `url(#${blurs.get(key)})`
    },
    blurBox(std) {
      const key = 'bb' + String(std)
      if (!blurs.has(key)) {
        const id = key.replace('.', '_')
        blurs.set(key, id)
        defs.push(`<filter id="${id}" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${std}"/></filter>`)
      }
      return `url(#${blurs.get(key)})`
    },
    defsXml: () => defs.join(''),
  }
  return ctx
}

// ---------------------------------------------------------------------------------------------
// materials
// ---------------------------------------------------------------------------------------------
/** Build a satin-style material from a base colour. */
export function fabric(base, o = {}) {
  const b = hex(base)
  const { depth = 0.2, lift = 1, spec = 0.45, gloss = 26, rim = 0.32, fill = 0.12, specTint = 0.72, rimTint = 0.5, cool = 0 } = o
  const dark = [b[0] * depth * (1 - cool), b[1] * depth, b[2] * depth * (1 + cool * 0.6)]
  return {
    shadow: dark,
    mid: [Math.min(255, b[0] * lift), Math.min(255, b[1] * lift), Math.min(255, b[2] * lift)],
    spec,
    gloss,
    specCol: mix(b, [255, 255, 255], specTint),
    rim,
    rimCol: mix(b, [255, 255, 255], rimTint),
    fill,
  }
}
export const matte = (base, o = {}) => fabric(base, { spec: 0.06, gloss: 8, rim: 0.2, fill: 0.34, depth: 0.42, ...o })
export const satin = (base, o = {}) => fabric(base, { spec: 0.62, gloss: 30, rim: 0.42, fill: 0.08, depth: 0.16, ...o })
export const velvet = (base, o = {}) => fabric(base, { spec: 0.04, gloss: 6, rim: 0.7, fill: 0.2, depth: 0.3, rimTint: 0.55, ...o })
export const acetate = (base, o = {}) => fabric(base, { spec: 1.0, gloss: 90, rim: 0.5, fill: 0.18, depth: 0.22, specTint: 0.9, rimTint: 0.55, ...o })
export const metalMat = (base, o = {}) => fabric(base, { spec: 0.95, gloss: 55, rim: 0.55, fill: 0.2, depth: 0.28, specTint: 0.85, rimTint: 0.65, ...o })
export const BRASS = { ...E.MATERIALS.metal }
export const CHROME = {
  shadow: hex('#2b2d31'),
  mid: hex('#d9dce0'),
  spec: 1,
  gloss: 70,
  specCol: hex('#ffffff'),
  rim: 0.6,
  rimCol: hex('#f4f7ff'),
  fill: 0.3,
}

// AI tones: colour mapping from a neutral shaded luma into the dark glassy palette
export const TONES = {
  dark: (c) => mix(hex('#060708'), hex('#1f2429'), Math.pow(clamp(luma(c) * 1.6, 0, 1), 1.1)),
  deep: (c) => mix(hex('#050607'), hex('#151a1e'), Math.pow(clamp(luma(c) * 1.5, 0, 1), 1.1)),
  form: (c) => mix(hex('#101114'), hex('#66707a'), Math.pow(clamp(luma(c), 0, 1), 1.15)),
  glass: (c) => mix(hex('#090c0e'), hex('#33404a'), Math.pow(clamp(luma(c) * 1.3, 0, 1), 1.2)),
  steel: (c) => mix(hex('#0d0f11'), hex('#7b868f'), Math.pow(clamp(luma(c), 0, 1), 1.1)),
  gold: (c) => mix(hex('#2a3010'), hex('#e9ff9a'), clamp(luma(c) * 1.1, 0, 1)),
}
const TONE_MAT = {
  dark: E.MATERIALS.satin,
  deep: E.MATERIALS.satin,
  form: E.MATERIALS.form,
  glass: E.MATERIALS.satin,
  steel: E.MATERIALS.form,
  gold: E.MATERIALS.metal,
}

// ---------------------------------------------------------------------------------------------
// meshes
// ---------------------------------------------------------------------------------------------
/**
 * General parametric mesh. S(i, j) -> [x, y, z] for i, j in [0,1]. Screen space: x right, y down,
 * z toward the viewer. Projected point is [x, y + tilt*z] (camera looks slightly down).
 * i runs along "rows" (horizontal, across), j runs down "cols" (vertical, along).
 */
export function makeMesh(S, o = {}) {
  const { rows = 40, cols = 40, tilt = 0.2, ao, zBias = 0 } = o
  const S3 = (i, j) => {
    const s = S(i, j)
    return [s[0], -s[1], s[2]]
  }
  const P = (i, j) => {
    const s = S(i, j)
    return [s[0], s[1] + tilt * s[2]]
  }
  const ei = 0.5 / cols
  const ej = 0.5 / rows
  const VIEW = norm([0, tilt * 0.9, 1])
  function normalAt(i, j) {
    const tI = sub(S3(i + ei, j), S3(i - ei, j))
    const tJ = sub(S3(i, j + ej), S3(i, j - ej))
    let n = norm(cross(tI, tJ))
    if (dot(n, VIEW) < 0) n = [-n[0], -n[1], -n[2]]
    return n
  }
  let cache = null
  function quads() {
    if (cache) return cache
    const G = []
    for (let j = 0; j <= rows; j++) {
      const row = []
      for (let i = 0; i <= cols; i++) row.push(P(i / cols, j / rows))
      G.push(row)
    }
    const out = []
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const im = (i + 0.5) / cols
        const jm = (j + 0.5) / rows
        out.push({
          pts: [G[j][i], G[j][i + 1], G[j + 1][i + 1], G[j + 1][i]],
          n: normalAt(im, jm),
          ao: ao ? ao(im, jm) : 1,
          z: S(im, jm)[2] + zBias,
          i,
          j,
          u: im,
          v: jm,
        })
      }
    }
    cache = out
    return out
  }
  const rowLine = (j, steps = 80) => range(0, 1, steps).map((i) => P(i, j))
  const colLine = (i, steps = 80) => range(0, 1, steps).map((j) => P(i, j))
  const outline = () => [...rowLine(0, 40), ...colLine(1, 40).slice(1), ...rowLine(1, 40).reverse().slice(1), ...colLine(0, 40).reverse().slice(1)]
  return { kind: 'mesh', S, P, P3: S3, quads, rowLine, colLine, outline, pt: P, normalAt, rows, cols, tilt }
}

/** Wrap an engine surface-of-revolution in the same interface. */
export function sorMesh(cfg) {
  const m = E.makeSOR(cfg)
  const { y0, y1, th0 = 0, th1 = Math.PI } = cfg
  let cache = null
  return {
    kind: 'sor',
    cfg,
    P: (i, j) => m.P(y0 + (y1 - y0) * j, th0 + (th1 - th0) * i),
    pt: (i, j) => m.P(y0 + (y1 - y0) * j, th0 + (th1 - th0) * i),
    quads: () => (cache ||= m.quads()),
    rowLine: (j, steps = 80) => m.ring(y0 + (y1 - y0) * j, steps),
    colLine: (i, steps = 80) => m.meridian(th0 + (th1 - th0) * i, steps),
    ringY: (y, steps = 80) => m.ring(y, steps),
    outline: () => m.silhouette(),
    jOf: (y) => (y - y0) / (y1 - y0),
    yOf: (j) => y0 + (y1 - y0) * j,
    sor: m,
  }
}

/** Tube along a 3D curve C(t) -> [x,y,z] (screen space), radius number or r(t). Front half by default. */
export function tubeMesh(C, rad, o = {}) {
  const { rows = 60, cols = 10, phi0 = -Math.PI / 2, phi1 = Math.PI / 2, tilt = 0.2 } = o
  const S = (i, j) => {
    const e = 1e-3
    const c = C(j)
    const T = norm(sub(C(Math.min(1, j + e)), C(Math.max(0, j - e))))
    let B = sub([0, 0, 1], mulv(T, T[2]))
    if (Math.hypot(B[0], B[1], B[2]) < 1e-3) B = [1, 0, 0]
    B = norm(B)
    const N = cross(T, B)
    const phi = phi0 + (phi1 - phi0) * i
    const r = typeof rad === 'function' ? rad(j) : rad
    return addv(c, addv(mulv(B, r * Math.cos(phi)), mulv(N, r * Math.sin(phi))))
  }
  return makeMesh(S, { rows, cols, tilt })
}

/** Sample a polyline/curve function into a closed path d string. */
export const poly = (pts, close = true) => E.path(pts, close)

// ---------------------------------------------------------------------------------------------
// svg helpers
// ---------------------------------------------------------------------------------------------
export function line(pts, stroke, w, op = 1, extra = '') {
  return `<path d="${E.path(pts)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`
}
export const ell = (cx, cy, rx, ry, fill, extra = '') => `<ellipse cx="${r1(cx)}" cy="${r1(cy)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${fill}"${extra}/>`

/** Three-layer soft contact shadow, like the gown reference. */
export function groundShadow(ctx, cx, cy, rx, ry, k = 1) {
  return (
    ell(cx + 10, cy + ry * 0.55, rx * 1.18, ry * 1.5, '#0d0d0c', ` opacity="${0.26 * k}" filter="${ctx.blur(ry * 0.7)}"`) +
    ell(cx + 6, cy + ry * 0.2, rx * 1.04, ry * 0.95, '#0d0d0c', ` opacity="${0.38 * k}" filter="${ctx.blur(ry * 0.34)}"`) +
    ell(cx, cy, rx * 0.97, ry * 0.5, '#0d0d0c', ` opacity="${0.36 * k}" filter="${ctx.blur(ry * 0.12 + 2)}"`)
  )
}

/** Surface-following decoration: matrix mapping the unit square onto the mesh param cell. */
export function cellMatrix(mesh, i0, i1, j0, j1) {
  const a = mesh.pt(i0, j0)
  const b = mesh.pt(i1, j0)
  const d = mesh.pt(i0, j1)
  const ex = [b[0] - a[0], b[1] - a[1]]
  const ey = [d[0] - a[0], d[1] - a[1]]
  return { m: `matrix(${r1(ex[0] * 100) / 100} ${r1(ex[1] * 100) / 100} ${r1(ey[0] * 100) / 100} ${r1(ey[1] * 100) / 100} ${r1(a[0] * 10) / 10} ${r1(a[1] * 10) / 10})`, w: Math.hypot(ex[0], ex[1]), h: Math.hypot(ey[0], ey[1]), det: ex[0] * ey[1] - ex[1] * ey[0] }
}
export function motif(mesh, i0, i1, j0, j1, tile, { minW = 1.2, px = 1.2, attrs = '' } = {}) {
  const c = cellMatrix(mesh, i0, i1, j0, j1)
  if (c.w < minW) return ''
  // tile can be a function of the stroke width expressed in unit-square coordinates
  const sw = px / Math.max(2, (c.w + c.h) / 2)
  const svg = typeof tile === 'function' ? tile(sw) : tile
  return `<g transform="${c.m}"${attrs}>${svg}</g>`
}

// compact quad emitter: relative-coordinate paths, shared stroke attributes
const q10 = (v) => Math.round(v * 10)
const fmtT = (n) => {
  const a = Math.abs(n)
  const ip = Math.floor(a / 10)
  const fp = a % 10
  const s = fp === 0 ? String(ip) : ip === 0 ? '.' + fp : ip + '.' + fp
  return n < 0 ? '-' + s : s
}
function quadPath(pts) {
  let px = q10(pts[0][0])
  let py = q10(pts[0][1])
  let s = 'M' + fmtT(px) + ' ' + fmtT(py) + 'l'
  for (let k = 1; k < 4; k++) {
    const x = q10(pts[k][0])
    const y = q10(pts[k][1])
    const a = fmtT(x - px)
    const b = fmtT(y - py)
    s += (a[0] === '-' || s.endsWith('l') ? '' : ' ') + a + (b[0] === '-' ? '' : ' ') + b
    px = x
    py = y
  }
  return s + 'z'
}
export function emitQuads(quads, mat, { colour, seam = 1.6, dim = 1, sort = true } = {}) {
  const list = sort ? [...quads].sort((a, b) => a.z - b.z) : quads
  const out = []
  for (const q of list) {
    let c = E.shade(q.n, mat, q.ao * dim)
    if (colour) c = colour(c, q)
    const h = E.toHex(c)
    out.push('<path d="' + quadPath(q.pts) + '" fill="' + h + '" stroke="' + h + '"/>')
  }
  return '<g stroke-width="' + seam + '" stroke-linejoin="round">' + out.join('') + '</g>'
}

// ---------------------------------------------------------------------------------------------
// item builders
// ---------------------------------------------------------------------------------------------
/**
 * Shaded mesh item. `ai` controls the dark scan rendering: tone, wires (iso lines), hot lines, glow.
 */
export function solid(mesh, o = {}) {
  const { mat = E.MATERIALS.satin, colour, dim = 1, seam = 1.6, sort = true, opacity = 1, scan = true, after, aiAfter } = o
  const ai = { tone: 'dark', rows: [], cols: [], rowW: 1.2, colW: 1.1, rowOp: 0.4, colOp: 0.3, hotW: 2.6, hotOp: 0.95, rowSteps: 120, colSteps: 90, glow: true, hot: [], outline: 0, dim: 1, ...(o.ai || {}) }
  return {
    mesh,
    scan,
    sil: () => E.path(mesh.outline(), true),
    clean(ctx) {
      const s = emitQuads(mesh.quads(), mat, { colour, dim, seam, sort })
      const body = opacity < 1 ? `<g opacity="${opacity}">${s}</g>` : s
      return body + (after ? after(ctx) : '')
    },
    ai(ctx) {
      const parts = []
      const mAi = ai.mat || TONE_MAT[ai.tone]
      const toneFn = TONES[ai.tone]
      const col = ai.colour ? (c, q) => ai.colour(toneFn(c), q) : toneFn
      const fillSvg = emitQuads(mesh.quads(), mAi, { colour: col, seam, sort, dim: ai.dim })
      parts.push(ai.opacity != null && ai.opacity < 1 ? `<g opacity="${ai.opacity}">${fillSvg}</g>` : fillSvg)
      const wire = []
      const glow = []
      for (const j of ai.rows) wire.push(line(mesh.rowLine(j, ai.rowSteps), LUMEN, ai.rowW, ai.rowOp))
      for (const i of ai.cols) wire.push(line(mesh.colLine(i, ai.colSteps), LUMEN, ai.colW, ai.colOp))
      for (const h of ai.hot) {
        const pts = h.row != null ? mesh.rowLine(h.row, ai.rowSteps) : mesh.colLine(h.col, ai.colSteps)
        wire.push(line(pts, LUMEN, h.w || ai.hotW, h.op || ai.hotOp))
        if (ai.glow) glow.push(line(pts, LUMEN, (h.w || ai.hotW) * 3.2, 0.5))
      }
      if (ai.outline) {
        const ol = mesh.outline()
        wire.push(`<path d="${E.path(ol, true)}" fill="none" stroke="${LUMEN}" stroke-width="${ai.outlineW || 1.6}" stroke-opacity="${ai.outline}" stroke-linejoin="round"/>`)
        if (ai.glow) glow.push(`<path d="${E.path(ol, true)}" fill="none" stroke="${LUMEN}" stroke-width="6" stroke-opacity="${ai.outline * 0.6}"/>`)
      }
      if (glow.length) parts.push(`<g filter="${ctx.blurBox(5)}">${glow.join('')}</g>`)
      parts.push(wire.join(''))
      if (aiAfter) parts.push(aiAfter(ctx))
      return parts.join('')
    },
  }
}

/** Soft cast shadow of a mesh outline (clean mode only). */
export function dropShadow(mesh, { dx = 14, dy = 10, std = 10, op = 0.3, color = '#0d0d0c' } = {}) {
  return {
    clean: (ctx) => `<path d="${E.path(mesh.outline().map((p) => [p[0] + dx, p[1] + dy]), true)}" fill="${color}" opacity="${op}" filter="${ctx.blur(std)}"/>`,
    ai: () => '',
  }
}

// ---------------------------------------------------------------------------------------------
// backdrops
// ---------------------------------------------------------------------------------------------
/**
 * Clean studio backdrop: wall gradient, floor gradient, soft key-light pool, vignette.
 * o: { wall:[top,bottom], floor:[top,bottom], horizon, spot:{x,y,r,col,op}, vignette, extra }
 */
export function cleanBackdrop(ctx, o = {}) {
  const { wall = ['#F7F3EA', '#E6DFD0'], floor = ['#DDD6C7', '#C2BAA8'], horizon = 640, spot = { x: 600, y: 360, r: 620, col: '#FFFFFF', op: 0.55 }, vignette = 0.2, baseboard = true } = o
  const wg = ctx.uid('wall')
  const fg = ctx.uid('floor')
  const sg = ctx.uid('spot')
  const vg = ctx.uid('vig')
  ctx.def(`<linearGradient id="${wg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient>`)
  ctx.def(`<linearGradient id="${fg}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor[0]}"/><stop offset="1" stop-color="${floor[1]}"/></linearGradient>`)
  ctx.def(`<radialGradient id="${sg}" gradientUnits="userSpaceOnUse" cx="${spot.x}" cy="${spot.y}" r="${spot.r}"><stop offset="0" stop-color="${spot.col}" stop-opacity="${spot.op}"/><stop offset="1" stop-color="${spot.col}" stop-opacity="0"/></radialGradient>`)
  ctx.def(`<radialGradient id="${vg}" gradientUnits="userSpaceOnUse" cx="600" cy="430" r="780"><stop offset="0.55" stop-color="#2a2418" stop-opacity="0"/><stop offset="1" stop-color="#2a2418" stop-opacity="${vignette}"/></radialGradient>`)
  let s = `<rect width="${W}" height="${H}" fill="url(#${wg})"/>`
  s += `<rect y="${horizon}" width="${W}" height="${H - horizon}" fill="url(#${fg})"/>`
  if (baseboard) {
    s += `<rect y="${horizon - 6}" width="${W}" height="10" fill="#0d0d0c" opacity="0.1" filter="${ctx.blur(5)}"/>`
    s += `<rect y="${horizon}" width="${W}" height="1.5" fill="#fff" opacity="0.35"/>`
  }
  s += `<rect width="${W}" height="${H}" fill="url(#${sg})"/>`
  if (o.extra) s += o.extra(ctx)
  s += `<rect width="${W}" height="${H}" fill="url(#${vg})"/>`
  return s
}

/**
 * Dark AI plate: faint grid with fade, olive glow, floor rings, scattered crosshair marks, scan streaks.
 * o: { seed, glow:{x,y}, floor:{x,y,r,ry}|null, marks, horizon }
 */
export function aiBackdrop(ctx, o = {}) {
  const { seed = 7, glow = { x: 600, y: 450 }, floor = null, marks = 40, arcs = 5 } = o
  const r = E.rng(seed)
  const gg = ctx.uid('pg')
  const fg = ctx.uid('gf')
  const gm = ctx.uid('gm')
  ctx.def(`<radialGradient id="${gg}" gradientUnits="userSpaceOnUse" cx="${glow.x}" cy="${glow.y}" r="${H * 0.95}"><stop offset="0" stop-color="#232a1a" stop-opacity="0.95"/><stop offset="0.55" stop-color="#121410" stop-opacity="0.6"/><stop offset="1" stop-color="#0a0b0c" stop-opacity="0"/></radialGradient>`)
  ctx.def(`<radialGradient id="${fg}" gradientUnits="userSpaceOnUse" cx="${glow.x}" cy="${H * 0.52}" r="${W * 0.62}"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0.18"/></radialGradient>`)
  ctx.def(`<mask id="${gm}"><rect width="${W}" height="${H}" fill="url(#${fg})"/></mask>`)
  const out = []
  out.push(`<rect width="${W}" height="${H}" fill="#0a0b0c"/>`)
  out.push(`<rect width="${W}" height="${H}" fill="url(#${gg})"/>`)
  const g = []
  const step = Math.round(H / 20)
  for (let x = 0; x <= W; x += step) {
    const major = x % (step * 5) === 0
    g.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${LUMEN}" stroke-opacity="${major ? 0.11 : 0.045}" stroke-width="${major ? 1.4 : 1}"/>`)
  }
  for (let y = 0; y <= H; y += step) {
    const major = y % (step * 5) === 0
    g.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${LUMEN}" stroke-opacity="${major ? 0.11 : 0.045}" stroke-width="${major ? 1.4 : 1}"/>`)
  }
  out.push(`<g mask="url(#${gm})">${g.join('')}</g>`)
  if (floor) {
    const rings = []
    for (let i = 0; i < 6; i++) {
      const k = 1 + i * 0.28
      const ry = floor.ry != null ? floor.ry : floor.r * 0.17
      rings.push(`<ellipse cx="${floor.x}" cy="${floor.y}" rx="${r1(floor.r * k)}" ry="${r1(ry * k)}" fill="none" stroke="${LUMEN}" stroke-opacity="${(0.34 - i * 0.05).toFixed(3)}" stroke-width="${i === 0 ? 2.2 : 1.3}"${i % 2 ? ' stroke-dasharray="2 9"' : ''}/>`)
    }
    out.push(rings.join(''))
  }
  const m = []
  for (let i = 0; i < marks; i++) {
    const x = r() * W
    const y = r() * H
    const s = 6 + r() * 6
    const op = 0.14 + r() * 0.3
    m.push(`<g stroke="${LUMEN}" stroke-opacity="${op.toFixed(2)}" stroke-width="1.4" stroke-linecap="round"><line x1="${r1(x - s)}" y1="${r1(y)}" x2="${r1(x + s)}" y2="${r1(y)}"/><line x1="${r1(x)}" y1="${r1(y - s)}" x2="${r1(x)}" y2="${r1(y + s)}"/></g>`)
  }
  for (let i = 0; i < arcs; i++) {
    const cx = r() * W
    const cy = H * (0.2 + r() * 0.6)
    const rad = 50 + r() * 90
    m.push(`<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(rad)}" fill="none" stroke="${LUMEN}" stroke-opacity="0.12" stroke-width="1.3" stroke-dasharray="2 8"/>`)
  }
  out.push(m.join(''))
  for (let i = 0; i < 9; i++) {
    const y = H * (0.08 + i * 0.105)
    out.push(`<rect x="0" y="${y.toFixed(0)}" width="${W}" height="1.3" fill="${LUMEN}" opacity="${(0.035 + (i % 3) * 0.02).toFixed(3)}"/>`)
  }
  if (o.extra) out.push(o.extra(ctx))
  return out.join('')
}

// ---------------------------------------------------------------------------------------------
// HUD primitives (lumen, drawn glowing + sharp)
// ---------------------------------------------------------------------------------------------
export const hud = {
  node: (p, r = 5) => `<circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="${r}" fill="${LUMEN}"/>`,
  cross: (p, s = 11, w = 2) =>
    `<g stroke="${LUMEN}" stroke-width="${w}" stroke-linecap="round"><line x1="${r1(p[0] - s)}" y1="${r1(p[1])}" x2="${r1(p[0] + s)}" y2="${r1(p[1])}"/><line x1="${r1(p[0])}" y1="${r1(p[1] - s)}" x2="${r1(p[0])}" y2="${r1(p[1] + s)}"/></g><circle cx="${r1(p[0])}" cy="${r1(p[1])}" r="3.2" fill="${LUMEN}"/>`,
  /** horizontal measurement rails off both sides of a feature */
  measure(l, r, { pad = 11, len = 52, cap = 10 } = {}) {
    const s = []
    s.push(`<line x1="${r1(l[0] - pad)}" y1="${r1(l[1])}" x2="${r1(l[0] - pad - len)}" y2="${r1(l[1])}" stroke="${LUMEN}" stroke-width="1.8" stroke-opacity="0.8" stroke-dasharray="3 6"/>`)
    s.push(`<line x1="${r1(r[0] + pad)}" y1="${r1(r[1])}" x2="${r1(r[0] + pad + len)}" y2="${r1(r[1])}" stroke="${LUMEN}" stroke-width="1.8" stroke-opacity="0.8" stroke-dasharray="3 6"/>`)
    s.push(`<rect x="${r1(l[0] - pad - len - cap)}" y="${r1(l[1] - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>`)
    s.push(`<rect x="${r1(r[0] + pad + len)}" y="${r1(r[1] - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>`)
    s.push(`<circle cx="${r1(l[0])}" cy="${r1(l[1])}" r="5" fill="${LUMEN}"/><circle cx="${r1(r[0])}" cy="${r1(r[1])}" r="5" fill="${LUMEN}"/>`)
    return s.join('')
  },
  /** vertical dimension line with square end caps */
  vdim(x, y0, y1, cap = 10) {
    return (
      `<line x1="${r1(x)}" y1="${r1(y0 + cap)}" x2="${r1(x)}" y2="${r1(y1 - cap)}" stroke="${LUMEN}" stroke-width="1.8" stroke-opacity="0.8" stroke-dasharray="3 6"/>` +
      `<rect x="${r1(x - cap / 2)}" y="${r1(y0 - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>` +
      `<rect x="${r1(x - cap / 2)}" y="${r1(y1 - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>`
    )
  },
  /** horizontal dimension line with square end caps */
  hdim(y, x0, x1, cap = 10) {
    return (
      `<line x1="${r1(x0 + cap)}" y1="${r1(y)}" x2="${r1(x1 - cap)}" y2="${r1(y)}" stroke="${LUMEN}" stroke-width="1.8" stroke-opacity="0.8" stroke-dasharray="3 6"/>` +
      `<rect x="${r1(x0 - cap / 2)}" y="${r1(y - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>` +
      `<rect x="${r1(x1 - cap / 2)}" y="${r1(y - cap / 2)}" width="${cap}" height="${cap}" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>`
    )
  },
  /** corner brackets around a box */
  bracket(x, y, w, h, len = 22, op = 0.85) {
    const L = len
    const d = `M${x} ${y + L}V${y}H${x + L}M${x + w - L} ${y}H${x + w}V${y + L}M${x + w} ${y + h - L}V${y + h}H${x + w - L}M${x + L} ${y + h}H${x}V${y + h - L}`
    return `<path d="${d}" fill="none" stroke="${LUMEN}" stroke-width="2" stroke-opacity="${op}" stroke-linecap="square"/>`
  },
}

// ---------------------------------------------------------------------------------------------
// scene renderer
// ---------------------------------------------------------------------------------------------
/**
 * def: {
 *   backdrop: { clean(ctx), ai(ctx) },
 *   items: [{ clean(ctx), ai(ctx), sil?() , scan? }],
 *   hud: string[],            // AI-only
 *   scan: { y, h }            // AI scan band (clipped to item silhouettes)
 * }
 */
export function renderScene(mode, def) {
  const ctx = makeCtx(mode)
  const body = []
  const open = def.shift ? `<g transform="translate(${def.shift[0]} ${def.shift[1]})">` : ''
  const shut = def.shift ? '</g>' : ''
  if (mode === 'clean') {
    body.push(def.backdrop.clean(ctx))
    body.push(open)
    for (const it of def.items) if (it.clean) body.push(it.clean(ctx))
    body.push(shut)
    if (def.overlay && def.overlay.clean) body.push(def.overlay.clean(ctx))
  } else {
    body.push(def.backdrop.ai(ctx))
    body.push(open)
    for (const it of def.items) if (it.ai) body.push(it.ai(ctx))
    if (def.scan) {
      const cid = ctx.uid('sc')
      const gid = ctx.uid('sg')
      const sils = def.items.filter((it) => it.sil && it.scan !== false).map((it) => `<path d="${it.sil()}" fill="#fff"/>`)
      ctx.def(`<mask id="${cid}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>${sils.join('')}</mask>`)
      ctx.def(`<linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${LUMEN}" stop-opacity="0"/><stop offset="0.5" stop-color="${LUMEN}" stop-opacity="0.3"/><stop offset="1" stop-color="${LUMEN}" stop-opacity="0"/></linearGradient>`)
      body.push(`<g mask="url(#${cid})"><rect x="0" y="${def.scan.y}" width="${W}" height="${def.scan.h}" fill="url(#${gid})"/></g>`)
    }
    if (def.hud && def.hud.length) {
      body.push(`<g filter="${ctx.blur(4)}" opacity="0.7">${def.hud.join('')}</g>`)
      body.push(def.hud.join(''))
    }
    body.push(shut)
    if (def.overlay && def.overlay.ai) body.push(def.overlay.ai(ctx))
  }
  return E.svgOpen(W, H, ctx.defsXml()) + body.join('') + E.svgClose
}
