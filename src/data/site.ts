/** Site-wide constants. Everything environment-specific is read from VITE_* variables. */
export const SITE = {
  name: 'Kannaadi.Ai',
  /** Canonical origin. Set VITE_SITE_URL at build time for the real domain. */
  url: ((import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://kannadi.ai').replace(/\/+$/, ''),
  locale: 'en',
  ogImage: '/images/og/kannaadi-og.jpg',
  ogImageAlt: 'A satin gown shown half as a studio photo and half as an AI scan — the Kannaadi.Ai virtual try on reveal.',
  /**
   * Lead-form delivery. The site never fakes a submission: if no endpoint is configured the forms
   * report that honestly. Point VITE_FORM_ENDPOINT at any service that accepts a JSON POST
   * (a serverless function, Formspree, Web3Forms, …).
   */
  formEndpoint: (import.meta.env.VITE_FORM_ENDPOINT as string | undefined) || '',
  /** Optional public contact address — only shown when actually provided. */
  contactEmail: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || '',
} as const

export const absoluteUrl = (path: string) => `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
