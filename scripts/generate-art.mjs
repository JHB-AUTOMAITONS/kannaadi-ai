// Generates every raster visual on the site into public/images (WebP).
//   node scripts/generate-art.mjs            -> everything
//   node scripts/generate-art.mjs hero       -> only the hero + gown colourways + OG
//   node scripts/generate-art.mjs industry   -> only the industry scenes (+ menu thumbnails)
//   node scripts/generate-art.mjs thumbs     -> only the menu thumbnails, from the existing clean scenes
//
// All artwork is procedural (see scripts/art/*). Swap any output file for real photography of the
// same dimensions and the site will pick it up unchanged — clean/AI pairs must stay pixel-aligned.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'
import { gownScene, COLORWAYS } from './art/gown.mjs'

const root = path.resolve(import.meta.dirname, '..')
const out = (...p) => path.join(root, 'public', 'images', ...p)
const only = process.argv[2]

const save = async (svg, file, { width, height, quality = 80, alpha = false, effort = 5 } = {}) => {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  let img = sharp(Buffer.from(svg), { limitInputPixels: false })
  if (width) img = img.resize(width, height)
  await img.webp({ quality, effort, alphaQuality: alpha ? 90 : 100 }).toFile(file)
  const kb = (fs.statSync(file).size / 1024).toFixed(0)
  console.log(`  ${path.relative(root, file)}  ${kb}KB`)
}

// ---- hero: 2400x1300 full-bleed frame, garment right of centre -----------------------------
const HW = 2400
const HH = 1300
const HS = 0.66
const heroPlace = { width: HW, height: HH, scale: HS, tx: 1700 - 856 * HS, ty: 112 - 150 * HS }

async function hero() {
  console.log('hero')
  const clean = gownScene({ mode: 'clean', ...heroPlace })
  const plate = gownScene({ mode: 'ai-plate', ...heroPlace })
  for (const [name, svg, alpha] of [['clean', clean, true], ['ai', plate, false]]) {
    await save(svg, out('hero', `hero-${name}-2400.webp`), { width: 2400, height: 1300, quality: alpha ? 84 : 78, alpha })
    await save(svg, out('hero', `hero-${name}-1600.webp`), { width: 1600, height: 867, quality: alpha ? 82 : 74, alpha })
    if (name === 'ai') await save(svg, out('hero', 'hero-ai-800.webp'), { width: 800, height: 434, quality: 72 }) // decorative backgrounds on phones
  }

  // OG card: clean left, AI right, joined by an organic seam — the reveal concept in one frame.
  const og = { width: 2400, height: 1260, scale: 0.68, tx: 1200 - 856 * 0.68, ty: 70 - 150 * 0.68 }
  const cleanPng = await sharp(Buffer.from(gownScene({ mode: 'clean', ...og }))).resize(1200, 630).flatten({ background: '#F5F1E8' }).png().toBuffer()
  const aiPng = await sharp(Buffer.from(gownScene({ mode: 'ai-plate', ...og }))).resize(1200, 630).png().toBuffer()
  const blob =
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><defs><filter id="f"><feGaussianBlur stdDeviation="5"/></filter></defs>` +
    `<path d="M640 -20 C 700 60 560 120 610 200 C 660 280 540 340 600 420 C 650 500 560 560 620 650 L1220 650 L1220 -20Z" fill="#fff" filter="url(#f)"/></svg>`
  const masked = await sharp(aiPng).composite([{ input: Buffer.from(blob), blend: 'dest-in' }]).png().toBuffer()
  fs.mkdirSync(out('og'), { recursive: true })
  await sharp(cleanPng).composite([{ input: masked }]).jpeg({ quality: 84, mozjpeg: true }).toFile(out('og', 'kannaadi-og.jpg'))
  console.log('  public/images/og/kannaadi-og.jpg')

  // gown colourways for the try-on showcase (portrait, transparent) + the scan counterpart
  console.log('gown colourways')
  const GW = 1100
  const GH = 1300
  const gs = 0.66
  const gp = { width: GW, height: GH, scale: gs, tx: (GW - 1600 * gs) / 2 - 40 * gs, ty: 70 - 150 * gs }
  for (const cw of Object.keys(COLORWAYS)) {
    await save(gownScene({ mode: 'clean', colorway: cw, ...gp }), out('showcase', `gown-${cw}.webp`), { width: GW, height: GH, quality: 84, alpha: true })
  }
  await save(gownScene({ mode: 'ai-cutout', ...gp }), out('showcase', 'gown-scan.webp'), { width: GW, height: GH, quality: 82, alpha: true })
}

// ---- industry scenes ---------------------------------------------------------------------------
export const INDUSTRY = [
  'fashion-stores',
  'saree-ethnic-stores',
  'bridal-stores',
  'boutiques',
  'shopping-malls',
  'events-exhibitions',
  'jewellery-stores',
  'eyewear-stores',
]

async function industry() {
  console.log('industry scenes')
  for (const slug of INDUSTRY) {
    const file = path.join(root, 'scripts', 'art', 'scenes', `${slug}.mjs`)
    if (!fs.existsSync(file)) {
      console.log(`  (skipped ${slug}: scene module not written yet)`)
      continue
    }
    const mod = await import(pathToFileURL(file).href)
    for (const mode of ['clean', 'ai']) {
      const svg = mod.scene(mode)
      await save(svg, out('industry', `${slug}-${mode}.webp`), { width: 1200, height: 900, quality: mode === 'ai' ? 76 : 80 })
    }
  }
}

/** 64×48 menu thumbnails (rendered at 3×), cut from the finished clean scenes: a few KB instead of the 1200px scene. */
async function thumbs() {
  console.log('industry thumbnails')
  for (const slug of INDUSTRY) {
    const src = out('industry', `${slug}-clean.webp`)
    if (!fs.existsSync(src)) continue
    const dest = out('industry', `${slug}-thumb.webp`)
    await sharp(src).resize(192, 144).webp({ quality: 72, effort: 6 }).toFile(dest)
    console.log(`  ${path.relative(root, dest)}  ${(fs.statSync(dest).size / 1024).toFixed(1)}KB`)
  }
}

/** 550×650 variants of every gown image, cut from the full-size files, for thumbnails and 1× layouts. */
async function gownSmall() {
  console.log('gown small variants')
  for (const id of [...Object.keys(COLORWAYS), 'scan']) {
    const src = out('showcase', `gown-${id}.webp`)
    if (!fs.existsSync(src)) continue
    const dest = out('showcase', `gown-${id}-sm.webp`)
    await sharp(src).resize(550, 650).webp({ quality: 78, effort: 6, alphaQuality: 85 }).toFile(dest)
    console.log(`  ${path.relative(root, dest)}  ${(fs.statSync(dest).size / 1024).toFixed(0)}KB`)
  }
}

if (!only || only === 'hero') await hero()
if (!only || only === 'hero' || only === 'thumbs') await gownSmall()
if (!only || only === 'industry') await industry()
if (!only || only === 'industry' || only === 'thumbs') await thumbs()
console.log('done')
