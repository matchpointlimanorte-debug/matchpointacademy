import { unstable_cache } from 'next/cache'
import { draftMode } from 'next/headers'

import { SECCIONES_POR_DEFECTO } from '@/globals/Landing'
import { SITE_CACHE_TAG } from '@/hooks/revalidate'
import { getPayloadClient } from './payload'
import type {
  Ajustes,
  Entrenador,
  FotoGaleria,
  Nivel,
  Plan,
  Pregunta,
  Testimonio,
  Torneo,
} from './types'

export type SeccionConfig = {
  tipo: string
  visible: boolean
  etiquetaMenu?: string | null
  titulo?: string | null
  subtitulo?: string | null
}

export type SiteData = {
  ajustes: Ajustes
  secciones: SeccionConfig[]
  niveles: Nivel[]
  entrenadores: Entrenador[]
  galeria: FotoGaleria[]
  torneos: Torneo[]
  testimonios: Testimonio[]
  planes: Plan[]
  faq: Pregunta[]
}

/** Valores de respaldo para que la web nunca se rompa si la base de datos está vacía. */
const AJUSTES_RESPALDO = {
  nombreSitio: 'Match Point Lima Norte',
  heroTitular: 'Aprende tenis en Lima Norte',
  heroSubtitulo: 'Clases para todos los niveles. Reserva tu clase de prueba.',
  heroCtaTexto: 'Reserva tu clase de prueba',
  quienesTexto: '',
  whatsappNumero: '51916727470',
  direccion: 'Fuertes Hoyos, Rímac, Lima, Perú',
} as unknown as Ajustes

/** Consulta todo el contenido público. Se usa con caché (visitantes) o sin caché (vista previa). */
async function fetchSiteData(draft: boolean): Promise<SiteData> {
  const payload = await getPayloadClient()
  const common = { draft, depth: 1, limit: 100, pagination: false } as const
  // En vista previa Payload devuelve la versión más reciente (borrador).
  const [ajustes, landing, niveles, entrenadores, galeria, torneos, testimonios, planes, faq] =
    await Promise.all([
      payload.findGlobal({ slug: 'configuracion', draft, depth: 2 }),
      payload.findGlobal({ slug: 'landing', draft, depth: 0 }),
      payload.find({ collection: 'niveles', sort: '_order', ...common }),
      payload.find({ collection: 'entrenadores', sort: '_order', ...common }),
      payload.find({ collection: 'galeria', sort: '_order', ...common }),
      payload.find({ collection: 'torneos', sort: 'fechaInicio', ...common }),
      payload.find({ collection: 'testimonios', sort: '_order', ...common }),
      payload.find({ collection: 'planes', sort: '_order', ...common }),
      payload.find({ collection: 'faq', sort: '_order', ...common }),
    ])

  const secciones =
    landing?.secciones && landing.secciones.length > 0
      ? (landing.secciones as SeccionConfig[])
      : (SECCIONES_POR_DEFECTO as unknown as SeccionConfig[])

  return {
    ajustes: ajustes && ajustes.heroTitular ? ajustes : { ...AJUSTES_RESPALDO, ...ajustes },
    secciones,
    niveles: niveles.docs as Nivel[],
    entrenadores: entrenadores.docs as Entrenador[],
    galeria: galeria.docs as FotoGaleria[],
    torneos: torneos.docs as Torneo[],
    testimonios: testimonios.docs as Testimonio[],
    planes: planes.docs as Plan[],
    faq: faq.docs as Pregunta[],
  }
}

/**
 * Datos cacheados: se reutilizan hasta que alguien publica en el admin
 * (revalidateTag) o pasa 1 hora. Así la web responde sin tocar la base de datos.
 */
const getCachedSiteData = unstable_cache(() => fetchSiteData(false), ['site-data'], {
  tags: [SITE_CACHE_TAG],
  revalidate: 3600,
})

/** Punto de entrada: respeta el modo vista previa (borradores) del admin. */
export async function getSiteData(): Promise<{ data: SiteData; preview: boolean }> {
  const { isEnabled } = await draftMode()
  if (isEnabled) return { data: await fetchSiteData(true), preview: true }
  return { data: await getCachedSiteData(), preview: false }
}
