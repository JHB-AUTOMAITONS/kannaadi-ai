// npm run photos:tryon
// Builds the home-hero reveal pair from two cut-out photos (transparent background) of the SAME model:
//   assets-src/photos/hero-tryon/casual.png  → Image 1 (what visitors see first)
//   assets-src/photos/hero-tryon/saree.png   → Image 2 (revealed under the pointer: she "tries on" the saree)
// aligned by both pupils (hero-tryon/align.json, source pixels).
//
// Both figures are placed on one shared studio backdrop (page ivory + a soft sand halo), so outside the model the two
// layers are identical and the reveal only ever changes her outfit. Image 2 is mapped onto Image 1 with a similarity
// transform (scale + rotation + shift) solved from the eyes, sampled with premultiplied bilinear filtering.
// Outputs (consumed by `npm run photos`):
//   hero.png / hero.ai.png  — 2400×1300 composites
//   hero.mask.png           — the union of both silhouettes, used to keep the hero's background lettering behind her
//   hero.json               — face + subject boxes and the reveal wording
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..', '..')
const dir = path.join(root, 'assets-src', 'photos', 'hero-tryon')
const outDir = path.join(root, 'assets-src', 'photos')
const align = JSON.parse(fs.readFileSync(path.join(dir, 'align.json'), 'utf8'))

const W = 2400
const H = 1300
const IVORY = [245, 241, 232]
const HALO = [233, 226, 212] // sand, a few levels darker than ivory
const HEADROOM = 0.08 // fraction of the canvas above her hair
const FACE_X = 0.7 // where her face sits across the canvas (copy lives on the left)
const EDGE_FEATHER = 18 // px, softens any place a cut-out touches its own image border (except the bottom)

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const rgba = async (file) => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  return { data, w: info.width, h: info.height }
}

/** Premultiplied bilinear sample → [r,g,b,a] (rgb premultiplied, 0–255; a 0–1). Out of bounds = transparent. */
function sample(img, x, y, feather) {
  if (x < 0 || y < 0 || x > img.w - 1 || y > img.h - 1) return null
  const x0 = Math.floor(x)
  const y0 = Math.floor(y)
  const x1 = Math.min(img.w - 1, x0 + 1)
  const y1 = Math.min(img.h - 1, y0 + 1)
  const fx = x - x0
  const fy = y - y0
  const out = [0, 0, 0, 0]
  for (const [xx, yy, wgt] of [[x0, y0, (1 - fx) * (1 - fy)], [x1, y0, fx * (1 - fy)], [x0, y1, (1 - fx) * fy], [x1, y1, fx * fy]]) {
    const i = (yy * img.w + xx) * 4
    const a = (img.data[i + 3] / 255) * wgt
    out[0] += img.data[i] * a
    out[1] += img.data[i + 1] * a
    out[2] += img.data[i + 2] * a
    out[3] += a
  }
  if (feather) {
    const edge = Math.min(x, y, img.w - 1 - x) // left, top, right (bottom runs off the canvas)
    const f = smooth(0, EDGE_FEATHER, edge)
    for (let c = 0; c < 4; c++) out[c] *= f
  }
  return out
}

const A = await rgba(path.join(dir, 'casual.png'))
const B = await rgba(path.join(dir, 'saree.png'))

// ---- placement of Image 1 on the canvas: bottom-aligned, headroom above, face at FACE_X ------------------------------
const [aL, aR] = [align.casual.leftEye, align.casual.rightEye]
const sc = (H * (1 - HEADROOM)) / A.h
const faceSrcX = (aL[0] + aR[0]) / 2
const X0 = W * FACE_X - faceSrcX * sc
const Y0 = H - A.h * sc

// ---- similarity Image 2 → Image 1 from the pupils (complex numbers) ----------------------------------------------------
const [bL, bR] = [align.saree.leftEye, align.saree.rightEye]
const va = [aR[0] - aL[0], aR[1] - aL[1]]
const vb = [bR[0] - bL[0], bR[1] - bL[1]]
const den = vb[0] ** 2 + vb[1] ** 2
const z = [(va[0] * vb[0] + va[1] * vb[1]) / den, (va[1] * vb[0] - va[0] * vb[1]) / den] // B offsets → A offsets
const zd = z[0] ** 2 + z[1] ** 2
const zi = [z[0] / zd, -z[1] / zd] // A offsets → B offsets
console.log(`saree → casual: scale ${Math.hypot(...z).toFixed(4)}, rotation ${((Math.atan2(z[1], z[0]) * 180) / Math.PI).toFixed(2)}°; casual on canvas ×${sc.toFixed(3)} at (${X0.toFixed(0)}, ${Y0.toFixed(0)})`)

// ---- shared backdrop: ivory + soft halo behind her head and shoulders ---------------------------------------------------
const faceCanvas = [W * FACE_X, Y0 + ((aL[1] + aR[1]) / 2) * sc]
const backdrop = (x, y) => {
  const d = Math.hypot((x - faceCanvas[0]) / 760, (y - faceCanvas[1] - 260) / 820)
  const t = 1 - smooth(0.15, 1.05, d)
  return [0, 1, 2].map((c) => IVORY[c] + (HALO[c] - IVORY[c]) * t)
}

const outA = Buffer.alloc(W * H * 3)
const outB = Buffer.alloc(W * H * 3)
const union = new Float32Array(W * H)
let minX = W, maxX = 0, minY = H
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const bg = backdrop(x, y)
    // canvas → Image 1 source
    const ax = (x - X0) / sc
    const ay = (y - Y0) / sc
    const sa = sample(A, ax, ay, true)
    // Image 1 source → Image 2 source
    const px = ax - aL[0]
    const py = ay - aL[1]
    const sb = sample(B, bL[0] + px * zi[0] - py * zi[1], bL[1] + px * zi[1] + py * zi[0], true)
    const o = (y * W + x) * 3
    const alphaA = sa ? sa[3] : 0
    const alphaB = sb ? sb[3] : 0
    for (let c = 0; c < 3; c++) {
      outA[o + c] = (sa ? sa[c] : 0) + bg[c] * (1 - alphaA)
      outB[o + c] = (sb ? sb[c] : 0) + bg[c] * (1 - alphaB)
    }
    const u = Math.max(alphaA, alphaB)
    union[y * W + x] = u
    if (u > 0.5) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
    }
  }
}

const png = (buf) => sharp(buf, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 6 })
await png(outA).toFile(path.join(outDir, 'hero.png'))
await png(outB).toFile(path.join(outDir, 'hero.ai.png'))

// silhouette mask (white, alpha = model presence), half resolution, slightly grown so lettering clears her outline
const MW = W / 2
const MH = H / 2
const mask = Buffer.alloc(MW * MH * 4)
for (let y = 0; y < MH; y++) {
  for (let x = 0; x < MW; x++) {
    let m = 0
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) m = Math.max(m, union[(y * 2 + dy) * W + x * 2 + dx])
    const o = (y * MW + x) * 4
    mask[o] = mask[o + 1] = mask[o + 2] = 255
    mask[o + 3] = Math.round(Math.min(1, m * 1.15) * 255)
  }
}
await sharp(mask, { raw: { width: MW, height: MH, channels: 4 } }).blur(2.5).png().toFile(path.join(outDir, 'hero.mask.png'))

const fx = faceCanvas[0] / W
const fy = faceCanvas[1] / H
const side = {
  ...(align.meta ?? {}),
  face: { x: +(fx - 0.06).toFixed(3), y: +(fy - 0.1).toFixed(3), w: 0.12, h: 0.22 },
  subject: { x: +(minX / W).toFixed(3), y: +(minY / H).toFixed(3), w: +((maxX - minX) / W).toFixed(3), h: +(1 - minY / H).toFixed(3) },
  matchBackground: false,
}
fs.writeFileSync(path.join(outDir, 'hero.json'), JSON.stringify(side, null, 2) + '\n')
console.log(`hero.png + hero.ai.png + hero.mask.png (${W}×${H}); her figure spans x ${minX}–${maxX}, top at y ${minY}`)
