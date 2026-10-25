import { ContactForm } from '@/components/sections/ContactForm'
import { IconFacebook, IconInstagram, IconPhone, IconPin, IconTikTok, IconWhatsApp, IconYouTube } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { mapaEmbed, telHref, whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

export function Ubicacion({ ajustes, cfg }: { ajustes: Ajustes; cfg: SeccionConfig }) {
  const redes = [
    { href: ajustes.instagram, label: 'Instagram', Icon: IconInstagram },
    { href: ajustes.tiktok, label: 'TikTok', Icon: IconTikTok },
    { href: ajustes.facebook, label: 'Facebook', Icon: IconFacebook },
    { href: ajustes.youtube, label: 'YouTube', Icon: IconYouTube },
  ].filter((r) => r.href)
  const comoLlegar = ajustes.mapaEnlace || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ajustes.direccion)}`

  return (
    <Section
      id="ubicacion"
      tone="light"
      eyebrow="Encuéntranos"
      titulo={cfg.titulo || 'Ubicación y contacto'}
      subtitulo={cfg.subtitulo || 'Ven a conocer la cancha y a tomar tu clase de prueba.'}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="reveal space-y-6">
          <div className="card p-6">
            <p className="flex items-start gap-3">
              <IconPin width={24} height={24} className="mt-0.5 shrink-0 text-court" />
              <span>
                <strong className="block font-display text-lg text-brand">{ajustes.direccion}</strong>
                {ajustes.referencia && <span className="text-ink/75">{ajustes.referencia}</span>}
              </span>
            </p>
            <a href={comoLlegar} target="_blank" rel="noopener noreferrer" className="btn btn-ghost mt-4 !min-h-11 !py-2 text-sm text-brand">
              Cómo llegar
            </a>
          </div>

          <div className="card p-6">
            <h3 className="mb-3 text-lg">Llámanos o escríbenos</h3>
            <ul className="space-y-2">
              {(ajustes.telefonos || []).map((t) => (
                <li key={t.id || t.numero}>
                  <a href={telHref(t.numero)} className="inline-flex items-center gap-3 text-lg font-semibold text-brand hover:underline">
                    <IconPhone width={22} height={22} className="text-court" /> {t.numero}
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={whatsappUrl(ajustes)}
              target="_blank"
              rel="noopener noreferrer"
              data-event="whatsapp_click"
              data-label="ubicacion"
              className="btn btn-primary mt-5 w-full"
            >
              <IconWhatsApp width={22} height={22} /> Reserva tu clase de prueba
            </a>
            {redes.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-3">
                {redes.map(({ href, label, Icon }) => (
                  <li key={label}>
                    <a
                      href={href!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-soft px-4 font-semibold text-brand transition hover:bg-accent"
                    >
                      <Icon width={20} height={20} /> {label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="reveal space-y-6">
          <div className="overflow-hidden rounded-3xl border border-brand/10 shadow-lg">
            <iframe
              title={`Mapa de ${ajustes.direccion}`}
              src={mapaEmbed(ajustes)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-[22rem] w-full md:h-[26rem]"
              allowFullScreen
            />
          </div>
          {ajustes.formularioActivo && <ContactForm />}
        </div>
      </div>
    </Section>
  )
}
