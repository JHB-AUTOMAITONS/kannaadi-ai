// Hanging garments (blazer, coat, dress, shirt) shared by the fashion + boutique scenes.
// Each garment is a stack of shaded cloth meshes (back lining, sleeves, front panel) plus a few flat
// details, returned as scene items in draw order. Geometry is deterministic per `seed`.
import * as S from './_shared.mjs'

const { E, pchip, smooth, range, rng, LUMEN, hex, mix } = S

const SPECS = {
  blazer: { w: 62, neck: 13, slope: 16, len: 330, waist: 55, hem: 62, sleeve: 292, s0: 19, s1: 13, vDepth: 118, vHalf: 0.3, lapel: true, buttons: 2, cuff: 0.07 },
  coat: { w: 66, neck: 14, slope: 17, len: 470, waist: 58, hem: 84, sleeve: 330, s0: 21, s1: 15, vDepth: 150, vHalf: 0.3, lapel: true, buttons: 3, belt: 0.4, cuff: 0.06 },
  dress: { w: 50, neck: 24, slope: 8, len: 410, waist: 42, hem: 86, sleeve: 0, s0: 0, s1: 0, vDepth: 60, vHalf: 0.62, straps: true, belt: 0.34 },
  shirt: { w: 60, neck: 15, slope: 14, len: 300, waist: 56, hem: 60, sleeve: 270, s0: 17, s1: 11, vDepth: 44, vHalf: 0.22, collar: true, buttons: 5, cuff: 0.08 },
}

const darken = (hexStr, k) => {
  const c = hex(hexStr)
  return E.toHex([c[0] * k, c[1] * k, c[2] * k])
}
const lighten = (hexStr, k) => E.toHex(mix(hex(hexStr), [255, 255, 255], k))

/**
 * @param {{type:'blazer'|'coat'|'dress'|'shirt', cx:number, y0:number, seed?:number, colour:string, lining?:string, scale?:number, tilt?:number, sheen?:number, railY?:number}} o
 */
export function garment(o) {
  const { type, cx, y0, seed = 1, colour, tilt = 0.2, scale = 1, sheen = 0.3, railY = y0 - 36 } = o
  const sp0 = SPECS[type]
  const sp = {}
  for (const k of Object.keys(sp0)) sp[k] = typeof sp0[k] === 'number' && !['buttons', 'cuff', 'vHalf', 'belt'].includes(k) ? sp0[k] * scale : sp0[k]
  const R = rng(seed * 977 + 13)
  const phases = [R() * 6.28, R() * 6.28, R() * 6.28]
  const ks = [2.1 + R() * 0.6, 3.5 + R() * 0.8, 5.4 + R() * 1.2]
  const lining = o.lining || darken(colour, 0.55)

  // shared profile of the garment half-width down the body
  const widthAt = pchip([
    [0, sp.w * 0.98],
    [0.1, sp.w * 0.9],
    [0.38, sp.waist],
    [0.7, (sp.waist + sp.hem) / 2 + 2],
    [1, sp.hem],
  ])
  const topAt = (s) => y0 + 22 + sp.slope * Math.pow(Math.abs(s), 1.05)
  const hemAt = (s) => y0 + 22 + sp.len + 6 * s * s - 2

  const panel = (side, zBase, vDip, ampK, rows = 34, cols = 20) =>
    S.makeMesh(
      (i, j) => {
        // side: 0 = whole, -1 = left half, 1 = right half (front opening)
        let s = 2 * i - 1
        if (side === -1) s = -1 + i * 1.0 // -1..0
        if (side === 1) s = i // 0..1
        const top = topAt(s)
        // neckline: V (blazer/coat/shirt) or scoop (dress)
        let dip = 0
        const a = Math.abs(s)
        if (vDip > 0) {
          if (sp.straps) dip = vDip * Math.pow(Math.max(0, 1 - Math.pow(a / sp.vHalf, 2)), 1.0)
          else dip = vDip * Math.max(0, 1 - a / sp.vHalf)
        }
        const yT = top + dip
        const yB = hemAt(s)
        const y = yT + (yB - yT) * j
        const w = widthAt(Math.min(1, Math.max(0, (y - y0 - 22) / sp.len)))
        let f = 0
        for (let k = 0; k < 3; k++) f += (k === 0 ? 1 : 0.55 / k) * Math.sin(ks[k] * Math.PI * s + phases[k])
        const jj = (y - y0 - 22) / sp.len
        const fold = ampK * (0.5 + 8 * smooth(0.08, 0.95, jj)) * f * 0.5
        const z = zBase + 9 * Math.pow(Math.max(0, 1 - a * a), 0.6) * (1 - 0.4 * jj) + fold - 5 * a * a
        const x = cx + s * w + 1.6 * f * smooth(0.2, 1, jj)
        return [x, y, z]
      },
      { rows, cols, tilt },
    )

  const items = []
  const clothMat = S.fabric(colour, { depth: 0.2, lift: 1.12, spec: sheen, gloss: 14, rim: 0.28, fill: 0.22, specTint: 0.55, rimTint: 0.4 })
  const liningMat = S.fabric(lining, { depth: 0.25, lift: 1.0, spec: 0.1, gloss: 8, rim: 0.12, fill: 0.2 })
  const aiWires = (rows, cols, op = 1) => ({ tone: 'dark', rows: range(0, 1, rows), cols: range(0, 1, cols), rowOp: 0.22 * op, colOp: 0.3 * op, rowW: 1.1, colW: 1.1, outline: 0.55 * op, glow: true })

  // --- back lining (whole width, shallow neckline)
  const back = panel(0, -14, sp.vDepth * 0.25, 0.3, 14, 10)
  items.push(S.solid(back, { mat: liningMat, ai: { ...aiWires(14, 10, 0.7), tone: 'deep' }, seam: 1.3 }))

  // --- sleeves
  const sleeves = []
  if (sp.sleeve > 0) {
    for (const sg of [-1, 1]) {
      const xs = cx + sg * (sp.w * 0.98)
      const ys = y0 + 22 + sp.slope
      const out = sg * (sp.sleeve * 0.07)
      const C = (t) => [xs + out * t + sg * 7 * Math.sin(Math.PI * t) + sg * 4, ys + sp.sleeve * t, -10 + 4 * Math.sin(t * 7 + sg)]
      const sleeve = S.makeMesh(
        (i, t) => {
          const c = C(t)
          const hw = sp.s0 + (sp.s1 - sp.s0) * smooth(0, 1, t) + 1.5 * Math.sin(t * 9 + sg * 2)
          const f = Math.sin(i * 8 + t * 5 + sg) * 3.5 * smooth(0.1, 0.8, t)
          return [c[0] + (i - 0.5) * 2 * hw * 0.9, c[1], c[2] + f + 8 * Math.pow(Math.sin(Math.PI * i), 0.6)]
        },
        { rows: 46, cols: 10, tilt },
      )
      sleeves.push(sleeve)
      const cuffC = (c, q) => (q.v > 1 - sp.cuff ? [c[0] * 0.8, c[1] * 0.8, c[2] * 0.8] : c)
      items.push(
        S.solid(sleeve, {
          mat: clothMat,
          colour: sp.cuff ? cuffC : undefined,
          ai: aiWires(10, 4),
          seam: 1.3,
        }),
      )
    }
  }

  // --- hanger arms + hook (chrome)
  const hang = []
  for (const sg of [-1, 1]) {
    const arm = S.tubeMesh((t) => [cx + sg * t * (sp.w + 4), y0 + 22 - 10 + sp.slope * 0.9 * t + 4 * (1 - t), -4], 2.1, { rows: 14, cols: 6, tilt })
    hang.push(arm)
  }
  const hookC = (t) => {
    const yA = y0 + 12
    const yB = railY - 3
    if (t < 0.5) return [cx, yA + ((yB - yA) * t) / 0.5, -3]
    const a = Math.PI - ((t - 0.5) / 0.5) * Math.PI * 1.1
    return [cx + 9 + 9 * Math.cos(a), yB - 9 * Math.sin(a), -3]
  }
  const hook = S.tubeMesh(hookC, 1.7, { rows: 30, cols: 6, tilt })
  for (const h of [...hang, hook]) items.push(S.solid(h, { mat: S.CHROME, ai: { tone: 'steel', rows: [], cols: [], outline: 0.7, glow: false }, seam: 1.0, scan: false }))

  // --- inner shirt visible in the opening
  if (sp.lapel || sp.collar) {
    const inner = S.makeMesh(
      (i, j) => {
        const s = 2 * i - 1
        const yT = y0 + 22 + 2
        const yB = y0 + 22 + sp.vDepth + 14
        const w = sp.neck * 2.4 * (1 - 0.65 * j)
        return [cx + s * w, yT + (yB - yT) * j, -4 + 3 * Math.sin(i * 6)]
      },
      { rows: 8, cols: 8, tilt },
    )
    items.push(S.solid(inner, { mat: S.fabric(type === 'coat' ? '#E9E2D2' : '#EFE9DC', { depth: 0.55, lift: 1.0, spec: 0.1, rim: 0.1 }), ai: { ...aiWires(5, 4, 0.6), tone: 'form' }, seam: 1.2, scan: false }))
  }

  // --- front panels (two halves for a V opening, or one for a dress)
  if (sp.lapel || sp.collar) {
    for (const sd of [-1, 1]) {
      const half = panel(sd, 0, sp.vDepth, 1.0, 44, 15)
      items.push(S.solid(half, { mat: clothMat, ai: aiWires(24, 8), seam: 1.3 }))
    }
  } else {
    const front = panel(0, 0, sp.vDepth, 1.0, 44, 28)
    items.push(S.solid(front, { mat: clothMat, ai: aiWires(24, 14), seam: 1.3 }))
  }

  // --- flat details (lapels, collar, straps, belt, buttons)
  const flat = (pts, fill, stroke, aiFillC = '#0c0f11') => ({
    clean: (ctx) => {
      const g = ctx.uid('lp')
      ctx.def(`<linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${lighten(fill, 0.14)}"/><stop offset="1" stop-color="${darken(fill, 0.78)}"/></linearGradient>`)
      return `<path d="${E.path(pts, true)}" fill="url(#${g})" stroke="${stroke}" stroke-opacity="0.7" stroke-width="1.2" stroke-linejoin="round"/>`
    },
    ai: () => `<path d="${E.path(pts, true)}" fill="${aiFillC}" stroke="${LUMEN}" stroke-opacity="0.7" stroke-width="1.5" stroke-linejoin="round"/>`,
    sil: () => E.path(pts, true),
  })
  const yN = y0 + 22
  if (sp.lapel) {
    for (const sg of [-1, 1]) {
      const p = [
        [cx + sg * sp.neck * 0.9, yN - 2],
        [cx + sg * (sp.neck + 22), yN + 8],
        [cx + sg * (sp.neck + 19), yN + 36],
        [cx + sg * (sp.neck * 0.62 + 8), yN + sp.vDepth * 0.8],
        [cx + sg * 3, yN + sp.vDepth + 4],
        [cx + sg * (sp.neck * 0.5), yN + sp.vDepth * 0.5],
      ]
      items.push(flat(p, colour, darken(colour, 0.35)))
    }
  }
  if (sp.collar) {
    for (const sg of [-1, 1]) {
      const p = [
        [cx + sg * 3, yN - 6],
        [cx + sg * (sp.neck + 8), yN - 4],
        [cx + sg * (sp.neck + 14), yN + 16],
        [cx + sg * 4, yN + 24],
      ]
      items.push(flat(p, lighten(colour, 0.1), darken(colour, 0.4)))
    }
  }
  if (sp.straps) {
    for (const sg of [-1, 1]) {
      const strap = S.tubeMesh((t) => [cx + sg * (sp.neck * 0.9 + 8 * t), y0 + 22 - 10 * (1 - t) + 2 * t, -2], 3.4, { rows: 10, cols: 6, tilt })
      items.push(S.solid(strap, { mat: clothMat, ai: { tone: 'dark', rows: [], cols: [], outline: 0.6, glow: false }, seam: 1, scan: false }))
    }
  }
  if (sp.belt) {
    const by = yN + sp.len * sp.belt
    const bw = widthAt(sp.belt)
    const belt = S.makeMesh(
      (i, j) => [cx + (2 * i - 1) * (bw + 1.5), by - 6 + 12 * j + 2 * Math.sin(i * 5), 6 + 6 * Math.pow(Math.sin(Math.PI * i), 0.5)],
      { rows: 3, cols: 16, tilt },
    )
    items.push(S.solid(belt, { mat: S.fabric(darken(colour, 0.7), { depth: 0.3, spec: 0.35, gloss: 20 }), ai: { tone: 'dark', rows: [0, 1], cols: [], rowOp: 0.6, outline: 0.6 }, seam: 1, scan: false }))
  }
  if (sp.buttons) {
    const nb = sp.buttons
    const b = []
    for (let k = 0; k < nb; k++) {
      const by = yN + sp.vDepth + 6 + k * (type === 'shirt' ? 34 : 38 * scale)
      b.push([cx + (type === 'shirt' ? 0 : 5), by])
    }
    items.push({
      clean: () => b.map((p) => `<circle cx="${S.r1(p[0])}" cy="${S.r1(p[1])}" r="3.4" fill="${darken(colour, 0.35)}" stroke="#fff" stroke-opacity="0.35" stroke-width="0.8"/><circle cx="${S.r1(p[0] - 0.9)}" cy="${S.r1(p[1] - 0.9)}" r="1" fill="#fff" fill-opacity="0.5"/>`).join(''),
      ai: () => b.map((p) => `<circle cx="${S.r1(p[0])}" cy="${S.r1(p[1])}" r="3.4" fill="none" stroke="${LUMEN}" stroke-opacity="0.8" stroke-width="1.4"/>`).join(''),
    })
  }

  const bbox = { x0: cx - sp.w - 40, x1: cx + sp.w + 40, y0, y1: y0 + 22 + sp.len }
  const front = items
  return { items, front, sleeves, back, bbox, sp, hookTop: [cx, railY], shadowMesh: back }
}
