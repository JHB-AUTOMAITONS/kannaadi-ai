// npm run photos
// For every slot in manifest.mjs that has a source image in assets-src/photos/, write the optimised clean image,
// its derived AI layer (pixel-aligned by construction) and a menu thumbnail into public/images/models/, then
// regenerate src/data/photos.generated.ts so the site uses the photo instead of the placeholder art.
//   PHOTOS_SRC=<dir>  read sources from another folder (testing)
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { aiLayer } from './ai-layer.mjs'
import { SLOTS } from './manifest.mjs'

const root = path.resolve(import.meta.dirname, '..', '..')
const srcDir = path.resolve(process.env.PHOTOS_SRC || path.join(root, 'assets-src', 'photos'))
const outRoot = path.join(root, 'public', 'images', 'models')
const registryFile = path.join(root, 'src', 'data', 'photos.generated.ts')
const EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif']

const findSource = (id) => EXT.map((e) => path.join(srcDir, id + e)).find((f) => fs.existsSync(f))
/** Optional supplied Image 2 (e.g. the same model trying on another outfit). Without it, Image 2 is derived. */
const findSecond = (id) => EXT.map((e) => path.join(srcDir, `${id}.ai${e}`)).find((f) => fs.existsSync(f))
/** Optional silhouette mask (alpha = model), used to keep decorative lettering behind her. */
const findMask = (id) => ['.png', '.webp'].map((e) => path.join(srcDir, `${id}.mask${e}`)).find((f) => fs.existsSync(f))
const readSidecar = (id) => {
  const f = path.join(srcDir, `${id}.json`)
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {}
}

/**
 * Shift the photo's colours so its studio backdrop matches the page background exactly (per-channel gain from the
 * mean of the top and outer edges). The adjustment is small (a few %), so skin and fabric are unaffected, and the
 * stage edges disappear into the page. Returns the gain so a supplied Image 2 can get the identical correction.
 */
async function backdropGain(png, hex) {
  const target = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: w, height: h } = info
  const sum = [0, 0, 0]
  let n = 0
  const add = (x, y) => {
    const i = (y * w + x) * 3
    sum[0] += data[i]
    sum[1] += data[i + 1]
    sum[2] += data[i + 2]
    n++
  }
  for (let y = 0; y < Math.round(h * 0.06); y += 2) for (let x = 0; x < w; x += 4) add(x, y)
  for (let y = 0; y < h; y += 4) for (let x = 0; x < Math.round(w * 0.04); x += 2) add(x, y)
  const gain = sum.map((v, c) => target[c] / (v / n))
  console.log(`    backdrop matched to ${hex} (gain ${gain.map((g) => g.toFixed(3)).join(', ')})`)
  return gain
}
const applyGain = (png, gain) => sharp(png).linear(gain, [0, 0, 0]).png().toBuffer()

/** Cover-crop to exactly w×h around a focal point (0–1), without upscaling artefacts beyond what is needed. */
async function coverCrop(file, w, h, [fx, fy]) {
  const img = sharp(file).rotate()
  const m = await img.metadata()
  const iw = m.autoOrient?.width ?? m.width
  const ih = m.autoOrient?.height ?? m.height
  const s = Math.max(w / iw, h / ih)
  const rw = Math.round(iw * s)
  const rh = Math.round(ih * s)
  const left = Math.round((rw - w) * fx)
  const top = Math.round((rh - h) * fy)
  if (s > 1.05) console.warn(`    ! source is smaller than the slot (${iw}x${ih} → ${w}x${h}); it will be upscaled ${s.toFixed(2)}×`)
  return img.resize(rw, rh, { kernel: 'lanczos3' }).extract({ left, top, width: w, height: h }).png().toBuffer()
}

const kb = (f) => `${(fs.statSync(f).size / 1024).toFixed(0)}KB`
const registry = {}
let built = 0

for (const slot of SLOTS) {
  const src = findSource(slot.id)
  if (!src) continue
  const side = readSidecar(slot.id)
  const focal = side.focal ?? (slot.id === 'hero' ? [0.7, 0.4] : [0.5, 0.35])
  console.log(`${slot.id}  ←  ${path.basename(src)}`)
  const dir = path.join(outRoot, slot.dir)
  fs.mkdirSync(dir, { recursive: true })

  const second = findSecond(slot.id)
  let clean = await coverCrop(src, slot.width, slot.height, focal)
  let ai = second ? await coverCrop(second, slot.width, slot.height, focal) : null
  const match = side.matchBackground === false ? null : slot.matchBackground
  if (match) {
    const gain = await backdropGain(clean, match)
    clean = await applyGain(clean, gain)
    if (ai) ai = await applyGain(ai, gain)
  }
  if (ai) console.log(`    Image 2 supplied: ${path.basename(second)} (not derived)`)
  else ai = await aiLayer(clean, { ...(slot.overlay ?? {}), face: side.face, subject: side.subject })
  const sizes = slot.sizes ?? [slot.width]
  const entry = { width: slot.width, height: slot.height, alt: side.alt ?? slot.alt, clean: [], ai: [] }
  for (const k of ['hint', 'touchHint', 'pairLabel', 'cursorLabel']) if (side[k]) entry[k] = side[k]
  for (const w of sizes) {
    const h = Math.round((slot.height * w) / slot.width)
    const suffix = w === slot.width ? '' : `-${w}`
    for (const [kind, buf, q] of [['clean', clean, 82], ['ai', ai, 74]]) {
      const name = `${slot.file}-${kind}${suffix}.webp`
      const file = path.join(dir, name)
      await sharp(buf).resize(w, h).webp({ quality: q, effort: 6 }).toFile(file)
      entry[kind].push({ src: `/images/models/${slot.dir}/${name}`, width: w })
      console.log(`    ${path.relative(root, file)}  ${kb(file)}`)
    }
  }
  if (slot.thumb) {
    const name = `${slot.file}-thumb.webp`
    const file = path.join(dir, name)
    await sharp(clean).resize(192, 144, { fit: 'cover', position: 'attention' }).webp({ quality: 72, effort: 6 }).toFile(file)
    entry.thumb = `/images/models/${slot.dir}/${name}`
  }
  // A supplied Image 2 is a real photo; dark sections that borrow the hero still want the AI-scan look, so derive it
  if (second) {
    const scan = await aiLayer(ai, { ...(slot.overlay ?? {}), face: side.face, subject: side.subject })
    entry.scan = []
    for (const w of [1600, 800]) {
      const name = `${slot.file}-scan-${w}.webp`
      const file = path.join(dir, name)
      await sharp(scan).resize(w, Math.round((slot.height * w) / slot.width)).webp({ quality: 74, effort: 6 }).toFile(file)
      entry.scan.push({ src: `/images/models/${slot.dir}/${name}`, width: w })
      console.log(`    ${path.relative(root, file)}  ${kb(file)}  (AI scan of Image 2)`)
    }
  }
  const maskSrc = findMask(slot.id)
  if (maskSrc) {
    const name = `${slot.file}-mask.webp`
    const file = path.join(dir, name)
    await sharp(maskSrc).resize(Math.round(slot.width / 2), Math.round(slot.height / 2)).webp({ quality: 60, alphaQuality: 70, effort: 6 }).toFile(file)
    entry.mask = `/images/models/${slot.dir}/${name}`
    console.log(`    ${path.relative(root, file)}  ${kb(file)}  (silhouette mask)`)
  }
  registry[slot.id] = entry
  built++

  // Social card from the hero pair: clean left, AI right, joined by an organic seam (the reveal in one frame)
  if (slot.id === 'hero') {
    const W = 1200
    const H = 630
    const c = await sharp(clean).resize(W, H, { fit: 'cover', position: 'right' }).png().toBuffer()
    const a = await sharp(ai).resize(W, H, { fit: 'cover', position: 'right' }).png().toBuffer()
    const seam = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><filter id="f"><feGaussianBlur stdDeviation="6"/></filter></defs>` +
        `<path d="M860 -20 C 920 70 800 140 850 220 C 900 300 790 360 845 440 C 890 520 810 580 860 650 L1220 650 L1220 -20Z" fill="#fff" filter="url(#f)"/></svg>`,
    )
    const masked = await sharp(a).composite([{ input: seam, blend: 'dest-in' }]).png().toBuffer()
    const og = path.join(root, 'public', 'images', 'og', 'kannaadi-og.jpg')
    await sharp(c).composite([{ input: masked }]).jpeg({ quality: 84, mozjpeg: true }).toFile(og)
    console.log(`    ${path.relative(root, og)}  ${kb(og)}  (social card)`)
  }
}

const banner = '// GENERATED by scripts/photos/build-photos.mjs (npm run photos) — do not edit by hand.\n'
fs.writeFileSync(
  registryFile,
  `${banner}import type { PhotoEntry } from './photos'\n\nexport const PHOTOS: Record<string, PhotoEntry> = ${JSON.stringify(registry, null, 2)}\n`,
)
const missing = SLOTS.filter((s) => !registry[s.id]).map((s) => s.id)
console.log(`\n${built} photo slot(s) built. ${missing.length ? `Still using placeholder art: ${missing.join(', ')}` : 'All slots have photos.'}`)
console.log(`registry → ${path.relative(root, registryFile)}`)
