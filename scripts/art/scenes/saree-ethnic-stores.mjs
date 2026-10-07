// Saree & ethnic wear: a pleated magenta saree with gold zari borders and a hanging pallu on a mannequin,
// standing on a round display plinth in front of a tone-on-tone mandala.
import * as S from './_shared.mjs'
import { mannequin } from './_mannequin.mjs'

const { E, smooth, pchip, range, line, LUMEN, hud, hex, mix } = S

const CX = 570
const TILT = 0.22
const HEM = 812
const TAU = Math.PI * 2

const tri = (x) => Math.asin(0.93 * Math.sin(x)) / Math.asin(0.93)

const goldTone = (c) => mix(hex('#5a3c10'), hex('#f6dd90'), Math.min(1, S.luma(c) * 1.25))

function build() {
  const m = mannequin({ cx: CX, top: 88, h: 760, tilt: TILT, rows: 70, cols: 56 })
  const Y = m.Y

  // ---- pleated saree skirt ----------------------------------------------------------------------
  const sA = pchip([[384, 63], [440, 90], [520, 98], [640, 108], [740, 128], [812, 152]])
  const sB = pchip([[384, 52], [440, 66], [520, 70], [640, 76], [740, 90], [812, 102]])
  const PN = 17
  const y0 = 384
  const y1 = HEM
  const skirt = S.makeMesh(
    (i, j) => {
      const th = Math.PI * i
      const y = y0 + (y1 - y0) * j
      const env = smooth(0.1, 0.55, Math.sin(th))
      const amp = 0.1 * smooth(396, 520, y) * (0.6 + 0.4 * smooth(520, 800, y))
      const tw = 0.4 * smooth(396, 812, y)
      const k = 1 + amp * env * tri(PN * th + tw)
      const sway = 10 * Math.sin((y - 384) / 140) * 0
      const hemWave = 2.6 * smooth(740, 812, y) * Math.sin(PN * th + 0.6) * env
      const lift = -6 * smooth(740, 812, y) * Math.cos(th)
      return [CX + sway + sA(y) * k * Math.cos(th), y + hemWave + lift, sB(y) * k * Math.sin(th)]
    },
    { rows: 80, cols: 150, tilt: TILT },
  )
  skirt.jOf = (y) => (y - y0) / (y1 - y0)

  // saree waist/zari border band near the hem
  const hemBand = S.makeMesh(
    (i, j) => {
      const th = Math.PI * i
      const yy = 760 + 52 * j
      const k = 1.02 + 0.075 * 0
      const env = smooth(0.1, 0.55, Math.sin(th))
      const kk = 1 + 0.075 * 1.0 * 0.0
      const hemWave = 8 * smooth(740, 812, yy) * Math.sin(PN * th + 0.6) * env
      const lift = -8 * smooth(740, 812, yy) * Math.cos(th)
      // follow the skirt surface (pleats included) by sampling it
      const p = skirt.P3(i, (yy - y0) / (y1 - y0))
      return [CX + (p[0] - CX) * 1.014, -p[1], p[2] * 1.014 + 0.5]
    },
    { rows: 6, cols: 150, tilt: TILT },
  )

  // blouse (gold brocade)
  const blouse = S.sorMesh({
    y0: Y(226),
    y1: Y(372),
    A: (y) => m.A(y) * 1.03 + 1.5,
    B: (y) => m.B(y) * 1.03 + 1.5,
    cx: m.cxf,
    tilt: TILT,
    rows: 34,
    cols: 90,
    yShift: (y, th) => {
      const t = th - Math.PI / 2
      const scoop = 50 * Math.exp(-Math.pow(t / 0.62, 2))
      return scoop * (1 - smooth(Y(226), Y(226) + 64, y))
    },
  })

  // belt
  const belt = S.sorMesh({
    y0: 378,
    y1: 396,
    A: (y) => sA(Math.max(y, 384)) * 1.03 + 2,
    B: (y) => sB(Math.max(y, 384)) * 1.03 + 2,
    cx: () => CX,
    tilt: TILT,
    rows: 4,
    cols: 90,
  })

  // diagonal pallu band across the chest, from left waist to the right shoulder
  const bandBody = (y) => ({ a: m.A(y) * 1.085 + 2, b: m.B(y) * 1.085 + 2 })
  const band = S.makeMesh(
    (i, t) => {
      const th = Math.PI * (0.84 - 0.78 * t)
      const w = 66 - 18 * t
      const yc = 398 - 132 * Math.pow(t, 0.92)
      const y = yc + (i - 0.5) * w
      const { a, b } = bandBody(Math.max(y, 240))
      const rip = 1 + 0.012 * Math.sin(i * 11 + t * 10) + 0.01 * Math.sin(i * 23 - t * 6)
      return [m.cxf(y) + a * rip * Math.cos(th), y, b * rip * Math.sin(th)]
    },
    { rows: 100, cols: 28, tilt: TILT },
  )

  // hanging pallu: panel behind the body, falling from the right shoulder
  const PTOP = 262
  const PBOT = 640
  const pallu = S.makeMesh(
    (i, j) => {
      const xc = CX + 100 + 34 * smooth(0, 1, j) + 5 * Math.sin(j * 4.2)
      const hw = 44 + 52 * smooth(0, 0.7, j) + 8 * j
      const nf = 7
      const foldAmp = 4 + 16 * smooth(0.04, 0.5, j)
      const f = tri(nf * Math.PI * (i + 0.04 * Math.sin(j * 6)) + 0.4)
      const x = xc + (i - 0.5) * 2 * hw + 2.5 * f * smooth(0.1, 1, j)
      const hemY = 22 * Math.sin(Math.PI * i) * 0 + 20 * (i - 0.5)
      const y = PTOP + (PBOT - PTOP) * j + hemY * smooth(0.6, 1, j)
      const z = -22 + foldAmp * f
      return [x, y, z]
    },
    { rows: 140, cols: 100, tilt: TILT },
  )

  // plinth
  const plinth = S.sorMesh({
    y0: HEM,
    y1: HEM + 26,
    A: () => 250,
    B: () => 250,
    cx: () => CX,
    tilt: TILT,
    rows: 4,
    cols: 100,
  })

  return { m, skirt, hemBand, blouse, belt, band, pallu, plinth, y0, y1 }
}

let G = null

// ---- motifs -----------------------------------------------------------------------------------
const PAISLEY = (stroke, op, fill = 'none') => (sw) =>
  `<g fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"><path d="M0.5 0.1C0.82 0.28 0.86 0.66 0.52 0.9C0.18 0.78 0.18 0.34 0.5 0.1Z"/><path d="M0.5 0.34C0.62 0.44 0.62 0.62 0.52 0.7"/><circle cx="0.5" cy="0.18" r="0.05"/></g>`
const DIAMOND = (stroke, op) => (sw) =>
  `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-opacity="${op}" stroke-linejoin="round"><path d="M0.5 0.08L0.92 0.5L0.5 0.92L0.08 0.5Z"/><path d="M0.5 0.3L0.7 0.5L0.5 0.7L0.3 0.5Z"/><circle cx="0.5" cy="0.5" r="0.06" fill="${stroke}" stroke="none"/></g>`

function motifRow(mesh, j0, j1, n, tile, px = 1.1, i0 = 0.06, i1 = 0.94, minW = 2.5) {
  const out = []
  for (let k = 0; k < n; k++) out.push(S.motif(mesh, i0 + ((i1 - i0) * k) / n, i0 + ((i1 - i0) * (k + 1)) / n, j0, j1, tile, { minW, px }))
  return out.join('')
}

export function scene(mode) {
  G ||= build()
  const { m, skirt, hemBand, blouse, belt, band, pallu, plinth } = G

  const MAG = '#8E1A56'
  const sareeMat = S.satin(MAG, { depth: 0.16, lift: 1.2, spec: 0.55, gloss: 26, rim: 0.4, fill: 0.14, specTint: 0.6, rimTint: 0.45 })
  const sareeMatDeep = S.satin('#7a1448', { depth: 0.14, lift: 1.3, spec: 0.5, gloss: 24, rim: 0.4, fill: 0.14, specTint: 0.55, rimTint: 0.4 })
  const goldMat = S.metalMat('#D6B05A', { depth: 0.3 })
  const brocade = S.satin('#B58A3C', { depth: 0.3, lift: 1.0, spec: 0.45, gloss: 24, rim: 0.35, fill: 0.2 })
  const stone = S.matte('#DDD4C2', { depth: 0.6, lift: 1.0 })

  // clean colour functions (gold border regions)
  const palluColour = (c, q) => {
    const u = q.u
    const v = q.v
    const edge = u < 0.055 || u > 0.945
    const edgeLine = (u > 0.075 && u < 0.09) || (u > 0.91 && u < 0.925)
    const band1 = (v > 0.78 && v < 0.795) || (v > 0.925 && v < 0.94)
    const zari = v > 0.945
    if (edge || band1 || zari) return goldTone(c)
    if (edgeLine) return mix(c, goldTone(c), 0.7)
    return c
  }
  const palluAiColour = (c, q) => {
    const u = q.u
    const v = q.v
    if (u < 0.055 || u > 0.945 || (v > 0.78 && v < 0.795) || (v > 0.925 && v < 0.94) || v > 0.945) return mix(c, hex('#6c7a2c'), 0.55)
    return c
  }
  const bandColour = (c, q) => (q.u < 0.09 || q.u > 0.91 ? goldTone(c) : c)
  const bandAiColour = (c, q) => (q.u < 0.09 || q.u > 0.91 ? mix(c, hex('#6c7a2c'), 0.55) : c)
  const hemColour = (c, q) => {
    const v = q.v
    if (v < 0.12 || (v > 0.34 && v < 0.42) || v > 0.9) return goldTone(c)
    return mix(c, goldTone(c), 0.18)
  }
  const hemAiColour = (c, q) => {
    const v = q.v
    return v < 0.12 || (v > 0.34 && v < 0.42) || v > 0.9 ? mix(c, hex('#6c7a2c'), 0.55) : c
  }

  const mandala = (ctx, clean) => {
    const cxm = CX + 10
    const cym = 420
    const out = []
    const stroke = clean ? '#9a7f55' : LUMEN
    const base = clean ? 0.2 : 0.16
    for (let k = 0; k < 7; k++) {
      const r = 120 + k * 48
      out.push(`<circle cx="${cxm}" cy="${cym}" r="${r}" fill="none" stroke="${stroke}" stroke-opacity="${(base - k * 0.014).toFixed(3)}" stroke-width="${k % 2 ? 1.2 : 2}"${k % 3 === 1 ? ' stroke-dasharray="2 9"' : ''}/>`)
    }
    // petal ring
    const n = 24
    for (let k = 0; k < n; k++) {
      const a = (k / n) * TAU
      const r0 = 168
      const r1 = 216
      const x0 = cxm + Math.cos(a) * r0
      const y0 = cym + Math.sin(a) * r0
      const x1 = cxm + Math.cos(a) * r1
      const y1 = cym + Math.sin(a) * r1
      const nx = -Math.sin(a) * 9
      const ny = Math.cos(a) * 9
      out.push(`<path d="M${x0.toFixed(1)} ${y0.toFixed(1)}Q${(x1 + nx).toFixed(1)} ${(y1 + ny).toFixed(1)} ${(cxm + Math.cos(a) * 232).toFixed(1)} ${(cym + Math.sin(a) * 232).toFixed(1)}Q${(x1 - nx).toFixed(1)} ${(y1 - ny).toFixed(1)} ${x0.toFixed(1)} ${y0.toFixed(1)}Z" fill="none" stroke="${stroke}" stroke-opacity="${(base + 0.02).toFixed(3)}" stroke-width="1.4"/>`)
    }
    return out.join('')
  }

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#F2E8D6', '#E3D4B8'],
      floor: ['#D9CBAE', '#BFAE8E'],
      horizon: 706,
      spot: { x: 580, y: 360, r: 600, col: '#FFF4DA', op: 0.8 },
      vignette: 0.24,
      extra: (c) => {
        const g = c.uid('halo')
        c.def(`<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F9F0DD" stop-opacity="0.95"/><stop offset="0.8" stop-color="#EBDCBE" stop-opacity="0.7"/><stop offset="1" stop-color="#E0CEAA" stop-opacity="0.5"/></radialGradient>`)
        return `<circle cx="${CX + 10}" cy="420" r="262" fill="url(#${g})"/>` + mandala(c, true)
      },
    })
  const aiBack = (ctx) =>
    S.aiBackdrop(ctx, {
      seed: 52,
      glow: { x: CX, y: 440 },
      floor: { x: CX, y: HEM + 8, r: 262, ry: 60 },
      marks: 34,
      extra: (c) => mandala(c, false),
    })

  const items = []
  items.push({ clean: (c) => S.groundShadow(c, CX + 24, HEM + 30, 270, 46, 0.9), ai: () => '' })

  // plinth
  const plinthTop = (clean) => (ctx) => {
    const g = ctx.uid('pt')
    if (clean) {
      ctx.def(`<radialGradient id="${g}" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#F1EADB"/><stop offset="1" stop-color="#CFC4AE"/></radialGradient>`)
      return `<ellipse cx="${CX}" cy="${HEM}" rx="250" ry="${250 * TILT}" fill="url(#${g})"/><ellipse cx="${CX}" cy="${HEM}" rx="250" ry="${250 * TILT}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/><ellipse cx="${CX}" cy="${HEM}" rx="226" ry="${226 * TILT}" fill="none" stroke="#B59B66" stroke-opacity="0.55" stroke-width="2"/>`
    }
    ctx.def(`<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="#1c2214"/><stop offset="1" stop-color="#0c0e0b"/></radialGradient>`)
    return `<ellipse cx="${CX}" cy="${HEM}" rx="250" ry="${250 * TILT}" fill="url(#${g})"/><ellipse cx="${CX}" cy="${HEM}" rx="250" ry="${250 * TILT}" fill="none" stroke="${LUMEN}" stroke-opacity="0.85" stroke-width="2.4"/><ellipse cx="${CX}" cy="${HEM}" rx="226" ry="${226 * TILT}" fill="none" stroke="${LUMEN}" stroke-opacity="0.4" stroke-width="1.4" stroke-dasharray="2 8"/>`
  }
  items.push(
    S.solid(plinth, {
      mat: stone,
      ai: { tone: 'deep', rows: [0, 1], cols: range(0, 1, 40), colOp: 0.22, rowOp: 0.7 },
      scan: false,
    }),
  )
  // the top face is drawn *under* the side quads' ring so draw it first via a wrapper item
  items.splice(items.length - 1, 0, { clean: plinthTop(true), ai: plinthTop(false) })

  // pallu panel behind the body
  items.push(S.dropShadow(pallu, { dx: 10, dy: 8, std: 8, op: 0.28 }))
  items.push(
    S.solid(pallu, {
      mat: sareeMatDeep,
      colour: palluColour,
      seam: 1.4,
      ai: { tone: 'dark', colour: palluAiColour, rows: range(0, 1, 34), cols: range(0, 1, 24), rowOp: 0.3, colOp: 0.34, outline: 0.55, hot: [{ row: 0.78, w: 2.4 }, { row: 0.94, w: 2.4 }] },
      after: () =>
        motifRow(pallu, 0.8, 0.925, 8, PAISLEY('#F3D98A', 0.95, 'rgba(243,217,138,0.18)'), 1.1) +
        motifRow(pallu, 0.6, 0.72, 8, DIAMOND('#E9C873', 0.55), 1, 0.12, 0.88),
      aiAfter: () => motifRow(pallu, 0.8, 0.925, 8, PAISLEY(LUMEN, 0.8), 1.1) + motifRow(pallu, 0.6, 0.72, 8, DIAMOND(LUMEN, 0.4), 1, 0.12, 0.88),
    }),
  )

  // mannequin body
  items.push(
    S.solid(m.body, {
      mat: E.MATERIALS.form,
      ai: { tone: 'form', rows: range(0, 1, 34), cols: range(0, 1, 12), rowOp: 0.28, colOp: 0.2 },
    }),
  )
  // blouse
  items.push(
    S.solid(blouse, {
      mat: brocade,
      ai: { tone: 'gold', rows: range(0, 1, 10), cols: range(0, 1, 26), rowOp: 0.45, colOp: 0.35, outline: 0.7 },
      after: () => motifRow(blouse, 0.5, 0.9, 20, DIAMOND('#6B4A1B', 0.55), 0.9, 0, 1, 3) + `<path d="${E.path(blouse.rowLine(0, 100))}" fill="none" stroke="#F4DB8D" stroke-width="2.2"/>`,
    }),
  )

  // skirt
  items.push(
    S.solid(skirt, {
      mat: sareeMat,
      seam: 1.5,
      ai: {
        tone: 'dark',
        rows: range(0, 1, 32),
        cols: range(0, 1, 52),
        rowOp: 0.3,
        colOp: 0.34,
        outline: 0.45,
        hot: [{ row: 0.03, w: 2.8 }, { row: 1, w: 3 }],
      },
    }),
  )
  items.push(
    S.solid(hemBand, {
      mat: sareeMat,
      colour: hemColour,
      seam: 1.4,
      ai: { tone: 'dark', colour: hemAiColour, rows: [0, 0.34, 0.42, 1], cols: [], rowOp: 0.8, rowW: 1.4, outline: 0.2 },
      after: () => motifRow(hemBand, 0.46, 0.88, 36, PAISLEY('#F3D98A', 0.95, 'rgba(243,217,138,0.2)'), 1, 0, 1, 3),
      aiAfter: () => motifRow(hemBand, 0.46, 0.88, 36, PAISLEY(LUMEN, 0.8), 1, 0, 1, 3),
    }),
  )

  // belt
  items.push(
    S.solid(belt, {
      mat: goldMat,
      ai: { tone: 'gold', rows: [0, 0.5, 1], cols: [], rowOp: 0.7 },
    }),
  )

  // diagonal band over the chest
  items.push(
    S.solid(band, {
      mat: sareeMat,
      colour: bandColour,
      seam: 1.4,
      ai: { tone: 'dark', colour: bandAiColour, rows: range(0, 1, 40), cols: [0.09, 0.3, 0.5, 0.7, 0.91], rowOp: 0.28, colOp: 0.55, outline: 0.7 },
    }),
  )

  const hudItems = []
  const bj = m.body.jOf(m.Y(238))
  hudItems.push(hud.measure(m.body.P(1, bj), m.body.P(0, bj)))
  hudItems.push(hud.measure(belt.P(1, 0.5), belt.P(0, 0.5)))
  hudItems.push(hud.measure(skirt.P(1, 0.62), skirt.P(0, 0.62)))
  hudItems.push(hud.measure(skirt.P(1, 1), skirt.P(0, 1), { len: 70 }))
  hudItems.push(hud.vdim(CX - 330, 88, HEM))
  for (const [mesh, i, j] of [[skirt, 0.45, 0.3], [skirt, 0.62, 0.7], [band, 0.5, 0.5], [pallu, 0.5, 0.35], [pallu, 0.4, 0.85], [skirt, 0.25, 0.5], [blouse, 0.3, 0.5]]) hudItems.push(hud.cross(mesh.P(i, j)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 400, h: 240 },
  })
}
