// Photo slots for Kannaadi.Ai: every realistic model photograph the site uses, with the art direction (prompt) to
// generate it, its output size, and where it lands. Drop the generated source image into
//   assets-src/photos/<slot id>.(jpg|jpeg|png|webp)
// optionally with a sidecar  assets-src/photos/<slot id>.json  =  { "face": {x,y,w,h}, "subject": {x,y,w,h},
//   "focal": [x, y] }   (all 0–1 of the FINAL cropped frame)
// then run `npm run photos`. It crops, compresses, derives the aligned AI layer (Image 2) and registers the slot so
// the site switches from the procedural placeholder art to the photo. Slots without a source keep the placeholder.
//
// Shared art direction for every prompt (keep it consistent across slots):
const STYLE =
  'Photorealistic premium fashion editorial photograph, shot on a full-frame camera with an 85mm lens, soft diffused ' +
  'studio light from the front-left, realistic skin texture, natural makeup, anatomically correct hands and fingers, ' +
  'detailed fabric folds with true silk sheen, calm confident expression. Clearly adult woman (late 20s to 30s), ' +
  'modest professional presentation, no text, no logos, no watermark.'

const IVORY = 'plain seamless very pale off-white studio backdrop (soft warm white, almost white, not peach, not beige, not orange), evenly lit, nothing else in the background'
const CHARCOAL = 'plain seamless deep charcoal studio backdrop with soft cinematic falloff, nothing else in the background'

/** @typedef {{ id: string, dir: string, file: string, width: number, height: number, sizes?: number[],
 *   aspect: string, alt: string, prompt: string, overlay?: object, thumb?: boolean }} Slot */

/** @type {Slot[]} */
export const SLOTS = [
  {
    id: 'hero',
    dir: 'hero',
    file: 'south-indian-fashion',
    width: 2400,
    height: 1300,
    sizes: [2400, 1600, 800],
    aspect: 'LANDSCAPE_16_9',
    matchBackground: '#f5f1e8', // page ivory: the stage edges must vanish into the hero
    alt: 'A South Indian woman in a contemporary Kanchipuram-inspired silk saree, photographed for a fashion editorial. Moving the pointer over her reveals the same photograph as an AI scan.',
    prompt: `${STYLE} Wide landscape composition: a sophisticated South Indian woman stands on the RIGHT third of the frame, three-quarter length, body angled slightly toward the left of frame. She wears a contemporary deep claret-wine Kanchipuram-inspired silk saree with a fine gold zari border, pallu neatly draped over the left shoulder, a modern fitted blouse. Minimal jewellery: small gold jhumka earrings, one slim necklace, a few thin bangles. Sleek low bun with a small strand of jasmine, small bindi. The LEFT two-thirds of the frame is empty ${IVORY} (space for headline text). Modern luxury fashion campaign — not a bride, no heavy jewellery, no wedding setting.`,
    overlay: { band: 0.52, rails: [{ y: 0.58, x0: 0.62, x1: 0.86 }], nodes: [{ x: 0.7, y: 0.74 }, { x: 0.8, y: 0.44 }] },
  },
  {
    id: 'fashion-stores',
    dir: 'fashion',
    file: 'contemporary-saree-retail',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian woman in a modern cotton-silk saree browsing a rail of ethnic and fusion wear in a bright fashion store',
    prompt: `${STYLE} A South Indian woman in a modern pastel cotton-silk saree with a contemporary blouse stands beside a minimal clothing rail of sarees, kurtas and fusion jackets in a bright, minimal premium fashion store with warm ivory walls and soft daylight. She holds a hanger and looks at the garment. Clean, uncluttered, editorial retail campaign.`,
    overlay: { rails: [{ y: 0.6, x0: 0.3, x1: 0.62 }] },
  },
  {
    id: 'saree-ethnic-stores',
    dir: 'saree',
    file: 'kanchipuram-silk-saree',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian woman in a Kanchipuram-inspired silk saree showing the drape, gold zari border and pallu',
    prompt: `${STYLE} Saree-focused composition: a South Indian woman, full length, centred, in a rich emerald Kanchipuram-inspired silk saree with a wide gold temple zari border and a pallu held slightly open in one hand so the pallu design is clearly visible; neat front pleats. Small jhumkas, a few bangles, jasmine in the hair. ${IVORY}. The saree drape is the hero of the image.`,
    overlay: { rails: [{ y: 0.55, x0: 0.35, x1: 0.65 }, { y: 0.86, x0: 0.33, x1: 0.67 }] },
  },
  {
    id: 'bridal-stores',
    dir: 'bridal',
    file: 'south-indian-bridal-silk',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian bride in a traditional Kanchipuram silk bridal saree with tasteful temple jewellery',
    prompt: `${STYLE} Premium South Indian bridal portrait, three-quarter length, centred: a bride in a traditional red-and-gold Kanchipuram silk bridal saree, tasteful temple jewellery (one necklace set, jhumkas, maang tikka), jasmine in a braided bun, elegant bridal makeup. Refined and realistic, not overloaded. ${IVORY}.`,
  },
  {
    id: 'boutiques',
    dir: 'boutiques',
    file: 'designer-fusion-boutique',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian woman in a designer fusion outfit in a curated boutique with an arched mirror',
    prompt: `${STYLE} High-end boutique campaign: a South Indian woman in a designer fusion ethnic outfit (pre-draped modern saree with a structured blouse, muted sage and gold) stands in an intimate boutique with a brass rail of a few curated garments and an arched mirror; warm ivory and brass tones, calm and minimal.`,
  },
  {
    id: 'shopping-malls',
    dir: 'retail',
    file: 'mall-virtual-fitting-kiosk',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian shopper using a tall virtual fitting room screen in a premium mall',
    prompt: `${STYLE} A South Indian woman in a smart contemporary salwar-kurta stands in front of a tall freestanding digital fitting-mirror kiosk in a premium, bright shopping mall concourse; the screen shows her wearing a different saree. Realistic retail environment, soft focus background, no visible brand names.`,
  },
  {
    id: 'events-exhibitions',
    dir: 'events',
    file: 'fashion-tech-activation',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'A South Indian woman trying a virtual try-on screen at a premium fashion-tech brand activation',
    prompt: `${STYLE} Premium fashion-tech brand activation at an exhibition: a South Indian woman in a modern half-saree inspired outfit interacts with a large interactive virtual try-on screen on an elegant branded stand with warm spotlights; a few softly blurred visitors in the background. Sophisticated, not a crowded trade-show stock photo, no visible brand names.`,
  },
  {
    id: 'jewellery-stores',
    dir: 'jewellery',
    file: 'temple-jewellery-portrait',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'Close portrait of a South Indian woman wearing gold jhumka earrings, a layered necklace and bangles',
    prompt: `${STYLE} Jewellery-focused close portrait from mid-chest up: a South Indian woman in a simple deep green silk blouse and saree, wearing clearly visible gold jhumka earrings, one elegant layered gold necklace and a couple of bangles with her hand gently near her collarbone. Jewellery in sharp focus and the clear visual focus. ${CHARCOAL}.`,
  },
  {
    id: 'eyewear-stores',
    dir: 'eyewear',
    file: 'modern-eyewear-portrait',
    width: 1200,
    height: 900,
    aspect: 'LANDSCAPE_4_3',
    thumb: true,
    alt: 'Portrait of a South Indian woman wearing modern tortoiseshell glasses',
    prompt: `${STYLE} Eyewear-focused head-and-shoulders portrait: a South Indian woman wearing modern tortoiseshell acetate optical glasses, correctly fitted and aligned on her face with realistic lens reflections, in a contemporary ivory cotton saree, hair in a low knot. ${IVORY}.`,
  },
  // Four colourways of the SAME woman in the SAME pose (generate look-ink first, then use it as the image reference
  // with "same woman, same pose, same framing — change only the saree colour to …"). Used by the try-on showcase,
  // AI Looks tiles, the product-page demo and the boutique look board.
  ...[
    ['ink', 'deep ink-black silk saree with a fine silver zari border'],
    ['champagne', 'champagne-ivory silk saree with a fine gold zari border'],
    ['forest', 'forest-green Kanchipuram-inspired silk saree with a gold border'],
    ['claret', 'claret-wine Kanchipuram-inspired silk saree with a gold border'],
  ].map(([c, saree]) => ({
    id: `look-${c}`,
    dir: 'looks',
    file: `saree-look-${c}`,
    width: 1100,
    height: 1300,
    sizes: [1100, 550],
    aspect: 'PORTRAIT_4_5',
    alt: `A South Indian woman in a ${saree}`,
    prompt: `${STYLE} Full-length, centred, standing straight facing the camera with a slight three-quarter turn: a South Indian woman in a ${saree}, pallu over the left shoulder, contemporary blouse, small jhumkas, sleek low bun. ${IVORY}. Identical framing for every colourway.`,
    overlay: { rails: [{ y: 0.42, x0: 0.36, x1: 0.64 }, { y: 0.78, x0: 0.3, x1: 0.7 }], band: 0.6 },
  })),
]
