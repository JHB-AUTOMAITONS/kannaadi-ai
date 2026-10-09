// Dev helper: run the AI-layer derivation on any photo and write a review sheet:
// [clean | AI layer | clean with an organic reveal blob over it].
//   node scripts/photos/try-layer.mjs <photo> <out.png> [maxWidth=900] [face=x,y,w,h]
import fs from 'node:fs'
import sharp from 'sharp'
import { aiLayer } from './ai-layer.mjs'

const [src, outFile, maxW = '900', faceArg, subjArg] = process.argv.slice(2)
const box = (a) => (a ? Object.fromEntries(a.split(',').map((v, i) => [['x', 'y', 'w', 'h'][i], Number(v)])) : undefined)
const subject = box(subjArg)
const face = faceArg ? Object.fromEntries(faceArg.split(',').map((v, i) => [['x', 'y', 'w', 'h'][i], Number(v)])) : undefined
const clean = await sharp(fs.readFileSync(src)).rotate().resize({ width: Number(maxW) }).png().toBuffer()
const { width: w, height: h } = await sharp(clean).metadata()
const t0 = Date.now()
const ai = await aiLayer(clean, { face, subject, rails: [{ y: 0.62, x0: 0.3, x1: 0.7 }], nodes: [{ x: 0.5, y: 0.8 }] })
const ms = Date.now() - t0
// organic blob preview at the centre
const blob = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><defs><filter id="f"><feGaussianBlur stdDeviation="${w / 40}"/></filter></defs>` +
    `<path transform="translate(${w * 0.5} ${h * 0.55}) scale(${w / 900})" d="M0-190C90-200 170-120 175-30C180 60 120 150 30 175C-60 200-160 150-185 60C-205-20-170-120-110-160C-70-185-40-188 0-190Z" fill="#fff" filter="url(#f)"/></svg>`,
)
const masked = await sharp(ai).composite([{ input: blob, blend: 'dest-in' }]).png().toBuffer()
const reveal = await sharp(clean).composite([{ input: masked }]).png().toBuffer()
await sharp({ create: { width: w * 3 + 20, height: h, channels: 3, background: '#666' } })
  .composite([{ input: clean, left: 0, top: 0 }, { input: ai, left: w + 10, top: 0 }, { input: reveal, left: 2 * w + 20, top: 0 }])
  .png()
  .toFile(outFile)
console.log(`${w}x${h} ai layer in ${ms}ms → ${outFile}`)
