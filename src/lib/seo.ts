import { BUSINESSES } from '@/data/businesses'
import { faqFor } from '@/data/faqs'
import { FEATURES } from '@/data/features'
import { pageByPath, type PageMeta } from '@/data/pages'
import { SITE, absoluteUrl } from '@/data/site'

/**
 * Head model shared by the build-time prerenderer (string output) and the client (DOM sync),
 * so a prerendered page and a client-side navigation always carry identical metadata.
 */
export interface HeadTag {
  tag: 'title' | 'meta' | 'link' | 'script'
  attrs?: Record<string, string>
  text?: string
}

const ORG_ID = `${SITE.url}/#organization`
const SITE_ID = `${SITE.url}/#website`

const organization = () => ({
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE.name,
  url: `${SITE.url}/`,
  logo: absoluteUrl('/favicon.svg'),
  description:
    'Kannaadi.Ai is a fashion technology company building AI-powered virtual try-on and digital fashion experiences for retail.',
})

const website = () => ({
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: `${SITE.url}/`,
  name: SITE.name,
  inLanguage: SITE.locale,
  publisher: { '@id': ORG_ID },
})

const trail = (meta: PageMeta): PageMeta[] => {
  const out: PageMeta[] = []
  let cur: PageMeta | undefined = meta
  while (cur) {
    out.unshift(cur)
    cur = cur.parent ? pageByPath(cur.parent) : undefined
  }
  return out
}

const breadcrumb = (meta: PageMeta) => ({
  '@type': 'BreadcrumbList',
  '@id': `${absoluteUrl(meta.path)}#breadcrumb`,
  itemListElement: trail(meta).map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.name,
    item: absoluteUrl(p.path),
  })),
})

const pageType: Record<PageMeta['schema'], string> = {
  home: 'WebPage',
  collection: 'CollectionPage',
  about: 'AboutPage',
  contact: 'ContactPage',
  web: 'WebPage',
  service: 'WebPage',
}

function structuredData(meta: PageMeta): object {
  const url = absoluteUrl(meta.path)
  const graph: object[] = [organization(), website()]

  const page: Record<string, unknown> = {
    '@type': pageType[meta.schema],
    '@id': `${url}#webpage`,
    url,
    name: meta.title,
    description: meta.description,
    inLanguage: SITE.locale,
    isPartOf: { '@id': SITE_ID },
    primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(SITE.ogImage) },
  }
  if (meta.path !== '/') page.breadcrumb = { '@id': `${url}#breadcrumb` }
  graph.push(page)
  if (meta.path !== '/') graph.push(breadcrumb(meta))

  if (meta.schema === 'home') {
    graph.push({
      '@type': 'SoftwareApplication',
      '@id': `${SITE.url}/#software`,
      name: 'Kannaadi.Ai virtual try on',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description: 'AI virtual try on and virtual fitting room software for fashion and retail businesses.',
      publisher: { '@id': ORG_ID },
    })
  }

  if (meta.path === '/features/') {
    graph.push({
      '@type': 'ItemList',
      name: 'Kannaadi.Ai features',
      itemListElement: FEATURES.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: f.title,
        url: `${url}#${f.id}`,
      })),
    })
  }

  if (meta.path === '/for-businesses/') {
    graph.push({
      '@type': 'ItemList',
      name: 'Business types',
      itemListElement: BUSINESSES.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        url: absoluteUrl(b.path),
      })),
    })
  }

  if (meta.schema === 'service' && meta.primary) {
    const b = BUSINESSES.find((x) => x.slug === meta.business)
    graph.push({
      '@type': 'Service',
      '@id': `${url}#service`,
      name: meta.primary.charAt(0).toUpperCase() + meta.primary.slice(1),
      serviceType: 'AI virtual try on',
      provider: { '@id': ORG_ID },
      audience: { '@type': 'BusinessAudience', name: b?.name ?? meta.name },
      url,
    })
  }

  const faq = faqFor(meta.path)
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${url}#faq`,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

/** Every head element a page needs. All carry data-seo so the client can replace them in place. */
export function headTags(meta: PageMeta, opts: { noindex?: boolean } = {}): HeadTag[] {
  const url = absoluteUrl(meta.path)
  const image = absoluteUrl(SITE.ogImage)
  const tags: HeadTag[] = [
    { tag: 'title', text: meta.title },
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'robots', content: opts.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large' } },
    { tag: 'link', attrs: { rel: 'canonical', href: url } },
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE.name } },
    { tag: 'meta', attrs: { property: 'og:locale', content: 'en_US' } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: image } },
    { tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
    { tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
    { tag: 'meta', attrs: { property: 'og:image:alt', content: SITE.ogImageAlt } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: image } },
    { tag: 'meta', attrs: { name: 'twitter:image:alt', content: SITE.ogImageAlt } },
  ]
  if (!opts.noindex) {
    tags.push({ tag: 'script', attrs: { type: 'application/ld+json' }, text: JSON.stringify(structuredData(meta)) })
  }
  return tags
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

/** Serialise for the prerenderer. JSON-LD is escaped so it can never close its own <script>. */
export function headToString(tags: HeadTag[]): string {
  return tags
    .map((t) => {
      const attrs = Object.entries(t.attrs ?? {})
        .map(([k, v]) => ` ${k}="${esc(v)}"`)
        .join('')
      if (t.tag === 'title') return `<title data-seo>${esc(t.text ?? '')}</title>`
      if (t.tag === 'script') return `<script data-seo${attrs}>${(t.text ?? '').replace(/</g, '\\u003c')}</script>`
      return `<${t.tag} data-seo${attrs}>`
    })
    .join('\n    ')
}

/** Client-side: swap the data-seo head elements for the new route's. */
export function applyHead(tags: HeadTag[]) {
  const head = document.head
  head.querySelectorAll('[data-seo]').forEach((n) => n.remove())
  for (const t of tags) {
    const el = document.createElement(t.tag)
    el.setAttribute('data-seo', '')
    for (const [k, v] of Object.entries(t.attrs ?? {})) el.setAttribute(k, v)
    if (t.text != null) el.textContent = t.text
    head.appendChild(el)
  }
}

