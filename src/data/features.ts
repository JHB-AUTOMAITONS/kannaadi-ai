import type { LucideIcon } from 'lucide-react'
import { Boxes, Camera, Gift, Glasses, Gem, MonitorSmartphone, ScanLine, Shirt, Sparkles, Upload } from 'lucide-react'

export type FeatureVisualKey =
  | 'tryon'
  | 'looks'
  | 'upload'
  | 'scan'
  | 'kiosk'
  | 'draw'
  | 'jewellery'
  | 'eyewear'
  | 'realtime'
  | 'engage'

export interface Feature {
  id: string
  index: string
  title: string
  kicker: string
  description: string
  points: string[]
  icon: LucideIcon
  visual: FeatureVisualKey
}

export const FEATURES: Feature[] = [
  {
    id: 'ai-virtual-try-on',
    index: '01',
    title: 'AI Virtual Try-On',
    kicker: 'The core experience',
    description:
      'Shoppers see a garment on themselves instead of imagining it on a model. Kannaadi.Ai uses AI to place the piece on the customer, so choosing feels closer to standing at the mirror.',
    points: ['Garment shown on the shopper', 'Works for clothing and ethnic wear', 'Designed for web, kiosk and in-store screens'],
    icon: Shirt,
    visual: 'tryon',
  },
  {
    id: 'ai-outfit-generator',
    index: '02',
    title: 'AI Outfit Generator / AI Looks',
    kicker: 'From one piece to a look',
    description:
      'Beyond a single garment, AI Looks suggests how pieces come together. It turns browsing into styling — and gives shoppers a reason to keep exploring your collection.',
    points: ['Outfit ideas built around a chosen piece', 'Encourages exploring more of the range', 'A natural bridge from try-on to discovery'],
    icon: Sparkles,
    visual: 'looks',
  },
  {
    id: 'upload-a-dress',
    index: '03',
    title: 'Upload a Dress',
    kicker: 'Bring your own piece',
    description:
      'Customers can upload a dress they already have in mind and see it on themselves — useful for stores that want to match, extend or recommend around what a shopper is looking for.',
    points: ['Start from any garment image', 'Lets shoppers bring a reference to your store', 'Opens a conversation about similar styles you stock'],
    icon: Upload,
    visual: 'upload',
  },
  {
    id: 'scan-a-dress',
    index: '04',
    title: 'Scan a Dress',
    kicker: 'From rail to screen',
    description:
      'In store, a shopper can scan a garment and bring it straight into the try-on, bridging the physical rail and the digital fitting room without hunting through a catalogue.',
    points: ['Connects physical stock to the digital experience', 'Fast, hands-on interaction at the rail', 'Suited to kiosk and assisted-selling flows'],
    icon: ScanLine,
    visual: 'scan',
  },
  {
    id: 'kiosk-experience',
    index: '05',
    title: 'Kiosk Experience',
    kicker: 'A fitting room you can walk up to',
    description:
      'A standing screen that invites shoppers in: step up, see yourself in the piece, explore looks. Built for stores, malls and events where the experience itself is part of the draw.',
    points: ['Walk-up, self-guided flow', 'Branded to your store or campaign', 'Right for floors, concourses and exhibitions'],
    icon: MonitorSmartphone,
    visual: 'kiosk',
  },
  {
    id: 'lucky-draw',
    index: '06',
    title: 'Lucky Draw',
    kicker: 'A reason to take part',
    description:
      'A reward moment after the try-on. Lucky Draw adds a playful mechanic for campaigns, events and in-store promotions, so participation feels like a game rather than a form.',
    points: ['Gamified reward step', 'Fits activations and promotions', 'Gives visitors something to talk about'],
    icon: Gift,
    visual: 'draw',
  },
  {
    id: 'jewellery-try-on',
    index: '07',
    title: 'Jewellery Try-On',
    kicker: 'Pieces worn, not displayed',
    description:
      'Necklaces, earrings and statement pieces appear on the customer so they can judge scale and style, with the vault staying closed until they know what they want to see.',
    points: ['Pieces shown on the wearer', 'Compare styles quickly', 'For counters, kiosks and online'],
    icon: Gem,
    visual: 'jewellery',
  },
  {
    id: 'eyewear-try-on',
    index: '08',
    title: 'Eyewear Try-On',
    kicker: 'Frames on your own face',
    description:
      'Shoppers compare frames on their own face — shape, size, colour — before an optician is involved, so fitting time goes to the frames they already like.',
    points: ['Frames shown on the shopper’s face', 'Quick comparison across styles', 'In store or online'],
    icon: Glasses,
    visual: 'eyewear',
  },
  {
    id: 'real-time-virtual-fitting',
    index: '09',
    title: 'Real-Time Virtual Fitting',
    kicker: 'Responsive, not rendered later',
    description:
      'The fitting experience responds as the shopper moves and switches pieces, so it feels like a mirror rather than a loading screen.',
    points: ['Interactive, in-the-moment feedback', 'Switch pieces and colours quickly', 'Built to feel like a mirror'],
    icon: Camera,
    visual: 'realtime',
  },
  {
    id: 'customer-engagement',
    index: '10',
    title: 'Customer Engagement Features',
    kicker: 'Beyond the try-on',
    description:
      'Share-ready moments, rewards and prompts that keep a shopper engaged after they have seen the look — shaped around the campaign or store you are running.',
    points: ['Interactive moments around the try-on', 'Campaign-ready mechanics', 'Shaped to your brand and goals'],
    icon: Boxes,
    visual: 'engage',
  },
]
