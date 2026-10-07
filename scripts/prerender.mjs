// Build step 3/3: prerender every route into static HTML (with full <head> metadata) so the site is
// crawlable and fast without waiting for JavaScript. Also writes sitemap.xml, robots.txt and 404.html.
//   vite build  →  vite build --ssr  →  node scripts/prerender.mjs
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const ssr = path.join(root, 'dist-ssr', 'entry-server.js')

const mod = await import(pathToFileURL(ssr).href)
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')
if (!template.includes('<!--app-html-->') || !template.includes('<!--app-head-->')) {
  throw new Error('index.html template is missing its <!--app-head--> / <!--app-html--> placeholders')
}

const fill = (headHtml, bodyHtml) => template.replace('<!--app-head-->', headHtml).replace('<!--app-html-->', bodyHtml)

let count = 0
for (const p of mod.paths()) {
  const html = fill(mod.head(p), await mod.render(p))
  const file = p === '/' ? path.join(dist, 'index.html') : path.join(dist, p, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, html)
  count++
  console.log(`  prerendered ${p}`)
}

// Unknown URLs: a real 404 page, marked noindex
fs.writeFileSync(path.join(dist, '404.html'), fill(mod.head('/__404__', { noindex: true }), await mod.render('/__404__')))
fs.writeFileSync(path.join(dist, 'sitemap.xml'), mod.sitemap())
fs.writeFileSync(path.join(dist, 'robots.txt'), mod.robots())
console.log(`prerendered ${count} routes + 404.html, sitemap.xml, robots.txt`)
