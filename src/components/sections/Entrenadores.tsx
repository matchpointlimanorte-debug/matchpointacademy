import Image from 'next/image'

import { Section } from '@/components/ui/Section'
import type { SeccionConfig } from '@/lib/data'
import { medio, urlMedio } from '@/lib/site'
import type { Entrenador } from '@/lib/types'

/** Carrusel con scroll-snap: funciona con el dedo y con el teclado (el contenedor es enfocable). */
export function Entrenadores({ entrenadores, cfg }: { entrenadores: Entrenador[]; cfg: SeccionConfig }) {
  return (
    <Section
      id="entrenadores"
      tone="sand"
      eyebrow="Equipo"
      titulo={cfg.titulo || 'Nuestros entrenadores'}
      subtitulo={cfg.subtitulo}
    >
      <div
        className="snap-row -mx-5 px-5 md:mx-0 md:px-0"
        role="region"
        aria-label="Lista de entrenadores, desliza para ver más"
        tabIndex={0}
      >
        {entrenadores.map((e) => {
          const foto = medio(e.foto)
          return (
            <article key={e.id} className="card card-hover w-[17rem] overflow-hidden sm:w-[19rem]">
              <div className="relative aspect-[4/5] bg-brand-soft">
                {foto && (
                  <Image
                    src={urlMedio(foto, 'card') || ''}
                    alt={foto.alt || e.nombre}
                    fill
                    sizes="304px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-5">
                <h3 className="text-xl font-extrabold">{e.nombre}</h3>
                {e.cargo && <p className="text-sm font-semibold text-court">{e.cargo}</p>}
                {e.bio && <p className="mt-2 text-sm text-ink/75">{e.bio}</p>}
                {e.certificaciones && <p className="mt-2 text-xs font-semibold text-brand/70">{e.certificaciones}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </Section>
  )
}
