// Post-build verification of the prerendered site (dist/). Run: npm run build && npm run verify
// Checks every indexable route for SEO structure, keyword placement, heading hierarchy, image alt text,
// canonical/OG/Twitter metadata, JSON-LD validity and internal-link integrity.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import * as cheerio from 'cheerio'

const root = path.resolve(import.meta.dirname, '..')
const dist = path.join(root, 'dist')
const mod = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href)
const PAGES = mod.pages()
const SITE_URL = mod.siteUrl()

/** The exact URL set from the brief. */
const EXPECTED = [
  '/', '/features/', '/for-businesses/', '/for-businesses/fashion-stores/', '/for-businesses/saree-ethnic-stores/',
  '/for-businesses/bridal-stores/', '/for-businesses/boutiques/', '/for-businesses/shopping-malls/',
  '/for-businesses/events-exhibitions/', '/for-businesses/jewellery-stores/', '/for-businesses/eyewear-stores/',
  '/use-cases/', '/about/', '/book-a-demo/', '/contact/',
]
const EXPECTED_PRIMARY = {
  '/': 'virtual try on',
  '/features/': 'AI fashion technology',
  '/for-businesses/': null,
  '/use-cases/': 'virtual try on for ecommerce',
  '/about/': 'fashion technology company',
  '/book-a-demo/': 'virtual try on software',
  '/contact/': 'virtual try on company',
  '/for-businesses/fashion-stores/': 'virtual try on for fashion stores',
  '/for-businesses/saree-ethnic-stores/': 'virtual try on saree',
  '/for-businesses/bridal-stores/': 'virtual try on wedding dresses',
  '/for-businesses/boutiques/': 'virtual try on for boutiques',
  '/for-businesses/shopping-malls/': 'virtual fitting room in store',
  '/for-businesses/events-exhibitions/': 'brand activation marketing',
  '/for-businesses/jewellery-stores/': 'virtual try on jewellery',
  '/for-businesses/eyewear-stores/': 'virtual try on eyewear',
}

const failures = []
const notes = []
const fail = (p, msg) => failures.push(`${p}  ✗ ${msg}`)
const norm = (t) => t.replace(/\s+/g, ' ').replace(/[’‘]/g, "'").trim().toLowerCase()

// 1. exact route set + keyword mapping -----------------------------------------------------------
const got = PAGES.map((p) => p.path)
if (JSON.stringify([...got].sort()) !== JSON.stringify([...EXPECTED].sort())) fail('routes', `route set differs from brief.\n    got:      ${got.join(' ')}\n    expected: ${EXPECTED.join(' ')}`)
for (const p of PAGES) {
  if ((p.primary ?? null) !== EXPECTED_PRIMARY[p.path]) fail(p.path, `primary keyword is "${p.primary}", brief says "${EXPECTED_PRIMARY[p.path]}"`)
  if (!/^\/[a-z0-9\-/]*$/.test(p.path) || !p.path.endsWith('/')) fail(p.path, 'URL must be lowercase, hyphenated, trailing-slash')
}
const primaries = PAGES.map((p) => p.primary).filter(Boolean)
if (new Set(primaries).size !== primaries.length) fail('keywords', 'a primary keyword is used on more than one page')

// 2. per-page checks ------------------------------------------------------------------------------
const seenTitles = new Map()
const seenDesc = new Map()
const seenH1 = new Map()
const anchors = new Map() // path -> Set of element ids

const pageHtml = (p) => fs.readFileSync(p === '/' ? path.join(dist, 'index.html') : path.join(dist, p, 'index.html'), 'utf8')

for (const page of PAGES) {
  const p = page.path
  let html
  try {
    html = pageHtml(p)
  } catch {
    fail(p, 'prerendered file missing')
    continue
  }
  const $ = cheerio.load(html)
  anchors.set(p, new Set($('[id]').map((_, el) => $(el).attr('id')).get()))

  // title
  const title = $('title').text().trim()
  if (!title) fail(p, 'no <title>')
  else {
    if (title.length > 66) notes.push(`${p}  title is ${title.length} chars (may truncate in results)`)
    if (seenTitles.has(title)) fail(p, `duplicate title with ${seenTitles.get(title)}`)
    seenTitles.set(title, p)
    if (page.primary && !norm(title).includes(page.primary.toLowerCase())) fail(p, `title lacks primary keyword "${page.primary}"`)
  }
  // description
  const desc = $('meta[name="description"]').attr('content') ?? ''
  if (desc.length < 70 || desc.length > 175) fail(p, `meta description length ${desc.length} (want 70–175)`)
  if (seenDesc.has(desc)) fail(p, `duplicate description with ${seenDesc.get(desc)}`)
  seenDesc.set(desc, p)
  if (page.primary && !norm(desc).includes(page.primary.toLowerCase().replace('ai ', ''))) notes.push(`${p}  description does not contain "${page.primary}" verbatim`)

  // canonical, robots, OG, Twitter
  const canon = $('link[rel="canonical"]').attr('href')
  if (canon !== `${SITE_URL}${p}`) fail(p, `canonical is "${canon}"`)
  if ($('link[rel="canonical"]').length !== 1) fail(p, 'expected exactly one canonical')
  if (/noindex/.test($('meta[name="robots"]').attr('content') ?? '')) fail(p, 'indexable page is marked noindex')
  for (const k of ['og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:site_name']) if (!$(`meta[property="${k}"]`).attr('content')) fail(p, `missing ${k}`)
  for (const k of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!$(`meta[name="${k}"]`).attr('content')) fail(p, `missing ${k}`)
  if ($('meta[property="og:url"]').attr('content') !== canon) fail(p, 'og:url differs from canonical')

  // single H1 containing the primary keyword
  const h1s = $('main h1, #root h1')
  if (h1s.length !== 1) fail(p, `${h1s.length} <h1> elements (want exactly 1)`)
  const h1 = norm(h1s.first().text())
  if (seenH1.has(h1)) fail(p, `duplicate H1 with ${seenH1.get(h1)}`)
  seenH1.set(h1, p)
  if (page.primary && !h1.includes(page.primary.toLowerCase())) fail(p, `H1 "${h1}" lacks primary keyword "${page.primary}"`)

  // primary keyword in the first substantial paragraph of <main>
  if (page.primary) {
    const first = $('main p')
      .map((_, el) => norm($(el).text()))
      .get()
      .find((t) => t.length > 60)
    if (!first || !first.includes(page.primary.toLowerCase())) fail(p, `first paragraph lacks primary keyword. Got: "${(first ?? '').slice(0, 90)}…"`)
  } else {
    // hub page: must not carry any other page's primary keyword in its H1
    for (const other of primaries) if (h1.includes(other.toLowerCase())) fail(p, `hub H1 contains "${other}" (hub must stay keyword-neutral)`)
  }

  // heading hierarchy: never skip a level going deeper
  let prev = 0
  $('h1,h2,h3,h4,h5,h6').each((_, el) => {
    const lvl = Number(el.tagName[1])
    if (prev && lvl > prev + 1) fail(p, `heading jumps h${prev} → h${lvl} ("${norm($(el).text()).slice(0, 40)}")`)
    prev = lvl
  })

  // images
  $('img').each((_, el) => {
    const alt = $(el).attr('alt')
    if (alt === undefined) fail(p, `<img src="${$(el).attr('src')}"> has no alt attribute`)
    // alt="" is correct for decorative images (e.g. menu thumbnails beside a text label)
    else if (alt && alt.length < 12) notes.push(`${p}  short alt "${alt}"`)
    if (!$(el).attr('width') || !$(el).attr('height')) fail(p, `<img src="${$(el).attr('src')}"> lacks width/height (layout shift)`)
  })

  // JSON-LD
  const ld = $('script[type="application/ld+json"]')
  if (!ld.length) fail(p, 'no JSON-LD')
  ld.each((_, el) => {
    try {
      const j = JSON.parse($(el).text())
      const graph = j['@graph'] ?? [j]
      if (!graph.some((n) => n['@type']?.toString().match(/Page$/) && n.url === `${SITE_URL}${p}`)) fail(p, 'JSON-LD has no WebPage node for this URL')
      if (p !== '/' && !graph.some((n) => n['@type'] === 'BreadcrumbList')) fail(p, 'JSON-LD lacks BreadcrumbList')
      // FAQPage markup is only valid if the same questions and answers are on the page itself (not just in JSON-LD)
      const body = norm($('body').clone().find('script,style,noscript').remove().end().text())
      for (const node of graph.filter((n) => n['@type'] === 'FAQPage')) {
        for (const q of node.mainEntity ?? []) {
          if (!body.includes(norm(q.name))) fail(p, `FAQ question not present in page content: "${q.name.slice(0, 50)}"`)
          if (!body.includes(norm(q.acceptedAnswer.text).slice(0, 80))) fail(p, `FAQ answer not present in page content: "${q.name.slice(0, 50)}"`)
        }
      }
    } catch (e) {
      fail(p, `JSON-LD is not valid JSON: ${e.message}`)
    }
  })

  // form + a11y basics
  $('input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, select').each((_, el) => {
    const id = $(el).attr('id')
    if (!id || !$(`label[for="${id}"]`).length) fail(p, `form control #${id ?? '(no id)'} has no <label for>`)
  })
  $('button').each((_, el) => {
    const t = norm($(el).text()) || $(el).attr('aria-label')
    if (!t) fail(p, 'a <button> has no accessible name')
  })
  if (!$('html').attr('lang')) fail(p, '<html> has no lang')
  if (!$('main#main').length) fail(p, 'no <main id="main">')
}

// 3. internal links ---------------------------------------------------------------------------------
const known = new Set(EXPECTED)
let linkCount = 0
for (const page of PAGES) {
  const $ = cheerio.load(pageHtml(page.path))
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href')
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || /^https?:\/\//.test(href)) return
    linkCount++
    const [pathname, hash] = href.split('#')
    const target = pathname === '' ? page.path : pathname
    if (!known.has(target) && !fs.existsSync(path.join(dist, target))) fail(page.path, `broken link ${href}`)
    if (hash && known.has(target) && !anchors.get(target)?.has(hash)) fail(page.path, `link ${href} → #${hash} does not exist on ${target}`)
  })
}

// 4. sitemap + robots -----------------------------------------------------------------------------
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
for (const p of EXPECTED) if (!sitemap.includes(`<loc>${SITE_URL}${p}</loc>`)) fail('sitemap.xml', `missing ${p}`)
if (!fs.readFileSync(path.join(dist, 'robots.txt'), 'utf8').includes('Sitemap:')) fail('robots.txt', 'no Sitemap line')
if (!fs.existsSync(path.join(dist, '404.html'))) fail('404.html', 'missing')

// report -------------------------------------------------------------------------------------------
console.log(`Checked ${PAGES.length} routes, ${linkCount} internal links, ${seenTitles.size} unique titles, ${seenH1.size} unique H1s.`)
if (notes.length) console.log('\nNotes:\n' + notes.map((n) => '  · ' + n).join('\n'))
if (failures.length) {
  console.error('\nFAILURES:\n' + failures.map((f) => '  ' + f).join('\n'))
  process.exit(1)
}
console.log('\nAll checks passed.')
