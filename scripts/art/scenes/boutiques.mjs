// Boutique vignette: a tailor's form in an emerald dress, a brass-framed arched mirror, a wall-mounted
// brass rail with two garments, and a little velvet stool.
import * as S from './_shared.mjs'
import { dressForm } from './_mannequin.mjs'
import { garment } from './_garments.mjs'

const { E, smooth, pchip, range, LUMEN, hud } = S

const TILT = 0.2
const CX = 610
const FLOOR = 792
const TAU = Math.PI * 2

// mirror
const MX = 300
const MR = 128
const MB = 740
const MTOP = 124
const MARC_Y = MTOP + MR
const MH1 = MB - MARC_Y
const MARC = Math.PI * MR
const MLEN = 2 * MH1 + MARC
function mirrorPath(R) {
  return (s) => {
    const r = R
    if (s < MH1) return [MX - r, MB - s]
    if (s < MH1 + MARC) {
      const a = Math.PI - ((s - MH1) / MARC) * Math.PI
      return [MX + r * Math.cos(a), MARC_Y - r * Math.sin(a)]
    }
    return [MX + r, MARC_Y + (s - MH1 - MARC)]
  }
}
const mirrorGlassD = (R) => {
  const pts = []
  const p = mirrorPath(R)
  for (let k = 0; k <= 140; k++) pts.push(p((k / 140) * MLEN))
  return E.path(pts, true)
}

let G = null

function build() {
  const f = dressForm({ cx: CX, top: 117, h: 700, tilt: TILT, rows: 60, cols: 56, ws: 0.9 })
  const Y = f.Y

  // dress
  const yTop = Y(194)
  const yHem = Y(748)
  const bodice = S.sorMesh({
    y0: yTop,
    y1: Y(412),
    A: (y) => f.A(y) * 1.04 + 1.6,
    B: (y) => f.B(y) * 1.04 + 1.6,
    cx: () => CX,
    tilt: TILT,
    rows: 40,
    cols: 90,
    yShift: (y, th) => {
      const t = th - Math.PI / 2
      return 20 * Math.exp(-Math.pow(t / 0.8, 2)) * (1 - smooth(yTop, yTop + 54, y))
    },
  })
  const sA = pchip([[Y(385), 50], [Y(440), 66], [Y(520), 76], [Y(620), 88], [yHem, 108]])
  const sB = pchip([[Y(385), 41], [Y(440), 54], [Y(520), 61], [Y(620), 70], [yHem, 86]])
  const PN = 15
  const skirt = S.sorMesh({
    y0: Y(385),
    y1: yHem,
    A: sA,
    B: sB,
    cx: () => CX,
    tilt: TILT,
    rows: 70,
    cols: 110,
    pleats: { n: PN, amp: (y) => 0.036 * smooth(Y(420), Y(600), y), tw: (y) => 0.5 * smooth(Y(420), yHem, y) },
    yShift: (y, th) => 4 * Math.pow(smooth(yHem - 70, yHem, y), 2) * Math.sin(PN * th + 0.5) * (0.3 + 0.7 * Math.sin(th)),
  })
  const belt = S.sorMesh({
    y0: Y(372),
    y1: Y(400),
    A: (y) => sA(Math.max(y, Y(385))) * 1.02 + 2.4,
    B: (y) => sB(Math.max(y, Y(385))) * 1.02 + 2.4,
    cx: () => CX,
    tilt: TILT,
    rows: 4,
    cols: 70,
  })
  const base = S.sorMesh({ y0: f.floorY - 2, y1: f.floorY + 11, A: () => 104, B: () => 104, cx: () => CX, tilt: TILT, rows: 3, cols: 60 })
  const pole = S.tubeMesh((t) => [CX, Y(545) - 6 + (f.floorY - Y(545)) * t, 0], 5.4, { rows: 30, cols: 10, tilt: TILT })

  // mirror frame
  const frame = S.tubeMesh((t) => {
    const p = mirrorPath(MR + 5)(t * MLEN)
    return [p[0], p[1], 0]
  }, 6.8, { rows: 160, cols: 10, tilt: TILT })
  const frameBar = S.tubeMesh((t) => [MX - MR - 5 + 2 * (MR + 5) * t, MB, 0], 6.8, { rows: 20, cols: 10, tilt: TILT })

  // wall rail + garments
  const RAIL_Y = 246
  const bar = S.tubeMesh((t) => [748 + 316 * t, RAIL_Y, 0], 5.4, { rows: 40, cols: 10, tilt: TILT })
  const gs = [
    garment({ type: 'coat', cx: 842, y0: RAIL_Y + 36, colour: '#C4A687', seed: 5, scale: 0.78, sheen: 0.14, railY: RAIL_Y, tilt: TILT }),
    garment({ type: 'dress', cx: 968, y0: RAIL_Y + 36, colour: '#EADFCB', seed: 9, scale: 0.8, sheen: 0.24, railY: RAIL_Y, tilt: TILT }),
  ]

  // stool
  const SX = 972
  const seatA = pchip([[726, 36], [730, 43], [742, 46], [752, 42], [758, 36]])
  const seat = S.sorMesh({ y0: 726, y1: 758, A: seatA, B: seatA, cx: () => SX, tilt: TILT, rows: 14, cols: 50 })
  const legs = [-1, 1].map((sg) => S.tubeMesh((t) => [SX + sg * (28 + 20 * t), 760 + 46 * t, 4], 3.6, { rows: 12, cols: 8, tilt: TILT }))
  const legC = S.tubeMesh((t) => [SX + 4 * t, 762 + 40 * t, 24], 3.6, { rows: 12, cols: 8, tilt: TILT })

  return { f, bodice, skirt, belt, base, pole, frame, frameBar, bar, gs, seat, legs, legC, yHem }
}

export function scene(mode) {
  G ||= build()
  const { f, bodice, skirt, belt, base, pole, frame, frameBar, bar, gs, seat, legs, legC } = G
  const Y = f.Y

  const brass = S.metalMat('#C9A15B', { depth: 0.28, lift: 1.1 })
  const brassAi = { tone: 'gold', rows: [], cols: [], outline: 0.8, glow: false }
  const blackMat = S.fabric('#222226', { depth: 0.3, lift: 1.3, spec: 0.6, gloss: 34, rim: 0.5, fill: 0.2 })

  const wall = (ctx) => {
    const out = []
    // chair rail + panelling
    const g = ctx.uid('rail')
    ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3EEE2"/><stop offset="1" stop-color="#C7BDA8"/></linearGradient>`)
    out.push(`<rect y="468" width="1200" height="14" fill="url(#${g})"/><rect y="482" width="1200" height="10" fill="#2a2418" opacity="0.14" filter="${ctx.blur(5)}"/>`)
    for (let x = -10; x < 1200; x += 250) {
      out.push(`<rect x="${x + 22}" y="508" width="206" height="170" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="2"/><rect x="${x + 24}" y="510" width="206" height="170" fill="none" stroke="#5c5038" stroke-opacity="0.2" stroke-width="2"/>`)
    }
    return out.join('')
  }
  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#D9D1C0', '#C9BFAA'],
      floor: ['#D6CCB6', '#B8AC93'],
      horizon: 700,
      spot: { x: 620, y: 360, r: 620, col: '#FFF6E2', op: 0.62 },
      vignette: 0.3,
      extra: (c) => wall(c),
    })
  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 77, glow: { x: 610, y: 450 }, floor: { x: CX, y: f.floorY + 6, r: 230, ry: 50 }, marks: 36 })

  const items = []

  // ----- mirror ---------------------------------------------------------------------------------
  items.push({
    clean: (ctx) => {
      const gg = ctx.uid('glass')
      const cid = ctx.uid('mc')
      ctx.def(`<linearGradient id="${gg}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF2EF"/><stop offset="0.5" stop-color="#D3DAD6"/><stop offset="1" stop-color="#B9C2BF"/></linearGradient>`)
      ctx.def(`<clipPath id="${cid}"><path d="${mirrorGlassD(MR)}"/></clipPath>`)
      const d = mirrorGlassD(MR)
      return (
        `<path d="${d}" fill="#2a2418" opacity="0.28" transform="translate(16 12)" filter="${ctx.blur(12)}"/>` +
        `<path d="${d}" fill="url(#${gg})"/>` +
        `<g clip-path="url(#${cid})">` +
        `<path d="M${MX - 150} ${MB}L${MX - 40} ${MTOP}L${MX + 20} ${MTOP}L${MX - 90} ${MB}Z" fill="#fff" opacity="0.5"/>` +
        `<path d="M${MX + 10} ${MB}L${MX + 120} ${MTOP}L${MX + 150} ${MTOP}L${MX + 40} ${MB}Z" fill="#fff" opacity="0.28"/>` +
        `<rect x="${MX - 140}" y="${MB - 120}" width="280" height="130" fill="#6a5d46" opacity="0.14" filter="${ctx.blur(26)}"/>` +
        `</g>` +
        `<path d="${d}" fill="none" stroke="#6a5d46" stroke-opacity="0.35" stroke-width="3" filter="${ctx.blurBox(2)}"/>` +
        S.groundShadow(ctx, MX + 8, MB + 10, MR + 10, 10, 0.7)
      )
    },
    ai: (ctx) => {
      const gg = ctx.uid('glass')
      const cid = ctx.uid('mc')
      ctx.def(`<linearGradient id="${gg}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#162024"/><stop offset="1" stop-color="#0b0f11"/></linearGradient>`)
      ctx.def(`<clipPath id="${cid}"><path d="${mirrorGlassD(MR)}"/></clipPath>`)
      const d = mirrorGlassD(MR)
      const streaks = []
      for (let k = -8; k < 14; k++) streaks.push(`<line x1="${MX - 190 + k * 26}" y1="${MB}" x2="${MX - 30 + k * 26}" y2="${MTOP}" stroke="${LUMEN}" stroke-opacity="${k % 5 === 0 ? 0.32 : 0.1}" stroke-width="${k % 5 === 0 ? 2 : 1.2}"/>`)
      return (
        `<path d="${d}" fill="url(#${gg})"/><g clip-path="url(#${cid})">${streaks.join('')}</g>` +
        `<path d="${d}" fill="none" stroke="${LUMEN}" stroke-opacity="0.35" stroke-width="7" filter="${ctx.blurBox(5)}"/><path d="${d}" fill="none" stroke="${LUMEN}" stroke-opacity="0.9" stroke-width="2"/>`
      )
    },
    sil: () => mirrorGlassD(MR),
    scan: false,
  })
  items.push(S.solid(frame, { mat: brass, ai: { ...brassAi, tone: 'gold' }, seam: 1, scan: false }))
  items.push(S.solid(frameBar, { mat: brass, ai: { ...brassAi, tone: 'gold' }, seam: 1, scan: false }))

  // ----- rail + garments ----------------------------------------------------------------------------
  items.push({
    clean: () => [756, 1056].map((x) => `<circle cx="${x}" cy="246" r="14" fill="#B8924F"/><circle cx="${x}" cy="246" r="14" fill="none" stroke="#fff" stroke-opacity="0.45" stroke-width="1.5"/><circle cx="${x - 3}" cy="${243}" r="5" fill="#F3DFA6" opacity="0.7"/>`).join(''),
    ai: () => [756, 1056].map((x) => `<circle cx="${x}" cy="246" r="14" fill="#0e1210" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="2"/>`).join(''),
  })
  items.push(S.dropShadow(bar, { dx: 6, dy: 9, std: 5, op: 0.24 }))
  items.push(S.solid(bar, { mat: brass, ai: { ...brassAi }, seam: 1, scan: false }))
  for (const g of gs) {
    items.push(S.dropShadow(g.back, { dx: 14, dy: 11, std: 9, op: 0.24 }))
    for (const it of g.items) items.push(it)
  }

  // ----- floor: rug + shadows --------------------------------------------------------------------
  items.push({
    clean: (ctx) => {
      const rg = ctx.uid('rug')
      ctx.def(`<radialGradient id="${rg}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#F1EADA"/><stop offset="1" stop-color="#E0D6C0"/></radialGradient>`)
      const cy = f.floorY + 8
      return (
        `<ellipse cx="${CX + 6}" cy="${cy + 6}" rx="320" ry="68" fill="#2a2418" opacity="0.22" filter="${ctx.blur(10)}"/>` +
        `<ellipse cx="${CX}" cy="${cy}" rx="318" ry="66" fill="url(#${rg})"/>` +
        [0.9, 0.8, 0.6].map((k, i) => `<ellipse cx="${CX}" cy="${cy}" rx="${318 * k}" ry="${66 * k}" fill="none" stroke="${i === 0 ? '#B8924F' : '#A89A7A'}" stroke-opacity="${i === 0 ? 0.7 : 0.3}" stroke-width="${i === 0 ? 2.4 : 1.4}"/>`).join('') +
        S.groundShadow(ctx, CX + 6, f.floorY + 8, 120, 15, 1)
      )
    },
    ai: () => '',
  })

  // ----- dress form ------------------------------------------------------------------------------
  items.push({
    clean: () => `<ellipse cx="${CX}" cy="${f.floorY - 2}" rx="104" ry="${104 * TILT}" fill="#3A3A40"/><ellipse cx="${CX}" cy="${f.floorY - 2}" rx="104" ry="${104 * TILT}" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.5"/>`,
    ai: () => `<ellipse cx="${CX}" cy="${f.floorY - 2}" rx="104" ry="${104 * TILT}" fill="#0c0e0b" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="2"/>`,
  })
  items.push(S.solid(base, { mat: blackMat, ai: { tone: 'deep', rows: [0, 1], cols: range(0, 1, 28), colOp: 0.2, rowOp: 0.7 }, scan: false }))
  items.push(S.solid(pole, { mat: brass, ai: { ...brassAi }, seam: 1, scan: false }))
  items.push(
    S.solid(f.body, {
      mat: S.fabric('#D9CDB4', { depth: 0.5, lift: 1.05, spec: 0.1, gloss: 10, rim: 0.2, fill: 0.3 }),
      ai: { tone: 'form', rows: range(0, 1, 30), cols: range(0, 1, 12), rowOp: 0.28, colOp: 0.2 },
    }),
  )
  const EM = '#1F5A43'
  const dressMat = S.fabric(EM, { depth: 0.12, lift: 1.28, spec: 0.38, gloss: 20, rim: 0.34, fill: 0.16, specTint: 0.55, rimTint: 0.45 })
  items.push(
    S.solid(skirt, {
      mat: dressMat,
      seam: 1.5,
      ai: { tone: 'dark', rows: range(0, 1, 38), cols: range(0, 1, 40), rowOp: 0.32, colOp: 0.3, outline: 0.45, hot: [{ row: 1, w: 3 }, { row: 0.45, w: 2.2, op: 0.7 }] },
    }),
  )
  items.push(
    S.solid(bodice, {
      mat: dressMat,
      seam: 1.4,
      ai: { tone: 'dark', rows: range(0, 1, 18), cols: range(0, 1, 30), rowOp: 0.38, colOp: 0.34, outline: 0.6, hot: [{ row: 0.02, w: 2.6 }] },
      after: () =>
        [0.3, 0.7].map((i) => `<path d="${E.path(bodice.colLine(i, 60).filter((p, k) => k > 6))}" fill="none" stroke="#06140e" stroke-opacity="0.45" stroke-width="1.4"/>`).join('') +
        `<path d="${E.path(bodice.rowLine(0, 100))}" fill="none" stroke="#C9A15B" stroke-opacity="0.9" stroke-width="2"/>`,
    }),
  )
  items.push(
    S.solid(belt, {
      mat: S.fabric('#18181B', { depth: 0.3, lift: 1.4, spec: 0.7, gloss: 36 }),
      ai: { tone: 'gold', rows: [0, 0.5, 1], cols: [], rowOp: 0.7 },
      after: () => {
        const p = belt.P(0.5, 0.5)
        return `<rect x="${S.r1(p[0] - 11)}" y="${S.r1(p[1] - 8)}" width="22" height="16" rx="2.5" fill="#D6B05A" stroke="#7a5c24" stroke-width="1.2"/><rect x="${S.r1(p[0] - 6)}" y="${S.r1(p[1] - 4)}" width="12" height="8" rx="1.5" fill="#18181B"/>`
      },
      aiAfter: () => {
        const p = belt.P(0.5, 0.5)
        return `<rect x="${S.r1(p[0] - 11)}" y="${S.r1(p[1] - 8)}" width="22" height="16" rx="2.5" fill="none" stroke="${LUMEN}" stroke-width="2"/>`
      },
    }),
  )

  // ----- stool --------------------------------------------------------------------------------------
  items.push({ clean: (ctx) => S.groundShadow(ctx, 982, 810, 60, 10, 0.9), ai: () => '' })
  for (const l of [...legs, legC]) items.push(S.solid(l, { mat: brass, ai: { ...brassAi }, seam: 1, scan: false }))
  items.push(
    S.solid(seat, {
      mat: S.velvet('#C79F8B', { depth: 0.3, lift: 1.1 }),
      ai: { tone: 'dark', rows: range(0, 1, 6), cols: range(0, 1, 16), rowOp: 0.35, colOp: 0.3, outline: 0.6 },
    }),
  )

  const hudItems = []
  const sj = f.body.jOf(Y(250))
  hudItems.push(hud.measure(f.body.P(1, sj), f.body.P(0, sj)))
  hudItems.push(hud.measure(belt.P(1, 0.5), belt.P(0, 0.5)))
  hudItems.push(hud.measure(skirt.P(1, 1), skirt.P(0, 1)))
  hudItems.push(hud.bracket(MX - MR - 22, MTOP - 22, 2 * MR + 44, MB - MTOP + 44, 26))
  hudItems.push(hud.vdim(1108, f.body.cfg.y0, f.floorY))
  for (const g of gs) hudItems.push(hud.cross([g.bbox.x0 + 90, g.bbox.y0 + 170]))
  hudItems.push(hud.cross(skirt.P(0.35, 0.5)))
  hudItems.push(hud.cross(bodice.P(0.62, 0.4)))
  hudItems.push(hud.cross(skirt.P(0.7, 0.85)))
  hudItems.push(hud.cross(seat.P(0.5, 0.2)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 330, h: 260 },
  })
}
