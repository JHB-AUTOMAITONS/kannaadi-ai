import { BLOG_BASE, POSTS, listingPath, pageCount, postPath, type BlogPost } from '@/content/blog'
import { BUSINESSES } from './businesses'

export type SchemaKind = 'home' | 'collection' | 'about' | 'contact' | 'web' | 'service' | 'blog' | 'article'

/**
 * Single source of truth for every indexable URL: SEO fields, primary keyword mapping,
 * and sitemap/prerender targets. Keep paths lowercase, hyphenated and trailing-slashed.
 */
export interface PageMeta {
  path: string
  /** Short name (breadcrumbs, schema) */
  name: string
  title: string
  description: string
  /** Primary keyword. `null` for the hub page, which deliberately has none. */
  primary: string | null
  secondary: string[]
  schema: SchemaKind
  priority: number
  changefreq: 'weekly' | 'monthly'
  /** Parent path for breadcrumbs */
  parent?: string
  /** Industry slug if this is a business page */
  business?: string
  /** Blog article behind this page (schema `article`) */
  post?: BlogPost
  /** Blog listing page number (schema `blog`) */
  listingPage?: number
  /** Emit `noindex` (draft articles previewed in dev) */
  noindex?: boolean
  /** ISO date for the sitemap <lastmod>; defaults to the build date */
  lastmod?: string
}

const core: PageMeta[] = [
  {
    path: '/',
    name: 'Home',
    title: 'AI Virtual Try On for Fashion & Retail | Kannaadi.Ai',
    description:
      'Kannaadi.Ai is AI virtual try on software for fashion and retail: a virtual fitting room for online stores, in-store kiosks and events. Book a demo.',
    primary: 'virtual try on',
    secondary: ['AI virtual try on', 'virtual fitting room', 'virtual try on clothes'],
    schema: 'home',
    priority: 1,
    changefreq: 'weekly',
  },
  {
    path: '/features/',
    name: 'Features',
    title: 'AI Virtual Try-On Features: Looks, Kiosks & More | Kannaadi.Ai',
    description:
      'AI virtual try-on features from Kannaadi.Ai: try-on on the shopper, AI outfit generator, upload or scan a dress, kiosk, lucky draw, jewellery and eyewear try-on.',
    primary: 'AI virtual try-on features',
    secondary: ['virtual try-on software features', 'virtual fitting room features', 'AI outfit generator'],
    schema: 'collection',
    priority: 0.9,
    changefreq: 'monthly',
    parent: '/',
  },
  {
    path: '/for-businesses/',
    name: 'For Businesses',
    title: 'Solutions for Fashion & Retail Businesses | Kannaadi.Ai',
    description:
      'Fashion stores, saree and ethnic wear, bridal, boutiques, malls, events, jewellery and eyewear — find the Kannaadi.Ai try-on experience for your business type.',
    primary: null,
    secondary: [],
    schema: 'collection',
    priority: 0.8,
    changefreq: 'monthly',
    parent: '/',
  },
  {
    path: '/use-cases/',
    name: 'Use Cases',
    title: 'Virtual Try On for Ecommerce: Use Cases | Kannaadi.Ai',
    description:
      'See where virtual try on for ecommerce fits: online fashion shopping, product discovery, customer confidence and engagement. A practical look at the use cases.',
    primary: 'virtual try on for ecommerce',
    secondary: ['AI shopping experience', 'digital fashion experience', 'ecommerce fashion technology'],
    schema: 'web',
    priority: 0.8,
    changefreq: 'monthly',
    parent: '/',
  },
  {
    path: '/about/',
    name: 'About',
    title: 'Fashion Technology Company | About Kannaadi.Ai',
    description:
      'Kannaadi.Ai is a fashion technology company building AI-powered virtual try-on and digital fashion experiences for retail and ecommerce.',
    primary: 'fashion technology company',
    secondary: ['AI fashion company', 'fashion technology', 'fashion innovation'],
    schema: 'about',
    priority: 0.6,
    changefreq: 'monthly',
    parent: '/',
  },
  {
    path: '/book-a-demo/',
    name: 'Book a Demo',
    title: 'Virtual Try On Software Demo | Book a Demo | Kannaadi.Ai',
    description:
      "Book a demo of Kannaadi.Ai's virtual try on software. See AI fashion software, virtual fitting room features and kiosks working with your products.",
    primary: 'virtual try on software',
    secondary: ['AI fashion software', 'virtual fitting room software', 'fashion technology demo'],
    schema: 'web',
    priority: 0.9,
    changefreq: 'monthly',
    parent: '/',
  },
  {
    path: '/contact/',
    name: 'Contact',
    title: 'Virtual Try On Company: Contact Kannaadi.Ai',
    description:
      'Contact Kannaadi.Ai, a virtual try on company and AI fashion company. Ask about virtual fitting room projects, partnerships or demos.',
    primary: 'virtual try on company',
    secondary: ['AI fashion company', 'fashion technology company', 'virtual fitting room company'],
    schema: 'contact',
    priority: 0.5,
    changefreq: 'monthly',
    parent: '/',
  },
]

const industryCopy: Record<string, { title: string; description: string; secondary: string[] }> = {
  'fashion-stores': {
    title: 'AI Virtual Try On for Fashion Stores | Kannaadi.Ai',
    description:
      'AI virtual try on for fashion stores: a virtual fitting room for the shop floor and your online catalogue, with kiosk, scan-a-dress and AI Looks. Book a Kannaadi.Ai demo.',
    secondary: ['AI try-on for retail', 'virtual fitting room', 'fashion retail technology'],
  },
  'saree-ethnic-stores': {
    title: 'Virtual Try On Saree for Ethnic Wear Stores | Kannaadi.Ai',
    description:
      'Virtual try on saree experiences for saree and ethnic stores — preview drape, border and pallu on the shopper before purchase. Book a Kannaadi.Ai demo.',
    secondary: ['saree try on', 'ethnic wear virtual try on', 'virtual saree draping'],
  },
  'bridal-stores': {
    title: 'Virtual Try On Wedding Dresses for Bridal Stores | Kannaadi.Ai',
    description:
      'Let brides explore silhouettes with virtual try on wedding dresses — before and between appointments. AI try-on for bridal stores by Kannaadi.Ai.',
    secondary: ['bridal gown try on', 'wedding dress visualiser', 'bridal store technology'],
  },
  boutiques: {
    title: 'Virtual Try On for Boutiques | Kannaadi.Ai',
    description:
      'Virtual try on for boutiques: give curated collections a digital fitting room that keeps the personal touch. Explore AI try-on from Kannaadi.Ai.',
    secondary: ['boutique technology', 'digital fitting room', 'AI styling for boutiques'],
  },
  'shopping-malls': {
    title: 'Virtual Fitting Room In Store for Malls | Kannaadi.Ai',
    description:
      'A virtual fitting room in store for shopping malls and flagships — a walk-up kiosk try-on experience for shoppers. Book a Kannaadi.Ai demo.',
    secondary: ['virtual fitting room kiosk', 'mall kiosk experience', 'in-store AI try on'],
  },
  'events-exhibitions': {
    title: 'Brand Activation Marketing with AI Try-On | Kannaadi.Ai',
    description:
      'Brand activation marketing built around a live virtual try on: kiosks, AI looks and lucky-draw moments for exhibitions, pop-ups and launches.',
    secondary: ['experiential marketing', 'exhibition engagement', 'event try-on kiosk'],
  },
  'jewellery-stores': {
    title: 'Virtual Try On Jewellery for Jewellery Stores | Kannaadi.Ai',
    description:
      'Virtual try on jewellery — necklaces, earrings and more — shown on the customer in real time. AI jewellery try-on for stores, by Kannaadi.Ai.',
    secondary: ['jewellery try on', 'necklace try on', 'AI jewellery visualisation'],
  },
  'eyewear-stores': {
    title: 'Virtual Try On Eyewear for Optical Stores | Kannaadi.Ai',
    description:
      'Virtual try on eyewear: let shoppers compare frames on their own face in store or online. AI eyewear try-on for optical stores from Kannaadi.Ai.',
    secondary: ['glasses try on', 'virtual frame fitting', 'optical store technology'],
  },
}

const industries: PageMeta[] = BUSINESSES.map((b) => ({
  path: b.path,
  name: b.name,
  title: industryCopy[b.slug].title,
  description: industryCopy[b.slug].description,
  primary: b.keyword,
  secondary: industryCopy[b.slug].secondary,
  schema: 'service',
  priority: 0.7,
  changefreq: 'monthly',
  parent: '/for-businesses/',
  business: b.slug,
}))

/**
 * Blog URLs are deliberately slash-less (/blog, /blog/{slug}); every other page keeps its trailing slash.
 * Keywords: the listing has no primary keyword (like the hub page); each article owns one (see content/blog).
 */
const blogListing: PageMeta[] = Array.from({ length: pageCount() }, (_, i) => {
  const n = i + 1
  return {
    path: listingPath(n),
    name: n === 1 ? 'Blog' : `Blog, page ${n}`,
    title: n === 1 ? 'Blog: Fashion Retail Technology Guides | Kannaadi.Ai' : `Blog, page ${n} | Kannaadi.Ai`,
    description:
      'Guides and insights on virtual try on, AI fashion technology and the shopping experience for fashion retailers, from the Kannaadi.Ai team.',
    primary: null,
    secondary: [],
    schema: 'blog' as const,
    priority: n === 1 ? 0.7 : 0.4,
    changefreq: 'weekly' as const,
    parent: n === 1 ? '/' : BLOG_BASE,
    listingPage: n,
    lastmod: POSTS[0]?.modifiedAt ?? POSTS[0]?.publishedAt,
  }
})

const articles: PageMeta[] = POSTS.map((post) => ({
  path: postPath(post.slug),
  name: post.h1.length > 48 ? post.title.split(' | ')[0] : post.h1,
  title: post.title,
  description: post.description,
  primary: post.primaryKeyword,
  secondary: post.secondaryKeywords,
  schema: 'article' as const,
  priority: 0.6,
  changefreq: 'monthly' as const,
  parent: BLOG_BASE,
  post,
  noindex: post.status !== 'published',
  lastmod: post.modifiedAt ?? post.publishedAt,
}))

export const isBlogPath = (path: string) => path === BLOG_BASE || path.startsWith(`${BLOG_BASE}/`)

export const SITE_PAGES: PageMeta[] = [...core, ...industries]
export const BLOG_PAGES: PageMeta[] = [...blogListing, ...articles]
export const PAGES: PageMeta[] = [...SITE_PAGES, ...BLOG_PAGES]

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path)

/** Normalise a location pathname to its canonical form: trailing slash everywhere except under /blog. */
export const normalizePath = (pathname: string) => {
  const p = pathname.toLowerCase().replace(/\/+/g, '/')
  if (isBlogPath(p.replace(/\/$/, ''))) return p.replace(/\/$/, '')
  return p.endsWith('/') ? p : `${p}/`
}

export const NOT_FOUND_META: PageMeta = {
  path: '/404/',
  name: 'Page not found',
  title: 'Page not found | Kannaadi.Ai',
  description: 'The page you were looking for does not exist. Head back to Kannaadi.Ai.',
  primary: null,
  secondary: [],
  schema: 'web',
  priority: 0,
  changefreq: 'monthly',
}
