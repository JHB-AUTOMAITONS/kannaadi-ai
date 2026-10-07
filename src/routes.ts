import { createElement, type ComponentType, type ReactElement } from 'react'

export interface RouteDef {
  id: string
  path: string
  load: () => Promise<{ default: ComponentType }>
}

/** The exact URL set. Keep in sync with data/pages.ts (verified by scripts/verify-site.mjs). */
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
