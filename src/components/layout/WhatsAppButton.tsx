/** Public WhatsApp number in international format (no spaces or symbols): +91 86087 92718. */
const WHATSAPP_NUMBER = '918608792718'
/** Unique enquiry tag: search for it in WhatsApp to find chats that started from the website. */
const WHATSAPP_KEYWORD = 'KANNADI-TRYON'
const WHATSAPP_MESSAGE = `Hello Kannadi.ai Team, I am interested in your AI virtual try-on solution for fashion and retail. (Ref: ${WHATSAPP_KEYWORD})`

/** wa.me only pre-fills the message; the visitor has to press send themselves. */
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`

/** Official WhatsApp glyph (Simple Icons, 24×24 viewBox). */
const WHATSAPP_PATH =
  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z'

/**
 * Floating "chat on WhatsApp" button, fixed bottom-right on every page. Sits below the header's mobile menu
 * overlay (z-55) so the open menu is never covered, and above page content.
 */
export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kannadi.ai on WhatsApp"
      className="group/wa fixed right-[18px] bottom-[18px] z-50 grid size-[54px] place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_-6px_rgb(0_0_0/0.35)] ring-[3px] ring-white/80 transition-transform duration-300 ease-out hover:scale-110 focus-visible:scale-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128C7E] md:right-7 md:bottom-7 md:size-[62px] motion-reduce:transition-none"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-[28px] fill-current md:size-[32px]">
        <path d={WHATSAPP_PATH} />
      </svg>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm font-medium text-ivory opacity-0 shadow-lg transition-opacity duration-200 group-hover/wa:opacity-100 group-focus-visible/wa:opacity-100 md:block"
      >
        Chat with Kannadi.ai
      </span>
    </a>
  )
}
