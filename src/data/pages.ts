import { BUSINESSES } from './businesses'

export type SchemaKind = 'home' | 'collection' | 'about' | 'contact' | 'web' | 'service'

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
  preloadHero?: boolean
}

const core: PageMeta[] = [
  {
    path: '/',
    name: 'Home',
    title: 'Virtual Try On for Fashion & Retail | Kannaadi.Ai',
    description:
      'Kannaadi.Ai delivers AI virtual try on for fashion and retail — a virtual fitting room for online stores, in-store kiosks and events. Book a demo.',
    primary: 'virtual try on',
    secondary: ['AI virtual try on', 'virtual fitting room', 'virtual try on clothes'],
    schema: 'home',
    priority: 1,
    changefreq: 'weekly',
    preloadHero: true,
  },
  {
    path: '/features/',
    name: 'Features',
    title: 'AI Fashion Technology: Try-On, Looks & Kiosks | Kannaadi.Ai',
    description:
      "Explore Kannaadi.Ai's AI fashion technology: virtual try-on, an AI outfit generator, dress upload and scan, kiosks, jewellery and eyewear try-on.",
    primary: 'AI fashion technology',
    secondary: ['AI outfit generator', 'fashion AI', 'AI fashion tools'],
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
    title: 'Virtual Try On for Fashion Stores | Kannaadi.Ai',
    description:
      "Bring virtual try on for fashion stores to the shop floor and your online catalogue. Kannaadi.Ai's AI try-on helps shoppers see looks before they buy.",
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

export const PAGES: PageMeta[] = [...core, ...industries]

export const pageByPath = (path: string) => PAGES.find((p) => p.path === path)

/** Normalise a location pathname to the canonical trailing-slash form. */
export const normalizePath = (pathname: string) => {
  const p = pathname.toLowerCase().replace(/\/+/g, '/')
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
