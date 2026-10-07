import { routeElement, type RouteDef } from '@/routes'

/** Renders a route's page. Suspends (inside SiteLayout's boundary) only on client navigations to a chunk not yet loaded. */
export function LazyPage({ route }: { route: RouteDef }) {
  return routeElement(route)
}
