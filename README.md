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
npm run art        # regenerate the procedural placeholder art into public/images
npm run photos     # build model photography from assets-src/photos (see below)
npm run photos:tryon      # compose the hero try-on pair from assets-src/photos/hero-tryon
npm run photos:cta        # build the transparent model for the closing "Book a demo" card
npm run photos:generate   # generate missing slot photos with FLUX.1-schnell (set HF_TOKEN for more quota)
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
* **The whole hero is the reveal surface, and the background lettering takes part.** On the home hero `RevealStage`
  is given `reachAll`: a mouse or pen drives the reveal from anywhere inside the hero, not just over the image (on wide
  screens the image box is narrower than the hero, which used to leave dead bands at the edges). Touch keeps the image
  as its surface, so a scroll that starts on the copy stays calm. Coordinates stay relative to the image, so the image
  layer is untouched. There is still one engine, one pointer and one mask: the engine publishes the exact blob it draws
  (`onShape`), and `src/lib/words-reveal.ts` draws the lettering's revealed state through it on a canvas inside the
  `HeroBackdropWords` layer — same stacking, multiply blend and silhouette mask as the resting words. Each word is
  drawn where the real element is right now (measured every frame, parallax included), only inside the blob's bounds.
  It needs canvas `letterSpacing` and font metrics; without them the lettering simply has no revealed state.

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

### Imagery — model photography

The site's visual identity is realistic South Indian fashion photography with an AI layer underneath. Every photo
slot (hero, the eight business pages, four saree-look colourways) is defined in
[scripts/photos/manifest.mjs](scripts/photos/manifest.mjs) with its art-direction prompt, size and alt text;
[assets-src/photos/PROMPTS.md](assets-src/photos/PROMPTS.md) lists them ready to paste into an image generator.

1. Generate a photo and save it as `assets-src/photos/<slot>.jpg` (optionally a `<slot>.json` with the face box).
2. `npm run photos` crops and compresses it, **derives Image 2 (the AI layer) from the photo's own pixels** — so the
   reveal is always the same woman, pose and crop, aligned to the pixel — writes `public/images/models/<folder>/…`
   and updates `src/data/photos.generated.ts`.
3. `npm run build`. Pages switch from placeholder to photo slot by slot; the hero preload and social card follow.

**Home hero = a try-on pair.** The hero uses two cut-out photos of the *same* model (transparent backgrounds) in
`assets-src/photos/hero-tryon/`: `casual.png` (what visitors see) and `saree.png` (revealed under the pointer, so she
"tries on" the saree). `align.json` holds both pupils in each photo; `npm run photos:tryon` aligns them with a
similarity transform, places both on one shared studio backdrop, and writes `hero.png`, `hero.ai.png`, `hero.mask.png`
(her silhouette — the large background lettering is cut away around her on desktop) and `hero.json` (reveal wording).
Then run `npm run photos` as usual. Without `hero-tryon` sources, drop a single `hero.png` and Image 2 is derived.
`npm run photos:generate` can create missing slot sources with FLUX.1-schnell (Apache-2.0) — set `HF_TOKEN` for quota.

**Closing "Book a demo" card.** `ConversionCard` shows the same woman from `hero-tryon/saree.png`, in her natural
colours (no filter, tint or blend mode): `npm run photos:cta` adds transparent headroom above her hair and writes three
sizes to `public/images/models/cta/`. She is anchored flush to the card's right and bottom edges, because the cut-out
runs off both; warm gold light sits behind her in CSS so dark hair keeps its outline against the charcoal.

Until a slot has a photo, the site shows the procedural placeholder art (`scripts/art`, `npm run art`).

### Forms

`LeadForm` validates client-side, shows loading / success / error states and POSTs JSON to `VITE_FORM_ENDPOINT`.
The success panel only appears after the endpoint confirms. Without an endpoint the form reports that delivery isn’t
set up; it never fakes a send.
