import type { Ajustes, Medio, Torneo } from './types'

/** URL pública del sitio (sin "/" final). Cambia con NEXT_PUBLIC_SITE_URL al conectar el dominio. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.RAILWAY_PUBLIC_DOMAIN ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}` : '') ||
  'http://localhost:3000'
).replace(/\/$/, '')

/** Devuelve el objeto Medio si la relación viene poblada (depth ≥ 1). */
export function medio(value: unknown): Medio | null {
  return value && typeof value === 'object' && 'url' in (value as object) ? (value as Medio) : null
}

/** URL de la variante de tamaño pedida (o la original). */
export function urlMedio(m: Medio | null, tamano?: 'thumb' | 'card' | 'hero'): string | null {
  if (!m) return null
  // Si es un archivo remoto en S3 / Cloudflare R2, usar la variante remota o la URL original
  if (m.url && m.url.startsWith('http') && !m.url.includes('localhost:3000')) {
    const variante = tamano ? m.sizes?.[tamano]?.url : null
    return variante || m.url
  }
  // Si tiene nombre de archivo, servimos directamente desde /images/ para máxima velocidad y evitar errores de variantes
  if (m.filename) {
    return `/images/${m.filename}`
  }
  const variante = tamano ? m.sizes?.[tamano]?.url : null
  return variante || m.url || null
}

/** Enlace de WhatsApp con mensaje prellenado. */
export function whatsappUrl(ajustes: Pick<Ajustes, 'whatsappNumero' | 'whatsappMensaje'>, mensaje?: string): string {
  const numero = (ajustes.whatsappNumero || '51916727470').replace(/\D/g, '')
  const texto = mensaje || ajustes.whatsappMensaje || 'Hola, quiero reservar una clase de prueba.'
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`
}

const DIAS: Record<string, string> = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábados',
  domingo: 'Domingos',
}
export const nombreDia = (v: string) => DIAS[v] ?? v

/** "09:00" -> "9:00 a. m."  /  "14:30" -> "2:30 p. m." */
export function formatoHora(hhmm: string): string {
  const [h, m] = hhmm.trim().split(':').map(Number)
  const sufijo = h >= 12 ? 'p. m.' : 'a. m.'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${String(m).padStart(2, '0')} ${sufijo}`
}

/** Rango legible: "9:00 – 10:30 a. m." */
export function rangoHoras(inicio: string, fin: string): string {
  const a = formatoHora(inicio)
  const b = formatoHora(fin)
  const sa = a.slice(-4)
  const sb = b.slice(-4)
  return sa === sb ? `${a.slice(0, -5)} – ${b}` : `${a} – ${b}`
}

const FORMATO_FECHA = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC', // las fechas se guardan como día completo
})

/** "2027-03-14T..." -> "14 de marzo de 2027" */
export function formatoFecha(iso?: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? null : FORMATO_FECHA.format(d).replace(' de ', ' de ')
}

/** Texto de fecha para un torneo (rango, fecha única o texto libre). */
export function fechaTorneo(t: Pick<Torneo, 'fechaInicio' | 'fechaFin' | 'fechaTexto'>): string {
  const ini = formatoFecha(t.fechaInicio)
  const fin = formatoFecha(t.fechaFin)
  if (ini && fin && ini !== fin) return `${ini} al ${fin}`
  return ini || t.fechaTexto || 'Próximamente'
}

/** Un torneo "próximo" pasa solo a resultados cuando su fecha ya terminó. */
export function esTorneoFinalizado(t: Pick<Torneo, 'estado' | 'fechaInicio' | 'fechaFin'>): boolean {
  if (t.estado === 'finalizado') return true
  const ref = t.fechaFin || t.fechaInicio
  if (!ref) return false
  const fin = new Date(ref)
  fin.setUTCHours(23, 59, 59, 999)
  return fin.getTime() < Date.now()
}

/** Enlace de inscripción de un torneo según su configuración. */
export function inscripcionTorneo(
  t: Pick<Torneo, 'titulo' | 'inscripcionTipo' | 'inscripcionUrl' | 'mensajeWhatsApp'>,
  ajustes: Ajustes,
): { href: string; externo: boolean } | null {
  if (t.inscripcionTipo === 'cerrada') return null
  if (t.inscripcionTipo === 'enlace' && t.inscripcionUrl) return { href: t.inscripcionUrl, externo: true }
  return {
    href: whatsappUrl(ajustes, t.mensajeWhatsApp || `Hola, quiero inscribirme en el torneo "${t.titulo}".`),
    externo: true,
  }
}

/** URL del mapa embebido: la del admin o una generada desde la dirección. */
export function mapaEmbed(ajustes: Ajustes): string {
  if (ajustes.mapaEmbedUrl?.startsWith('http')) return ajustes.mapaEmbedUrl
  const q = encodeURIComponent(ajustes.direccion || 'Fuertes Hoyos, Rímac, Lima, Perú')
  return `https://www.google.com/maps?q=${q}&hl=es&z=16&output=embed`
}

/** Teléfono en formato enlace (tel:+51916727470). */
export const telHref = (n: string) => `tel:+51${n.replace(/\D/g, '').replace(/^51/, '')}`

/** Divide un texto en párrafos (línea en blanco = párrafo nuevo). */
export const parrafos = (t?: string | null): string[] =>
  (t || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
