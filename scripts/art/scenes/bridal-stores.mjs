// Bridal: layered ballgown with a long train and veil on a mannequin form.
import * as S from './_shared.mjs'
import { mannequin } from './_mannequin.mjs'

const { E, smooth, pchip, range, line, LUMEN, hud } = S

const CX = 470
const TILT = 0.3
const FLOOR = 806

function build() {
  const m = mannequin({ cx: CX, top: 96, h: 740, tilt: TILT, rows: 70, cols: 56 })
  const Y = m.Y
  const items = []

  // ---- geometry ---------------------------------------------------------------------------------
  const cxFn = (y) => CX + 34 * Math.pow(smooth(480, 800, y), 1.5)
  const baseA = pchip([[378, 60], [430, 82], [500, 120], [580, 164], [670, 207], [740, 237], [806, 256]])
  const baseB = pchip([[378, 49], [430, 64], [500, 93], [580, 123], [670, 152], [740, 172], [806, 184]])
  const PN = 17

  const layer = (y1, f, seed, rows) => {
    const tw = (y) => 1.2 * smooth(440, y1, y) + seed
    return S.sorMesh({
      y0: 378,
      y1,
      A: (y) => baseA(y) * (1 + f * smooth(386, 470, y)) + 0.6,
      B: (y) => baseB(y) * (1 + f * smooth(386, 470, y)) + 0.6,
      cx: cxFn,
      tilt: TILT,
      rows,
      cols: 100,
      pleats: { n: PN, amp: (y) => 0.04 * smooth(420, y1 - 40, y), tw },
      yShift: (y, th) => {
        const edge = 0.35 + 0.65 * Math.sin(th)
        const hem = 12 * Math.pow(smooth(y1 - 120, y1, y), 2) * Math.sin(PN * th + tw(y1) + 0.9) * edge
        const lift = -16 * smooth(y1 - 260, y1, y) * Math.cos(th)
        return hem + lift
      },
    })
  }
  const L0 = layer(806, 0, 0, 74)
  const L1 = layer(728, 0.055, 0.4, 56)
  const L2 = layer(648, 0.11, 0.9, 46)
  const L3 = layer(566, 0.165, 1.5, 36)

  // bodice (strapless sweetheart) hugging the mannequin
  const bodice = S.sorMesh({
    y0: Y(256),
    y1: Y(430),
    A: (y) => m.A(y) * 1.035 + 1.6,
    B: (y) => m.B(y) * 1.035 + 1.6,
    cx: m.cxf,
    tilt: TILT,
    rows: 40,
    cols: 96,
    yShift: (y, th) => {
      const t = th - Math.PI / 2
      const peak = -15 * Math.exp(-Math.pow((Math.abs(t) - 0.55) / 0.32, 2))
      const dip = 13 * Math.exp(-Math.pow(t / 0.2, 2))
      const side = 26 * smooth(0.5, 1.45, Math.abs(t))
      return (peak + dip + side) * (1 - smooth(Y(256), Y(256) + 46, y))
    },
  })
  const sash = S.sorMesh({
    y0: Y(372),
    y1: Y(402),
    A: (y) => baseA(Math.max(y, 380)) * 1.0 + 2.2,
    B: (y) => baseB(Math.max(y, 380)) * 1.0 + 2.2,
    cx: cxFn,
    tilt: TILT,
    rows: 5,
    cols: 90,
  })

  // train: a satin fan on the floor sweeping from behind the skirt to the right/front
  const trainC = (s) => [CX + 70 + 380 * Math.pow(s, 0.95), -100 + 230 * Math.pow(s, 1.3)]
  const train = S.makeMesh(
    (i, s) => {
      const c = trainC(s)
      const c2 = trainC(Math.min(1, s + 0.01))
      const c1 = trainC(Math.max(0, s - 0.01))
      const dx = c2[0] - c1[0]
      const dz = c2[1] - c1[1]
      const dl = Math.hypot(dx, dz)
      const nx = -dz / dl
      const nz = dx / dl
      const hw = (120 + 150 * Math.pow(s, 0.75)) * (1 - 0.55 * Math.pow(smooth(0.86, 1, s), 2))
      const o = (i - 0.5) * 2 * hw
      const edgeEnv = 0.3 + 0.7 * Math.pow(Math.sin(Math.PI * i), 0.8)
      const ripple = 26 * Math.sin(s * 11 + i * 3.1) * edgeEnv * smooth(0.05, 0.3, s) + 10 * Math.sin(s * 23 - i * 5) * edgeEnv * smooth(0.2, 0.6, s)
      const mound = 60 * Math.pow(1 - s, 2.2) * Math.pow(Math.sin(Math.PI * i), 0.7)
      const scallop = 0
      return [c[0] + nx * o, FLOOR - 6 - ripple - mound + scallop, c[1] + nz * o]
    },
    { rows: 90, cols: 50, tilt: TILT },
  )

  // veil: translucent tulle falling behind the figure from the crown
  const veil = S.makeMesh(
    (i, j) => {
      const w = 16 + 330 * Math.pow(smooth(0.02, 1, j), 1.05)
      const c = 90 * smooth(0.25, 1, j) - 14 * smooth(0, 0.4, j)
      const x = CX + c + (i - 0.5) * 2 * w
      const edgeEnv = 0.25 + 0.75 * Math.sin(Math.PI * i)
      const fold = 34 * Math.sin(i * 9.5 + j * 2.2) * edgeEnv * smooth(0.1, 0.6, j)
      const y = 150 + j * 650 + 14 * Math.sin(i * 22) * smooth(0.9, 1, j) * Math.sin(Math.PI * i)
      const z = -70 - 110 * j + fold
      return [x, y, z]
    },
    { rows: 60, cols: 50, tilt: TILT },
  )

  return { m, L0, L1, L2, L3, bodice, sash, train, veil, items }
}

let G = null

function hemShadow(upper, lower, k = 1) {
  return {
    clean(ctx) {
      const id = ctx.uid('hc')
      ctx.def(`<clipPath id="${id}"><path d="${E.path(lower.outline(), true)}"/></clipPath>`)
      const ring = upper.rowLine(1, 140).map((p) => [p[0], p[1] + 9])
      return `<g clip-path="url(#${id})"><path d="${E.path(ring)}" fill="none" stroke="#3b2f1c" stroke-width="22" opacity="${0.34 * k}" filter="${ctx.blur(8)}"/></g>`
    },
    ai: () => '',
  }
}

/** lace rosette tile (unit square) */
const ROSETTE = (stroke, op) => (sw) =>
  `<g fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-opacity="${op}" stroke-linecap="round">` +
  `<ellipse cx="0.5" cy="0.5" rx="0.2" ry="0.2"/>` +
  `<ellipse cx="0.5" cy="0.2" rx="0.09" ry="0.13"/><ellipse cx="0.5" cy="0.8" rx="0.09" ry="0.13"/>` +
  `<ellipse cx="0.2" cy="0.5" rx="0.13" ry="0.09"/><ellipse cx="0.8" cy="0.5" rx="0.13" ry="0.09"/>` +
  `<path d="M0.06 0.06Q0.2 0.1 0.2 0.2M0.94 0.06Q0.8 0.1 0.8 0.2M0.06 0.94Q0.2 0.9 0.2 0.8M0.94 0.94Q0.8 0.9 0.8 0.8"/></g>`

function laceBand(mesh, j0, j1, n, tile, px = 1.1) {
  const out = []
  for (let k = 0; k < n; k++) out.push(S.motif(mesh, k / n, (k + 1) / n, j0, j1, tile, { minW: 3, px }))
  return out.join('')
}

export function scene(mode) {
  G ||= build()
  const { m, L0, L1, L2, L3, bodice, sash, train, veil } = G
  const sat = (base, o = {}) => S.satin(base, { depth: 0.46, lift: 1.04, spec: 0.5, gloss: 22, rim: 0.3, fill: 0.22, ...o })
  const GOLD = '#B79E6B'

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#E7DFCF', '#D4CAB6'],
      floor: ['#D3C9B5', '#B6AB95'],
      horizon: 700,
      spot: { x: 490, y: 330, r: 560, col: '#FFF9EC', op: 0.85 },
      vignette: 0.26,
      extra: (c) => {
        const g = c.uid('arch')
        c.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#EDE5D4"/><stop offset="0.5" stop-color="#F8F3E8"/><stop offset="1" stop-color="#E9E0CE"/></linearGradient>`)
        const d = 'M170 700V330A320 320 0 0 1 810 330V700Z'
        return `<path d="${d}" fill="url(#${g})" opacity="0.9"/><path d="${d}" fill="none" stroke="#7a6c52" stroke-opacity="0.22" stroke-width="14" filter="${c.blur(9)}"/><path d="${d}" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="2"/>`
      },
    })

  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 31, glow: { x: 500, y: 450 }, floor: { x: 510, y: 790, r: 300, ry: 76 }, marks: 40 })

  const rowsN = (mesh, step) => range(0, 1, Math.round((mesh.cfg.y1 - mesh.cfg.y0) / step))
  const colsN = (n) => range(0, 1, n)

  const bodiceLace = (tile) => {
    const out = []
    const n = 22
    const rowsJ = [0.2, 0.34, 0.48, 0.62, 0.76]
    rowsJ.forEach((j0, r) => {
      const off = r % 2 ? 0.5 : 0
      for (let k = 0; k < n; k++) {
        const a = (k + off) / n
        const b = (k + off + 1) / n
        if (b > 1) continue
        out.push(S.motif(bodice, a, b, j0, j0 + 0.14, tile, { minW: 3, px: 1 }))
      }
    })
    return out.join('')
  }

  const items = []
  items.push({ clean: (c) => S.groundShadow(c, 505, FLOOR + 6, 290, 42, 0.85), ai: () => '' })

  // veil (behind everything)
  items.push(
    S.solid(veil, {
      mat: sat('#F6EFE0', { depth: 0.6, fill: 0.3, rim: 0.4 }),
      opacity: 0.8,
      seam: 1.4,
      ai: { tone: 'glass', opacity: 0.85, rows: range(0, 1, 26), cols: range(0, 1, 18), rowOp: 0.2, colOp: 0.18, rowW: 1, colW: 1, outline: 0.45 },
      scan: false,
      after: () => `<path d="${E.path(veil.outline(), true)}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="1.6"/><path d="${E.path(veil.rowLine(1, 120))}" fill="none" stroke="${GOLD}" stroke-opacity="0.55" stroke-width="2"/>`,
    }),
  )

  // train
  items.push(S.dropShadow(train, { dx: 4, dy: 9, std: 7, op: 0.3 }))
  items.push(
    S.solid(train, {
      mat: sat('#E9DCC1', { depth: 0.5 }),
      ai: { tone: 'dark', rows: range(0, 1, 26), cols: range(0, 1, 22), rowOp: 0.3, colOp: 0.3, outline: 0.55, hot: [{ row: 1, w: 3, op: 0.95 }] },
      after: () => trainLace(train, ROSETTE(GOLD, 0.85)),
      aiAfter: () => trainLace(train, ROSETTE(LUMEN, 0.55)),
    }),
  )

  // mannequin
  items.push(
    S.solid(m.body, {
      mat: E.MATERIALS.form,
      ai: { tone: 'form', rows: range(0, 1, 34), cols: range(0, 1, 12), rowOp: 0.28, colOp: 0.2 },
    }),
  )
  items.push(
    S.solid(bodice, {
      mat: sat('#F1E7D1', { depth: 0.5 }),
      ai: { tone: 'dark', rows: range(0, 1, 12), cols: range(0, 1, 30), rowOp: 0.42, colOp: 0.38, outline: 0.6 },
      after: () => bodiceLace(ROSETTE(GOLD, 0.7)) + `<path d="${E.path(bodice.rowLine(0, 120))}" fill="none" stroke="${GOLD}" stroke-opacity="0.8" stroke-width="2"/>`,
      aiAfter: () => bodiceLace(ROSETTE(LUMEN, 0.5)),
    }),
  )

  const layers = [
    [L0, '#E4D5B7'],
    [L1, '#EBDEC4'],
    [L2, '#F1E6D0'],
    [L3, '#F6EDDB'],
  ]
  layers.forEach(([mesh, col], k) => {
    if (k > 0) items.push(hemShadow(mesh, layers[k - 1][0], 1))
    items.push(
      S.solid(mesh, {
        mat: sat(col, { depth: 0.5 - k * 0.02 }),
        ai: {
          tone: 'dark',
          rows: rowsN(mesh, 15),
          cols: colsN(40),
          rowOp: 0.34,
          colOp: 0.3,
          outline: 0.4,
          hot: [{ row: 1, w: 2.8, op: 0.95 }],
        },
        after: () => laceBand(mesh, 0.9, 0.995, 46, ROSETTE(GOLD, 0.7), 1),
        aiAfter: () => laceBand(mesh, 0.9, 0.995, 46, ROSETTE(LUMEN, 0.45), 1),
      }),
    )
  })

  items.push(
    S.solid(sash, {
      mat: S.metalMat('#CDB27A', { depth: 0.3 }),
      ai: { tone: 'gold', rows: [0, 0.5, 1], cols: [], rowOp: 0.7 },
    }),
  )

  const hudItems = []
  hudItems.push(hud.measure(m.body.P(1, m.body.jOf(m.Y(238))), m.body.P(0, m.body.jOf(m.Y(238)))))
  hudItems.push(hud.measure(sash.P(1, 0.5), sash.P(0, 0.5)))
  hudItems.push(hud.measure(L0.P(1, 1), L0.P(0, 1)))
  hudItems.push(hud.measure(L2.P(1, 1), L2.P(0, 1)))
  hudItems.push(hud.vdim(130, 96, FLOOR))
  for (const [mesh, i, y] of [[L1, 0.34, 0.5], [L2, 0.7, 0.4], [L0, 0.22, 0.62], [L3, 0.55, 0.5], [bodice, 0.3, 0.45], [L0, 0.82, 0.45]]) hudItems.push(hud.cross(mesh.P(i, y)))
  hudItems.push(hud.cross(train.P(0.5, 0.45)))
  hudItems.push(hud.cross(train.P(0.5, 0.85)))
  hudItems.push(hud.cross(veil.P(0.7, 0.55)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 380, h: 260 },
    shift: [0, -22],
  })
}

function trainLace(train, tile) {
  const out = []
  const n = 20
  for (let k = 0; k < n; k++) {
    const j0 = 0.1 + (k * 0.88) / n
    const j1 = j0 + 0.88 / n
    out.push(S.motif(train, 0.0, 0.05, j0, j1, tile, { minW: 3, px: 1 }))
    out.push(S.motif(train, 0.95, 1.0, j0, j1, tile, { minW: 3, px: 1 }))
  }
  return out.join('')
}
