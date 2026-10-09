// Derives the "AI layer" (Image 2) from a clean photograph (Image 1).
//
// Image 2 is computed from Image 1's own pixels, so it is the same person, pose, clothing and crop by
// construction — perfectly aligned for the hero reveal. No segmentation model is needed:
//   1. tone: the photo is re-graded into a dark graphite duotone (the layer "underneath" the fashion image)
//   2. skin: a YCbCr skin estimate keeps faces/hands closer to natural and keeps technology lines OFF them,
//      so the AI layer never turns a face into a robot
//   3. backdrop: when the frame edge is a plain studio backdrop it is flood-filled and replaced by a dark
//      plate; busy backgrounds are simply graded
//   4. structure: gradient edges of the fabric/jewellery become fine lumen contour lines with a soft glow
//   5. overlay: faint grid, scan lines, a scan band, and optional HUD marks (face brackets, measurement
//      rails, nodes) placed from the slot manifest in normalised (0–1) coordinates
import sharp from 'sharp'

const LUMEN = [213, 255, 79]
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const mix = (a, b, t) => a + (b - a) * t

/** Separable box-blur approximation of a gaussian on a Float32 single channel (3 passes). */
function blurChannel(src, w, h, radius) {
  if (radius < 1) return src
  let a = Float32Array.from(src)
  let b = new Float32Array(src.length)
  const r = Math.round(radius)
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < h; y++) {
      let acc = 0
      const row = y * w
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))]
      for (let x = 0; x < w; x++) {
        b[row + x] = acc / (2 * r + 1)
        acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)]
      }
    }
    for (let x = 0; x < w; x++) {
      let acc = 0
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x]
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1)
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x]
      }
    }
  }
  return a
}

function percentile(arr, p) {
  const sample = []
  const step = Math.max(1, Math.floor(arr.length / 60000))
  for (let i = 0; i < arr.length; i += step) sample.push(arr[i])
  sample.sort((x, y) => x - y)
  return sample[Math.min(sample.length - 1, Math.floor(sample.length * p))]
}

/**
 * Backdrop mask by flood fill from the frame edge, only when the edge is a plain, uniform backdrop.
 * Works on a downscaled copy; returns a full-size blurred mask in 0–1, or null for busy frames.
 */
function backdropMask(rgb, w, h) {
  const s = Math.max(1, Math.round(Math.max(w, h) / 480))
  const sw = Math.floor(w / s)
  const sh = Math.floor(h / s)
  const px = (x, y) => {
    const i = (y * s * w + x * s) * 3
    return [rgb[i], rgb[i + 1], rgb[i + 2]]
  }
  // edge statistics (top, left, right — the bottom edge usually contains the floor / subject)
  const edge = []
  for (let x = 0; x < sw; x++) edge.push(px(x, 0))
  for (let y = 0; y < sh * 0.8; y++) edge.push(px(0, y), px(sw - 1, y))
  const mean = [0, 1, 2].map((c) => edge.reduce((a, p) => a + p[c], 0) / edge.length)
  const sd = Math.sqrt(edge.reduce((a, p) => a + (p[0] - mean[0]) ** 2 + (p[1] - mean[1]) ** 2 + (p[2] - mean[2]) ** 2, 0) / edge.length)
  if (sd > 26) return null // busy background: grade it instead of replacing it

  const tol = Math.max(22, sd * 2.6)
  const seen = new Uint8Array(sw * sh)
  const q = []
  const push = (x, y) => {
    const k = y * sw + x
    if (seen[k]) return
    const p = px(x, y)
    const d = Math.hypot(p[0] - mean[0], p[1] - mean[1], p[2] - mean[2])
    // gradient backdrops drift in brightness: compare against a slowly-updated local reference too
    if (d > tol * 1.9) return
    seen[k] = 1
    q.push(k)
  }
  for (let x = 0; x < sw; x++) push(x, 0)
  for (let y = 0; y < sh; y++) {
    push(0, y)
    push(sw - 1, y)
  }
  while (q.length) {
    const k = q.pop()
    const x = k % sw
    const y = (k / sw) | 0
    const p = px(x, y)
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (nx < 0 || ny < 0 || nx >= sw || ny >= sh || seen[ny * sw + nx]) continue
      const n = px(nx, ny)
      // continue only through low local contrast (stops at the subject's silhouette)
      if (Math.hypot(n[0] - p[0], n[1] - p[1], n[2] - p[2]) > 18) continue
      push(nx, ny)
    }
  }
  const small = new Float32Array(sw * sh)
  for (let i = 0; i < small.length; i++) small[i] = seen[i]
  const soft = blurChannel(small, sw, sh, 2)
  const out = new Float32Array(w * h)
  for (let y = 0; y < h; y++) {
    const sy = Math.min(sh - 1, Math.floor(y / s))
    for (let x = 0; x < w; x++) out[y * w + x] = soft[sy * sw + Math.min(sw - 1, Math.floor(x / s))]
  }
  return blurChannel(out, w, h, s * 1.5)
}

const f = (n) => (Math.round(n * 10) / 10).toString()

/** SVG overlay: grid, scan lines, scan band, HUD. Coordinates in output pixels. */
function overlaySvg(w, h, opts) {
  const { face, rails = [], nodes = [], band = 0.55 } = opts
  const L = 'rgb(213,255,79)'
  const step = Math.round(Math.min(w, h) / 22)
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">`]
  parts.push(`<defs>
    <radialGradient id="g" cx="50%" cy="50%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0.15"/></radialGradient>
    <mask id="m"><rect width="${w}" height="${h}" fill="url(#g)"/></mask>
    <linearGradient id="band" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${L}" stop-opacity="0"/><stop offset="0.5" stop-color="${L}" stop-opacity="0.16"/><stop offset="1" stop-color="${L}" stop-opacity="0"/></linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="${f(Math.max(2, w / 600))}"/></filter>
  </defs>`)
  const grid = []
  for (let x = 0; x <= w; x += step) grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${h}" stroke="${L}" stroke-opacity="${x % (step * 5) === 0 ? 0.08 : 0.035}" stroke-width="1"/>`)
  for (let y = 0; y <= h; y += step) grid.push(`<line x1="0" y1="${y}" x2="${w}" y2="${y}" stroke="${L}" stroke-opacity="${y % (step * 5) === 0 ? 0.08 : 0.035}" stroke-width="1"/>`)
  parts.push(`<g mask="url(#m)">${grid.join('')}</g>`)
  // fine scan lines
  const sl = []
  for (let y = 0; y < h; y += 4) sl.push(`<rect x="0" y="${y}" width="${w}" height="1" fill="#000" opacity="0.16"/>`)
  parts.push(sl.join(''))
  // scan band
  const bh = h * 0.18
  parts.push(`<rect x="0" y="${f(h * band - bh / 2)}" width="${w}" height="${f(bh)}" fill="url(#band)"/>`)
  parts.push(`<rect x="0" y="${f(h * band)}" width="${w}" height="${f(Math.max(1, h / 700))}" fill="${L}" opacity="0.55"/>`)

  const hud = []
  const sw = Math.max(1.5, w / 900)
  // face: four corner brackets around the face box + a tiny label bar. Never crosses the eyes.
  if (face) {
    const x0 = face.x * w
    const y0 = face.y * h
    const x1 = (face.x + face.w) * w
    const y1 = (face.y + face.h) * h
    const c = Math.min(x1 - x0, y1 - y0) * 0.2
    for (const [x, y, dx, dy] of [[x0, y0, 1, 1], [x1, y0, -1, 1], [x0, y1, 1, -1], [x1, y1, -1, -1]]) {
      hud.push(`<path d="M${f(x)} ${f(y + dy * c)}V${f(y)}H${f(x + dx * c)}" fill="none" stroke="${L}" stroke-width="${f(sw * 1.4)}" stroke-linecap="round"/>`)
    }
    hud.push(`<rect x="${f(x0)}" y="${f(y1 + sw * 6)}" width="${f((x1 - x0) * 0.55)}" height="${f(sw * 2.2)}" rx="${f(sw)}" fill="${L}" opacity="0.8"/>`)
    hud.push(`<rect x="${f(x0)}" y="${f(y1 + sw * 11)}" width="${f((x1 - x0) * 0.32)}" height="${f(sw * 2.2)}" rx="${f(sw)}" fill="${L}" opacity="0.4"/>`)
  }
  // measurement rails: dashed line across the garment with square end caps and dots
  for (const r of rails) {
    const y = r.y * h
    const xa = r.x0 * w
    const xb = r.x1 * w
    hud.push(`<line x1="${f(xa)}" y1="${f(y)}" x2="${f(xb)}" y2="${f(y)}" stroke="${L}" stroke-width="${f(sw)}" stroke-opacity="0.75" stroke-dasharray="${f(sw * 2)} ${f(sw * 5)}"/>`)
    const k = sw * 5
    hud.push(`<rect x="${f(xa - k / 2)}" y="${f(y - k / 2)}" width="${f(k)}" height="${f(k)}" fill="none" stroke="${L}" stroke-width="${f(sw)}"/>`)
    hud.push(`<rect x="${f(xb - k / 2)}" y="${f(y - k / 2)}" width="${f(k)}" height="${f(k)}" fill="none" stroke="${L}" stroke-width="${f(sw)}"/>`)
  }
  for (const n of nodes) {
    const x = n.x * w
    const y = n.y * h
    const k = sw * 6
    hud.push(`<g stroke="${L}" stroke-width="${f(sw * 1.3)}" stroke-linecap="round"><line x1="${f(x - k)}" y1="${f(y)}" x2="${f(x + k)}" y2="${f(y)}"/><line x1="${f(x)}" y1="${f(y - k)}" x2="${f(x)}" y2="${f(y + k)}"/></g><circle cx="${f(x)}" cy="${f(y)}" r="${f(sw * 2)}" fill="${L}"/>`)
  }
  if (hud.length) {
    parts.push(`<g filter="url(#glow)" opacity="0.6">${hud.join('')}</g>`)
    parts.push(hud.join(''))
  }
  parts.push('</svg>')
  return Buffer.from(parts.join(''))
}

/**
 * @param {Buffer} cleanPng  the clean image, ALREADY cropped/resized to the final output size
 * @param {{ face?: {x:number,y:number,w:number,h:number}, subject?: {x:number,y:number,w:number,h:number}, rails?: {y:number,x0:number,x1:number}[],
 *           nodes?: {x:number,y:number}[], band?: number, lineStrength?: number }} [opts]
 * @returns {Promise<Buffer>} PNG of the AI layer, same size as the input
 */
export async function aiLayer(cleanPng, opts = {}) {
  const img = sharp(cleanPng).removeAlpha()
  const { width: w, height: h } = await img.metadata()
  const rgb = await img.raw().toBuffer()
  const N = w * h

  // luminance + skin estimate
  const L = new Float32Array(N)
  const skin = new Float32Array(N)
  for (let i = 0, j = 0; i < N; i++, j += 3) {
    const r = rgb[j]
    const g = rgb[j + 1]
    const b = rgb[j + 2]
    L[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    const cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b
    const cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b
    // classic YCbCr skin box, softened at the edges; very dark/very bright pixels excluded
    const s = smooth(77, 85, cb) * (1 - smooth(122, 130, cb)) * smooth(133, 140, cr) * (1 - smooth(168, 176, cr)) * smooth(0.12, 0.2, L[i]) * (1 - smooth(0.92, 0.98, L[i]))
    skin[i] = s
  }
  const skinSoft = blurChannel(skin, w, h, Math.max(2, w / 300))

  // edges on a slightly blurred luminance (Sobel), normalised by a high percentile
  const Lb = blurChannel(L, w, h, Math.max(1, w / 1400))
  const E = new Float32Array(N)
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x
      const gx = -Lb[i - w - 1] - 2 * Lb[i - 1] - Lb[i + w - 1] + Lb[i - w + 1] + 2 * Lb[i + 1] + Lb[i + w + 1]
      const gy = -Lb[i - w - 1] - 2 * Lb[i - w] - Lb[i - w + 1] + Lb[i + w - 1] + 2 * Lb[i + w] + Lb[i + w + 1]
      E[i] = Math.hypot(gx, gy)
    }
  }
  const p = percentile(E, 0.965) || 1
  const strength = opts.lineStrength ?? 1
  const lines = new Float32Array(N)
  for (let i = 0; i < N; i++) lines[i] = smooth(0.35, 1.05, E[i] / p) * strength
  const glowSrc = blurChannel(lines, w, h, Math.max(2, w / 500))

  const back = backdropMask(rgb, w, h)

  // Face: an ellipse around the manifest's face box. Inside it the layer stays close to the real face (graded, no
  // contour lines) so the AI version never looks robotic or scary. Subject: lines outside it are faint.
  const faceW = new Float32Array(N)
  const subj = new Float32Array(N).fill(1)
  if (opts.face) {
    const fx = (opts.face.x + opts.face.w / 2) * w
    const fy = (opts.face.y + opts.face.h / 2) * h
    const rx = (opts.face.w / 2) * w * 1.08
    const ry = (opts.face.h / 2) * h * 1.12
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const d = Math.hypot((x - fx) / rx, (y - fy) / ry)
      faceW[y * w + x] = 1 - smooth(0.82, 1.08, d)
    }
  }
  if (opts.subject) {
    const { x: sx, y: sy, w: sw2, h: sh2 } = opts.subject
    const fall = 0.08
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const u = x / w
      const v = y / h
      const dx = Math.max(sx - u, 0, u - (sx + sw2))
      const dy = Math.max(sy - v, 0, v - (sy + sh2))
      subj[y * w + x] = 0.22 + 0.78 * (1 - smooth(0, fall, Math.hypot(dx, dy)))
    }
  }

  const out = Buffer.alloc(N * 3)
  const D0 = [7, 8, 10] // deepest graphite
  const D1 = [64, 70, 74] // highest graphite (cool)
  for (let i = 0, j = 0; i < N; i++, j += 3) {
    const t = Math.pow(L[i], 0.95)
    const sk = Math.max(skinSoft[i], faceW[i])
    const bk = back ? back[i] : 0
    // graphite duotone with a faint olive lift in the mids
    let r = mix(D0[0], D1[0], t)
    let g = mix(D0[1], D1[1], t) + 6 * t * (1 - t)
    let b = mix(D0[2], D1[2], t)
    // skin keeps some of its natural warmth (recognisable, never "robotic")
    const keep = 0.5 * sk + 0.25 * faceW[i]
    r = mix(r, rgb[j] * 0.62, keep)
    g = mix(g, rgb[j + 1] * 0.6, keep)
    b = mix(b, rgb[j + 2] * 0.58, keep)
    // plain studio backdrop → dark plate
    r = mix(r, 10, bk)
    g = mix(g, 11, bk)
    b = mix(b, 12, bk)
    // lumen structure lines: strong on fabric and jewellery, faint on skin, none on the backdrop
    const ln = Math.min(1, lines[i] * 0.95 + glowSrc[i] * 0.55) * (1 - 0.85 * sk) * (1 - faceW[i]) * (1 - bk) * subj[i]
    r = mix(r, LUMEN[0], ln * 0.85)
    g = mix(g, LUMEN[1], ln * 0.85)
    b = mix(b, LUMEN[2], ln * 0.85)
    out[j] = r
    out[j + 1] = g
    out[j + 2] = b
  }

  return sharp(out, { raw: { width: w, height: h, channels: 3 } })
    .composite([{ input: overlaySvg(w, h, opts), blend: 'over' }])
    .png()
    .toBuffer()
}
