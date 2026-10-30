export interface Faq {
  q: string
  a: string
}

export interface Business {
  slug: string
  path: string
  /** Label used in navigation and cards */
  name: string
  /** One-line card description */
  blurb: string
  /** Larger card sentence */
  card: string
  /** Primary SEO keyword for the page (see data/pages.ts) */
  keyword: string
  /** Image base: `${image}-clean.webp` / `${image}-ai.webp` */
  image: string
  imageAlt: string
  /** Short label for the experience, shown on cards */
  tag: string
  faq: Faq[]
}

const img = (slug: string) => `/images/industry/${slug}`

export const BUSINESSES: Business[] = [
  {
    slug: 'fashion-stores',
    path: '/for-businesses/fashion-stores/',
    name: 'Fashion Stores',
    blurb: 'Try-on on the shop floor and the online catalogue.',
    card: 'Bring a digital fitting room to the shop floor and across your online catalogue.',
    keyword: 'virtual try on for fashion stores',
    image: img('fashion-stores'),
    imageAlt: 'Clothing rail and mannequin in a fashion store, with the AI scan of the same scene revealed on hover',
    tag: 'Fashion retail',
    faq: [
      {
        q: 'How does virtual try on work in a fashion store?',
        a: 'A shopper picks a garment — for example by scanning it at the rail — and Kannaadi.Ai shows it on them using AI, through a kiosk or screen on the shop floor or on your online store. The setup for your catalogue and channels is agreed in a demo.',
      },
      {
        q: 'Does it replace the fitting room?',
        a: 'No. It helps shoppers narrow down what to try physically, so the fitting room is used for the pieces they already like.',
      },
      {
        q: 'Can it run in store and online?',
        a: 'Yes — the same virtual try-on software is designed to work across kiosks, in-store screens and ecommerce, so customers get one consistent experience.',
      },
    ],
  },
  {
    slug: 'saree-ethnic-stores',
    path: '/for-businesses/saree-ethnic-stores/',
    name: 'Saree & Ethnic Stores',
    blurb: 'Preview drape, border and pallu on the shopper.',
    card: 'Let shoppers see the drape, the border and the pallu on themselves before a single saree is unfolded.',
    keyword: 'virtual try on saree',
    image: img('saree-ethnic-stores'),
    imageAlt: 'Draped saree with a gold zari border on a form, with its AI scan revealed on hover',
    tag: 'Ethnic fashion',
    faq: [
      {
        q: 'What does virtual try on saree actually show?',
        a: 'It shows a preview of the saree on the shopper — its colour, border, pallu and overall drape — so they can compare options before staff unfold and drape each one. It is a guide to help choose, not a guarantee of how the saree will look or drape in person.',
      },
      {
        q: 'Does it cover other ethnic wear?',
        a: 'Ethnic stores often sell more than sarees, so the experience is designed to extend to other ethnic wear. Which categories to launch with is something we scope together in a demo.',
      },
      {
        q: 'Is it only for stores, or for online too?',
        a: 'Both. Many ethnic retailers sell across showroom and website, and the experience is designed to work in either place.',
      },
    ],
  },
  {
    slug: 'bridal-stores',
    path: '/for-businesses/bridal-stores/',
    name: 'Bridal Stores',
    blurb: 'Explore wedding silhouettes before the appointment.',
    card: 'Help brides narrow down silhouettes and trains before an appointment, and between fittings.',
    keyword: 'virtual try on wedding dresses',
    image: img('bridal-stores'),
    imageAlt: 'Ivory bridal gown with a long train and veil, with its AI scan revealed on hover',
    tag: 'Wedding fashion',
    faq: [
      {
        q: 'Why use virtual try on for wedding dresses?',
        a: 'Bridal appointments are personal and time-limited. Previewing silhouettes first gives the consultation a starting point, so your team can spend more of the appointment on fit, fabric and advice.',
      },
      {
        q: 'Does it replace bridal appointments?',
        a: 'No. Fittings, tailoring and advice stay with your team. Try-on is a way to prepare for and extend that conversation.',
      },
      {
        q: 'Can brides use it at home?',
        a: 'Some bridal stores may want to offer it online as well as in the shop. How you run it is something we cover in a demo.',
      },
    ],
  },
  {
    slug: 'boutiques',
    path: '/for-businesses/boutiques/',
    name: 'Boutiques',
    blurb: 'A digital fitting room with a personal touch.',
    card: 'A digital fitting room that keeps the personal touch of a curated, small-batch boutique.',
    keyword: 'virtual try on for boutiques',
    image: img('boutiques'),
    imageAlt: 'Boutique interior with a mannequin, brass rail and arched mirror, with the AI scan revealed on hover',
    tag: 'Boutique retail',
    faq: [
      {
        q: 'Is virtual try on practical for a small boutique?',
        a: 'It is designed to scale down as well as up, so a small boutique can start with a focused set of pieces. Placement and rollout are agreed in a demo.',
      },
      {
        q: 'Will it feel impersonal?',
        a: 'The experience is built to support your styling advice, not replace it — shoppers explore, and your team still guides the decision.',
      },
      {
        q: 'How many pieces do I need to start?',
        a: 'We can start with a focused capsule of pieces. Exact scope is agreed in a demo based on your collection.',
      },
    ],
  },
  {
    slug: 'shopping-malls',
    path: '/for-businesses/shopping-malls/',
    name: 'Shopping Malls',
    blurb: 'Walk-up kiosk fitting rooms for concourses and flagships.',
    card: 'A walk-up virtual fitting room kiosk for concourses, atriums and flagship stores.',
    keyword: 'virtual fitting room in store',
    image: img('shopping-malls'),
    imageAlt: 'Interactive mirror kiosk in a mall concourse, with its AI scan revealed on hover',
    tag: 'In-store kiosk',
    faq: [
      {
        q: 'What is a virtual fitting room in store?',
        a: 'A kiosk or large screen where shoppers see garments on themselves without changing, so they can decide what is worth trying on.',
      },
      {
        q: 'Who is it for — the mall or the brands inside it?',
        a: 'It can suit either. A mall operator might offer it as a shared experience, and a brand might run it inside its own store. Which model fits is something we discuss in a demo.',
      },
      {
        q: 'What does installation involve?',
        a: 'Hardware and placement depend on the space and footfall. Those details are discussed in a demo.',
      },
    ],
  },
  {
    slug: 'events-exhibitions',
    path: '/for-businesses/events-exhibitions/',
    name: 'Events & Exhibitions',
    blurb: 'Live try-on moments for activations and launches.',
    card: 'Offer a live try-on moment at a stand, pop-up or launch that visitors can take part in and share.',
    keyword: 'brand activation marketing',
    image: img('events-exhibitions'),
    imageAlt: 'Brand activation booth with an arched stage and spotlights, with its AI scan revealed on hover',
    tag: 'Brand activation',
    faq: [
      {
        q: 'How does virtual try on support brand activation marketing?',
        a: 'It gives visitors something to do, not just see: try a look, get a result worth sharing, and take part in a reward moment like the lucky draw.',
      },
      {
        q: 'Can it be branded for our campaign?',
        a: 'It is designed to be branded around your campaign. What can be customised is something we cover in a demo.',
      },
      {
        q: 'What kinds of events suit it?',
        a: 'Exhibitions, trade shows, pop-ups and store launches are the natural fits. Whether it suits other formats, such as fashion weeks, is something we discuss in a demo.',
      },
    ],
  },
  {
    slug: 'jewellery-stores',
    path: '/for-businesses/jewellery-stores/',
    name: 'Jewellery Stores',
    blurb: 'Necklaces and earrings shown on the customer.',
    card: 'Show necklaces and earrings on the customer before staff bring pieces out.',
    keyword: 'virtual try on jewellery',
    image: img('jewellery-stores'),
    imageAlt: 'Gold necklace and earrings on a velvet bust, with the AI scan revealed on hover',
    tag: 'Jewellery visualisation',
    faq: [
      {
        q: 'What can customers try on?',
        a: 'Jewellery try-on is designed for pieces worn on view — such as necklaces and earrings. The exact range for launch is agreed in a demo.',
      },
      {
        q: 'Does it help with high-value pieces?',
        a: 'It can help customers narrow down before staff bring specific pieces out. Your team still shows the real piece, and what the preview shows is agreed in a demo.',
      },
      {
        q: 'Is it in store or online?',
        a: 'Both are possible: a counter screen or kiosk in store, and your website. How you run it is agreed in a demo.',
      },
    ],
  },
  {
    slug: 'eyewear-stores',
    path: '/for-businesses/eyewear-stores/',
    name: 'Eyewear Stores',
    blurb: 'Compare frames on your own face, in store or online.',
    card: 'Let shoppers compare frames on their own face — shape and colour — at the counter or on your website.',
    keyword: 'virtual try on eyewear',
    image: img('eyewear-stores'),
    imageAlt: 'Pair of acetate glasses on a plinth beside a second frame, with the AI scan revealed on hover',
    tag: 'Eyewear fitting',
    faq: [
      {
        q: 'How does virtual try on eyewear work?',
        a: 'The shopper sees frames on their own face, so they can compare shapes and styles quickly. How it is set up for your store is agreed in a demo.',
      },
      {
        q: 'Does it replace an optician fitting?',
        a: 'No. Measurements, lenses and fit stay with your opticians. Try-on helps shoppers narrow down the frames worth fitting.',
      },
      {
        q: 'Can it live on our website?',
        a: 'It is designed to run online as well as on an in-store screen. Integration options are covered in a demo.',
      },
    ],
  },
]

export const businessBySlug = (slug: string) => BUSINESSES.find((b) => b.slug === slug)
