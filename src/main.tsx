import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './styles/global.css'
import App from './App'
import { normalizePath } from './data/pages'
import { ROUTES, loadRoute } from './routes'

const container = document.getElementById('root')!
const tree = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

const path = normalizePath(window.location.pathname)
const isKnown = ROUTES.some((r) => r.path === path)

// Resolve the current route's chunk first so hydration is synchronous and matches the prerendered HTML.
await loadRoute(path)

// Hydrate only when the server HTML is for this very route. Unknown URLs can be answered with another page's
// HTML by SPA-style hosts, so those render from scratch rather than hydrating a mismatched tree.
if (container.firstElementChild && isKnown) {
  hydrateRoot(container, tree)
} else {
  container.replaceChildren()
  createRoot(container).render(tree)
}
