import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App'
import { PAGES, NOT_FOUND_META, pageByPath } from './data/pages'
import { SITE, absoluteUrl } from './data/site'
import { headTags, headToString } from './lib/seo'
import { loadRoute } from './routes'

/** Prerender one route to an HTML string (body only). */
export async function render(path: string): Promise<string> {
  await loadRoute(path)
  return renderToString(
    <StaticRouter location={path}>
      <App />
    </StaticRouter>,
  )
}

/**
 * Head markup for a route — identical to what the client writes on navigation. The hero image's preload hint is not
 * written here: React emits it automatically from the <img fetchPriority="high"> itself, so it can never disagree
 * with the image's own srcset/sizes (a hand-written copy duplicated it).
 */
export function head(path: string, opts: { noindex?: boolean } = {}): string {
  const meta = pageByPath(path)
  return headToString(headTags(meta ?? NOT_FOUND_META, { noindex: opts.noindex ?? !meta }))
}

export const paths = () => PAGES.map((p) => p.path)
export const pages = () => PAGES
export const siteUrl = () => SITE.url

export function sitemap(): string {
  const today = new Date().toISOString().slice(0, 10)
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${absoluteUrl(p.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`,
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

export const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`
