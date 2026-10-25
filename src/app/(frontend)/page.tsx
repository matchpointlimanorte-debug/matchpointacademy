import React from 'react'

import { Entrenadores } from '@/components/sections/Entrenadores'
import { Faq } from '@/components/sections/Faq'
import { Galeria } from '@/components/sections/Galeria'
import { Hero } from '@/components/sections/Hero'
import { Niveles } from '@/components/sections/Niveles'
import { Planes } from '@/components/sections/Planes'
import { Quienes } from '@/components/sections/Quienes'
import { Testimonios } from '@/components/sections/Testimonios'
import { Torneos } from '@/components/sections/Torneos'
import { Ubicacion } from '@/components/sections/Ubicacion'
import { getSiteData, type SeccionConfig } from '@/lib/data'

export default async function HomePage() {
  const { data } = await getSiteData()
  const { ajustes, secciones, niveles, entrenadores, galeria, torneos, testimonios, planes, faq } = data

  const renderSeccion = (s: SeccionConfig) => {
    if (!s.visible) return null

    switch (s.tipo) {
      case 'hero':
        return <Hero key="hero" ajustes={ajustes} secciones={secciones} />
      case 'quienes':
        return <Quienes key="quienes" ajustes={ajustes} cfg={s} />
      case 'niveles':
        return niveles.length > 0 ? <Niveles key="niveles" niveles={niveles} ajustes={ajustes} cfg={s} /> : null
      case 'entrenadores':
        return entrenadores.length > 0 ? <Entrenadores key="entrenadores" entrenadores={entrenadores} cfg={s} /> : null
      case 'galeria':
        return galeria.length > 0 ? <Galeria key="galeria" fotos={galeria} cfg={s} /> : null
      case 'torneos':
        return <Torneos key="torneos" torneos={torneos} ajustes={ajustes} cfg={s} />
      case 'planes':
        return planes.length > 0 ? <Planes key="planes" planes={planes} ajustes={ajustes} cfg={s} /> : null
      case 'testimonios':
        return testimonios.length > 0 ? <Testimonios key="testimonios" testimonios={testimonios} cfg={s} /> : null
      case 'faq':
        return faq.length > 0 ? <Faq key="faq" preguntas={faq} cfg={s} /> : null
      case 'ubicacion':
        return <Ubicacion key="ubicacion" ajustes={ajustes} cfg={s} />
      default:
        return null
    }
  }

  return <main>{secciones.map(renderSeccion)}</main>
}
