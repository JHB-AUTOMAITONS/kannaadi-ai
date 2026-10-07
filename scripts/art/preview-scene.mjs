// node scripts/art/preview-scene.mjs <slug> <clean|ai> <out.png>
// Renders one industry scene module (scripts/art/scenes/<slug>.mjs) to a PNG for visual review.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import sharp from 'sharp'

const [slug, mode = 'clean', outFile] = process.argv.slice(2)
const mod = await import(pathToFileURL(path.resolve(import.meta.dirname, 'scenes', `${slug}.mjs`)).href)
const t0 = Date.now()
const svg = mod.scene(mode)
fs.mkdirSync(path.dirname(outFile), { recursive: true })
await sharp(Buffer.from(svg), { limitInputPixels: false }).resize(1200, 900).png().toFile(outFile)
console.log(`${slug}/${mode}: ${(svg.length / 1024).toFixed(0)}KB svg, ${Date.now() - t0}ms -> ${outFile}`)
