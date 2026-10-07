# Kannaadi.Ai

AI virtual try-on for fashion and retail. React 19 + TypeScript + Vite 8 + Tailwind CSS 4 + shadcn/ui, with GSAP
for motion and a canvas-based organic reveal as the signature hero interaction.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check → client bundle → SSR bundle → prerender every route
npm run verify     # SEO / a11y / link audit of the prerendered site (needs a build first)
npm run lint       # oxlint
npm run preview    # serve the production build locally
npm run art        # regenerate every procedural image into public/images
```

Configuration lives in environment variables — see [.env.example](.env.example). **Set `VITE_SITE_URL` and
`VITE_FORM_ENDPOINT` before releasing.**

## Routes (fixed)

`/` · `/features/` · `/for-businesses/` · `/for-businesses/{fashion-stores, saree-ethnic-stores, bridal-stores,
boutiques, shopping-malls, events-exhibitions, jewellery-stores, eyewear-stores}/` · `/use-cases/` · `/about/` ·
`/book-a-demo/` · `/contact/`

`src/data/pages.ts` is the single source of truth for every URL: title, description, primary + secondary keywords,
schema type, sitemap priority. `scripts/verify-site.mjs` asserts the route set and the primary-keyword mapping
against the SEO brief, so drift fails the build check.

## How the site is built

```
src/
  components/
    hero/         HomeHero, RevealStage (two aligned images + canvas mask), RevealCursor, backdrop type
    layout/       SiteLayout (SEO sync, scroll restoration), Footer, LazyPage
    navigation/   Header, mega menu, animated mobile menu
    sections/     page sections (home, features, industry heroes, FAQ, CTA …)
    forms/        LeadForm (demo + contact), Field
    animations/   Magnetic
    ui/           Cta, Logo, SectionHeading, Marquee, shadcn (accordion, button), skiper-ui/skiper40
  pages/          one folder per route; businesses/<Industry>/ each have their own module
  data/           site config, pages (SEO), businesses, features, FAQs
  hooks/ lib/ styles/
scripts/          art generators, prerender, verifier
public/images/    generated WebP artwork (stable URLs so the hero can be preloaded)
```

### Rendering & SEO

`npm run build` prerenders all 15 routes (plus `404.html`, `sitemap.xml`, `robots.txt`) so crawlers and link
previews get full HTML and metadata without running JavaScript; the client then hydrates. Every page gets a unique
title and description, a canonical URL, Open Graph + Twitter tags, JSON-LD (`Organization`, `WebSite`, page type,
`BreadcrumbList`, `Service`/`SoftwareApplication`/`ItemList`/`FAQPage` where relevant) and exactly one `<h1>` that
contains its primary keyword. The same head model (`src/lib/seo.ts`) is used by the prerenderer and by client-side
navigation. Deploy `dist/` to any static host and serve `404.html` for unknown URLs.

### The hero reveal

`src/lib/reveal-engine.ts` + `src/components/hero/RevealStage.tsx`

* Image 1 is a plain `<img>` and is never transformed. Image 2 exists only as pixels drawn onto a `<canvas>` through
  a mask, using the same `object-fit: cover` math — the focal point is read from the image's computed
  `object-position`, so both layers stay aligned at every size.
* The mask is a closed Catmull-Rom spline through ten control points whose radii wobble on independent sine pairs
  (asymmetric, continuously morphing). The centre follows the pointer through a lagging low-pass; speed stretches the
  blob along its travel and spawns two small trailing droplets; the edge is feathered with `shadowBlur`.
* Each frame repaints only a dirty rectangle, and the loop stops when the reveal has shrunk away, so idle cost is zero.
* Mouse, pen and touch share one path (`pointer*` events). Touch uses `touch-action: pan-y`, so a vertical swipe still
  scrolls the page. Keyboard users get a scripted pass (“Play the AI scan reveal”). With reduced motion the blob is
  static (still asymmetric) and does not wobble.
* The hero copy is blended with `mix-blend-mode: difference`, so it flips ink ↔ ivory as the dark layer passes beneath.

### Design system

Warm ivory / ink / graphite / stone plus one accent, **lumen** `#d5ff4f`, reserved for interaction, CTAs, AI
indicators and the reveal. Lumen is only ever a fill with ink text on light surfaces (it fails contrast as text on
ivory). Sections switch the whole token set with `.theme-dark` / `.theme-sand` / `.theme-light`, so shadcn components
adapt automatically. Type: Inter Tight (UI/headings), Instrument Serif italic (emphasis), JetBrains Mono (labels).

### Skiper40

`npx shadcn add @skiper-ui/skiper40` installs a set of animated link variants. They are adapted in
`src/components/ui/skiper-ui/skiper40.tsx` (Next.js `Link` → React Router, shared anchor, demo removed) and used
selectively: `Link000` for inline/footer links, `Link002` for standalone “more” links, `Link005` for the mega-menu
rows. Upstream licence: free with attribution — kept in the file header and credited in the footer.

### Imagery

All artwork is **procedural** (`scripts/art/*`): one shaded 3D surface model rendered twice — a clean studio still and
an AI-scan version — so each pair is pixel-aligned by construction. It is deliberately a stand-in for real
photography. To swap in real photos, replace the files in `public/images/**` keeping the same names and dimensions
(clean and AI versions must stay aligned) — no code changes needed.

### Forms

`LeadForm` validates client-side, shows loading / success / error states and POSTs JSON to `VITE_FORM_ENDPOINT`.
The success panel only appears after the endpoint confirms. Without an endpoint the form reports that delivery isn’t
set up; it never fakes a send.
