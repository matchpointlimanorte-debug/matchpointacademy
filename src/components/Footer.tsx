import Link from 'next/link'

import { BrandLogo } from '@/components/ui/BrandLogo'
import { IconFacebook, IconInstagram, IconTikTok, IconWhatsApp, IconYouTube } from '@/components/ui/Icons'
import type { SeccionConfig } from '@/lib/data'
import { telHref, whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

export function Footer({ ajustes, secciones }: { ajustes: Ajustes; secciones: SeccionConfig[] }) {
  const enlaces = secciones.filter((s) => s.visible && s.etiquetaMenu?.trim() && s.tipo !== 'hero')
  const redes = [
    { href: ajustes.instagram, label: 'Instagram', Icon: IconInstagram },
    { href: ajustes.tiktok, label: 'TikTok', Icon: IconTikTok },
    { href: ajustes.facebook, label: 'Facebook', Icon: IconFacebook },
    { href: ajustes.youtube, label: 'YouTube', Icon: IconYouTube },
  ].filter((r) => r.href)

  return (
    <footer className="on-dark bg-brand text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr] md:px-8">
        <div>
          {/* El logo original es de fondo claro: se muestra sobre una pastilla blanca. */}
          <div className="inline-block rounded-2xl bg-white p-3">
            <BrandLogo ajustes={ajustes} className="h-20 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/75">
            {ajustes.nombreSitio} — {ajustes.heroEtiqueta || 'Academia de Tenis & Torneos'}.
          </p>
        </div>

        <nav aria-label="Pie de página">
          <h2 className="!text-white text-lg font-bold">Explora</h2>
          <ul className="mt-3 space-y-2 text-white/80">
            {enlaces.map((s) => (
              <li key={s.tipo}>
                <a className="hover:text-accent" href={`/#${s.tipo}`}>
                  {s.etiquetaMenu}
                </a>
              </li>
            ))}
            <li>
              <Link className="hover:text-accent" href="/torneos">
                Todos los torneos
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="!text-white text-lg font-bold">Contacto</h2>
          <ul className="mt-3 space-y-2 text-white/80">
            {(ajustes.telefonos || []).map((t) => (
              <li key={t.id || t.numero}>
                <a className="hover:text-accent" href={telHref(t.numero)}>
                  {t.numero}
                </a>
              </li>
            ))}
            <li>{ajustes.direccion}</li>
          </ul>
          <a
            href={whatsappUrl(ajustes)}
            target="_blank"
            rel="noopener noreferrer"
            data-event="whatsapp_click"
            data-label="footer"
            className="btn btn-primary mt-4 !min-h-11 !px-5 !py-2 text-sm"
          >
            <IconWhatsApp width={18} height={18} /> Escríbenos por WhatsApp
          </a>
          {redes.length > 0 && (
            <ul className="mt-5 flex gap-3">
              {redes.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-brand"
                  >
                    <Icon width={22} height={22} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/60">
        © {new Date().getFullYear()} {ajustes.nombreSitio}. Todos los derechos reservados.
      </div>
    </footer>
  )
}
