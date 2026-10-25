import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

import { IconArrow, IconCalendar, IconPin, IconTrophy, IconWhatsApp } from '@/components/ui/Icons'
import { RichText } from '@/components/ui/RichText'
import { getPayloadClient } from '@/lib/payload'
import {
  SITE_URL,
  esTorneoFinalizado,
  fechaTorneo,
  inscripcionTorneo,
  medio,
  urlMedio,
} from '@/lib/site'
import type { Ajustes, Torneo } from '@/lib/types'

type PageProps = {
  params: Promise<{ slug: string }>
}

async function getTorneo(slug: string, draft: boolean): Promise<{ torneo: Torneo; ajustes: Ajustes } | null> {
  const payload = await getPayloadClient()
  const [torneosRes, ajustes] = await Promise.all([
    payload.find({
      collection: 'torneos',
      where: { slug: { equals: slug } },
      draft,
      depth: 2,
      limit: 1,
    }),
    payload.findGlobal({ slug: 'configuracion', draft, depth: 1 }),
  ])

  const torneo = (torneosRes.docs[0] as Torneo) || null
  if (!torneo) return null

  return { torneo, ajustes: ajustes as Ajustes }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'torneos',
      where: { _status: { equals: 'published' } },
      limit: 100,
      pagination: false,
    })
    return docs.map((t) => ({ slug: t.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const data = await getTorneo(slug, draft)
  if (!data) return {}

  const { torneo, ajustes } = data
  const afiche = medio(torneo.afiche)
  const ogImg = urlMedio(afiche, 'hero') || `${SITE_URL}/og-default.jpg`
  const ogUrl = ogImg.startsWith('http') ? ogImg : `${SITE_URL}${ogImg}`

  return {
    title: torneo.titulo,
    description: torneo.resumen || `Detalles e inscripción para ${torneo.titulo} en Match Point Lima Norte.`,
    alternates: {
      canonical: `/torneos/${torneo.slug}`,
    },
    openGraph: {
      title: `${torneo.titulo} | ${ajustes.nombreSitio || 'Match Point Lima Norte'}`,
      description: torneo.resumen || undefined,
      url: `${SITE_URL}/torneos/${torneo.slug}`,
      images: [{ url: ogUrl, width: 1200, height: 630, alt: torneo.titulo }],
    },
  }
}

export default async function TorneoDetailPage({ params }: PageProps) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const data = await getTorneo(slug, draft)
  if (!data) notFound()

  const { torneo, ajustes } = data
  const finalizado = esTorneoFinalizado(torneo)
  const inscripcion = finalizado ? null : inscripcionTorneo(torneo, ajustes)
  const afiche = medio(torneo.afiche)

  // Datos estructurados Schema.org SportsEvent
  const schemaEvent = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: torneo.titulo,
    description: torneo.resumen || undefined,
    startDate: torneo.fechaInicio || undefined,
    endDate: torneo.fechaFin || torneo.fechaInicio || undefined,
    eventStatus: finalizado ? 'https://schema.org/EventCompleted' : 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: torneo.lugar || ajustes.direccion,
      address: {
        '@type': 'PostalAddress',
        streetAddress: ajustes.direccion,
        addressLocality: 'Rímac, Lima',
        addressCountry: 'PE',
      },
    },
    organizer: {
      '@type': 'SportsActivityLocation',
      name: ajustes.nombreSitio,
      url: SITE_URL,
    },
    image: afiche ? urlMedio(afiche, 'hero') : undefined,
  }

  return (
    <div className="py-12 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEvent).replace(/</g, '\\u003c') }}
      />
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <nav aria-label="Miga de pan" className="mb-6 flex items-center gap-2 text-sm text-ink/60">
          <Link href="/" className="hover:text-brand">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/torneos" className="hover:text-brand">
            Torneos
          </Link>
          <span>/</span>
          <span className="font-semibold text-brand truncate max-w-xs">{torneo.titulo}</span>
        </nav>

        <header className="mb-8">
          <span className="eyebrow mb-3">
            {finalizado ? 'Torneo finalizado' : 'Inscripciones abiertas'}
          </span>
          <h1 className="text-3xl font-extrabold sm:text-5xl">{torneo.titulo}</h1>
        </header>

        {afiche && (
          <div className="relative mb-10 aspect-[16/9] w-full overflow-hidden rounded-3xl bg-brand-soft shadow-xl">
            <Image
              src={urlMedio(afiche, 'hero') || ''}
              alt={afiche.alt || torneo.titulo}
              fill
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div className="card mb-10 p-6 md:p-8">
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div className="flex items-start gap-3">
              <IconCalendar width={24} height={24} className="text-court mt-1 shrink-0" />
              <div>
                <strong className="block text-sm font-semibold uppercase tracking-wider text-ink/60">Fecha</strong>
                <span className="text-base font-bold text-brand">{fechaTorneo(torneo)}</span>
              </div>
            </div>

            {torneo.categoria && (
              <div className="flex items-start gap-3">
                <IconTrophy width={24} height={24} className="text-court mt-1 shrink-0" />
                <div>
                  <strong className="block text-sm font-semibold uppercase tracking-wider text-ink/60">Categoría</strong>
                  <span className="text-base font-bold text-brand">{torneo.categoria}</span>
                </div>
              </div>
            )}

            {torneo.lugar && (
              <div className="flex items-start gap-3">
                <IconPin width={24} height={24} className="text-court mt-1 shrink-0" />
                <div>
                  <strong className="block text-sm font-semibold uppercase tracking-wider text-ink/60">Lugar</strong>
                  <span className="text-base font-bold text-brand">{torneo.lugar}</span>
                </div>
              </div>
            )}
          </div>

          {torneo.costo && !finalizado && (
            <div className="mt-6 border-t border-brand/10 pt-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-sm text-ink/60">Inscripción: </span>
                <span className="text-xl font-bold text-brand">{torneo.costo}</span>
              </div>
              {inscripcion && (
                <a
                  href={inscripcion.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <IconWhatsApp width={20} height={20} /> Inscribirme por WhatsApp
                </a>
              )}
            </div>
          )}
        </div>

        {torneo.descripcion && (
          <section className="card mb-10 p-6 md:p-8">
            <h2 className="mb-4 text-2xl font-bold">Información del torneo</h2>
            <RichText content={torneo.descripcion} />
          </section>
        )}

        {finalizado && torneo.resultados && torneo.resultados.length > 0 && (
          <section className="card mb-10 p-6 md:p-8 bg-brand text-white on-dark">
            <h2 className="mb-6 text-2xl font-bold !text-white flex items-center gap-2">
              <IconTrophy width={26} height={26} className="text-accent" />
              Cuadro de Honor y Resultados
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {torneo.resultados.map((r) => (
                <div key={r.id || r.categoria} className="rounded-2xl bg-white/10 p-5">
                  <h3 className="text-lg font-bold !text-accent">{r.categoria}</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {r.campeon && (
                      <li className="flex items-center gap-2 font-semibold">
                        <span aria-hidden="true">🥇</span> Campeón/a: {r.campeon}
                      </li>
                    )}
                    {r.subcampeon && (
                      <li className="flex items-center gap-2 text-white/90">
                        <span aria-hidden="true">🥈</span> Subcampeón/a: {r.subcampeon}
                      </li>
                    )}
                    {r.tercero && (
                      <li className="flex items-center gap-2 text-white/80">
                        <span aria-hidden="true">🥉</span> Tercer puesto: {r.tercero}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {torneo.fotos && torneo.fotos.length > 0 && (
          <section className="card mb-10 p-6 md:p-8">
            <h2 className="mb-6 text-2xl font-bold">Fotos del torneo</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {torneo.fotos.map((item, idx) => {
                const fotoMedio = medio(item.imagen)
                if (!fotoMedio) return null
                return (
                  <div key={item.id || idx} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-soft">
                    <Image
                      src={urlMedio(fotoMedio, 'card') || ''}
                      alt={fotoMedio.alt || `Foto de ${torneo.titulo}`}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <div className="flex justify-between items-center pt-6">
          <Link href="/torneos" className="btn btn-ghost text-brand">
            <IconArrow width={18} height={18} className="rotate-180" /> Volver a torneos
          </Link>
          <a
            href={`https://wa.me/${(ajustes.whatsappNumero || '51916727470').replace(/\D/g, '')}?text=${encodeURIComponent(
              `Hola, tengo una consulta sobre el torneo "${torneo.titulo}".`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <IconWhatsApp width={20} height={20} /> Consultar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
