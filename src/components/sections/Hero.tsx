import Image from 'next/image'
import type { ReactNode } from 'react'

import { HeroVideo } from '@/components/sections/HeroVideo'
import { IconArrow, IconBall, IconPin, IconWhatsApp } from '@/components/ui/Icons'
import type { SeccionConfig } from '@/lib/data'
import { medio, urlMedio, whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/** Resalta con el marcador amarillo el texto entre [[dobles corchetes]]. */
function conResaltado(texto: string): ReactNode[] {
  return texto.split(/(\[\[.*?\]\])/g).map((parte, i) =>
    parte.startsWith('[[') ? (
      <span key={i} className="hl !text-brand rounded-sm bg-accent px-2 [background-image:none]">
        {parte.slice(2, -2)}
      </span>
    ) : (
      parte
    ),
  )
}

export function Hero({ ajustes, secciones }: { ajustes: Ajustes; secciones: SeccionConfig[] }) {
  const imagen = medio(ajustes.heroImagen)
  const video = medio(ajustes.heroVideo)
  const hayNiveles = secciones.some((s) => s.tipo === 'niveles' && s.visible)
  const fondo = urlMedio(imagen, 'hero') || '/og-default.jpg'

  return (
    <section
      id="hero"
      aria-labelledby="hero-titulo"
      className="on-dark relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-brand text-white"
    >
      <Image
        src={fondo}
        alt={imagen?.alt || ''}
        fill
        priority
        fetchPriority="high"
        quality={70}
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {video?.url && <HeroVideo src={video.url} poster={fondo} />}
      {/* Degradado para asegurar contraste del texto sobre la foto */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgb(8_26_48/0.94)_0%,rgb(8_26_48/0.78)_45%,rgb(8_26_48/0.35)_100%)]"
      />
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="anim-in inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
          <IconBall width={18} height={18} className="ball-bounce text-accent" />
          {ajustes.heroEtiqueta || 'Academia de Tenis & Torneos'}
        </p>

        <h1
          id="hero-titulo"
          className="anim-in anim-in-2 mt-5 max-w-3xl text-[2.6rem] font-extrabold leading-[1.04] !text-white sm:text-6xl md:text-7xl"
        >
          {conResaltado(ajustes.heroTitular)}
        </h1>

        <p className="anim-in anim-in-3 mt-6 max-w-xl text-lg text-white/85 md:text-xl">{ajustes.heroSubtitulo}</p>

        <div className="anim-in anim-in-4 mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href={whatsappUrl(ajustes)}
            target="_blank"
            rel="noopener noreferrer"
            data-event="whatsapp_click"
            data-label="hero"
            className="btn btn-primary !px-8 !py-4 text-lg"
          >
            <IconWhatsApp width={24} height={24} />
            {ajustes.heroCtaTexto || 'Reserva tu clase de prueba'}
          </a>
          {hayNiveles && (
            <a href="#niveles" className="btn btn-ghost text-white">
              Ver horarios <IconArrow width={20} height={20} />
            </a>
          )}
        </div>

        <p className="anim-in anim-in-4 mt-8 flex items-center gap-2 text-sm text-white/75">
          <IconPin width={18} height={18} className="text-accent" /> {ajustes.direccion}
        </p>
      </div>
    </section>
  )
}
