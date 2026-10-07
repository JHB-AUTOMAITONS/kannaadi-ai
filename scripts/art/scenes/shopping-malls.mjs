// Shopping mall: an in-store virtual fitting kiosk (tall interactive mirror) on a polished concourse,
// with converging floor lines, storefront walls and pillars. The on-screen try-on figure is real mesh
// geometry, so the AI scan version shows it as a lumen wireframe.
import * as S from './_shared.mjs'
import { mannequin } from './_mannequin.mjs'

const { E, smooth, pchip, range, LUMEN, hud, hex, mix, clamp } = S

const VPX = 600
const VPY = 360
const proj = (X, Y, z) => [VPX + X / z, VPY + Y / z]

// kiosk geometry
const KX0 = 432
const KX1 = 768
const KY0 = 142
const KY1 = 704
const SX0 = KX0 + 18
const SX1 = KX1 - 18
const SY0 = KY0 + 44
const SY1 = KY1 - 34
const SCX = (SX0 + SX1) / 2
const FLOOR_Y = 800
const STRIPS = [[0.9, 1.5], [1.75, 2.6], [3.0, 4.4], [5.0, 7.4], [8.4, 12.5], [14, 21]]

let G = null

function build() {
  const TILT = 0.14
  const m = mannequin({ cx: SCX, top: SY0 + 30, h: 392, tilt: TILT, rows: 60, cols: 48 })
  const Y = m.Y
  const yTop = Y(258)
  const yHem = Y(944)
  const gA = pchip([[Y(385), 31], [Y(470), 41], [Y(560), 49], [Y(700), 62], [Y(850), 78], [yHem, 92]])
  const gB = pchip([[Y(385), 26], [Y(470), 33], [Y(560), 39], [Y(700), 46], [Y(850), 56], [yHem, 64]])
  const gown = S.sorMesh({
    y0: yTop,
    y1: yHem,
    A: (y) => (y < Y(385) ? m.A(y) * 1.035 + 1.2 : gA(y)),
    B: (y) => (y < Y(385) ? m.B(y) * 1.035 + 1.2 : gB(y)),
    cx: () => SCX,
    tilt: TILT,
    rows: 80,
    cols: 90,
    pleats: { n: 15, amp: (y) => 0.028 * smooth(Y(520), yHem, y), tw: (y) => 0.8 * smooth(Y(500), yHem, y) },
    yShift: (y, th) => {
      const t = th - Math.PI / 2
      const peak = -4 * Math.exp(-Math.pow((Math.abs(t) - 0.6) / 0.3, 2))
      const dip = 5 * Math.exp(-Math.pow(t / 0.2, 2))
      const side = 8 * smooth(0.6, 1.57, Math.abs(t))
      const hem = 2.4 * smooth(yHem - 50, yHem, y) * Math.sin(15 * th + 0.4)
      return (peak + dip + side) * (1 - smooth(yTop, yTop + 20, y)) + hem
    },
  })

  // pillars
  const pillar = (cx, yBase, wpx, yTopP) =>
    S.sorMesh({
      y0: yTopP,
      y1: yBase,
      A: () => wpx,
      B: () => wpx,
      cx: () => cx,
      tilt: 0.12,
      rows: 40,
      cols: 40,
    })
  const pillars = [
    { m: pillar(120, 736, 52, -20), x: 120 },
    { m: pillar(1080, 736, 52, -20), x: 1080 },
    { m: pillar(342, 506, 22, 214), x: 342 },
    { m: pillar(858, 506, 22, 214), x: 858 },
  ]
  return { m, gown, pillars }
}

function sole(cx, cy, s, rot) {
  // footprint: ball + heel, at floor perspective
  return `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})"><ellipse cx="0" cy="-6" rx="9" ry="14" /><ellipse cx="0" cy="13" rx="6" ry="8"/></g>`
}

export function scene(mode) {
  G ||= build()
  const { m, gown, pillars } = G
  const clean = mode === 'clean'

  // ---------- concourse (walls, floor, ceiling) -------------------------------------------------------
  const wallX = 1000
  const floorY = 540
  const ceilY = -420
  const wallQuad = (sg, z0, z1, y0, y1) => [proj(sg * wallX, y0, z0), proj(sg * wallX, y0, z1), proj(sg * wallX, y1, z1), proj(sg * wallX, y1, z0)]
  const windows = []
  const zs = [1.9, 2.6, 3.5, 4.8, 6.6, 9, 12.5, 17]
  for (let i = 0; i < zs.length - 1; i++) {
    for (const sg of [-1, 1]) {
      const z0 = zs[i] * 1.02
      const z1 = zs[i + 1] * 0.97
      windows.push({ sg, q: wallQuad(sg, z0, z1, -230, 380), z0 })
    }
  }

  const concourseClean = (ctx) => {
    const out = []
    const gC = ctx.uid('ceil')
    const gW = ctx.uid('wall')
    const gF = ctx.uid('flr')
    const gG = ctx.uid('glow')
    ctx.def(`<linearGradient id="${gC}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDD5C4"/><stop offset="1" stop-color="#F3EEE2"/></linearGradient>`)
    ctx.def(`<linearGradient id="${gW}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#CBC2AE"/><stop offset="1" stop-color="#EDE6D6"/></linearGradient>`)
    ctx.def(`<linearGradient id="${gF}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDE7DA"/><stop offset="0.45" stop-color="#D8D0BE"/><stop offset="1" stop-color="#B9B09B"/></linearGradient>`)
    ctx.def(`<radialGradient id="${gG}" gradientUnits="userSpaceOnUse" cx="${VPX}" cy="${VPY}" r="420"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.95"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`)
    out.push(`<rect width="1200" height="900" fill="#F1ECDF"/>`)
    // ceiling
    out.push(`<path d="M0 0H1200L${proj(wallX, ceilY, 22)[0]} ${proj(wallX, ceilY, 22)[1]}L${proj(-wallX, ceilY, 22)[0]} ${proj(-wallX, ceilY, 22)[1]}Z" fill="url(#${gC})"/>`)
    // far end
    out.push(`<rect x="${proj(-wallX, 0, 22)[0]}" y="${proj(0, ceilY, 22)[1]}" width="${proj(wallX, 0, 22)[0] - proj(-wallX, 0, 22)[0]}" height="${proj(0, floorY, 22)[1] - proj(0, ceilY, 22)[1]}" fill="#F7F3EA"/>`)
    // side walls
    for (const sg of [-1, 1]) {
      const q = wallQuad(sg, 0.9, 22, ceilY, floorY)
      out.push(`<path d="${E.path(q, true)}" fill="url(#${gW})" opacity="${sg < 0 ? 1 : 0.96}"/>`)
    }
    // floor
    out.push(`<path d="M0 ${VPY}L${proj(-wallX, floorY, 22)[0]} ${proj(0, floorY, 22)[1]}L${proj(wallX, floorY, 22)[0]} ${proj(0, floorY, 22)[1]}L1200 ${VPY}L1200 900L0 900Z" fill="url(#${gF})"/>`)
    out.push(`<rect y="${proj(0, floorY, 22)[1] - 1}" width="1200" height="${900 - proj(0, floorY, 22)[1] + 1}" fill="url(#${gF})"/>`)
    // storefront windows
    for (const w of windows) {
      const lit = ctx.uid('wl')
      ctx.def(`<linearGradient id="${lit}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF9EA"/><stop offset="1" stop-color="#F0E4C8"/></linearGradient>`)
      out.push(`<path d="${E.path(w.q, true)}" fill="url(#${lit})" stroke="#4a4234" stroke-opacity="0.55" stroke-width="${clamp(5 / w.z0, 1.2, 4)}" stroke-linejoin="round"/>`)
      // display silhouettes inside the windows (abstract racks)
      const c0 = w.q[0]
      const c1 = w.q[1]
      const c3 = w.q[3]
      const mx = (c0[0] + c1[0]) / 2
      const hgt = c3[1] - c0[1]
      out.push(`<path d="M${S.r1(mx - (c1[0] - c0[0]) * 0.28)} ${S.r1(c0[1] + hgt * 0.78)}H${S.r1(mx + (c1[0] - c0[0]) * 0.28)}" stroke="#4a4234" stroke-opacity="0.35" stroke-width="${clamp(3 / w.z0, 0.8, 2.4)}"/>`)
    }
    // ceiling light strips
    for (const sg of [-1, 0, 1]) {
      for (const [z0, z1] of STRIPS) {
        const X = sg * 260
        const q = [proj(X - 70, ceilY, z0), proj(X + 70, ceilY, z0), proj(X + 70, ceilY, z1), proj(X - 70, ceilY, z1)]
        out.push(`<path d="${E.path(q, true)}" fill="#FFFFFF" opacity="0.92"/>`)
      }
    }
    // floor tile lines
    const lines = []
    for (let k = -9; k <= 9; k++) {
      const X = k * 210
      const a = proj(X, floorY, 1)
      const b = proj(X, floorY, 30)
      lines.push(`M${S.r1(a[0])} ${S.r1(a[1])}L${S.r1(b[0])} ${S.r1(b[1])}`)
    }
    for (let n = 0; n < 14; n++) {
      const z = 1 + n * 0.0 + Math.pow(1.34, n) - 1 + 0.5
      const y = proj(0, floorY, z)[1]
      if (y > VPY + 4 && y < 900) lines.push(`M0 ${S.r1(y)}H1200`)
    }
    out.push(`<path d="${lines.join('')}" stroke="#7a6e55" stroke-opacity="0.2" stroke-width="1.2" fill="none"/>`)
    out.push(`<rect width="1200" height="900" fill="url(#${gG})" opacity="0.8"/>`)
    return out.join('')
  }
  const concourseAi = (ctx) => {
    const out = []
    // dark corridor planes with perspective lumen lines
    const P = []
    for (let k = -9; k <= 9; k++) {
      const a = proj(k * 210, floorY, 1)
      const b = proj(k * 210, floorY, 30)
      P.push(`<line x1="${S.r1(a[0])}" y1="${S.r1(a[1])}" x2="${S.r1(b[0])}" y2="${S.r1(b[1])}" stroke="${LUMEN}" stroke-opacity="${k === 0 ? 0.16 : 0.1}" stroke-width="1.2"/>`)
    }
    for (let n = 0; n < 14; n++) {
      const z = Math.pow(1.34, n) + 0.5
      const y = proj(0, floorY, z)[1]
      if (y > VPY + 4 && y < 900) P.push(`<line x1="0" y1="${S.r1(y)}" x2="1200" y2="${S.r1(y)}" stroke="${LUMEN}" stroke-opacity="${(0.05 + 0.14 * (1 - (y - VPY) / 540)).toFixed(3)}" stroke-width="1.2"/>`)
    }
    // wall/ceiling edge lines
    for (const sg of [-1, 1]) {
      for (const Yw of [floorY, ceilY]) {
        const a = proj(sg * wallX, Yw, 0.9)
        const b = proj(sg * wallX, Yw, 22)
        P.push(`<line x1="${S.r1(a[0])}" y1="${S.r1(a[1])}" x2="${S.r1(b[0])}" y2="${S.r1(b[1])}" stroke="${LUMEN}" stroke-opacity="0.3" stroke-width="1.6"/>`)
      }
    }
    for (const w of windows) {
      out.push(`<path d="${E.path(w.q, true)}" fill="${LUMEN}" fill-opacity="0.035" stroke="${LUMEN}" stroke-opacity="0.38" stroke-width="${clamp(4 / w.z0, 1, 2.4)}" stroke-linejoin="round"/>`)
    }
    for (const sg of [-1, 0, 1]) {
      for (const [z0, z1] of STRIPS) {
        const X = sg * 260
        const q = [proj(X - 70, ceilY, z0), proj(X + 70, ceilY, z0), proj(X + 70, ceilY, z1), proj(X - 70, ceilY, z1)]
        out.push(`<path d="${E.path(q, true)}" fill="${LUMEN}" fill-opacity="0.12" stroke="${LUMEN}" stroke-opacity="0.35" stroke-width="1.2"/>`)
      }
    }
    return P.join('') + out.join('')
  }

  const items = []
  items.push({ clean: concourseClean, ai: concourseAi })

  // ---------- pillars ---------------------------------------------------------------------------------
  const stoneMat = S.matte('#E4DCCB', { depth: 0.55, lift: 1.0, spec: 0.12, gloss: 14, rim: 0.3 })
  for (const p of pillars) {
    const far = p.m.cfg.y1 < 600
    items.push({
      clean: (ctx) => S.groundShadow(ctx, p.x + (far ? 8 : 16), p.m.cfg.y1 + 4, p.m.cfg.A() * 1.5, far ? 5 : 11, far ? 0.7 : 0.9),
      ai: () => '',
    })
    items.push(
      S.solid(p.m, {
        mat: stoneMat,
        ai: { tone: 'dark', rows: range(0, 1, far ? 8 : 24), cols: range(0, 1, far ? 6 : 8), rowOp: 0.18, colOp: 0.26, outline: 0.5, hot: [{ row: 1, w: 2.2 }] },
        scan: false,
      }),
    )
  }

  // ---------- floor markings --------------------------------------------------------------------------
  const FY = 818
  items.push({
    clean: (ctx) => {
      const rg = ctx.uid('pool')
      ctx.def(`<radialGradient id="${rg}" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.75"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`)
      return (
        `<ellipse cx="${SCX}" cy="${FY - 40}" rx="330" ry="96" fill="url(#${rg})"/>` +
        S.groundShadow(ctx, SCX + 6, 778, 150, 14, 1) +
        `<ellipse cx="${SCX}" cy="${FY}" rx="164" ry="34" fill="none" stroke="#3a3326" stroke-opacity="0.55" stroke-width="2.4"/>` +
        `<ellipse cx="${SCX}" cy="${FY}" rx="142" ry="29" fill="none" stroke="#B8924F" stroke-opacity="0.8" stroke-width="2" stroke-dasharray="3 9"/>` +
        `<g fill="#3a3326" fill-opacity="0.55">${sole(SCX - 24, FY + 2, 1.05, -6)}${sole(SCX + 24, FY + 2, 1.05, 6)}</g>` +
        `<path d="M${SCX - 70} ${FY - 34}L${SCX - 112} ${FY - 70}M${SCX + 70} ${FY - 34}L${SCX + 112} ${FY - 70}" stroke="#B8924F" stroke-opacity="0.65" stroke-width="2" stroke-linecap="round" stroke-dasharray="2 8"/>`
      )
    },
    ai: () =>
      [0, 1, 2, 3].map((i) => `<ellipse cx="${SCX}" cy="${FY}" rx="${164 + i * 46}" ry="${34 + i * 9}" fill="none" stroke="${LUMEN}" stroke-opacity="${(0.55 - i * 0.12).toFixed(2)}" stroke-width="${i === 0 ? 2.4 : 1.4}"${i % 2 ? ' stroke-dasharray="2 9"' : ''}/>`).join('') +
      `<ellipse cx="${SCX}" cy="${FY}" rx="142" ry="29" fill="none" stroke="${LUMEN}" stroke-opacity="0.6" stroke-width="1.6" stroke-dasharray="3 9"/>` +
      `<g fill="${LUMEN}" fill-opacity="0.55">${sole(SCX - 24, FY + 2, 1.05, -6)}${sole(SCX + 24, FY + 2, 1.05, 6)}</g>`,
  })

  // ---------- kiosk body --------------------------------------------------------------------------------
  const body = (ctx, isClean) => {
    const g1 = ctx.uid('kb')
    const g2 = ctx.uid('kc')
    const colA = isClean ? '#3A3A40' : '#14181a'
    const colB = isClean ? '#17171A' : '#0a0c0d'
    ctx.def(`<linearGradient id="${g1}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${colA}"/><stop offset="1" stop-color="${colB}"/></linearGradient>`)
    ctx.def(`<linearGradient id="${g2}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${isClean ? '#2B2B30' : '#101416'}"/><stop offset="1" stop-color="${isClean ? '#0E0E10' : '#07090a'}"/></linearGradient>`)
    const col = `<path d="M${SCX - 46} ${KY1 - 10}L${SCX - 62} ${KY1 + 66}L${SCX + 62} ${KY1 + 66}L${SCX + 46} ${KY1 - 10}Z" fill="url(#${g2})"/>`
    const base = `<ellipse cx="${SCX}" cy="${KY1 + 72}" rx="150" ry="22" fill="url(#${g2})"/><ellipse cx="${SCX}" cy="${KY1 + 66}" rx="150" ry="22" fill="url(#${g1})"/>`
    const slab = `<rect x="${KX0}" y="${KY0}" width="${KX1 - KX0}" height="${KY1 - KY0}" rx="30" fill="url(#${g1})"/>`
    const rim = `<rect x="${KX0 + 1}" y="${KY0 + 1}" width="${KX1 - KX0 - 2}" height="${KY1 - KY0 - 2}" rx="29" fill="none" stroke="${isClean ? '#fff' : LUMEN}" stroke-opacity="${isClean ? 0.28 : 0.85}" stroke-width="${isClean ? 1.6 : 2.2}"/>`
    const cam = `<circle cx="${SCX}" cy="${KY0 + 22}" r="6" fill="${isClean ? '#0a0a0b' : '#05080a'}" stroke="${isClean ? '#6a6a72' : LUMEN}" stroke-opacity="${isClean ? 1 : 0.9}" stroke-width="1.6"/><circle cx="${SCX - 1.6}" cy="${KY0 + 20.4}" r="1.6" fill="#fff" fill-opacity="${isClean ? 0.6 : 0.9}"/><rect x="${SCX - 54}" y="${KY0 + 20}" width="34" height="4" rx="2" fill="${isClean ? '#8E8E96' : LUMEN}" fill-opacity="${isClean ? 0.4 : 0.55}"/><rect x="${SCX + 20}" y="${KY0 + 20}" width="34" height="4" rx="2" fill="${isClean ? '#8E8E96' : LUMEN}" fill-opacity="${isClean ? 0.4 : 0.55}"/>`
    return (isClean ? '' : `<g filter="${ctx.blurBox(7)}" opacity="0.7"><rect x="${KX0}" y="${KY0}" width="${KX1 - KX0}" height="${KY1 - KY0}" rx="30" fill="none" stroke="${LUMEN}" stroke-width="5" stroke-opacity="0.6"/><ellipse cx="${SCX}" cy="${KY1 + 66}" rx="150" ry="22" fill="none" stroke="${LUMEN}" stroke-width="4" stroke-opacity="0.5"/></g>`) + col + base + slab + rim + cam
  }
  items.push({ clean: (c) => body(c, true), ai: (c) => body(c, false), sil: () => `M${KX0} ${KY0}H${KX1}V${KY1}H${KX0}Z`, scan: false })

  // ---------- screen content ---------------------------------------------------------------------------
  const sw = SX1 - SX0
  const sh = SY1 - SY0
  items.push({
    clean: (ctx) => {
      const g = ctx.uid('sc')
      const sp = ctx.uid('sp')
      const cid = ctx.uid('scl')
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FAF6EC"/><stop offset="1" stop-color="#E2D9C5"/></linearGradient>`)
      ctx.def(`<radialGradient id="${sp}" cx="0.5" cy="0.4" r="0.6"><stop offset="0" stop-color="#FFFFFF" stop-opacity="0.9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>`)
      ctx.def(`<clipPath id="${cid}"><rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10"/></clipPath>`)
      const cy = m.floorY - 6 + 20
      return (
        `<rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10" fill="url(#${g})"/>` +
        `<g clip-path="url(#${cid})"><rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" fill="url(#${sp})"/>` +
        `<ellipse cx="${SCX}" cy="${cy}" rx="104" ry="17" fill="#2a2418" opacity="0.28" filter="${ctx.blurBox(6)}"/>` +
        `<ellipse cx="${SCX}" cy="${cy - 2}" rx="94" ry="14" fill="none" stroke="#B8924F" stroke-opacity="0.7" stroke-width="1.6"/></g>`
      )
    },
    ai: (ctx) => {
      const cid = ctx.uid('scl')
      const cy = m.floorY - 6 + 20
      ctx.def(`<clipPath id="${cid}"><rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10"/></clipPath>`)
      const grid = []
      for (let x = SX0; x <= SX1; x += 28) grid.push(`<line x1="${x}" y1="${SY0}" x2="${x}" y2="${SY1}" stroke="${LUMEN}" stroke-opacity="0.07"/>`)
      for (let y = SY0; y <= SY1; y += 28) grid.push(`<line x1="${SX0}" y1="${y}" x2="${SX1}" y2="${y}" stroke="${LUMEN}" stroke-opacity="0.07"/>`)
      return (
        `<rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10" fill="#0B1012"/>` +
        `<g clip-path="url(#${cid})">${grid.join('')}<ellipse cx="${SCX}" cy="${cy}" rx="94" ry="14" fill="none" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="1.8"/><ellipse cx="${SCX}" cy="${cy}" rx="120" ry="19" fill="none" stroke="${LUMEN}" stroke-opacity="0.35" stroke-width="1.2" stroke-dasharray="2 7"/></g>` +
        `<rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10" fill="none" stroke="${LUMEN}" stroke-opacity="0.5" stroke-width="1.6"/>`
      )
    },
  })

  items.push(
    S.solid(m.body, {
      mat: E.MATERIALS.form,
      seam: 1.3,
      ai: { tone: 'form', rows: range(0, 1, 30), cols: range(0, 1, 10), rowOp: 0.3, colOp: 0.22, outline: 0.5 },
    }),
  )
  items.push(
    S.solid(gown, {
      mat: S.satin('#7A1B38', { depth: 0.14, lift: 1.25, spec: 0.55, gloss: 28, rim: 0.4, fill: 0.14, specTint: 0.6, rimTint: 0.5 }),
      seam: 1.3,
      ai: { tone: 'dark', rows: range(0, 1, 40), cols: range(0, 1, 30), rowOp: 0.34, colOp: 0.3, outline: 0.5, rowW: 1.1, colW: 1, hot: [{ row: 0.02, w: 2.2 }, { row: 1, w: 2.6 }] },
    }),
  )

  // UI: bracket corners, swatches, chevrons
  const uiY = SY1 - 36
  const sx = (k) => SCX + (k - 2) * 40
  const cols = ['#222226', '#7A1B38', '#1F5A43', '#E6D6B4', '#B28E63']
  items.push({
    clean: () => {
      const b = 22
      const x0 = SX0 + 16
      const x1 = SX1 - 16
      const y0 = SY0 + 16
      const y1 = SY1 - 70
      const br = `<path d="M${x0} ${y0 + b}V${y0}H${x0 + b}M${x1 - b} ${y0}H${x1}V${y0 + b}M${x1} ${y1 - b}V${y1}H${x1 - b}M${x0 + b} ${y1}H${x0}V${y1 - b}" fill="none" stroke="#0D0D0C" stroke-opacity="0.7" stroke-width="2.2" stroke-linecap="square"/>`
      const sws = cols.map((c, k) => `<circle cx="${sx(k)}" cy="${uiY}" r="11" fill="${c}" stroke="#fff" stroke-opacity="0.8" stroke-width="1.6"/>`).join('')
      const sel = `<circle cx="${sx(1)}" cy="${uiY}" r="17" fill="none" stroke="#0D0D0C" stroke-width="2"/>`
      const chev = `<path d="M${SX0 + 12} ${SCX - 20 + 160}l-9 12l9 12M${SX1 - 12} ${SCX - 20 + 160}l9 12l-9 12" fill="none" stroke="#0D0D0C" stroke-opacity="0.6" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 0)"/>`
      void chev
      return br + sws + sel
    },
    ai: () => {
      const b = 22
      const x0 = SX0 + 16
      const x1 = SX1 - 16
      const y0 = SY0 + 16
      const y1 = SY1 - 70
      const br = `<path d="M${x0} ${y0 + b}V${y0}H${x0 + b}M${x1 - b} ${y0}H${x1}V${y0 + b}M${x1} ${y1 - b}V${y1}H${x1 - b}M${x0 + b} ${y1}H${x0}V${y1 - b}" fill="none" stroke="${LUMEN}" stroke-opacity="0.9" stroke-width="2.2" stroke-linecap="square"/>`
      const sws = cols.map((c, k) => `<circle cx="${sx(k)}" cy="${uiY}" r="11" fill="none" stroke="${LUMEN}" stroke-opacity="${k === 1 ? 1 : 0.55}" stroke-width="1.8"/>`).join('')
      const sel = `<circle cx="${sx(1)}" cy="${uiY}" r="17" fill="none" stroke="${LUMEN}" stroke-width="2"/><circle cx="${sx(1)}" cy="${uiY}" r="6" fill="${LUMEN}"/>`
      return br + sws + sel
    },
  })

  // glare (clean) + scan sweep (ai)
  items.push({
    clean: (ctx) => {
      const cid = ctx.uid('gl')
      ctx.def(`<clipPath id="${cid}"><rect x="${SX0}" y="${SY0}" width="${sw}" height="${sh}" rx="10"/></clipPath>`)
      return `<g clip-path="url(#${cid})"><path d="M${SX0 + 30} ${SY1}L${SX0 + 170} ${SY0}L${SX0 + 224} ${SY0}L${SX0 + 84} ${SY1}Z" fill="#fff" opacity="0.28"/><path d="M${SX0 + 120} ${SY1}L${SX0 + 260} ${SY0}L${SX0 + 276} ${SY0}L${SX0 + 136} ${SY1}Z" fill="#fff" opacity="0.18"/></g>`
    },
    ai: () => '',
  })

  // ---------- HUD -----------------------------------------------------------------------------------------
  const hudItems = []
  const bj = m.body.jOf(m.Y(240))
  hudItems.push(hud.measure(m.body.P(1, bj), m.body.P(0, bj), { len: 40 }))
  hudItems.push(hud.measure(gown.P(1, gown.jOf(m.Y(385))), gown.P(0, gown.jOf(m.Y(385))), { len: 46 }))
  hudItems.push(hud.measure(gown.P(1, 1), gown.P(0, 1), { len: 34 }))
  hudItems.push(hud.vdim(KX0 - 70, KY0, KY1 + 66))
  hudItems.push(hud.hdim(KY1 + 112, KX0, KX1))
  hudItems.push(hud.bracket(KX0 - 20, KY0 - 20, KX1 - KX0 + 40, KY1 - KY0 + 40, 26))
  hudItems.push(hud.cross(gown.P(0.4, 0.4)))
  hudItems.push(hud.cross(gown.P(0.7, 0.75)))
  hudItems.push(hud.cross([SCX + 120, KY0 + 22]))
  hudItems.push(hud.cross([SCX, FY]))

  return S.renderScene(mode, {
    backdrop: { clean: (ctx) => '', ai: (ctx) => S.aiBackdrop(ctx, { seed: 29, glow: { x: 600, y: 440 }, floor: null, marks: 26 }) },
    items,
    hud: hudItems,
    scan: { y: 300, h: 220 },
  })
}
