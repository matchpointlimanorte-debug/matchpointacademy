import Image from 'next/image'

import { IconStar } from '@/components/ui/Icons'
import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { medio, urlMedio } from '@/lib/site'
import type { Testimonio } from '@/lib/types'

export function Testimonios({ testimonios, cfg }: { testimonios: Testimonio[]; cfg: SeccionConfig }) {
  return (
    <Section id="testimonios" tone="light" eyebrow="Opiniones" titulo={cfg.titulo || 'Lo que dicen de nosotros'} subtitulo={cfg.subtitulo}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonios.map((t) => {
          const foto = medio(t.foto)
          const n = Math.min(5, Math.max(1, t.estrellas || 5))
          return (
            <figure key={t.id} className="reveal card flex flex-col p-7">
              <div role="img" aria-label={`${n} de 5 estrellas`} className="flex gap-0.5 text-accent-dark">
                {Array.from({ length: n }).map((_, i) => (
                  <IconStar key={i} width={20} height={20} />
                ))}
              </div>
              <blockquote className="mt-4 text-lg text-ink/85">“{t.texto}”</blockquote>
              <figcaption className="mt-auto flex items-center gap-3 pt-6">
                {foto ? (
                  <Image src={urlMedio(foto, 'thumb') || ''} alt={foto.alt || t.nombre} width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="flex h-12 w-12 items-center justify-center rounded-full bg-brand font-display text-lg font-bold text-accent">
                    {t.nombre.charAt(0)}
                  </span>
                )}
                <span>
                  <strong className="block font-display text-brand">{t.nombre}</strong>
                  {t.detalle && <span className="text-sm text-ink/60">{t.detalle}</span>}
                </span>
              </figcaption>
            </figure>
          )
        })}
      </div>
    </Section>
  )
}
