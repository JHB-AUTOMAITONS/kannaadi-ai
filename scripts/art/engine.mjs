// Kannaadi.Ai procedural art engine.
//
// Every visual on the site is produced from the same shaded 3D surface model, so a "clean" render
// and its "AI scan" counterpart share identical geometry and are aligned to the pixel by
// construction. Surfaces of revolution (gowns, forms, heads) are tessellated into quads, lit with a
// small physically-flavoured shader (diffuse + satin specular + rim) and emitted as SVG, which
// sharp rasterises to WebP in scripts/generate-art.mjs.

export const TAU = Math.PI * 2
export const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
export const lerp = (a, b, t) => a + (b - a) * t
export const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

/** Brand palette used by imagery (kept in sync with src/index.css). */
export const PALETTE = {
  ivory: '#F5F1E8',
  paper: '#FBF9F4',
  sand: '#E9E3D6',
  stone: '#CFC9BC',
  ink: '#0D0D0C',
  charcoal: '#151517',
  graphite: '#222226',
  slate: '#34343A',
  lumen: '#D5FF4F',
}

// ---------------------------------------------------------------------------------------------
// colour helpers
// ---------------------------------------------------------------------------------------------
export function hex(h) {
  const s = h.replace('#', '')
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)]
}
export const toHex = (c) =>
  '#' +
  c
    .map((v) => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0'))
    .join('')
export const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
export const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k]

// ---------------------------------------------------------------------------------------------
// vector helpers
// ---------------------------------------------------------------------------------------------
export const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const cross3 = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
export const norm3 = (a) => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}

/** Seeded PRNG so every run of the generator produces identical art. */
export function rng(seed = 1) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Monotone cubic (PCHIP) interpolation through [x, y] keys. */
export function pchip(keys) {
  const n = keys.length
  const xs = keys.map((k) => k[0])
  const ys = keys.map((k) => k[1])
  const h = []
  const d = []
  for (let i = 0; i < n - 1; i++) {
    h[i] = xs[i + 1] - xs[i]
    d[i] = (ys[i + 1] - ys[i]) / h[i]
  }
  const m = new Array(n)
  m[0] = d[0]
  m[n - 1] = d[n - 2]
  for (let i = 1; i < n - 1; i++) {
    if (d[i - 1] * d[i] <= 0) m[i] = 0
    else {
      const w1 = 2 * h[i] + h[i - 1]
      const w2 = h[i] + 2 * h[i - 1]
      m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])
    }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    let i = 0
    while (x > xs[i + 1]) i++
    const t = (x - xs[i]) / h[i]
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h[i] * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h[i] * m[i + 1]
    )
  }
}

// ---------------------------------------------------------------------------------------------
// materials + lighting
// ---------------------------------------------------------------------------------------------
const L_KEY = norm3([-0.55, 0.62, 0.56])
const L_RIM = norm3([0.9, 0.18, -0.12])
const L_FILL = norm3([0.45, -0.1, 0.9])
const V_EYE = norm3([0, 0.18, 1])
const H_KEY = norm3([L_KEY[0] + V_EYE[0], L_KEY[1] + V_EYE[1], L_KEY[2] + V_EYE[2]])

/**
 * Material: { shadow, mid, spec, gloss, specCol, rim, rimCol, fill, sheen }
 * Colours are [r,g,b] 0-255 arrays. `shadow` is the unlit colour, `mid` the fully lit diffuse.
 */
export const MATERIALS = {
  satin: {
    shadow: hex('#050507'),
    mid: hex('#3a3a44'),
    spec: 0.62,
    gloss: 30,
    specCol: hex('#f0e8d6'),
    rim: 0.42,
    rimCol: hex('#cdbf9d'),
    fill: 0.06,
  },
  form: {
    shadow: hex('#8f8472'),
    mid: hex('#e4dac6'),
    spec: 0.1,
    gloss: 10,
    specCol: hex('#ffffff'),
    rim: 0.22,
    rimCol: hex('#ffffff'),
    fill: 0.3,
  },
  metal: {
    shadow: hex('#4a3d22'),
    mid: hex('#e0c68a'),
    spec: 0.9,
    gloss: 60,
    specCol: hex('#fff7e2'),
    rim: 0.5,
    rimCol: hex('#fff1c9'),
    fill: 0.2,
  },
}

export function shade(n, mat, ao = 1) {
  const dKey = Math.max(0, dot3(n, L_KEY))
  const dFill = Math.max(0, dot3(n, L_FILL)) * mat.fill
  const diff = clamp(0.1 + 0.9 * dKey + dFill, 0, 1)
  let col = mix(mat.shadow, mat.mid, Math.pow(diff, 0.9))
  const s = Math.pow(Math.max(0, dot3(n, H_KEY)), mat.gloss) * mat.spec
  const r = Math.pow(Math.max(0, dot3(n, L_RIM)), 2.4) * mat.rim
  col = add(col, mat.specCol, s)
  col = add(col, mat.rimCol, r)
  return scale(col, ao)
}

// ---------------------------------------------------------------------------------------------
// surface of revolution
// ---------------------------------------------------------------------------------------------
/**
 * @typedef {Object} SorConfig
 * @property {number} y0 top (px)  @property {number} y1 bottom (px)
 * @property {(y:number)=>number} A half-width  @property {(y:number)=>number} B half-depth
 * @property {(y:number)=>number} cx centre x
 * @property {{n:number, amp:(y:number)=>number, tw:(y:number)=>number}} [pleats]
 * @property {(y:number, th:number)=>number} [yShift] vertical displacement (hem waves, necklines)
 * @property {number} [tilt] camera elevation factor, projected ring height = tilt * depth
 * @property {number} [rows] @property {number} [cols]
 * @property {number} [th0] @property {number} [th1]
 */
export function makeSOR(cfg) {
  const {
    y0,
    y1,
    A,
    B,
    cx,
    pleats,
    yShift,
    tilt = 0.2,
    rows = 90,
    cols = 150,
    th0 = 0,
    th1 = Math.PI,
  } = cfg

  const surf = (y, th) => {
    const k = pleats ? 1 + pleats.amp(y) * Math.sin(pleats.n * th + pleats.tw(y)) : 1
    const a = A(y) * k
    const b = B(y) * k
    const X = cx(y) + a * Math.cos(th)
    const Z = b * Math.sin(th)
    const Yn = y + (yShift ? yShift(y, th) : 0)
    return { X, Z, Yn }
  }
  const P = (y, th) => {
    const s = surf(y, th)
    return [s.X, s.Yn + tilt * s.Z]
  }
  const P3 = (y, th) => {
    const s = surf(y, th)
    return [s.X, -s.Yn, s.Z]
  }
  const dy = (y1 - y0) / rows
  const dth = (th1 - th0) / cols

  function normalAt(y, th) {
    const e1 = dth * 0.5
    const e2 = dy * 0.5
    const tTh = sub3(P3(y, th + e1), P3(y, th - e1))
    const tY = sub3(P3(y + e2, th), P3(y - e2, th))
    let n = norm3(cross3(tTh, tY))
    if (n[2] < 0 && Math.abs(th - Math.PI / 2) < Math.PI / 2) n = [-n[0], -n[1], -n[2]]
    return n
  }

  /** Ambient-occlusion proxy: pleat valleys are darker. */
  function aoAt(y, th) {
    if (!pleats) return 1
    const s = Math.sin(pleats.n * th + pleats.tw(y))
    const amount = clamp(pleats.amp(y) * 9, 0, 0.5)
    return 1 - amount * (0.5 - 0.5 * s) * 0.9
  }

  /** @returns {{pts:number[][], n:number[], ao:number, y:number, th:number, i:number, j:number}[]} */
  function quads() {
    const out = []
    for (let j = 0; j < rows; j++) {
      const ya = y0 + j * dy
      const yb = ya + dy
      for (let i = 0; i < cols; i++) {
        const ta = th0 + i * dth
        const tb = ta + dth
        const pts = [P(ya, ta), P(ya, tb), P(yb, tb), P(yb, ta)]
        const ym = (ya + yb) / 2
        const tm = (ta + tb) / 2
        out.push({ pts, n: normalAt(ym, tm), ao: aoAt(ym, tm), y: ym, th: tm, i, j, z: surf(ym, tm).Z })
      }
    }
    return out
  }

  /** Polyline along a ring (constant y). */
  function ring(y, steps = 80, a = th0, b = th1) {
    const pts = []
    for (let k = 0; k <= steps; k++) pts.push(P(y, a + ((b - a) * k) / steps))
    return pts
  }
  /** Polyline along a meridian (constant theta). */
  function meridian(th, steps = 80, a = y0, b = y1) {
    const pts = []
    for (let k = 0; k <= steps; k++) pts.push(P(a + ((b - a) * k) / steps, th))
    return pts
  }
  /** Silhouette outline: left edge down, right edge up. */
  function silhouette(steps = 120) {
    const left = []
    const right = []
    for (let k = 0; k <= steps; k++) {
      const y = y0 + ((y1 - y0) * k) / steps
      left.push(P(y, th1))
      right.push(P(y, th0))
    }
    return [...left, ...ring(y1, 60, th1, th0).slice(1), ...right.reverse()]
  }

  return { P, P3, quads, ring, meridian, silhouette, normalAt, cfg }
}

// ---------------------------------------------------------------------------------------------
// svg emit helpers
// ---------------------------------------------------------------------------------------------
const f1 = (v) => (Math.round(v * 10) / 10).toString()
export const pts2s = (pts) => pts.map((p) => `${f1(p[0])},${f1(p[1])}`).join(' ')
export const path = (pts, close = false) =>
  'M' + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join('L') + (close ? 'Z' : '')

/** Emit shaded quads as polygons. Stroke matches fill to hide anti-aliasing seams. */
export function emitQuads(quads, mat, { colour, seam = 1.6, dim = 1, sort = true } = {}) {
  const out = []
  const list = sort ? [...quads].sort((a, b) => a.z - b.z) : quads
  for (const q of list) {
    let c = shade(q.n, mat, q.ao * dim)
    if (colour) c = colour(c, q)
    const h = toHex(c)
    out.push(`<polygon points="${pts2s(q.pts)}" fill="${h}" stroke="${h}" stroke-width="${seam}" stroke-linejoin="round"/>`)
  }
  return out.join('')
}

export const svgOpen = (w, h, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs ? `<defs>${defs}</defs>` : ''}`
export const svgClose = '</svg>'

export const blur = (id, std) =>
  `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${std}"/></filter>`
