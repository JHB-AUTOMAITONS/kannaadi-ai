import { BUSINESSES, type Faq } from './businesses'

const generic: Record<string, Faq[]> = {
  '/': [
    {
      q: 'What is AI Virtual Try On software?',
      a: 'AI virtual try on software shows a garment on a shopper digitally, so they can see colour, shape and style on themselves instead of imagining it from a rail or a product photo. Kannaadi.Ai is AI virtual try on software built for fashion retail: it places the chosen piece on the shopper, in store through a kiosk or screen.',
    },
    {
      q: 'How does AI Virtual Try On work in fashion stores?',
      a: 'A shopper steps up to the Kannaadi.Ai kiosk, follows a simple guide on where to stand, and picks a dress or outfit from your range, or scans a piece from the rail. The AI then shows it on them, and they can switch colours and looks with a tap. Setup for your range is agreed in a demo.',
    },
    {
      q: 'Can clothing showrooms use virtual try-on software?',
      a: 'Yes. Kannaadi.Ai is designed for physical fashion retail, including clothing showrooms, boutiques and saree shops. A kiosk or screen on the shop floor lets customers preview pieces before asking staff to bring more out. Which categories to launch with, and where to place the kiosk, are agreed with you in a demo.',
    },
    {
      q: 'What is the difference between AI Virtual Try On and a traditional fitting room?',
      a: 'A traditional fitting room confirms how a garment fits in person. AI virtual try on gives a quick visual preview of colour, shape and style without changing clothes, so shoppers can narrow down what to try. It complements the fitting room rather than replacing it, and measurements, fittings and advice stay with your team.',
    },
    {
      q: 'How can Virtual Clothing Try On improve the in-store shopping experience?',
      a: 'Virtual clothing try on gives customers something interactive to do on the shop floor. They can see pieces on themselves, switch colours and explore outfit ideas before heading to a fitting room, which can make browsing more engaging. The benefit depends on your range, footfall and how your team uses the kiosk; we do not promise specific results.',
    },
    {
      q: 'Can customers try different outfits using AI Outfit Try On?',
      a: 'Yes. Shoppers can switch between pieces, colours and looks in one flow. AI Looks, the AI outfit generator in Kannaadi.Ai, also suggests how pieces come together around a garment they have chosen, so one AI outfit try on can lead to several ideas. Which pieces and combinations are offered depends on the range set up for your store.',
    },
    {
      q: 'Which types of fashion retail businesses can use Kannaadi.Ai?',
      a: 'Clothing showrooms, fashion boutiques, saree and ethnic wear shops, bridal stores, men’s and women’s fashion stores and multi-brand retailers can use it, along with jewellery and eyewear stores. It also works in malls and at events. Each business type has its own page, and the right scope is agreed in a demo.',
    },
    {
      q: 'How can I get AI Virtual Try On software for my fashion store?',
      a: 'Book a demo. We will show AI virtual try on working with pieces like yours, then talk through where it would sit in your store, which pieces to start with and what a rollout involves. To prepare, choose a focused set of garments and decide where a kiosk could stand. You can also contact our team with questions.',
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
