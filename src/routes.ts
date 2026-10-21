import { createElement, type ComponentType, type ReactElement } from 'react'
import { POSTS, listingPath, pageCount, postPath } from '@/content/blog'

export interface RouteDef {
  id: string
  path: string
  load: () => Promise<{ default: ComponentType }>
}

/** The exact URL set. Keep in sync with data/pages.ts (verified by scripts/verify-site.mjs). Blog routes come from content/blog. */
export const ROUTES: RouteDef[] = [
  { id: 'home', path: '/', load: () => import('@/pages/Home') },
  { id: 'features', path: '/features/', load: () => import('@/pages/Features') },
  { id: 'for-businesses', path: '/for-businesses/', load: () => import('@/pages/ForBusinesses') },
  { id: 'fashion-stores', path: '/for-businesses/fashion-stores/', load: () => import('@/pages/businesses/FashionStores') },
  { id: 'saree-ethnic-stores', path: '/for-businesses/saree-ethnic-stores/', load: () => import('@/pages/businesses/SareeEthnicStores') },
  { id: 'bridal-stores', path: '/for-businesses/bridal-stores/', load: () => import('@/pages/businesses/BridalStores') },
  { id: 'boutiques', path: '/for-businesses/boutiques/', load: () => import('@/pages/businesses/Boutiques') },
  { id: 'shopping-malls', path: '/for-businesses/shopping-malls/', load: () => import('@/pages/businesses/ShoppingMalls') },
  { id: 'events-exhibitions', path: '/for-businesses/events-exhibitions/', load: () => import('@/pages/businesses/EventsExhibitions') },
  { id: 'jewellery-stores', path: '/for-businesses/jewellery-stores/', load: () => import('@/pages/businesses/JewelleryStores') },
  { id: 'eyewear-stores', path: '/for-businesses/eyewear-stores/', load: () => import('@/pages/businesses/EyewearStores') },
  { id: 'use-cases', path: '/use-cases/', load: () => import('@/pages/UseCases') },
  { id: 'about', path: '/about/', load: () => import('@/pages/About') },
  { id: 'book-a-demo', path: '/book-a-demo/', load: () => import('@/pages/BookDemo') },
  { id: 'contact', path: '/contact/', load: () => import('@/pages/Contact') },
  // Blog: slash-less URLs. Articles share one page component and are generated from published content, so an
  // unknown or unpublished slug falls through to the 404 route.
  ...Array.from({ length: pageCount() }, (_, i) => ({ id: 'blog', path: listingPath(i + 1), load: () => import('@/pages/Blog') })),
  ...POSTS.map((p) => ({ id: 'blog-post', path: postPath(p.slug), load: () => import('@/pages/BlogPost') })),
]

export const NOT_FOUND_ROUTE: RouteDef = { id: '404', path: '*', load: () => import('@/pages/NotFound') }

const cache = new Map<string, ComponentType>()
const pending = new Map<string, Promise<void>>()

const find = (path: string) => ROUTES.find((r) => r.path === path)

/** Load (and cache) the page component for a path. Used before hydration and by the prerenderer. */
export function loadRoute(path: string): Promise<void> {
  const r = find(path) ?? NOT_FOUND_ROUTE
  if (cache.has(r.id)) return Promise.resolve()
  let p = pending.get(r.id)
  if (!p) {
    p = r.load().then((m) => {
      cache.set(r.id, m.default)
    })
    pending.set(r.id, p)
  }
  return p
}

/** Synchronous when cached; otherwise suspends until the chunk arrives. */
export function routeElement(route: RouteDef): ReactElement {
  const hit = cache.get(route.id)
  if (hit) return createElement(hit)
  throw loadRoute(route.path === '*' ? '/__404__' : route.path)
}
