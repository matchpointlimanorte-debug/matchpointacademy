import type { Config } from '@/payload-types'

/** Tipos cómodos derivados de los generados por Payload (independientes de cómo se nombren las interfaces). */
export type Collections = Config['collections']
export type Nivel = Collections['niveles']
export type Entrenador = Collections['entrenadores']
export type FotoGaleria = Collections['galeria']
export type Torneo = Collections['torneos']
export type Testimonio = Collections['testimonios']
export type Plan = Collections['planes']
export type Pregunta = Collections['faq']
export type Medio = Collections['media']
export type Ajustes = Config['globals']['configuracion']
export type OrdenLanding = Config['globals']['landing']
