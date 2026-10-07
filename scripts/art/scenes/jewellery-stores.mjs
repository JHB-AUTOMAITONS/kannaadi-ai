// Jewellery: a dark velvet neck-bust wearing a gold chain with an emerald pendant, with a pair of drop
// earrings floating either side of the neck. Chain links and gem facets share geometry between modes.
import * as S from './_shared.mjs'

const { E, smooth, pchip, range, line, LUMEN, hud, hex, mix, clamp } = S

const CX = 600
const TILT = 0.22
const TAU = Math.PI * 2
const ES = 1.3

// ---- gem construction -----------------------------------------------------------------------------
const LIGHT = E.norm3([-0.5, 0.65, 0.58])
const HALF = E.norm3([LIGHT[0], LIGHT[1], LIGHT[2] + 1])

/** teardrop outline with its tip at the top; returns N points in local coords (y down) */
function pearOutline(w, h, N = 20) {
  const pts = []
  for (let k = 0; k < N; k++) {
    const t = (k / N) * TAU
    const x = Math.sin(t) * Math.pow(Math.sin(t / 2), 0.9)
    const y = -Math.cos(t)
    pts.push([x * w * 0.62, y * h * 0.5 + 0])
  }
  return pts
}
function emeraldOutline(w, h) {
  const cx = w / 2
  const cy = h / 2
  const c = Math.min(w, h) * 0.28
  return [
    [-cx + c, -cy], [cx - c, -cy], [cx, -cy + c], [cx, cy - c], [cx - c, cy], [-cx + c, cy], [-cx, cy - c], [-cx, -cy + c],
  ]
}
function roundOutline(r, N = 16) {
  return Array.from({ length: N }, (_, k) => [Math.cos((k / N) * TAU) * r, Math.sin((k / N) * TAU) * r])
}

/** facets of a brilliant-ish cut: crown ring + table fan. Returns polygons with normals. */
function gemFacets(outline, { tableK = 0.52, seed = 1, cut = 'pear' } = {}) {
  const R = E.rng(seed)
  const n = outline.length
  const cx = outline.reduce((a, p) => a + p[0], 0) / n
  const cy = outline.reduce((a, p) => a + p[1], 0) / n
  const table = outline.map((p) => [cx + (p[0] - cx) * tableK, cy + (p[1] - cy) * tableK - 2])
  const facets = []
  for (let k = 0; k < n; k++) {
    const k2 = (k + 1) % n
    const pts = [outline[k], outline[k2], table[k2], table[k]]
    const mx = (outline[k][0] + outline[k2][0] + table[k][0] + table[k2][0]) / 4 - cx
    const my = (outline[k][1] + outline[k2][1] + table[k][1] + table[k2][1]) / 4 - cy
    const ml = Math.hypot(mx, my) || 1
    const nrm = E.norm3([(mx / ml) * 0.8, -(my / ml) * 0.8, 0.62 + R() * 0.12])
    facets.push({ pts, n: nrm, kind: 'crown', k, jitter: R() })
  }
  // table fan (star facets)
  const ctr = [cx, cy - 2]
  for (let k = 0; k < n; k++) {
    const k2 = (k + 1) % n
    const a = (k / n) * TAU
    const nrm = E.norm3([Math.cos(a) * 0.3, Math.sin(a) * 0.3, 1])
    facets.push({ pts: [table[k], table[k2], ctr], n: nrm, kind: 'table', k, jitter: R() })
  }
  return { facets, outline, table, ctr, cx, cy }
}

function facetColour(f, base) {
  // base: { dark, mid, light } hex arrays
  const d = Math.max(0, E.dot3(f.n, LIGHT))
  const s = Math.pow(Math.max(0, E.dot3(f.n, HALF)), 22)
  let t = clamp(0.1 + 0.9 * d + (f.jitter - 0.5) * 0.35, 0, 1)
  if (f.kind === 'table') t = clamp(t * 0.8 + 0.1 + (f.k % 2 ? 0.14 : -0.1), 0, 1)
  let c = t < 0.5 ? mix(base.dark, base.mid, t * 2) : mix(base.mid, base.light, (t - 0.5) * 2)
  c = mix(c, [255, 255, 255], clamp(s * 0.85, 0, 0.9))
  return c
}

const EMERALD = { dark: hex('#03281b'), mid: hex('#0f8a5b'), light: hex('#7ff0b8') }

const xf = (pts, ox, oy, rot, sx = 1) => {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  return pts.map((p) => [ox + (p[0] * sx * c - p[1] * s), oy + (p[0] * sx * s + p[1] * c)])
}

function gemClean(g, ox, oy, rot, base, sx = 1) {
  const out = []
  for (const f of g.facets) {
    const pts = xf(f.pts, ox, oy, rot, sx)
    const c = facetColour({ ...f, n: [f.n[0] * sx, f.n[1], f.n[2]] }, base)
    const h = E.toHex(c)
    out.push(`<path d="${E.path(pts, true)}" fill="${h}" stroke="${E.toHex(mix(c, [255, 255, 255], 0.35))}" stroke-opacity="0.55" stroke-width="0.8" stroke-linejoin="round"/>`)
  }
  return out.join('')
}
function gemAi(g, ox, oy, rot, sx = 1) {
  const out = []
  const glow = []
  for (const f of g.facets) {
    const pts = xf(f.pts, ox, oy, rot, sx)
    const d = Math.max(0, E.dot3(f.n, LIGHT))
    const fillOp = f.kind === 'table' ? 0.1 + d * 0.22 + (f.k % 2 ? 0.08 : 0) : 0.04 + d * 0.16
    out.push(`<path d="${E.path(pts, true)}" fill="#0b1812" stroke="${LUMEN}" stroke-opacity="${f.kind === 'table' ? 0.75 : 0.9}" stroke-width="1.3" stroke-linejoin="round"/>`)
    out.push(`<path d="${E.path(pts, true)}" fill="${LUMEN}" fill-opacity="${fillOp.toFixed(3)}" stroke="none"/>`)
  }
  const o = xf(g.outline, ox, oy, rot, sx)
  glow.push(`<path d="${E.path(o, true)}" fill="${LUMEN}" fill-opacity="0.18" stroke="${LUMEN}" stroke-width="7" stroke-opacity="0.55"/>`)
  return { fill: out.join(''), glow: glow.join('') }
}

const star = (x, y, r, op = 0.95) =>
  `<g transform="translate(${S.r1(x)} ${S.r1(y)})"><path d="M0 ${-r}Q${r * 0.1} ${-r * 0.1} ${r} 0Q${r * 0.1} ${r * 0.1} 0 ${r}Q${-r * 0.1} ${r * 0.1} ${-r} 0Q${-r * 0.1} ${-r * 0.1} 0 ${-r}Z" fill="#fff" fill-opacity="${op}"/></g>`

// ---- chain -----------------------------------------------------------------------------------------
function linkSvgClean(p, ang, flat, sz) {
  const a = (ang * 180) / Math.PI
  const rx = sz * 1.0
  const ry = flat ? sz * 0.62 : sz * 0.26
  const T = `transform="translate(${S.r1(p[0])} ${S.r1(p[1])}) rotate(${S.r1(a)})"`
  return (
    `<ellipse ${T} rx="${S.r1(rx)}" ry="${S.r1(ry)}" fill="none" stroke="#4d3510" stroke-width="${flat ? 3.9 : 3.3}"/>` +
    `<ellipse ${T} rx="${S.r1(rx)}" ry="${S.r1(ry)}" fill="none" stroke="#D9B45E" stroke-width="${flat ? 2.7 : 2.3}"/>` +
    `<ellipse ${T} rx="${S.r1(rx - 0.6)}" ry="${S.r1(Math.max(0.5, ry - 0.8))}" fill="none" stroke="#FFF2C4" stroke-opacity="${flat ? 0.85 : 0.55}" stroke-width="0.9" stroke-dasharray="${S.r1(rx * 2.2)} ${S.r1(rx * 4)}" stroke-dashoffset="${S.r1(rx * 0.9)}"/>`
  )
}
function linkSvgAi(p, ang, flat, sz) {
  const a = (ang * 180) / Math.PI
  const rx = sz
  const ry = flat ? sz * 0.62 : sz * 0.26
  return `<ellipse transform="translate(${S.r1(p[0])} ${S.r1(p[1])}) rotate(${S.r1(a)})" rx="${S.r1(rx)}" ry="${S.r1(ry)}" fill="none" stroke="${LUMEN}" stroke-width="1.5" stroke-opacity="${flat ? 0.95 : 0.7}"/>`
}

/** walk a polyline at fixed arc-length steps. returns [{p, ang}] */
function walk(pts, step) {
  const out = []
  let acc = 0
  let next = step * 0.5
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1]
    const b = pts[i]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    while (acc + d >= next) {
      const t = (next - acc) / d
      out.push({ p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], ang: Math.atan2(b[1] - a[1], b[0] - a[0]) })
      next += step
    }
    acc += d
  }
  return out
}

let G = null

function build() {
  // velvet bust --------------------------------------------------------------------------------
  const bA = pchip([[170, 72], [230, 70], [290, 76], [318, 94], [342, 134], [366, 178], [390, 214], [420, 236], [470, 242], [540, 238], [610, 228], [660, 218]])
  const bB = pchip([[170, 66], [230, 64], [290, 70], [318, 80], [342, 98], [366, 114], [390, 126], [420, 134], [470, 138], [540, 138], [610, 132], [660, 126]])
  const bust = S.sorMesh({
    y0: 170,
    y1: 660,
    A: bA,
    B: bB,
    cx: () => CX,
    tilt: TILT,
    rows: 90,
    cols: 130,
    pleats: { n: 9, amp: () => 0.0, tw: () => 0 },
  })
  const plinth = S.sorMesh({ y0: 666, y1: 790, A: () => 282, B: () => 282, cx: () => CX, tilt: TILT, rows: 10, cols: 110 })

  // chain on the bust surface -----------------------------------------------------------------------
  const ys = 298
  const D = 196
  const surfZ = (x, y) => bB(y) * Math.sqrt(Math.max(0, 1 - Math.pow((x - CX) / bA(y), 2)))
  const chainPts = []
  const Wc = bA(ys) * 0.99
  for (let k = 0; k <= 600; k++) {
    const t = -1 + (2 * k) / 600
    const x = CX + Wc * t
    // drop follows the front of the chest; the flare keeps the chain on the surface
    const y = ys + D * (1 - Math.pow(Math.abs(t), 1.5))
    const z = surfZ(x, y) * 1.03 + 1.5
    chainPts.push([x, y + TILT * z])
  }
  const links = walk(chainPts, 7.4)
  const pendantTop = chainPts[300]

  // pendant gem ----------------------------------------------------------------------------------------
  const pear = gemFacets(pearOutline(76, 112, 20), { tableK: 0.5, seed: 4 })
  const pendant = { g: pear, ox: pendantTop[0], oy: pendantTop[1] + 20 + 56 }

  // earrings -----------------------------------------------------------------------------------------------
  const earGem = gemFacets(pearOutline(42 * ES, 70 * ES, 16), { tableK: 0.5, seed: 9 })
  const earStud = gemFacets(roundOutline(8.5 * ES, 12), { tableK: 0.5, seed: 12 })
  const earrings = [-1, 1].map((sg) => ({ sg, x: CX + sg * 276, y0: 226 + (sg > 0 ? 16 : 0), rot: sg * 0.05 }))

  return { bust, plinth, bA, bB, chainPts, links, pendant, pear, earGem, earStud, earrings, ys, D }
}

export function scene(mode) {
  G ||= build()
  const { bust, plinth, bA, bB, chainPts, links, pendant, earGem, earStud, earrings, ys } = G

  const velvetMat = S.velvet('#1D3A33', { depth: 0.08, lift: 1.0, rim: 0.8, spec: 0.05, fill: 0.16 })
  const stoneMat = S.matte('#E3DACB', { depth: 0.6, lift: 1.0 })

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#E9E1D0', '#D3C9B3'],
      floor: ['#D2C8B2', '#B0A48B'],
      horizon: 690,
      spot: { x: 600, y: 360, r: 520, col: '#FFFDF4', op: 0.9 },
      vignette: 0.3,
      extra: (c) => {
        const g = c.uid('disc')
        c.def(`<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FBF6EA" stop-opacity="0.9"/><stop offset="0.82" stop-color="#EFE6D3" stop-opacity="0.55"/><stop offset="1" stop-color="#E5DAC3" stop-opacity="0"/></radialGradient>`)
        return `<circle cx="600" cy="420" r="330" fill="url(#${g})"/><circle cx="600" cy="420" r="318" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`
      },
    })
  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 91, glow: { x: 600, y: 430 }, floor: { x: CX, y: 796, r: 300, ry: 66 }, marks: 36 })

  const items = []

  // plinth: top face, shadow, sides
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('pt')
      ctx.def(`<radialGradient id="${g}" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#F4EEE0"/><stop offset="1" stop-color="#D3C8B2"/></radialGradient>`)
      return S.groundShadow(ctx, CX + 14, 794, 290, 40, 1) + `<ellipse cx="${CX}" cy="666" rx="282" ry="${282 * TILT}" fill="url(#${g})"/><ellipse cx="${CX}" cy="666" rx="282" ry="${282 * TILT}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/><ellipse cx="${CX + 6}" cy="${678}" rx="250" ry="${50}" fill="#1a1710" opacity="0.28" filter="${ctx.blur(16)}"/>`
    },
    ai: (ctx) => {
      const g = ctx.uid('pt')
      ctx.def(`<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#1c2214"/><stop offset="1" stop-color="#0c0e0b"/></radialGradient>`)
      return `<ellipse cx="${CX}" cy="666" rx="282" ry="${282 * TILT}" fill="url(#${g})" stroke="${LUMEN}" stroke-opacity="0.9" stroke-width="2.4"/><ellipse cx="${CX}" cy="666" rx="254" ry="${254 * TILT}" fill="none" stroke="${LUMEN}" stroke-opacity="0.35" stroke-width="1.4" stroke-dasharray="2 8"/>`
    },
  })
  items.push(
    S.solid(plinth, {
      mat: stoneMat,
      ai: { tone: 'deep', rows: [0, 1], cols: range(0, 1, 44), colOp: 0.2, rowOp: 0.7 },
      scan: false,
    }),
  )

  // bust
  items.push(
    S.solid(bust, {
      mat: velvetMat,
      ai: { tone: 'dark', rows: range(0, 1, 44), cols: range(0, 1, 34), rowOp: 0.3, colOp: 0.28, outline: 0.5, hot: [{ row: 0.0, w: 2.6 }, { row: 0.285, w: 2.2, op: 0.8 }, { row: 1, w: 2.8 }] },
    }),
  )
  // top cap of the neck
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('cap')
      ctx.def(`<radialGradient id="${g}" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#2B4F45"/><stop offset="1" stop-color="#10201C"/></radialGradient>`)
      return `<ellipse cx="${CX}" cy="170" rx="${bA(170)}" ry="${bB(170) * TILT}" fill="url(#${g})"/><ellipse cx="${CX}" cy="170" rx="${bA(170)}" ry="${bB(170) * TILT}" fill="none" stroke="#6fa595" stroke-opacity="0.45" stroke-width="1.5"/>`
    },
    ai: () => `<ellipse cx="${CX}" cy="170" rx="${bA(170)}" ry="${bB(170) * TILT}" fill="#0d1210" stroke="${LUMEN}" stroke-opacity="0.9" stroke-width="2.2"/><ellipse cx="${CX}" cy="170" rx="${bA(170) * 0.6}" ry="${bB(170) * TILT * 0.6}" fill="none" stroke="${LUMEN}" stroke-opacity="0.4" stroke-width="1.2"/>`,
  })

  // chain shadow on velvet + links
  const odd = links.filter((_, i) => i % 2 === 1)
  const even = links.filter((_, i) => i % 2 === 0)
  items.push({
    clean: (ctx) =>
      `<path d="${E.path(chainPts.map((p) => [p[0] + 4, p[1] + 7]))}" fill="none" stroke="#000" stroke-opacity="0.55" stroke-width="7" stroke-linecap="round" filter="${ctx.blurBox(3)}"/>` +
      odd.map((l) => linkSvgClean(l.p, l.ang, false, 5.4)).join('') +
      even.map((l) => linkSvgClean(l.p, l.ang, true, 5.4)).join(''),
    ai: (ctx) =>
      `<g filter="${ctx.blurBox(3)}" opacity="0.75">${even.map((l) => linkSvgAi(l.p, l.ang, true, 5.4)).join('')}</g>` +
      odd.map((l) => linkSvgAi(l.p, l.ang, false, 5.4)).join('') +
      even.map((l) => linkSvgAi(l.p, l.ang, true, 5.4)).join(''),
  })

  // pendant: bail + bezel + gem
  const pend = pendant
  const bezelPts = (g, ox, oy, rot, k, sx = 1) => xf(g.outline.map((p) => [g.cx + (p[0] - g.cx) * k, g.cy + (p[1] - g.cy) * k]), ox, oy, rot, sx)
  items.push({
    clean: (ctx) => {
      const pg = pend.g
      const bez = bezelPts(pg, pend.ox, pend.oy, 0, 1.12)
      const prongs = pg.outline.filter((_, i) => i % 3 === 1).map((p) => xf([[g1(p, pg, 1.1)[0], g1(p, pg, 1.1)[1]]], pend.ox, pend.oy, 0)[0])
      const gl = ctx.uid('gl')
      ctx.def(`<radialGradient id="${gl}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#4DE0A0" stop-opacity="0.5"/><stop offset="1" stop-color="#4DE0A0" stop-opacity="0"/></radialGradient>`)
      return (
        `<ellipse cx="${S.r1(pend.ox + 6)}" cy="${S.r1(pend.oy + 18)}" rx="40" ry="62" fill="#000" opacity="0.5" filter="${ctx.blurBox(6)}"/>` +
        `<ellipse cx="${S.r1(pend.ox - 4)}" cy="${S.r1(pend.oy + 6)}" rx="104" ry="118" fill="url(#${gl})"/>` +
        `<ellipse cx="${S.r1(pend.ox)}" cy="${S.r1(pend.oy - 66)}" rx="6.5" ry="9" fill="none" stroke="#4d3510" stroke-width="4.4"/><ellipse cx="${S.r1(pend.ox)}" cy="${S.r1(pend.oy - 66)}" rx="6.5" ry="9" fill="none" stroke="#E2BE68" stroke-width="3"/>` +
        `<path d="${E.path(bez, true)}" fill="#8f6a22" stroke="#4d3510" stroke-width="2"/>` +
        `<path d="${E.path(bez, true)}" fill="none" stroke="#F3D98A" stroke-width="2.4" stroke-opacity="0.9"/>` +
        gemClean(pg, pend.ox, pend.oy, 0, EMERALD) +
        prongs.map((p) => `<circle cx="${S.r1(p[0])}" cy="${S.r1(p[1])}" r="3.2" fill="#E8C672" stroke="#6b4a14" stroke-width="1"/>`).join('') +
        star(pend.ox - 14, pend.oy - 22, 11) +
        star(pend.ox + 12, pend.oy + 18, 6, 0.8)
      )
    },
    ai: (ctx) => {
      const pg = pend.g
      const gm = gemAi(pg, pend.ox, pend.oy, 0)
      const bez = bezelPts(pg, pend.ox, pend.oy, 0, 1.12)
      return (
        `<g filter="${ctx.blurBox(8)}">${gm.glow}</g>` +
        `<ellipse cx="${S.r1(pend.ox)}" cy="${S.r1(pend.oy - 66)}" rx="6.5" ry="9" fill="none" stroke="${LUMEN}" stroke-width="2"/>` +
        `<path d="${E.path(bez, true)}" fill="#0c120d" stroke="${LUMEN}" stroke-width="2" stroke-opacity="0.9"/>` +
        gm.fill +
        star(pend.ox - 14, pend.oy - 22, 11)
      )
    },
    sil: () => E.path(bezelPts(pend.g, pend.ox, pend.oy, 0, 1.12), true),
  })

  // earrings
  for (const e of earrings) {
    const sx = e.sg
    const stud = [e.x, e.y0 + 8 * ES]
    const linkYs = [0, 1, 2, 3].map((k) => e.y0 + 24 * ES + k * 8 * ES)
    const gemC = [e.x + Math.sin(e.rot) * 8, e.y0 + 100 * ES]
    const bez = (k) => xf(earGem.outline.map((p) => [earGem.cx + (p[0] - earGem.cx) * k, earGem.cy + (p[1] - earGem.cy) * k]), gemC[0], gemC[1], e.rot, sx)
    const hookD = `M${e.x} ${e.y0 - 22 * ES}c0 ${-16 * ES} ${22 * ES} ${-18 * ES} ${22 * ES} ${-2 * ES}c0 ${10 * ES} ${-8 * ES} ${20 * ES} ${-22 * ES} ${24 * ES}`
    items.push({
      clean: (ctx) =>
        `<ellipse cx="${S.r1(gemC[0] + 18)}" cy="${S.r1(gemC[1] + 62)}" rx="${30 * ES * 0.8}" ry="${62 * ES * 0.8}" fill="#5a4a2c" opacity="0.28" filter="${ctx.blurBox(9)}"/>` +
        `<path d="${hookD}" fill="none" stroke="#6b4a14" stroke-width="${3.6 * ES * 0.9}" stroke-linecap="round"/><path d="${hookD}" fill="none" stroke="#E2BE68" stroke-width="${2.3 * ES * 0.9}" stroke-linecap="round"/>` +
        `<circle cx="${stud[0]}" cy="${stud[1]}" r="${14 * ES}" fill="#8f6a22" stroke="#4d3510" stroke-width="1.6"/><circle cx="${stud[0]}" cy="${stud[1]}" r="${12 * ES}" fill="none" stroke="#F3D98A" stroke-width="1.8"/>` +
        gemClean(earStud, stud[0], stud[1], 0, { dark: hex('#7aa7c4'), mid: hex('#d6eaf6'), light: hex('#ffffff') }) +
        linkYs.map((y, k) => linkSvgClean([e.x, y], Math.PI / 2, k % 2 === 0, 4 * ES * 0.9)).join('') +
        `<path d="${E.path(bez(1.14), true)}" fill="#8f6a22" stroke="#4d3510" stroke-width="1.8"/><path d="${E.path(bez(1.14), true)}" fill="none" stroke="#F3D98A" stroke-width="2" stroke-opacity="0.9"/>` +
        gemClean(earGem, gemC[0], gemC[1], e.rot, EMERALD, sx) +
        star(gemC[0] - 6 * sx, gemC[1] - 18 * ES, 8 * ES * 0.9) +
        star(stud[0] - 3, stud[1] - 3, 6, 0.9),
      ai: (ctx) => {
        const gm = gemAi(earGem, gemC[0], gemC[1], e.rot, sx)
        return (
          `<g filter="${ctx.blurBox(7)}">${gm.glow}<circle cx="${stud[0]}" cy="${stud[1]}" r="${14 * ES}" fill="${LUMEN}" fill-opacity="0.4"/></g>` +
          `<path d="${hookD}" fill="none" stroke="${LUMEN}" stroke-width="2" stroke-linecap="round"/>` +
          `<circle cx="${stud[0]}" cy="${stud[1]}" r="${14 * ES}" fill="#0c120d" stroke="${LUMEN}" stroke-width="2"/>` +
          gemAi(earStud, stud[0], stud[1], 0).fill +
          linkYs.map((y, k) => linkSvgAi([e.x, y], Math.PI / 2, k % 2 === 0, 4 * ES * 0.9)).join('') +
          `<path d="${E.path(bez(1.14), true)}" fill="#0c120d" stroke="${LUMEN}" stroke-width="1.8"/>` +
          gm.fill
        )
      },
    })
  }

  // HUD
  const hudItems = []
  const nj = bust.jOf(250)
  hudItems.push(hud.measure(bust.P(1, nj), bust.P(0, nj), { len: 70 }))
  const sj = bust.jOf(486)
  hudItems.push(hud.measure(bust.P(1, sj), bust.P(0, sj), { len: 40 }))
  hudItems.push(hud.vdim(CX - 400, 170, 790))
  hudItems.push(hud.bracket(pend.ox - 66, pend.oy - 88, 132, 176, 20))
  hudItems.push(hud.cross([pend.ox, pend.oy]))
  hudItems.push(hud.cross(chainPts[130]))
  hudItems.push(hud.cross(chainPts[470]))
  for (const e of earrings) {
    hudItems.push(hud.cross([e.x, e.y0 + 100 * ES]))
    hudItems.push(hud.bracket(e.x - 52, e.y0 - 38, 104, 250, 14, 0.7))
  }
  hudItems.push(hud.cross(bust.P(0.3, 0.55)))
  hudItems.push(hud.cross(bust.P(0.75, 0.8)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 300, h: 240 },
  })
}

function g1(p, pg, k) {
  return [pg.cx + (p[0] - pg.cx) * k, pg.cy + (p[1] - pg.cy) * k]
}
