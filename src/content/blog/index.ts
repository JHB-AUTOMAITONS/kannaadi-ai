import type { BlogPost } from './types'
import { post as virtualFittingRoomTechnology } from './virtual-fitting-room-technology'
import { post as virtualTryOnClothesIndia } from './virtual-try-on-clothes-india'

export type { BlogPost, Block } from './types'

/**
 * Register new articles here. Order does not matter: the list is sorted newest first.
 * Drafts are exposed only by the dev server; production builds contain published articles exclusively.
 */
const ALL: BlogPost[] = [virtualTryOnClothesIndia, virtualFittingRoomTechnology]

export const BLOG_BASE = '/blog'
export const PAGE_SIZE = 9
const INCLUDE_DRAFTS = import.meta.env.DEV

export const POSTS: BlogPost[] = ALL.filter((p) => p.status === 'published' || INCLUDE_DRAFTS).sort((a, b) =>
  a.publishedAt < b.publishedAt ? 1 : a.publishedAt > b.publishedAt ? -1 : 0,
)

export const postPath = (slug: string) => `${BLOG_BASE}/${slug}`
export const postBySlug = (slug: string) => POSTS.find((p) => p.slug === slug)
export const postByPath = (path: string) => POSTS.find((p) => postPath(p.slug) === path)

/** Number of listing pages (always ≥ 1; page 1 is /blog, later pages are /blog/page/N). */
export const pageCount = () => Math.max(1, Math.ceil(POSTS.length / PAGE_SIZE))
export const listingPath = (n: number) => (n <= 1 ? BLOG_BASE : `${BLOG_BASE}/page/${n}`)

export const wordCount = (p: BlogPost) =>
  p.blocks
    .flatMap((b) => ('items' in b ? b.items : [b.type === 'callout' ? `${b.title} ${b.text}` : b.text]))
    .join(' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .split(/\s+/)
    .filter(Boolean).length

export const readingMinutes = (p: BlogPost) => Math.max(1, Math.round(wordCount(p) / 200))

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
