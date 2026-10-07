// Eyewear: tortoiseshell acetate frames on a minimal head form, with a gold wire pair floating beside it.
import * as S from './_shared.mjs'

const { E, smooth, pchip, range, LUMEN, hud, hex, mix, clamp, line } = S

const TILT = 0.2
const CX = 480
const TAU = Math.PI * 2
const PLY = 704

let G = null

const EYE_Y = 336
const zFrame = (x) => 198 - 0.0016 * (x - CX) * (x - CX)

function lensContour(sg, a = 66, b = 48, n = 3.3, N = 160) {
  // returns [{x,y,z,nx,ny}] for the inner contour of one lens (sg = -1 left, +1 right)
  const cxl = sg * (21 + a)
  const cyl = EYE_Y
  const pts = []
  for (let k = 0; k < N; k++) {
    const t = (k / N) * TAU
    const c = Math.cos(t)
    const s = Math.sin(t)
    const xr = a * Math.sign(c) * Math.pow(Math.abs(c), 2 / n)
    const yr = b * Math.sign(s) * Math.pow(Math.abs(s), 2 / n)
    const out = clamp((sg * xr + a) / (2 * a), 0, 1) // 0 at the nose side, 1 at the outer side
    const lift = (s < 0 ? -9 : -2.5) * Math.pow(out, 1.4)
    pts.push({ x: CX + cxl + xr, y: cyl + yr + lift })
  }
  return pts
}

function ringMesh(sg) {
  const base = lensContour(sg)
  const N = base.length
  const tangent = (k) => {
    const a = base[(k + N - 1) % N]
    const b = base[(k + 1) % N]
    const tx = b.x - a.x
    const ty = b.y - a.y
    const l = Math.hypot(tx, ty) || 1
    return [tx / l, ty / l]
  }
  const outward = base.map((p, k) => {
    const [tx, ty] = tangent(k)
    let nx = ty
    let ny = -tx
    const cxl = CX + sg * (21 + 66)
    if ((p.x - cxl) * nx + (p.y - EYE_Y) * ny < 0) {
      nx = -nx
      ny = -ny
    }
    return [nx, ny]
  })
  const thick = (k) => {
    const t = (k / N) * TAU
    return 12.5 - 3.4 * Math.sin(t) // thicker along the top (browline)
  }
  const sample = (j) => {
    const f = j * N
    const k0 = Math.floor(f) % N
    const k1 = (k0 + 1) % N
    const w = f - Math.floor(f)
    const p0 = base[k0]
    const p1 = base[k1]
    const n0 = outward[k0]
    const n1 = outward[k1]
    return { x: p0.x + (p1.x - p0.x) * w, y: p0.y + (p1.y - p0.y) * w, nx: n0[0] + (n1[0] - n0[0]) * w, ny: n0[1] + (n1[1] - n0[1]) * w, th: thick(f) }
  }
  const S3 = (v, j) => {
    const p = sample(j)
    const r = v * p.th
    const x = p.x + p.nx * r
    const y = p.y + p.ny * r
    const dome = 6.5 * Math.pow(Math.sin(Math.PI * v), 0.75)
    return [x, y, zFrame(x) + dome]
  }
  const mesh = S.makeMesh(S3, { rows: 280, cols: 12, tilt: TILT })
  const inner = base.map((p) => [p.x, p.y + TILT * zFrame(p.x)])
  const outer = Array.from({ length: N }, (_, k) => {
    const s = S3(1, k / N)
    return [s[0], s[1] + TILT * s[2]]
  })
  return { mesh, inner, outer }
}

function buildHead() {
  const A = pchip([[96, 0], [102, 40], [118, 86], [145, 128], [185, 156], [240, 166], [300, 164], [360, 154], [420, 138], [480, 120], [530, 100], [572, 82], [590, 72], [620, 68], [700, 72], [740, 76]])
  const B = pchip([[96, 0], [102, 44], [118, 92], [145, 136], [185, 164], [240, 174], [300, 172], [360, 162], [420, 144], [480, 122], [530, 98], [572, 82], [590, 74], [620, 70], [700, 72], [740, 76]])
  const y0 = 96
  const y1 = PLY + 4
  const head = S.makeMesh(
    (i, j) => {
      const th = Math.PI * i
      const y = y0 + (y1 - y0) * j
      const x = A(y) * Math.cos(th)
      let z = B(y) * Math.sin(th)
      const ax = x
      // nose ridge, brow, eye sockets, chin
      const noseTop = 322
      const noseTip = 436
      const nv = smooth(noseTop - 8, noseTip, y) * (1 - smooth(noseTip, noseTip + 26, y))
      const nw = 9 + 15 * smooth(noseTop, noseTip, y)
      z += (5 + 26 * Math.pow(smooth(noseTop, noseTip, y), 1.2)) * Math.exp(-Math.pow(ax / nw, 2)) * (1 - smooth(noseTip + 4, noseTip + 56, y)) * smooth(noseTop - 30, noseTop, y)
      z += 5 * Math.exp(-Math.pow((y - 312) / 16, 2)) * (1 - smooth(120, 160, Math.abs(ax)))
      z -= 2.5 * Math.exp(-Math.pow((Math.abs(ax) - 70) / 30, 2) - Math.pow((y - 344) / 24, 2))
      z += 5 * Math.exp(-Math.pow((y - 566) / 24, 2) - Math.pow(ax / 40, 2))
      void nv
      return [CX + x, y, Math.max(0, z)]
    },
    { rows: 150, cols: 100, tilt: TILT },
  )
  return { head, A, B, y0, y1 }
}

function buildSecond() {
  const OX = 842
  const OY = 540
  const yaw = -0.62
  const roll = -0.2
  const T = (p) => {
    const [x, y, z] = p
    const x1 = x * Math.cos(yaw) + z * Math.sin(yaw)
    const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw)
    const x2 = x1 * Math.cos(roll) - y * Math.sin(roll)
    const y2 = x1 * Math.sin(roll) + y * Math.cos(roll)
    return [OX + x2, OY + y2, z1]
  }
  const R = 64
  const gap = 18
  const rims = [-1, 1].map((sg) => S.tubeMesh((t) => T([sg * (R + gap / 2) + R * Math.cos(t * TAU), R * Math.sin(t * TAU), 0]), 2.6, { rows: 90, cols: 8, phi0: -Math.PI, phi1: Math.PI, tilt: TILT }))
  const bridge = S.tubeMesh((t) => T([-gap / 2 - 1 + (gap + 2) * t, -R * 0.32 - 11 * Math.sin(Math.PI * t), 0]), 2.2, { rows: 20, cols: 8, phi0: -Math.PI, phi1: Math.PI, tilt: TILT })
  const temples = [-1, 1].map((sg) =>
    S.tubeMesh(
      (t) => {
        const L = 150
        const zz = -L * Math.min(1, t / 0.86)
        const drop = 34 * Math.pow(smooth(0.86, 1, t), 1.4)
        return T([sg * (R + gap / 2 + R + 3), -R * 0.42 + drop, zz])
      },
      (t) => 2.3 - 0.4 * t,
      { rows: 50, cols: 8, phi0: -Math.PI, phi1: Math.PI, tilt: TILT },
    ),
  )
  const lensPts = [-1, 1].map((sg) => Array.from({ length: 90 }, (_, k) => {
    const t = (k / 90) * TAU
    const p = T([sg * (R + gap / 2) + (R - 1.6) * Math.cos(t), (R - 1.6) * Math.sin(t), 0])
    return [p[0], p[1] + TILT * p[2]]
  }))
  const pads = [-1, 1].map((sg) => {
    const p = T([sg * 11, 6, 8])
    return [p[0], p[1] + TILT * p[2]]
  })
  return { rims, bridge, temples, lensPts, pads, OX, OY, T }
}

/** hand-built tortoiseshell colour from screen position + shading luma */
const TORT = { dark: hex('#2A1408'), amber: hex('#B5651C'), honey: hex('#E9AE52') }
function tortoise(c, q) {
  const px = (q.pts[0][0] + q.pts[2][0]) / 2
  const py = (q.pts[0][1] + q.pts[2][1]) / 2
  const n =
    Math.sin(px * 0.04 + 1.2) * Math.sin(py * 0.055 + 0.4) +
    0.7 * Math.sin(px * 0.095 - py * 0.07 + 2) +
    0.45 * Math.sin(px * 0.02 + py * 0.12 - 1) +
    0.25 * Math.sin(px * 0.17 + py * 0.15)
  let p = TORT.amber
  const dk = smooth(0.0, -0.95, n)
  const hn = smooth(0.35, 1.25, n)
  p = mix(p, TORT.dark, dk)
  p = mix(p, TORT.honey, hn)
  const L = clamp(S.luma(c), 0, 1)
  const diff = mix([p[0] * 0.18, p[1] * 0.18, p[2] * 0.18], [p[0] * 1.18, p[1] * 1.18, p[2] * 1.18], clamp(L * 1.1, 0, 1))
  const spec = clamp((L - 0.8) * 2.6, 0, 1)
  return mix(diff, [255, 250, 238], spec * 0.9)
}

const AI_GOLD = (c) => mix(hex('#2a3010'), hex('#e9ff9a'), clamp(S.luma(c) * 1.1, 0, 1))

export function scene(mode) {
  G ||= { head: buildHead(), rings: [-1, 1].map(ringMesh), second: buildSecond() }
  const { head, rings, second } = G
  const H0 = head.head

  // temples + bridge for the main pair
  const temples = [-1, 1].map((sg) =>
    S.tubeMesh(
      (t) => {
        const x = CX + sg * (21 + 66 * 2 + 8 + 6 * t)
        return [x, EYE_Y - 14 - 2 * t + 4 * t * t, zFrame(CX + sg * 150) - 80 * t]
      },
      (t) => 5.2 - 1.6 * t,
      { rows: 24, cols: 10, phi0: -Math.PI / 2, phi1: Math.PI / 2, tilt: TILT },
    ),
  )
  const bridge = S.tubeMesh((t) => [CX - 14 + 28 * t, EYE_Y - 16 - 9 * Math.sin(Math.PI * t) + 3, zFrame(CX) + 4], 4.6, { rows: 24, cols: 10, tilt: TILT })

  const tortMat = S.acetate('#ffffff', { depth: 0.1, lift: 1, spec: 1.0, gloss: 80, rim: 0.5, fill: 0.22, specTint: 1, rimTint: 0.9 })

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#EDE6D6', '#D9D0BC'],
      floor: ['#D4CBB6', '#B3A78F'],
      horizon: 730,
      spot: { x: 560, y: 340, r: 620, col: '#FFFDF4', op: 0.75 },
      vignette: 0.26,
      extra: (c) => {
        // window-gobo light bands on the wall
        const g = c.uid('gobo')
        c.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`)
        const band = (x, w) => `<path d="M${x} 0L${x + w} 0L${x + w - 360} 730L${x - 360} 730Z" fill="url(#${g})"/>`
        return `<g opacity="0.8">${band(760, 120)}${band(930, 70)}${band(1040, 120)}</g>`
      },
    })
  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 63, glow: { x: 560, y: 450 }, floor: { x: CX, y: PLY + 40, r: 220, ry: 48 }, marks: 36 })

  const items = []

  // ---------- floor shadows + pedestal ---------------------------------------------------------
    items.push({
    clean: (ctx) => S.groundShadow(ctx, CX + 16, PLY + 40, 170, 22, 1) + S.groundShadow(ctx, second.OX - 30, 790, 120, 18, 0.55),
    ai: () => '',
  })
  const pedestal = S.sorMesh({ y0: PLY, y1: PLY + 40, A: () => 132, B: () => 132, cx: () => CX, tilt: TILT, rows: 5, cols: 70 })
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('pt')
      ctx.def(`<radialGradient id="${g}" cx="0.4" cy="0.4" r="0.7"><stop offset="0" stop-color="#F4EEE0"/><stop offset="1" stop-color="#D3C8B2"/></radialGradient>`)
      return `<ellipse cx="${CX}" cy="${PLY}" rx="132" ry="${132 * TILT}" fill="url(#${g})"/><ellipse cx="${CX}" cy="${PLY}" rx="132" ry="${132 * TILT}" fill="none" stroke="#fff" stroke-opacity="0.7" stroke-width="2"/>`
    },
    ai: () => `<ellipse cx="${CX}" cy="${PLY}" rx="132" ry="${132 * TILT}" fill="#0c0e0b" stroke="${LUMEN}" stroke-opacity="0.9" stroke-width="2.2"/>`,
  })
  items.push(S.solid(pedestal, { mat: S.matte('#E3DACB', { depth: 0.6 }), ai: { tone: 'deep', rows: [0, 1], cols: range(0, 1, 34), colOp: 0.2, rowOp: 0.7 }, scan: false }))

  // ---------- head form ------------------------------------------------------------------------
  items.push(
    S.solid(H0, {
      mat: { ...E.MATERIALS.form, shadow: hex('#8a806e'), mid: hex('#ebe2cf') },
      ai: { tone: 'form', rows: range(0, 1, 52), cols: range(0, 1, 26), rowOp: 0.26, colOp: 0.22, outline: 0.5 },
    }),
  )

  // lens shadows on the face
  items.push({
    clean: (ctx) => rings.map((r) => `<path d="${E.path(r.outer.map((p) => [p[0] + 9, p[1] + 14]), true)}" fill="#3a3020" opacity="0.22" filter="${ctx.blurBox(7)}"/>`).join(''),
    ai: () => '',
  })

  // ---------- main frame -------------------------------------------------------------------------
  for (const t of temples) {
    items.push(S.solid(t, { mat: tortMat, colour: tortoise, ai: { tone: 'gold', colour: undefined, rows: [], cols: [0.5], colOp: 0.5, outline: 0.9, glow: true }, seam: 1.2, scan: false }))
  }
  // lens glass (below the rings, above the head)
  const lensGlass = (r, k) => ({
    clean: (ctx) => {
      const cid = ctx.uid('lc')
      const g = ctx.uid('lg')
      ctx.def(`<clipPath id="${cid}"><path d="${E.path(r.inner, true)}"/></clipPath>`)
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="0.4" y2="1"><stop offset="0" stop-color="#9FB4B8" stop-opacity="0.42"/><stop offset="0.6" stop-color="#D7E4E4" stop-opacity="0.2"/><stop offset="1" stop-color="#E8F0EE" stop-opacity="0.12"/></linearGradient>`)
      const xs = r.inner.map((p) => p[0])
      const ys = r.inner.map((p) => p[1])
      const x0 = Math.min(...xs)
      const x1 = Math.max(...xs)
      const y0 = Math.min(...ys)
      const y1 = Math.max(...ys)
      const w = x1 - x0
      return (
        `<path d="${E.path(r.inner, true)}" fill="url(#${g})"/>` +
        `<g clip-path="url(#${cid})">` +
        `<path d="M${x0 + w * 0.12} ${y1 + 6}L${x0 + w * 0.5} ${y0 - 6}L${x0 + w * 0.62} ${y0 - 6}L${x0 + w * 0.24} ${y1 + 6}Z" fill="#fff" opacity="0.5"/>` +
        `<path d="M${x0 + w * 0.34} ${y1 + 6}L${x0 + w * 0.7} ${y0 - 6}L${x0 + w * 0.76} ${y0 - 6}L${x0 + w * 0.4} ${y1 + 6}Z" fill="#fff" opacity="0.3"/>` +
        `<path d="M${x0} ${y1 - 8}Q${(x0 + x1) / 2} ${y1 - 30} ${x1} ${y1 - 6}L${x1} ${y1 + 4}L${x0} ${y1 + 4}Z" fill="#fff" opacity="0.18"/>` +
        `</g>`
      )
    },
    ai: (ctx) => {
      const cid = ctx.uid('lc')
      ctx.def(`<clipPath id="${cid}"><path d="${E.path(r.inner, true)}"/></clipPath>`)
      const xs = r.inner.map((p) => p[0])
      const ys = r.inner.map((p) => p[1])
      const x0 = Math.min(...xs)
      const x1 = Math.max(...xs)
      const y0 = Math.min(...ys)
      const y1 = Math.max(...ys)
      const w = x1 - x0
      const streaks = []
      for (let q = -2; q < 8; q++) streaks.push(`<line x1="${S.r1(x0 + q * 18)}" y1="${y1 + 4}" x2="${S.r1(x0 + q * 18 + 52)}" y2="${y0 - 4}" stroke="${LUMEN}" stroke-opacity="${q % 3 === 0 ? 0.55 : 0.2}" stroke-width="${q % 3 === 0 ? 2 : 1.2}"/>`)
      return `<path d="${E.path(r.inner, true)}" fill="#0b1518" fill-opacity="0.55"/><g clip-path="url(#${cid})">${streaks.join('')}</g><path d="${E.path(r.inner, true)}" fill="none" stroke="${LUMEN}" stroke-width="1.6" stroke-opacity="0.9"/>`
    },
  })
  rings.forEach((r, k) => items.push(lensGlass(r, k)))
  for (const r of rings) {
    items.push(
      S.solid(r.mesh, {
        mat: tortMat,
        colour: tortoise,
        seam: 1.3,
        scan: false,
        ai: { tone: 'gold', rows: [], cols: [0, 0.5, 1], colOp: 0.7, colW: 1.4, outline: 0.0, glow: true, hot: [{ col: 0.5, w: 2.4 }] },
      }),
    )
  }
  items.push(S.solid(bridge, { mat: tortMat, colour: tortoise, ai: { tone: 'gold', rows: [], cols: [0.5], colOp: 0.7, outline: 0.9, glow: true }, seam: 1.1, scan: false }))
  // lens glints (star flares)

  // ---------- second frame: floating gold wire pair ------------------------------------------------------
  const goldMat = S.metalMat('#D9B66A', { depth: 0.26, lift: 1.1 })
  items.push({
    clean: (ctx) => `<ellipse cx="${second.OX - 18}" cy="${second.OY + 250}" rx="125" ry="14" fill="#2a2418" opacity="0.3" filter="${ctx.blurBox(10)}"/>`,
    ai: () => `<ellipse cx="${second.OX - 18}" cy="${second.OY + 250}" rx="120" ry="14" fill="none" stroke="${LUMEN}" stroke-opacity="0.6" stroke-width="1.6" stroke-dasharray="3 7"/>`,
  })
  // back temple first (the one with larger z, i.e. farther from the viewer)
  const tOrder = second.temples
  for (const t of tOrder) items.push(S.solid(t, { mat: goldMat, ai: { tone: 'gold', rows: [], cols: [], outline: 0.95, glow: true }, seam: 1, scan: false }))
  const lensG = second.lensPts.map((pts) => ({
    clean: (ctx) => {
      const g = ctx.uid('l2')
      const cid = ctx.uid('c2')
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A5A34" stop-opacity="0.55"/><stop offset="1" stop-color="#C9A877" stop-opacity="0.2"/></linearGradient>`)
      ctx.def(`<clipPath id="${cid}"><path d="${E.path(pts, true)}"/></clipPath>`)
      const xs = pts.map((p) => p[0])
      const ys = pts.map((p) => p[1])
      const x0 = Math.min(...xs)
      const x1 = Math.max(...xs)
      const y0 = Math.min(...ys)
      const y1 = Math.max(...ys)
      const w = x1 - x0
      return `<path d="${E.path(pts, true)}" fill="url(#${g})"/><g clip-path="url(#${cid})"><path d="M${x0 + w * 0.1} ${y1 + 4}L${x0 + w * 0.5} ${y0 - 4}L${x0 + w * 0.62} ${y0 - 4}L${x0 + w * 0.22} ${y1 + 4}Z" fill="#fff" opacity="0.55"/><path d="M${x0 + w * 0.34} ${y1 + 4}L${x0 + w * 0.74} ${y0 - 4}L${x0 + w * 0.8} ${y0 - 4}L${x0 + w * 0.4} ${y1 + 4}Z" fill="#fff" opacity="0.28"/></g>`
    },
    ai: (ctx) => {
      const cid = ctx.uid('c2')
      ctx.def(`<clipPath id="${cid}"><path d="${E.path(pts, true)}"/></clipPath>`)
      const xs = pts.map((p) => p[0])
      const ys = pts.map((p) => p[1])
      const x0 = Math.min(...xs)
      const y0 = Math.min(...ys)
      const y1 = Math.max(...ys)
      const streaks = []
      for (let q = -2; q < 8; q++) streaks.push(`<line x1="${S.r1(x0 + q * 17)}" y1="${y1 + 4}" x2="${S.r1(x0 + q * 17 + 48)}" y2="${y0 - 4}" stroke="${LUMEN}" stroke-opacity="${q % 3 === 0 ? 0.5 : 0.18}" stroke-width="${q % 3 === 0 ? 1.8 : 1.1}"/>`)
      return `<path d="${E.path(pts, true)}" fill="#0b1518" fill-opacity="0.5"/><g clip-path="url(#${cid})">${streaks.join('')}</g>`
    },
  }))
  lensG.forEach((l) => items.push(l))
  for (const r of second.rims) items.push(S.solid(r, { mat: goldMat, ai: { tone: 'gold', rows: [], cols: [], outline: 0.95, glow: true }, seam: 1, scan: false }))
  items.push(S.solid(second.bridge, { mat: goldMat, ai: { tone: 'gold', rows: [], cols: [], outline: 0.95, glow: true }, seam: 1, scan: false }))
  // glints
  items.push({
    clean: () => {
      const p = second.lensPts[0]
      const q = second.lensPts[1]
      const c0 = [p.reduce((a, b) => a + b[0], 0) / p.length - 14, p.reduce((a, b) => a + b[1], 0) / p.length - 22]
      const c1 = [q.reduce((a, b) => a + b[0], 0) / q.length - 12, q.reduce((a, b) => a + b[1], 0) / q.length - 22]
      return star(c0[0], c0[1], 10) + star(c1[0], c1[1], 7, 0.8) + star(CX + 96, EYE_Y - 30, 9, 0.9)
    },
    ai: () => '',
  })

  // ---------- HUD ---------------------------------------------------------------------------------------
  const hudItems = []
  const hj = (y) => (y - head.y0) / (head.y1 - head.y0)
  hudItems.push(hud.measure(H0.P(1, hj(EYE_Y + 40)), H0.P(0, hj(EYE_Y + 40)), { len: 56 }))
  hudItems.push(hud.measure(H0.P(1, hj(540)), H0.P(0, hj(540)), { len: 70 }))
  hudItems.push(hud.vdim(CX - 330, 96, PLY + 40))
  hudItems.push(hud.bracket(CX - 188, EYE_Y - 70, 376, 150, 22))
  hudItems.push(hud.bracket(second.OX - 170, second.OY - 110, 320, 236, 20))
  hudItems.push(hud.cross([CX, EYE_Y - 18]))
  hudItems.push(hud.cross([CX - 88, EYE_Y + 14]))
  hudItems.push(hud.cross([CX + 86, EYE_Y + 4]))
  hudItems.push(hud.cross(second.pads[0]))
  hudItems.push(hud.cross([second.OX + 38, second.OY + 62]))
  hudItems.push(hud.cross(H0.P(0.3, hj(190))))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 250, h: 220 },
  })
}

const star = (x, y, r, op = 0.95) =>
  `<g transform="translate(${S.r1(x)} ${S.r1(y)})"><path d="M0 ${-r}Q${r * 0.1} ${-r * 0.1} ${r} 0Q${r * 0.1} ${r * 0.1} 0 ${r}Q${-r * 0.1} ${r * 0.1} ${-r} 0Q${-r * 0.1} ${-r * 0.1} 0 ${-r}Z" fill="#fff" fill-opacity="${op}"/></g>`
