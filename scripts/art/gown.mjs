// Kannaadi.Ai signature artwork: a satin gown on a linen dress form, rendered from one shared
// geometry so every variant (clean / AI scan / colourway) lines up to the pixel.
//
//   mode 'clean'      transparent studio still with soft ground shadow
//   mode 'ai-plate'   opaque dark plate: scan grid, floor rings, HUD marks + the scanned garment
//   mode 'ai-cutout'  the scanned garment alone on transparent
import * as E from './engine.mjs'

const { smooth, pchip } = E
const LUMEN = E.PALETTE.lumen

/** Garment geometry lives in a 1600x2000 space; scenes place it with translate+scale. */
export const GEO = { hemY: 1780, top: 150 }

export const cxFn = (y) => 800 + 14 * Math.sin((y - 150) / 380) + 55 * Math.pow(smooth(900, 1780, y), 1.6)

export const COLORWAYS = {
  ink: { shadow: '#050507', mid: '#3a3a44', specCol: '#f0e8d6', rimCol: '#cdbf9d' },
  champagne: { shadow: '#6f6250', mid: '#eadfc8', specCol: '#ffffff', rimCol: '#fff3d6' },
  forest: { shadow: '#04100b', mid: '#1f5a43', specCol: '#e8f4e2', rimCol: '#9fd0b2' },
  claret: { shadow: '#13040a', mid: '#6a1730', specCol: '#ffe3e6', rimCol: '#d99aa6' },
}

function satinFor(name) {
  const c = COLORWAYS[name] || COLORWAYS.ink
  return {
    ...E.MATERIALS.satin,
    shadow: E.hex(c.shadow),
    mid: E.hex(c.mid),
    specCol: E.hex(c.specCol),
    rimCol: E.hex(c.rimCol),
  }
}

function buildForm() {
  const A = pchip([
    [150, 0], [156, 26], [170, 40], [190, 44], [215, 46], [245, 54], [262, 78], [285, 134],
    [308, 200], [330, 238], [352, 248], [385, 240], [440, 216], [520, 192], [660, 178],
  ])
  const B = pchip([
    [150, 0], [156, 24], [170, 34], [190, 38], [215, 40], [245, 46], [262, 62], [285, 88],
    [308, 106], [330, 114], [352, 118], [385, 116], [440, 114], [520, 118], [660, 114],
  ])
  return E.makeSOR({ y0: 150, y1: 592, A, B, cx: cxFn, tilt: 0.2, rows: 56, cols: 96 })
}

const gownA = pchip([
  [516, 196], [560, 192], [620, 180], [720, 152], [800, 140], [870, 168], [940, 198],
  [1060, 248], [1250, 352], [1500, 490], [1780, 620],
])
const gownB = pchip([
  [516, 124], [620, 114], [720, 98], [800, 92], [870, 108], [940, 128],
  [1060, 160], [1250, 230], [1500, 332], [1780, 430],
])
const PLEAT_N = 18
const pleatTw = (y) => 1.5 * smooth(780, 1780, y)

function buildGown() {
  return E.makeSOR({
    y0: 516,
    y1: 1780,
    A: gownA,
    B: gownB,
    cx: cxFn,
    tilt: 0.2,
    rows: 112,
    cols: 168,
    pleats: { n: PLEAT_N, amp: (y) => 0.068 * smooth(830, 1700, y), tw: pleatTw },
    yShift: (y, th) => {
      const edge = 0.3 + 0.7 * Math.sin(th)
      const hem = 34 * Math.pow(smooth(1300, 1780, y), 2) * Math.sin(PLEAT_N * th + pleatTw(1780) + 0.9) * edge
      const lift = -30 * smooth(1100, 1780, y) * Math.cos(th)
      const dip = 78 * Math.exp(-Math.pow((th - Math.PI / 2) / 0.46, 2)) * (1 - smooth(516, 700, y))
      return hem + lift + dip
    },
  })
}

function buildBand() {
  return E.makeSOR({
    y0: 792,
    y1: 818,
    A: (y) => gownA(y) * 1.035 + 1.5,
    B: (y) => gownB(y) * 1.035 + 1.5,
    cx: cxFn,
    tilt: 0.2,
    rows: 4,
    cols: 96,
  })
}

const luma = (c) => (c[0] * 0.3 + c[1] * 0.59 + c[2] * 0.11) / 255
const clamp01 = (v) => Math.min(1, Math.max(0, v))

function line(pts, stroke, w, op) {
  return `<path d="${E.path(pts)}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-opacity="${op}" stroke-linecap="round" stroke-linejoin="round"/>`
}

function cleanBody(form, gown, band, colorway, shadow = true) {
  const cxH = cxFn(GEO.hemY)
  const hemY = GEO.hemY
  const sh = shadow
    ? `<ellipse cx="${cxH + 10}" cy="${hemY + 70}" rx="690" ry="150" fill="#0d0d0c" opacity="0.30" filter="url(#b60)"/>` +
      `<ellipse cx="${cxH + 6}" cy="${hemY + 52}" rx="600" ry="92" fill="#0d0d0c" opacity="0.42" filter="url(#b30)"/>` +
      `<ellipse cx="${cxH}" cy="${hemY + 36}" rx="560" ry="56" fill="#0d0d0c" opacity="0.38" filter="url(#b10)"/>`
    : ''
  return (
    sh +
    E.emitQuads(form.quads(), E.MATERIALS.form) +
    E.emitQuads(gown.quads(), satinFor(colorway)) +
    E.emitQuads(band.quads(), E.MATERIALS.metal)
  )
}

function aiBody(form, gown, band) {
  const parts = []
  const sil = gown.silhouette(110)
  const formSil = form.silhouette(80)
  const gownSilPath = E.path(sil, true)

  const formCol = (c) => E.mix(E.hex('#101114'), E.hex('#66707a'), Math.pow(luma(c), 1.15))
  const gownCol = (c) => E.mix(E.hex('#060708'), E.hex('#1f2429'), Math.pow(luma(c) * 1.6, 1.1))
  parts.push(E.emitQuads(form.quads(), E.MATERIALS.form, { colour: formCol }))
  parts.push(E.emitQuads(gown.quads(), E.MATERIALS.satin, { colour: gownCol }))
  parts.push(`<g clip-path="url(#silClip)"><rect x="0" y="1010" width="1600" height="330" fill="url(#scan)"/></g>`)

  const wire = []
  const glow = []
  for (let y = 160; y <= 585; y += 22) wire.push(line(form.ring(y, 70), LUMEN, 1.6, 0.28))
  for (let k = 0; k <= 12; k++) wire.push(line(form.meridian((Math.PI * k) / 12, 60), LUMEN, 1.4, 0.22))
  for (let y = 520; y <= 1780; y += 18) {
    const hot = Math.abs(y - 806) < 4 || Math.abs(y - 1270) < 10
    wire.push(line(gown.ring(y, 160), LUMEN, hot ? 2.8 : 1.7, hot ? 0.95 : 0.46))
    if (hot) glow.push(line(gown.ring(y, 160), LUMEN, 9, 0.5))
  }
  for (let k = 0; k <= 36; k++) wire.push(line(gown.meridian((Math.PI * k) / 36, 120), LUMEN, 1.5, 0.34))
  wire.push(line(gown.ring(1780, 160), LUMEN, 3.2, 0.9))
  glow.push(line(gown.ring(1780, 160), LUMEN, 12, 0.4))
  glow.push(line(gown.silhouette(110), LUMEN, 7, 0.22))
  parts.push(`<g filter="url(#b8)">${glow.join('')}</g>`)
  parts.push(wire.join(''))
  parts.push(
    E.emitQuads(band.quads(), E.MATERIALS.metal, {
      colour: (c) => E.mix(E.hex('#2a3010'), E.hex('#e9ff9a'), clamp01(luma(c) * 1.1)),
    }),
  )

  // HUD: measurement rails with nodes
  const hud = []
  for (const y of [330, 560, 806, 940, 1270]) {
    const onGown = y >= 520
    const lp = onGown ? gown.P(y, Math.PI) : form.P(y, Math.PI)
    const rp = onGown ? gown.P(y, 0) : form.P(y, 0)
    hud.push(`<line x1="${lp[0] - 14}" y1="${lp[1]}" x2="${lp[0] - 74}" y2="${lp[1]}" stroke="${LUMEN}" stroke-width="2" stroke-opacity="0.8" stroke-dasharray="3 7"/>`)
    hud.push(`<line x1="${rp[0] + 14}" y1="${rp[1]}" x2="${rp[0] + 74}" y2="${rp[1]}" stroke="${LUMEN}" stroke-width="2" stroke-opacity="0.8" stroke-dasharray="3 7"/>`)
    hud.push(`<rect x="${lp[0] - 82}" y="${lp[1] - 6}" width="12" height="12" fill="none" stroke="${LUMEN}" stroke-width="2"/>`)
    hud.push(`<rect x="${rp[0] + 70}" y="${rp[1] - 6}" width="12" height="12" fill="none" stroke="${LUMEN}" stroke-width="2"/>`)
    hud.push(`<circle cx="${lp[0]}" cy="${lp[1]}" r="7" fill="${LUMEN}"/><circle cx="${rp[0]}" cy="${rp[1]}" r="7" fill="${LUMEN}"/>`)
  }
  for (const [y, k] of [[640, 8], [880, 24], [1040, 14], [1130, 28], [1380, 10], [1500, 31], [1640, 20]]) {
    const p = gown.P(y, (Math.PI * k) / 36)
    hud.push(`<g stroke="${LUMEN}" stroke-width="2.4" stroke-linecap="round"><line x1="${p[0] - 13}" y1="${p[1]}" x2="${p[0] + 13}" y2="${p[1]}"/><line x1="${p[0]}" y1="${p[1] - 13}" x2="${p[0]}" y2="${p[1] + 13}"/></g>`)
    hud.push(`<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="${LUMEN}"/>`)
  }
  parts.push(`<g filter="url(#b4)" opacity="0.7">${hud.join('')}</g>`)
  parts.push(hud.join(''))

  return { svg: parts.join(''), gownSilPath, formSilPath: E.path(formSil, true) }
}

/** The dark plate drawn in final pixel space (not garment space). */
function plateBackdrop(W, H, gx, gy, gr) {
  const r = E.rng(7)
  const out = []
  out.push(`<rect width="${W}" height="${H}" fill="#0a0b0c"/>`)
  out.push(`<rect width="${W}" height="${H}" fill="url(#plateGlow)"/>`)
  // fine grid with stronger majors, fading toward the frame edges
  const g = []
  const step = Math.round(H / 21.7)
  for (let x = 0; x <= W; x += step) g.push(`<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${LUMEN}" stroke-opacity="${x % (step * 5) === 0 ? 0.11 : 0.045}" stroke-width="${x % (step * 5) === 0 ? 1.6 : 1}"/>`)
  for (let y = 0; y <= H; y += step) g.push(`<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${LUMEN}" stroke-opacity="${y % (step * 5) === 0 ? 0.11 : 0.045}" stroke-width="${y % (step * 5) === 0 ? 1.6 : 1}"/>`)
  out.push(`<g mask="url(#gridFade)">${g.join('')}</g>`)
  // scan-floor rings under the hem
  const rings = []
  for (let i = 0; i < 6; i++) {
    const k = 1 + i * 0.28
    rings.push(`<ellipse cx="${gx}" cy="${gy}" rx="${gr * k}" ry="${gr * k * 0.17}" fill="none" stroke="${LUMEN}" stroke-opacity="${(0.34 - i * 0.05).toFixed(3)}" stroke-width="${i === 0 ? 2.4 : 1.4}"${i % 2 ? ' stroke-dasharray="2 10"' : ''}/>`)
  }
  out.push(rings.join(''))
  // scattered crosshair nodes and dotted arcs across the whole frame (so the plate reads anywhere)
  const marks = []
  for (let i = 0; i < 46; i++) {
    const x = r() * W
    const y = r() * H
    const s = 7 + r() * 7
    const o = 0.14 + r() * 0.3
    marks.push(`<g stroke="${LUMEN}" stroke-opacity="${o.toFixed(2)}" stroke-width="1.6" stroke-linecap="round"><line x1="${x - s}" y1="${y}" x2="${x + s}" y2="${y}"/><line x1="${x}" y1="${y - s}" x2="${x}" y2="${y + s}"/></g>`)
  }
  for (let i = 0; i < 5; i++) {
    const cx = r() * W * 0.55
    const cy = H * (0.2 + r() * 0.6)
    const rad = 70 + r() * 120
    marks.push(`<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${LUMEN}" stroke-opacity="0.14" stroke-width="1.4" stroke-dasharray="2 9"/>`)
  }
  out.push(marks.join(''))
  // horizontal scan streaks
  for (let i = 0; i < 9; i++) {
    const y = H * (0.08 + i * 0.105)
    out.push(`<rect x="0" y="${y.toFixed(0)}" width="${W}" height="1.4" fill="${LUMEN}" opacity="${(0.035 + (i % 3) * 0.02).toFixed(3)}"/>`)
  }
  return out.join('')
}

/**
 * @param {{mode:'clean'|'ai-plate'|'ai-cutout', width:number, height:number, scale:number, tx:number, ty:number, colorway?:string, shadow?:boolean}} o
 */
export function gownScene(o) {
  const { mode, width: W, height: H, scale: s, tx, ty, colorway = 'ink', shadow = true } = o
  const form = buildForm()
  const gown = buildGown()
  const band = buildBand()

  let defs = E.blur('b30', 30) + E.blur('b10', 10) + E.blur('b60', 60)
  let body = ''
  let backdrop = ''

  if (mode === 'clean') {
    body = cleanBody(form, gown, band, colorway, shadow)
  } else {
    const ai = aiBody(form, gown, band)
    defs +=
      E.blur('b4', 4) + E.blur('b8', 8) +
      `<linearGradient id="scan" x1="0" y1="0" x2="0" y2="1">
         <stop offset="0" stop-color="${LUMEN}" stop-opacity="0"/>
         <stop offset="0.5" stop-color="${LUMEN}" stop-opacity="0.34"/>
         <stop offset="1" stop-color="${LUMEN}" stop-opacity="0"/>
       </linearGradient>` +
      `<clipPath id="silClip"><path d="${ai.gownSilPath}"/><path d="${ai.formSilPath}"/></clipPath>`
    body = ai.svg
    if (mode === 'ai-plate') {
      const gx = tx + cxFn(GEO.hemY) * s
      const gy = ty + (GEO.hemY + 36) * s
      defs +=
        `<radialGradient id="plateGlow" gradientUnits="userSpaceOnUse" cx="${tx + 800 * s}" cy="${ty + 1000 * s}" r="${H * 0.95}">
           <stop offset="0" stop-color="#232a1a" stop-opacity="0.95"/>
           <stop offset="0.55" stop-color="#121410" stop-opacity="0.6"/>
           <stop offset="1" stop-color="#0a0b0c" stop-opacity="0"/>
         </radialGradient>` +
        `<radialGradient id="gridG" gradientUnits="userSpaceOnUse" cx="${tx + 800 * s}" cy="${H * 0.52}" r="${W * 0.62}">
           <stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0.18"/>
         </radialGradient>` +
        `<mask id="gridFade"><rect width="${W}" height="${H}" fill="url(#gridG)"/></mask>`
      backdrop = plateBackdrop(W, H, gx, gy, 560 * s)
    }
  }

  return (
    E.svgOpen(W, H, defs) +
    backdrop +
    `<g transform="translate(${tx} ${ty}) scale(${s})">${body}</g>` +
    E.svgClose
  )
}
