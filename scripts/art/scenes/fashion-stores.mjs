// Fashion retail floor: a floor-standing clothing rail with hanging garments, and a mannequin in front.
import * as S from './_shared.mjs'
import { mannequin } from './_mannequin.mjs'
import { garment } from './_garments.mjs'

const { E, smooth, pchip, range, LUMEN, hud } = S

const TILT = 0.2
const CX = 600
const RAIL_Y = 142
const FLOOR_Y = 792

let G = null

function build() {
  const m = mannequin({ cx: CX, top: 172, h: 640, tilt: TILT, rows: 70, cols: 56 })
  const Y = m.Y

  // ---- mannequin dress ---------------------------------------------------------------------------
  const yTop = Y(205)
  const yHem = Y(742)
  const dA = pchip([[Y(500), m.A(Y(500)) * 1.035 + 1.4], [Y(560), 68], [Y(640), 62], [Y(700), 66], [yHem, 82]])
  const dB = pchip([[Y(500), m.B(Y(500)) * 1.035 + 1.4], [Y(560), 55], [Y(640), 50], [Y(700), 53], [yHem, 64]])
  const dress = S.sorMesh({
    y0: yTop,
    y1: yHem,
    A: (y) => (y < Y(500) ? m.A(y) * 1.035 + 1.4 : dA(y)),
    B: (y) => (y < Y(500) ? m.B(y) * 1.035 + 1.4 : dB(y)),
    cx: m.cxf,
    tilt: TILT,
    rows: 90,
    cols: 100,
    pleats: { n: 22, amp: (y) => 0.012 * smooth(Y(560), yHem, y), tw: (y) => 0.6 * smooth(Y(500), yHem, y) },
    yShift: (y, th) => {
      const t = th - Math.PI / 2
      const scoop = 30 * Math.exp(-Math.pow(t / 0.75, 2))
      const hem = 3 * smooth(yHem - 40, yHem, y) * Math.sin(10 * th)
      return scoop * (1 - smooth(yTop, yTop + 64, y)) + hem
    },
  })
  const belt = S.sorMesh({
    y0: Y(372),
    y1: Y(396),
    A: (y) => m.A(y) * 1.035 + 3.4,
    B: (y) => m.B(y) * 1.035 + 3.4,
    cx: m.cxf,
    tilt: TILT,
    rows: 4,
    cols: 70,
  })
  const base = S.sorMesh({
    y0: m.floorY - 2,
    y1: m.floorY + 12,
    A: () => 118,
    B: () => 118,
    cx: () => CX,
    tilt: TILT,
    rows: 3,
    cols: 60,
  })

  // ---- rail ---------------------------------------------------------------------------------------
  const xL = 168
  const xR = 1032
  const bar = S.tubeMesh((t) => [xL + (xR - xL) * t, RAIL_Y, 0], 5.2, { rows: 60, cols: 10, tilt: TILT })
  const uprights = [xL, xR].map((x) => S.tubeMesh((t) => [x, RAIL_Y + 4 + (770 - RAIL_Y) * t, 0], 4.6, { rows: 40, cols: 10, tilt: TILT }))
  const feet = [xL, xR].map((x) => S.tubeMesh((t) => [x - 58 + 116 * t, 778, 0], 4.2, { rows: 14, cols: 8, tilt: TILT }))

  // ---- garments -----------------------------------------------------------------------------------
  const defs = [
    { type: 'coat', x: 236, colour: '#B28E63', seed: 3, scale: 0.86, sheen: 0.12 },
    { type: 'blazer', x: 352, colour: '#26272C', seed: 7, scale: 0.98, sheen: 0.3 },
    { type: 'shirt', x: 468, colour: '#EDE5D3', seed: 11, scale: 1.0, sheen: 0.1 },
    { type: 'blazer', x: 736, colour: '#8D8A82', seed: 19, scale: 0.96, sheen: 0.14 },
    { type: 'dress', x: 852, colour: '#D8CBB0', seed: 23, scale: 0.92, sheen: 0.22 },
    { type: 'coat', x: 968, colour: '#383840', seed: 29, scale: 0.82, sheen: 0.2 },
  ].map((d) => ({ ...d, g: garment({ type: d.type, cx: d.x, y0: RAIL_Y + 36, colour: d.colour, seed: d.seed, scale: d.scale, sheen: d.sheen, railY: RAIL_Y, tilt: TILT }) }))

  return { m, dress, belt, base, bar, uprights, feet, defs }
}

export function scene(mode) {
  G ||= build()
  const { m, dress, belt, base, bar, uprights, feet, defs } = G

  const slats = (ctx) => {
    const out = []
    for (let x = 0; x <= 1200; x += 38) {
      out.push(`<rect x="${x}" y="0" width="2" height="704" fill="#6b5f48" opacity="0.07"/><rect x="${x + 2}" y="0" width="1.5" height="704" fill="#fff" opacity="0.38"/>`)
    }
    // a pale light wash from the upper left, plus a soft ledge
    const g = ctx.uid('wash')
    ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0.2"><stop offset="0" stop-color="#fff" stop-opacity="0.45"/><stop offset="0.6" stop-color="#fff" stop-opacity="0"/></linearGradient>`)
    out.push(`<rect width="1200" height="704" fill="url(#${g})"/>`)
    return out.join('')
  }

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#F4EFE4', '#E4DCCB'],
      floor: ['#DAD3C4', '#BBB3A1'],
      horizon: 704,
      spot: { x: 600, y: 380, r: 640, col: '#FFFFFF', op: 0.5 },
      vignette: 0.2,
      extra: (c) => slats(c),
    })

  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 11, glow: { x: 600, y: 450 }, floor: { x: CX, y: m.floorY + 6, r: 200, ry: 46 }, marks: 36 })

  const items = []
  // floor shadows
  items.push({
    clean: (c) =>
      S.groundShadow(c, CX + 8, m.floorY + 6, 160, 24, 1) +
      [168, 1032].map((x) => S.groundShadow(c, x + 14, 782, 56, 9, 0.6)).join('') +
      defs.map((d) => `<ellipse cx="${d.x + 22}" cy="${d.g.bbox.y1 + 80}" rx="${40}" ry="12" fill="#0d0d0c" opacity="0.0"/>`).join(''),
    ai: () => '',
  })

  const steel = { tone: 'steel', rows: [], cols: [], outline: 0.8, glow: false }
  const blackMat = S.fabric('#202024', { depth: 0.3, lift: 1.25, spec: 0.65, gloss: 36, rim: 0.5, fill: 0.2, specTint: 0.8 })
  // rail frame
  for (const f of feet) items.push(S.solid(f, { mat: blackMat, ai: { ...steel, tone: 'deep' }, seam: 1, scan: false }))
  for (const u of uprights) items.push(S.solid(u, { mat: blackMat, ai: { ...steel, tone: 'deep' }, seam: 1, scan: false }))
  items.push(S.dropShadow(bar, { dx: 6, dy: 10, std: 5, op: 0.22 }))
  items.push(S.solid(bar, { mat: blackMat, ai: { ...steel, tone: 'deep' }, seam: 1, scan: false }))

  // garments
  for (const d of defs) {
    items.push(S.dropShadow(d.g.back, { dx: 16, dy: 12, std: 9, op: 0.2 }))
    for (const it of d.g.items) items.push(it)
  }

  // mannequin
  items.push(
    S.solid(base, {
      mat: S.matte('#2A2A2E', { depth: 0.4, lift: 1.3, spec: 0.4, gloss: 30 }),
      ai: { tone: 'deep', rows: [0, 1], cols: range(0, 1, 30), colOp: 0.2, rowOp: 0.7 },
      scan: false,
    }),
  )
  items.push({
    clean: () => `<ellipse cx="${CX}" cy="${m.floorY - 2}" rx="118" ry="${118 * TILT}" fill="#3A3A40"/><ellipse cx="${CX}" cy="${m.floorY - 2}" rx="118" ry="${118 * TILT}" fill="none" stroke="#fff" stroke-opacity="0.25" stroke-width="1.5"/>`,
    ai: () => `<ellipse cx="${CX}" cy="${m.floorY - 2}" rx="118" ry="${118 * TILT}" fill="#0c0e0b" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="2"/>`,
  })
  // (the ellipse top face must sit under the base side quads: reorder)
  const last = items.pop()
  items.splice(items.length - 1, 0, last)

  for (const leg of m.legs) {
    items.push(
      S.solid(leg, {
        mat: E.MATERIALS.form,
        ai: { tone: 'form', rows: range(0, 1, 24), cols: range(0, 1, 7), rowOp: 0.28, colOp: 0.22 },
      }),
    )
  }
  for (const arm of m.arms) {
    items.push(
      S.solid(arm, {
        mat: E.MATERIALS.form,
        ai: { tone: 'form', rows: range(0, 1, 20), cols: range(0, 1, 5), rowOp: 0.28, colOp: 0.2 },
      }),
    )
  }
  items.push(
    S.solid(m.body, {
      mat: E.MATERIALS.form,
      ai: { tone: 'form', rows: range(0, 1, 34), cols: range(0, 1, 12), rowOp: 0.28, colOp: 0.2 },
    }),
  )
  items.push(
    S.solid(dress, {
      mat: S.fabric('#7A1F3A', { depth: 0.16, lift: 1.1, spec: 0.3, gloss: 18, rim: 0.34, fill: 0.2, specTint: 0.5, rimTint: 0.45 }),
      seam: 1.5,
      ai: { tone: 'dark', rows: range(0, 1, 44), cols: range(0, 1, 36), rowOp: 0.34, colOp: 0.3, outline: 0.45, hot: [{ row: 0.02, w: 2.6 }, { row: 1, w: 3 }, { row: 0.6, w: 2.2, op: 0.7 }] },
    }),
  )
  items.push(
    S.solid(belt, {
      mat: S.fabric('#17171A', { depth: 0.3, lift: 1.4, spec: 0.7, gloss: 36 }),
      ai: { tone: 'gold', rows: [0, 0.5, 1], cols: [], rowOp: 0.7 },
    }),
  )

  const hudItems = []
  const sj = m.body.jOf(m.Y(238))
  hudItems.push(hud.measure(m.body.P(1, sj), m.body.P(0, sj)))
  hudItems.push(hud.measure(belt.P(1, 0.5), belt.P(0, 0.5)))
  hudItems.push(hud.measure(dress.P(1, 1), dress.P(0, 1)))
  hudItems.push(hud.vdim(CX + 250, 172, m.floorY))
  const d3 = defs[1]
  hudItems.push(hud.bracket(d3.x - 92, 176, 184, d3.g.bbox.y1 - 176 + 30))
  const d5 = defs[4]
  hudItems.push(hud.bracket(d5.x - 92, 176, 184, d5.g.bbox.y1 - 176 + 30))
  for (const d of defs) hudItems.push(hud.cross([d.x, d.g.bbox.y0 + 22 + 150]))
  hudItems.push(hud.cross(dress.P(0.4, 0.5)))
  hudItems.push(hud.cross(dress.P(0.62, 0.3)))
  hudItems.push(hud.cross(dress.P(0.5, 0.8)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 330, h: 280 },
  })
}
