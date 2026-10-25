import { IconWhatsApp } from '@/components/ui/Icons'
import { whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/** Botón flotante de WhatsApp: visible en todas las páginas. */
export function WhatsAppFab({ ajustes }: { ajustes: Ajustes }) {
  return (
    <a
      href={whatsappUrl(ajustes)}
      target="_blank"
      rel="noopener noreferrer"
      data-event="whatsapp_click"
      data-label="flotante"
      aria-label="Escríbenos por WhatsApp"
      className="fab-pulse fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-transform hover:scale-110 focus-visible:outline-brand md:h-16 md:w-16"
    >
      <IconWhatsApp width={32} height={32} />
    </a>
  )
}
