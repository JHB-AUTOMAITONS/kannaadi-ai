// Dev helper: render one hero scene to a preview PNG for visual iteration.
//   node scripts/generate-art-preview.mjs <out.png> <clean|ai-plate|ai-cutout> [colorway]
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'
import { gownScene } from './art/gown.mjs'

const out = process.argv[2]
const mode = process.argv[3] || 'clean'
const colorway = process.argv[4] || 'ink'
const t0 = Date.now()
const W = 2400
const H = 1300
const s = 0.6
const svg = gownScene({ mode, width: W, height: H, scale: s, tx: 1700 - 800 * s - 56 * s, ty: 150 - 150 * s + 40, colorway })
fs.mkdirSync(path.dirname(out), { recursive: true })
await sharp(Buffer.from(svg))
  .resize(1200, 650)
  .flatten({ background: '#F5F1E8' })
  .png()
  .toFile(out)
console.log(`${mode}: svg ${(svg.length / 1024).toFixed(0)}KB, ${Date.now() - t0}ms -> ${out}`)
