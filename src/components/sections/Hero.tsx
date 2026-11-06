import Image from 'next/image'
import type { ReactNode } from 'react'

import { HeroVideo } from '@/components/sections/HeroVideo'
import { IconArrow, IconPin, IconWhatsApp } from '@/components/ui/Icons'
import type { SeccionConfig } from '@/lib/data'
import { medio, urlMedio, whatsappUrl } from '@/lib/site'
import type { Ajustes } from '@/lib/types'

/** Resalta con el marcador amarillo y contraste óptimo el texto entre [[dobles corchetes]]. */
function conResaltado(texto: string): ReactNode[] {
  return texto.split(/(\[\[.*?\]\])/g).map((parte, i) =>
    parte.startsWith('[[') ? (
      <span
        key={i}
        className="inline-block rounded-xl bg-accent px-3.5 py-0.5 font-display font-black text-brand shadow-lg"
      >
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
  const fondo = urlMedio(imagen, 'hero') || '/images/grupo-clase.jpg'

  return (
    <section
      id="hero"
      aria-labelledby="hero-titulo"
      className="on-dark relative isolate flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden bg-brand text-white"
    >
      <Image
        src={fondo}
        alt={imagen?.alt || 'Canchas de tenis MatchPoint Lima Norte'}
        fill
        priority
        fetchPriority="high"
        quality={80}
        sizes="100vw"
        className="-z-20 object-cover object-center"
      />
      {video?.url && <HeroVideo src={video.url} poster={fondo} />}

      {/* Degradado para equilibrar contraste de texto y visibilidad de las canchas */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(105deg,rgb(8_26_48/0.92)_0%,rgb(8_26_48/0.75)_50%,rgb(8_26_48/0.38)_100%)]"
      />
      <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <div className="anim-in inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-brand-dark/75 px-4 py-1.5 text-sm font-semibold text-white shadow-lg backdrop-blur">
              <Image
                src="/images/icono.png"
                alt=""
                width={20}
                height={20}
                className="inline-block object-contain"
              />
              <span>MatchPoint Lima Norte &bull; Academia de Tenis &amp; Torneos</span>
            </div>

            <h1
              id="hero-titulo"
              className="anim-in anim-in-2 mt-5 text-4xl font-black leading-[1.08] tracking-tight !text-white sm:text-6xl md:text-7xl"
            >
              <span>{conResaltado(ajustes.heroTitular || 'MatchPoint [[Lima Norte]]')}</span>
              <span className="mt-4 block text-xl font-extrabold text-accent sm:text-2xl drop-shadow-sm tracking-normal">
                {ajustes.heroEtiqueta || 'Academia de Tenis & Torneos'}
              </span>
            </h1>

            <p className="anim-in anim-in-3 mt-4 max-w-xl text-base text-white/95 sm:text-lg md:text-xl leading-relaxed">
              {ajustes.heroSubtitulo ||
                'Aprende, entrena y compite en Fuertes Hoyos, Rímac. Clases para todos los niveles con canchas de arcilla y entrenadores dedicados.'}
            </p>

            <div className="anim-in anim-in-4 mt-8 flex flex-wrap items-center gap-3.5 sm:flex-row">
              <a
                href={whatsappUrl(ajustes)}
                target="_blank"
                rel="noopener noreferrer"
                data-event="whatsapp_click"
                data-label="hero"
                className="btn btn-primary !px-7 !py-3.5 text-base sm:text-lg whitespace-nowrap shadow-xl shadow-accent/25 hover:shadow-accent/40"
              >
                <IconWhatsApp width={22} height={22} />
                {ajustes.heroCtaTexto || 'Reserva tu clase de prueba'}
              </a>
              {hayNiveles && (
                <a href="#niveles" className="btn btn-ghost text-white border border-white/30 hover:bg-white/10 whitespace-nowrap">
                  Ver horarios <IconArrow width={20} height={20} />
                </a>
              )}
            </div>

            <p className="anim-in anim-in-4 mt-7 flex items-center gap-2 text-sm font-medium text-white/80">
              <IconPin width={18} height={18} className="text-accent shrink-0" />
              <span>{ajustes.direccion || 'Fuertes Hoyos, Rímac (entrada por Av. Túpac Amaru con Av. Francisco Pizarro)'}</span>
            </p>
          </div>

          <div className="hidden lg:col-span-5 lg:block">
            <div className="group relative overflow-hidden rounded-3xl border-4 border-white/20 bg-brand/50 p-2 shadow-2xl backdrop-blur-md transition-all duration-300 hover:border-accent/40">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/grupo-clase.jpg"
                  alt="Alumnos y profesores de MatchPoint Lima Norte en cancha de arcilla"
                  fill
                  priority
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3.5 text-white">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
                    <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                    Sede Fuertes Hoyos • Rímac
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[0.7rem] font-semibold text-white/90">
                    Canchas de arcilla
                  </span>
                </div>
                <p className="mt-1.5 font-display text-sm font-bold text-white">
                  Comunidad y Entrenamiento MatchPoint
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

