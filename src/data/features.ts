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
      'The core feature: AI places the chosen garment on the shopper, so they judge colour, silhouette and style on themselves rather than on a model. The other features build on this base.',
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
      'The AI outfit generator behind AI Looks suggests how pieces come together around a garment the shopper has chosen. One try-on becomes several outfit ideas, which gives shoppers a reason to keep exploring your collection.',
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
      'Customers upload a photo of a dress they already have in mind and see it on themselves. For stores, it is a starting point to match the reference or recommend similar styles from the range.',
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
      'Where upload starts from a photo, scanning starts from the garment itself: in store, a shopper scans a piece from the rail and brings it straight into the try-on, with no catalogue search needed.',
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
      'A standing screen that works as a walk-up virtual try-on kiosk: shoppers step up, see themselves in a piece and explore looks at their own pace. Built for stores, malls and events where the experience itself helps draw people in.',
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
      'A reward step after the try-on, built for campaigns, events and in-store promotions. Rewards are set per campaign, and the draw makes taking part feel like a game rather than a form.',
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
      'Necklaces, earrings and statement pieces appear on the customer so they can judge scale and style, before staff bring specific pieces out of the vault. Jewellery virtual try-on can sit at the counter, on a kiosk or online.',
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
      'Eyewear virtual try-on lets shoppers compare frames on their own face — shape, size, colour — before an optician fitting, so fitting time goes to frames they already like.',
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
      'The fitting responds as the shopper moves and switches pieces, so it behaves like a mirror rather than a loading screen. It is what makes the rest of the virtual fitting room feel immediate.',
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
      'Share-ready looks, rewards and prompts that keep a shopper engaged after the try-on, shaped around the campaign or store you run. They sit around the try-on rather than replacing it.',
    points: ['Interactive moments around the try-on', 'Campaign-ready mechanics', 'Shaped to your brand and goals'],
    icon: Boxes,
    visual: 'engage',
  },
]
