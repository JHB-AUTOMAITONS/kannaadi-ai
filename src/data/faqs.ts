import { BUSINESSES, type Faq } from './businesses'

const generic: Record<string, Faq[]> = {
  '/': [
    {
      q: 'What is virtual try on?',
      a: 'Virtual try on lets a shopper see a garment, accessory or pair of frames on themselves digitally, instead of imagining it from a product photo. Kannaadi.Ai is AI virtual try on software for fashion and retail: it places the piece on the shopper, so the preview feels closer to standing at the mirror.',
    },
    {
      q: 'Where can Kannaadi.Ai be used?',
      a: 'Kannaadi.Ai is designed for three places: online stores, in-store kiosks and screens, and live events such as exhibitions and launches. You can use the virtual fitting room in one place or across all three; we map out the right mix in a demo.',
    },
    {
      q: 'Does it work for more than clothes?',
      a: 'Yes. Beyond clothing and ethnic wear, Kannaadi.Ai includes jewellery try-on and eyewear try-on, plus an AI outfit generator (AI Looks) that suggests how pieces come together.',
    },
    {
      q: 'How do we get started?',
      a: 'Book a demo. We will show the AI virtual try on working with products like yours, then talk through which channels suit your business and what a rollout would involve.',
    },
    {
      q: 'What do we need to prepare to get started?',
      a: 'Start with the pieces you want shoppers to try — garments, jewellery or frames — and where you would use it: online, in store, at events or a mix. Kannaadi.Ai is set up around your own range rather than a generic demo, and the details are agreed in a demo.',
    },
    {
      q: 'Does virtual try on show exact fit?',
      a: 'A try-on preview is a visual aid for comparing colour, shape and style. Treat it as a guide when choosing rather than a promise of exact fit, fabric feel or appearance in person. Measurements, fittings and advice stay with your team, and what the preview shows for your range is something we cover in a demo.',
    },
    {
      q: 'Does it replace our staff or fitting rooms?',
      a: 'No. It helps shoppers narrow down what is worth trying on, so your team and your fitting rooms spend their time on the pieces customers already like.',
    },
  ],
  '/features/': [
    {
      q: 'What does a virtual try-on preview show?',
      a: 'It places the chosen piece on the shopper so they can compare colour, shape and style. It is meant as a visual guide for choosing, so measurements, fittings and the final decision stay with your team. How closely a preview reflects a real piece from your range is something we cover in a demo.',
    },
    {
      q: 'Which features suit stores, and which suit events?',
      a: 'AI Virtual Try-On and AI Looks are designed for web, kiosk and in-store screens. Scanning a dress suits the shop floor, and the kiosk experience suits stores, malls and exhibitions. Lucky Draw is built for campaigns, events and in-store promotions.',
    },
    {
      q: 'Do we have to use every feature?',
      a: 'No. We show the features that fit your range and channels and leave out the ones that do not, and we can start with a focused set of pieces. Which to launch with is agreed in a demo.',
    },
    {
      q: 'How is the kiosk experience different from online try-on?',
      a: 'The kiosk is a standing screen that shoppers walk up to in a store, mall or exhibition, with a self-guided flow that can be branded to your store or campaign. Online try-on runs on your website or product pages. Both show the piece on the shopper, and scanning a garment from the rail is an in-store flow. Whether to use one or both is agreed in a demo.',
    },
    {
      q: 'What is the AI outfit generator?',
      a: 'The AI outfit generator behind AI Looks suggests how pieces come together around a garment the shopper has chosen, so one try-on can lead to several outfit ideas and a reason to keep exploring your range. Which pieces and combinations it can suggest from your range is agreed in a demo.',
    },
  ],
  '/use-cases/': [
    {
      q: 'How does virtual try on for ecommerce help shoppers decide?',
      a: 'It replaces a flat product photo with a preview on the shopper, which gives them a clearer sense of colour, silhouette and style before they commit.',
    },
    {
      q: 'Is virtual try on only for online stores?',
      a: 'No. The same experience can run on in-store kiosks and at events, so shoppers get a consistent experience across channels.',
    },
    {
      q: 'Can we use it alongside our existing store?',
      a: 'It is designed to sit alongside your current catalogue and channels. Integration details are agreed in a demo.',
    },
    {
      q: 'Which channel should we start with?',
      a: 'A practical way to start is where choosing is hardest for your customers, for example the product page or one screen on the shop floor, and add other channels later. The experience is designed to work across channels, so the order is a business decision we can talk through in a demo.',
    },
  ],
  '/book-a-demo/': [
    {
      q: 'What happens in a demo?',
      a: 'We show the virtual try on software working with products like yours, walk through features such as AI Looks and the kiosk experience, and discuss what would suit your channels.',
    },
    {
      q: 'Who should attend?',
      a: 'Anyone involved in the decision: ecommerce, merchandising, store operations or marketing. Bring the questions your team would ask.',
    },
    {
      q: 'Is there any commitment?',
      a: 'A demo is a conversation. Submitting the form simply asks us to get in touch.',
    },
    {
      q: 'What should we bring to a demo?',
      a: 'It helps to bring a shortlist of the pieces you would like to try — garments, jewellery or frames — and an idea of where you would use it: online, in store, at events or a mix. If you are not sure yet, we can work that out together.',
    },
  ],
}

export const faqFor = (path: string): Faq[] => {
  if (generic[path]) return generic[path]
  return BUSINESSES.find((b) => b.path === path)?.faq ?? []
}
