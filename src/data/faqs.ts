import { BUSINESSES, type Faq } from './businesses'

const generic: Record<string, Faq[]> = {
  '/': [
    {
      q: 'What is virtual try on?',
      a: 'Virtual try on lets a shopper see a garment, accessory or pair of frames on themselves digitally, instead of imagining it from a product photo. Kannaadi.Ai uses AI to make that preview feel like standing at the mirror.',
    },
    {
      q: 'Where can Kannaadi.Ai be used?',
      a: 'It is designed for three places: online stores, in-store kiosks and screens, and live events. Which mix suits your business is something we map out in a demo.',
    },
    {
      q: 'Does it work for more than clothes?',
      a: 'Yes. Beyond clothing and ethnic wear, Kannaadi.Ai includes jewellery try-on and eyewear try-on, plus an AI outfit generator for putting looks together.',
    },
    {
      q: 'How do we get started?',
      a: 'Book a demo. We will show the experience working with products like yours and talk through what a rollout would involve.',
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
  ],
}

export const faqFor = (path: string): Faq[] => {
  if (generic[path]) return generic[path]
  return BUSINESSES.find((b) => b.path === path)?.faq ?? []
}
