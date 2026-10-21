/**
 * Blog content model. Articles live in this repository as typed modules (no CMS, no database): git is the editor,
 * a pull request is the review, and merging is the publish. See "Blog" in README.md for the full lifecycle.
 *
 * Inline text supports `[label](/internal-or-https-url)` links and `**bold**` only.
 */
export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; id: string; text: string }
  | { type: 'h3'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'callout'; title: string; text: string }

export interface BlogImage {
  /** 1200×630 JPEG — used for Open Graph / Twitter cards and as the schema image */
  og: string
  /** Page image (WebP) with intrinsic size, so the layout never shifts */
  src: string
  width: number
  height: number
  /** Smaller rendition for cards */
  card: { src: string; width: number }
  alt: string
}

export interface BlogPost {
  /** URL slug: the article lives at /blog/{slug}. Lowercase, hyphenated, never "page". */
  slug: string
  /** `draft` articles are visible only in `npm run dev` (noindex) and are never prerendered, listed or in the sitemap. */
  status: 'draft' | 'published'
  /** <title> — include the brand suffix */
  title: string
  /** Meta description */
  description: string
  /** The single visible H1 */
  h1: string
  /** Short summary for cards */
  excerpt: string
  category: string
  /** ISO date (YYYY-MM-DD). Only a genuine date. */
  publishedAt: string
  /** ISO date. Set only when the article is meaningfully updated. */
  modifiedAt?: string
  author: { name: string; url?: string }
  image: BlogImage
  primaryKeyword: string
  secondaryKeywords: string[]
  /** Slugs of related articles, shown under the article when published */
  related?: string[]
  blocks: Block[]
}
