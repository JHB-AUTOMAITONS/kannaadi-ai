// Events & exhibitions: a brand-activation booth. An arched portal with an LED screen of twisting ribbons,
// a lighting truss gantry with spotlights and beams, a low stage, and a crowd of abstract silhouettes.
import * as S from './_shared.mjs'

const { E, smooth, pchip, range, line, LUMEN, hud, hex, mix, clamp, rng } = S

const AX = 600
const BASE_Y = 664
const ARC_Y = 452
const R_IN = 238
const R_OUT = 286
const R_MID = (R_IN + R_OUT) / 2
const TH = R_OUT - R_IN
const TILT = 0.12

const STRAIGHT = BASE_Y - ARC_Y
const ARC = Math.PI * R_MID
const LEN = 2 * STRAIGHT + ARC
function archPath(R) {
  return (s) => {
    if (s < STRAIGHT) return [AX - R, BASE_Y - s, -Math.PI]
    if (s < STRAIGHT + ARC) {
      const a = Math.PI - ((s - STRAIGHT) / ARC) * Math.PI
      return [AX + R * Math.cos(a), ARC_Y - R * Math.sin(a), a]
    }
    return [AX + R, ARC_Y + (s - STRAIGHT - ARC), 0]
  }
}
const archNormal = (s) => {
  // outward normal of the centre line
  if (s < STRAIGHT) return [-1, 0]
  if (s < STRAIGHT + ARC) {
    const a = Math.PI - ((s - STRAIGHT) / ARC) * Math.PI
    return [Math.cos(a), -Math.sin(a)]
  }
  return [1, 0]
}
const screenD = (R, yb) => {
  const pts = []
  const p = archPath(R)
  const L = 2 * (yb - ARC_Y) + Math.PI * R
  const st = yb - ARC_Y
  const at = (s) => {
    if (s < st) return [AX - R, yb - s]
    if (s < st + Math.PI * R) {
      const a = Math.PI - ((s - st) / (Math.PI * R)) * Math.PI
      return [AX + R * Math.cos(a), ARC_Y - R * Math.sin(a)]
    }
    return [AX + R, ARC_Y + (s - st - Math.PI * R)]
  }
  void p
  for (let k = 0; k <= 160; k++) pts.push(at((k / 160) * L))
  return E.path(pts, true)
}

const TAUU = Math.PI * 2

let G = null

function build() {
  // arch band: i across the thickness (inner -> outer), j along the arch
  const arch = S.makeMesh(
    (i, j) => {
      const s = j * LEN
      const p = archPath(R_MID)(s)
      const n = archNormal(s)
      const off = (i - 0.5) * TH
      const dome = 12 * Math.pow(Math.sin(Math.PI * i), 0.7)
      return [p[0] + n[0] * off, p[1] + n[1] * off, 30 + dome]
    },
    { rows: 150, cols: 8, tilt: TILT },
  )

  // ribbons on the screen (twisting bands)
  const SCY0 = 232
  const SCY1 = BASE_Y - 26
  const ribbon = (phase, width, amp, twist, tw0) =>
    S.makeMesh(
      (i, t) => {
        const y = SCY0 + (SCY1 - SCY0) * t
        const x = AX + amp * Math.sin(TAUU * (t * 0.95) + phase) * (0.55 + 0.45 * Math.sin(Math.PI * t))
        const z = 70 * Math.cos(TAUU * (t * 0.95) + phase)
        const phi = TAUU * twist * t + tw0
        const w = (i - 0.5) * width * (0.6 + 0.4 * Math.sin(Math.PI * t * 0.98 + 0.2))
        return [x + w * Math.cos(phi), y + w * 0.12 * Math.sin(phi), z + w * Math.sin(phi) * 0.9]
      },
      { rows: 170, cols: 14, tilt: 0 },
    )
  const ribbons = [
    { m: ribbon(0.2, 150, 118, 1.6, 0.3), kind: 'main' },
    { m: ribbon(2.4, 120, 104, 1.9, 1.4), kind: 'alt' },
    { m: ribbon(4.5, 90, 88, 2.2, 2.4), kind: 'main2' },
  ]

  // truss tubes
  const TOPY0 = 62
  const TOPY1 = 100
  const chords = [
    S.tubeMesh((t) => [118 + (1082 - 118) * t, TOPY0, 0], 4.6, { rows: 60, cols: 10, tilt: TILT }),
    S.tubeMesh((t) => [118 + (1082 - 118) * t, TOPY1, 0], 4.6, { rows: 60, cols: 10, tilt: TILT }),
  ]
  const towersX = [176, 1024]
  const towers = []
  for (const x of towersX) {
    for (const dx of [-15, 15]) towers.push(S.tubeMesh((t) => [x + dx, TOPY0 + (BASE_Y + 52 - TOPY0) * t, 0], 4.2, { rows: 70, cols: 10, tilt: TILT }))
  }

  // crowd
  const R = rng(2025)
  const crowd = []
  const rowsDef = [
    { y: 742, r: 15, n: 14, tone: 0.55, jit: 14 },
    { y: 782, r: 19, n: 11, tone: 0.32, jit: 16 },
    { y: 832, r: 25, n: 8, tone: 0.1, jit: 18 },
  ]
  for (const row of rowsDef) {
    const step = 1240 / row.n
    for (let k = 0; k < row.n; k++) {
      const x = -20 + step * (k + 0.5) + (R() - 0.5) * row.jit * 2
      const y = row.y + (R() - 0.5) * 8
      const r = row.r * (0.9 + R() * 0.22)
      crowd.push({ x, y, r, tone: row.tone, phone: R() < 0.22, hairy: R() < 0.5, lean: (R() - 0.5) * 0.18 })
    }
  }
  return { arch, ribbons, chords, towers, crowd, SCY0, SCY1 }
}

function personPath(p) {
  const { x, y, r } = p
  const w = r * 2.3
  const y2 = 910
  const neck = r * 0.42
  return (
    `M${S.r1(x - w)} ${y2}C${S.r1(x - w)} ${S.r1(y + r * 2.9)} ${S.r1(x - w * 0.62)} ${S.r1(y + r * 1.55)} ${S.r1(x - neck * 1.3)} ${S.r1(y + r * 1.3)}` +
    `L${S.r1(x + neck * 1.3)} ${S.r1(y + r * 1.3)}C${S.r1(x + w * 0.62)} ${S.r1(y + r * 1.55)} ${S.r1(x + w)} ${S.r1(y + r * 2.9)} ${S.r1(x + w)} ${y2}Z`
  )
}

function zigzag(x0, x1, y0, y1, step) {
  const pts = []
  let k = 0
  for (let x = x0; x <= x1 + 0.1; x += step / 2) {
    pts.push([x, k % 2 === 0 ? y0 : y1])
    k++
  }
  return pts
}
function zigzagV(y0, y1, x0, x1, step) {
  const pts = []
  let k = 0
  for (let y = y0; y <= y1 + 0.1; y += step / 2) {
    pts.push([k % 2 === 0 ? x0 : x1, y])
    k++
  }
  return pts
}

export function scene(mode) {
  G ||= build()
  const { arch, ribbons, chords, towers, crowd } = G

  const FIX = [330, 500, 700, 870]
  const TGT = [470, 560, 640, 730]
  const FIX_Y = 122
  const TGT_Y = 692

  const cleanBack = (ctx) =>
    S.cleanBackdrop(ctx, {
      wall: ['#CFC5B0', '#BDB29B'],
      floor: ['#B3A790', '#8F846F'],
      horizon: 700,
      spot: { x: 600, y: 420, r: 560, col: '#FFF4DC', op: 0.65 },
      vignette: 0.42,
      baseboard: false,
      extra: (c) => {
        const g = c.uid('hz')
        c.def(`<radialGradient id="${g}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE8C0" stop-opacity="0.8"/><stop offset="1" stop-color="#FFE8C0" stop-opacity="0"/></radialGradient>`)
        return `<ellipse cx="600" cy="430" rx="470" ry="360" fill="url(#${g})"/>`
      },
    })
  const aiBack = (ctx) => S.aiBackdrop(ctx, { seed: 47, glow: { x: 600, y: 450 }, floor: { x: AX, y: 690, r: 380, ry: 78 }, marks: 34 })

  const items = []

  // ---------- stage -----------------------------------------------------------------------------------
  const stageTop = [[262, 636], [938, 636], [1012, 724], [188, 724]]
  const stageFront = [[188, 724], [1012, 724], [1012, 760], [188, 760]]
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('st')
      const g2 = ctx.uid('sf')
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8CFBC"/><stop offset="1" stop-color="#F1EBDD"/></linearGradient>`)
      ctx.def(`<linearGradient id="${g2}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A3A40"/><stop offset="1" stop-color="#17171A"/></linearGradient>`)
      return (
        `<path d="M200 760L1000 760L1040 790L160 790Z" fill="#0d0d0c" opacity="0.4" filter="${ctx.blur(12)}"/>` +
        `<path d="${E.path(stageTop, true)}" fill="url(#${g})"/>` +
        `<path d="${E.path(stageFront, true)}" fill="url(#${g2})"/>` +
        `<path d="M188 724L1012 724" stroke="#E4FF8A" stroke-width="3" stroke-opacity="0.95"/><path d="M188 724L1012 724" stroke="#D5FF4F" stroke-width="9" stroke-opacity="0.45" filter="${ctx.blurBox(4)}"/>`
      )
    },
    ai: (ctx) =>
      `<path d="${E.path(stageTop, true)}" fill="#0f1310" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="2"/><path d="${E.path(stageFront, true)}" fill="#0a0c0b" stroke="${LUMEN}" stroke-opacity="0.6" stroke-width="1.6"/><path d="M188 724L1012 724" stroke="${LUMEN}" stroke-width="3" filter="${ctx.blurBox(3)}"/>` +
      range(0, 1, 10).map((t) => `<line x1="${S.r1(262 + 676 * t)}" y1="636" x2="${S.r1(188 + 824 * t)}" y2="724" stroke="${LUMEN}" stroke-opacity="0.2"/>`).join(''),
    sil: () => E.path(stageTop, true),
    scan: false,
  })

  // ---------- gantry --------------------------------------------------------------------------------------
  const trussMat = S.fabric('#34343A', { depth: 0.3, lift: 1.5, spec: 0.8, gloss: 40, rim: 0.5, fill: 0.2, specTint: 0.8 })
  const aiTruss = { tone: 'steel', rows: [], cols: [], outline: 0.8, glow: false }
  const hz = zigzag(118, 1082, 62, 100, 40)
  const hzNodes = hz
  const tzigs = [176, 1024].map((x) => zigzagV(62, BASE_Y + 52, x - 15, x + 15, 40))
  items.push({
    clean: () =>
      `<path d="${E.path(hz)}" fill="none" stroke="#1d1d21" stroke-width="3" stroke-linejoin="round"/><path d="${E.path(hz)}" fill="none" stroke="#9C9CA6" stroke-width="1.2" stroke-linejoin="round" stroke-opacity="0.8"/>` +
      tzigs.map((z) => `<path d="${E.path(z)}" fill="none" stroke="#1d1d21" stroke-width="2.6" stroke-linejoin="round"/><path d="${E.path(z)}" fill="none" stroke="#9C9CA6" stroke-width="1" stroke-linejoin="round" stroke-opacity="0.7"/>`).join(''),
    ai: (ctx) =>
      `<g filter="${ctx.blurBox(3)}" opacity="0.5"><path d="${E.path(hz)}" fill="none" stroke="${LUMEN}" stroke-width="4"/></g>` +
      `<path d="${E.path(hz)}" fill="none" stroke="${LUMEN}" stroke-width="1.6" stroke-opacity="0.8" stroke-linejoin="round"/>` +
      tzigs.map((z) => `<path d="${E.path(z)}" fill="none" stroke="${LUMEN}" stroke-width="1.5" stroke-opacity="0.7" stroke-linejoin="round"/>`).join(''),
  })
  for (const c of [...chords, ...towers]) items.push(S.solid(c, { mat: trussMat, ai: aiTruss, seam: 1, scan: false }))
  // truss node dots + base plates
  items.push({
    clean: () => hzNodes.filter((_, i) => i % 2 === 0).map((p) => `<circle cx="${S.r1(p[0])}" cy="${p[1]}" r="3.2" fill="#C9C9D0"/>`).join('') +
      [176, 1024].map((x) => `<rect x="${x - 26}" y="${BASE_Y + 50}" width="52" height="9" rx="2" fill="#2a2a2f"/><rect x="${x - 26}" y="${BASE_Y + 50}" width="52" height="2" fill="#fff" opacity="0.25"/>`).join(''),
    ai: () => [176, 1024].map((x) => `<rect x="${x - 26}" y="${BASE_Y + 50}" width="52" height="9" rx="2" fill="none" stroke="${LUMEN}" stroke-width="1.8"/>`).join(''),
  })

  // ---------- arch + screen ------------------------------------------------------------------------------------
  const sd = screenD(R_IN - 8, BASE_Y - 12)
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('scr')
      const cid = ctx.uid('scc')
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A1816"/><stop offset="1" stop-color="#2C1F18"/></linearGradient>`)
      ctx.def(`<clipPath id="${cid}"><path d="${sd}"/></clipPath>`)
      return (
        `<path d="${sd}" fill="url(#${g})"/>` +
        `<g clip-path="url(#${cid})">${ribbons.map((r) => `<g filter="${ctx.blurBox(14)}" opacity="${r.kind === 'alt' ? 0.28 : 0.5}"><path d="${E.path(r.m.outline(), true)}" fill="${r.kind === 'alt' ? '#F2F0DC' : '#D5FF4F'}"/></g>`).join('')}</g>`
      )
    },
    ai: (ctx) => {
      const cid = ctx.uid('scc')
      ctx.def(`<clipPath id="${cid}"><path d="${sd}"/></clipPath>`)
      const grid = []
      for (let x = 340; x <= 860; x += 26) grid.push(`<line x1="${x}" y1="190" x2="${x}" y2="${BASE_Y}" stroke="${LUMEN}" stroke-opacity="0.06"/>`)
      for (let y = 200; y <= BASE_Y; y += 26) grid.push(`<line x1="340" y1="${y}" x2="860" y2="${y}" stroke="${LUMEN}" stroke-opacity="0.06"/>`)
      return `<path d="${sd}" fill="#0A0F0C"/><g clip-path="url(#${cid})">${grid.join('')}</g>`
    },
  })
  const ribMat = (kind) =>
    kind === 'alt'
      ? S.satin('#F1E2C8', { depth: 0.35, lift: 1.0, spec: 0.5, gloss: 26, rim: 0.4, fill: 0.3 })
      : S.satin(kind === 'main' ? '#CFF73F' : '#A9D12A', { depth: 0.22, lift: 1.15, spec: 0.6, gloss: 28, rim: 0.5, fill: 0.2, specTint: 0.6, rimTint: 0.6 })
  const screenClipItem = (inner) => ({
    clean: (ctx) => {
      const cid = ctx.uid('rc')
      ctx.def(`<clipPath id="${cid}"><path d="${sd}"/></clipPath>`)
      return `<g clip-path="url(#${cid})">${inner.clean(ctx)}</g>`
    },
    ai: (ctx) => {
      const cid = ctx.uid('rc')
      ctx.def(`<clipPath id="${cid}"><path d="${sd}"/></clipPath>`)
      return `<g clip-path="url(#${cid})">${inner.ai(ctx)}</g>`
    },
    sil: inner.sil,
    scan: inner.scan,
  })
  // paint order: alt (back) then mains
  for (const k of ['alt', 'main2', 'main']) {
    const r = ribbons.find((x) => x.kind === k)
    items.push(
      screenClipItem(
        S.solid(r.m, {
          mat: ribMat(k),
          seam: 1.2,
          scan: false,
          ai: { tone: 'dark', rows: range(0, 1, 42), cols: range(0, 1, 5), rowOp: k === 'alt' ? 0.3 : 0.45, colOp: 0.4, rowW: 1.2, colW: 1.1, outline: 0.75, glow: true },
        }),
      ),
    )
  }
  // arch band + inner LED line
  items.push({
    clean: (ctx) => {
      const p = []
      const path = archPath(R_IN - 3)
      for (let k = 0; k <= 160; k++) {
        const q = path((k / 160) * LEN)
        p.push([q[0], q[1]])
      }
      return `<path d="${E.path(p)}" fill="none" stroke="#D5FF4F" stroke-width="10" stroke-opacity="0.5" filter="${ctx.blurBox(5)}"/>`
    },
    ai: () => '',
  })
  items.push(S.dropShadow(arch, { dx: 14, dy: 10, std: 10, op: 0.3 }))
  items.push(
    S.solid(arch, {
      mat: S.satin('#EDE6D6', { depth: 0.5, lift: 1.0, spec: 0.35, gloss: 20, rim: 0.3, fill: 0.3 }),
      seam: 1.3,
      ai: { tone: 'dark', rows: range(0, 1, 60), cols: [0, 0.25, 0.5, 0.75, 1], rowOp: 0.28, colOp: 0.55, outline: 0.7, glow: true },
      after: () => {
        const p = []
        const path = archPath(R_IN)
        for (let k = 0; k <= 160; k++) {
          const q = path((k / 160) * LEN)
          p.push([q[0], q[1]])
        }
        return `<path d="${E.path(p)}" fill="none" stroke="#E4FF8A" stroke-width="2.4" stroke-opacity="0.95"/>`
      },
    }),
  )

  // ---------- spotlights + beams --------------------------------------------------------------------------------
  const beams = FIX.map((fx, k) => {
    const tx = TGT[k]
    const rx = 74
    const ry = 17
    return { fx, tx, rx, ry }
  })
  items.push({
    clean: (ctx) =>
      beams
        .map((b, k) => {
          const g = ctx.uid('bm')
          ctx.def(`<linearGradient id="${g}" gradientUnits="userSpaceOnUse" x1="${b.fx}" y1="${FIX_Y}" x2="${b.tx}" y2="${TGT_Y}"><stop offset="0" stop-color="#FFF6E2" stop-opacity="0.5"/><stop offset="1" stop-color="#FFF1D6" stop-opacity="0.1"/></linearGradient>`)
          return (
            `<path d="M${b.fx} ${FIX_Y + 12}L${b.tx - b.rx} ${TGT_Y}A${b.rx} ${b.ry} 0 0 0 ${b.tx + b.rx} ${TGT_Y}Z" fill="url(#${g})"/>` +
            `<ellipse cx="${b.tx}" cy="${TGT_Y}" rx="${b.rx}" ry="${b.ry}" fill="#FFF6E2" opacity="0.5" filter="${ctx.blurBox(6)}"/>`
          )
        })
        .join(''),
    ai: (ctx) =>
      beams
        .map(
          (b) =>
            `<path d="M${b.fx} ${FIX_Y + 12}L${b.tx - b.rx} ${TGT_Y}A${b.rx} ${b.ry} 0 0 0 ${b.tx + b.rx} ${TGT_Y}Z" fill="${LUMEN}" fill-opacity="0.07" stroke="${LUMEN}" stroke-opacity="0.45" stroke-width="1.4" stroke-linejoin="round"/>` +
            `<ellipse cx="${b.tx}" cy="${TGT_Y}" rx="${b.rx}" ry="${b.ry}" fill="${LUMEN}" fill-opacity="0.1" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="1.8"/>`,
        )
        .join(''),
  })
  // fixtures
  items.push({
    clean: (ctx) =>
      beams
        .map((b) => {
          const ang = (Math.atan2(TGT_Y - FIX_Y, b.tx - b.fx) * 180) / Math.PI - 90
          const g = ctx.uid('fx')
          ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#55555d"/><stop offset="0.45" stop-color="#2a2a2f"/><stop offset="1" stop-color="#111113"/></linearGradient>`)
          return (
            `<path d="M${b.fx} ${TOPY(104)}V${FIX_Y - 8}" stroke="#1d1d21" stroke-width="3"/>` +
            `<g transform="translate(${b.fx} ${FIX_Y}) rotate(${S.r1(ang)})"><rect x="-13" y="-6" width="26" height="40" rx="5" fill="url(#${g})"/><ellipse cx="0" cy="34" rx="12" ry="4" fill="#FFF3D4"/><ellipse cx="0" cy="34" rx="12" ry="4" fill="none" stroke="#fff" stroke-opacity="0.6"/><rect x="-13" y="-6" width="26" height="3" rx="1.5" fill="#fff" opacity="0.25"/></g>`
          )
        })
        .join(''),
    ai: (ctx) =>
      beams
        .map((b) => {
          const ang = (Math.atan2(TGT_Y - FIX_Y, b.tx - b.fx) * 180) / Math.PI - 90
          return (
            `<path d="M${b.fx} ${TOPY(104)}V${FIX_Y - 8}" stroke="${LUMEN}" stroke-width="1.8"/>` +
            `<g transform="translate(${b.fx} ${FIX_Y}) rotate(${S.r1(ang)})"><rect x="-13" y="-6" width="26" height="40" rx="5" fill="#0c120d" stroke="${LUMEN}" stroke-width="1.8"/><ellipse cx="0" cy="34" rx="12" ry="4" fill="${LUMEN}"/></g>`
          )
        })
        .join(''),
  })

  // ---------- crowd --------------------------------------------------------------------------------------------
  items.push({
    clean: (ctx) => {
      const out = []
      const sorted = [...crowd].sort((a, b) => a.y - b.y)
      for (const p of sorted) {
        const c = mix(hex('#101012'), hex('#6c665a'), p.tone)
        const col = E.toHex(c)
        const rim = E.toHex(mix(c, hex('#F5E3BD'), 0.55))
        out.push(`<path d="${personPath(p)}" fill="${col}"/>`)
        out.push(`<ellipse cx="${S.r1(p.x)}" cy="${S.r1(p.y)}" rx="${S.r1(p.r * 0.86)}" ry="${S.r1(p.r)}" fill="${col}" transform="rotate(${S.r1(p.lean * 57)} ${S.r1(p.x)} ${S.r1(p.y)})"/>`)
        // rim light along the top edge of the head and shoulders
        out.push(`<path d="M${S.r1(p.x - p.r * 0.78)} ${S.r1(p.y - p.r * 0.35)}A${S.r1(p.r * 0.86)} ${S.r1(p.r)} 0 0 1 ${S.r1(p.x + p.r * 0.5)} ${S.r1(p.y - p.r * 0.85)}" fill="none" stroke="${rim}" stroke-width="${S.r1(Math.max(1.4, p.r * 0.1))}" stroke-opacity="${(0.65 - p.tone * 0.5).toFixed(2)}" stroke-linecap="round"/>`)
        out.push(`<path d="M${S.r1(p.x - p.r * 1.9)} ${S.r1(p.y + p.r * 2.1)}Q${S.r1(p.x - p.r * 1.3)} ${S.r1(p.y + p.r * 1.45)} ${S.r1(p.x - p.r * 0.5)} ${S.r1(p.y + p.r * 1.32)}" fill="none" stroke="${rim}" stroke-width="${S.r1(Math.max(1.2, p.r * 0.08))}" stroke-opacity="${(0.5 - p.tone * 0.4).toFixed(2)}" stroke-linecap="round"/>`)
        if (p.phone) {
          const px = p.x + p.r * 1.75
          const py = p.y - p.r * 0.9
          out.push(`<path d="M${S.r1(p.x + p.r * 1.7)} ${S.r1(p.y + p.r * 2.1)}Q${S.r1(p.x + p.r * 2.5)} ${S.r1(p.y + p.r * 0.9)} ${S.r1(px)} ${S.r1(py + 4)}" fill="none" stroke="${col}" stroke-width="${S.r1(p.r * 0.78)}" stroke-linecap="round"/>`)
          out.push(`<rect x="${S.r1(px - 6)}" y="${S.r1(py - 12)}" width="12" height="20" rx="2.5" fill="#FFF3D8" opacity="0.96" transform="rotate(10 ${S.r1(px)} ${S.r1(py)})"/>`)
        }
      }
      return out.join('')
    },
    ai: (ctx) => {
      const out = []
      const sorted = [...crowd].sort((a, b) => a.y - b.y)
      for (const p of sorted) {
        const front = p.tone < 0.2
        out.push(`<path d="${personPath(p)}" fill="#090c0b"/>`)
        out.push(`<ellipse cx="${S.r1(p.x)}" cy="${S.r1(p.y)}" rx="${S.r1(p.r * 0.86)}" ry="${S.r1(p.r)}" fill="#090c0b" transform="rotate(${S.r1(p.lean * 57)} ${S.r1(p.x)} ${S.r1(p.y)})"/>`)
        out.push(`<path d="${personPath(p)}" fill="none" stroke="${LUMEN}" stroke-opacity="${(0.55 - p.tone * 0.4).toFixed(2)}" stroke-width="1.4"/>`)
        out.push(`<ellipse cx="${S.r1(p.x)}" cy="${S.r1(p.y)}" rx="${S.r1(p.r * 0.86)}" ry="${S.r1(p.r)}" fill="none" stroke="${LUMEN}" stroke-opacity="${(0.8 - p.tone * 0.5).toFixed(2)}" stroke-width="${front ? 1.8 : 1.3}" transform="rotate(${S.r1(p.lean * 57)} ${S.r1(p.x)} ${S.r1(p.y)})"/>`)
        if (p.phone) {
          const px = p.x + p.r * 1.75
          const py = p.y - p.r * 0.9
          out.push(`<path d="M${S.r1(p.x + p.r * 1.7)} ${S.r1(p.y + p.r * 2.1)}Q${S.r1(p.x + p.r * 2.5)} ${S.r1(p.y + p.r * 0.9)} ${S.r1(px)} ${S.r1(py + 4)}" fill="none" stroke="${LUMEN}" stroke-opacity="0.5" stroke-width="1.4"/>`)
          out.push(`<rect x="${S.r1(px - 6)}" y="${S.r1(py - 12)}" width="12" height="20" rx="2.5" fill="${LUMEN}" opacity="0.92" transform="rotate(10 ${S.r1(px)} ${S.r1(py)})"/>`)
        }
      }
      return out.join('')
    },
  })

  // ---------- HUD -----------------------------------------------------------------------------------------------
  const hudItems = []
  hudItems.push(hud.bracket(AX - R_OUT - 22, ARC_Y - R_OUT - 22, 2 * R_OUT + 44, BASE_Y - (ARC_Y - R_OUT) + 44, 28))
  hudItems.push(hud.hdim(BASE_Y + 120, AX - R_OUT, AX + R_OUT))
  hudItems.push(hud.vdim(AX + R_OUT + 70, ARC_Y - R_OUT, BASE_Y))
  hudItems.push(hud.measure([AX - R_IN, 520], [AX + R_IN, 520], { len: 40 }))
  for (const b of beams) hudItems.push(hud.cross([b.fx, FIX_Y + 36]))
  for (const p of crowd.filter((q) => q.tone < 0.2).slice(0, 5)) {
    const s = p.r * 1.5
    hudItems.push(hud.bracket(S.r1(p.x - s), S.r1(p.y - s * 1.3), S.r1(s * 2), S.r1(s * 2.5), 8, 0.85))
  }
  hudItems.push(hud.cross(ribbons[0].m.pt(0.5, 0.38)))
  hudItems.push(hud.cross(ribbons[2].m.pt(0.5, 0.7)))
  hudItems.push(hud.cross(arch.pt(0.5, 0.18)))
  hudItems.push(hud.cross(arch.pt(0.5, 0.82)))

  return S.renderScene(mode, {
    backdrop: { clean: cleanBack, ai: aiBack },
    items,
    hud: hudItems,
    scan: { y: 300, h: 240 },
  })
}

function TOPY(v) {
  return v
}
