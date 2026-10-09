// npm run photos:generate [-- slot1 slot2 …] [--force]
// Generates the source photos for every manifest slot that doesn't have one yet, with FLUX.1-schnell (Apache-2.0
// licence: generated images may be used commercially) through its public Hugging Face Space. Anonymous use has a
// small GPU quota; set HF_TOKEN (a free Hugging Face access token) in your environment for more.
// Review every image before building: regenerate a slot with a different seed via SEED=<n>.
import fs from 'node:fs'
import path from 'node:path'
import { Client } from '@gradio/client'
import { SLOTS } from './manifest.mjs'

const root = path.resolve(import.meta.dirname, '..', '..')
const outDir = path.join(root, 'assets-src', 'photos')
const args = process.argv.slice(2)
const force = args.includes('--force')
const only = args.filter((a) => !a.startsWith('--'))
const seedBase = Number(process.env.SEED || 11)

/** Generation size: the slot's aspect at ~1.2 MP, multiples of 16 (FLUX requirement). */
function genSize(slot) {
  const r = slot.width / slot.height
  const area = slot.id === 'hero' ? 1920 * 1040 : 1280 * 960
  let w = Math.round(Math.sqrt(area * r) / 16) * 16
  let h = Math.round(w / r / 16) * 16
  return { w: Math.min(2048, w), h: Math.min(2048, h) }
}

const exists = (id) => ['.png', '.jpg', '.jpeg', '.webp'].some((e) => fs.existsSync(path.join(outDir, id + e)))
const todo = SLOTS.filter((s) => (only.length ? only.includes(s.id) : true) && (force || !exists(s.id)))
if (!todo.length) {
  console.log('Nothing to generate — every slot has a source photo. Use --force or name slots to regenerate.')
  process.exit(0)
}

const client = await Client.connect('black-forest-labs/FLUX.1-schnell', process.env.HF_TOKEN ? { hf_token: process.env.HF_TOKEN } : {})
fs.mkdirSync(outDir, { recursive: true })
let made = 0
for (const [i, slot] of todo.entries()) {
  const { w, h } = genSize(slot)
  // looks share one seed so the four colourways keep the same woman and pose as closely as text-to-image allows
  const seed = slot.id.startsWith('look-') ? seedBase + 100 : seedBase + i
  process.stdout.write(`${slot.id} ${w}x${h} seed ${seed} … `)
  try {
    const res = await client.predict('/infer', { prompt: slot.prompt, seed, randomize_seed: false, width: w, height: h, num_inference_steps: 4 })
    const buf = Buffer.from(await (await fetch(res.data[0].url)).arrayBuffer())
    const file = path.join(outDir, `${slot.id}.webp`)
    fs.writeFileSync(file, buf)
    made++
    console.log(`saved ${path.relative(root, file)}`)
  } catch (e) {
    const msg = String(e?.message || e)
    console.log(`failed: ${msg.slice(0, 160)}`)
    if (/quota/i.test(msg)) {
      console.log('\nGPU quota used up. Wait and re-run (finished slots are skipped), or set HF_TOKEN for more quota.')
      break
    }
  }
}
console.log(`\n${made} image(s) generated. Review them in assets-src/photos/, add face boxes (<slot>.json), then: npm run photos && npm run build`)
