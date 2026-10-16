/**
 * Manual GA4 page_view for client-side navigations. The gtag snippet in index.html is configured with
 * `send_page_view: false`, so this is the only place a page_view is ever sent — called once per route
 * change (including the first load) from SiteLayout — which keeps SPA navigation from double-counting
 * against gtag's own automatic pageview.
 */
export function trackPageview(path: string, title: string) {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag
  gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  })
}
