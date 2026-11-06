import { SITE_URL, medio, urlMedio } from '@/lib/site'
import type { Ajustes, Nivel, Testimonio } from '@/lib/types'

const DIAS_SCHEMA: Record<string, string> = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miercoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
  sabado: 'Saturday',
  domingo: 'Sunday',
}

const DISTRITOS_COBERTURA = [
  'Rímac, Lima, Perú',
  'Lima Norte, Lima, Perú',
  'Independencia, Lima, Perú',
  'Los Olivos, Lima, Perú',
  'San Martín de Porres, Lima, Perú',
  'Comas, Lima, Perú',
  'Carabayllo, Lima, Perú',
]

/** Datos estructurados schema.org (WebSite + SportsActivityLocation) para posicionamiento local en Google. */
export function JsonLd({
  ajustes,
  niveles,
  testimonios = [],
}: {
  ajustes: Ajustes
  niveles: Nivel[]
  testimonios?: Testimonio[]
}) {
  const imagen = urlMedio(medio(ajustes.ogImagen) || medio(ajustes.heroImagen), 'hero')
  const absoluta = (u: string | null) =>
    u ? (u.startsWith('http') ? u : `${SITE_URL}${u}`) : `${SITE_URL}/og-default.jpg`

  const openingHoursSpecification = niveles.flatMap((n) =>
    (n.horarios || []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DIAS_SCHEMA[h.dia],
      opens: h.horaInicio.padStart(5, '0'),
      closes: h.horaFin.padStart(5, '0'),
    })),
  )

  const calificaciones = testimonios.map((t) => t.estrellas || 5).filter((n) => n >= 1 && n <= 5)
  const promedioEstrellas =
    calificaciones.length > 0
      ? Number((calificaciones.reduce((acc, v) => acc + v, 0) / calificaciones.length).toFixed(1))
      : undefined

  const nombreAcademia = ajustes.nombreSitio || 'Match Point Lima Norte'
  const descripcionAcademia =
    ajustes.seoDescripcion ||
    ajustes.heroSubtitulo ||
    'Academia de tenis en Lima Norte (Fuertes Hoyos, Rímac). Clases para principiantes, intermedios y torneos en canchas de arcilla.'

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: nombreAcademia,
        alternateName: ['MatchPoint Lima Norte', 'Academia de Tenis Match Point Lima Norte'],
        description: descripcionAcademia,
        inLanguage: 'es-PE',
      },
      {
        '@type': ['SportsActivityLocation', 'SportsClub', 'LocalBusiness'],
        '@id': `${SITE_URL}/#organization`,
        name: nombreAcademia,
        alternateName: 'MatchPoint Lima Norte',
        description: descripcionAcademia,
        url: SITE_URL,
        image: absoluta(imagen),
        logo: `${SITE_URL}/images/logo.png`,
        sport: 'Tenis',
        priceRange: '$$',
        currenciesAccepted: 'PEN',
        telephone: ajustes.telefonos?.[0]
          ? `+51${ajustes.telefonos[0].numero.replace(/\D/g, '').replace(/^51/, '')}`
          : `+${(ajustes.whatsappNumero || '51916727470').replace(/\D/g, '')}`,
        email: ajustes.email || undefined,
        hasMap:
          ajustes.mapaEnlace ||
          `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            ajustes.direccion || 'Fuertes Hoyos, Rímac, Lima, Perú',
          )}`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: ajustes.direccion || 'Fuertes Hoyos, Rímac',
          addressLocality: 'Rímac',
          addressRegion: 'Lima',
          addressCountry: 'PE',
        },
        geo:
          ajustes.latitud != null && ajustes.longitud != null
            ? { '@type': 'GeoCoordinates', latitude: ajustes.latitud, longitude: ajustes.longitud }
            : { '@type': 'GeoCoordinates', latitude: -12.0305, longitude: -77.0308 },
        openingHoursSpecification: openingHoursSpecification.length ? openingHoursSpecification : undefined,
        sameAs: [ajustes.instagram, ajustes.tiktok, ajustes.facebook, ajustes.youtube].filter(Boolean),
        areaServed: DISTRITOS_COBERTURA.map((place) => ({
          '@type': 'Place',
          name: place,
        })),
        hasOfferCatalog:
          niveles.length > 0
            ? {
                '@type': 'OfferCatalog',
                name: 'Clases y Programas de Tenis',
                itemListElement: niveles.map((n) => ({
                  '@type': 'Offer',
                  itemOffered: {
                    '@type': 'Course',
                    name: `Clases de Tenis — Nivel ${n.nombre}`,
                    description: n.descripcion,
                    provider: {
                      '@type': 'SportsActivityLocation',
                      name: nombreAcademia,
                      sameAs: SITE_URL,
                    },
                  },
                })),
              }
            : undefined,
        aggregateRating:
          promedioEstrellas && calificaciones.length > 0
            ? {
                '@type': 'AggregateRating',
                ratingValue: promedioEstrellas,
                bestRating: 5,
                worstRating: 1,
                reviewCount: calificaciones.length,
              }
            : undefined,
        review:
          testimonios.length > 0
            ? testimonios.slice(0, 6).map((t) => ({
                '@type': 'Review',
                author: {
                  '@type': 'Person',
                  name: t.nombre,
                },
                reviewBody: t.texto,
                reviewRating: {
                  '@type': 'Rating',
                  ratingValue: t.estrellas || 5,
                  bestRating: 5,
                  worstRating: 1,
                },
              }))
            : undefined,
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Contenido propio y serializado: se escapa "<" para evitar cierre de etiqueta.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
