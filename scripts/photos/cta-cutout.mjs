// npm run photos:cta
// Builds the transparent model used by the closing "Book a demo" card (src/components/sections/ConversionCard.tsx)
// from the same cut-out photo as the home hero's Image 2 (assets-src/photos/hero-tryon/saree.png).
//
// The colours are left exactly as photographed: no filter, tint or overlay. The only changes are
//   · transparent headroom above her hair, so the card's crop never touches her head, and
//   · three web sizes with alpha (webp), for srcset.
// The cut-out runs off its own right and bottom edges, so the card anchors it flush to those two edges.
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..', '..')
const src = path.join(root, 'assets-src', 'photos', 'hero-tryon', 'saree.png')
const outDir = path.join(root, 'public', 'images', 'models', 'cta')
const HEADROOM = 128 // source px of transparent canvas above the hair
const WIDTHS = [1024, 768, 512]

fs.mkdirSync(outDir, { recursive: true })
const { width, height } = await sharp(src).metadata()
const padded = await sharp(src)
  .ensureAlpha()
  .extend({ top: HEADROOM, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer()
const H = height + HEADROOM

for (const w of WIDTHS) {
  const h = Math.round((H * w) / width)
  const file = path.join(outDir, `saree-cutout-${w}.webp`)
  await sharp(padded).resize(w, h, { kernel: 'lanczos3' }).webp({ quality: 78, alphaQuality: 88, effort: 6 }).toFile(file)
  console.log(`${path.relative(root, file)}  ${w}×${h}  ${(fs.statSync(file).size / 1024).toFixed(0)}KB`)
}
console.log(`source ${width}×${height} + ${HEADROOM}px headroom → canvas ${width}×${H} (use width=${width} height=${H} in <img>)`)
