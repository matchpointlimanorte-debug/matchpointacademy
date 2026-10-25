import Image from 'next/image'

import { Section } from '@/components/ui/Section'
import { IconCheck } from '@/components/ui/Icons'
import type { SeccionConfig } from '@/lib/data'
import { medio, parrafos, urlMedio } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

export function Quienes({ ajustes, cfg }: { ajustes: Ajustes; cfg: SeccionConfig }) {
  const imagen = medio(ajustes.quienesImagen)
  const puntos = ajustes.puntosClave || []
  const fotoSrc = (imagen && urlMedio(imagen, 'card')) || '/images/grupo-clase.jpg'
  const textoQuienes =
    ajustes.quienesTexto ||
    'Somos una academia de tenis comprometida con impulsar el aprendizaje y la práctica competitiva en Lima Norte. Nuestro objetivo es formar a futuros jugadores, brindándoles un espacio donde puedan desarrollar su talento, disciplina y pasión por este deporte sin importar su nivel inicial.\n\nContamos con entrenadores dedicados, un ambiente formativo y canchas de tenis en Fuertes Hoyos, Rímac.'

  return (
    <Section
      id="quienes"
      tone="sand"
      eyebrow="Nosotros"
      titulo={cfg.titulo || ajustes.quienesTitulo || 'Sobre Match Point Lima Norte'}
      subtitulo={cfg.subtitulo || 'Conoce nuestra propuesta formativa y competitiva en Lima Norte'}
    >
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
        <div className="reveal space-y-5 text-lg text-ink/80">
          {parrafos(textoQuienes).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {puntos.length > 0 && (
            <ul className="mt-8 grid gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              {puntos.map((p) => (
                <li key={p.id || p.titulo} className="card card-hover p-4">
                  <span className="mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent text-brand">
                    <IconCheck width={18} height={18} />
                  </span>
                  <p className="font-display text-lg font-bold text-brand">{p.titulo}</p>
                  {p.descripcion && <p className="text-sm text-ink/70">{p.descripcion}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="reveal relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-2xl ring-8 ring-white">
          <Image
            src={fotoSrc}
            alt={imagen?.alt || 'Alumnos y entrenadores de Match Point Lima Norte'}
            fill
            sizes="(min-width: 768px) 560px, 100vw"
            className="object-cover"
          />
          <div aria-hidden="true" className="absolute bottom-0 left-0 h-2 w-full bg-accent" />
        </div>
      </div>
    </Section>
  )
}
