import { SITE_URL, medio, urlMedio } from '@/lib/site'
import type { Ajustes, Nivel } from '@/lib/types'

const DIAS_SCHEMA: Record<string, string> = {
  lunes: 'Monday',
  martes: 'Tuesday',
  miercoles: 'Wednesday',
  jueves: 'Thursday',
  viernes: 'Friday',
  sabado: 'Saturday',
  domingo: 'Sunday',
}

/** Datos estructurados schema.org "SportsActivityLocation" para Google. */
export function JsonLd({ ajustes, niveles }: { ajustes: Ajustes; niveles: Nivel[] }) {
  const imagen = urlMedio(medio(ajustes.ogImagen) || medio(ajustes.heroImagen), 'hero')
  const absoluta = (u: string | null) => (u ? (u.startsWith('http') ? u : `${SITE_URL}${u}`) : `${SITE_URL}/og-default.jpg`)

  const openingHoursSpecification = niveles.flatMap((n) =>
    (n.horarios || []).map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DIAS_SCHEMA[h.dia],
      opens: h.horaInicio.padStart(5, '0'),
      closes: h.horaFin.padStart(5, '0'),
    })),
  )

  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: ajustes.nombreSitio,
    description: ajustes.seoDescripcion || ajustes.heroSubtitulo,
    url: SITE_URL,
    image: absoluta(imagen),
    logo: `${SITE_URL}/logo.png`,
    sport: 'Tenis',
    telephone: ajustes.telefonos?.[0] ? `+51${ajustes.telefonos[0].numero.replace(/\D/g, '')}` : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ajustes.direccion,
      addressLocality: 'Rímac, Lima',
      addressRegion: 'Lima',
      addressCountry: 'PE',
    },
    geo:
      ajustes.latitud != null && ajustes.longitud != null
        ? { '@type': 'GeoCoordinates', latitude: ajustes.latitud, longitude: ajustes.longitud }
        : undefined,
    openingHoursSpecification: openingHoursSpecification.length ? openingHoursSpecification : undefined,
    sameAs: [ajustes.instagram, ajustes.tiktok, ajustes.facebook, ajustes.youtube].filter(Boolean),
    areaServed: 'Lima Norte, Perú',
  }

  return (
    <script
      type="application/ld+json"
      // Contenido propio y serializado: se escapa "<" para evitar cierre de etiqueta.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
